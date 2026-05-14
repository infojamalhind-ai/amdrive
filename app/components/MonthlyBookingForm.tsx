"use client";

import { useState } from "react";
import Link from "next/link";
import { useMetaPixelCheckoutStart } from "@/app/components/MetaPixel";

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
  "Self Pickup from Sharjah Office (FREE)": 0,
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

function isValidEmail(value: string) {
  if (!value.trim()) return true;

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function formatDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
}

function generateAllTimeSlots() {
  const slots: { value: string; label: string }[] = [];

  for (let hour = 9; hour <= 23; hour++) {
    for (const minute of [0, 30]) {
      if (hour === 23 && minute === 30) continue;

      const date = new Date();
      date.setHours(hour, minute, 0, 0);

      const value = `${String(hour).padStart(2, "0")}:${String(minute).padStart(
        2,
        "0"
      )}`;
      const label = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      slots.push({ value, label });
    }
  }

  return slots;
}

const TIME_SLOTS = generateAllTimeSlots();

function getNext30MinuteSlot(date: Date) {
  const rounded = new Date(date);
  rounded.setSeconds(0, 0);

  const minutes = rounded.getMinutes();

  if (minutes === 0 || minutes === 30) {
    return rounded;
  }

  if (minutes < 30) {
    rounded.setMinutes(30);
  } else {
    rounded.setHours(rounded.getHours() + 1);
    rounded.setMinutes(0);
  }

  return rounded;
}

function getAvailablePickupSlots(selectedDate: string) {
  if (!selectedDate) return TIME_SLOTS;

  const now = new Date();
  const today = formatDate(now);

  if (selectedDate < today) {
    return [];
  }

  if (selectedDate > today) {
    return TIME_SLOTS;
  }

  const minAllowed = new Date(now);
  minAllowed.setHours(minAllowed.getHours() + 2);

  const firstAllowed = getNext30MinuteSlot(minAllowed);
  const firstAllowedValue = `${String(firstAllowed.getHours()).padStart(
    2,
    "0"
  )}:${String(firstAllowed.getMinutes()).padStart(2, "0")}`;

  return TIME_SLOTS.filter((slot) => slot.value >= firstAllowedValue);
}

export default function MonthlyBookingForm({
  car,
  selectedPlan,
}: MonthlyBookingFormProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [pickupLocation, setPickupLocation] = useState("Ajman");
  const [dropoffLocation, setDropoffLocation] = useState("Ajman");
  const [notes, setNotes] = useState("");
  const [paymentOption, setPaymentOption] = useState<PaymentOption>("advance");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const trackCheckoutStart = useMetaPixelCheckoutStart({
    carName: car.name,
    value: selectedPlan.price,
  });
  const today = formatDate(new Date());
  const availablePickupTimeSlots = getAvailablePickupSlots(pickupDate);
  const noPickupSlotsAvailable = Boolean(
    pickupDate && availablePickupTimeSlots.length === 0
  );
  const effectivePickupTime = pickupDate
    ? availablePickupTimeSlots.some((slot) => slot.value === pickupTime)
      ? pickupTime
      : availablePickupTimeSlots[0]?.value || ""
    : "";

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

      if (!isValidEmail(customerEmail)) {
        throw new Error("Please enter a valid email address");
      }

      if (!acceptedTerms) {
        throw new Error("Please agree to the Terms & Conditions before booking");
      }

      if (!effectivePickupTime) {
        throw new Error(
          "No pickup time slots available for the selected date. Please choose another date."
        );
      }

      const bookingPayload = {
        car_slug: car.slug,
        car_name: car.name,

        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,

        pickup_location: pickupLocation,
        dropoff_location: dropoffLocation,

        pickup_date: pickupDate,
        dropoff_date: pickupDate,
        pickup_time: effectivePickupTime,
        dropoff_time: effectivePickupTime,

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

        advance_paid: paymentOption === "advance" ? payNowAmount : finalTotal,
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
      onFocusCapture={trackCheckoutStart}
      onClickCapture={trackCheckoutStart}
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
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-800">
            Minimum booking: 30 days
          </span>
          <span className="rounded-full bg-purple-100 px-3 py-1.5 text-xs font-semibold text-purple-900">
            Driver Age 25+ and 1 year old license
          </span>
        </div>

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
            Email
          </label>
          <input
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            className="w-full min-w-0 rounded-xl border border-gray-300 px-4 py-3 text-base"
            placeholder="Enter your email"
            autoComplete="email"
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
            onChange={(e) => {
              const nextPickupDate = e.target.value;
              const nextPickupSlots = getAvailablePickupSlots(nextPickupDate);

              setPickupDate(nextPickupDate);

              if (nextPickupSlots.some((slot) => slot.value === pickupTime)) {
                return;
              }

              setPickupTime(nextPickupSlots[0]?.value || "");
            }}
            className="w-full min-w-0 rounded-xl border border-gray-300 px-4 py-3 pr-12 text-base"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Pickup Time
          </label>
          <select
            required
            value={effectivePickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            disabled={!pickupDate || noPickupSlotsAvailable}
            className="w-full min-w-0 rounded-xl border border-gray-300 px-4 py-3 text-base disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
          >
            {!pickupDate && <option value="">Select pickup date first</option>}
            {pickupDate && noPickupSlotsAvailable && (
              <option value="">No slots available today</option>
            )}
            {pickupDate &&
              availablePickupTimeSlots.map((slot) => (
                <option key={slot.value} value={slot.value}>
                  {slot.label}
                </option>
              ))}
          </select>
          {noPickupSlotsAvailable && (
            <p className="mt-2 text-sm text-red-600">
              No pickup time slots available today. Please choose another date.
            </p>
          )}
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
            <option value="advance">Pay AED {payNowAmount} Advance</option>
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
                ? `Pay AED ${payNowAmount} Advance`
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
            ? `Pay AED ${payNowAmount} & Confirm Booking`
            : `Pay AED ${finalTotal} & Confirm Booking`}
        </button>
      </div>
    </form>
  );
}
