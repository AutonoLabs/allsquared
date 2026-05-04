import { FinalCtaSection } from "@/components/marketing/HomeSections";
import { MarketingPageHero } from "@/components/marketing/MarketingPageHero";
import { MarketingSection } from "@/components/marketing/MarketingSection";
import { faqs, legalServices, pricingPlans } from "@/components/marketing/homeContent";
import { useMarketingCta } from "@/hooks/useMarketingCta";

const pricingFaqs = faqs.filter((faq) =>
  [
    "What size of job is this really designed for?",
    "What does \"FCA-authorised escrow\" actually mean?",
    "Is there an upper limit on deal size?",
  ].includes(faq.q)
);

export default function Pricing() {
  const { handleGetStarted } = useMarketingCta();

  return (
    <div className="overflow-hidden bg-[#fafaf7] text-[#0b1b33]">
      <MarketingPageHero
        badge="Simple pricing for serious work"
        kicker="Pricing"
        title="A small fee to protect the whole payment."
        accent="whole payment."
        description="No percentage forever. No broad platform tax on your future work. The pricing is designed to be justified by one avoided dispute, one avoided late payment cycle, or one avoided cashflow shock."
        primaryAction={{ label: "Draft my first contract", onClick: handleGetStarted }}
        secondaryAction={{ label: "Read the legal add-ons", href: "/legal-services" }}
        highlights={[
          "Flat fee for smaller deals",
          "Per-deal pricing for larger work",
          "Optional solicitor services separately scoped",
        ]}
      />

      <MarketingSection
        numeral="I"
        kicker="Core plans"
        title="Choose the structure that matches how you actually sell."
        accent="actually sell."
        tone="white"
      >
        <div className="mt-14 grid gap-5 xl:grid-cols-3">
          {pricingPlans.map((plan) => (
            <article
              key={plan.name}
              className={`relative flex flex-col rounded-[14px] border bg-white p-8 ${
                plan.featured
                  ? "border-[#1f6b3f] bg-[linear-gradient(180deg,rgba(31,107,63,0.05),transparent_45%)]"
                  : "border-[#e2e0d6]"
              }`}
            >
              {plan.featured ? (
                <div className="as25-font-mono absolute right-5 top-0 rounded-b-[8px] bg-[#0b1b33] px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-white">
                  Most chosen
                </div>
              ) : null}

              <div className="as25-font-display text-[24px] font-normal text-[#0b1b33]">{plan.name}</div>
              <div className="as25-font-display mt-5 text-[56px] leading-none tracking-[-0.04em] text-[#0b1b33]">
                {plan.price}
                <small className="ml-2 text-[16px] italic text-[#6b7e9e]">{plan.suffix}</small>
              </div>
              <p className="mt-4 min-h-[84px] text-[14px] leading-6 text-[#2d466f]">{plan.description}</p>
              <ul className="mt-6 flex-1 space-y-3 border-t border-[#e2e0d6] pt-5 text-[13.5px] leading-6 text-[#0b1b33]">
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

        <div className="mt-10 rounded-[10px] border border-[#e2e0d6] bg-[#f2f1eb] px-6 py-5 text-[15px] leading-7 text-[#2d466f]">
          <span className="as25-font-mono mr-2 text-[10.5px] uppercase tracking-[0.16em] text-[#0b1b33]">
            Example
          </span>
          On a £60,000 deal, on the Pay Per Deal plan, the total platform fee is £700. In practice,
          one avoided late payment or one avoided dispute covers many deals.
        </div>
      </MarketingSection>

      <MarketingSection
        numeral="II"
        kicker="Optional legal services"
        title="The legal work is priced separately, on purpose."
        accent="on purpose."
        description="Most contracts should not need a solicitor call. When they do, the legal layer should be explicit, fixed-fee, and easy to scope."
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

      <MarketingSection
        numeral="III"
        kicker="Common pricing questions"
        title="The practical questions people ask before the first deal."
        accent="first deal."
        tone="white"
      >
        <div className="mx-auto mt-14 max-w-[920px]">
          {pricingFaqs.map((faq, index) => (
            <details
              key={faq.q}
              className={`group border-t border-[#c7d0e0] py-7 ${
                index === pricingFaqs.length - 1 ? "border-b" : ""
              }`}
            >
              <summary className="flex cursor-pointer list-none justify-between gap-6 text-[21px] font-normal leading-8 tracking-[-0.02em] text-[#0b1b33] marker:hidden">
                <span className="as25-font-display">{faq.q}</span>
                <span className="as25-font-display mt-1 text-[24px] leading-none text-[#1f6b3f] transition-transform group-open:rotate-180">
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-[760px] text-[15.5px] leading-7 text-[#2d466f]">{faq.a}</p>
            </details>
          ))}
        </div>
      </MarketingSection>

      <FinalCtaSection onGetStarted={handleGetStarted} />
    </div>
  );
}
