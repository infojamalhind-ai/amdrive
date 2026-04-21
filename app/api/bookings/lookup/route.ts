import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

function normalizePhoneLast9(value: unknown) {
  const digits = String(value ?? "").replace(/\D/g, "");
  return digits.slice(-9);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const bookingNumber = String(
      body.bookingNumber ||
        body.booking_number ||
        body.bookingId ||
        body.booking_id ||
        ""
    ).trim();

    const mobileNumber = String(
      body.mobileNumber ||
        body.mobile_number ||
        body.customerPhone ||
        body.customer_phone ||
        ""
    ).trim();

    if (!bookingNumber || !mobileNumber) {
      return NextResponse.json(
        { error: "Booking number and mobile number are required" },
        { status: 400 }
      );
    }

    const normalizedLookupPhone = normalizePhoneLast9(mobileNumber);

    if (!normalizedLookupPhone) {
      return NextResponse.json(
        { error: "Please enter a valid mobile number" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: booking, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("booking_number", bookingNumber)
      .single();

    if (error || !booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    const normalizedSavedPhone = normalizePhoneLast9(booking.customer_phone);

    if (!normalizedSavedPhone || normalizedSavedPhone !== normalizedLookupPhone) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    const { data: charges, error: chargesError } = await supabase
      .from("booking_charges")
      .select("*")
      .eq("booking_id", booking.id)
      .order("created_at", { ascending: false });

    if (chargesError) {
      console.error("Charges fetch error:", chargesError);
      return NextResponse.json(
        { error: "Failed to fetch booking charges" },
        { status: 500 }
      );
    }

    const unpaidCharges = (charges || []).filter(
      (charge) => charge.status === "unpaid"
    );

    const paidCharges = (charges || []).filter(
      (charge) => charge.status === "paid"
    );

    const unpaidChargesTotal = unpaidCharges.reduce(
      (sum, charge) => sum + Number(charge.amount || 0),
      0
    );

    const paidChargesTotal = paidCharges.reduce(
      (sum, charge) => sum + Number(charge.amount || 0),
      0
    );

    return NextResponse.json({
      booking,
      charges: charges || [],
      unpaidChargesTotal,
      paidChargesTotal,
    });
  } catch (error) {
    console.error("Booking lookup error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
