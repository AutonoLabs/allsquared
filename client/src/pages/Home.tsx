import {
  BlogCarouselSection,
  ComparisonSection,
  FaqSection,
  FinalCtaSection,
  HeroSection,
  HowItWorksSection,
  LegalServicesSection,
  PersonasSection,
  PricingSection,
  ProblemSection,
  ProfessionTicker,
  ProjectsPreviewSection,
  ProofSection,
} from "@/components/marketing/HomeSections";
import { useMarketingCta } from "@/hooks/useMarketingCta";
import { itemVariants } from "@/lib/motion";
import { motion, useReducedMotion } from "framer-motion";

export default function Home() {
  const { handleGetStarted } = useMarketingCta();
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={itemVariants}
      initial={reduceMotion ? false : "hidden"}
      animate="visible"
      className="overflow-hidden bg-[#fafaf7] text-[#0b1b33]"
    >
      <HeroSection onGetStarted={handleGetStarted} />
      <ProfessionTicker />
      <ProblemSection />
      <HowItWorksSection />
      <ComparisonSection />
      <PersonasSection />
      <ProjectsPreviewSection />
      <BlogCarouselSection />
      <ProofSection onGetStarted={handleGetStarted} />
      <LegalServicesSection onGetStarted={handleGetStarted} />
      <PricingSection onGetStarted={handleGetStarted} />
      <FaqSection />
      <FinalCtaSection onGetStarted={handleGetStarted} />
    </motion.div>
  );
}
