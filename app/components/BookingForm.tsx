"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type VehicleType = {
  slug: string;
  name: string;
  category: string;
  dailyPrice: number;
  weeklyPrice: number;
  monthlyPrice: number;
  image: string;
  seats: number;
  bags: number;
  doors: number;
  minimumDays: number;
  allowNoDeposit: boolean;
  noDepositFee: number;
  showRefundableDeposit: boolean;
};

type BookingFormProps = {
  car: VehicleType;
};

const CITY_OPTIONS = [
  {
    value: "self-sharjah",
    label: "Self Pickup from Sharjah Office",
    displayLabel: "Self Pickup from Sharjah Office (FREE)",
  },
  {
    value: "ajman",
    label: "Ajman",
    displayLabel: "Ajman (AED 30)",
  },
  {
    value: "sharjah",
    label: "Sharjah",
    displayLabel: "Sharjah (AED 35)",
  },
  {
    value: "dubai-north",
    label: "Dubai North",
    displayLabel: "Dubai North (AED 50)",
  },
  {
    value: "dubai-south",
    label: "Dubai South",
    displayLabel: "Dubai South (AED 80)",
  },
  {
    value: "umm-al-quwain",
    label: "Umm Al Quwain",
    displayLabel: "Umm Al Quwain (AED 50)",
  },
];

const DELIVERY_FEES: Record<string, number> = {
  "self-sharjah": 0,
  ajman: 30,
  sharjah: 35,
  "dubai-north": 50,
  "dubai-south": 80,
  "umm-al-quwain": 50,
};

const REFUNDABLE_DEPOSIT_AMOUNT = 1000;

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

function formatLocationLabel(value: string) {
  const found = CITY_OPTIONS.find((city) => city.value === value);
  return found ? found.label : value;
}

function addDaysToDate(dateString: string, days: number) {
  const date = new Date(`${dateString}T00:00:00`);
  date.setDate(date.getDate() + days);

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
}

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

function getTimeSlotLabel(value: string) {
  return TIME_SLOTS.find((slot) => slot.value === value)?.label || value;
}

function formatSelectedDateTime(dateValue: string, timeValue: string) {
  if (!dateValue || !timeValue) return "";

  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const dateLabel = date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return `${dateLabel}, ${getTimeSlotLabel(timeValue)}`;
}

function isPickupDateTimeAvailable(dateValue: string, timeValue: string) {
  if (!dateValue || !timeValue) return false;

  const pickupDateTime = new Date(`${dateValue}T${timeValue}:00`);

  if (Number.isNaN(pickupDateTime.getTime())) {
    return false;
  }

  const minAllowed = new Date();
  minAllowed.setHours(minAllowed.getHours() + 2);

  return pickupDateTime.getTime() >= minAllowed.getTime();
}

function getRentalTiming(
  pickupDate: string,
  pickupTime: string,
  dropoffDate: string,
  dropoffTime: string,
  minimumDays: number
) {
  if (!pickupDate || !pickupTime || !dropoffDate || !dropoffTime) {
    return {
      totalDays: 0,
      previousPaidDays: minimumDays,
      hasExtraTimeCharge: false,
      error: "",
    };
  }

  const start = new Date(`${pickupDate}T${pickupTime}:00`);
  const end = new Date(`${dropoffDate}T${dropoffTime}:00`);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return {
      totalDays: 0,
      previousPaidDays: minimumDays,
      hasExtraTimeCharge: false,
      error: "",
    };
  }

  const diffTime = end.getTime() - start.getTime();

  if (diffTime <= 0) {
    return {
      totalDays: 0,
      previousPaidDays: minimumDays,
      hasExtraTimeCharge: false,
      error: "Dropoff date and time must be after pickup date and time.",
    };
  }

  const totalHours = diffTime / (1000 * 60 * 60);
  const chargeableDays = Math.ceil((totalHours - 1) / 24);
  const totalDays = Math.max(chargeableDays, minimumDays);
  const previousPaidDays = Math.max(totalDays - 1, minimumDays);
  const hasExtraTimeCharge =
    totalDays > minimumDays && totalHours > previousPaidDays * 24 + 1;

  return {
    totalDays,
    previousPaidDays,
    hasExtraTimeCharge,
    error: "",
  };
}

