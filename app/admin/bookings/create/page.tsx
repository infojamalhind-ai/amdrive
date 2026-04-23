// app/admin/bookings/create/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getCarBadgeLabel,
  normalizeMonthlyPlans,
  parseCarDisplayConfig,
} from "@/lib/car-display";

type MonthlyPlan = {
  km: string;
  price: number;
  recommended?: boolean;
  promoText?: string;
};

type Car = {
  id?: number;
  slug: string;
  name: string;
  category?: string;
  image?: string;
  seats?: number;
  bags?: number;
  doors?: number;
  transmission?: string;
  fuel?: string;
  minimum_days?: number;
  daily_price?: number;
  weekly_price?: number;
  monthly_price?: number;
  no_deposit_fee?: number;
  stock?: number;
  is_available?: boolean;
  allow_no_deposit?: boolean;
  show_refundable_deposit?: boolean;
  monthly_plans?: MonthlyPlan[];
  badge_text?: string;
};

const REFUNDABLE_DEPOSIT_AMOUNT = 1000;

const safeNumber = (value: unknown) => {
  const num = Number(value ?? 0);
  return Number.isFinite(num) ? num : 0;
};

const formatMoney = (value: number) => `AED ${value.toFixed(2)}`;

const normalizePlanValue = (value: unknown) => {
  return String(value ?? "")
    .replace(/\s*km/i, "")
    .trim()
    .toLowerCase();
};

const getDeliveryFee = (location: string) => {
  const normalized = String(location || "").trim().toLowerCase();

  if (
    normalized.includes("self pickup") ||
    normalized.includes("self-pickup") ||
    normalized.includes("self pickup from sharjah office")
  ) {
    return 0;
  }

  if (normalized === "ajman") return 30;
  if (normalized === "sharjah") return 35;
  if (normalized === "dubai north") return 50;
  if (normalized === "dubai south") return 80;
  if (normalized === "umm al quwain") return 50;
  if (normalized === "umm-al-quwain") return 50;

  return 0;
};

const calculateTotalDays = (pickupDate: string, dropoffDate: string) => {
  if (!pickupDate || !dropoffDate) return 0;

  const start = new Date(`${pickupDate}T00:00:00`);
  const end = new Date(`${dropoffDate}T00:00:00`);

  const diffTime = end.getTime() - start.getTime();
  let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) diffDays = 1;

  return diffDays;
};

