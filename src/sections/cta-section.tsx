
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import AnimatedElement from "@/components/animated-element";

const CtaSection = () => {
  const scrollToTools = () => {
    const toolsSection = document.getElementById("tools");
    if (toolsSection) {
      toolsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="container-padding bg-gradient-to-br from-tooltopia-purple/10 to-tooltopia-purple-light/10">
      <div className="max-w-3xl mx-auto text-center">
        <AnimatedElement animation="slideUp">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Boost Your Productivity?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Access all tools for free and start saving time today.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 rounded-full"
            onClick={scrollToTools}
          >
            Explore All Tools <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </AnimatedElement>
      </div>
    </section>
  );
};

export default CtaSection;
