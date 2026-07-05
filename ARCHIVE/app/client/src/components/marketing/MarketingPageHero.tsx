import { MarketingCtaButton, MarketingLinkButton } from "@/components/marketing/MarketingCtas";
import { marketingShell } from "@/components/marketing/homeContent";
import type { ReactNode } from "react";

type HeroAction = {
  label: string;
  href?: string;
  onClick?: () => void;
  primary?: boolean;
};

type MarketingPageHeroProps = {
  badge?: string;
  kicker: string;
  title: string;
  accent?: string;
  description: string;
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
  highlights?: string[];
  aside?: ReactNode;
};

function renderAction(action: HeroAction) {
  if (action.href) {
    return <MarketingLinkButton href={action.href}>{action.label}</MarketingLinkButton>;
  }

  if (!action.onClick) {
    return null;
  }

  return (
    <MarketingCtaButton primary={action.primary ?? true} onClick={action.onClick}>
      {action.label}
    </MarketingCtaButton>
  );
}

export function MarketingPageHero({
  badge,
  kicker,
  title,
  accent,
  description,
  primaryAction,
  secondaryAction,
  highlights,
  aside,
}: MarketingPageHeroProps) {
  const parts = accent ? title.split(accent) : [title];
  const after = accent ? parts.slice(1).join(accent) : "";

  return (
    <section className="as25-hero-bg relative overflow-hidden border-b border-[#c7d0e0] py-20 md:py-24">
      <div className={marketingShell}>
        <div className={`relative z-10 ${aside ? "grid gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:items-start" : "max-w-[860px]"}`}>
          <div>
            {badge ? (
              <div className="as25-font-mono inline-flex items-center gap-2 rounded-full border border-[#e2e0d6] bg-white px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-[#2d466f]">
                <span className="inline-flex h-[7px] w-[7px] rounded-full bg-[#2a8554] shadow-[0_0_0_3px_rgba(229,241,234,1)]" />
                {badge}
              </div>
            ) : null}

            <div className="as25-font-mono mt-8 text-[11px] uppercase tracking-[0.18em] text-[#6b7e9e]">
              {kicker}
            </div>

            <h1 className="as25-font-display mt-5 max-w-[820px] text-[44px] font-normal leading-[1.02] tracking-[-0.03em] text-[#0b1b33] md:text-[78px]">
              {parts[0]}
              {accent ? <span className="italic text-[#2d466f]">{accent}</span> : null}
              {after}
            </h1>

            <p className="mt-7 max-w-[620px] text-[18px] leading-8 text-[#2d466f]">{description}</p>

            {primaryAction || secondaryAction ? (
              <div className="mt-9 flex flex-wrap gap-3">
                {primaryAction ? renderAction(primaryAction) : null}
                {secondaryAction ? renderAction(secondaryAction) : null}
              </div>
            ) : null}

            {highlights?.length ? (
              <div className="mt-10 flex flex-wrap gap-4 text-[10.5px] uppercase tracking-[0.12em] text-[#2d466f]">
                {highlights.map((item) => (
                  <span key={item} className="as25-font-mono inline-flex items-center gap-2">
                    <span className="h-[6px] w-[6px] rounded-full bg-[#2a8554]" />
                    {item}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          {aside ? <div>{aside}</div> : null}
        </div>
      </div>
    </section>
  );
}
