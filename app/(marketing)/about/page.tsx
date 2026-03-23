import { Card, CardContent } from "@/components/ui/card";
import { Heart, Shield, Users, Award } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Compassion First",
    description:
      "We understand the stress families face when a loved one doesn't get enough care. We treat every case with empathy.",
  },
  {
    icon: Shield,
    title: "Expert Advocacy",
    description:
      "We know the MLTC system inside and out. Our expertise in Medicaid home care means better outcomes for you.",
  },
  {
    icon: Users,
    title: "Family Focused",
    description:
      "We work with the entire family to build the strongest possible case for increased home care hours.",
  },
  {
    icon: Award,
    title: "Results Driven",
    description:
      "Our 98% success rate speaks for itself. We don't stop until you get the hours you deserve.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-6">About Get More Hours</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Get More Hours was founded with a simple mission: help New York
            seniors receive the home care hours they need and deserve. Too many
            families struggle with Managed Long Term Care (MLTC) companies that
            deny or limit the hours in their Plan of Care, leaving vulnerable
            seniors without adequate support.
          </p>

          <h2 className="text-2xl font-bold mb-4">
            Understanding the System
          </h2>
          <p className="text-muted-foreground mb-4">
            If you or a loved one is enrolled in Community Medicaid and receives
            home care through an MLTC company, you have the right to request an
            increase in your authorized hours. When health conditions change or
            existing hours aren&apos;t enough, the MLTC is required to review
            your Plan of Care.
          </p>
          <p className="text-muted-foreground mb-8">
            Unfortunately, many requests are initially denied. The MLTC issues
            what&apos;s called an Initial Adverse Determination (IAD). But this
            is not the end &mdash; you have the right to appeal, and if that
            fails, to request a Fair Hearing with New York State. At every
            stage, having knowledgeable advocacy makes a critical difference.
          </p>

          <h2 className="text-2xl font-bold mb-4">What We Do</h2>
          <p className="text-muted-foreground mb-4">
            We guide families through the entire process of requesting more
            home care hours. Our platform uses advanced technology to generate
            professional request letters, appeals, and legal memoranda, backed
            by your medical documentation and Letters of Medical Necessity from
            your doctor.
          </p>
          <p className="text-muted-foreground mb-8">
            Whether you&apos;re filing your first request or preparing for a
            Fair Hearing, we provide the expertise and tools to build the
            strongest possible case.
          </p>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {values.map((v, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <v.icon className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold text-lg mb-2">{v.title}</h3>
                  <p className="text-muted-foreground">{v.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
