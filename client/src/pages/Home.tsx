import {
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
  ProofSection,
} from "@/components/marketing/HomeSections";
import { useMarketingCta } from "@/hooks/useMarketingCta";

export default function Home() {
  const { handleGetStarted } = useMarketingCta();

  return (
    <div className="overflow-hidden bg-[#fafaf7] text-[#0b1b33]">
      <HeroSection onGetStarted={handleGetStarted} />
      <ProfessionTicker />
      <ProblemSection />
      <HowItWorksSection />
      <ComparisonSection />
      <PersonasSection />
      <ProofSection onGetStarted={handleGetStarted} />
      <LegalServicesSection onGetStarted={handleGetStarted} />
      <PricingSection onGetStarted={handleGetStarted} />
      <FaqSection />
      <FinalCtaSection onGetStarted={handleGetStarted} />
    </div>
  );
}
