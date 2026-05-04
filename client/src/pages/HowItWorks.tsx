import { FinalCtaSection } from "@/components/marketing/HomeSections";
import { MarketingPageHero } from "@/components/marketing/MarketingPageHero";
import { MarketingSection } from "@/components/marketing/MarketingSection";
import { matrixRows, steps } from "@/components/marketing/homeContent";
import { useMarketingCta } from "@/hooks/useMarketingCta";

function matrixCellClass(value: string, isUs = false) {
  if (isUs) return "bg-[rgba(31,107,63,0.05)] text-center font-semibold text-[#0b1b33]";
  if (value === "No" || value === "Not offered") return "text-[#a8392b]";
  if (value === "Partial" || value === "Signing only") return "text-[#8a6a1e]";
  return "text-[#6b7e9e]";
}

const reviewRules = [
  {
    title: "Proof first",
    body: "Every milestone asks for evidence that fits the work: photos, sign-off notes, commits, timesheets, files, or handover packs.",
  },
  {
    title: "72-hour review window",
    body: "The client has a defined period to approve or flag a real issue. That keeps review serious without turning it into another vague promise.",
  },
  {
    title: "Silence becomes approval",
    body: "If nothing is disputed in time, the release proceeds. The whole point is to stop good work dying in someone's inbox.",
  },
];

export default function HowItWorks() {
  const { handleGetStarted } = useMarketingCta();

  return (
    <div className="overflow-hidden bg-[#fafaf7] text-[#0b1b33]">
      <MarketingPageHero
        badge="Contract / escrow / verification / release"
        kicker="How it works"
        title="The money moves when the work is proved."
        accent="proved."
        description="AllSquared replaces invoice chasing with a tighter loop: draft the agreement, fund the deal, prove the milestone, release the money. Same-day when approved, structured when disputed."
        primaryAction={{ label: "Draft my first contract", onClick: handleGetStarted }}
        secondaryAction={{ label: "See pricing", href: "/pricing" }}
        highlights={[
          "Milestone-by-milestone release",
          "72-hour approval window",
          "Built for serious UK B2B work",
        ]}
      />

      <MarketingSection
        id="method"
        numeral="I"
        kicker="The method"
        title="Four moves. Everyone knows what happens next."
        accent="Everyone knows"
        description="This is the operating model. No mystery, no vague admin loop, and no separate contract, escrow, and proof tools stitched together after the fact."
      >
        <div className="mt-14 grid border-y border-[#c7d0e0] md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const parts = step.title.split(step.accent);

            return (
              <article
                key={step.number}
                className={`flex flex-col gap-4 bg-[#fafaf7] px-7 py-10 ${
                  index < steps.length - 1 ? "border-b border-[#c7d0e0] xl:border-b-0 xl:border-r" : ""
                } ${index === 1 ? "md:border-r-0 xl:border-r" : ""}`}
              >
                <div className="as25-font-mono flex items-center justify-between text-[10.5px] uppercase tracking-[0.16em] text-[#6b7e9e]">
                  <span>Stage</span>
                  <span className="text-[#1f6b3f]">{step.number}</span>
                </div>
                <div className="grid h-11 w-11 place-items-center rounded-[8px] border border-[#c7d0e0] bg-white text-[#0b1b33]">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <h2 className="as25-font-display text-[24px] font-normal leading-[1.18] tracking-[-0.01em] text-[#0b1b33]">
                  {parts[0]}
                  <span className="italic text-[#2d466f]">{step.accent}</span>
                  {parts[1] ?? ""}
                </h2>
                <p className="text-[14.5px] leading-7 text-[#2d466f]">{step.body}</p>
              </article>
            );
          })}
        </div>
      </MarketingSection>

      <MarketingSection
        numeral="II"
        kicker="Approval logic"
        title="A project only works when approval has teeth."
        accent="has teeth."
        description="Approval has to be fair to the client and final enough for the supplier to trust it. That is why the release rules are explicit."
        tone="white"
      >
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {reviewRules.map((rule) => (
            <article key={rule.title} className="rounded-[14px] border border-[#e2e0d6] bg-white px-7 py-8">
              <div className="as25-font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#1f6b3f]">
                Release rule
              </div>
              <h3 className="as25-font-display mt-4 text-[24px] font-normal leading-[1.15] tracking-[-0.01em] text-[#0b1b33]">
                {rule.title}
              </h3>
              <p className="mt-4 text-[14.5px] leading-7 text-[#2d466f]">{rule.body}</p>
            </article>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection
        id="comparison"
        numeral="III"
        kicker="Comparison"
        title="Still better than invoices, reminders, and crossed fingers."
        accent="crossed fingers."
      >
        <div className="mt-14 overflow-hidden rounded-[10px] border border-[#e2e0d6] bg-white">
          <table className="w-full table-fixed border-collapse text-left text-[14px]">
            <thead>
              <tr className="bg-[#f2f1eb]">
                <th className="px-5 py-4 text-[10.5px] uppercase tracking-[0.14em] text-[#6b7e9e]"> </th>
                <th className="px-5 py-4 text-[10.5px] uppercase tracking-[0.14em] text-[#6b7e9e]">DIY</th>
                <th className="hidden px-5 py-4 text-[10.5px] uppercase tracking-[0.14em] text-[#6b7e9e] md:table-cell">
                  Platforms
                </th>
                <th className="hidden px-5 py-4 text-[10.5px] uppercase tracking-[0.14em] text-[#6b7e9e] lg:table-cell">
                  Contract tools
                </th>
                <th className="bg-[#0b1b33] px-5 py-4 text-center text-[10.5px] uppercase tracking-[0.14em] text-white">
                  AllSquared
                </th>
              </tr>
            </thead>
            <tbody>
              {matrixRows.map((row) => (
                <tr key={row[0]} className="border-t border-[#e2e0d6]">
                  <td className="as25-font-display px-5 py-5 text-[18px] font-normal leading-6 text-[#0b1b33]">
                    {row[0]}
                  </td>
                  <td className={`px-5 py-5 ${matrixCellClass(row[1])}`}>{row[1]}</td>
                  <td className={`hidden px-5 py-5 md:table-cell ${matrixCellClass(row[2])}`}>{row[2]}</td>
                  <td className={`hidden px-5 py-5 lg:table-cell ${matrixCellClass(row[3])}`}>{row[3]}</td>
                  <td className={`px-5 py-5 ${matrixCellClass(row[4], true)}`}>{row[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="as25-font-display mt-8 max-w-[700px] text-[18px] leading-8 text-[#2d466f]">
          The point is not prettier admin. It is a cleaner commercial structure: contract, money,
          proof, and dispute logic in one place.
        </p>
      </MarketingSection>

      <FinalCtaSection onGetStarted={handleGetStarted} />
    </div>
  );
}