const formatDate = (date: Date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

export default function CreateBookingPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const today = formatDate(new Date());

  const [form, setForm] = useState({
    car_slug: "",
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    pickup_location: "Ajman",
    dropoff_location: "Ajman",
    pickup_date: "",
    dropoff_date: "",
    pickup_time: "10:00",
    dropoff_time: "10:00",
    booking_type: "standard",
    monthly_km_plan: "",
    deposit_type: "no_deposit",
    notes: "",
  });

  useEffect(() => {
    async function fetchCars() {
      try {
        const res = await fetch("/api/cars");
        const data = await res.json();
        setCars(data.cars || []);
      } catch (error) {
        console.error("Failed to load cars:", error);
      }
    }

    fetchCars();
  }, []);

  const selectedCar = useMemo(() => {
    return cars.find((car) => car.slug === form.car_slug) || null;
  }, [cars, form.car_slug]);

  const selectedMonthlyPlan = useMemo(() => {
    if (!selectedCar) return null;

    const monthlyPlans = normalizeMonthlyPlans(selectedCar.monthly_plans);
    if (monthlyPlans.length === 0) return null;

    const requested = normalizePlanValue(form.monthly_km_plan);

    return (
      monthlyPlans.find((plan) => normalizePlanValue(plan.km) === requested) ||
      monthlyPlans[0] ||
      null
    );
  }, [selectedCar, form.monthly_km_plan]);

  const availableMonthlyPlans = useMemo(() => {
    return selectedCar ? normalizeMonthlyPlans(selectedCar.monthly_plans) : [];
  }, [selectedCar]);

  const selectedCarBadge = useMemo(() => {
    if (!selectedCar) return "";

    const displayConfig = parseCarDisplayConfig(selectedCar.badge_text);
    return getCarBadgeLabel(displayConfig, {
      allowNoDeposit: Boolean(selectedCar.allow_no_deposit),
    });
  }, [selectedCar]);

  const pricingPreview = useMemo(() => {
    if (!selectedCar) {
      return {
        totalDays: 0,
        pricingType: "-",
        basePrice: 0,
        pickupFee: 0,
        dropoffFee: 0,
        noDepositFee: 0,
        refundableDepositAmount: 0,
        totalPrice: 0,
        advanceToCollect: 0,
        pendingAmount: 0,
        error: "",
      };
    }

    const pickupFee = getDeliveryFee(form.pickup_location);
    const dropoffFee = getDeliveryFee(form.dropoff_location);

    let totalDays = 0;
    let pricingType = "daily";
    let basePrice = 0;
    let noDepositFee = 0;
    let refundableDepositAmount = 0;
    let error = "";

    if (form.booking_type === "monthly") {
      totalDays = 30;
      pricingType = "monthly";

      if (selectedMonthlyPlan) {
        basePrice = safeNumber(selectedMonthlyPlan.price);
      } else {
        basePrice = safeNumber(selectedCar.monthly_price);
      }
    } else {
      totalDays = calculateTotalDays(form.pickup_date, form.dropoff_date);

      if (form.pickup_date && form.dropoff_date) {
        const minDays = safeNumber(selectedCar.minimum_days || 1);

        if (totalDays < minDays) {
          error = `Minimum booking for ${selectedCar.name} is ${minDays} day(s)`;
        }
      }

      if (totalDays >= 30) {
        pricingType = "monthly";
        basePrice =
          Math.ceil(totalDays / 30) * safeNumber(selectedCar.monthly_price);
      } else if (totalDays >= 7) {
        pricingType = "weekly";
        basePrice =
          Math.ceil(totalDays / 7) * safeNumber(selectedCar.weekly_price);
      } else {
        pricingType = "daily";
        basePrice = totalDays * safeNumber(selectedCar.daily_price);
      }

      if (
        form.deposit_type === "no_deposit" &&
        (selectedCar.allow_no_deposit || safeNumber(selectedCar.no_deposit_fee) > 0)
      ) {
        noDepositFee = safeNumber(selectedCar.no_deposit_fee);
      } else if (form.deposit_type === "with_deposit") {
        refundableDepositAmount = REFUNDABLE_DEPOSIT_AMOUNT;
      }
    }

    const totalPrice =
      basePrice +
      pickupFee +
      dropoffFee +
      noDepositFee +
      refundableDepositAmount;
    const advanceToCollect = Math.min(50, totalPrice);
    const pendingAmount = totalPrice;

    return {
      totalDays,
      pricingType,
      basePrice,
      pickupFee,
      dropoffFee,
      noDepositFee,
      refundableDepositAmount,
      totalPrice,
      advanceToCollect,
      pendingAmount,
      error,
    };
  }, [selectedCar, selectedMonthlyPlan, form]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (pricingPreview.error) {
      alert(pricingPreview.error);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...form,
        created_from: "admin",
        monthly_km_plan:
          form.booking_type === "monthly"
            ? selectedMonthlyPlan?.km || form.monthly_km_plan
            : "",
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to create booking");
        setLoading(false);
        return;
      }

      alert(`Booking created successfully: ${data.bookingNumber}`);
      window.location.href = "/admin/bookings";
    } catch (error) {
      console.error(error);
      alert("Something went wrong while creating booking");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-3 py-4 sm:px-4 sm:py-6 md:px-8 md:py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 rounded-3xl bg-slate-900 p-5 text-white sm:mb-6 sm:p-6 md:mb-8 md:p-8">
          <h1 className="text-2xl font-bold sm:text-3xl">Create Manual Booking</h1>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Create a booking for WhatsApp or direct customers.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-white p-4 shadow-sm sm:p-5 md:p-6"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Select Car
                </label>
                <select
                  required
                  value={form.car_slug}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      car_slug: e.target.value,
                      monthly_km_plan: "",
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                >
                  <option value="">Select a car</option>
                  {cars.map((car) => (
                    <option key={car.slug} value={car.slug}>
                      {car.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Customer Name
                </label>
                <input
                  required
                  type="text"
                  value={form.customer_name}
                  onChange={(e) =>
                    setForm({ ...form, customer_name: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Customer Phone
                </label>
                <input
                  required
                  type="tel"
                  inputMode="tel"
                  pattern="[0-9+ ]{7,20}"
                  placeholder="Mobile number"
                  value={form.customer_phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      customer_phone: e.target.value.replace(/[^0-9+ ]/g, ""),
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Customer Email
                </label>
                <input
                  type="email"
                  value={form.customer_email}
                  onChange={(e) =>
                    setForm({ ...form, customer_email: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Booking Type
                </label>
                <select
                  value={form.booking_type}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      booking_type: e.target.value,
                      monthly_km_plan: "",
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                >
                  <option value="standard">Daily / Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              {form.booking_type === "monthly" && selectedCar && availableMonthlyPlans.length > 0 && (
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Monthly KM Plan
                    </label>
                    <select
                      value={
                        form.monthly_km_plan ||
                        availableMonthlyPlans[0]?.km ||
                        ""
                      }
                      onChange={(e) =>
                        setForm({ ...form, monthly_km_plan: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-300 px-4 py-3"
                    >
                      {availableMonthlyPlans.map((plan, index) => (
                        <option key={`${plan.km}-${index}`} value={plan.km}>
                          {plan.km} - AED {safeNumber(plan.price)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

              {form.booking_type === "monthly" && selectedCar && availableMonthlyPlans.length === 0 && (
                <div className="md:col-span-2 rounded-2xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
                  This car does not have monthly plan options configured yet. The booking
                  will use the base monthly price of AED {safeNumber(selectedCar.monthly_price)}.
                </div>
              )}

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Pickup Location
                </label>
                <select
                  value={form.pickup_location}
                  onChange={(e) =>
                    setForm({ ...form, pickup_location: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                >
                  <option>Ajman</option>
                  <option>Sharjah</option>
                  <option>Dubai North</option>
                  <option>Dubai South</option>
                  <option>Umm Al Quwain</option>
                  <option>Self Pickup</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Dropoff Location
                </label>
                <select
                  value={form.dropoff_location}
                  onChange={(e) =>
                    setForm({ ...form, dropoff_location: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                >
                  <option>Ajman</option>
                  <option>Sharjah</option>
                  <option>Dubai North</option>
                  <option>Dubai South</option>
                  <option>Umm Al Quwain</option>
                  <option>Self Pickup</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Pickup Date
                </label>
                <input
                  required
                  type="date"
                  value={form.pickup_date}
                  min={today}
                  onChange={(e) =>
                    setForm({ ...form, pickup_date: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12"
                />
              </div>

              {form.booking_type !== "monthly" ? (
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Dropoff Date
                  </label>
                  <input
                    required
                    type="date"
                    value={form.dropoff_date}
                    min={form.pickup_date || today}
                    onChange={(e) =>
                      setForm({ ...form, dropoff_date: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12"
                  />
                </div>
              ) : (
                <div className="rounded-2xl bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-800">
                  Monthly bookings use the pickup date as the start date. The
                  system will handle the monthly period automatically.
                </div>
              )}

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Pickup Time
                </label>
                <input
                  type="time"
                  value={form.pickup_time}
                  onChange={(e) =>
                    setForm({ ...form, pickup_time: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>

              {form.booking_type !== "monthly" ? (
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Dropoff Time
                  </label>
                  <input
                    type="time"
                    value={form.dropoff_time}
                    onChange={(e) =>
                      setForm({ ...form, dropoff_time: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3"
                  />
                </div>
              ) : (
                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
                  No dropoff time is needed for monthly manual bookings.
                </div>
              )}

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Deposit Type
                </label>
                <select
                  value={form.deposit_type}
                  onChange={(e) =>
                    setForm({ ...form, deposit_type: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                >
                  <option value="no_deposit">No Deposit</option>
                  <option value="with_deposit">With Deposit</option>
                  <option value="none">None</option>
                </select>
              </div>

              <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
                <p className="font-semibold">Manual booking payment flow</p>
                <p className="mt-1">
                  This booking will be created as unpaid. After saving, send the
                  advance payment link to the customer.
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Notes
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) =>
                    setForm({ ...form, notes: e.target.value })
                  }
                  rows={4}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>
            </div>

            {pricingPreview.error && (
              <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {pricingPreview.error}
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-purple-700 px-6 py-3 text-sm font-bold text-white hover:bg-purple-800 disabled:opacity-50 sm:w-auto"
              >
                {loading ? "Creating..." : "Create Booking"}
              </button>

              <a
                href="/admin/bookings"
                className="w-full rounded-2xl border border-slate-300 px-6 py-3 text-center text-sm font-medium text-slate-700 sm:w-auto"
              >
                Back to Bookings
              </a>
            </div>
          </form>

          <div className="space-y-6 self-start lg:sticky lg:top-4">
            <div className="rounded-3xl bg-white p-4 shadow-sm sm:p-5 md:p-6">
              <h2 className="text-xl font-bold text-slate-900">Car Details</h2>

              {!selectedCar ? (
                <p className="mt-3 text-sm text-slate-500">
                  Select a car to see details.
                </p>
              ) : (
                <div className="mt-4 space-y-3 text-sm text-slate-700">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-purple-700">
                      {selectedCar.category || "Car"}
                    </p>
                    <h3 className="text-2xl font-bold text-slate-900">
                      {selectedCar.name}
                    </h3>
                    <p className="mt-1 text-slate-500">{selectedCar.slug}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Seats</p>
                      <p className="font-semibold">{selectedCar.seats ?? "-"}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Bags</p>
                      <p className="font-semibold">{selectedCar.bags ?? "-"}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Doors</p>
                      <p className="font-semibold">{selectedCar.doors ?? "-"}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Min Days</p>
                      <p className="font-semibold">
                        {selectedCar.minimum_days ?? 1}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="font-semibold text-slate-900">Price Card</p>
                    <div className="mt-2 space-y-1">
                      <p>Daily: AED {safeNumber(selectedCar.daily_price)}</p>
                      <p>Weekly: AED {safeNumber(selectedCar.weekly_price)}</p>
                      <p>Monthly: AED {safeNumber(selectedCar.monthly_price)}</p>
                    </div>
                  </div>

                  {form.booking_type === "monthly" &&
                    availableMonthlyPlans.length > 0 && (
                    <div className="rounded-2xl bg-purple-50 p-4">
                      <p className="font-semibold text-slate-900">Monthly Plans</p>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {availableMonthlyPlans.map((plan) => (
                          <div
                            key={`${selectedCar.slug}-${plan.km}`}
                            className={`rounded-2xl border px-3 py-2 text-sm ${
                              selectedMonthlyPlan?.km === plan.km
                                ? "border-purple-300 bg-white text-purple-900"
                                : "border-purple-100 bg-white/70 text-slate-700"
                            }`}
                          >
                            <div className="font-semibold">{plan.km}</div>
                            <div>AED {safeNumber(plan.price)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedCarBadge && (
                    <div className="rounded-2xl bg-purple-50 px-4 py-3 text-sm font-medium text-purple-800">
                      {selectedCarBadge}
                    </div>
                  )}

                  <div
                    className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                      !selectedCar.is_available || safeNumber(selectedCar.stock) <= 0
                        ? "bg-red-50 text-red-700"
                        : "bg-green-50 text-green-700"
                    }`}
                  >
                    {!selectedCar.is_available || safeNumber(selectedCar.stock) <= 0
                      ? "Currently not available"
                      : `Available • Stock ${safeNumber(selectedCar.stock)}`}
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-3xl bg-white p-4 shadow-sm sm:p-5 md:p-6">
              <h2 className="text-xl font-bold text-slate-900">Price Summary</h2>

              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <div className="flex items-center justify-between">
                  <span>Total Days</span>
                  <span className="font-semibold">{pricingPreview.totalDays}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Pricing Type</span>
                  <span className="font-semibold capitalize">
                    {pricingPreview.pricingType}
                  </span>
                </div>

                {form.booking_type === "monthly" && selectedMonthlyPlan && (
                  <div className="flex items-center justify-between">
                    <span>Monthly Plan</span>
                    <span className="font-semibold">{selectedMonthlyPlan.km}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span>Base Price</span>
                  <span className="font-semibold">
                    {formatMoney(pricingPreview.basePrice)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Pickup Delivery Fee</span>
                  <span className="font-semibold">
                    {formatMoney(pricingPreview.pickupFee)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Dropoff Collection Fee</span>
                  <span className="font-semibold">
                    {formatMoney(pricingPreview.dropoffFee)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Delivery Total</span>
                  <span className="font-semibold">
                    {formatMoney(
                      pricingPreview.pickupFee + pricingPreview.dropoffFee
                    )}
                  </span>
                </div>

                {pricingPreview.noDepositFee > 0 && (
                  <div className="flex items-center justify-between">
                    <span>No Deposit Waiver Fee</span>
                    <span className="font-semibold">
                      {formatMoney(pricingPreview.noDepositFee)}
                    </span>
                  </div>
                )}

                {pricingPreview.refundableDepositAmount > 0 && (
                  <div className="flex items-center justify-between">
                    <span>Refundable Deposit</span>
                    <span className="font-semibold">
                      {formatMoney(pricingPreview.refundableDepositAmount)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span>Deposit Option</span>
                  <span className="font-semibold">
                    {form.booking_type === "monthly"
                      ? "Monthly plan"
                      : form.deposit_type === "with_deposit"
                        ? "With Refundable Deposit"
                        : form.deposit_type === "no_deposit"
                          ? "No Deposit"
                          : "None"}
                  </span>
                </div>

                <div className="border-t border-slate-200 pt-3">
                  <div className="flex items-center justify-between text-base font-bold text-slate-900">
                    <span>Total Price</span>
                    <span>{formatMoney(pricingPreview.totalPrice)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-blue-700">
                  <span>Advance to Collect Later</span>
                  <span className="font-bold">
                    {formatMoney(pricingPreview.advanceToCollect)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-amber-700">
                  <span>Pending Amount</span>
                  <span className="font-bold">
                    {formatMoney(pricingPreview.pendingAmount)}
                  </span>
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-500">
                Manual bookings are saved as unpaid first. The customer pays the
                calculated advance later using the payment link.
              </p>

              {pricingPreview.refundableDepositAmount > 0 && (
                <p className="mt-2 text-xs text-slate-500">
                  Refundable deposit is included above and is returned within
                  10 days after car return, subject to fines, Salik, and damage
                  checks.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
