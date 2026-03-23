import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen, FileText, MessageSquare, Clock } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  const placeholders = [
    {
      icon: FolderOpen,
      title: "My Cases",
      description: "Track your case through each stage of the process.",
    },
    {
      icon: FileText,
      title: "Documents",
      description: "Upload and manage your medical records and letters.",
    },
    {
      icon: MessageSquare,
      title: "Messages",
      description: "Communication with your advocate team.",
    },
    {
      icon: Clock,
      title: "Timeline",
      description: "View deadlines and important dates for your case.",
    },
  ];

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Welcome back, {session?.user.name?.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground mt-1">
          {session?.user.role === "ADMIN"
            ? "Admin Dashboard — manage all client cases"
            : "Your home care advocacy dashboard"}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {placeholders.map((item, i) => (
          <Card key={i} className="opacity-60">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <item.icon className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
              <p className="text-xs text-primary mt-2 font-medium">
                Coming soon
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
