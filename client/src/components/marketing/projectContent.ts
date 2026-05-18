export type ProjectCard = {
  slug: string;
  name: string;
  mark: string;
  eyebrow: string;
  title: string;
  description: string;
  region: string;
  status: string;
  signals: string[];
  visual: string[];
};

export type ArticleCard = {
  slug: string;
  label: string;
  title: string;
  deck: string;
  readTime: string;
  theme: string;
};

export const projectCards: ProjectCard[] = [
  {
    slug: "allsquared",
    name: "AllSquared",
    mark: "AS",
    eyebrow: "Commercial trust infrastructure",
    title: "Contracts, escrow, proof, and dispute handling for serious project work.",
    description:
      "Built for UK service businesses where late payment is not admin friction but a balance-sheet event: fit-outs, agencies, productions, consultants, and professional trades.",
    region: "UK base · global team",
    status: "Founding cohort",
    signals: ["England & Wales contract flow", "FCA-authorised escrow partner", "SRA-regulated solicitor network"],
    visual: ["Draft", "Fund", "Verify", "Release"],
  },
  {
    slug: "yapper",
    name: "Yapper",
    mark: "YP",
    eyebrow: "Care-pathway software",
    title: "Speech, therapy, and care progress made visible between sessions.",
    description:
      "A companion project exploring how families, clinicians, and care teams can coordinate around small daily signals instead of waiting for the next appointment.",
    region: "Global care problem",
    status: "In build",
    signals: ["Child-centred progress loops", "Care-team coordination", "Family-friendly reporting"],
    visual: ["Observe", "Practise", "Nudge", "Review"],
  },
  {
    slug: "trust-rails",
    name: "Trust Rails Lab",
    mark: "TR",
    eyebrow: "Research & venture studio",
    title: "Experiments in proof, accountability, and relationship-preserving transactions.",
    description:
      "The studio layer underneath our projects: practical research into escrow, verification, therapy adherence, legal UX, and the messy spaces where trust currently lives in email threads.",
    region: "UK incorporated · distributed builders",
    status: "Ongoing research",
    signals: ["Operator-led research", "Legal + AI systems", "High-trust workflow design"],
    visual: ["Map", "Prototype", "Pilot", "Publish"],
  },
];

export const articleCards: ArticleCard[] = [
  {
    slug: "marketplaces-found-the-customer-not-the-trust",
    label: "Essay 01",
    title: "Marketplaces found the customer. They did not solve the trust problem.",
    deck:
      "Discovery is easy now. Accountability is not. The next generation of vertical software will care less about matching strangers and more about making promises observable.",
    readTime: "7 min read",
    theme: "Marketplaces → trust rails",
  },
  {
    slug: "the-end-of-just-invoice-me-later",
    label: "Essay 02",
    title: "The end of ‘just invoice me later’. ",
    deck:
      "Late payment became normal because every party can pretend nothing has failed. Escrow, milestones, and proof change the emotional physics of getting paid.",
    readTime: "6 min read",
    theme: "Escrow · milestones · proof",
  },
  {
    slug: "care-is-a-trust-infrastructure-problem",
    label: "Essay 03",
    title: "Care is also a trust infrastructure problem.",
    deck:
      "Yapper and AllSquared look different on the surface. Underneath, both ask the same question: how do humans coordinate when the important evidence is small, delayed, and easy to lose?",
    readTime: "8 min read",
    theme: "Yapper × AllSquared",
  },
  {
    slug: "why-proof-preserves-relationships",
    label: "Essay 04",
    title: "Proof preserves relationships better than politeness.",
    deck:
      "A clean proof layer is not adversarial. It lets both sides stay generous because the agreement no longer depends on memory, vibes, or awkward follow-up emails.",
    readTime: "5 min read",
    theme: "Legal UX · human systems",
  },
];
