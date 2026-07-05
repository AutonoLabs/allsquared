import { FinalCtaSection } from "@/components/marketing/HomeSections";
import { MarketingPageHero } from "@/components/marketing/MarketingPageHero";
import { MarketingSection } from "@/components/marketing/MarketingSection";
import { legalCredentials, legalServices, whenToUse } from "@/components/marketing/homeContent";
import { useMarketingCta } from "@/hooks/useMarketingCta";

export default function LegalServices() {
  const { handleGetStarted } = useMarketingCta();

  return (
    <div className="overflow-hidden bg-[#fafaf7] text-[#0b1b33]">
      <MarketingPageHero
        badge="Independent solicitors, when the deal needs them"
        kicker="Legal services"
        title="When you need a solicitor, the handover should be fast."
        accent="handover should be fast."
        description="Most deals should close with the contract flow alone. But when a review, bespoke draft, or dispute really does need a solicitor, AllSquared already has the contract, evidence, and payment history in one place."
        primaryAction={{ label: "Ask about legal support", onClick: handleGetStarted }}
        secondaryAction={{ label: "See core pricing", href: "/pricing" }}
        highlights={[
          "Independent UK-qualified solicitors",
          "Fixed-fee scoping where possible",
          "Faster context because the platform already has the file",
        ]}
      />

      <section className="border-b border-[#c7d0e0] bg-[#fafaf7] py-8">
        <div className="mx-auto w-full max-w-[1240px] px-5 md:px-8 lg:px-10">
          <div className="max-w-[860px] rounded-r-[10px] border-l-[3px] border-[#1f6b3f] bg-[#e5f1ea] px-6 py-5 text-[15px] leading-7 text-[#2d466f]">
            <strong className="as25-font-mono mb-2 block text-[10.5px] uppercase tracking-[0.2em] text-[#0b1b33]">
              Important notice
            </strong>
            AllSquared is not a law firm and does not provide legal advice. When you book a legal
            service you are engaging an independent solicitor in our partner network who advises you
            directly under their own professional terms and professional-indemnity insurance.
          </div>
        </div>
      </section>

      <MarketingSection
        numeral="I"
        kicker="Service menu"
        title="Four kinds of help, depending on how serious the question is."
        accent="how serious the question is."
        tone="white"
      >
        <div className="mt-14 grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
          {legalServices.map((service) => (
            <article key={service.title} className="rounded-[14px] border border-[#e2e0d6] bg-white p-7">
              <h2 className="as25-font-display text-[24px] font-normal leading-[1.15] tracking-[-0.01em] text-[#0b1b33]">
                {service.title}
              </h2>
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
        numeral="II"
        kicker="Network standard"
        title="The solicitors are verified before they are introduced."
        accent="verified"
      >
        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {legalCredentials.map((item) => (
            <div
              key={item}
              className="flex items-start gap-4 rounded-[14px] border border-[#e2e0d6] bg-white px-6 py-5 text-[14.5px] leading-7 text-[#0b1b33]"
            >
              <span className="mt-2 h-2 w-2 rounded-full bg-[#1f6b3f]" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection
        numeral="III"
        kicker="When to use it"
        title="Three moments where solicitor time earns its keep."
        accent="earns its keep."
        tone="white"
      >
        <div className="mt-14 grid gap-5 xl:grid-cols-3">
          {whenToUse.map((card) => (
            <article key={card.title} className="rounded-[14px] border border-[#e2e0d6] bg-white px-7 py-8">
              <div className="as25-font-display mb-4 text-[42px] italic leading-none text-[#2d466f]">
                {card.numeral}
              </div>
              <h3 className="as25-font-display text-[22px] font-normal leading-[1.2] text-[#0b1b33]">
                {card.title}
              </h3>
              <p className="mt-3 text-[14px] leading-7 text-[#2d466f]">{card.body}</p>
            </article>
          ))}
        </div>
      </MarketingSection>

      <FinalCtaSection onGetStarted={handleGetStarted} />
    </div>
  );
}
