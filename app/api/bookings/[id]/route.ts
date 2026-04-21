import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const status = body.status;
    const paymentStatus = body.payment_status;

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

    const supabase = getSupabaseAdmin();

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