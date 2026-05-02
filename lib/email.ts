import { getAbsoluteUrl } from "@/lib/site-url";

type BookingEmailData = {
  booking_number: string;
  customer_name: string;
  customer_email?: string | null;
  customer_phone?: string | null;
  car_name: string;
  pickup_date?: string | null;
  dropoff_date?: string | null;
  pickup_time?: string | null;
  dropoff_time?: string | null;
  pickup_location?: string | null;
  dropoff_location?: string | null;
  total_days?: number | null;
  pricing_type?: string | null;
  daily_price?: number | null;
  weekly_price?: number | null;
  monthly_price?: number | null;
  base_price?: number | null;
  pickup_fee?: number | null;
  dropoff_fee?: number | null;
  no_deposit_fee?: number | null;
  deposit_type?: string | null;
  total_price?: number | null;
  advance_paid?: number | null;
  pending_amount?: number | null;
  notes?: string | null;
};

type PaymentEmailData = {
  booking_number: string;
  customer_name: string;
  customer_email?: string | null;
  customer_phone?: string | null;
  car_name: string;
  pickup_date?: string | null;
  dropoff_date?: string | null;
  pickup_time?: string | null;
  dropoff_time?: string | null;
  pickup_location?: string | null;
  dropoff_location?: string | null;
  total_days?: number | null;
  pricing_type?: string | null;
  daily_price?: number | null;
  weekly_price?: number | null;
  monthly_price?: number | null;
  base_price?: number | null;
  pickup_fee?: number | null;
  dropoff_fee?: number | null;
  no_deposit_fee?: number | null;
  deposit_type?: string | null;
  total_price?: number | null;
  payment_type: string;
  paid_amount: number;
  payment_status?: string | null;
  pending_amount?: number | null;
  stripe_session_id?: string | null;
  notes?: string | null;
};

function formatMoney(value: number | null | undefined) {
  return `AED ${Number(value || 0).toFixed(2)}`;
}

