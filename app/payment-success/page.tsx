"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type ConfirmResponse = {
  message?: string;
  payment_type?: string;
  payment_status?: string;
  paid_amount?: number;
  booking?: {
    booking_number: string;
    car_name: string;
    customer_name: string;
  };
  error?: string;
};

function PaymentSuccessPageContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [data, setData] = useState<ConfirmResponse | null>(null);

  useEffect(() => {
    async function confirmPayment() {
      if (!sessionId) {
        setMessage("Missing Stripe session ID.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/stripe/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        });

        const result: ConfirmResponse = await res.json();

        if (!res.ok) {
          setMessage(result.error || "Payment confirmation failed.");
          setLoading(false);
          return;
        }

        setData(result);
        setMessage(result.message || "Payment confirmed successfully.");
      } catch (error) {
        console.error("Payment confirm error:", error);
        setMessage("Something went wrong while confirming payment.");
      } finally {
        setLoading(false);
      }
    }

    confirmPayment();
  }, [sessionId]);

  function formatPaymentType(value?: string) {
    if (!value) return "Payment";
    return value
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow-md">
          <h1 className="text-2xl font-bold text-gray-900">Confirming Payment...</h1>
          <p className="mt-3 text-sm text-gray-600">
            Please wait while we verify your payment.
          </p>
        </div>
      </main>
    );
  }

  if (!data || !data.booking) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow-md">
          <h1 className="text-2xl font-bold text-red-600">Payment Confirmation Failed</h1>
          <p className="mt-3 text-sm text-gray-600">
            {message || "Could not load payment details."}
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

  const booking = data.booking;
  const amountPaid = Number(data.paid_amount || 0);
  const paymentType = formatPaymentType(data.payment_type);
  const paymentStatus = data.payment_status || "Paid";

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow-md">
        <h1 className="text-center text-3xl font-bold text-green-600">
          Payment Successful
        </h1>

        <p className="mt-4 text-center text-gray-700">
          {message || "Your payment has been received successfully."}
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

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-50 px-4 py-10">
          <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow-md">
            <h1 className="text-2xl font-bold text-gray-900">
              Confirming Payment...
            </h1>
            <p className="mt-3 text-sm text-gray-600">
              Please wait while we load your payment details.
            </p>
          </div>
        </main>
      }
    >
      <PaymentSuccessPageContent />
    </Suspense>
  );
}
