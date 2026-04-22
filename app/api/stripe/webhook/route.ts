import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return new NextResponse("No signature", { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log("Webhook:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingNumber = session.metadata?.booking_id;
      const paymentType = session.metadata?.payment_type || "advance";
      const paidAmount =
        Number(session.metadata?.amount || 0) ||
        Number(session.amount_total || 0) / 100;

      if (bookingNumber) {
        const { data: booking, error: bookingError } = await supabase
          .from("bookings")
          .select("id, booking_number, total_price, advance_paid, pending_amount, status")
          .eq("booking_number", bookingNumber)
          .single();

        if (bookingError || !booking) {
          console.error("Webhook booking lookup failed:", bookingError);
        } else {
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
              .select("id")
              .eq("booking_id", booking.id)
              .eq("status", "unpaid");

            if (unpaidChargesError) {
              console.error("Webhook failed to load unpaid charges:", unpaidChargesError);
            } else if (unpaidCharges && unpaidCharges.length > 0) {
              const unpaidChargeIds = unpaidCharges.map((charge) => charge.id);

              const { error: chargeUpdateError } = await supabase
                .from("booking_charges")
                .update({ status: "paid" })
                .in("id", unpaidChargeIds);

              if (chargeUpdateError) {
                console.error("Webhook failed to mark charges as paid:", chargeUpdateError);
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
            console.error("Webhook booking update failed:", updateError);
          } else {
            console.log("Webhook booking updated:", bookingNumber);
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown webhook error";

    console.error("Webhook error:", message);

    return new NextResponse(`Webhook Error: ${message}`, {
      status: 400,
    });
  }
}
