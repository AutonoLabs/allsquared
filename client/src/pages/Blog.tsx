import { MarketingPageHero } from "@/components/marketing/MarketingPageHero";
import { MarketingSection } from "@/components/marketing/MarketingSection";
import { articleCards } from "@/components/marketing/projectContent";
import { MarketingLinkButton } from "@/components/marketing/MarketingCtas";
import { containerVariants, itemVariants } from "@/lib/motion";
import { motion, useReducedMotion } from "framer-motion";

export default function Blog() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="overflow-hidden bg-[#fafaf7] text-[#0b1b33]">
      <MarketingPageHero
        badge="Field notes"
        kicker="Journal"
        title="Writing about trust before it becomes another product category."
        accent="trust"
        description="Short, sharp essays from the AllSquared orbit: contracts, escrow, care systems, legal UX, Yapper, and the proof layer missing from high-trust work."
        primaryAction={{ label: "Send us a note", href: "/contact?intent=message" }}
        secondaryAction={{ label: "See projects", href: "/projects" }}
        highlights={["Less announcements", "More arguments", "UK base · global team"]}
      />

      <MarketingSection
        numeral="I"
        kicker="Featured carousel"
        title="Less square, more editorial: arguments you can slide through."
        accent="arguments"
        tone="white"
      >
        <motion.div
          variants={containerVariants}
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-14 overflow-x-auto pb-6 [scroll-snap-type:x_mandatory] lg:overflow-visible lg:pb-0"
        >
          <div className="flex min-w-max gap-5 lg:min-w-0 lg:grid lg:grid-cols-[1.15fr_0.9fr_0.9fr]">
            {articleCards.map((article, index) => (
              <motion.article
                key={article.slug}
                variants={itemVariants}
                className={`group relative flex min-h-[420px] w-[82vw] shrink-0 scroll-ml-5 flex-col overflow-hidden rounded-[22px] border border-[#e2e0d6] bg-white p-7 shadow-[0_1px_0_#e2e0d6] [scroll-snap-align:start] transition-all hover:-translate-y-[2px] hover:border-[#c7d0e0] hover:shadow-[0_20px_50px_-28px_rgba(11,27,51,0.2)] sm:w-[520px] lg:w-auto ${
                  index === 0 ? "lg:col-span-1 lg:min-h-[520px]" : "lg:min-h-[520px]"
                }`}
              >
                <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(135deg,rgba(31,107,63,0.16),rgba(11,27,51,0.06)_45%,transparent)]" />
                <div className="relative flex items-start justify-between gap-6">
                  <div>
                    <div className="as25-font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#1f6b3f]">{article.label}</div>
                    <div className="mt-2 rounded-full border border-[#e2e0d6] bg-[#fafaf7] px-3 py-1 text-[12px] font-medium text-[#2d466f]">
                      {article.theme}
                    </div>
                  </div>
                  <div className="as25-font-display text-[64px] italic leading-none text-[#c7d0e0] transition-colors group-hover:text-[#2d466f]/35">
                    {index + 1}
                  </div>
                </div>
                <div className="relative mt-auto pt-16">
                  <h2 className="as25-font-display text-[34px] font-normal leading-[1.03] tracking-[-0.03em] text-[#0b1b33] md:text-[44px]">
                    {article.title}
                  </h2>
                  <p className="mt-5 text-[15.5px] leading-7 text-[#2d466f]">{article.deck}</p>
                  <div className="mt-8 flex items-center justify-between border-t border-[#e2e0d6] pt-5">
                    <span className="as25-font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#6b7e9e]">{article.readTime}</span>
                    <span className="text-[14px] font-semibold text-[#1f6b3f]">Draft coming soon →</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </MarketingSection>

      <MarketingSection
        numeral="II"
        kicker="Editorial stance"
        title="The blog is not a press room. It is where the thesis gets sharper."
        accent="thesis"
      >
        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-[18px] border border-[#e2e0d6] bg-white p-8">
            <div className="as25-font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#1f6b3f]">What belongs here</div>
            <p className="mt-5 as25-font-display text-[30px] font-normal leading-[1.15] tracking-[-0.02em] text-[#0b1b33]">
              Essays that make a reader argue with the page a little.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              "Trust infrastructure for messy human services.",
              "Payment systems that reduce anxiety instead of adding admin.",
              "Care coordination as proof, rhythm, and responsibility.",
              "Legal UX that gives relationships somewhere safer to stand.",
            ].map((item) => (
              <div key={item} className="rounded-[14px] border border-[#e2e0d6] bg-white p-6 text-[15px] leading-7 text-[#2d466f]">
                <span className="mr-2 text-[#1f6b3f]">•</span>{item}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10">
          <MarketingLinkButton href="/contact?intent=message">Suggest a topic</MarketingLinkButton>
        </div>
      </MarketingSection>
    </div>
  );
}
