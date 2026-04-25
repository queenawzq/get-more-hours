import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { runDocumentGeneration, type DocumentType } from "@/lib/document-generation";

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
    return NextResponse.json(
      { error: doc.generation_error || "Generation failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Document generated", documentId });
}
