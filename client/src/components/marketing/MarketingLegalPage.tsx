import { marketingShell } from "@/components/marketing/homeContent";

export type MarketingLegalSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

type MarketingLegalPageProps = {
  badge: string;
  title: string;
  accent?: string;
  description: string;
  lastUpdated: string;
  sections: MarketingLegalSection[];
  contactLabel: string;
  contactHref: string;
  contactText: string;
};

export function MarketingLegalPage({
  badge,
  title,
  accent,
  description,
  lastUpdated,
  sections,
  contactLabel,
  contactHref,
  contactText,
}: MarketingLegalPageProps) {
  const parts = accent ? title.split(accent) : [title];
  const after = accent ? parts.slice(1).join(accent) : "";

  return (
    <div className="overflow-hidden bg-[#fafaf7] text-[#0b1b33]">
      <section className="as25-hero-bg relative overflow-hidden border-b border-[#c7d0e0] py-20 md:py-24">
        <div className={marketingShell}>
          <div className="max-w-[860px]">
            <div className="as25-font-mono inline-flex items-center gap-2 rounded-full border border-[#e2e0d6] bg-white px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-[#2d466f]">
              <span className="inline-flex h-[7px] w-[7px] rounded-full bg-[#2a8554] shadow-[0_0_0_3px_rgba(229,241,234,1)]" />
              {badge}
            </div>
            <h1 className="as25-font-display mt-8 text-[44px] font-normal leading-[1.02] tracking-[-0.03em] text-[#0b1b33] md:text-[72px]">
              {parts[0]}
              {accent ? <span className="italic text-[#2d466f]">{accent}</span> : null}
              {after}
            </h1>
            <p className="mt-6 max-w-[640px] text-[18px] leading-8 text-[#2d466f]">{description}</p>
            <div className="as25-font-mono mt-8 text-[10.5px] uppercase tracking-[0.16em] text-[#6b7e9e]">
              Last updated - {lastUpdated}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#c7d0e0] bg-white py-20 md:py-24">
        <div className={marketingShell}>
          <article className="mx-auto max-w-[920px] space-y-10">
            {sections.map((section, index) => (
              <section key={section.title} className={index === 0 ? "" : "border-t border-[#e2e0d6] pt-10"}>
                <h2 className="as25-font-display text-[28px] font-normal leading-[1.15] tracking-[-0.02em] text-[#0b1b33] md:text-[34px]">
                  {section.title}
                </h2>
                <div className="mt-5 space-y-4 text-[15.5px] leading-8 text-[#2d466f]">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {section.bullets?.length ? (
                  <ul className="mt-5 space-y-3 border-l-[3px] border-[#1f6b3f] pl-5 text-[15px] leading-7 text-[#0b1b33]">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}

            <section className="border-t border-[#e2e0d6] pt-10">
              <h2 className="as25-font-display text-[28px] font-normal leading-[1.15] tracking-[-0.02em] text-[#0b1b33] md:text-[34px]">
                {contactLabel}
              </h2>
              <p className="mt-5 text-[15.5px] leading-8 text-[#2d466f]">
                {contactText}{" "}
                <a href={contactHref} className="font-semibold text-[#1f6b3f] underline decoration-[rgba(31,107,63,0.35)] underline-offset-4">
                  {contactHref.replace("mailto:", "")}
                </a>
                .
              </p>
            </section>
          </article>
        </div>
      </section>
    </div>
  );
}
