import { getAbsoluteUrl } from "@/lib/site-url";

type BookingEmailData = {
  booking_number: string;
  customer_name: string;
  customer_email?: string | null;
  customer_phone?: string | null;
  car_name: string;
  pickup_date?: string | null;
  dropoff_date?: string | null;
  pickup_location?: string | null;
  dropoff_location?: string | null;
  total_price?: number | null;
  advance_paid?: number | null;
  pending_amount?: number | null;
};

type PaymentEmailData = {
  booking_number: string;
  customer_name: string;
  customer_email?: string | null;
  customer_phone?: string | null;
  car_name: string;
  payment_type: string;
  paid_amount: number;
  payment_status?: string | null;
  pending_amount?: number | null;
};

function formatMoney(value: number | null | undefined) {
  return `AED ${Number(value || 0).toFixed(2)}`;
}

function formatPaymentType(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
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

export async function sendPaymentConfirmationEmails(payment: PaymentEmailData) {
  const adminRecipients = getAdminRecipients();
  const customerEmail = String(payment.customer_email || "").trim();
  const paymentTypeLabel = formatPaymentType(payment.payment_type);
  const bookingParams = new URLSearchParams({
    booking: payment.booking_number,
  });
  const bookingUrl = getAbsoluteUrl(`/my-booking?${bookingParams.toString()}`);

  const customerHtml = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
      <h2>Payment received</h2>
      <p>Dear ${payment.customer_name || "Customer"},</p>
      <p>Your payment has been received successfully.</p>
      <p><strong>Booking Number:</strong> ${payment.booking_number}</p>
      <p><strong>Car:</strong> ${payment.car_name}</p>
      <p><strong>Payment For:</strong> ${paymentTypeLabel}</p>
      <p><strong>Amount Paid:</strong> ${formatMoney(payment.paid_amount)}</p>
      <p><strong>Payment Status:</strong> ${payment.payment_status || "Paid"}</p>
      <p><strong>Pending Amount:</strong> ${formatMoney(payment.pending_amount)}</p>
      <p>You can view your booking here:</p>
      <p><a href="${bookingUrl}">${bookingUrl}</a></p>
      <p>Thank you,<br />AMJ Drive</p>
    </div>
  `;

  const adminHtml = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
      <h2>Payment received</h2>
      <p><strong>Booking Number:</strong> ${payment.booking_number}</p>
      <p><strong>Customer:</strong> ${payment.customer_name}</p>
      <p><strong>Email:</strong> ${payment.customer_email || "-"}</p>
      <p><strong>Phone:</strong> ${payment.customer_phone || "-"}</p>
      <p><strong>Car:</strong> ${payment.car_name}</p>
      <p><strong>Payment For:</strong> ${paymentTypeLabel}</p>
      <p><strong>Amount Paid:</strong> ${formatMoney(payment.paid_amount)}</p>
      <p><strong>Payment Status:</strong> ${payment.payment_status || "Paid"}</p>
      <p><strong>Pending Amount:</strong> ${formatMoney(payment.pending_amount)}</p>
    </div>
  `;

  const tasks: Promise<unknown>[] = [];

  if (customerEmail) {
    tasks.push(
      sendResendEmail({
        to: customerEmail,
        subject: `Payment Received - ${payment.booking_number}`,
        html: customerHtml,
      })
    );
  }

  if (adminRecipients.length > 0) {
    tasks.push(
      sendResendEmail({
        to: adminRecipients,
        subject: `Payment Received - ${payment.booking_number}`,
        html: adminHtml,
      })
    );
  }

  await Promise.all(tasks);
}
