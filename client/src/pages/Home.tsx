import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  FileText,
  Lock,
  MessageSquare,
  Shield,
  TrendingUp,
  Banknote,
  Scale,
  Users,
  Zap,
  ArrowRight,
  Star,
  Sparkles,
} from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

// ── M3 Motion Presets ─────────────────────────────────────────────
const M3_EASE = [0.2, 0, 0, 1] as const;

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: M3_EASE } },
};

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const scaleIn = {
  hidden:  { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1,   transition: { duration: 0.35, ease: M3_EASE } },
};

// ── Feature card data ─────────────────────────────────────────────
const FEATURES = [
  {
    Icon: FileText,
    title: "AI Contract Generation",
    description:
      "Professional, legally-sound contracts in minutes. Tailored for freelance services, home improvements, events, and more.",
    tint: "from-[#6D28D9] to-[#A78BFA]",
  },
  {
    Icon: Shield,
    title: "FCA-Backed Escrow",
    description:
      "Funds held by FCA-authorised escrow. Released only when milestones are met — protecting both sides of every deal.",
    tint: "from-[#6D28D9] to-[#10B981]",
  },
  {
    Icon: TrendingUp,
    title: "Milestone Management",
    description:
      "Clear progress checkpoints with automatic payment releases. Keep projects moving and cash flow healthy.",
    tint: "from-[#0F172A] to-[#6D28D9]",
  },
  {
    Icon: MessageSquare,
    title: "AI Dispute Resolution",
    description:
      "Resolve conflicts fast with AI-assisted mediation. Optional SRA-regulated solicitor referrals for complex cases.",
    tint: "from-[#A78BFA] to-[#6D28D9]",
  },
  {
    Icon: Lock,
    title: "Bank-Grade Security",
    description:
      "Enterprise encryption and FCA-regulated escrow. Your money and data stay protected end-to-end.",
    tint: "from-[#0F172A] to-[#A78BFA]",
  },
  {
    Icon: Scale,
    title: "Lawyer-in-the-Loop",
    description:
      "Connect with SRA-regulated solicitors for contract review or legal guidance on any matter.",
    tint: "from-[#6D28D9] to-[#0F172A]",
  },
];

// ── Steps ─────────────────────────────────────────────────────────
const HOW_IT_WORKS = [
  {
    step: "01",
    Icon: FileText,
    title: "Create Your Contract",
    description:
      "Our AI generates a professional contract from your requirements. Customise milestones, payment schedules, and terms in minutes.",
  },
  {
    step: "02",
    Icon: Banknote,
    title: "Funds Into Escrow",
    description:
      "Your client deposits funds into FCA-regulated escrow. Money sits safely until the work is completed and approved.",
  },
  {
    step: "03",
    Icon: Zap,
    title: "Deliver & Get Paid",
    description:
      "Hit your milestones, get sign-off, and receive instant release. No chasing invoices. No payment anxiety.",
  },
];

// ── Stats ─────────────────────────────────────────────────────────
const STATS = [
  { value: "1,000+",  label: "Contracts Created",       Icon: FileText      },
  { value: "£2M+",    label: "Secured in Escrow",        Icon: Banknote      },
  { value: "10M+",    label: "UK Freelancers Served",    Icon: Users         },
  { value: "99.9%",   label: "Payment Success Rate",     Icon: CheckCircle2  },
];

