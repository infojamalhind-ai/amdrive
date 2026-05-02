"use client";

import { useMemo, useState } from "react";
import SendChargePaymentLinkButton from "@/app/components/admin/SendChargePaymentLinkButton";

type Charge = {
  id: string;
  booking_id: string;
  charge_type?: string | null;
  title?: string | null;
  description?: string | null;
  amount?: number | string | null;
  status?: string | null;
  created_at?: string | null;
};

type Booking = {
  id?: string | null;
  booking_number?: string | null;
  customer_name?: string | null;
  customer_phone?: string | null;
  customer_email?: string | null;
  car_name?: string | null;
  pickup_location?: string | null;
  dropoff_location?: string | null;
  pickup_date?: string | null;
  dropoff_date?: string | null;
  pickup_time?: string | null;
  dropoff_time?: string | null;
  total_days?: number | null;
  total_price?: number | string | null;
  advance_paid?: number | string | null;
  amount_paid?: number | string | null;
  remaining_paid?: number | string | null;
  pending_amount?: number | string | null;
  payment_status?: string | null;
  booking_status?: string | null;
  status?: string | null;
  deposit_type?: string | null;
  created_at?: string | null;
  created_from?: string | null;
};

type Props = {
  bookings: Booking[];
  charges: Charge[];
};

type ChargeFormState = {
  charge_type: string;
  title: string;
  description: string;
  amount: string;
};

const safeText = (value: unknown) => String(value ?? "").trim();
const safeLower = (value: unknown) => safeText(value).toLowerCase();

const safeNumber = (value: unknown) => {
  const num = Number(value ?? 0);
  return Number.isFinite(num) ? num : 0;
};

const formatMoney = (value: unknown) => `AED ${safeNumber(value).toFixed(2)}`;

const formatDate = (value: unknown) => {
  if (!value) return "-";
  const d = new Date(String(value));
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString();
};

const formatDateTime = (value: unknown) => {
  if (!value) return "-";
  const d = new Date(String(value));
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString();
};

const normalizeWhatsAppPhone = (value: unknown) => {
  const digits = safeText(value).replace(/\D/g, "");

  if (!digits) return "";

  if (digits.startsWith("971")) {
    return digits;
  }

  if (digits.startsWith("00")) {
    return digits.slice(2);
  }

  // UAE local mobile formats like 0501234567 or 501234567
  if (digits.startsWith("0") && digits.length === 10) {
    return `971${digits.slice(1)}`;
  }

  if (digits.length === 9) {
    return `971${digits}`;
  }

  return digits;
};

const getPaidAmount = (booking: Booking) =>
  safeNumber(booking.advance_paid ?? booking.amount_paid) +
  safeNumber(booking.remaining_paid);

const getPendingAmount = (booking: Booking) =>
  Math.max(safeNumber(booking.pending_amount), 0);

const canMarkCashReceived = (booking: Booking) =>
  getPendingAmount(booking) > 0 && getPaidAmount(booking) > 0;

const getPaymentLinkType = (booking: Booking): "advance" | "remaining" | null => {
  const pendingAmount = getPendingAmount(booking);

  if (pendingAmount <= 0) {
    return null;
  }

  const paymentStatus = safeLower(booking.payment_status);
  const paidAmount = getPaidAmount(booking);
  const hasAdvanceBeenPaid =
    paidAmount > 0 ||
    paymentStatus === "advance_paid" ||
    paymentStatus === "partial" ||
    paymentStatus === "partially_paid";

  return hasAdvanceBeenPaid ? "remaining" : "advance";
};

const getPaymentLinkLabel = (booking: Booking) =>
  getPaymentLinkType(booking) === "remaining"
    ? "Generate Balance Link"
    : "Generate Advance Link";

const getPaymentHelpText = (booking: Booking) =>
  getPaymentLinkType(booking) === "remaining"
    ? "Generate the remaining balance link, then copy it or send it by WhatsApp to the customer."
    : "Generate the advance payment link, then copy it or send it by WhatsApp to the customer.";

const getStatusClass = (status: string) => {
  const s = safeLower(status);

  if (s === "paid" || s === "confirmed" || s === "completed" || s === "delivered") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (s === "advance_paid" || s === "partial") {
    return "bg-amber-100 text-amber-700";
  }

  if (s === "pending" || s === "unpaid" || s === "new") {
    return "bg-slate-100 text-slate-700";
  }

  if (s === "cancelled" || s === "failed" || s === "refunded") {
    return "bg-red-100 text-red-700";
  }

  return "bg-slate-100 text-slate-700";
};

const defaultChargeForm = (): ChargeFormState => ({
  charge_type: "other",
  title: "",
  description: "",
  amount: "",
});

