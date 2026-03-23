import { HeroSection } from "@/components/marketing/hero-section";
import { ServicesSection } from "@/components/marketing/services-section";
import { ProcessSection } from "@/components/marketing/process-section";
import { TestimonialCard } from "@/components/marketing/testimonial-card";
import { CtaSection } from "@/components/marketing/cta-section";
import { Users, TrendingUp, MapPin } from "lucide-react";

const stats = [
  { icon: Users, value: "500+", label: "Families Helped" },
  { icon: TrendingUp, value: "98%", label: "Success Rate" },
  { icon: MapPin, value: "All 5", label: "Boroughs Served" },
];

const testimonials = [
  {
    quote:
      "They helped my mother go from 6 hours to 12 hours a day. The process was so much easier with their help.",
    name: "Maria R.",
    location: "Brooklyn, NY",
    outcome: "Hours increased from 6 to 12/day",
  },
  {
    quote:
      "After my father's MLTC denied our request, Get More Hours filed an appeal and won. We couldn't have done it alone.",
    name: "James L.",
    location: "Queens, NY",
    outcome: "Appeal won - 10 hours/day approved",
  },
  {
    quote:
      "The fair hearing was intimidating, but they prepared everything. My grandmother now gets the care she needs.",
    name: "Sarah K.",
    location: "Bronx, NY",
    outcome: "Fair hearing won - full hours approved",
  },
];

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <section className="py-12 border-y bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto text-center">
            {stats.map((stat, i) => (
              <div key={i}>
                <stat.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ServicesSection />
      <ProcessSection />

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Families Say</h2>
            <p className="text-muted-foreground">
              Real results for real families across New York.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
