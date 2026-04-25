import { DashboardNav } from "@/components/dashboard/nav";
import { StageTracker } from "@/components/dashboard/stage-tracker";
import { NextSteps } from "@/components/dashboard/next-steps";
import { DocumentsList } from "@/components/dashboard/documents-list";
import { CaseSummary } from "@/components/dashboard/case-summary";
import { Timeline } from "@/components/dashboard/timeline";
import { WhiteGloveUpsell } from "@/components/dashboard/white-glove-upsell";
import type { Case, Document } from "@/types";

const mockCase: Case = {
  id: "preview-case-1",
  user_id: "preview-user",
  case_number: "GMH-2026-0042",
  current_stage: 1,
  stage_status: "in_progress",
  tier: "self_serve",
  mltc: "centerlight",
  current_hours: 6,
  current_days: 5,
  requested_hours: 12,
  requested_days: 7,
  created_at: "2026-03-28T10:00:00Z",
  updated_at: "2026-04-01T14:30:00Z",
};

const mockDocuments: Document[] = [
  {
    id: "doc-1",
    case_id: "preview-case-1",
    name: "Request for Increase Letter",
    type: "generated",
    stage: 1,
    status: "review_needed",
    format: "letter",
    storage_path: null,
    ocr_text: null,
    content: "Dear Case Manager,\n\nI am writing to formally request...",
    version: 1,
    generation_status: "ready",
    generation_error: null,
    ocr_status: null,
    ocr_error: null,
    created_at: "2026-03-28T10:05:00Z",
    updated_at: "2026-03-28T10:05:00Z",
  },
  {
    id: "doc-2",
    case_id: "preview-case-1",
    name: "LOMN Request Template",
    type: "generated",
    stage: 1,
    status: "ready",
    format: "letter",
    storage_path: null,
    ocr_text: null,
    content: "Dear Dr. [Name],\n\nYour patient requires...",
    version: 1,
    generation_status: "ready",
    generation_error: null,
    ocr_status: null,
    ocr_error: null,
    created_at: "2026-03-28T10:05:00Z",
    updated_at: "2026-03-28T10:05:00Z",
  },
];

export default function DashboardPreview() {
  return (
    <div className="flex min-h-screen">
      <DashboardNav
        user={{
          name: "Maria Santos",
          email: "maria@example.com",
          role: "client",
        }}
      />
      <main className="flex-1 p-6 md:p-8 bg-muted/30">
        <div className="max-w-5xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Welcome back, Maria</h1>
            <p className="text-muted-foreground mt-0.5">
              Your home care advocacy dashboard
            </p>
          </div>

          <StageTracker
            currentStage={1}
            stageStatus="in_progress"
            caseNumber={mockCase.case_number}
          />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-4">
            <div>
              <NextSteps documents={mockDocuments} currentStage={1} />
              <DocumentsList documents={mockDocuments} />
            </div>
            <div>
              <CaseSummary caseData={mockCase} />
              <Timeline
                documents={mockDocuments}
                caseCreatedAt={mockCase.created_at}
              />
              <WhiteGloveUpsell />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
