import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { runDocumentGeneration, type DocumentType, STAGE_MAP } from "@/lib/document-generation";
import { checkStagePaid } from "@/lib/billing/guard";
import { friendlyAiError } from "@/lib/ai-errors";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { caseId, documentType, documentId } = (await req.json()) as {
    caseId: string;
    documentType: DocumentType;
    documentId: string;
  };

  if (!caseId || !documentType || !documentId) {
    return NextResponse.json(
      { error: "caseId, documentType, and documentId are required" },
      { status: 400 }
    );
  }

  const stage = STAGE_MAP[documentType];
  if (!stage) {
    return NextResponse.json(
      { error: `Unknown documentType: ${documentType}` },
      { status: 400 }
    );
  }

  const gate = await checkStagePaid(supabase, caseId, stage);
  if (!gate.ok) return gate.response;

  // runDocumentGeneration handles generation_status transitions and error capture.
  await runDocumentGeneration({ caseId, documentType, documentId });

  // Check final status to determine HTTP response.
  const serviceClient = await createServiceClient();
  const { data: doc } = await serviceClient
    .from("documents")
    .select("generation_status, generation_error")
    .eq("id", documentId)
    .single();

  if (doc?.generation_status === "failed") {
    // Map the raw provider error to friendly copy — the raw text (which can
    // include billing/credit details) stays in the DB for staff only.
    return NextResponse.json(
      { error: friendlyAiError(doc.generation_error) },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Document generated", documentId });
}
