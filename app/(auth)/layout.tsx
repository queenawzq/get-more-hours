import Link from "next/link";
import { Clock } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <Clock className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold text-primary">Get More Hours</span>
      </Link>
      {children}
      <p className="mt-8 text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Get More Hours. All rights reserved.
      </p>
    </div>
  );
}
