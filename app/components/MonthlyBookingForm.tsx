"use client";

import { useState } from "react";
import Link from "next/link";

type MonthlyPlan = {
  km: string;
  price: number;
};

type Car = {
  slug: string;
  name: string;
  category: string;
  monthlyPlans?: MonthlyPlan[];
};

type MonthlyBookingFormProps = {
  car: Car;
  selectedPlan: MonthlyPlan;
};

const DELIVERY_PRICES: Record<string, number> = {
  Ajman: 30,
  Sharjah: 35,
  "Dubai North": 50,
  "Dubai South": 80,
  "Umm Al Quwain": 50,
  "Self Pickup": 0,
};

type PaymentOption = "advance" | "full";

function sanitizePhoneInput(value: string) {
  const trimmed = value.replace(/[^\d+]/g, "");

  if (trimmed.startsWith("+")) {
    return `+${trimmed.slice(1).replace(/\+/g, "")}`;
  }

  return trimmed.replace(/\+/g, "");
}

function isValidPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 9 && digits.length <= 15;
}

function formatDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function MonthlyBookingForm({
  car,
  selectedPlan,
}: MonthlyBookingFormProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupLocation, setPickupLocation] = useState("Ajman");
  const [dropoffLocation, setDropoffLocation] = useState("Ajman");
  const [notes, setNotes] = useState("");
  const [paymentOption, setPaymentOption] = useState<PaymentOption>("advance");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const today = formatDate(new Date());

  const pickupCharge = DELIVERY_PRICES[pickupLocation] ?? 0;
  const dropoffCharge = DELIVERY_PRICES[dropoffLocation] ?? 0;
  const deliveryTotal = pickupCharge + dropoffCharge;
  const rentalPrice = Number(selectedPlan.price || 0);

  const advanceAmount = 50;
  const finalTotal = rentalPrice + deliveryTotal;
  const payNowAmount =
    paymentOption === "advance" ? Math.min(advanceAmount, finalTotal) : finalTotal;
  const balanceOnDelivery =
    paymentOption === "advance" ? Math.max(finalTotal - advanceAmount, 0) : 0;

  async function readJsonSafe(res: Response) {
    const text = await res.text();

    try {
      return JSON.parse(text);
    } catch {
      console.error("Non-JSON response:", text);
      throw new Error("API returned invalid response instead of JSON");
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      if (!isValidPhoneNumber(customerPhone)) {
        throw new Error("Please enter a valid phone number");
      }

      if (!acceptedTerms) {
        throw new Error("Please agree to the Terms & Conditions before booking");
      }

      const bookingPayload = {
        car_slug: car.slug,
        car_name: car.name,

        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: null,

        pickup_location: pickupLocation,
        dropoff_location: dropoffLocation,

        pickup_date: pickupDate,
        dropoff_date: pickupDate,
        pickup_time: "10:00 AM",
        dropoff_time: "10:00 AM",

        total_days: 30,
        pricing_type: "monthly",

        daily_price: 0,
        weekly_price: 0,
        monthly_price: rentalPrice,

        base_price: rentalPrice,
        pickup_fee: pickupCharge,
        dropoff_fee: dropoffCharge,
        no_deposit_fee: 0,
        total_price: finalTotal,

        advance_paid: paymentOption === "advance" ? 50 : finalTotal,
        deposit_type: "monthly_no_deposit",

        payment_status: "unpaid",
        status: "pending",

        booking_type: "monthly",
        monthly_km_plan: selectedPlan.km,
        notes,
      };

      const bookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingPayload),
      });

      const bookingData = await readJsonSafe(bookingRes);

      if (!bookingRes.ok) {
        throw new Error(bookingData.error || "Failed to save booking");
      }

      const checkoutRes = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: bookingData.bookingNumber,
          paymentType: paymentOption === "advance" ? "advance" : "full",
        }),
      });

      const checkoutData = await readJsonSafe(checkoutRes);

      if (!checkoutRes.ok) {
        throw new Error(checkoutData.error || "Failed to create Stripe session");
      }

      if (checkoutData.url) {
        window.location.href = checkoutData.url;
        return;
      }

      throw new Error("Stripe checkout URL not returned");
    } catch (error) {
      console.error("Monthly booking submit error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong while creating monthly booking"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto px-4 overflow-x-hidden rounded-3xl bg-white py-6 shadow-sm md:py-8"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-500">Car</p>
          <p className="mt-2 text-xl font-bold text-slate-900">{car.name}</p>
          <p className="mt-1 text-sm text-slate-600">{car.category}</p>
        </div>

        <div className="rounded-2xl border border-purple-200 bg-purple-50 p-5">
          <p className="text-sm font-semibold text-purple-700">
            Selected Monthly Plan
          </p>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-2xl font-bold text-slate-900">
              AED {selectedPlan.price}
            </p>
            <p className="text-lg font-semibold text-slate-700">
              {selectedPlan.km}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Full Name
          </label>
          <input
            type="text"
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full min-w-0 rounded-xl border border-gray-300 px-4 py-3 text-base"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Phone Number
          </label>
          <input
            type="tel"
            required
            value={customerPhone}
            onChange={(e) => setCustomerPhone(sanitizePhoneInput(e.target.value))}
            className="w-full min-w-0 rounded-xl border border-gray-300 px-4 py-3 text-base"
            placeholder="Enter your phone number"
            inputMode="tel"
            autoComplete="tel"
            pattern="^\+?\d{9,15}$"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Pickup Date
          </label>
          <input
            type="date"
            required
            min={today}
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            className="w-full min-w-0 rounded-xl border border-gray-300 px-4 py-3 pr-12 text-base"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Pickup Location
          </label>
          <select
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            className="w-full min-w-0 rounded-xl border border-gray-300 px-4 py-3 text-base"
          >
            {Object.keys(DELIVERY_PRICES).map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Dropoff Location
          </label>
          <select
            value={dropoffLocation}
            onChange={(e) => setDropoffLocation(e.target.value)}
            className="w-full min-w-0 rounded-xl border border-gray-300 px-4 py-3 text-base"
          >
            {Object.keys(DELIVERY_PRICES).map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Payment Option
          </label>
          <select
            value={paymentOption}
            onChange={(e) => setPaymentOption(e.target.value as PaymentOption)}
            className="w-full min-w-0 rounded-xl border border-gray-300 px-4 py-3 text-base"
          >
            <option value="advance">Pay AED 50 Advance</option>
            <option value="full">Pay Full Amount</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Notes
          </label>
          <textarea
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full min-w-0 rounded-xl border border-gray-300 px-4 py-3 text-base"
            placeholder="Building name, area, special request..."
          />
        </div>

        <div>
          <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-600"
              required
            />
            <span className="leading-6">
              I agree to{" "}
              <Link
                href="/terms"
                target="_blank"
                className="font-semibold text-purple-700 hover:text-purple-900"
              >
                Terms & Conditions
              </Link>
              .
            </span>
          </label>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <h3 className="text-lg font-bold text-slate-900">Booking Summary</h3>

        <div className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Monthly Plan</span>
            <span className="font-semibold text-slate-900">
              AED {rentalPrice}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-600">Kilometers</span>
            <span className="font-semibold text-slate-900">
              {selectedPlan.km}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-600">Pickup Charge</span>
            <span className="font-semibold text-slate-900">
              AED {pickupCharge}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-600">Dropoff Charge</span>
            <span className="font-semibold text-slate-900">
              AED {dropoffCharge}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-600">Payment Option</span>
            <span className="font-semibold text-slate-900">
              {paymentOption === "advance"
                ? "Pay AED 50 Advance"
                : "Pay Full Amount"}
            </span>
          </div>

          <div className="border-t border-slate-200 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-slate-900">
                Final Total
              </span>
              <span className="text-xl font-bold text-purple-700">
                AED {finalTotal}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-600">Pay Now</span>
            <span className="font-semibold text-slate-900">
              AED {payNowAmount}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-600">Balance on Delivery</span>
            <span className="font-semibold text-slate-900">
              AED {balanceOnDelivery}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !acceptedTerms}
          className="mt-6 w-full rounded-2xl bg-purple-600 px-5 py-4 text-base font-bold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting
            ? "Processing..."
            : paymentOption === "advance"
            ? "Pay AED 50 & Confirm Booking"
            : `Pay AED ${finalTotal} & Confirm Booking`}
        </button>
      </div>
    </form>
  );
}
