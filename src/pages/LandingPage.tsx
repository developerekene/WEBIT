import AnimatedDragDrop from "../components/AnimatedDragDrop";
import BentoGrid from "../components/BentoGrid";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import LogoMarquee from "../components/LogoMarquee";
import Navbar from "../components/Navbar";
import TemplateGallery from "../components/TemplateGallery";
import Workflow from "../components/Workflow";

function LandingPage() {
  return (
    <div>
      <Navbar />
      <main>
        <Hero />
        <AnimatedDragDrop />
        <LogoMarquee />
        <BentoGrid />
        <Workflow />
        <TemplateGallery />
        <Footer /> 
      </main>
    </div>
  );
}

export default LandingPage;
