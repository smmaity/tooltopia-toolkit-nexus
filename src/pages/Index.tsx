
import Header from "@/components/header";
import HeroSection from "@/sections/hero-section";
import ToolsSection from "@/sections/tools-section";
import FeaturesSection from "@/sections/features-section";
import CtaSection from "@/sections/cta-section";
import Newsletter from "@/components/newsletter";
import Footer from "@/components/footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <ToolsSection />
        <FeaturesSection />
        <CtaSection />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
