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

function isSameDate(dateA: Date, dateB: Date) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

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

  const today = new Date();
  const pickedDate = new Date(`${selectedDate}T00:00:00`);

  if (!isSameDate(today, pickedDate)) {
    return TIME_SLOTS;
  }

  const minAllowed = new Date();
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

function mapHeroLocationToBookingValue(value: string) {
  const normalized = value.trim().toLowerCase();

  if (normalized === "ajman") return "ajman";
  if (normalized === "sharjah") return "sharjah";
  if (normalized === "dubai") return "dubai-north";
  if (
    normalized === "uaq" ||
    normalized === "umm al quwain" ||
    normalized === "umm-al-quwain"
  ) {
    return "umm-al-quwain";
  }

  return "sharjah";
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

export default function BookingForm({ car }: BookingFormProps) {
  const searchParams = useSearchParams();
  const pickupLocationFromUrl = searchParams.get("pickupLocation");
  const dropoffLocationFromUrl = searchParams.get("dropoffLocation");
  const pickupDateFromUrl = searchParams.get("pickupDate");
  const returnDateFromUrl = searchParams.get("returnDate");

  const initialPickupLocation = pickupLocationFromUrl
    ? mapHeroLocationToBookingValue(pickupLocationFromUrl)
    : "sharjah";
  const initialDropoffLocation = dropoffLocationFromUrl
    ? mapHeroLocationToBookingValue(dropoffLocationFromUrl)
    : "sharjah";
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

  const [depositType, setDepositType] = useState(initialDepositType);
  const [paymentOption, setPaymentOption] = useState("advance");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [loading, setLoading] = useState(false);

  const todayDateString = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(now.getDate()).padStart(2, "0")}`;
  }, []);

  const minimumDropoffDate = useMemo(() => {
    if (!pickupDate) return todayDateString;
    return addDaysToDate(pickupDate, car.minimumDays);
  }, [pickupDate, car.minimumDays, todayDateString]);

  const availablePickupTimeSlots = useMemo(() => {
    return getAvailablePickupSlots(pickupDate);
  }, [pickupDate]);

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

    if (pickupDate && effectiveDropoffDate) {
      const start = new Date(`${pickupDate}T00:00:00`);
      const end = new Date(`${effectiveDropoffDate}T00:00:00`);

      const diffTime = end.getTime() - start.getTime();
      let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) {
        diffDays = 1;
      }

      totalDays = diffDays;

      if (totalDays >= 30) {
        pricingType = "Monthly";
        basePrice = Math.ceil(totalDays / 30) * car.monthlyPrice;
      } else if (totalDays >= 7) {
        pricingType = "Weekly";
        basePrice = Math.ceil(totalDays / 7) * car.weeklyPrice;
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
    const payNow = paymentOption === "advance" ? 50 : totalPrice;

    return {
      totalDays,
      pricingType,
      basePrice,
      pickupFee,
      dropoffFee,
      noDepositFee,
      refundableDepositAmount,
      totalPrice,
      payNow,
    };
  }, [
    pickupDate,
    effectiveDropoffDate,
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
  ]);

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
    "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black";
  const labelClassName = "mb-1.5 block text-sm font-medium text-gray-800";

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-6 max-w-5xl rounded-2xl bg-white p-4 shadow-sm md:p-6"
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h2 className="mb-1 text-2xl font-bold text-gray-900">
            Book {car.name}
          </h2>

          <div className="mb-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-800">
              Minimum booking: {car.minimumDays} day{car.minimumDays > 1 ? "s" : ""}
            </span>

            {!car.showRefundableDeposit && !car.allowNoDeposit && (
              <span className="rounded-full bg-green-100 px-3 py-1.5 text-xs font-medium text-green-800">
                No deposit required
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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

            <div>
              <label className={labelClassName}>Pickup Date</label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => {
                  const nextPickupDate = e.target.value;
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

                  if (!nextPickupSlots.some((slot) => slot.value === pickupTime)) {
                    setPickupTime(nextPickupSlots[0].value);
                  }
                }}
                min={todayDateString}
                className={inputClassName}
                required
              />
            </div>

            <div>
              <label className={labelClassName}>Dropoff Date</label>
              <input
                type="date"
                value={effectiveDropoffDate}
                onChange={(e) => setDropoffDate(e.target.value)}
                min={minimumDropoffDate}
                className={inputClassName}
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Minimum {car.minimumDays} day{car.minimumDays > 1 ? "s" : ""} booking.
              </p>
            </div>

            <div>
              <label className={labelClassName}>Pickup Time</label>
              <select
                value={effectivePickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className={inputClassName}
                required
                disabled={availablePickupTimeSlots.length === 0}
              >
                {availablePickupTimeSlots.length === 0 ? (
                  <option value="">No slots available</option>
                ) : (
                  availablePickupTimeSlots.map((slot) => (
                    <option key={slot.value} value={slot.value}>
                      {slot.label}
                    </option>
                  ))
                )}
              </select>

              {noPickupSlotsAvailable ? (
                <p className="mt-1 text-xs text-red-500">
                  Same-day delivery is not available now. Choose another date.
                </p>
              ) : (
                <p className="mt-1 text-xs text-gray-500">
                  Same-day booking needs a 2-hour buffer.
                </p>
              )}
            </div>

            <div>
              <label className={labelClassName}>Dropoff Time</label>
              <select
                value={effectiveDropoffTime}
                onChange={(e) => setDropoffTime(e.target.value)}
                className={inputClassName}
                required
              >
                {availableDropoffTimeSlots.map((slot) => (
                  <option key={slot.value} value={slot.value}>
                    {slot.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Timing is subject to confirmation.
              </p>
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
                <option value="advance">Pay AED 50 Advance</option>
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
              <div className="flex items-center justify-between">
                <span>Total Days</span>
                <span className="font-medium">{pricing.totalDays}</span>
              </div>

              <div className="flex items-center justify-between">
                <span>Pricing Type</span>
                <span className="font-medium">{pricing.pricingType}</span>
              </div>

              <div className="flex items-center justify-between">
                <span>Base Price</span>
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

              <div className="flex items-center justify-between">
                <span>Delivery Total</span>
                <span className="font-medium">
                  AED {pricing.pickupFee + pricing.dropoffFee}
                </span>
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
                  AED 50 advance required to confirm booking.
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
                  ? "Continue to Pay AED 50 Advance"
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
