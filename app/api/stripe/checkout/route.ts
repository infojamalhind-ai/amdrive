import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseAdmin } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const bookingId = body.bookingId;
    const paymentType = body.paymentType || "advance";

    if (!bookingId) {
      return NextResponse.json(
        { error: "bookingId is required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("*")
      .eq("booking_number", bookingId)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    let amount = 0;

    if (paymentType === "extra_charges") {
      const { data: charges, error: chargesError } = await supabase
        .from("booking_charges")
        .select("amount, status")
        .eq("booking_id", booking.id)
        .eq("status", "unpaid");

      if (chargesError) {
        return NextResponse.json(
          { error: "Failed to load extra charges" },
          { status: 500 }
        );
      }

      if (!charges || charges.length === 0) {
        return NextResponse.json(
          { error: "No unpaid extra charges found" },
          { status: 400 }
        );
      }

      amount = charges.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    } else if (paymentType === "remaining") {
      amount = Number(booking.pending_amount || 0);
    } else if (paymentType === "full") {
      amount = Number(booking.total_price || 0);
    } else {
      amount = 50;
    }

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid payment amount" },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const bookingType = booking.booking_type || "standard";
    const monthlyPlan = booking.monthly_km_plan || booking.monthly_plan || "";

    const productName =
      paymentType === "extra_charges"
        ? `Extra Charges - ${booking.car_name}`
        : bookingType === "monthly"
        ? `${booking.car_name} Monthly Booking${monthlyPlan ? ` - ${monthlyPlan}` : ""}`
        : `${booking.car_name} Booking Payment`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "aed",
            product_data: {
              name: productName,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/my-booking?booking=${booking.booking_number}&phone=${booking.customer_phone}&payment=cancelled`,
      metadata: {
        booking_id: booking.booking_number,
        payment_type: paymentType,
        booking_type: bookingType,
        amount: amount.toString(),
        customer_name: booking.customer_name || "",
        customer_phone: booking.customer_phone || "",
        car_name: booking.car_name || "",
        monthly_km_plan: monthlyPlan,
      },
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create Stripe checkout session" },
      { status: 500 }
    );
  }
}