import {
  faqs,
  legalCredentials,
  legalServices,
  marketingShell,
  matrixRows,
  personas,
  pricingPlans,
  sampleMilestones,
  stats,
  steps,
  tickerItems,
  whenToUse,
} from "@/components/marketing/homeContent";
import { MarketingCtaButton, MarketingLinkButton } from "@/components/marketing/MarketingCtas";
import { SectionHeading } from "@/components/marketing/SectionHeading";

type SectionProps = {
  onGetStarted: () => void;
};

function matrixCellClass(value: string, isUs = false) {
  if (isUs) return "bg-[rgba(31,107,63,0.05)] text-center font-semibold text-[#0b1b33]";
  if (value === "No" || value === "Not offered") return "text-[#a8392b]";
  if (value === "Partial" || value === "Signing only") return "text-[#8a6a1e]";
  return "text-[#6b7e9e]";
}

export function HeroSection({ onGetStarted }: SectionProps) {
  return (
    <section className="as25-hero-bg relative overflow-hidden border-b border-[#c7d0e0] py-20 md:py-24">
      <div className={marketingShell}>
        <div className="relative z-10 grid gap-14 lg:grid-cols-[1.05fr_1fr] lg:items-start">
          <div>
            <div className="as25-font-mono inline-flex items-center gap-2 rounded-full border border-[#e2e0d6] bg-white px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-[#2d466f]">
              <span className="inline-flex h-[7px] w-[7px] rounded-full bg-[#2a8554] shadow-[0_0_0_3px_rgba(229,241,234,1)]" />
              FCA-authorised escrow · SRA-regulated solicitor network
            </div>

            <h1 className="as25-font-display mt-8 max-w-[760px] text-[44px] font-normal leading-[1.02] tracking-[-0.03em] text-[#0b1b33] md:text-[78px]">
              Weeks of work. Months of <span className="italic text-[#2d466f]">chasing.</span>
              <span
                className="as25-caret ml-1 inline-block h-[0.85em] w-[0.5ch] translate-y-[0.06em] rounded-[1px] bg-[#2a8554]"
                aria-hidden="true"
              />
            </h1>

            <p className="mt-7 max-w-[560px] text-[18px] leading-8 text-[#2d466f]">
              It&apos;s the 21st century. A serious tradesman, a serious agency, a serious producer
              - none of them should still be writing{" "}
              <strong className="font-semibold text-[#0b1b33]">careful reminder emails</strong> to
              get paid what they&apos;re owed.
            </p>

            <ul className="mt-10 flex max-w-[560px] flex-col gap-4 border-y border-[#c7d0e0] py-6">
              {[
                ["i.", "FCA-authorised escrow for every deal", "£5K - £1m+"],
                ["ii.", "AI-drafted, solicitor-certified contracts", "Ready in minutes"],
                ["iii.", "Instant payouts on milestone proof", "Not reminders"],
              ].map(([index, label, amount]) => (
                <li
                  key={label}
                  className="grid grid-cols-[28px_1fr_auto] items-baseline gap-4 text-[15.5px] leading-7 text-[#0b1b33]"
                >
                  <span className="as25-font-mono text-[11px] tracking-[0.1em] text-[#6b7e9e]">
                    {index}
                  </span>
                  <span className="font-medium">{label}</span>
                  <span className="as25-font-mono text-[12px] font-medium tracking-[0.05em] text-[#1f6b3f]">
                    {amount}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap gap-3">
              <MarketingCtaButton onClick={onGetStarted}>Draft my first contract</MarketingCtaButton>
              <MarketingLinkButton href="#how">See how it works</MarketingLinkButton>
            </div>

            <div className="mt-10 flex flex-wrap gap-4 text-[10.5px] uppercase tracking-[0.12em] text-[#2d466f]">
              {["FCA-regulated escrow", "SRA-regulated solicitor network", "UK client-money rules"].map((item) => (
                <span key={item} className="as25-font-mono inline-flex items-center gap-2">
                  <span className="h-[6px] w-[6px] rounded-full bg-[#2a8554]" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <aside className="rounded-[14px] border border-[#e2e0d6] bg-white p-7 shadow-[0_1px_0_#e2e0d6,0_24px_48px_-16px_rgba(11,27,51,0.12),0_8px_16px_-8px_rgba(11,27,51,0.06)]">
            <div className="relative">
              <div className="pointer-events-none absolute inset-[14px] rounded-[8px] border border-[#e2e0d6] opacity-50" />
              <div className="relative">
                <div className="mb-5 flex items-baseline justify-between gap-4 border-b border-[#e2e0d6] pb-4">
                  <div className="as25-font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#0b1b33]">
                    Service Agreement
                    <span className="ml-2 text-[9px] font-semibold tracking-[0.16em] text-[#a8392b]">
                      · SAMPLE
                    </span>
                  </div>
                  <div className="as25-font-mono text-[10.5px] tracking-[0.06em] text-[#6b7e9e]">
                    № AS-DEMO-0418
                  </div>
                </div>

                <h2 className="as25-font-display text-[22px] font-normal leading-7 tracking-[-0.01em]">
                  Commercial fit-out - Unit 4, Hackney Road
                </h2>
                <div className="as25-font-mono mt-2 text-[10.5px] uppercase tracking-[0.06em] text-[#6b7e9e]">
                  Governed by the laws of England & Wales · 14 March 2026
                </div>

                <div className="mt-6 grid gap-5 border-b border-dotted border-[#e2e0d6] pb-5 md:grid-cols-2">
                  <div>
                    <div className="as25-font-mono mb-1 text-[9.5px] uppercase tracking-[0.18em] text-[#6b7e9e]">
                      Contractor
                    </div>
                    <div className="as25-font-display text-[15px]">Hartley & Sons Ltd</div>
                    <div className="as25-font-mono mt-1 text-[10px] leading-5 text-[#6b7e9e]">
                      Co. No. 09214483
                      <br />
                      12 Bethnal Green Rd, London E2
                    </div>
                  </div>
                  <div>
                    <div className="as25-font-mono mb-1 text-[9.5px] uppercase tracking-[0.18em] text-[#6b7e9e]">
                      Client
                    </div>
                    <div className="as25-font-display text-[15px]">Northwall Studios LLP</div>
                    <div className="as25-font-mono mt-1 text-[10px] leading-5 text-[#6b7e9e]">
                      OC 412006
                      <br />
                      7 Curtain Road, London EC2A
                    </div>
                  </div>
                </div>

                <div className="py-3">
                  {sampleMilestones.map(([index, label, meta, amount, state]) => (
                    <div
                      key={`${index}-${label}`}
                      className={`grid grid-cols-[28px_1fr_auto] items-center gap-3 border-t border-dotted border-[#e2e0d6] px-1 py-3 first:border-t-0 ${
                        state === "active" ? "bg-[rgba(31,107,63,0.04)]" : ""
                      }`}
                    >
                      <div
                        className={`as25-font-display text-[16px] italic ${
                          state === "done"
                            ? "text-[#1f6b3f]"
                            : state === "active"
                              ? "text-[#1f6b3f]"
                              : "text-[#2d466f]"
                        }`}
                      >
                        {index}
                      </div>
                      <div className={state === "done" ? "text-[#6b7e9e]" : "text-[#0b1b33]"}>
                        <div className="text-[13.5px] leading-5">{label}</div>
                        <small
                          className={`as25-font-mono mt-1 block text-[9.5px] uppercase tracking-[0.08em] ${
                            state === "done" || state === "active" ? "text-[#1f6b3f]" : "text-[#6b7e9e]"
                          }`}
                        >
                          {meta}
                        </small>
                      </div>
                      <div className="as25-font-mono text-[12px] font-medium text-[#0b1b33]">
                        {amount}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="as25-font-mono mt-3 flex items-center justify-between rounded-[8px] bg-[#0b1b33] px-4 py-4 text-[11px] uppercase tracking-[0.1em] text-white">
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-flex h-[7px] w-[7px] rounded-full bg-[#2a8554] shadow-[0_0_0_0_rgba(42,133,84,0.6)]" />
                    Funds held · release pending
                  </span>
                  <span>£88,000.00</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export function ProfessionTicker() {
  return (
    <div className="border-b border-[#c7d0e0] bg-[#f2f1eb]">
      <div className="flex overflow-hidden">
        <div className="as25-font-mono hidden shrink-0 items-center gap-3 border-r border-[#c7d0e0] px-6 text-[10.5px] uppercase tracking-[0.16em] text-[#1f6b3f] md:flex">
          <span className="h-px w-4 bg-[#1f6b3f]" />
          Built for
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="as25-marquee-track flex w-max items-center">
            {[...tickerItems, ...tickerItems].map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="border-r border-[#c7d0e0] px-8 py-5 text-[14px] font-medium text-[#2d466f]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProblemSection() {
  return (
    <section id="problem" className="border-b border-[#c7d0e0] bg-white py-24 md:py-32">
      <div className={marketingShell}>
        <SectionHeading
          numeral="I"
          kicker="The problem"
          title="A handshake is a lovely thing. It is also, increasingly, a poor way to get paid."
          accent="increasingly,"
        />

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

        <div className="mt-14 max-w-[840px] rounded-r-[10px] border-l-[3px] border-[#0b1b33] bg-[#f2f1eb] px-8 py-7">
          <p className="as25-font-display text-[24px] leading-[1.45] tracking-[-0.01em] text-[#0b1b33] md:text-[28px]">
            You did the work. You sent the invoice. Now you&apos;re the one writing the awkward email,
            hoping it doesn&apos;t read as desperate.{" "}
            <span className="italic text-[#2d466f]">That shouldn&apos;t be part of the job.</span>
          </p>
        </div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  return (
    <section id="how" className="border-b border-[#c7d0e0] bg-[#fafaf7] py-24 md:py-32">
      <div className={marketingShell}>
        <SectionHeading
          numeral="II"
          kicker="The method"
          title="Four moves. Everyone wins."
          accent="Everyone wins."
          description="Draft the agreement. Fund it into regulated escrow. Verify each milestone with proof, not promise. Release the money the same day. Repeat until the job is done."
        />

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
                <h3 className="as25-font-display text-[24px] font-normal leading-[1.18] tracking-[-0.01em] text-[#0b1b33]">
                  {parts[0]}
                  <span className="italic text-[#2d466f]">{step.accent}</span>
                  {parts[1] ?? ""}
                </h3>
                <p className="text-[14.5px] leading-7 text-[#2d466f]">{step.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ComparisonSection() {
  return (
    <section id="matrix" className="border-b border-[#c7d0e0] bg-white py-24 md:py-32">
      <div className={marketingShell}>
        <SectionHeading
          numeral="III"
          kicker="Comparison"
          title="Five tools doing half the job. Or one doing all of it."
          accent="one"
        />

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

        <p className="as25-font-display mt-8 max-w-[680px] text-[18px] leading-8 text-[#2d466f]">
          Contract, escrow, verification, dispute - in one place.{" "}
          <span className="italic text-[#0b1b33]">Nobody else does all four.</span>
        </p>
      </div>
    </section>
  );
}

export function PersonasSection() {
  return (
    <section id="who" className="border-b border-[#c7d0e0] bg-[#fafaf7] py-24 md:py-32">
      <div className={marketingShell}>
        <SectionHeading
          numeral="IV"
          kicker="Who it is for"
          title="For serious professionals not wanting to chase invoices again."
          accent="chase invoices"
        />

        <div className="mt-14 grid gap-5 xl:grid-cols-3">
          {personas.map((persona) => {
            const parts = persona.title.split(persona.accent);

            return (
              <article
                key={persona.tag}
                className="flex flex-col rounded-[14px] border border-[#e2e0d6] bg-white px-7 py-8 transition-all hover:-translate-y-[2px] hover:border-[#c7d0e0] hover:shadow-[0_12px_32px_-12px_rgba(11,27,51,0.12)]"
              >
                <div className="as25-font-mono text-[11px] uppercase tracking-[0.12em] text-[#1f6b3f]">
                  {persona.tag}
                </div>
                <h3 className="as25-font-display mt-5 text-[25px] font-normal leading-[1.15] tracking-[-0.01em] text-[#0b1b33]">
                  {parts[0]}
                  <span className="italic text-[#2d466f]">{persona.accent}</span>
                  {parts[1] ?? ""}
                </h3>
                <p className="mt-4 flex-1 text-[14.5px] leading-7 text-[#2d466f]">{persona.body}</p>
                <ul className="mt-6 border-t border-[#e2e0d6] pt-5 text-[13.5px] leading-6 text-[#0b1b33]">
                  {persona.items.map((item) => (
                    <li key={item} className="flex gap-3 py-1.5">
                      <span className="text-[#1f6b3f]">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ProofSection({ onGetStarted }: SectionProps) {
  return (
    <section id="proof" className="border-b border-[#c7d0e0] bg-white py-24 md:py-32">
      <div className={marketingShell}>
        <SectionHeading
          numeral="V"
          kicker="The proof"
          title="The quiet relief of being believed before you've had to argue."
          accent="being believed"
        />

        <div className="mx-auto mt-14 max-w-[760px] rounded-[14px] border border-[#e2e0d6] bg-white px-8 py-12 text-center shadow-[0_16px_40px_-20px_rgba(11,27,51,0.12)]">
          <div className="as25-font-mono inline-flex items-center gap-3 text-[10.5px] uppercase tracking-[0.18em] text-[#1f6b3f]">
            <span className="h-px w-6 bg-[#1f6b3f]/40" />
            Stories from the founding cohort
            <span className="h-px w-6 bg-[#1f6b3f]/40" />
          </div>
          <h3 className="as25-font-display mx-auto mt-6 max-w-[560px] text-[30px] font-normal leading-[1.2] tracking-[-0.02em] text-[#0b1b33] md:text-[38px]">
            We&apos;d rather show you <span className="italic text-[#2d466f]">real</span> stories than
            invented ones.
          </h3>
          <p className="mx-auto mt-5 max-w-[520px] text-[15.5px] leading-7 text-[#2d466f]">
            Case studies land here as our founding users complete their first contracts. If
            you&apos;d like yours to be among them - and you&apos;d be happy to share how it went -
            we&apos;ll add an extra month to your plan in exchange.
          </p>
          <div className="mt-8">
            <MarketingCtaButton onClick={onGetStarted}>Join the founding cohort</MarketingCtaButton>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LegalServicesSection({ onGetStarted }: SectionProps) {
  return (
    <section id="legal" className="border-b border-[#c7d0e0] bg-[#fafaf7] py-24 md:py-32">
      <div className={marketingShell}>
        <SectionHeading
          numeral="VI"
          kicker="Legal services"
          title="When you need a solicitor, we connect you - faster."
          accent="connect you"
        />

        <div className="mt-10 max-w-[780px] space-y-5 text-[16px] leading-8 text-[#2d466f]">
          <p>
            Most AllSquared deals never need a lawyer. But when they do - a{" "}
            <strong className="font-semibold text-[#0b1b33]">high-stakes review</strong>, a{" "}
            <strong className="font-semibold text-[#0b1b33]">bespoke draft</strong>, a{" "}
            <strong className="font-semibold text-[#0b1b33]">genuine dispute</strong> - we connect you
            with independent solicitors in our partner network.
          </p>
          <p>
            Because the contract, evidence, and payment history already live on the platform,
            solicitors get up to speed in{" "}
            <strong className="font-semibold text-[#0b1b33]">minutes - not days</strong>. That means{" "}
            <mark className="rounded-[4px] bg-[#e5f1ea] px-1.5 py-0.5 text-[#1f6b3f]">much faster resolution</mark>{" "}
            and <mark className="rounded-[4px] bg-[#e5f1ea] px-1.5 py-0.5 text-[#1f6b3f]">lower total cost</mark>{" "}
            than any high-street firm you&apos;d find on your own.
          </p>
        </div>

        <div className="mt-8 max-w-[840px] rounded-r-[10px] border-l-[3px] border-[#1f6b3f] bg-[#e5f1ea] px-6 py-5 text-[15px] leading-7 text-[#2d466f]">
          <strong className="as25-font-mono mb-2 block text-[10.5px] uppercase tracking-[0.2em] text-[#0b1b33]">
            Important notice
          </strong>
          AllSquared is not a law firm and does not provide legal advice. We provide general
          information only. When you book a legal service you are engaging an independent solicitor
          in our partner network who advises you directly under their own professional terms and
          professional-indemnity insurance.
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
          {legalServices.map((service) => (
            <article
              key={service.title}
              className="flex flex-col rounded-[14px] border border-[#e2e0d6] bg-white p-7 transition-all hover:-translate-y-[2px] hover:border-[#c7d0e0] hover:shadow-[0_12px_32px_-12px_rgba(11,27,51,0.12)]"
            >
              <h3 className="as25-font-display text-[24px] font-normal leading-[1.15] tracking-[-0.01em] text-[#0b1b33]">
                {service.title}
              </h3>
              <div className="as25-font-mono mt-3 text-[10.5px] uppercase tracking-[0.16em] text-[#6b7e9e]">
                {service.subtitle}
              </div>
              <ul className="mt-6 flex-1 space-y-3 border-t border-[#e2e0d6] pt-5 text-[14px] leading-6 text-[#0b1b33]">
                {service.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#1f6b3f]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <MarketingCtaButton primary={false} onClick={onGetStarted}>
                  Ask about this
                </MarketingCtaButton>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 grid gap-6 border-y border-[#c7d0e0] py-10 lg:grid-cols-[1fr_2fr] lg:items-center">
          <div className="as25-font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#1f6b3f]">
            Our solicitor network
            <br />
            every member verified
          </div>
          <ul className="grid gap-3 text-[14px] leading-6 text-[#2d466f] md:grid-cols-2">
            {legalCredentials.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-[#1f6b3f]">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-[200px_1fr] md:items-end md:gap-12">
          <div className="as25-font-mono text-[11px] uppercase tracking-[0.18em] text-[#6b7e9e]">
            When to use it
          </div>
          <div>
            <h3 className="as25-font-display max-w-[760px] text-[30px] font-normal leading-[1.08] tracking-[-0.02em] text-[#0b1b33] md:text-[42px]">
              Three moments where a fixed-fee solicitor pays for itself.
            </h3>
          </div>
        </div>

        <div className="mt-10 grid gap-5 xl:grid-cols-3">
          {whenToUse.map((card) => (
            <article
              key={card.title}
              className="rounded-[14px] border border-[#e2e0d6] bg-white px-7 py-8 transition-all hover:-translate-y-[2px] hover:border-[#c7d0e0]"
            >
              <div className="as25-font-display mb-4 text-[42px] italic leading-none text-[#2d466f]">
                {card.numeral}
              </div>
              <h4 className="as25-font-display text-[22px] font-normal leading-[1.2] text-[#0b1b33]">
                {card.title}
              </h4>
              <p className="mt-3 text-[14px] leading-7 text-[#2d466f]">{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PricingSection({ onGetStarted }: SectionProps) {
  return (
    <section id="pricing" className="border-b border-[#c7d0e0] bg-white py-24 md:py-32">
      <div className={marketingShell}>
        <SectionHeading
          numeral="VII"
          kicker="Pricing"
          title="A small fee to lock in your whole payday."
          accent="whole payday."
          description="No subscription required. No cut of your future work. One per-deal fee that's typically covered several times over by a single avoided dispute."
        />

        <div className="mt-14 grid gap-5 xl:grid-cols-3">
          {pricingPlans.map((plan) => (
            <article
              key={plan.name}
              className={`relative flex flex-col rounded-[14px] border bg-white p-8 transition-all hover:-translate-y-[2px] hover:shadow-[0_14px_34px_-18px_rgba(11,27,51,0.12)] ${
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
                    <span className="text-[#1f6b3f]">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <MarketingCtaButton primary={plan.featured} onClick={onGetStarted}>
                  {plan.cta}
                </MarketingCtaButton>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-[10px] border border-[#e2e0d6] bg-[#f2f1eb] px-6 py-5 text-[15px] leading-7 text-[#2d466f]">
          <span className="as25-font-mono mr-2 text-[10.5px] uppercase tracking-[0.16em] text-[#0b1b33]">
            Example
          </span>
          On a £60,000 deal, on the Pay Per Deal plan, the total platform fee is £700 - about 1.2%
          of the contract value. One avoided late payment covers a dozen deals.
        </div>

        <div className="mx-auto mt-20 max-w-[720px] text-center">
          <div className="as25-font-mono text-[10.5px] uppercase tracking-[0.22em] text-[#1f6b3f]">
            Optional · legal services add-on
          </div>
          <h3 className="as25-font-display mt-4 text-[30px] font-normal leading-[1.12] tracking-[-0.02em] text-[#0b1b33] md:text-[38px]">
            Need a human solicitor? <span className="italic text-[#2d466f]">We&apos;ll connect you.</span>
          </h3>
          <p className="mt-4 text-[15px] leading-7 text-[#2d466f]">
            If your deal needs extra legal input, a contract review, bespoke drafting, or dispute
            support, we connect you with our partner solicitor network. Independent, SRA-regulated,
            fixed-fee quotes up front.
          </p>
          <div className="mt-6">
            <MarketingCtaButton primary={false} onClick={onGetStarted}>
              Ask about legal services
            </MarketingCtaButton>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FaqSection() {
  return (
    <section id="faq" className="border-b border-[#c7d0e0] bg-[#fafaf7] py-24 md:py-32">
      <div className={marketingShell}>
        <SectionHeading
          numeral="VIII"
          kicker="Honest answers"
          title="What most people want to ask, but don't."
          accent="most"
        />

        <div className="mx-auto mt-14 max-w-[920px]">
          {faqs.map((faq, index) => (
            <details
              key={faq.q}
              className={`group border-t border-[#c7d0e0] py-7 ${index === faqs.length - 1 ? "border-b" : ""}`}
            >
              <summary className="flex cursor-pointer list-none justify-between gap-6 text-[21px] font-normal leading-8 tracking-[-0.02em] text-[#0b1b33] marker:hidden">
                <span className="as25-font-display">{faq.q}</span>
                <span className="as25-font-display mt-1 text-[24px] leading-none text-[#1f6b3f] transition-transform group-open:rotate-180">
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-[760px] text-[15.5px] leading-7 text-[#2d466f]">{faq.a}</p>
              {faq.points ? (
                <ol className="mt-6 space-y-5">
                  {faq.points.map((point) => (
                    <li key={point.numeral} className="relative pl-11 text-[15.5px] leading-7 text-[#0b1b33]">
                      <span className="as25-font-display absolute left-0 top-0 text-[22px] italic leading-none text-[#2d466f]">
                        {point.numeral}
                      </span>
                      <span className="block font-semibold">{point.head}</span>
                      <span className="mt-1 block text-[#2d466f]">{point.body}</span>
                    </li>
                  ))}
                </ol>
              ) : null}
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCtaSection({ onGetStarted }: SectionProps) {
  return (
    <section id="start" className="as25-hero-bg relative overflow-hidden py-24 text-center md:py-32">
      <div className={marketingShell}>
        <h2 className="as25-font-display text-[44px] font-normal leading-[1.02] tracking-[-0.03em] text-[#0b1b33] md:text-[72px]">
          End the waiting. <span className="italic text-[#2d466f]">Begin the winning.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-[560px] text-[18px] leading-8 text-[#2d466f]">
          Your first contract is free. No card, no commitment, just the quiet relief of having this
          particular problem permanently solved.
        </p>
        <div className="mt-9">
          <MarketingCtaButton onClick={onGetStarted}>Draft my first contract</MarketingCtaButton>
        </div>
      </div>
    </section>
  );
}
