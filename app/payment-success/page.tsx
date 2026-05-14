import Link from "next/link";
import { MetaPixelPurchaseEvent } from "@/app/components/MetaPixel";
import { confirmStripePayment } from "@/lib/stripe-payment";

type PaymentSuccessPageProps = {
  searchParams?: Promise<{
    session_id?: string;
  }>;
};

function formatPaymentType(value?: string) {
  if (!value) return "Payment";
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default async function PaymentSuccessPage({
  searchParams,
}: PaymentSuccessPageProps) {
  const params = searchParams ? await searchParams : {};
  const sessionId = params?.session_id;
  const result = sessionId
    ? await confirmStripePayment(sessionId)
    : {
        ok: false as const,
        status: 400,
        error: "Missing Stripe session ID.",
      };

  if (!result.ok) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow-md">
          <h1 className="text-2xl font-bold text-red-600">Payment Confirmation Failed</h1>
          <p className="mt-3 text-sm text-gray-600">
            {result.error || "Could not load payment details."}
          </p>

          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const booking = result.data.booking;
  const amountPaid = Number(result.data.paid_amount || 0);
  const paymentType = formatPaymentType(result.data.payment_type);
  const paymentStatus = result.data.payment_status || "Paid";

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <MetaPixelPurchaseEvent
        value={amountPaid}
        bookingNumber={booking.booking_number}
        carName={booking.car_name}
        eventKey={sessionId}
      />
      <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow-md">
        <h1 className="text-center text-3xl font-bold text-green-600">
          Payment Successful
        </h1>

        <p className="mt-4 text-center text-gray-700">
          {result.data.message || "Your payment has been received successfully."}
        </p>

        <div className="mt-8 rounded-2xl bg-gray-50 p-6">
          <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>

          <div className="mt-6 space-y-4 text-sm text-gray-700">
            <div className="flex items-center justify-between gap-4">
              <span>Booking Number</span>
              <span className="font-semibold text-gray-900">
                {booking.booking_number}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span>Customer Name</span>
              <span className="font-semibold text-gray-900">
                {booking.customer_name}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span>Car Name</span>
              <span className="font-semibold text-gray-900">
                {booking.car_name}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span>Payment For</span>
              <span className="font-semibold text-gray-900">{paymentType}</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span>Amount Paid</span>
              <span className="font-semibold text-green-600">
                AED {amountPaid.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span>Payment Status</span>
              <span className="font-semibold text-gray-900 capitalize">
                {paymentStatus}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex justify-center rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white"
          >
            Back to Home
          </Link>

          <Link
            href={`/my-booking?booking=${encodeURIComponent(
              booking.booking_number
            )}`}
            className="inline-flex justify-center rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-900"
          >
            View My Booking
          </Link>
        </div>
      </div>
    </main>
  );
}
