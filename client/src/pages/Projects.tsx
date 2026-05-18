import { MarketingPageHero } from "@/components/marketing/MarketingPageHero";
import { MarketingSection } from "@/components/marketing/MarketingSection";
import { projectCards } from "@/components/marketing/projectContent";
import { MarketingLinkButton } from "@/components/marketing/MarketingCtas";
import { containerVariants, itemVariants } from "@/lib/motion";
import { motion, useReducedMotion } from "framer-motion";

function ProjectVisual({ visual, mark }: { visual: string[]; mark: string }) {
  return (
    <div className="relative overflow-hidden rounded-[12px] border border-[#c7d0e0] bg-[#fafaf7] p-5">
      <div className="absolute right-4 top-4 as25-font-display text-[64px] italic leading-none text-[#c7d0e0]/60">
        {mark}
      </div>
      <div className="relative grid gap-3">
        {visual.map((item, index) => (
          <div
            key={item}
            className={`grid grid-cols-[34px_1fr_auto] items-center gap-3 rounded-[8px] border px-3 py-3 ${
              index === 1 ? "border-[#1f6b3f] bg-[#e5f1ea]" : "border-[#e2e0d6] bg-white"
            }`}
          >
            <span className="as25-font-display text-[18px] italic text-[#2d466f]">{index + 1}.</span>
            <span className="text-[13.5px] font-medium text-[#0b1b33]">{item}</span>
            <span className={`h-2 w-2 rounded-full ${index < 2 ? "bg-[#1f6b3f]" : "bg-[#c7d0e0]"}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Projects() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="overflow-hidden bg-[#fafaf7] text-[#0b1b33]">
      <MarketingPageHero
        badge="UK based · global team"
        kicker="Projects"
        title="Ventures and products now live under one clearer idea: projects."
        accent="projects."
        description="AllSquared is built from the UK by a distributed team for trust problems that are global: getting paid, coordinating care, proving progress, and keeping relationships intact when money or responsibility is on the line."
        primaryAction={{ label: "Submit a project", href: "/contact?intent=venture" }}
        secondaryAction={{ label: "Apply to work with us", href: "/contact?intent=apply" }}
        highlights={["London base", "Distributed builders", "High-trust services"]}
      />

      <MarketingSection
        numeral="I"
        kicker="Project portfolio"
        title="Products, ventures, and research belong in the same operating frame."
        accent="same operating frame."
        description="We are not collecting logos for decoration. Each project is a test of the same thesis: if proof is easy, trust can be calmer."
        tone="white"
      >
        <motion.div
          variants={containerVariants}
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
          className="mt-14 space-y-6"
        >
          {projectCards.map((project, index) => (
            <motion.article
              key={project.slug}
              variants={itemVariants}
              className="grid gap-6 rounded-[18px] border border-[#e2e0d6] bg-white p-6 shadow-[0_1px_0_#e2e0d6] transition-all hover:-translate-y-[2px] hover:border-[#c7d0e0] hover:shadow-[0_18px_42px_-22px_rgba(11,27,51,0.16)] lg:grid-cols-[0.9fr_1.1fr] lg:p-8"
            >
              <ProjectVisual visual={project.visual} mark={project.mark} />
              <div className="flex flex-col justify-between gap-7">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-[10px] border border-[#0b1b33] bg-[#0b1b33] as25-font-display text-[18px] italic text-white">
                      {project.mark}
                    </div>
                    <div>
                      <div className="as25-font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#1f6b3f]">
                        {project.eyebrow}
                      </div>
                      <h2 className="as25-font-display mt-1 text-[28px] font-normal leading-[1.08] tracking-[-0.02em] text-[#0b1b33] md:text-[36px]">
                        {project.name}
                      </h2>
                    </div>
                  </div>
                  <p className="mt-6 max-w-[680px] as25-font-display text-[26px] font-normal leading-[1.16] tracking-[-0.02em] text-[#0b1b33] md:text-[34px]">
                    {project.title}
                  </p>
                  <p className="mt-5 max-w-[720px] text-[15.5px] leading-7 text-[#2d466f]">{project.description}</p>
                </div>
                <div className="grid gap-4 border-t border-[#e2e0d6] pt-5 md:grid-cols-[1fr_auto] md:items-end">
                  <div className="flex flex-wrap gap-2">
                    {[project.region, project.status, ...project.signals].map((signal) => (
                      <span
                        key={signal}
                        className="rounded-full border border-[#e2e0d6] bg-[#fafaf7] px-3 py-1.5 text-[12px] font-medium text-[#2d466f]"
                      >
                        {signal}
                      </span>
                    ))}
                  </div>
                  <div className="as25-font-mono text-[11px] uppercase tracking-[0.16em] text-[#6b7e9e]">
                    {String(index + 1).padStart(2, "0")} / {projectCards.length.toString().padStart(2, "0")}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </MarketingSection>

      <MarketingSection
        numeral="II"
        kicker="Work with us"
        title="Bring a serious problem, not a pitch deck full of adjectives."
        accent="serious problem,"
      >
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {[
            ["Apply to work", "For designers, operators, engineers, legal minds, and care-system thinkers who want to build high-trust products.", "/contact?intent=apply"],
            ["Submit venture", "For founders or operators with a high-trust workflow that could become a project, pilot, or studio collaboration.", "/contact?intent=venture"],
            ["Submit message", "For partnerships, press, research notes, or a concrete AllSquared deal that needs human follow-up.", "/contact?intent=message"],
          ].map(([title, body, href]) => (
            <article key={title} className="rounded-[16px] border border-[#e2e0d6] bg-white p-7 transition-all hover:-translate-y-[2px] hover:border-[#c7d0e0]">
              <h3 className="as25-font-display text-[28px] font-normal leading-[1.1] tracking-[-0.02em] text-[#0b1b33]">{title}</h3>
              <p className="mt-4 min-h-[112px] text-[14.5px] leading-7 text-[#2d466f]">{body}</p>
              <div className="mt-6">
                <MarketingLinkButton href={href}>Open form</MarketingLinkButton>
              </div>
            </article>
          ))}
        </div>
      </MarketingSection>
    </div>
  );
}
