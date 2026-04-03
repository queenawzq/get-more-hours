import { AdminNav } from "@/components/admin/admin-nav";
import { AdminOverview } from "@/components/admin/admin-overview";

const mockCases = [
  {
    id: "case-1",
    case_number: "GMH-2026-0042",
    current_stage: 1,
    stage_status: "in_progress",
    mltc: "centerlight",
    current_hours: 6,
    requested_hours: 12,
    tier: "self_serve",
    updated_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    profile: { name: "Maria Santos" },
  },
  {
    id: "case-2",
    case_number: "GMH-2026-0039",
    current_stage: 2,
    stage_status: "submitted",
    mltc: "villagecaremax",
    current_hours: 4,
    requested_hours: 10,
    tier: "white_glove",
    updated_at: new Date(Date.now() - 18 * 3600000).toISOString(),
    profile: { name: "James Chen" },
  },
  {
    id: "case-3",
    case_number: "GMH-2026-0035",
    current_stage: 1,
    stage_status: "responded",
    mltc: "aetna",
    current_hours: 8,
    requested_hours: 14,
    tier: "self_serve",
    updated_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    profile: { name: "Dorothy Williams" },
  },
  {
    id: "case-4",
    case_number: "GMH-2026-0031",
    current_stage: 3,
    stage_status: "in_progress",
    mltc: "healthfirst",
    current_hours: 5,
    requested_hours: 12,
    tier: "white_glove",
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    profile: { name: "Robert Kim" },
  },
  {
    id: "case-5",
    case_number: "GMH-2026-0028",
    current_stage: 1,
    stage_status: "pending",
    mltc: "elderplan",
    current_hours: 3,
    requested_hours: 8,
    tier: "self_serve",
    updated_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    profile: { name: "Anna Petrov" },
  },
];

const mockStats = {
  activeCases: 5,
  docsToReview: 3,
  whiteGloveCount: 2,
  revenue: 59700,
};

export default function AdminPreview() {
  return (
    <div className="flex min-h-screen">
      <AdminNav
        user={{
          name: "Admin User",
          email: "admin@getmorehours.com",
        }}
      />
      <main className="flex-1 p-6 md:p-8 bg-muted/30">
        <div className="max-w-6xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-0.5">
              Manage all client cases and documents
            </p>
          </div>
          <AdminOverview cases={mockCases} stats={mockStats} />
        </div>
      </main>
    </div>
  );
}
