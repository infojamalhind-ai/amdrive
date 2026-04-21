import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

type MonthlyPlan = {
  km: string;
  price: number;
};

function safeNumber(value: unknown) {
  const num = Number(value ?? 0);
  return Number.isFinite(num) ? num : 0;
}

function normalizePlanValue(value: unknown) {
  return String(value ?? "")
    .replace(/\s*km/i, "")
    .trim()
    .toLowerCase();
}

function getDeliveryFee(location: string) {
  const normalized = String(location || "").trim().toLowerCase();

  if (
    normalized.includes("self pickup") ||
    normalized.includes("self-pickup") ||
    normalized.includes("self pickup from sharjah office")
  ) {
    return 0;
  }

  if (normalized === "ajman") return 30;
  if (normalized === "sharjah") return 35;
  if (normalized === "dubai north") return 50;
  if (normalized === "dubai south") return 80;
  if (normalized === "umm al quwain") return 50;
  if (normalized === "umm-al-quwain") return 50;

  return 0;
}

function calculateTotalDays(pickupDate: string, dropoffDate: string) {
  if (!pickupDate || !dropoffDate) return 0;

  const start = new Date(`${pickupDate}T00:00:00`);
  const end = new Date(`${dropoffDate}T00:00:00`);

  const diffTime = end.getTime() - start.getTime();
  let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) diffDays = 1;

  return diffDays;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = getSupabaseAdmin();

    if (!body.car_slug) {
      return NextResponse.json(
        { error: "car_slug is required" },
        { status: 400 }
      );
    }

    const { data: car, error: carError } = await supabase
      .from("cars")
      .select("*")
      .eq("slug", body.car_slug)
      .single();

    if (carError || !car) {
      console.error("Cars fetch error:", carError);
      return NextResponse.json(
        { error: "Selected car was not found" },
        { status: 404 }
      );
    }

    if (!car.is_available || Number(car.stock || 0) <= 0) {
      return NextResponse.json(
        { error: `${car.name} is currently not available` },
        { status: 400 }
      );
    }

    const bookingType = body.booking_type || "standard";
    const createdFrom = body.created_from || "website";
    const paymentOption = body.payment_option || "advance";

    let totalDays = 0;
    let pricingType = "daily";
    let basePrice = 0;
    let monthlyKmPlan: string | null = null;
    let monthlyPrice = 0;
    const dailyPrice = safeNumber(car.daily_price);
    const weeklyPrice = safeNumber(car.weekly_price);

    if (bookingType === "monthly") {
      totalDays = 30;
      pricingType = "monthly";

      const monthlyPlans: MonthlyPlan[] = Array.isArray(car.monthly_plans)
        ? car.monthly_plans
        : [];

      const requestedPlan = normalizePlanValue(body.monthly_km_plan);
      const matchedPlan =
        monthlyPlans.find(
          (plan) => normalizePlanValue(plan.km) === requestedPlan
        ) || monthlyPlans[0];

      if (!matchedPlan) {
        return NextResponse.json(
          { error: "Monthly plan not found for this car" },
          { status: 400 }
        );
      }

      monthlyKmPlan = matchedPlan.km;
      monthlyPrice = safeNumber(matchedPlan.price);
      basePrice = monthlyPrice;
    } else {
      const pickupDate = String(body.pickup_date || "");
      const dropoffDate = String(body.dropoff_date || "");

      totalDays = calculateTotalDays(pickupDate, dropoffDate);

      if (totalDays < Number(car.minimum_days || 1)) {
        return NextResponse.json(
          {
            error: `Minimum booking for ${car.name} is ${car.minimum_days} day(s)`,
          },
          { status: 400 }
        );
      }

      if (totalDays >= 30) {
        pricingType = "monthly";
        monthlyPrice = safeNumber(car.monthly_price);
        basePrice = Math.ceil(totalDays / 30) * monthlyPrice;
      } else if (totalDays >= 7) {
        pricingType = "weekly";
        basePrice = Math.ceil(totalDays / 7) * weeklyPrice;
      } else {
        pricingType = "daily";
        basePrice = totalDays * dailyPrice;
      }
    }

    const pickupLocation = String(body.pickup_location || "");
    const dropoffLocation = String(body.dropoff_location || "");
    const pickupFee = getDeliveryFee(pickupLocation);
    const dropoffFee = getDeliveryFee(dropoffLocation);

    let depositType = String(body.deposit_type || "none");
    let noDepositFee = 0;
    let refundableDepositAmount = 0;

    if (bookingType === "monthly") {
      depositType = "monthly_no_deposit";
      noDepositFee = 0;
    } else if (depositType === "no_deposit" && car.allow_no_deposit) {
      noDepositFee = safeNumber(car.no_deposit_fee);
    } else if (depositType === "with_deposit") {
      noDepositFee = 0;
      refundableDepositAmount = 1000;
    } else if (car.allow_no_deposit) {
      depositType = "no_deposit";
      noDepositFee = safeNumber(car.no_deposit_fee);
    } else if (car.show_refundable_deposit) {
      depositType = "with_deposit";
      noDepositFee = 0;
      refundableDepositAmount = 1000;
    } else {
      depositType = "none";
      noDepositFee = 0;
    }

    const totalPrice =
      basePrice +
      pickupFee +
      dropoffFee +
      noDepositFee +
      refundableDepositAmount;

    let advancePaid = 0;
    let pendingAmount = totalPrice;
    let paymentStatus = "unpaid";

    if (createdFrom !== "admin") {
      advancePaid =
        paymentOption === "full" ? totalPrice : Math.min(50, totalPrice);

      pendingAmount =
        totalPrice > advancePaid ? totalPrice - advancePaid : 0;

      paymentStatus =
        paymentOption === "full"
          ? "paid"
          : advancePaid > 0
          ? "advance_paid"
          : "unpaid";
    }

    const { count, error: countError } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true });

    if (countError) {
      console.error("Supabase count error:", countError);
      return NextResponse.json(
        {
          error: "Failed to generate booking number",
          details: countError.message,
        },
        { status: 500 }
      );
    }

    const bookingNumber = `AMJ-${(count ?? 0) + 1001}`;

    const bookingData = {
      booking_number: bookingNumber,

      car_slug: car.slug,
      car_name: car.name,

      customer_name: body.customer_name,
      customer_phone: body.customer_phone,
      customer_email: body.customer_email || null,

      pickup_location: pickupLocation,
      dropoff_location: dropoffLocation,

      pickup_date: body.pickup_date,
      dropoff_date:
        bookingType === "monthly" ? body.pickup_date : body.dropoff_date,
      pickup_time: body.pickup_time,
      dropoff_time: body.dropoff_time,

      total_days: totalDays,
      pricing_type: pricingType,

      daily_price: dailyPrice,
      weekly_price: weeklyPrice,
      monthly_price:
        bookingType === "monthly"
          ? monthlyPrice
          : safeNumber(car.monthly_price),

      base_price: basePrice,
      pickup_fee: pickupFee,
      dropoff_fee: dropoffFee,
      no_deposit_fee: noDepositFee,
      total_price: totalPrice,

      advance_paid: advancePaid,
      pending_amount: pendingAmount,

      deposit_type: depositType,
      status: body.status || "pending",
      payment_status: body.payment_status || paymentStatus,

      booking_type: bookingType,
      monthly_km_plan: monthlyKmPlan,
      created_from: createdFrom,
      notes: body.notes || null,
    };

    const { data, error } = await supabase
      .from("bookings")
      .insert([bookingData])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        {
          error: "Failed to save booking",
          details: error.message,
          hint: error.hint ?? null,
          code: error.code ?? null,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Booking saved successfully",
        booking: data,
        bookingId: data.id,
        bookingNumber: data.booking_number,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking API error:", error);

    return NextResponse.json(
      {
        error: "Something went wrong while saving booking",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error);
      return NextResponse.json(
        {
          error: "Failed to fetch bookings",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ bookings: data || [] }, { status: 200 });
  } catch (error) {
    console.error("Bookings GET API error:", error);

    return NextResponse.json(
      {
        error: "Something went wrong while fetching bookings",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