export default function AdminBookingsTable({
  bookings,
  charges: initialCharges,
}: Props) {
  const [bookingsState, setBookingsState] = useState<Booking[]>(bookings || []);
  const [searchText, setSearchText] = useState("");
  const [bookingStatusFilter, setBookingStatusFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [addingChargeFor, setAddingChargeFor] = useState<Record<string, boolean>>({});
  const [chargeForms, setChargeForms] = useState<Record<string, ChargeFormState>>({});
  const [submittingChargeFor, setSubmittingChargeFor] = useState<Record<string, boolean>>(
    {}
  );

  const [chargesState, setChargesState] = useState<Charge[]>(initialCharges || []);

  const [advanceLinks, setAdvanceLinks] = useState<Record<string, string>>({});
  const [loadingAdvanceLinkFor, setLoadingAdvanceLinkFor] = useState<
    Record<string, boolean>
  >({});
  const [markingCashFor, setMarkingCashFor] = useState<Record<string, boolean>>({});

  const normalizedSearch = searchText.toLowerCase();

  const chargesByBookingId = useMemo(() => {
    const map: Record<string, Charge[]> = {};

    for (const charge of chargesState || []) {
      const bookingId = safeText(charge.booking_id);
      if (!bookingId) continue;

      if (!map[bookingId]) {
        map[bookingId] = [];
      }

      map[bookingId].push(charge);
    }

    return map;
  }, [chargesState]);

  const filteredBookings = useMemo(() => {
    return bookingsState.filter((booking) => {
      const bookingNumber = safeLower(booking.booking_number);
      const customerName = safeLower(booking.customer_name);
      const customerPhone = safeLower(booking.customer_phone);
      const customerEmail = safeLower(booking.customer_email);
      const carName = safeLower(booking.car_name);
      const pickupLocation = safeLower(booking.pickup_location);
      const dropoffLocation = safeLower(booking.dropoff_location);
      const bookingStatus = safeLower(booking.booking_status || booking.status);
      const paymentStatus = safeLower(booking.payment_status);

      const matchesSearch =
        !normalizedSearch ||
        bookingNumber.includes(normalizedSearch) ||
        customerName.includes(normalizedSearch) ||
        customerPhone.includes(normalizedSearch) ||
        customerEmail.includes(normalizedSearch) ||
        carName.includes(normalizedSearch) ||
        pickupLocation.includes(normalizedSearch) ||
        dropoffLocation.includes(normalizedSearch);

      const matchesBookingStatus =
        bookingStatusFilter === "all" ||
        bookingStatus === safeLower(bookingStatusFilter);

      const matchesPaymentStatus =
        paymentStatusFilter === "all" ||
        paymentStatus === safeLower(paymentStatusFilter);

      return matchesSearch && matchesBookingStatus && matchesPaymentStatus;
    });
  }, [bookingsState, normalizedSearch, bookingStatusFilter, paymentStatusFilter]);

  const summary = useMemo(() => {
    const totalBookings = filteredBookings.length;
    const totalRevenue = filteredBookings.reduce(
      (sum, item) => sum + safeNumber(item.total_price),
      0
    );
    const totalPaid = filteredBookings.reduce(
      (sum, item) => sum + getPaidAmount(item),
      0
    );
    const totalPending = filteredBookings.reduce(
      (sum, item) => sum + safeNumber(item.pending_amount),
      0
    );
    const unpaidCount = filteredBookings.filter(
      (item) => safeLower(item.payment_status) === "unpaid"
    ).length;
    const advanceCount = filteredBookings.filter(
      (item) => safeLower(item.payment_status) === "advance_paid"
    ).length;
    const paidCount = filteredBookings.filter(
      (item) => safeLower(item.payment_status) === "paid"
    ).length;

    return {
      totalBookings,
      totalRevenue,
      totalPaid,
      totalPending,
      unpaidCount,
      advanceCount,
      paidCount,
    };
  }, [filteredBookings]);

  const toggleRow = (rowKey: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowKey]: !prev[rowKey],
    }));
  };

  const toggleAddCharge = (rowKey: string, bookingId: string) => {
    if (!bookingId) {
      alert("Booking ID not found");
      return;
    }

    setAddingChargeFor((prev) => {
      const nextValue = !prev[bookingId];

      if (nextValue && rowKey) {
        setExpandedRows((expandedPrev) => ({
          ...expandedPrev,
          [rowKey]: true,
        }));
      }

      return {
        ...prev,
        [bookingId]: nextValue,
      };
    });

    setChargeForms((prev) => ({
      ...prev,
      [bookingId]: prev[bookingId] || defaultChargeForm(),
    }));
  };

  const updateChargeForm = (
    bookingId: string,
    field: keyof ChargeFormState,
    value: string
  ) => {
    setChargeForms((prev) => ({
      ...prev,
      [bookingId]: {
        ...(prev[bookingId] || defaultChargeForm()),
        [field]: value,
      },
    }));
  };

  const submitCharge = async (bookingId: string) => {
    if (!bookingId) {
      alert("Booking ID missing");
      return;
    }

    const form = chargeForms[bookingId] || defaultChargeForm();

    if (!safeText(form.title)) {
      alert("Please enter charge title");
      return;
    }

    if (safeNumber(form.amount) <= 0) {
      alert("Please enter valid amount");
      return;
    }

    try {
      setSubmittingChargeFor((prev) => ({
        ...prev,
        [bookingId]: true,
      }));

      const res = await fetch("/api/admin/charges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          booking_id: bookingId,
          charge_type: form.charge_type,
          title: form.title,
          description: form.description,
          amount: safeNumber(form.amount),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to add charge");
        return;
      }

      const newCharge: Charge =
        data.charge || {
          id: crypto.randomUUID(),
          booking_id: bookingId,
          charge_type: form.charge_type,
          title: form.title,
          description: form.description,
          amount: safeNumber(form.amount),
          status: "unpaid",
          created_at: new Date().toISOString(),
        };

      setChargesState((prev) => [newCharge, ...prev]);

      setChargeForms((prev) => ({
        ...prev,
        [bookingId]: defaultChargeForm(),
      }));

      setAddingChargeFor((prev) => ({
        ...prev,
        [bookingId]: false,
      }));

      alert("Extra charge added successfully");
    } catch (error) {
      console.error(error);
      alert("Something went wrong while adding charge");
    } finally {
      setSubmittingChargeFor((prev) => ({
        ...prev,
        [bookingId]: false,
      }));
    }
  };

  async function generateAdvanceLink(booking: Booking) {
    const bookingNumber = safeText(booking.booking_number);
    const paymentType = getPaymentLinkType(booking);

    if (!bookingNumber) {
      alert("Booking number not found");
      return;
    }

    if (!paymentType) {
      alert("This booking does not have any pending amount left");
      return;
    }

    try {
      setLoadingAdvanceLinkFor((prev) => ({
        ...prev,
        [bookingNumber]: true,
      }));

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: bookingNumber,
          paymentType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to generate payment link");
        return;
      }

      if (!data.url) {
        alert("Payment link was not returned");
        return;
      }

      setAdvanceLinks((prev) => ({
        ...prev,
        [bookingNumber]: data.url,
      }));

      await navigator.clipboard.writeText(data.url);
      alert(
        paymentType === "remaining"
          ? "Balance payment link generated and copied"
          : "Advance payment link generated and copied"
      );
    } catch (error) {
      console.error(error);
      alert("Something went wrong while generating payment link");
    } finally {
      setLoadingAdvanceLinkFor((prev) => ({
        ...prev,
        [bookingNumber]: false,
      }));
    }
  }

  async function copyAdvanceLink(bookingNumber: string) {
    const link = advanceLinks[bookingNumber];
    if (!link) {
      alert("Please generate link first");
      return;
    }

    try {
      await navigator.clipboard.writeText(link);
      alert("Payment link copied");
    } catch (error) {
      console.error(error);
      alert("Failed to copy payment link");
    }
  }

  function openAdvanceLink(bookingNumber: string) {
    const link = advanceLinks[bookingNumber];
    if (!link) {
      alert("Please generate link first");
      return;
    }

    window.open(link, "_blank", "noopener,noreferrer");
  }

  function sendWhatsAppMessage(booking: Booking) {
    const bookingNumber = safeText(booking.booking_number);
    const link = advanceLinks[bookingNumber];

    if (!link) {
      alert("Please generate link first");
      return;
    }

    const rawPhone = safeText(booking.customer_phone);
    if (!rawPhone) {
      alert("Customer phone not found");
      return;
    }

    const phoneDigits = normalizeWhatsAppPhone(rawPhone);
    if (!phoneDigits) {
      alert("Customer phone is invalid");
      return;
    }

    const customerName = safeText(booking.customer_name) || "Customer";
    const carName = safeText(booking.car_name) || "-";
    const pickupDate = formatDate(booking.pickup_date);
    const pickupTime = safeText(booking.pickup_time) || "-";
    const dropoffDate = formatDate(booking.dropoff_date);
    const dropoffTime = safeText(booking.dropoff_time) || "-";
    const pickupLocation = safeText(booking.pickup_location) || "-";
    const dropoffLocation = safeText(booking.dropoff_location) || "-";
    const totalPrice = formatMoney(booking.total_price);
    const paidAmount = formatMoney(getPaidAmount(booking));
    const pendingAmount = formatMoney(getPendingAmount(booking));
    const paymentType = getPaymentLinkType(booking) || "advance";
    const paymentAmount =
      paymentType === "remaining" ? pendingAmount : formatMoney(50);
    const paymentLabel =
      paymentType === "remaining" ? "Balance Payment Now" : "Advance Payment Now";

    const message = `Hello ${customerName},

Your booking has been created successfully.

Booking No: ${bookingNumber}
Car: ${carName}
Pickup: ${pickupLocation} - ${pickupDate} - ${pickupTime}
Return: ${dropoffLocation} - ${dropoffDate} - ${dropoffTime}
Total Rent: ${totalPrice}
Already Paid: ${paidAmount}
Pending Amount: ${pendingAmount}
${paymentLabel}: ${paymentAmount}

Please use the secure payment link below to confirm your booking:
${link}

Thank you,
AMJDrive`;

    const whatsappUrl = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  async function markCashReceived(booking: Booking) {
    const bookingId = safeText(booking.id);
    const bookingNumber = safeText(booking.booking_number);
    const pendingAmount = getPendingAmount(booking);

    if (!bookingId) {
      alert("Booking ID not found");
      return;
    }

    if (pendingAmount <= 0) {
      alert("This booking has no pending balance");
      return;
    }

    const confirmed = window.confirm(
      `Mark ${formatMoney(pendingAmount)} cash received for ${bookingNumber || "this booking"}?`
    );

    if (!confirmed) return;

    try {
      setMarkingCashFor((prev) => ({
        ...prev,
        [bookingId]: true,
      }));

      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "mark_cash_received",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to mark cash received");
        return;
      }

      if (data.booking) {
        setBookingsState((prev) =>
          prev.map((item) =>
            safeText(item.id) === bookingId ? { ...item, ...data.booking } : item
          )
        );
      }

      alert("Cash payment marked received");
    } catch (error) {
      console.error(error);
      alert("Something went wrong while marking cash received");
    } finally {
      setMarkingCashFor((prev) => ({
        ...prev,
        [bookingId]: false,
      }));
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Bookings</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {summary.totalBookings}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Total Revenue</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {formatMoney(summary.totalRevenue)}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Advance / Paid</p>
          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {formatMoney(summary.totalPaid)}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Pending Amount</p>
          <p className="mt-2 text-2xl font-bold text-amber-600">
            {formatMoney(summary.totalPending)}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Paid / Advance</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {summary.paidCount} / {summary.advanceCount}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Unpaid</p>
          <p className="mt-2 text-2xl font-bold text-red-600">
            {summary.unpaidCount}
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Search
            </label>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value || "")}
              placeholder="Search booking no, customer, phone, car..."
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none ring-0 focus:border-slate-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Booking Status
            </label>
            <select
              value={bookingStatusFilter}
              onChange={(e) => setBookingStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-slate-400"
            >
              <option value="all">All</option>
              <option value="new">New</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="delivered">Delivered</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Payment Status
            </label>
            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-slate-400"
            >
              <option value="all">All</option>
              <option value="unpaid">Unpaid</option>
              <option value="advance_paid">Advance Paid</option>
              <option value="paid">Paid</option>
              <option value="refunded">Refunded</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4 md:hidden">
        {filteredBookings.length === 0 ? (
          <div className="rounded-2xl bg-white px-4 py-10 text-center text-sm text-slate-500 shadow-sm ring-1 ring-slate-200">
            No bookings found.
          </div>
        ) : (
          filteredBookings.map((booking, index) => {
            const bookingNumber =
              safeText(booking.booking_number) || "No Booking No";

            const uniqueRowKey =
              safeText(booking.id) ||
              safeText(booking.booking_number) ||
              `${safeText(booking.customer_phone)}-${index}` ||
              `row-${index}`;

            const rowToggleKey =
              safeText(booking.id) ||
              safeText(booking.booking_number) ||
              `${safeText(booking.customer_phone)}-${index}` ||
              `toggle-${index}`;

            const bookingId = safeText(booking.id);
            const isExpanded = expandedRows[rowToggleKey];
            const bookingCharges = chargesByBookingId[bookingId] ?? [];

            return (
              <MobileBookingCard
                key={uniqueRowKey}
                booking={booking}
                bookingNumber={bookingNumber}
                charges={bookingCharges}
                isExpanded={!!isExpanded}
                onToggle={() => toggleRow(rowToggleKey)}
                showAddCharge={!!addingChargeFor[bookingId]}
                onToggleAddCharge={() => toggleAddCharge(rowToggleKey, bookingId)}
                chargeForm={chargeForms[bookingId] || defaultChargeForm()}
                onChargeFormChange={(field, value) =>
                  updateChargeForm(bookingId, field, value)
                }
                onSubmitCharge={() => submitCharge(bookingId)}
                chargeSubmitting={!!submittingChargeFor[bookingId]}
                advanceLink={advanceLinks[bookingNumber] || ""}
                isGeneratingAdvanceLink={!!loadingAdvanceLinkFor[bookingNumber]}
                onGenerateAdvanceLink={() => generateAdvanceLink(booking)}
                onCopyAdvanceLink={() => copyAdvanceLink(bookingNumber)}
                onOpenAdvanceLink={() => openAdvanceLink(bookingNumber)}
                onWhatsAppCustomer={() => sendWhatsAppMessage(booking)}
                canMarkCashReceived={canMarkCashReceived(booking)}
                isMarkingCashReceived={!!markingCashFor[bookingId]}
                onMarkCashReceived={() => markCashReceived(booking)}
              />
            );
          })
        )}
      </div>

      <div className="hidden overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-slate-600">
                <th className="px-4 py-3 font-semibold">Booking</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Car</th>
                <th className="px-4 py-3 font-semibold">Trip</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Booking Status</th>
                <th className="px-4 py-3 font-semibold">Payment</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking, index) => {
                  const bookingNumber =
                    safeText(booking.booking_number) || "No Booking No";

                  const uniqueRowKey =
                    safeText(booking.id) ||
                    safeText(booking.booking_number) ||
                    `${safeText(booking.customer_phone)}-${index}` ||
                    `row-${index}`;

                  const rowToggleKey =
                    safeText(booking.id) ||
                    safeText(booking.booking_number) ||
                    `${safeText(booking.customer_phone)}-${index}` ||
                    `toggle-${index}`;

                  const bookingId = safeText(booking.id);
                  const isExpanded = expandedRows[rowToggleKey];
                  const bookingCharges = chargesByBookingId[bookingId] ?? [];

                  return (
                    <FragmentRow
                      key={uniqueRowKey}
                      booking={booking}
                      bookingNumber={bookingNumber}
                      charges={bookingCharges}
                      isExpanded={!!isExpanded}
                      onToggle={() => toggleRow(rowToggleKey)}
                      showAddCharge={!!addingChargeFor[bookingId]}
                      onToggleAddCharge={() =>
                        toggleAddCharge(rowToggleKey, bookingId)
                      }
                      chargeForm={chargeForms[bookingId] || defaultChargeForm()}
                      onChargeFormChange={(field, value) =>
                        updateChargeForm(bookingId, field, value)
                      }
                      onSubmitCharge={() => submitCharge(bookingId)}
                      chargeSubmitting={!!submittingChargeFor[bookingId]}
                      advanceLink={advanceLinks[bookingNumber] || ""}
                      isGeneratingAdvanceLink={!!loadingAdvanceLinkFor[bookingNumber]}
                      onGenerateAdvanceLink={() => generateAdvanceLink(booking)}
                      onCopyAdvanceLink={() => copyAdvanceLink(bookingNumber)}
                      onOpenAdvanceLink={() => openAdvanceLink(bookingNumber)}
                      onWhatsAppCustomer={() => sendWhatsAppMessage(booking)}
                      canMarkCashReceived={canMarkCashReceived(booking)}
                      isMarkingCashReceived={!!markingCashFor[bookingId]}
                      onMarkCashReceived={() => markCashReceived(booking)}
                    />
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MobileBookingCard({
  booking,
  bookingNumber,
  charges,
  isExpanded,
  onToggle,
  showAddCharge,
  onToggleAddCharge,
  chargeForm,
  onChargeFormChange,
  onSubmitCharge,
  chargeSubmitting,
  advanceLink,
  isGeneratingAdvanceLink,
  onGenerateAdvanceLink,
  onCopyAdvanceLink,
  onOpenAdvanceLink,
  onWhatsAppCustomer,
  canMarkCashReceived,
  isMarkingCashReceived,
  onMarkCashReceived,
}: {
  booking: Booking;
  bookingNumber: string;
  charges: Charge[];
  isExpanded: boolean;
  onToggle: () => void;
  showAddCharge: boolean;
  onToggleAddCharge: () => void;
  chargeForm: ChargeFormState;
  onChargeFormChange: (field: keyof ChargeFormState, value: string) => void;
  onSubmitCharge: () => void;
  chargeSubmitting: boolean;
  advanceLink: string;
  isGeneratingAdvanceLink: boolean;
  onGenerateAdvanceLink: () => void;
  onCopyAdvanceLink: () => void;
  onOpenAdvanceLink: () => void;
  onWhatsAppCustomer: () => void;
  canMarkCashReceived: boolean;
  isMarkingCashReceived: boolean;
  onMarkCashReceived: () => void;
}) {
  const bookingStatus = safeText(booking.booking_status || booking.status) || "pending";
  const paymentStatus = safeText(booking.payment_status) || "unpaid";
  const paymentLinkType = getPaymentLinkType(booking);
  const canGeneratePaymentLink = !!paymentLinkType;
  const paymentLinkLabel = getPaymentLinkLabel(booking);
  const paymentHelpText = getPaymentHelpText(booking);
  const hasAdvanceLink = !!safeText(advanceLink);
  const bookingId = safeText(booking.id);

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold text-slate-900">{bookingNumber}</h3>
          <p className="mt-1 text-xs text-slate-500">
            Created: {formatDateTime(booking.created_at)}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
              bookingStatus
            )}`}
          >
            {bookingStatus}
          </span>
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
              paymentStatus
            )}`}
          >
            {paymentStatus}
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Customer
          </p>
          <p className="mt-2 font-semibold text-slate-900">
            {safeText(booking.customer_name) || "-"}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            {safeText(booking.customer_phone) || "-"}
          </p>
          <p className="mt-1 break-all text-sm text-slate-500">
            {safeText(booking.customer_email) || "-"}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Car
          </p>
          <p className="mt-2 font-semibold text-slate-900">
            {safeText(booking.car_name) || "-"}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            {safeText(booking.total_days) || 0} day(s)
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Deposit: {safeText(booking.deposit_type) || "-"}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-3 sm:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Trip
          </p>
          <p className="mt-2 text-sm font-medium text-slate-900">
            Pickup: {formatDate(booking.pickup_date)} {safeText(booking.pickup_time)}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            {safeText(booking.pickup_location) || "-"}
          </p>
          <p className="mt-3 text-sm font-medium text-slate-900">
            Return: {formatDate(booking.dropoff_date)} {safeText(booking.dropoff_time)}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            {safeText(booking.dropoff_location) || "-"}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-3 sm:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Amounts
          </p>
          <div className="mt-2 grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
            <div>
              <p className="text-slate-500">Total</p>
              <p className="font-semibold text-slate-900">
                {formatMoney(booking.total_price)}
              </p>
            </div>
          <div>
              <p className="text-slate-500">Paid</p>
              <p className="font-semibold text-emerald-600">
                {formatMoney(getPaidAmount(booking))}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Pending</p>
              <p className="font-semibold text-amber-600">
                {formatMoney(booking.pending_amount)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <button
          type="button"
          onClick={onToggle}
          className="w-full rounded-xl bg-slate-900 px-3 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
        >
          {isExpanded ? "Hide Details" : "View Details"}
        </button>

        {bookingId && (
          <button
            type="button"
            onClick={onToggleAddCharge}
            className="w-full rounded-xl bg-purple-700 px-3 py-2.5 text-sm font-medium text-white hover:bg-purple-800"
          >
            {showAddCharge ? "Hide Add Charge" : "Add Charge"}
          </button>
        )}

        {canMarkCashReceived && (
          <button
            type="button"
            onClick={onMarkCashReceived}
            disabled={isMarkingCashReceived}
            className="w-full rounded-xl bg-amber-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
          >
            {isMarkingCashReceived ? "Marking..." : "Mark Cash Received"}
          </button>
        )}

        {canGeneratePaymentLink && (
          <>
            <button
              type="button"
              onClick={onGenerateAdvanceLink}
              disabled={isGeneratingAdvanceLink}
              className="w-full rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {isGeneratingAdvanceLink ? "Generating..." : paymentLinkLabel}
            </button>

            <button
              type="button"
              onClick={onCopyAdvanceLink}
              disabled={!hasAdvanceLink}
              className="w-full rounded-xl bg-sky-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
            >
              Copy Link
            </button>

            <button
              type="button"
              onClick={onOpenAdvanceLink}
              disabled={!hasAdvanceLink}
              className="w-full rounded-xl bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              Open Link
            </button>

            <button
              type="button"
              onClick={onWhatsAppCustomer}
              disabled={!hasAdvanceLink}
              className="w-full rounded-xl bg-green-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
            >
              WhatsApp Customer
            </button>
          </>
        )}
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <h3 className="text-sm font-semibold text-slate-900">Booking Details</h3>

            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <p>
                <span className="font-medium">Booking No:</span> {bookingNumber}
              </p>
              <p>
                <span className="font-medium">Source:</span>{" "}
                {safeText(booking.created_from) || "website"}
              </p>
              <p>
                <span className="font-medium">Advance Paid:</span>{" "}
                {formatMoney(booking.advance_paid ?? booking.amount_paid)}
              </p>
              <p>
                <span className="font-medium">Cash / Balance Paid:</span>{" "}
                {formatMoney(booking.remaining_paid)}
              </p>
              <p>
                <span className="font-medium">Pending Amount:</span>{" "}
                {formatMoney(booking.pending_amount)}
              </p>
            </div>

            {canGeneratePaymentLink && (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                <p className="text-sm font-semibold text-emerald-800">
                  Manual booking payment flow
                </p>
                <p className="mt-1 text-xs text-emerald-700">
                  {paymentHelpText}
                </p>

                {hasAdvanceLink && (
                  <div className="mt-3 break-all rounded-lg bg-white p-3 text-xs text-slate-600 ring-1 ring-slate-200">
                    {advanceLink}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <h3 className="text-sm font-semibold text-slate-900">Charge History</h3>

            {charges.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">No extra charges yet.</p>
            ) : (
              <div className="mt-3 space-y-3">
                {charges.map((charge, index) => {
                  const chargeKey =
                    safeText(charge.id) ||
                    `${safeText(charge.booking_id)}-${index}`;

                  const chargeStatus = safeText(charge.status) || "unpaid";

                  return (
                    <div
                      key={chargeKey}
                      className="rounded-xl border border-slate-200 bg-white p-3"
                    >
                      <p className="font-medium text-slate-900">
                        {safeText(charge.title) || "Extra Charge"}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        Amount: {formatMoney(charge.amount)}
                      </p>
                      {safeText(charge.description) && (
                        <p className="mt-1 text-sm text-slate-500">
                          Note: {safeText(charge.description)}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-slate-500">
                        Created: {formatDateTime(charge.created_at)}
                      </p>
                      <div className="mt-2 flex flex-col gap-2">
                        <span
                          className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                            chargeStatus
                          )}`}
                        >
                          {chargeStatus}
                        </span>

                        {safeLower(chargeStatus) !== "paid" && charge.id && (
                          <SendChargePaymentLinkButton chargeId={charge.id} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {bookingId && showAddCharge && (
            <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
              <h3 className="text-sm font-semibold text-slate-900">Add Extra Charge</h3>

              <div className="mt-4 grid gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Charge Type
                  </label>
                  <select
                    value={chargeForm.charge_type}
                    onChange={(e) =>
                      onChargeFormChange("charge_type", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
                  >
                    <option value="salik">Salik</option>
                    <option value="fine">Fine</option>
                    <option value="extra_rent">Extra Rent</option>
                    <option value="delivery_charge">Delivery Charge</option>
                    <option value="collection_charge">Collection Charge</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Title
                  </label>
                  <input
                    type="text"
                    value={chargeForm.title}
                    onChange={(e) => onChargeFormChange("title", e.target.value)}
                    placeholder="Example: Salik charges"
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={chargeForm.amount}
                    onChange={(e) => onChargeFormChange("amount", e.target.value)}
                    placeholder="0.00"
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Description / Note
                  </label>
                  <textarea
                    value={chargeForm.description}
                    onChange={(e) =>
                      onChargeFormChange("description", e.target.value)
                    }
                    rows={3}
                    placeholder="Optional note"
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
                  />
                </div>

                <button
                  type="button"
                  onClick={onSubmitCharge}
                  disabled={chargeSubmitting}
                  className="w-full rounded-xl bg-purple-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-800 disabled:opacity-50"
                >
                  {chargeSubmitting ? "Adding..." : "Save Charge"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FragmentRow({
  booking,
  bookingNumber,
  charges,
  isExpanded,
  onToggle,
  showAddCharge,
  onToggleAddCharge,
  chargeForm,
  onChargeFormChange,
  onSubmitCharge,
  chargeSubmitting,
  advanceLink,
  isGeneratingAdvanceLink,
  onGenerateAdvanceLink,
  onCopyAdvanceLink,
  onOpenAdvanceLink,
  onWhatsAppCustomer,
  canMarkCashReceived,
  isMarkingCashReceived,
  onMarkCashReceived,
}: {
  booking: Booking;
  bookingNumber: string;
  charges: Charge[];
  isExpanded: boolean;
  onToggle: () => void;
  showAddCharge: boolean;
  onToggleAddCharge: () => void;
  chargeForm: ChargeFormState;
  onChargeFormChange: (field: keyof ChargeFormState, value: string) => void;
  onSubmitCharge: () => void;
  chargeSubmitting: boolean;
  advanceLink: string;
  isGeneratingAdvanceLink: boolean;
  onGenerateAdvanceLink: () => void;
  onCopyAdvanceLink: () => void;
  onOpenAdvanceLink: () => void;
  onWhatsAppCustomer: () => void;
  canMarkCashReceived: boolean;
  isMarkingCashReceived: boolean;
  onMarkCashReceived: () => void;
}) {
  const bookingStatus = safeText(booking.booking_status || booking.status) || "pending";
  const paidAmount = getPaidAmount(booking);
  const bookingId = safeText(booking.id);
  const paymentStatus = safeText(booking.payment_status) || "unpaid";
  const paymentLinkType = getPaymentLinkType(booking);
  const canGeneratePaymentLink = !!paymentLinkType;
  const paymentLinkLabel = getPaymentLinkLabel(booking);
  const paymentHelpText = getPaymentHelpText(booking);
  const hasAdvanceLink = !!safeText(advanceLink);

  return (
    <>
      <tr className="border-t border-slate-200 align-top">
        <td className="px-4 py-4">
          <div className="font-semibold text-slate-900">{bookingNumber}</div>
          <div className="mt-1 text-xs text-slate-500">
            Created: {formatDateTime(booking.created_at)}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Deposit: {safeText(booking.deposit_type) || "-"}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Source: {safeText(booking.created_from) || "website"}
          </div>
        </td>

        <td className="px-4 py-4">
          <div className="font-medium text-slate-900">
            {safeText(booking.customer_name) || "-"}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {safeText(booking.customer_phone) || "-"}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {safeText(booking.customer_email) || "-"}
          </div>
        </td>

        <td className="px-4 py-4">
          <div className="font-medium text-slate-900">
            {safeText(booking.car_name) || "-"}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {safeText(booking.total_days) || 0} day(s)
          </div>
        </td>

        <td className="px-4 py-4">
          <div className="text-slate-900">
            {formatDate(booking.pickup_date)} {safeText(booking.pickup_time)}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {safeText(booking.pickup_location) || "-"}
          </div>
          <div className="mt-2 text-slate-900">
            {formatDate(booking.dropoff_date)} {safeText(booking.dropoff_time)}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {safeText(booking.dropoff_location) || "-"}
          </div>
        </td>

        <td className="px-4 py-4">
          <div className="font-semibold text-slate-900">
            {formatMoney(booking.total_price)}
          </div>
          <div className="mt-1 text-xs text-emerald-600">
            Paid: {formatMoney(paidAmount)}
          </div>
          <div className="mt-1 text-xs text-amber-600">
            Pending: {formatMoney(booking.pending_amount)}
          </div>
        </td>

        <td className="px-4 py-4">
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
              bookingStatus
            )}`}
          >
            {bookingStatus}
          </span>
        </td>

        <td className="px-4 py-4">
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
              paymentStatus
            )}`}
          >
            {paymentStatus}
          </span>
        </td>

        <td className="px-4 py-4">
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={onToggle}
              className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-700"
            >
              {isExpanded ? "Hide Details" : "View Details"}
            </button>

            {bookingId && (
              <button
                type="button"
                onClick={onToggleAddCharge}
                className="rounded-lg bg-purple-700 px-3 py-2 text-xs font-medium text-white hover:bg-purple-800"
              >
                {showAddCharge ? "Hide Add Charge" : "Add Charge"}
              </button>
            )}

            {canMarkCashReceived && (
              <button
                type="button"
                onClick={onMarkCashReceived}
                disabled={isMarkingCashReceived}
                className="rounded-lg bg-amber-600 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
              >
                {isMarkingCashReceived ? "Marking..." : "Mark Cash Received"}
              </button>
            )}

            {canGeneratePaymentLink && (
              <>
                <button
                  type="button"
                  onClick={onGenerateAdvanceLink}
                  disabled={isGeneratingAdvanceLink}
                  className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {isGeneratingAdvanceLink
                    ? "Generating..."
                    : paymentLinkLabel}
                </button>

                <button
                  type="button"
                  onClick={onCopyAdvanceLink}
                  disabled={!hasAdvanceLink}
                  className="rounded-lg bg-sky-600 px-3 py-2 text-xs font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
                >
                  Copy Link
                </button>

                <button
                  type="button"
                  onClick={onOpenAdvanceLink}
                  disabled={!hasAdvanceLink}
                  className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  Open Link
                </button>

                <button
                  type="button"
                  onClick={onWhatsAppCustomer}
                  disabled={!hasAdvanceLink}
                  className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                >
                  WhatsApp Customer
                </button>
              </>
            )}
          </div>
        </td>
      </tr>

      {isExpanded && (
        <tr className="border-t border-slate-100 bg-slate-50">
          <td colSpan={8} className="px-4 py-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                <h3 className="text-sm font-semibold text-slate-900">
                  Booking Details
                </h3>

                <div className="mt-3 space-y-2 text-sm text-slate-700">
                  <p>
                    <span className="font-medium">Booking No:</span> {bookingNumber}
                  </p>
                  <p>
                    <span className="font-medium">Customer:</span>{" "}
                    {safeText(booking.customer_name) || "-"}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {safeText(booking.customer_phone) || "-"}
                  </p>
                  <p>
                    <span className="font-medium">Car:</span>{" "}
                    {safeText(booking.car_name) || "-"}
                  </p>
                  <p>
                    <span className="font-medium">Booking Status:</span>{" "}
                    {bookingStatus}
                  </p>
                  <p>
                    <span className="font-medium">Payment Status:</span>{" "}
                    {paymentStatus}
                  </p>
                  <p>
                    <span className="font-medium">Advance Paid:</span>{" "}
                    {formatMoney(booking.advance_paid ?? booking.amount_paid)}
                  </p>
                  <p>
                    <span className="font-medium">Cash / Balance Paid:</span>{" "}
                    {formatMoney(booking.remaining_paid)}
                  </p>
                  <p>
                    <span className="font-medium">Pending Amount:</span>{" "}
                    {formatMoney(booking.pending_amount)}
                  </p>
                </div>

                {canGeneratePaymentLink && (
                  <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                    <p className="text-sm font-semibold text-emerald-800">
                      Manual booking payment flow
                    </p>
                    <p className="mt-1 text-xs text-emerald-700">
                      {paymentHelpText}
                    </p>

                    {hasAdvanceLink && (
                      <div className="mt-3 break-all rounded-lg bg-white p-3 text-xs text-slate-600 ring-1 ring-slate-200">
                        {advanceLink}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                <h3 className="text-sm font-semibold text-slate-900">
                  Charge History
                </h3>

                {charges.length === 0 ? (
                  <p className="mt-3 text-sm text-slate-500">No extra charges yet.</p>
                ) : (
                  <div className="mt-3 space-y-3">
                    {charges.map((charge, index) => {
                      const chargeKey =
                        safeText(charge.id) ||
                        `${safeText(charge.booking_id)}-${index}`;

                      const chargeStatus = safeText(charge.status) || "unpaid";

                      return (
                        <div
                          key={chargeKey}
                          className="rounded-xl border border-slate-200 p-3"
                        >
                          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                              <p className="font-medium text-slate-900">
                                {safeText(charge.title) || "Extra Charge"}
                              </p>

                              <p className="mt-1 text-sm text-slate-600">
                                Amount: {formatMoney(charge.amount)}
                              </p>

                              {safeText(charge.description) && (
                                <p className="mt-1 text-sm text-slate-500">
                                  Note: {safeText(charge.description)}
                                </p>
                              )}

                              <p className="mt-1 text-xs text-slate-500">
                                Created: {formatDateTime(charge.created_at)}
                              </p>

                              <div className="mt-2">
                                <span
                                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                                    chargeStatus
                                  )}`}
                                >
                                  {chargeStatus}
                                </span>
                              </div>
                            </div>

                            {safeLower(chargeStatus) !== "paid" && charge.id && (
                              <SendChargePaymentLinkButton chargeId={charge.id} />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {bookingId && showAddCharge && (
              <div className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                <h3 className="text-sm font-semibold text-slate-900">
                  Add Extra Charge
                </h3>

                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Charge Type
                    </label>
                    <select
                      value={chargeForm.charge_type}
                      onChange={(e) =>
                        onChargeFormChange("charge_type", e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
                    >
                      <option value="salik">Salik</option>
                      <option value="fine">Fine</option>
                      <option value="extra_rent">Extra Rent</option>
                      <option value="delivery_charge">Delivery Charge</option>
                      <option value="collection_charge">Collection Charge</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Title
                    </label>
                    <input
                      type="text"
                      value={chargeForm.title}
                      onChange={(e) => onChargeFormChange("title", e.target.value)}
                      placeholder="Example: Salik charges"
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Amount
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={chargeForm.amount}
                      onChange={(e) => onChargeFormChange("amount", e.target.value)}
                      placeholder="0.00"
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
                    />
                  </div>

                  <div className="md:col-span-2 xl:col-span-1 flex items-end">
                    <button
                      type="button"
                      onClick={onSubmitCharge}
                      disabled={chargeSubmitting}
                      className="w-full rounded-xl bg-purple-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-800 disabled:opacity-50"
                    >
                      {chargeSubmitting ? "Adding..." : "Save Charge"}
                    </button>
                  </div>

                  <div className="md:col-span-2 xl:col-span-4">
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Description / Note
                    </label>
                    <textarea
                      value={chargeForm.description}
                      onChange={(e) =>
                        onChargeFormChange("description", e.target.value)
                      }
                      rows={3}
                      placeholder="Optional note"
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  );
}
