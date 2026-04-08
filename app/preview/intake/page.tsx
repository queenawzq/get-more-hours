import { Logo } from "@/components/logo";
import { IntakeForm } from "@/components/intake/intake-form";

export default function IntakePreview() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Logo height={20} href="/" />
          <span className="text-sm text-gray-500">
            Need help? Call{" "}
            <a
              href="tel:2125550123"
              className="text-primary font-medium hover:underline"
            >
              (212) 555-0123
            </a>
          </span>
        </div>
      </div>
      <div className="max-w-[680px] mx-auto px-5 py-8 pb-24">
        <IntakeForm />
      </div>
    </div>
  );
}
