import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { compSchema } from "@/lib/validations";
import { PRICING } from "@/lib/constants";

const STAGE_AMOUNTS: Record<number, number> = {
  1: PRICING.stage1,
  2: PRICING.stage2,
  3: PRICING.stage3,
};

// Admin-only: comp (mark paid) or un-comp (revert to pending) a stage fee for a
// case, without a Stripe payment. The stage payment gate (lib/billing/guard.ts)
// reads purely from the billing table, so a paid stage_fee row unlocks the
// stage exactly like a Stripe-webhook-created one.
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = compSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }
  const { stage, action } = parsed.data;

  const { data: existing } = await supabase
    .from("billing")
    .select("id, status, stripe_payment_id")
    .eq("case_id", id)
    .eq("stage", stage)
    .eq("type", "stage_fee")
    .maybeSingle();

  if (action === "uncomp") {
    if (!existing || existing.status !== "paid") {
      return NextResponse.json({ ok: true, status: "pending" });
    }
    // Never revert a real Stripe payment — only manual comps (no payment id).
    if (existing.stripe_payment_id) {
      return NextResponse.json(
        { error: "Cannot un-comp a real Stripe payment" },
        { status: 409 }
      );
    }
    const { error } = await supabase
      .from("billing")
      .update({ status: "pending", stripe_event: { manual_comp_removed: true, admin_id: user.id } })
      .eq("id", existing.id);
    if (error) {
      console.error("Un-comp failed:", error);
      return NextResponse.json({ error: "Failed to remove comp" }, { status: 500 });
    }
    return NextResponse.json({ ok: true, status: "pending" });
  }

  // action === "comp"
  if (existing) {
    const { error } = await supabase
      .from("billing")
      .update({ status: "paid", stripe_event: { manual_comp: true, admin_id: user.id } })
      .eq("id", existing.id);
    if (error) {
      console.error("Comp update failed:", error);
      return NextResponse.json({ error: "Failed to comp stage" }, { status: 500 });
    }
    return NextResponse.json({ ok: true, status: "paid" });
  }

  const { error } = await supabase.from("billing").insert({
    case_id: id,
    stage,
    amount: STAGE_AMOUNTS[stage],
    type: "stage_fee",
    status: "paid",
    stripe_event: { manual_comp: true, admin_id: user.id },
  });
  if (error) {
    console.error("Comp insert failed:", error);
    return NextResponse.json({ error: "Failed to comp stage" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, status: "paid" });
}
