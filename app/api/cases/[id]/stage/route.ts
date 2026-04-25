import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stageUpdateSchema } from "@/lib/validations";

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

  const parsed = stageUpdateSchema.safeParse(await req.json());

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const updates: Record<string, unknown> = {};
  if (parsed.data.currentStage !== undefined) {
    updates.current_stage = parsed.data.currentStage;
    // Mirror auto-advance convention: reset stage_status unless caller
    // provided an explicit one.
    if (parsed.data.stageStatus === undefined) {
      updates.stage_status = "in_progress";
    }
  }
  if (parsed.data.stageStatus !== undefined) {
    updates.stage_status = parsed.data.stageStatus;
  }

  const { data, error } = await supabase
    .from("cases")
    .update(updates)
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    console.error("Case stage update error:", error);
    return NextResponse.json(
      { error: "Failed to update case" },
      { status: 500 }
    );
  }
  if (!data) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }

  return NextResponse.json({ case: data });
}
