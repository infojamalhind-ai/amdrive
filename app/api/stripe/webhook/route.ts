import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { sendPaymentConfirmationEmails } from "@/lib/email";

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
          .select("id, booking_number, total_price, advance_paid, pending_amount, status, stripe_session_id, stripe_payment_status, customer_name, customer_email, customer_phone, car_name, pickup_date, dropoff_date, pickup_time, dropoff_time, pickup_location, dropoff_location, total_days, pricing_type, daily_price, weekly_price, monthly_price, base_price, pickup_fee, dropoff_fee, no_deposit_fee, deposit_type, notes")
          .eq("booking_number", bookingNumber)
          .single();

        if (bookingError || !booking) {
          console.error("Webhook booking lookup failed:", bookingError);
        } else {
          const alreadyProcessed =
            booking.stripe_session_id === session.id &&
            booking.stripe_payment_status === session.payment_status;

          if (alreadyProcessed) {
            console.log("Webhook already processed:", bookingNumber);
            return NextResponse.json({ received: true });
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

            try {
              await sendPaymentConfirmationEmails({
                booking_number: booking.booking_number,
                customer_name: booking.customer_name || "",
                customer_email: booking.customer_email,
                customer_phone: booking.customer_phone,
                car_name: booking.car_name || "",
                pickup_date: booking.pickup_date,
                dropoff_date: booking.dropoff_date,
                pickup_time: booking.pickup_time,
                dropoff_time: booking.dropoff_time,
                pickup_location: booking.pickup_location,
                dropoff_location: booking.dropoff_location,
                total_days: booking.total_days,
                pricing_type: booking.pricing_type,
                daily_price: booking.daily_price,
                weekly_price: booking.weekly_price,
                monthly_price: booking.monthly_price,
                base_price: booking.base_price,
                pickup_fee: booking.pickup_fee,
                dropoff_fee: booking.dropoff_fee,
                no_deposit_fee: booking.no_deposit_fee,
                deposit_type: booking.deposit_type,
                total_price: booking.total_price,
                payment_type: paymentType,
                paid_amount: paidAmount,
                payment_status:
                  paymentType === "extra_charges"
                    ? "paid"
                    : paymentType === "advance" && totalPrice > paidAmount
                    ? "partially_paid"
                    : "paid",
                pending_amount:
                  paymentType === "remaining" || paymentType === "full"
                    ? 0
                    : Math.max(totalPrice - (paidAmount || currentAdvancePaid), 0),
                stripe_session_id: session.id,
                notes: booking.notes,
              });
            } catch (emailError) {
              console.error("Payment email error:", emailError);
            }
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
