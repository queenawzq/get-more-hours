"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function PaymentSuccessToast() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const payment = searchParams.get("payment");
    const type = searchParams.get("type");
    if (payment !== "success") return;

    if (type === "white_glove") {
      toast.success("White Glove upgrade activated", {
        description:
          "Our team will reach out shortly to coordinate next steps.",
      });
    } else {
      toast.success("Payment received");
    }
    router.replace("/dashboard");
  }, [router, searchParams]);

  return null;
}