export default function BookingForm({ car }: BookingFormProps) {
  const searchParams = useSearchParams();
  const pickupDateFromUrl = searchParams.get("pickupDate");
  const returnDateFromUrl = searchParams.get("returnDate");

  const initialPickupLocation = "self-sharjah";
  const initialDropoffLocation = "self-sharjah";
  const initialPickupDate = pickupDateFromUrl || "";
  const initialDropoffDate = returnDateFromUrl || "";
  const initialDepositType = car.allowNoDeposit
    ? "no_deposit"
    : car.showRefundableDeposit
    ? "with_deposit"
    : "none";

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const [pickupLocation, setPickupLocation] = useState(initialPickupLocation);
  const [dropoffLocation, setDropoffLocation] = useState(initialDropoffLocation);

  const [pickupDate, setPickupDate] = useState(initialPickupDate);
  const [dropoffDate, setDropoffDate] = useState(initialDropoffDate);

  const [pickupTime, setPickupTime] = useState("");
  const [dropoffTime, setDropoffTime] = useState("09:00");
  const [activeDateTimePicker, setActiveDateTimePicker] = useState<
    "pickup" | "return" | null
  >(null);
  const [draftDate, setDraftDate] = useState("");
  const [draftTime, setDraftTime] = useState("");

  const [depositType, setDepositType] = useState(initialDepositType);
  const [paymentOption, setPaymentOption] = useState("advance");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [loading, setLoading] = useState(false);

  const today = formatDate(new Date());

  const minimumDropoffDate = useMemo(() => {
    if (!pickupDate) return today;
    return addDaysToDate(pickupDate, car.minimumDays);
  }, [pickupDate, car.minimumDays, today]);

  const availablePickupTimeSlots = getAvailablePickupSlots(pickupDate);

  const availableDropoffTimeSlots = TIME_SLOTS;

  const noPickupSlotsAvailable = Boolean(
    pickupDate && availablePickupTimeSlots.length === 0
  );
  const effectivePickupTime =
    pickupDate && availablePickupTimeSlots.some((slot) => slot.value === pickupTime)
      ? pickupTime
      : availablePickupTimeSlots[0]?.value || "";
  const effectiveDropoffTime = availableDropoffTimeSlots.some(
    (slot) => slot.value === dropoffTime
  )
    ? dropoffTime
    : availableDropoffTimeSlots[0]?.value || "";
  const effectiveDropoffDate =
    pickupDate && (!dropoffDate || dropoffDate < minimumDropoffDate)
      ? minimumDropoffDate
      : dropoffDate;

  const pricing = useMemo(() => {
    const noDepositFee =
      depositType === "no_deposit" && car.allowNoDeposit ? car.noDepositFee : 0;

    const refundableDepositAmount =
      depositType === "with_deposit" && car.showRefundableDeposit
        ? REFUNDABLE_DEPOSIT_AMOUNT
        : 0;

    let totalDays = 0;
    let pricingType = "Daily";
    let basePrice = 0;
    let timingError = "";
    let previousPaidDays = car.minimumDays;
    let hasExtraTimeCharge = false;

    if (
      pickupDate &&
      effectivePickupTime &&
      effectiveDropoffDate &&
      effectiveDropoffTime
    ) {
      const timing = getRentalTiming(
        pickupDate,
        effectivePickupTime,
        effectiveDropoffDate,
        effectiveDropoffTime,
        car.minimumDays
      );

      totalDays = timing.totalDays;
      timingError = timing.error;
      previousPaidDays = timing.previousPaidDays;
      hasExtraTimeCharge = timing.hasExtraTimeCharge;

      if (totalDays >= 30) {
        pricingType = "Monthly";
        basePrice = Math.ceil(totalDays / 30) * car.monthlyPrice;
      } else if (totalDays >= 7) {
        pricingType = "Weekly";
        basePrice = totalDays * Number(car.weeklyPrice || 0);
      } else {
        pricingType = "Daily";
        basePrice = totalDays * car.dailyPrice;
      }
    }

    const pickupFee = DELIVERY_FEES[pickupLocation] ?? 0;
    const dropoffFee = DELIVERY_FEES[dropoffLocation] ?? 0;

    const totalPrice =
      basePrice +
      pickupFee +
      dropoffFee +
      noDepositFee +
      refundableDepositAmount;
    const payNow =
      paymentOption === "advance" ? Math.min(50, totalPrice) : totalPrice;
    const basePriceBreakdown =
      pricingType === "Daily"
        ? `(${totalDays} x AED ${car.dailyPrice} rent price)`
        : pricingType === "Weekly"
          ? `(${totalDays} x AED ${Number(car.weeklyPrice || 0)} rent price)`
          : "";

    return {
      totalDays,
      pricingType,
      basePrice,
      basePriceBreakdown,
      pickupFee,
      dropoffFee,
      noDepositFee,
      refundableDepositAmount,
      totalPrice,
      payNow,
      timingError,
      previousPaidDays,
      hasExtraTimeCharge,
    };
  }, [
    pickupDate,
    effectivePickupTime,
    effectiveDropoffDate,
    effectiveDropoffTime,
    pickupLocation,
    dropoffLocation,
    depositType,
    paymentOption,
    car.dailyPrice,
    car.weeklyPrice,
    car.monthlyPrice,
    car.allowNoDeposit,
    car.noDepositFee,
    car.showRefundableDeposit,
    car.minimumDays,
  ]);

  const gracePeriodMessage = pricing.timingError
    ? pricing.timingError
    : pricing.hasExtraTimeCharge
    ? "1 hour extra return time is free. Longer rentals are calculated automatically."
    : "1 hour extra return time is free.";

  const selectedPickupDateTime = isPickupDateTimeAvailable(
    pickupDate,
    effectivePickupTime
  )
    ? formatSelectedDateTime(pickupDate, effectivePickupTime)
    : "";
  const selectedReturnDateTime = formatSelectedDateTime(
    effectiveDropoffDate,
    effectiveDropoffTime
  );

  function applyPickupDateTime(nextPickupDate: string, nextPickupTime: string) {
    setPickupDate(nextPickupDate);

    if (!nextPickupDate) {
      return;
    }

    const nextMinimumDropoffDate = addDaysToDate(
      nextPickupDate,
      car.minimumDays
    );

    if (!dropoffDate || dropoffDate < nextMinimumDropoffDate) {
      setDropoffDate(nextMinimumDropoffDate);
    }

    const nextPickupSlots = getAvailablePickupSlots(nextPickupDate);

    if (nextPickupSlots.length === 0) {
      setPickupTime("");
      return;
    }

    if (nextPickupSlots.some((slot) => slot.value === nextPickupTime)) {
      setPickupTime(nextPickupTime);
      return;
    }

    setPickupTime(nextPickupSlots[0].value);
  }

  function openDateTimePicker(type: "pickup" | "return") {
    if (activeDateTimePicker === type) {
      setActiveDateTimePicker(null);
      return;
    }

    setActiveDateTimePicker(type);

    if (type === "pickup") {
      const fallbackPickupTime =
        effectivePickupTime || availablePickupTimeSlots[0]?.value || "";
      setDraftDate(pickupDate);
      setDraftTime(fallbackPickupTime);
      return;
    }

    setDraftDate(effectiveDropoffDate);
    setDraftTime(effectiveDropoffTime);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!customerName || !customerPhone || !pickupDate || !effectiveDropoffDate) {
      alert("Please fill all required fields.");
      return;
    }

    if (!isValidPhoneNumber(customerPhone)) {
      alert("Please enter a valid phone number.");
      return;
    }

    if (!isValidEmail(customerEmail)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!effectivePickupTime) {
      alert(
        "No pickup time slots available for the selected date. Please choose another date."
      );
      return;
    }

    if (!isPickupDateTimeAvailable(pickupDate, effectivePickupTime)) {
      alert(
        "No pickup time slots available for the selected date. Please choose another date."
      );
      return;
    }

    if (pricing.timingError) {
      alert(pricing.timingError);
      return;
    }

    if (!acceptedTerms) {
      alert("Please agree to the Terms & Conditions before booking.");
      return;
    }

    if (pricing.totalDays < car.minimumDays) {
      alert(`Minimum booking for ${car.name} is ${car.minimumDays} day(s).`);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const bookingPayload = {
        car_slug: car.slug,
        car_name: car.name,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        pickup_location: formatLocationLabel(pickupLocation),
        dropoff_location: formatLocationLabel(dropoffLocation),
        pickup_date: pickupDate,
        dropoff_date: effectiveDropoffDate,
        pickup_time: effectivePickupTime,
        dropoff_time: effectiveDropoffTime,
        total_days: pricing.totalDays,
        pricing_type: pricing.pricingType.toLowerCase(),
        daily_price: car.dailyPrice,
        weekly_price: car.weeklyPrice,
        monthly_price: car.monthlyPrice,
        base_price: pricing.basePrice,
        pickup_fee: pricing.pickupFee,
        dropoff_fee: pricing.dropoffFee,
        no_deposit_fee: pricing.noDepositFee,
        total_price: pricing.totalPrice,
        deposit_type: depositType,
        payment_option: paymentOption,
        status: "pending",
        payment_status: "unpaid",
      };

      const bookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingPayload),
      });

      const bookingData = await bookingRes.json();

      if (!bookingRes.ok) {
        alert(bookingData.error || "Booking failed");
        setLoading(false);
        return;
      }

      const createdBookingNumber =
        bookingData?.booking?.booking_number || bookingData?.bookingNumber;

      if (!createdBookingNumber) {
        alert("Booking created but booking number was not returned.");
        setLoading(false);
        return;
      }

      const stripeRes = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: createdBookingNumber,
          paymentType: paymentOption === "advance" ? "advance" : "full",
        }),
      });

      const stripeData = await stripeRes.json();

      if (!stripeRes.ok) {
        alert(stripeData.error || "Stripe session failed");
        setLoading(false);
        return;
      }

      if (!stripeData.url) {
        alert("Stripe checkout URL was not returned.");
        setLoading(false);
        return;
      }

      window.location.href = stripeData.url;
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
      setLoading(false);
    }
  }

  const inputClassName =
    "w-full min-w-0 rounded-xl border border-gray-300 px-4 py-3 text-base";
  const dateInputClassName = `${inputClassName} pr-12`;
  const labelClassName = "mb-1.5 block text-sm font-medium text-gray-800";

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-6 max-w-5xl rounded-2xl bg-white p-4 shadow-sm md:p-6"
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="w-full max-w-md mx-auto px-4 overflow-x-hidden">
          <h2 className="mb-1 text-2xl font-bold text-gray-900">
            Book {car.name}
          </h2>

          <div className="mb-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-800">
              Minimum booking: {car.minimumDays} day{car.minimumDays > 1 ? "s" : ""}
            </span>
            <span className="rounded-full bg-purple-100 px-3 py-1.5 text-xs font-semibold text-purple-900">
              Driver Age 25+ and 1 year old license
            </span>

            {!car.showRefundableDeposit && !car.allowNoDeposit && (
              <span className="rounded-full bg-green-100 px-3 py-1.5 text-xs font-medium text-green-800">
                No deposit required
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className={labelClassName}>Full Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className={inputClassName}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className={labelClassName}>Phone Number</label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(sanitizePhoneInput(e.target.value))}
                className={inputClassName}
                placeholder="Enter your phone number"
                inputMode="tel"
                autoComplete="tel"
                pattern="^\+?\d{9,15}$"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClassName}>Email</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className={inputClassName}
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>

            <div>
              <label className={labelClassName}>Delivery To</label>
              <select
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className={inputClassName}
                required
              >
                {CITY_OPTIONS.map((city) => (
                  <option key={city.value} value={city.value}>
                    {city.displayLabel}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClassName}>Collection From</label>
              <select
                value={dropoffLocation}
                onChange={(e) => setDropoffLocation(e.target.value)}
                className={inputClassName}
                required
              >
                {CITY_OPTIONS.map((city) => (
                  <option key={city.value} value={city.value}>
                    {city.displayLabel}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-semibold text-gray-900">
                Booking Dates
              </h3>

              <div>
                <label className={labelClassName}>Pickup Date & Time</label>
                <button
                  type="button"
                  onClick={() => openDateTimePicker("pickup")}
                  className={`${inputClassName} flex min-h-14 items-center justify-between text-left ${
                    selectedPickupDateTime ? "text-gray-900" : "text-gray-500"
                  }`}
                  aria-expanded={activeDateTimePicker === "pickup"}
                >
                  <span>
                    {selectedPickupDateTime || "Select pickup date & time"}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`h-2 w-2 shrink-0 border-b-2 border-r-2 border-gray-700 ${
                      activeDateTimePicker === "pickup"
                        ? "-rotate-135"
                        : "rotate-45"
                    }`}
                  />
                </button>

                {activeDateTimePicker === "pickup" && (
                  <div className="mt-3 space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
                    <div>
                      <label className={labelClassName}>Date</label>
                      <input
                        type="date"
                        value={draftDate}
                        onChange={(e) => {
                          const nextDate = e.target.value;
                          setDraftDate(nextDate);

                          const nextSlots = getAvailablePickupSlots(nextDate);
                          const nextTime = nextSlots.some(
                            (slot) => slot.value === draftTime
                          )
                            ? draftTime
                            : nextSlots[0]?.value || "";
                          setDraftTime(nextTime);
                          applyPickupDateTime(nextDate, nextTime);
                          if (nextDate && nextTime) {
                            setActiveDateTimePicker(null);
                          }
                        }}
                        min={today}
                        className={dateInputClassName}
                      />
                    </div>

                    <div>
                      <label className={labelClassName}>Time</label>
                      <select
                        value={draftTime}
                        onChange={(e) => {
                          setDraftTime(e.target.value);
                          applyPickupDateTime(draftDate, e.target.value);
                          if (draftDate && e.target.value) {
                            setActiveDateTimePicker(null);
                          }
                        }}
                        className={inputClassName}
                        disabled={getAvailablePickupSlots(draftDate).length === 0}
                      >
                        {getAvailablePickupSlots(draftDate).length === 0 ? (
                          <option value="">No slots available</option>
                        ) : (
                          getAvailablePickupSlots(draftDate).map((slot) => (
                            <option key={slot.value} value={slot.value}>
                              {slot.label}
                            </option>
                          ))
                        )}
                      </select>
                    </div>

                    {draftDate && getAvailablePickupSlots(draftDate).length === 0 ? (
                      <p className="text-xs text-red-500">
                        Same-day delivery is not available now. Choose another date.
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500">
                        Same-day booking needs a 2-hour buffer.
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className={labelClassName}>Return Date & Time</label>
                <button
                  type="button"
                  onClick={() => openDateTimePicker("return")}
                  className={`${inputClassName} flex min-h-14 items-center justify-between text-left ${
                    selectedReturnDateTime ? "text-gray-900" : "text-gray-500"
                  } ${pricing.timingError ? "border-red-300" : ""}`}
                  aria-expanded={activeDateTimePicker === "return"}
                >
                  <span>
                    {selectedReturnDateTime || "Select return date & time"}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`h-2 w-2 shrink-0 border-b-2 border-r-2 border-gray-700 ${
                      activeDateTimePicker === "return"
                        ? "-rotate-135"
                        : "rotate-45"
                    }`}
                  />
                </button>

                {activeDateTimePicker === "return" && (
                  <div className="mt-3 space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
                    <div>
                      <label className={labelClassName}>Date</label>
                      <input
                        type="date"
                        value={draftDate}
                        onChange={(e) => {
                          setDraftDate(e.target.value);
                          setDropoffDate(e.target.value);
                          if (e.target.value && draftTime) {
                            setActiveDateTimePicker(null);
                          }
                        }}
                        min={minimumDropoffDate}
                        className={dateInputClassName}
                      />
                    </div>

                    <div>
                      <label className={labelClassName}>Time</label>
                      <select
                        value={draftTime}
                        onChange={(e) => {
                          setDraftTime(e.target.value);
                          setDropoffTime(e.target.value);
                          if (draftDate && e.target.value) {
                            setActiveDateTimePicker(null);
                          }
                        }}
                        className={inputClassName}
                      >
                        {availableDropoffTimeSlots.map((slot) => (
                          <option key={slot.value} value={slot.value}>
                            {slot.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <p
                  className={`mt-2 text-xs ${
                    pricing.timingError
                      ? "text-red-600"
                      : "text-gray-500"
                  }`}
                >
                  {gracePeriodMessage}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Minimum {car.minimumDays} day{car.minimumDays > 1 ? "s" : ""} booking.
                </p>
              </div>
            </div>

            {(car.showRefundableDeposit || car.allowNoDeposit) && (
              <div>
                <label className={labelClassName}>Deposit Option</label>
                <select
                  value={depositType}
                  onChange={(e) => setDepositType(e.target.value)}
                  className={inputClassName}
                >
                  {car.showRefundableDeposit && (
                    <option value="with_deposit">
                      Refundable Deposit - AED {REFUNDABLE_DEPOSIT_AMOUNT}
                    </option>
                  )}
                  {car.allowNoDeposit && (
                    <option value="no_deposit">
                      No Deposit Waiver Fee - AED {car.noDepositFee}
                    </option>
                  )}
                </select>
              </div>
            )}

            {!car.showRefundableDeposit && !car.allowNoDeposit && (
              <div>
                <label className={labelClassName}>Deposit Policy</label>
                <div className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-800">
                  No deposit required for this car
                </div>
              </div>
            )}

            <div>
              <label className={labelClassName}>Payment Option</label>
              <select
                value={paymentOption}
                onChange={(e) => setPaymentOption(e.target.value)}
                className={inputClassName}
              >
                <option value="advance">Pay AED {pricing.payNow} Advance</option>
                <option value="full">Pay Full Amount</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
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
        </div>

        <div>
          <div className="rounded-2xl bg-gray-50 p-4 lg:sticky lg:top-4">
            <h3 className="mb-3 text-lg font-bold text-gray-900">
              Booking Summary
            </h3>

            <div className="space-y-2 text-sm">
              <div
                className={`rounded-xl px-3 py-2 text-xs ${
                  pricing.timingError
                    ? "bg-red-50 text-red-700"
                    : pricing.hasExtraTimeCharge
                    ? "bg-amber-50 text-amber-800"
                    : "bg-green-50 text-green-700"
                }`}
              >
                {gracePeriodMessage}
              </div>

              <div className="flex items-center justify-between">
                <span>Total Days</span>
                <span className="font-medium">{pricing.totalDays}</span>
              </div>

              <div className="flex items-center justify-between">
                <span>Pricing Type</span>
                <span className="font-medium">{pricing.pricingType}</span>
              </div>

              <div className="flex items-center justify-between">
                <span>
                  Base Price
                  {pricing.basePriceBreakdown && (
                    <span className="block text-xs text-gray-500">
                      {pricing.basePriceBreakdown}
                    </span>
                  )}
                </span>
                <span className="font-medium">AED {pricing.basePrice}</span>
              </div>

              <div className="flex items-center justify-between">
                <span>Delivery Fee</span>
                <span className="font-medium">AED {pricing.pickupFee}</span>
              </div>

              <div className="flex items-center justify-between">
                <span>Collection Fee</span>
                <span className="font-medium">AED {pricing.dropoffFee}</span>
              </div>

              {pricing.refundableDepositAmount > 0 && (
                <div className="flex items-center justify-between">
                  <span>Refundable Deposit</span>
                  <span className="font-medium">
                    AED {pricing.refundableDepositAmount}
                  </span>
                </div>
              )}

              {pricing.noDepositFee > 0 && (
                <div className="flex items-center justify-between">
                  <span>No Deposit Waiver Fee</span>
                  <span className="font-medium">AED {pricing.noDepositFee}</span>
                </div>
              )}

              {!car.showRefundableDeposit && !car.allowNoDeposit && (
                <div className="flex items-center justify-between">
                  <span>Deposit Policy</span>
                  <span className="font-medium">No deposit required</span>
                </div>
              )}

              <div className="border-t border-gray-200 pt-3">
                <div className="flex items-center justify-between text-base font-bold text-gray-900">
                  <span>Total Price</span>
                  <span>AED {pricing.totalPrice}</span>
                </div>

                <div className="mt-2 flex items-center justify-between text-base font-bold text-gray-900">
                  <span>Pay Now</span>
                  <span>AED {pricing.payNow}</span>
                </div>
              </div>

              <div className="mt-3 rounded-2xl bg-white px-4 py-3">
                <p className="text-sm font-medium text-gray-800">
                  Advance payment required to confirm booking.
                </p>
                <p className="mt-1 text-xs text-gray-600">
                  Balance payable by cash on delivery or card.
                </p>
                {pricing.refundableDepositAmount > 0 && (
                  <p className="mt-2 text-xs text-gray-500">
                    Refundable deposit is included above and returned within 10
                    days after car return, subject to fines, Salik, and damage
                    checks.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <button
                type="submit"
                disabled={loading || noPickupSlotsAvailable || !acceptedTerms}
                className="w-full rounded-xl bg-black px-5 py-3 text-base font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Processing..."
                  : paymentOption === "advance"
                  ? `Continue to Pay AED ${pricing.payNow} Advance`
                  : `Continue to Pay AED ${pricing.totalPrice}`}
              </button>

              <p className="mt-2 text-center text-xs text-gray-500">
                Secure online payment. Delivery timing will be confirmed by our
                team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
