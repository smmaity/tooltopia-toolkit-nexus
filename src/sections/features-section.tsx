
import FeatureCard from "@/components/feature-card";
import { features } from "@/data/features";
import AnimatedElement from "@/components/animated-element";

const FeaturesSection = () => {
  return (
    <section id="features" className="bg-accent">
      <div className="container-padding">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose Tooltopia?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Built with productivity in mind, our platform offers everything you need to work smarter, not harder
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <AnimatedElement key={index} delay={index * 0.15} animation="slideUp">
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </AnimatedElement>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
