import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const action = body.action;
    const status = body.status;
    const paymentStatus = body.payment_status;

    const supabase = getSupabaseAdmin();

    if (action === "mark_cash_received") {
      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .select("pending_amount, remaining_paid")
        .eq("id", id)
        .single();

      if (bookingError || !booking) {
        return NextResponse.json(
          { error: "Booking not found" },
          { status: 404 }
        );
      }

      const pendingAmount = Math.max(Number(booking.pending_amount || 0), 0);
      const existingRemainingPaid = Math.max(
        Number(booking.remaining_paid || 0),
        0
      );

      if (pendingAmount <= 0) {
        return NextResponse.json(
          { error: "This booking has no pending balance" },
          { status: 400 }
        );
      }

      const { data: updatedBooking, error: updateError } = await supabase
        .from("bookings")
        .update({
          remaining_paid: existingRemainingPaid + pendingAmount,
          pending_amount: 0,
          payment_status: "paid",
        })
        .eq("id", id)
        .select("*")
        .single();

      if (updateError) {
        return NextResponse.json(
          { error: updateError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        booking: updatedBooking,
        cash_received: pendingAmount,
      });
    }

    const allowedStatuses = [
      "new",
      "confirmed",
      "delivered",
      "completed",
      "cancelled",
    ];

    const allowedPaymentStatuses = [
      "unpaid",
      "advance_paid",
      "paid",
      "refunded",
    ];

    const updateData: Record<string, string> = {};

    if (status !== undefined) {
      if (!allowedStatuses.includes(status)) {
        return NextResponse.json(
          { error: "Invalid booking status" },
          { status: 400 }
        );
      }

      updateData.status = status;
    }

    if (paymentStatus !== undefined) {
      if (!allowedPaymentStatuses.includes(paymentStatus)) {
        return NextResponse.json(
          { error: "Invalid payment status" },
          { status: 400 }
        );
      }

      updateData.payment_status = paymentStatus;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided to update" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("bookings")
      .update(updateData)
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
