import { TestimonialCard } from "@/components/marketing/testimonial-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const testimonials = [
  {
    quote:
      "They helped my mother go from 6 hours to 12 hours a day. The process was so much easier than trying to do it ourselves.",
    name: "Maria R.",
    location: "Brooklyn, NY",
    outcome: "Hours increased from 6 to 12/day",
  },
  {
    quote:
      "After my father's MLTC denied our request, Get More Hours filed an appeal and won. We couldn't have done it without them.",
    name: "James L.",
    location: "Queens, NY",
    outcome: "Appeal won - 10 hours/day approved",
  },
  {
    quote:
      "The fair hearing process was intimidating, but they prepared everything and walked us through it. My grandmother now gets the care she needs.",
    name: "Sarah K.",
    location: "Bronx, NY",
    outcome: "Fair hearing won - full hours approved",
  },
  {
    quote:
      "We had been fighting with the MLTC for months. Within weeks of signing up, we had a professional appeal submitted and won.",
    name: "Robert T.",
    location: "Manhattan, NY",
    outcome: "Hours doubled from 4 to 8/day",
  },
  {
    quote:
      "My aunt needed 24-hour care but was only getting 8 hours. The team built an incredible case using her medical records and doctor's letter.",
    name: "Linda M.",
    location: "Staten Island, NY",
    outcome: "Increased from 8 to 16 hours/day",
  },
  {
    quote:
      "The White Glove service was worth every penny. They handled everything while I focused on caring for my mother.",
    name: "Patricia D.",
    location: "Brooklyn, NY",
    outcome: "Full increase approved at hearing",
  },
];

export default function TestimonialsPage() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">What Families Say</h1>
          <p className="text-lg text-muted-foreground mb-12">
            Real stories from real families across New York who fought for and
            received the home care hours they needed.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Ready to get the hours your family deserves?
            </p>
            <Link href="/register">
              <Button size="lg">
                Start Your Case
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
