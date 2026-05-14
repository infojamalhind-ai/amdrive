"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

type MetaPixelEventParams = Record<string, string | number | boolean | undefined>;

type Fbq = {
  (command: "track", eventName: string, params?: MetaPixelEventParams): void;
  (command: "init", pixelId: string): void;
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  loaded?: boolean;
  version?: string;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

function canTrack() {
  return Boolean(pixelId && typeof window !== "undefined" && window.fbq);
}

export function trackMetaEvent(
  eventName: string,
  params?: MetaPixelEventParams
) {
  if (!canTrack()) return false;

  window.fbq?.("track", eventName, params);
  return true;
}

export function MetaPixelRouteEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!canTrack() || !pathname) return;

    const query = searchParams.toString();
    const currentUrl = query ? `${pathname}?${query}` : pathname;

    if (previousUrlRef.current === null) {
      previousUrlRef.current = currentUrl;
    } else if (previousUrlRef.current !== currentUrl) {
      window.fbq?.("track", "PageView");
      previousUrlRef.current = currentUrl;
    }

    if (pathname === "/vehicle" || pathname.startsWith("/booking/")) {
      window.fbq?.("track", "ViewContent", {
        content_name: pathname.startsWith("/booking/")
          ? decodeURIComponent(pathname.split("/").filter(Boolean).at(-1) || "")
          : "Vehicle Listing",
        content_type: pathname.startsWith("/booking/") ? "vehicle_booking" : "vehicle_listing",
      });
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    function handleDocumentClick(event: MouseEvent) {
      const target = event.target;

      if (!(target instanceof Element)) return;

      const link = target.closest("a");
      const href = link?.getAttribute("href");

      if (!href) return;

      try {
        const url = new URL(href, window.location.origin);

        if (url.origin === window.location.origin && url.pathname.startsWith("/booking/")) {
          trackMetaEvent("InitiateCheckout");
        }
      } catch {
        if (href.startsWith("/booking/")) {
          trackMetaEvent("InitiateCheckout");
        }
      }
    }

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  return null;
}

export function useMetaPixelCheckoutStart({
  carName,
  value,
}: {
  carName?: string;
  value?: number;
}) {
  const trackedRef = useRef(false);

  return useCallback(() => {
    if (trackedRef.current) return;

    trackedRef.current = true;
    trackMetaEvent("InitiateCheckout", {
      currency: "AED",
      value,
      car_name: carName,
    });
  }, [carName, value]);
}

export function MetaPixelPurchaseEvent({
  value,
  bookingNumber,
  carName,
  eventKey,
}: {
  value: number;
  bookingNumber?: string;
  carName?: string;
  eventKey?: string;
}) {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (trackedRef.current) return;

    const storageKey = eventKey
      ? `meta-purchase:${eventKey}`
      : bookingNumber
        ? `meta-purchase:${bookingNumber}:${value}`
        : "";

    if (storageKey && window.sessionStorage.getItem(storageKey)) {
      trackedRef.current = true;
      return;
    }

    let retryTimer: number | undefined;
    let attempts = 0;

    function firePurchase() {
      attempts += 1;

      const didTrack = trackMetaEvent("Purchase", {
        currency: "AED",
        value,
        booking_number: bookingNumber,
        car_name: carName,
      });

      if (didTrack) {
        trackedRef.current = true;

        if (storageKey) {
          window.sessionStorage.setItem(storageKey, "1");
        }

        return;
      }

      if (attempts < 20) {
        retryTimer = window.setTimeout(firePurchase, 250);
      }
    }

    firePurchase();

    return () => {
      if (retryTimer) {
        window.clearTimeout(retryTimer);
      }
    };
  }, [bookingNumber, carName, eventKey, value]);

  return null;
}