function formatPaymentType(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatLabel(value: string | null | undefined) {
  if (!value) return "-";

  return String(value)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatValue(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
}

function formatDuration(days: number | null | undefined) {
  const totalDays = Number(days || 0);

  if (totalDays <= 0) return "-";

  return `${totalDays} day${totalDays === 1 ? "" : "s"}`;
}

function formatRate(booking: BookingEmailData | PaymentEmailData) {
  const pricingType = String(booking.pricing_type || "").toLowerCase();

  if (pricingType === "monthly") {
    return formatMoney(booking.monthly_price);
  }

  if (pricingType === "weekly") {
    return formatMoney(booking.weekly_price);
  }

  return formatMoney(booking.daily_price);
}

function getAdvanceAmount(totalPrice: number | null | undefined) {
  return Math.min(50, Number(totalPrice || 0));
}

function renderBookingDetails(booking: BookingEmailData | PaymentEmailData) {
  return `
    <h3 style="margin:24px 0 8px">Booking Details</h3>
    <p><strong>Booking Number:</strong> ${booking.booking_number}</p>
    <p><strong>Customer:</strong> ${booking.customer_name || "-"}</p>
    <p><strong>Email:</strong> ${booking.customer_email || "-"}</p>
    <p><strong>Phone:</strong> ${booking.customer_phone || "-"}</p>
    <p><strong>Car:</strong> ${booking.car_name}</p>

    <h3 style="margin:24px 0 8px">Pickup Details</h3>
    <p><strong>Pickup Location:</strong> ${booking.pickup_location || "-"}</p>
    <p><strong>Pickup Date:</strong> ${booking.pickup_date || "-"}</p>
    <p><strong>Pickup Time:</strong> ${booking.pickup_time || "-"}</p>

    <h3 style="margin:24px 0 8px">Return Details</h3>
    <p><strong>Return Location:</strong> ${booking.dropoff_location || "-"}</p>
    <p><strong>Return Date:</strong> ${booking.dropoff_date || "-"}</p>
    <p><strong>Return Time:</strong> ${booking.dropoff_time || "-"}</p>

    <h3 style="margin:24px 0 8px">Rental Summary</h3>
    <p><strong>Rental Duration:</strong> ${formatDuration(booking.total_days)}</p>
    <p><strong>Pricing Type:</strong> ${formatLabel(booking.pricing_type)}</p>
    <p><strong>Rate:</strong> ${formatRate(booking)}</p>
    <p><strong>Rental Subtotal:</strong> ${formatMoney(booking.base_price)}</p>
    <p><strong>Pickup / Delivery Charge:</strong> ${formatMoney(booking.pickup_fee)}</p>
    <p><strong>Return / Collection Charge:</strong> ${formatMoney(booking.dropoff_fee)}</p>
    <p><strong>No Deposit Fee:</strong> ${formatMoney(booking.no_deposit_fee)}</p>
    <p><strong>Deposit Option:</strong> ${formatLabel(booking.deposit_type)}</p>
    <p><strong>Total Booking Amount:</strong> ${formatMoney(booking.total_price)}</p>
    <p><strong>Customer Notes:</strong> ${formatValue(booking.notes)}</p>
  `;
}

async function sendResendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[];
  subject: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    console.warn("Email skipped: RESEND_API_KEY or EMAIL_FROM is missing.");
    return;
  }

  const recipients = Array.isArray(to) ? to : [to];
  const validRecipients = recipients
    .map((item) => String(item || "").trim())
    .filter(Boolean);

  if (validRecipients.length === 0) {
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: validRecipients,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend error: ${response.status} ${errorText}`);
  }
}

function getAdminRecipients() {
  return String(process.env.EMAIL_TO || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function sendBookingCreatedEmails(booking: BookingEmailData) {
  const adminRecipients = getAdminRecipients();
  const customerEmail = String(booking.customer_email || "").trim();
  const bookingParams = new URLSearchParams({
    booking: booking.booking_number,
  });
  const bookingUrl = getAbsoluteUrl(`/my-booking?${bookingParams.toString()}`);

  const customerHtml = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
      <h2>Booking received</h2>
      <p>Dear ${booking.customer_name || "Customer"},</p>
      <p>Your booking request has been received successfully.</p>
      <p><strong>Booking Number:</strong> ${booking.booking_number}</p>
      <p><strong>Car:</strong> ${booking.car_name}</p>
      <p><strong>Pickup:</strong> ${booking.pickup_location || "-"}</p>
      <p><strong>Dropoff:</strong> ${booking.dropoff_location || "-"}</p>
      <p><strong>Pickup Date:</strong> ${booking.pickup_date || "-"}</p>
      <p><strong>Dropoff Date:</strong> ${booking.dropoff_date || "-"}</p>
      <p><strong>Total Price:</strong> ${formatMoney(booking.total_price)}</p>
      <p><strong>Advance Paid:</strong> ${formatMoney(booking.advance_paid)}</p>
      <p><strong>Pending Amount:</strong> ${formatMoney(booking.pending_amount)}</p>
      <p>You can view your booking here:</p>
      <p><a href="${bookingUrl}">${bookingUrl}</a></p>
      <p>Thank you,<br />AMJ Drive</p>
    </div>
  `;

  const adminHtml = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
      <h2>New booking created</h2>
      <p><strong>Booking Number:</strong> ${booking.booking_number}</p>
      <p><strong>Customer:</strong> ${booking.customer_name}</p>
      <p><strong>Email:</strong> ${booking.customer_email || "-"}</p>
      <p><strong>Phone:</strong> ${booking.customer_phone || "-"}</p>
      <p><strong>Car:</strong> ${booking.car_name}</p>
      <p><strong>Total Price:</strong> ${formatMoney(booking.total_price)}</p>
      <p><strong>Advance Paid:</strong> ${formatMoney(booking.advance_paid)}</p>
      <p><strong>Pending Amount:</strong> ${formatMoney(booking.pending_amount)}</p>
    </div>
  `;

  const tasks: Promise<unknown>[] = [];

  if (customerEmail) {
    tasks.push(
      sendResendEmail({
        to: customerEmail,
        subject: `Booking Received - ${booking.booking_number}`,
        html: customerHtml,
      })
    );
  }

  if (adminRecipients.length > 0) {
    tasks.push(
      sendResendEmail({
        to: adminRecipients,
        subject: `New Booking - ${booking.booking_number}`,
        html: adminHtml,
      })
    );
  }

  await Promise.all(tasks);
}

export async function sendPaymentPendingAdminEmail(booking: BookingEmailData) {
  const adminRecipients = getAdminRecipients();

  if (adminRecipients.length === 0) {
    return;
  }

  const bookingParams = new URLSearchParams({
    booking: booking.booking_number,
  });
  const bookingUrl = getAbsoluteUrl(`/my-booking?${bookingParams.toString()}`);
  const advanceRequired = getAdvanceAmount(booking.total_price);
  const balanceAfterAdvance = Math.max(
    Number(booking.total_price || 0) - advanceRequired,
    0
  );

  const adminHtml = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
      <h2>Booking started, payment not completed</h2>
      <p>A customer created a booking and clicked Pay Advance, but Stripe has not confirmed payment yet.</p>
      <p><strong>Important:</strong> If payment is completed later, you will receive a separate advance payment confirmation email.</p>
      ${renderBookingDetails(booking)}
      <h3 style="margin:24px 0 8px">Payment Summary</h3>
      <p><strong>Advance Required:</strong> ${formatMoney(advanceRequired)}</p>
      <p><strong>Amount Received So Far:</strong> ${formatMoney(booking.advance_paid)}</p>
      <p><strong>Remaining Balance After Advance:</strong> ${formatMoney(balanceAfterAdvance)}</p>
      <p><strong>Current Pending Amount:</strong> ${formatMoney(booking.pending_amount)}</p>
      <p><strong>Payment Status:</strong> Awaiting advance payment</p>
      <h3 style="margin:24px 0 8px">Admin Action</h3>
      <p>Contact the customer if payment is not received shortly. If the customer wants to continue, resend the advance payment link from admin.</p>
      <p><a href="${bookingUrl}">${bookingUrl}</a></p>
    </div>
  `;

  await sendResendEmail({
    to: adminRecipients,
    subject: `Booking Started, Payment Not Completed - ${booking.booking_number}`,
    html: adminHtml,
  });
}

export async function sendPaymentConfirmationEmails(payment: PaymentEmailData) {
  const adminRecipients = getAdminRecipients();
  const customerEmail = String(payment.customer_email || "").trim();
  const paymentTypeLabel = formatPaymentType(payment.payment_type);
  const normalizedPaymentType = String(payment.payment_type || "").toLowerCase();
  const isAdvancePayment = normalizedPaymentType === "advance";
  const isFullPayment = normalizedPaymentType === "full";
  const customerHeading =
    isAdvancePayment || isFullPayment ? "Booking confirmed" : "Payment received";
  const adminHeading = isAdvancePayment
    ? "Advance payment received"
    : `${paymentTypeLabel} payment received`;
  const paidAmountLabel = isAdvancePayment ? "Advance Paid" : "Amount Paid";
  const customerSubject =
    isAdvancePayment || isFullPayment
      ? `Booking Confirmed - ${payment.booking_number}`
      : `Payment Received - ${payment.booking_number}`;
  const adminSubject = isAdvancePayment
    ? `Advance Payment Received - ${payment.booking_number} - ${
        payment.customer_name || "Customer"
      }`
    : `${paymentTypeLabel} Payment Received - ${payment.booking_number}`;
  const bookingParams = new URLSearchParams({
    booking: payment.booking_number,
  });
  const bookingUrl = getAbsoluteUrl(`/my-booking?${bookingParams.toString()}`);

  const customerHtml = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
      <h2>${customerHeading}</h2>
      <p>Dear ${payment.customer_name || "Customer"},</p>
      <p>Thank you for booking with AMJ Drive.</p>
      <p>${
        isAdvancePayment || isFullPayment
          ? `Your booking is confirmed and we have received your ${paymentTypeLabel.toLowerCase()} payment of ${formatMoney(payment.paid_amount)}.`
          : `We have received your ${paymentTypeLabel.toLowerCase()} payment of ${formatMoney(payment.paid_amount)}.`
      }</p>
      <p><strong>Booking Number:</strong> ${payment.booking_number}</p>
      <p><strong>Car:</strong> ${payment.car_name}</p>
      <h3 style="margin:24px 0 8px">Pickup Details</h3>
      <p><strong>Pickup Location:</strong> ${payment.pickup_location || "-"}</p>
      <p><strong>Pickup Date:</strong> ${payment.pickup_date || "-"}</p>
      <p><strong>Pickup Time:</strong> ${payment.pickup_time || "-"}</p>
      <h3 style="margin:24px 0 8px">Return Details</h3>
      <p><strong>Return Location:</strong> ${payment.dropoff_location || "-"}</p>
      <p><strong>Return Date:</strong> ${payment.dropoff_date || "-"}</p>
      <p><strong>Return Time:</strong> ${payment.dropoff_time || "-"}</p>
      <h3 style="margin:24px 0 8px">Rental Summary</h3>
      <p><strong>Rental Duration:</strong> ${formatDuration(payment.total_days)}</p>
      <p><strong>Total Booking Amount:</strong> ${formatMoney(payment.total_price)}</p>
      <p><strong>${paidAmountLabel}:</strong> ${formatMoney(payment.paid_amount)}</p>
      <p><strong>Remaining Balance:</strong> ${formatMoney(payment.pending_amount)}</p>
      <p><strong>Payment Status:</strong> ${formatLabel(payment.payment_status || "Paid")}</p>
      <h3 style="margin:24px 0 8px">What Happens Next</h3>
      <p>Our team will contact you shortly to confirm the final pickup or delivery timing and share any required document details.</p>
      <p>Please keep your driving license and Emirates ID ready if required.</p>
      <p>You can view your booking here:</p>
      <p><a href="${bookingUrl}">${bookingUrl}</a></p>
      <p>Thank you,<br />AMJ Drive</p>
    </div>
  `;

  const adminHtml = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
      <h2>${adminHeading}</h2>
      <p>Stripe has confirmed payment for this booking.</p>
      ${renderBookingDetails(payment)}
      <h3 style="margin:24px 0 8px">Payment Summary</h3>
      <p><strong>Payment For:</strong> ${paymentTypeLabel}</p>
      <p><strong>Amount Paid:</strong> ${formatMoney(payment.paid_amount)}</p>
      <p><strong>Remaining Balance:</strong> ${formatMoney(payment.pending_amount)}</p>
      <p><strong>Payment Status:</strong> ${formatLabel(payment.payment_status || "Paid")}</p>
      <p><strong>Payment Method:</strong> Stripe</p>
      <p><strong>Stripe Session:</strong> ${payment.stripe_session_id || "-"}</p>
      <h3 style="margin:24px 0 8px">Admin Action</h3>
      <p>Confirm the final handover timing and contact the customer to arrange pickup or delivery.</p>
      <p><a href="${bookingUrl}">${bookingUrl}</a></p>
    </div>
  `;

  const tasks: Promise<unknown>[] = [];

  if (customerEmail) {
    tasks.push(
      sendResendEmail({
        to: customerEmail,
        subject: customerSubject,
        html: customerHtml,
      })
    );
  }

  if (adminRecipients.length > 0) {
    tasks.push(
      sendResendEmail({
        to: adminRecipients,
        subject: adminSubject,
        html: adminHtml,
      })
    );
  }

  await Promise.all(tasks);
}
