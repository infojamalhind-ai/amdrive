import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseAdmin } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sessionId = body.sessionId as string;

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId is required" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: "Stripe session not found" },
        { status: 404 }
      );
    }

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment is not completed yet" },
        { status: 400 }
      );
    }

    const bookingNumber = session.metadata?.booking_id;
    const paymentType = session.metadata?.payment_type || "advance";
    const paidAmount =
      Number(session.metadata?.amount || 0) ||
      Number(session.amount_total || 0) / 100;

    if (!bookingNumber) {
      return NextResponse.json(
        { error: "booking_id missing in Stripe metadata" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("*")
      .eq("booking_number", bookingNumber)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    const totalPrice = Number(booking.total_price || 0);
    const currentAdvancePaid = Number(booking.advance_paid || 0);
    const currentPendingAmount = Number(booking.pending_amount || 0);

    let updateData: Record<string, unknown> = {
      stripe_session_id: session.id,
      stripe_payment_status: session.payment_status,
    };

    if (paymentType === "remaining") {
      const remainingPaid = paidAmount || currentPendingAmount;

      updateData = {
        ...updateData,
        pending_amount: 0,
        remaining_paid: remainingPaid,
        payment_status: "paid",
        status: booking.status === "pending" ? "confirmed" : booking.status,
      };
    } else if (paymentType === "full") {
      updateData = {
        ...updateData,
        advance_paid: totalPrice,
        pending_amount: 0,
        payment_status: "paid",
        status: booking.status === "pending" ? "confirmed" : booking.status,
      };
    } else if (paymentType === "extra_charges") {
      const { data: unpaidCharges, error: unpaidChargesError } = await supabase
        .from("booking_charges")
        .select("id, amount, status")
        .eq("booking_id", booking.id)
        .eq("status", "unpaid");

      if (unpaidChargesError) {
        console.error("Failed to load unpaid charges:", unpaidChargesError);
        return NextResponse.json(
          { error: "Failed to load unpaid extra charges" },
          { status: 500 }
        );
      }

      if (unpaidCharges && unpaidCharges.length > 0) {
        const unpaidChargeIds = unpaidCharges.map((charge) => charge.id);

        const { error: chargeUpdateError } = await supabase
          .from("booking_charges")
          .update({
            status: "paid",
          })
          .in("id", unpaidChargeIds);

        if (chargeUpdateError) {
          console.error("Failed to update extra charges:", chargeUpdateError);
          return NextResponse.json(
            { error: "Failed to mark extra charges as paid" },
            { status: 500 }
          );
        }
      }

      updateData = {
        ...updateData,
        status: booking.status === "pending" ? "confirmed" : booking.status,
      };
    } else {
      const advancePaid = paidAmount || 50;
      const newAdvancePaid =
        currentAdvancePaid > 0 ? currentAdvancePaid : advancePaid;
      const newPendingAmount = Math.max(totalPrice - newAdvancePaid, 0);

      updateData = {
        ...updateData,
        advance_paid: newAdvancePaid,
        pending_amount: newPendingAmount,
        payment_status: newPendingAmount <= 0 ? "paid" : "partially_paid",
        status: booking.status === "pending" ? "confirmed" : booking.status,
      };
    }

    const { error: updateError } = await supabase
      .from("bookings")
      .update(updateData)
      .eq("booking_number", bookingNumber);

    if (updateError) {
      console.error("Supabase update error:", updateError);
      return NextResponse.json(
        { error: "Failed to update booking" },
        { status: 500 }
      );
    }

    const { data: updatedBooking, error: updatedBookingError } = await supabase
      .from("bookings")
      .select("*")
      .eq("booking_number", bookingNumber)
      .single();

    if (updatedBookingError || !updatedBooking) {
      return NextResponse.json(
        { error: "Booking updated but failed to fetch updated details" },
        { status: 500 }
      );
    }

    const { data: updatedCharges, error: updatedChargesError } = await supabase
      .from("booking_charges")
      .select("id, amount, status")
      .eq("booking_id", booking.id);

    if (updatedChargesError) {
      console.error("Failed to fetch updated charges:", updatedChargesError);
    }

    const paidChargesTotal = (updatedCharges || [])
      .filter((charge) => charge.status === "paid")
      .reduce((sum, charge) => sum + Number(charge.amount || 0), 0);

    const unpaidChargesTotal = (updatedCharges || [])
      .filter((charge) => charge.status === "unpaid")
      .reduce((sum, charge) => sum + Number(charge.amount || 0), 0);

    return NextResponse.json({
      message: "Payment confirmed successfully",
      payment_type: paymentType,
      payment_status: updatedBooking.payment_status || "paid",
      paid_amount: paidAmount,
      booking: {
        id: updatedBooking.id,
        booking_number: updatedBooking.booking_number,
        car_name: updatedBooking.car_name,
        customer_name: updatedBooking.customer_name,
        total_price: updatedBooking.total_price,
        payment_status: updatedBooking.payment_status,
        status: updatedBooking.status,
        advance_paid: updatedBooking.advance_paid,
        pending_amount: updatedBooking.pending_amount,
      },
      charges: {
        paid_total: paidChargesTotal,
        unpaid_total: unpaidChargesTotal,
      },
    });
  } catch (error) {
    console.error("Stripe confirm error:", error);
    return NextResponse.json(
      { error: "Failed to confirm Stripe payment" },
      { status: 500 }
    );
  }
}