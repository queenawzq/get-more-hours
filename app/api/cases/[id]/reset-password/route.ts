import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

// Admin-only: trigger a password-reset email for the client who owns this case.
// Sends the same Supabase recovery email as the self-service /forgot-password
// flow (app/(auth)/forgot-password/page.tsx) — the user lands on /auth/callback
// then /reset-password to set a new password.
export async function POST(
  _req: Request,
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

  const { data: caseRow } = await supabase
    .from("cases")
    .select("user_id")
    .eq("id", id)
    .maybeSingle();

  if (!caseRow) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }

  const serviceClient = await createServiceClient();
  const { data: target, error: lookupErr } =
    await serviceClient.auth.admin.getUserById(caseRow.user_id);

  if (lookupErr || !target.user?.email) {
    console.error("reset-password: user lookup failed", lookupErr);
    return NextResponse.json(
      { error: "Could not find the client's email" },
      { status: 404 }
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const { error: resetErr } = await serviceClient.auth.resetPasswordForEmail(
    target.user.email,
    { redirectTo: `${baseUrl}/auth/callback?next=/reset-password` }
  );

  if (resetErr) {
    console.error("reset-password: send failed", resetErr);
    return NextResponse.json(
      { error: "Failed to send reset email" },
      { status: 500 }
    );
  }

  return NextResponse.json({ sent: true, email: target.user.email });
}
