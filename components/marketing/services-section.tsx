import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Scale, Gavel } from "lucide-react";

const services = [
  {
    icon: FileText,
    title: "Request for Increase",
    description:
      "We help you file a formal request to your MLTC for more authorized home care hours, backed by medical documentation and a Letter of Medical Necessity from your doctor.",
  },
  {
    icon: Scale,
    title: "Internal Appeal",
    description:
      "If your request is denied, we prepare and submit a comprehensive Internal Appeal, challenging the MLTC's adverse determination with supporting evidence.",
  },
  {
    icon: Gavel,
    title: "Fair Hearing",
    description:
      "When appeals are denied, we take your case to a NYS Fair Hearing. We prepare your evidence, analyze the UAS report, and write a compelling Memo of Law.",
  },
];

export function ServicesSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How We Help</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our three-stage process ensures you have expert advocacy at every
            level, from initial request through state-level hearings.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {services.map((service, i) => (
            <Card key={i} className="relative">
              <div className="absolute top-4 right-4 text-sm font-bold text-primary/30">
                Stage {i + 1}
              </div>
              <CardHeader>
                <service.icon className="h-10 w-10 text-primary mb-2" />
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