// ─────────────────────────────────────────────────────────────────
export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col overflow-hidden">

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden gradient-mesh py-28 md:py-40 lg:py-48">

        {/* Geometric decorative shapes — brand motif */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[oklch(0.41_0.249_285.75/0.18)] blur-[100px]" />
          <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-[oklch(0.665_0.156_293/0.14)] blur-[80px]" />
          <div className="absolute top-20 right-[15%] h-20 w-20 rotate-12 rounded-2xl border border-white/[0.07]" />
          <div className="absolute top-32 right-[12%] h-14 w-14 -rotate-[8deg] rounded-xl bg-[oklch(0.41_0.249_285.75/0.18)]" />
          <div className="absolute bottom-24 left-[10%] h-16 w-16 rotate-[20deg] rounded-2xl border border-white/[0.07]" />
          <div className="absolute bottom-36 left-[8%] h-10 w-10 -rotate-[15deg] rounded-lg bg-[oklch(0.665_0.156_293/0.18)]" />
        </div>

        <div className="container relative">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-4xl"
          >
            {/* Launch badge */}
            <motion.div variants={fadeUp} className="mb-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-1.5 text-sm text-white/80 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-[oklch(0.665_0.156_293)]" />
                Launching Soon in the UK
              </span>
            </motion.div>

            {/* Headline — M3 Display */}
            <motion.h1
              variants={fadeUp}
              className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[4.5rem] lg:leading-[1.05]"
            >
              Big contracts.
              <br />
              Zero payment{" "}
              <span className="bg-gradient-to-r from-[oklch(0.665_0.156_293)] via-[oklch(0.72_0.18_285)] to-[oklch(0.696_0.17_162.48)] bg-clip-text text-transparent">
                drama.
              </span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-2xl text-lg leading-relaxed text-white/65 md:text-xl"
            >
              AI-generated contracts, FCA-backed escrow, and milestone payments
              — the platform built for builders, contractors, and professional
              services doing £10K+ deals.
            </motion.p>

            {/* CTAs — M3 filled + outlined */}
            <motion.div
              variants={fadeUp}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              <Button
                size="lg"
                className="m3-state-layer h-13 rounded-[1.75rem] bg-[#6D28D9] px-8 text-base font-semibold text-white shadow-lg shadow-[#6D28D9]/25 hover:bg-[#5B21B6] hover:shadow-xl hover:shadow-[#6D28D9]/30"
                asChild
              >
                <Link href="/dashboard">
                  {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="h-13 rounded-[1.75rem] border-white/15 bg-white/[0.05] px-8 text-base text-white backdrop-blur-sm hover:bg-white/[0.09] hover:text-white"
                asChild
              >
                <Link href="/how-it-works">See How It Works</Link>
              </Button>
            </motion.div>

            {/* Trust signals */}
            <motion.div
              variants={fadeUp}
              className="mt-12 flex flex-wrap items-center gap-6 text-sm text-white/50"
            >
              {[
                { Icon: CheckCircle2, label: "FCA-Backed Escrow" },
                { Icon: CheckCircle2, label: "AI-Powered Contracts" },
                { Icon: CheckCircle2, label: "Milestone Payments" },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-[oklch(0.696_0.17_162.48)]" />
                  <span>{label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Trust Bar ──────────────────────────────────────────── */}
      <section className="border-b border-border/50 bg-background py-5">
        <div className="container">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-muted-foreground">
            {[
              { Icon: Shield,   label: "FCA Regulated"        },
              { Icon: Lock,     label: "Bank-Grade Security"  },
              { Icon: Scale,    label: "SRA-Approved Lawyers" },
              { Icon: Star,     label: "UK-Only Platform"     },
            ].map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-accent" />
                <span className="font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Problem Statement ───────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="mx-auto max-w-3xl space-y-6 text-center"
          >
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              The Problem
            </span>
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              A £30 Billion Market{" "}
              <span className="bg-gradient-to-r from-[#6D28D9] to-[#A78BFA] bg-clip-text text-transparent">
                Plagued by Payment Disputes
              </span>
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
              Builders, contractors, and freelancers face constant risk: non-payment,
              scope creep, and projects that go sideways. Current solutions are
              fragmented, expensive, and built for lawyers — not tradespeople.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Key Features — M3 Elevated Cards ───────────────────── */}
      <section className="bg-muted/30 py-20 md:py-28">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            className="mx-auto mb-14 max-w-2xl text-center"
          >
            <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Features
            </span>
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              Everything in One Platform
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              AllSquared is the only integrated solution combining contracts,
              escrow, and milestone management for UK professionals.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={stagger}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {FEATURES.map((feature) => (
              <motion.div key={feature.title} variants={scaleIn}>
                {/* M3 elevated card with surface tint on hover */}
                <Card className="group m3-card-elevated h-full transition-all duration-300 hover:border-[#6D28D9]/15 hover:shadow-[var(--shadow-elevation-2)]">
                  <CardContent className="flex h-full flex-col pb-6 pt-7">
                    {/* M3 icon container — gradient filled */}
                    <div
                      className={`mb-5 inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${feature.tint}`}
                    >
                      <feature.Icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="m3-title-lg mb-2 font-semibold">{feature.title}</h3>
                    <p className="m3-body-md flex-1 leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            className="mx-auto mb-14 max-w-2xl text-center"
          >
            <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              How It Works
            </span>
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              Sorted in Three Steps
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              From contract to payment — without the drama.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={stagger}
            className="mx-auto grid max-w-5xl gap-10 md:grid-cols-3"
          >
            {HOW_IT_WORKS.map(({ step, Icon, title, description }) => (
              <motion.div key={step} variants={fadeUp} className="relative text-center">
                {/* Step icon container — M3 secondary container */}
                <div className="mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F1F0FF]">
                  <Icon className="h-7 w-7 text-[#6D28D9]" />
                </div>
                {/* Step number badge */}
                <div className="absolute right-1/4 -top-1 flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#6D28D9] to-[#A78BFA] text-xs font-bold text-white shadow-md shadow-[#6D28D9]/25 md:right-auto md:-left-1">
                  {step}
                </div>
                <h3 className="m3-title-lg mb-3 font-semibold">{title}</h3>
                <p className="leading-relaxed text-muted-foreground">{description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Stats — Navy background, M3 surface cards ───────────── */}
      <section className="relative overflow-hidden bg-[#0F172A] py-20 md:py-28 text-white">
        {/* Subtle glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[oklch(0.41_0.249_285.75/0.15)] blur-[80px]" />
        </div>
        <div className="container relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            className="mb-12 text-center"
          >
            <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-[#A78BFA]">
              Built for Scale
            </span>
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl text-white">
              Trusted by the UK Freelance Economy
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={stagger}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {STATS.map(({ value, label, Icon }) => (
              <motion.div
                key={label}
                variants={scaleIn}
                className="group rounded-2xl border border-white/10 bg-white/[0.05] p-8 text-center transition-colors hover:bg-white/[0.08]"
              >
                <Icon className="mx-auto mb-4 h-6 w-6 text-[#A78BFA]" />
                <div className="font-heading mb-2 text-4xl font-bold text-white">{value}</div>
                <div className="text-sm text-white/60">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            className="mx-auto max-w-3xl space-y-8 text-center"
          >
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Ready to Square Away{" "}
              <span className="bg-gradient-to-r from-[#6D28D9] to-[#A78BFA] bg-clip-text text-transparent">
                Your Next Project?
              </span>
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
              Join UK builders, contractors, and professional services teams
              who use AllSquared to protect every deal over £10K.
            </p>
            <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                className="m3-state-layer h-13 rounded-[1.75rem] bg-[#6D28D9] px-8 text-base font-semibold text-white shadow-md shadow-[#6D28D9]/20 transition-all duration-200 hover:bg-[#5B21B6] hover:shadow-lg hover:shadow-[#6D28D9]/30"
                asChild
              >
                <Link href="/dashboard">
                  {isAuthenticated ? "Go to Dashboard" : "Join Waitlist — Free"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-13 rounded-[1.75rem] border-border px-8 text-base transition-all duration-200 hover:border-[#6D28D9]/30 hover:bg-[#F1F0FF]"
                asChild
              >
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
