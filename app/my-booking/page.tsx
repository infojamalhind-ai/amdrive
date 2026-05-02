"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Charge = {
  id: string;
  created_at: string;
  booking_id: string;
  charge_type: string;
  title: string;
  description?: string | null;
  amount: number;
  status: string;
};

type BookingData = {
  id?: string;
  booking_number: string;
  car_name: string;
  customer_name: string;
  customer_phone: string;
  pickup_location: string;
  dropoff_location: string;
  pickup_date: string;
  dropoff_date: string;
  pickup_time: string;
  dropoff_time: string;
  total_days: number;
  total_price: number;
  advance_paid: number;
  remaining_paid?: number;
  pending_amount: number;
  payment_status?: string;
};

type LookupResponse = {
  booking: BookingData;
  charges?: Charge[];
  unpaidChargesTotal?: number;
  paidChargesTotal?: number;
};

function MyBookingPageContent() {
  const searchParams = useSearchParams();

  const [bookingNumber, setBookingNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [charges, setCharges] = useState<Charge[]>([]);
  const [unpaidChargesTotal, setUnpaidChargesTotal] = useState(0);
  const [paidChargesTotal, setPaidChargesTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const bookingParam = searchParams.get("booking");
    const phoneParam = searchParams.get("phone");
    const paymentParam = searchParams.get("payment");

    if (bookingParam) setBookingNumber(bookingParam);
    if (phoneParam) setMobileNumber(phoneParam);

    if (paymentParam === "success") {
      setMessage("Payment successful. Your booking has been updated.");
    } else if (paymentParam === "cancelled") {
      setMessage("Payment was cancelled.");
    }
  }, [searchParams]);

  async function handleLookup(e?: FormEvent) {
    if (e) e.preventDefault();

    setLoading(true);
    setMessage("");
    setBooking(null);
    setCharges([]);
    setUnpaidChargesTotal(0);
    setPaidChargesTotal(0);

    try {
      const res = await fetch("/api/bookings/lookup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          booking_number: bookingNumber,
          mobile_number: mobileNumber,
        }),
      });

      const data: LookupResponse & { error?: string } = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Booking not found");
        return;
      }

      setBooking(data.booking);
      setCharges(data.charges || []);
      setUnpaidChargesTotal(Number(data.unpaidChargesTotal || 0));
      setPaidChargesTotal(Number(data.paidChargesTotal || 0));
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while fetching booking.");
    } finally {
      setLoading(false);
    }
  }

  async function handlePayRemaining() {
    if (!booking?.booking_number) return;

    setPayLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: booking.booking_number,
          paymentType: "remaining",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Failed to start payment");
        return;
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      setMessage("Stripe checkout URL not received.");
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while starting payment.");
    } finally {
      setPayLoading(false);
    }
  }

  async function handlePayExtraCharges() {
    if (!booking?.booking_number) return;

    setPayLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: booking.booking_number,
          paymentType: "extra_charges",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Failed to start extra charges payment");
        return;
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      setMessage("Stripe checkout URL not received.");
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while starting extra charges payment.");
    } finally {
      setPayLoading(false);
    }
  }

  const basePendingAmount = Number(booking?.pending_amount || 0);
  const balancePaidAmount = Number(booking?.remaining_paid || 0);
  const totalOutstanding = basePendingAmount + unpaidChargesTotal;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-md md:p-8">
        <h1 className="text-2xl font-bold text-gray-900">My Booking</h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter your booking number and mobile number to check your booking.
          You can use the last 9 digits of your phone number.
        </p>

        <form onSubmit={handleLookup} className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Booking Number
            </label>
            <input
              type="text"
              value={bookingNumber}
              onChange={(e) => setBookingNumber(e.target.value)}
              placeholder="Example: AMJ-1001"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <input
              type="text"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="Example: 0501234567 or +971501234567"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
              required
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Checking..." : "Check Booking"}
            </button>
          </div>
        </form>

        {message && (
          <div className="mt-4 rounded-xl bg-gray-100 px-4 py-3 text-sm text-gray-700">
            {message}
          </div>
        )}

        {booking && (
          <div className="mt-8 rounded-2xl border border-gray-200 p-5">
            <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>

            <div className="mt-4 grid gap-3 text-sm text-gray-700 md:grid-cols-2">
              <div>
                <span className="font-semibold">Booking Number:</span>{" "}
                {booking.booking_number}
              </div>
              <div>
                <span className="font-semibold">Customer Name:</span>{" "}
                {booking.customer_name}
              </div>
              <div>
                <span className="font-semibold">Car:</span> {booking.car_name}
              </div>
              <div>
                <span className="font-semibold">Mobile:</span>{" "}
                {booking.customer_phone}
              </div>
              <div>
                <span className="font-semibold">Pickup:</span>{" "}
                {booking.pickup_location}
              </div>
              <div>
                <span className="font-semibold">Drop-off:</span>{" "}
                {booking.dropoff_location}
              </div>
              <div>
                <span className="font-semibold">Pickup Date:</span>{" "}
                {booking.pickup_date} at {booking.pickup_time}
              </div>
              <div>
                <span className="font-semibold">Drop-off Date:</span>{" "}
                {booking.dropoff_date} at {booking.dropoff_time}
              </div>
              <div>
                <span className="font-semibold">Total Days:</span>{" "}
                {booking.total_days}
              </div>
              <div>
                <span className="font-semibold">Payment Status:</span>{" "}
                {booking.payment_status || "pending"}
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Total Price</p>
                <p className="mt-1 text-xl font-bold text-gray-900">
                  AED {Number(booking.total_price || 0).toFixed(2)}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Advance Paid</p>
                <p className="mt-1 text-xl font-bold text-gray-900">
                  AED {Number(booking.advance_paid || 0).toFixed(2)}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Balance Paid</p>
                <p className="mt-1 text-xl font-bold text-emerald-600">
                  AED {balancePaidAmount.toFixed(2)}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Pending Amount</p>
                <p className="mt-1 text-xl font-bold text-red-600">
                  AED {basePendingAmount.toFixed(2)}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Unpaid Extra Charges</p>
                <p className="mt-1 text-xl font-bold text-red-600">
                  AED {unpaidChargesTotal.toFixed(2)}
                </p>
              </div>
            </div>

            {charges.length > 0 && (
              <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <h3 className="text-lg font-bold text-gray-900">
                    Extra Charges
                  </h3>

                  <div className="text-sm text-gray-600">
                    <p>Paid Charges: AED {paidChargesTotal.toFixed(2)}</p>
                    <p>Unpaid Charges: AED {unpaidChargesTotal.toFixed(2)}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {charges.map((charge) => (
                    <div
                      key={charge.id}
                      className="rounded-xl border border-gray-200 bg-white p-4"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="text-base font-semibold text-gray-900">
                            {charge.title}
                          </p>
                          <p className="text-xs capitalize text-gray-500">
                            Type: {charge.charge_type.replaceAll("_", " ")}
                          </p>
                          {charge.description ? (
                            <p className="mt-2 text-sm text-gray-600">
                              {charge.description}
                            </p>
                          ) : null}
                        </div>

                        <div className="text-left md:text-right">
                          <p className="text-lg font-bold text-gray-900">
                            AED {Number(charge.amount || 0).toFixed(2)}
                          </p>
                          <span
                            className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                              charge.status === "paid"
                                ? "bg-green-100 text-green-700"
                                : charge.status === "cancelled"
                                ? "bg-gray-200 text-gray-600"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {charge.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {charges.length === 0 && (
              <div className="mt-6 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                No extra charges found for this booking.
              </div>
            )}

            <div className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
              Total outstanding including extra charges: AED{" "}
              {totalOutstanding.toFixed(2)}
            </div>

            {basePendingAmount > 0 && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handlePayRemaining}
                  disabled={payLoading}
                  className="w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {payLoading
                    ? "Redirecting to payment..."
                    : `Pay Remaining AED ${basePendingAmount.toFixed(2)}`}
                </button>
              </div>
            )}

            {unpaidChargesTotal > 0 && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handlePayExtraCharges}
                  disabled={payLoading}
                  className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {payLoading
                    ? "Redirecting to payment..."
                    : `Pay Extra Charges AED ${unpaidChargesTotal.toFixed(2)}`}
                </button>
              </div>
            )}

            {basePendingAmount <= 0 && unpaidChargesTotal <= 0 && (
              <div className="mt-6 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                This booking is fully paid.
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default function MyBookingPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-50 px-4 py-10">
          <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-md md:p-8">
            <h1 className="text-2xl font-bold text-gray-900">My Booking</h1>
            <p className="mt-4 text-sm text-gray-600">Loading booking page...</p>
          </div>
        </main>
      }
    >
      <MyBookingPageContent />
    </Suspense>
  );
}
