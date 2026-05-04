import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

type MarketingCtaButtonProps = {
  children: ReactNode;
  primary?: boolean;
  onClick: () => void;
};

export function MarketingCtaButton({
  children,
  primary = true,
  onClick,
}: MarketingCtaButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        primary
          ? "inline-flex items-center gap-2 rounded-[8px] border border-[#1f6b3f] bg-[#1f6b3f] px-6 py-3 text-[14.5px] font-semibold text-white transition hover:bg-[#2a8554] hover:border-[#2a8554]"
          : "inline-flex items-center gap-2 rounded-[8px] border border-[#c7d0e0] bg-white px-6 py-3 text-[14.5px] font-semibold text-[#0b1b33] transition hover:border-[#0b1b33] hover:bg-[rgba(11,27,51,0.03)]"
      }
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </button>
  );
}

type MarketingLinkButtonProps = {
  href: string;
  children: ReactNode;
};

export function MarketingLinkButton({ href, children }: MarketingLinkButtonProps) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 rounded-[8px] border border-[#c7d0e0] bg-white px-6 py-3 text-[14.5px] font-semibold text-[#0b1b33] transition hover:border-[#0b1b33] hover:bg-[rgba(11,27,51,0.03)]"
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </a>
  );
}
