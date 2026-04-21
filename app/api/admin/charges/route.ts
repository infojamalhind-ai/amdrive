import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

const ALLOWED_CHARGE_TYPES = [
  "salik",
  "fine",
  "extra_rent",
  "delivery_charge",
  "collection_charge",
  "other",
] as const;

type ChargeType = (typeof ALLOWED_CHARGE_TYPES)[number];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const booking_id = String(body.booking_id || "").trim();
    const charge_type = String(body.charge_type || "").trim() as ChargeType;
    const title = String(body.title || "").trim();
    const description =
      body.description !== undefined && body.description !== null
        ? String(body.description).trim()
        : null;
    const amount = Number(body.amount);

    if (!booking_id) {
      return NextResponse.json(
        { error: "booking_id is required" },
        { status: 400 }
      );
    }

    if (!title) {
      return NextResponse.json(
        { error: "title is required" },
        { status: 400 }
      );
    }

    if (!ALLOWED_CHARGE_TYPES.includes(charge_type)) {
      return NextResponse.json(
        { error: "Invalid charge_type" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "amount must be greater than 0" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("id, booking_number")
      .eq("id", booking_id)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: "Booking not found for booking_id" },
        { status: 404 }
      );
    }

    const { data: charge, error: insertError } = await supabase
      .from("booking_charges")
      .insert({
        booking_id,
        charge_type,
        title,
        description,
        amount,
        status: "unpaid",
      })
      .select("*")
      .single();

    if (insertError) {
      console.error("Charge insert error:", insertError);
      return NextResponse.json(
        { error: insertError.message || "Failed to add charge" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Charge added successfully",
      charge,
    });
  } catch (error) {
    console.error("POST /api/admin/charges error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}