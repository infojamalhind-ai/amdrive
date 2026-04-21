"use client";

import { useState } from "react";

type Props = {
  chargeId: string;
};

export default function SendChargePaymentLinkButton({ chargeId }: Props) {
  const [loading, setLoading] = useState(false);

  const handleSendLink = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/charges/send-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chargeId }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to create payment link");
        return;
      }

      if (data.whatsappUrl) {
        window.open(data.whatsappUrl, "_blank");
        return;
      }

      if (data.checkoutUrl) {
        await navigator.clipboard.writeText(data.checkoutUrl);
        alert("Payment link created and copied.");
        return;
      }

      alert("Payment link created.");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSendLink}
      disabled={loading}
      className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Creating..." : "Send Payment Link"}
    </button>
  );
}