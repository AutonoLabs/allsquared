import { FinalCtaSection } from "@/components/marketing/HomeSections";
import { MarketingPageHero } from "@/components/marketing/MarketingPageHero";
import { MarketingSection } from "@/components/marketing/MarketingSection";
import { pricingPlans, steps } from "@/components/marketing/homeContent";
import { useMarketingCta } from "@/hooks/useMarketingCta";

const freelancerProblems = [
  "You finish the work and the money enters a fresh round of internal approvals.",
  "The client says the invoice is fine, then disappears into month-end and finance backlog.",
  "A scope conversation becomes a payment conversation because nothing was structured tightly enough upfront.",
  "You spend more energy keeping the release alive than doing the work that earned it.",
];

const freelancerOutcomes = [
  "The contract is written before anyone starts improvising around the deal.",
  "The funds are ring-fenced before you commit serious time or materials.",
  "The release depends on proof and a defined review window, not vague goodwill.",
  "You stop teaching clients that slow payment is something you will simply absorb.",
];

export default function Freelancers() {
  const { handleGetStarted } = useMarketingCta();

  return (
    <div className="overflow-hidden bg-[#fafaf7] text-[#0b1b33]">
      <MarketingPageHero
        badge="For freelancers, consultants, and independent specialists"
        kicker="Freelancers"
        title="You did the work. The money should not become another project."
        accent="another project."
        description="AllSquared is built for people who win serious work on trust, then get stuck in the dead space between delivery and payment."
        primaryAction={{ label: "Protect my next deal", onClick: handleGetStarted }}
        secondaryAction={{ label: "See how it works", href: "/how-it-works" }}
        highlights={[
          "Contract before scope drift",
          "Escrow before delivery risk",
          "Release tied to proof",
        ]}
      />

      <MarketingSection
        numeral="I"
        kicker="The current problem"
        title="Freelancers do too much unpaid collections work."
        accent="unpaid collections work."
        tone="white"
      >
        <div className="mt-14 grid gap-4">
          {freelancerProblems.map((problem) => (
            <div
              key={problem}
              className="rounded-[14px] border border-[#e2e0d6] bg-white px-6 py-5 text-[15px] leading-7 text-[#0b1b33]"
            >
              {problem}
            </div>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection
        numeral="II"
        kicker="What changes"
        title="The whole flow becomes cleaner before the job begins."
        accent="cleaner"
      >
        <div className="mt-14 grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <article key={step.number} className="rounded-[14px] border border-[#e2e0d6] bg-white px-7 py-8">
                <div className="as25-font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#1f6b3f]">
                  {step.number}
                </div>
                <div className="mt-5 grid h-11 w-11 place-items-center rounded-[8px] border border-[#c7d0e0] bg-[#fafaf7] text-[#0b1b33]">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <h3 className="as25-font-display mt-5 text-[24px] font-normal leading-[1.15] tracking-[-0.01em] text-[#0b1b33]">
                  {step.title}
                </h3>
                <p className="mt-4 text-[14.5px] leading-7 text-[#2d466f]">{step.body}</p>
              </article>
            );
          })}
        </div>

        <div className="mt-10 grid gap-4">
          {freelancerOutcomes.map((outcome) => (
            <div
              key={outcome}
              className="rounded-[14px] border border-[#e2e0d6] bg-[#f2f1eb] px-6 py-5 text-[15px] leading-7 text-[#0b1b33]"
            >
              {outcome}
            </div>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection
        numeral="III"
        kicker="Best fit"
        title="Two routes most independents start with."
        accent="start with."
        tone="white"
      >
        <div className="mt-14 grid gap-5 xl:grid-cols-2">
          {pricingPlans.slice(0, 2).map((plan) => (
            <article key={plan.name} className="rounded-[14px] border border-[#e2e0d6] bg-white p-8">
              <div className="as25-font-display text-[24px] font-normal text-[#0b1b33]">{plan.name}</div>
              <div className="as25-font-display mt-5 text-[56px] leading-none tracking-[-0.04em] text-[#0b1b33]">
                {plan.price}
                <small className="ml-2 text-[16px] italic text-[#6b7e9e]">{plan.suffix}</small>
              </div>
              <p className="mt-4 text-[14px] leading-6 text-[#2d466f]">{plan.description}</p>
              <ul className="mt-6 space-y-3 border-t border-[#e2e0d6] pt-5 text-[13.5px] leading-6 text-[#0b1b33]">
                {plan.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-[#1f6b3f]">+</span>
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
