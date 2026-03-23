import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Scale,
  Gavel,
  CheckCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const stages = [
  {
    stage: 1,
    icon: FileText,
    title: "Request for Increase in Plan of Care",
    description:
      "The first step is submitting a formal written request to your MLTC company, directed to your case manager.",
    whatWeProvide: [
      "Personal intake to gather your medical conditions and ADLs",
      "AI-generated Request for Increase letter from the client",
      "Template request to your doctor for a Letter of Medical Necessity (LOMN)",
      "Secure document upload and management",
      "Guidance on what information to include",
    ],
    whatHappens:
      "The MLTC reviews your request, may initiate an assessment, and issues their determination. If they don't fully grant your request, you'll receive an Initial Adverse Determination (IAD).",
    timeline: "2-4 weeks for MLTC response",
    price: "$99",
  },
  {
    stage: 2,
    icon: Scale,
    title: "Internal Appeal",
    description:
      "If your MLTC issues an IAD, you have the right to file an Internal Appeal challenging their decision.",
    whatWeProvide: [
      "Review and analysis of the IAD",
      "AI-generated Internal Appeal letter",
      "References to your LOMN and medical documentation",
      "Argument construction based on your specific situation",
      "Document organization and submission guidance",
    ],
    whatHappens:
      "The MLTC reviews your appeal and either grants additional hours or issues a Final Adverse Determination (FAD). If they deny the appeal, you can escalate to a Fair Hearing.",
    timeline: "30-60 days for MLTC response",
    price: "$149",
  },
  {
    stage: 3,
    icon: Gavel,
    title: "Fair Hearing",
    description:
      "A Fair Hearing with NYS OTDA is your final and strongest tool. This is an administrative hearing where you present evidence before a judge.",
    whatWeProvide: [
      "Fair Hearing request filing with NYS OTDA",
      "Analysis of the MLTC's evidence package, including the UAS report",
      "AI-generated Memo of Law arguing why the FAD is incorrect",
      "Identification of favorable data points in the UAS",
      "Complete evidence package preparation",
    ],
    whatHappens:
      "Both you and the MLTC present evidence. The judge reviews the case and issues a decision. The UAS report the MLTC uses to determine hours is often open to interpretation, and we identify the data that supports your request.",
    timeline: "Hearing typically scheduled within 2-3 months",
    price: "$299",
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-lg text-muted-foreground mb-12">
            We provide expert advocacy at every stage of the home care hours
            increase process. Each stage builds on the last, and you only pay
            for what you need.
          </p>

          <div className="space-y-8">
            {stages.map((s) => (
              <Card key={s.stage} className="overflow-hidden">
                <CardHeader className="bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="text-sm">
                        Stage {s.stage}
                      </Badge>
                      <s.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-2xl font-bold text-primary">
                      {s.price}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{s.title}</CardTitle>
                  <p className="text-muted-foreground">{s.description}</p>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">What We Provide</h3>
                    <ul className="space-y-2">
                      {s.whatWeProvide.map((item, i) => (
                        <li key={i} className="flex gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">What Happens Next</h3>
                    <p className="text-sm text-muted-foreground">
                      {s.whatHappens}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {s.timeline}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-4">
              White Glove Service Available
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Want us to handle everything? Our White Glove option ($199/stage)
              includes document submission, case manager communication, and a
              dedicated advocate managing your case end-to-end.
            </p>
            <Link href="/register">
              <Button size="lg">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
