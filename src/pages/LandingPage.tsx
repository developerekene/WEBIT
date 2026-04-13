import AnimatedDragDrop from "../components/AnimatedDragDrop";
import BentoGrid from "../components/BentoGrid";
import Hero from "../components/Hero";
import LogoMarquee from "../components/LogoMarquee";
import TemplateGallery from "../components/TemplateGallery";
import Workflow from "../components/Workflow";

function LandingPage() {
  return (
    <div>
      <main>
        <Hero />
        <AnimatedDragDrop />
        <LogoMarquee />
        <BentoGrid />
        <Workflow />
        <TemplateGallery />
      </main>
    </div>
  );
}

export default LandingPage;
