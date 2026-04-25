import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createWhiteGloveCheckoutSession } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { caseId } = await req.json();

    if (!caseId) {
      return NextResponse.json(
        { error: "caseId is required" },
        { status: 400 }
      );
    }

    const { data: caseData, error } = await supabase
      .from("cases")
      .select("*")
      .eq("id", caseId)
      .eq("user_id", user.id)
      .single();

    if (error || !caseData) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    if (caseData.tier === "white_glove") {
      return NextResponse.json(
        { error: "Already upgraded to white glove" },
        { status: 409 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await createWhiteGloveCheckoutSession({
      caseId,
      caseNumber: caseData.case_number,
      customerEmail: user.email || "",
      successUrl: `${baseUrl}/dashboard?payment=success&type=white_glove`,
      cancelUrl: `${baseUrl}/dashboard`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("White-glove checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
