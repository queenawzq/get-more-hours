import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { tierSchema } from "@/lib/validations";

// Admin-only: set a case's tier. tier='white_glove' bypasses ALL per-stage
// payment gates (lib/billing/guard.ts:41); 'self_serve' restores per-stage
// gating. Mirrors what the Stripe webhook does on a white-glove purchase.
export async function PATCH(
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

  const parsed = tierSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("cases")
    .update({ tier: parsed.data.tier })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    console.error("Tier update error:", error);
    return NextResponse.json({ error: "Failed to update tier" }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }

  return NextResponse.json({ case: data });
}
