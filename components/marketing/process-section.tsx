import { CheckCircle } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Create Your Account",
    description: "Sign up and tell us about your current home care situation.",
  },
  {
    number: "02",
    title: "Complete Your Intake",
    description:
      "Provide details about your medical conditions, ADLs, and current Plan of Care.",
  },
  {
    number: "03",
    title: "We Build Your Case",
    description:
      "Our system generates professional request letters and guides you through each stage.",
  },
  {
    number: "04",
    title: "Get More Hours",
    description:
      "Receive the increased home care hours you need and deserve.",
  },
];

export function ProcessSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Simple 4-Step Process</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We&apos;ve made it as easy as possible to fight for the care you
            need.
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-4 mb-8 last:mb-0">
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                  {step.number}
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px flex-1 bg-border mt-2" />
                )}
              </div>
              <div className="pb-8">
                <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
