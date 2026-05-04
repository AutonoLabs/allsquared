import { FinalCtaSection } from "@/components/marketing/HomeSections";
import { MarketingPageHero } from "@/components/marketing/MarketingPageHero";
import { MarketingSection } from "@/components/marketing/MarketingSection";
import { useMarketingCta } from "@/hooks/useMarketingCta";

const clientProtections = [
  {
    title: "Your money is ring-fenced",
    body: "The funds go into regulated escrow rather than straight into a supplier's operating account.",
  },
  {
    title: "Approval stays with you",
    body: "Each milestone release depends on proof you can review, not on blind trust or vague payment timing.",
  },
  {
    title: "The contract is clear first",
    body: "Success criteria, scope boundaries, stage values, and dispute routes are set before the work begins.",
  },
];

const clientProcess = [
  {
    title: "Agree the job",
    body: "Set the scope, milestones, approvals, and release logic in plain English before any serious commitment is made.",
  },
  {
    title: "Fund the escrow",
    body: "Your supplier can see the job is funded, but the money remains ring-fenced until the agreed conditions are met.",
  },
  {
    title: "Review real proof",
    body: "Photos, files, commits, sign-off notes, and deliverables provide a clearer basis for approval than trust alone.",
  },
  {
    title: "Release what is earned",
    body: "When the milestone is right, approve and release. When it is not, the dispute logic already exists.",
  },
];

const supplierBenefits = [
  "Good suppliers close faster when the client can see the funds are real.",
  "Defined approval windows reduce pointless waiting on both sides.",
  "A strong process attracts better counterparties than loose deposit culture does.",
];

export default function Clients() {
  const { handleGetStarted, goToPath } = useMarketingCta();

  return (
    <div className="overflow-hidden bg-[#fafaf7] text-[#0b1b33]">
      <MarketingPageHero
        badge="For clients commissioning serious work"
        kicker="Clients"
        title="Pay for real progress, not hopeful promises."
        accent="hopeful promises."
        description="AllSquared gives commissioning clients a safer way to buy project work: a proper contract, ring-fenced funds, visible milestone proof, and clearer recourse when something slips."
        primaryAction={{ label: "Talk through a deal", onClick: () => goToPath("/contact") }}
        secondaryAction={{ label: "See the process", href: "/how-it-works" }}
        highlights={[
          "Escrow instead of unsecured deposits",
          "Milestone approvals with evidence",
          "Clearer contract before spend",
        ]}
      />

      <MarketingSection
        numeral="I"
        kicker="Protection"
        title="Three reasons clients trust the structure more."
        accent="trust the structure more."
        tone="white"
      >
        <div className="mt-14 grid gap-5 xl:grid-cols-3">
          {clientProtections.map((item) => (
            <article key={item.title} className="rounded-[14px] border border-[#e2e0d6] bg-white px-7 py-8">
              <h2 className="as25-font-display text-[24px] font-normal leading-[1.15] tracking-[-0.01em] text-[#0b1b33]">
                {item.title}
              </h2>
              <p className="mt-4 text-[14.5px] leading-7 text-[#2d466f]">{item.body}</p>
            </article>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection
        numeral="II"
        kicker="Process"
        title="What commissioning work looks like inside AllSquared."
        accent="inside AllSquared."
      >
        <div className="mt-14 grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
          {clientProcess.map((item, index) => (
            <article key={item.title} className="rounded-[14px] border border-[#e2e0d6] bg-white px-7 py-8">
              <div className="as25-font-display text-[42px] italic leading-none text-[#2d466f]">
                {index + 1}
              </div>
              <h3 className="as25-font-display mt-5 text-[24px] font-normal leading-[1.15] tracking-[-0.01em] text-[#0b1b33]">
                {item.title}
              </h3>
              <p className="mt-4 text-[14.5px] leading-7 text-[#2d466f]">{item.body}</p>
            </article>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection
        numeral="III"
        kicker="Why suppliers like it too"
        title="Better protection for the client also makes good suppliers easier to hire."
        accent="easier to hire."
        tone="white"
      >
        <div className="mt-14 space-y-4">
          {supplierBenefits.map((benefit) => (
            <div
              key={benefit}
              className="rounded-[14px] border border-[#e2e0d6] bg-white px-6 py-5 text-[15px] leading-7 text-[#0b1b33]"
            >
              {benefit}
            </div>
          ))}
        </div>
      </MarketingSection>

      <FinalCtaSection onGetStarted={handleGetStarted} />
    </div>
  );
}
