import { createHash } from "node:crypto";

type SendMetaPurchaseEventInput = {
  eventId: string;
  value: number;
  currency?: string;
  customerEmail?: string | null;
  customerPhone?: string | null;
  eventSourceUrl: string;
};

function normalizeEmail(value?: string | null) {
  return value?.trim().toLowerCase() || "";
}

function normalizePhone(value?: string | null) {
  return value?.replace(/[^\d]/g, "") || "";
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function hashIfPresent(value: string) {
  return value ? [sha256(value)] : undefined;
}

export async function sendMetaPurchaseEvent({
  eventId,
  value,
  currency = "AED",
  customerEmail,
  customerPhone,
  eventSourceUrl,
}: SendMetaPurchaseEventInput) {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    console.warn("Meta CAPI skipped: META_PIXEL_ID or META_ACCESS_TOKEN is missing");
    return;
  }

  if (!eventId) {
    console.warn("Meta CAPI skipped: event_id is missing");
    return;
  }

  const normalizedEmail = normalizeEmail(customerEmail);
  const normalizedPhone = normalizePhone(customerPhone);

  const payload = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: "website",
        event_source_url: eventSourceUrl,
        user_data: {
          em: hashIfPresent(normalizedEmail),
          ph: hashIfPresent(normalizedPhone),
        },
        custom_data: {
          value,
          currency,
        },
      },
    ],
    access_token: accessToken,
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/v20.0/${pixelId}/events`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const responseBody = await response.json().catch(() => null);

    if (!response.ok) {
      console.error("Meta CAPI Purchase event failed:", {
        eventId,
        status: response.status,
        response: responseBody,
      });
      return;
    }

    console.log("Meta CAPI Purchase event sent:", {
      eventId,
      status: response.status,
      response: responseBody,
    });
  } catch (error) {
    console.error("Meta CAPI Purchase event error:", {
      eventId,
      error,
    });
  }
}
