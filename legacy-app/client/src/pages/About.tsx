import { FinalCtaSection } from "@/components/marketing/HomeSections";
import { MarketingPageHero } from "@/components/marketing/MarketingPageHero";
import { MarketingSection } from "@/components/marketing/MarketingSection";
import { personas, stats } from "@/components/marketing/homeContent";
import { useMarketingCta } from "@/hooks/useMarketingCta";

const principles = [
  {
    title: "Serious work deserves a serious contract",
    body: "The agreement should be readable, fast to produce, and strong enough for both sides to rely on when money is moving.",
  },
  {
    title: "Cashflow should not depend on awkward reminders",
    body: "If a supplier has done the work and proved the milestone, the release should be operational, not emotional.",
  },
  {
    title: "Dispute structure should exist before the dispute",
    body: "The contract, funds, evidence, and review windows need to be aligned before anything goes wrong, not improvised after.",
  },
];

export default function About() {
  const { handleGetStarted, goToPath } = useMarketingCta();

  return (
    <div className="overflow-hidden bg-[#fafaf7] text-[#0b1b33]">
      <MarketingPageHero
        badge="UK based with a global team"
        kicker="About"
        title="We are building the version of getting paid that should already exist."
        accent="should already exist."
        description="AllSquared exists because late payment is still treated as normal business friction in industries where one missed release can distort payroll, materials, production, or delivery confidence for months."
        primaryAction={{ label: "Start with your first contract", onClick: handleGetStarted }}
        secondaryAction={{ label: "Contact the team", onClick: () => goToPath("/contact"), primary: false }}
        highlights={[
          "Contract, escrow, proof, dispute",
          "UK-based commercial flow",
          "Global team, distributed builders",
        ]}
      />

      <MarketingSection
        numeral="I"
        kicker="Why now"
        title="Late payment is not a nuisance. For many firms, it is the event."
        accent="the event."
        tone="white"
      >
        <div className="mt-14 grid border-y border-[#c7d0e0] md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => (
            <article
              key={stat.label}
              className={`bg-white px-7 py-10 ${
                index < stats.length - 1 ? "border-b border-[#c7d0e0] xl:border-b-0 xl:border-r" : ""
              } ${index === 1 ? "md:border-r-0 xl:border-r" : ""}`}
            >
              <div className="as25-font-display text-[56px] font-normal tracking-[-0.04em] text-[#0b1b33] md:text-[64px]">
                {stat.value}
              </div>
              <div className="mt-3 max-w-[240px] text-[14.5px] font-medium leading-6 text-[#0b1b33]">
                {stat.label}
              </div>
              <div className="as25-font-mono mt-3 text-[10px] uppercase tracking-[0.12em] text-[#6b7e9e]">
                {stat.source}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 max-w-[880px] rounded-r-[10px] border-l-[3px] border-[#0b1b33] bg-[#f2f1eb] px-8 py-7 text-[16px] leading-8 text-[#2d466f]">
          The ambition is simple: if the work is real, the contract should be real, the funds should
          be ring-fenced, the proof should be visible, and the release should not require someone to
          send three careful follow-up emails and hope for the best.
        </div>
      </MarketingSection>

      <MarketingSection
        numeral="II"
        kicker="Principles"
        title="Three beliefs underneath the product."
        accent="underneath the product."
      >
        <div className="mt-14 grid gap-5 xl:grid-cols-3">
          {principles.map((principle) => (
            <article key={principle.title} className="rounded-[14px] border border-[#e2e0d6] bg-white px-7 py-8">
              <h2 className="as25-font-display text-[25px] font-normal leading-[1.15] tracking-[-0.01em] text-[#0b1b33]">
                {principle.title}
              </h2>
              <p className="mt-4 text-[14.5px] leading-7 text-[#2d466f]">{principle.body}</p>
            </article>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection
        numeral="III"
        kicker="Who we serve"
        title="The product is shaped around real categories of UK project work."
        accent="real categories"
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
            </article>
          ))}
        </div>
      </MarketingSection>

      <FinalCtaSection onGetStarted={handleGetStarted} />
    </div>
  );
}
