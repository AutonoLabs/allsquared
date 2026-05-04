import { SectionHeading } from "@/components/marketing/SectionHeading";
import { marketingShell } from "@/components/marketing/homeContent";
import type { ReactNode } from "react";

type MarketingSectionProps = {
  id?: string;
  numeral: string;
  kicker: string;
  title: string;
  accent?: string;
  description?: string;
  tone?: "paper" | "white";
  children: ReactNode;
};

export function MarketingSection({
  id,
  numeral,
  kicker,
  title,
  accent,
  description,
  tone = "paper",
  children,
}: MarketingSectionProps) {
  return (
    <section
      id={id}
      className={`border-b border-[#c7d0e0] py-24 md:py-32 ${
        tone === "white" ? "bg-white" : "bg-[#fafaf7]"
      }`}
    >
      <div className={marketingShell}>
        <SectionHeading
          numeral={numeral}
          kicker={kicker}
          title={title}
          accent={accent}
          description={description}
        />
        {children}
      </div>
    </section>
  );
}
