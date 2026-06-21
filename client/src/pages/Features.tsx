import { FinalCtaSection } from "@/components/marketing/HomeSections";
import { MarketingPageHero } from "@/components/marketing/MarketingPageHero";
import { MarketingSection } from "@/components/marketing/MarketingSection";
import { legalServices, personas } from "@/components/marketing/homeContent";
import { useMarketingCta } from "@/hooks/useMarketingCta";
import { CheckSquare, CreditCard, FileText, Scale } from "lucide-react";

const platformPillars = [
  {
    title: "Contract generation",
    body: "AI-drafted agreements shaped for the actual job, then positioned for optional solicitor review when the stakes justify it.",
    icon: FileText,
  },
  {
    title: "Regulated escrow",
    body: "Client funds sit with an FCA-authorised partner instead of in either side's current account.",
    icon: CreditCard,
  },
  {
    title: "Verified milestones",
    body: "Releases are tied to submitted proof and defined review windows rather than to awkward reminder emails.",
    icon: CheckSquare,
  },
  {
    title: "Structured disputes",
    body: "When something does go wrong, the evidence, approvals, and contract history already live in one place.",
    icon: Scale,
  },
];

export default function Features() {
  const { handleGetStarted } = useMarketingCta();

  return (
    <div className="overflow-hidden bg-[#fafaf7] text-[#0b1b33]">
      <MarketingPageHero
        badge="The platform in one view"
        kicker="Features"
        title="Everything the deal needs. Nothing it doesn't."
        accent="Nothing it doesn't."
        description="AllSquared is deliberately narrow. It is not a general freelancer marketplace and not just an escrow widget. It is contract, escrow, proof, and dispute structure for serious UK project work."
        primaryAction={{ label: "Start a deal", onClick: handleGetStarted }}
        secondaryAction={{ label: "See how it works", href: "/how-it-works" }}
        highlights={[
          "AI-drafted contract flow",
          "Regulated UK escrow partner",
          "Evidence-led milestone release",
        ]}
        heroVariant="flat"
      />

      <MarketingSection
        numeral="I"
        kicker="Core platform"
        title="Four protections, working as one commercial system."
        accent="one"
      >
        <div className="mt-14 grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
          {platformPillars.map((pillar) => {
            const Icon = pillar.icon;

            return (
              <article
                key={pillar.title}
                className="rounded-[14px] border border-[#e2e0d6] bg-white px-7 py-8 transition-all hover:-translate-y-[2px] hover:border-[#c7d0e0]"
              >
                <div className="grid h-11 w-11 place-items-center rounded-[8px] border border-[#c7d0e0] bg-[#fafaf7] text-[#0b1b33]">
                  <Icon className="h-5 w-5" strokeWidth={1.6} />
                </div>
                <h2 className="as25-font-display mt-5 text-[24px] font-normal leading-[1.15] tracking-[-0.01em] text-[#0b1b33]">
                  {pillar.title}
                </h2>
                <p className="mt-4 text-[14.5px] leading-7 text-[#2d466f]">{pillar.body}</p>
              </article>
            );
          })}
        </div>
      </MarketingSection>

      <MarketingSection
        numeral="II"
        kicker="Built for"
        title="The people who feel late payment as a real business event."
        accent="real business event."
        description="We are not optimising for £200 gigs. The product is aimed at the kind of work where one delayed release distorts cashflow, payroll, materials, or delivery confidence."
        tone="white"
      >
        <div className="mt-14 grid gap-5 xl:grid-cols-3">
          {personas.map((persona) => (
            <article key={persona.tag} className="rounded-[14px] border border-[#e2e0d6] bg-white px-7 py-8">
              <div className="as25-font-mono text-[11px] uppercase tracking-[0.12em] text-[#1f6b3f]">
                {persona.tag}
              </div>
              <h3 className="as25-font-display mt-5 text-[25px] font-normal leading-[1.15] tracking-[-0.01em] text-[#0b1b33]">
                {persona.title}
              </h3>
              <p className="mt-4 text-[14.5px] leading-7 text-[#2d466f]">{persona.body}</p>
              <ul className="mt-6 border-t border-[#e2e0d6] pt-5 text-[13.5px] leading-6 text-[#0b1b33]">
                {persona.items.map((item) => (
                  <li key={item} className="flex gap-3 py-1.5">
                    <span className="text-[#1f6b3f]">+</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection
        numeral="III"
        kicker="Support layer"
        title="When the standard flow is not enough, legal help is already close by."
        accent="already close by."
      >
        <div className="mt-14 grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
          {legalServices.map((service) => (
            <article key={service.title} className="rounded-[14px] border border-[#e2e0d6] bg-white p-7">
              <h3 className="as25-font-display text-[24px] font-normal leading-[1.15] tracking-[-0.01em] text-[#0b1b33]">
                {service.title}
              </h3>
              <div className="as25-font-mono mt-3 text-[10.5px] uppercase tracking-[0.16em] text-[#6b7e9e]">
                {service.subtitle}
              </div>
              <ul className="mt-6 space-y-3 border-t border-[#e2e0d6] pt-5 text-[14px] leading-6 text-[#0b1b33]">
                {service.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#1f6b3f]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </MarketingSection>

      <FinalCtaSection onGetStarted={handleGetStarted} />
    </div>
  );
}
