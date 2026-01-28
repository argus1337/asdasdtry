import { Quote } from "lucide-react";

export function TestimonialSection() {
  return (
    <section className="py-16 lg:py-24 bg-card/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <Quote className="absolute -top-4 -left-4 w-12 h-12 text-primary/30" />
          <blockquote className="text-xl sm:text-2xl lg:text-3xl font-medium leading-relaxed text-white text-center mb-8">
            {`"CreateSync transformed our influencer marketing strategy. Their team's expertise in matching us with the perfect creators resulted in a 340% increase in engagement and a significant boost in brand awareness."`}
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
              SM
            </div>
            <div className="text-left">
              <div className="font-semibold text-white">Sarah Mitchell</div>
              <div className="text-sm text-muted-foreground">
                VP of Marketing, TechBrand Inc.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
