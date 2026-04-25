"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";
import type { BillingStatus } from "@/types";

interface BillingClientProps {
  caseId: string;
  stage: number;
  latestStatus?: BillingStatus | null;
}

export function BillingClient({
  caseId,
  stage,
  latestStatus,
}: BillingClientProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (includeWhiteGlove: boolean = false) => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId, stage, includeWhiteGlove }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setLoading(false);
    }
  };

  const failed = latestStatus === "failed";

  return (
    <div className="flex flex-col gap-1.5">
      {failed && (
        <div className="flex items-start gap-1.5 rounded-md border border-red-200 bg-red-50 px-2 py-1.5 text-[11px] text-red-700">
          <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>Payment failed — please try again.</span>
        </div>
      )}
      <Button
        size="sm"
        className="w-full text-xs"
        onClick={() => handleCheckout(false)}
        disabled={loading}
      >
        {loading && <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />}
        {failed ? "Retry payment" : "Pay Now"}
      </Button>
    </div>
  );
}
