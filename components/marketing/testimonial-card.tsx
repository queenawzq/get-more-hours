import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  name: string;
  location: string;
  outcome: string;
}

export function TestimonialCard({
  quote,
  name,
  location,
  outcome,
}: TestimonialCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-primary text-primary" />
          ))}
        </div>
        <p className="text-muted-foreground mb-4">&ldquo;{quote}&rdquo;</p>
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-muted-foreground">{location}</p>
          <p className="text-sm font-medium text-primary mt-1">{outcome}</p>
        </div>
      </CardContent>
    </Card>
  );
}
