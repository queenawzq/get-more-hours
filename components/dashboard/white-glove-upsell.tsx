"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { Check, Loader2, Sparkles } from "lucide-react";

const FEATURES = [
  "We submit the request package to your MLTC directly",
  "Ongoing case manager communication on your behalf",
  "Priority review of your generated letters by our team",
  "Dedicated advocate through every stage of appeal",
  "Phone + email support during business hours",
];

interface WhiteGloveUpsellProps {
  caseId?: string;
}

export function WhiteGloveUpsell({ caseId }: WhiteGloveUpsellProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handlePurchase() {
    if (!caseId) {
      toast.error("Start a case before upgrading");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout/white-glove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId }),
      });
      const body = await res.json();
      if (!res.ok || !body.url) {
        throw new Error(body.error || "Failed to start checkout");
      }
      window.location.href = body.url;
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to start checkout"
      );
      setLoading(false);
    }
  }

  return (
    <>
      <div className="rounded-xl p-5 px-6 bg-gradient-to-br from-slate-800 to-primary shadow-md">
        <div className="flex items-center gap-1.5 mb-2">
          <Sparkles className="h-4 w-4 text-white" />
          <span className="text-sm font-bold text-white">
            White Glove Service
          </span>
          <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/15 text-white/90">
            $199
          </span>
        </div>
        <p className="text-xs text-white/75 mb-3 leading-relaxed">
          Let us handle document submission, case manager communication, and more.
        </p>
        <Button
          variant="secondary"
          className="w-full bg-white text-primary hover:bg-white/90 font-semibold text-sm"
          onClick={() => setOpen(true)}
        >
          Learn More
        </Button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-primary" />
              White Glove Service
            </SheetTitle>
            <SheetDescription>
              A one-time upgrade — we handle the paperwork so you can focus on
              your loved one.
            </SheetDescription>
          </SheetHeader>

          <div className="px-4 pb-4 flex-1 overflow-y-auto">
            <div className="rounded-xl bg-gradient-to-br from-slate-800 to-primary p-5 text-white mb-5">
              <div className="text-xs uppercase tracking-wider text-white/70 mb-1">
                One-time upgrade
              </div>
              <div className="text-3xl font-bold">
                $199
                <span className="text-sm font-normal text-white/75 ml-2">
                  flat fee
                </span>
              </div>
            </div>

            <ul className="space-y-2.5">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-foreground">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 border-t">
            <Button
              className="w-full"
              size="lg"
              disabled={loading || !caseId}
              onClick={handlePurchase}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Purchase for $199
            </Button>
            {!caseId && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                Start a case to unlock this upgrade.
              </p>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
