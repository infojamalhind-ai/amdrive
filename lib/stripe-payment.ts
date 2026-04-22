import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase";

type ConfirmStripePaymentResult =
  | {
      ok: true;
      data: {
        message: string;
        payment_type: string;
        payment_status: string;
        paid_amount: number;
        booking: {
          id: string | number;
          booking_number: string;
          car_name: string;
          customer_name: string;
          total_price: number;
          payment_status: string;
          status: string;
          advance_paid: number;
          pending_amount: number;
        };
        charges: {
          paid_total: number;
          unpaid_total: number;
        };
      };
    }
  | {
      ok: false;
      status: number;
      error: string;
    };

export async function confirmStripePayment(
  sessionId: string
): Promise<ConfirmStripePaymentResult> {
  if (!sessionId) {
    return {
      ok: false,
      status: 400,
      error: "sessionId is required",
    };
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (!session) {
    return {
      ok: false,
      status: 404,
      error: "Stripe session not found",
    };
  }

  if (session.payment_status !== "paid") {
    return {
      ok: false,
      status: 400,
      error: "Payment is not completed yet",
    };
  }

  const bookingNumber = session.metadata?.booking_id;
  const paymentType = session.metadata?.payment_type || "advance";
  const paidAmount =
    Number(session.metadata?.amount || 0) ||
    Number(session.amount_total || 0) / 100;

  if (!bookingNumber) {
    return {
      ok: false,
      status: 400,
      error: "booking_id missing in Stripe metadata",
    };
  }

  const supabase = getSupabaseAdmin();

  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select("*")
    .eq("booking_number", bookingNumber)
    .single();

  if (bookingError || !booking) {
    return {
      ok: false,
      status: 404,
      error: "Booking not found",
    };
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
      return {
        ok: false,
        status: 500,
        error: "Failed to load unpaid extra charges",
      };
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
        return {
          ok: false,
          status: 500,
          error: "Failed to mark extra charges as paid",
        };
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
    return {
      ok: false,
      status: 500,
      error: "Failed to update booking",
    };
  }

  const { data: updatedBooking, error: updatedBookingError } = await supabase
    .from("bookings")
    .select("*")
    .eq("booking_number", bookingNumber)
    .single();

  if (updatedBookingError || !updatedBooking) {
    return {
      ok: false,
      status: 500,
      error: "Booking updated but failed to fetch updated details",
    };
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

  return {
    ok: true,
    data: {
      message: "Payment confirmed successfully",
      payment_type: paymentType,
      payment_status: updatedBooking.payment_status || "paid",
      paid_amount: paidAmount,
      booking: {
        id: updatedBooking.id,
        booking_number: updatedBooking.booking_number,
        car_name: updatedBooking.car_name,
        customer_name: updatedBooking.customer_name,
        total_price: Number(updatedBooking.total_price || 0),
        payment_status: updatedBooking.payment_status,
        status: updatedBooking.status,
        advance_paid: Number(updatedBooking.advance_paid || 0),
        pending_amount: Number(updatedBooking.pending_amount || 0),
      },
      charges: {
        paid_total: paidChargesTotal,
        unpaid_total: unpaidChargesTotal,
      },
    },
  };
}
