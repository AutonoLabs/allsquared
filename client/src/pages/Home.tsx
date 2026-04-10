import { useAuth } from "@/hooks/useAuth";
import { useClerk } from "@clerk/clerk-react";
import { MD3Button } from "@/components/md3/Button";
import { MD3Card, MD3CardContent } from "@/components/md3/Card";
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
  Loader2,
} from "lucide-react";
import { Link, useLocation } from "wouter";
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
    tint: "from-[#7331df] to-[#d3bbff]",
  },
  {
    Icon: Shield,
    title: "FCA-Backed Escrow",
    description:
      "Funds held by FCA-authorised escrow. Released only when milestones are met — protecting both sides of every deal.",
    tint: "from-[#7331df] to-[#7e525e]",
  },
  {
    Icon: TrendingUp,
    title: "Milestone Management",
    description:
      "Clear progress checkpoints with automatic payment releases. Keep projects moving and cash flow healthy.",
    tint: "from-[#250059] to-[#7331df]",
  },
  {
    Icon: MessageSquare,
    title: "AI Dispute Resolution",
    description:
      "Resolve conflicts fast with AI-assisted mediation. Optional SRA-regulated solicitor referrals for complex cases.",
    tint: "from-[#d3bbff] to-[#7331df]",
  },
  {
    Icon: Lock,
    title: "Bank-Grade Security",
    description:
      "Enterprise encryption and FCA-regulated escrow. Your money and data stay protected end-to-end.",
    tint: "from-[#250059] to-[#d3bbff]",
  },
  {
    Icon: Scale,
    title: "Lawyer-in-the-Loop",
    description:
      "Connect with SRA-regulated solicitors for contract review or legal guidance on any matter.",
    tint: "from-[#7331df] to-[#250059]",
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
  const { isAuthenticated, loading } = useAuth();
  const { openSignIn } = useClerk();
  const [, setLocation] = useLocation();

  function handleGetStarted() {
    if (isAuthenticated) {
      setLocation("/dashboard");
    } else {
      openSignIn({
        afterSignInUrl: "/dashboard",
        afterSignUpUrl: "/dashboard",
      });
    }
  }

  return (
    <div className="flex flex-col overflow-hidden">

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[var(--md-sys-color-primary)] min-h-[85vh] md:min-h-0 py-16 md:py-32 lg:py-44 flex items-center">

        {/* Geometric decorative shapes — brand motif */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[var(--md-sys-color-primary-container)]/20 blur-[100px]" />
          <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-[var(--md-sys-color-inverse-primary)]/15 blur-[80px]" />
          <div className="absolute top-20 right-[15%] h-20 w-20 rotate-12 rounded-[var(--md-sys-shape-large)] border border-white/[0.07]" />
          <div className="absolute top-32 right-[12%] h-14 w-14 -rotate-[8deg] rounded-[var(--md-sys-shape-medium)] bg-[var(--md-sys-color-primary-container)]/20" />
          <div className="absolute bottom-24 left-[10%] h-16 w-16 rotate-[20deg] rounded-[var(--md-sys-shape-large)] border border-white/[0.07]" />
          <div className="absolute bottom-36 left-[8%] h-10 w-10 -rotate-[15deg] rounded-[var(--md-sys-shape-small)] bg-[var(--md-sys-color-inverse-primary)]/18" />
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
              <span className="inline-flex items-center gap-2 rounded-[var(--md-sys-shape-full)] border border-white/10 bg-white/[0.06] px-4 py-1.5 text-sm text-white/80 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-[var(--md-sys-color-inverse-primary)]" />
                Launching Soon in the UK
              </span>
            </motion.div>

            {/* Headline — MD3 Display */}
            <motion.h1
              variants={fadeUp}
              className="md3-display-large font-bold tracking-tight text-[var(--md-sys-color-on-primary)] sm:text-5xl md:text-6xl lg:text-[4.5rem] lg:leading-[1.05]"
            >
              Big contracts.
              <br />
              Zero payment{" "}
              <span className="bg-gradient-to-r from-[var(--md-sys-color-inverse-primary)] via-[var(--md-sys-color-primary-container)] to-[var(--md-sys-color-tertiary-container)] bg-clip-text text-transparent">
                drama.
              </span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-2xl md3-body-large leading-relaxed text-[var(--md-sys-color-on-primary)]/70 md:text-xl"
            >
              AI-generated contracts, FCA-backed escrow, and milestone payments
              — the platform built for builders, contractors, and professional
              services doing £10K+ deals.
            </motion.p>

            {/* CTAs — MD3 filled + outlined */}
            <motion.div
              variants={fadeUp}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              <MD3Button
                variant="tonal"
                size="lg"
                className="h-13 bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] shadow-lg shadow-[var(--md-sys-color-primary)]/25 hover:shadow-xl"
                onClick={handleGetStarted}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : null}
                {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
                {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
              </MD3Button>

              <MD3Button
                variant="outlined"
                size="lg"
                className="h-13 border-white/15 text-white hover:bg-white/[0.09] hover:text-white"
                asChild
              >
                <Link href="/how-it-works">See How It Works</Link>
              </MD3Button>
            </motion.div>

            {/* Trust signals */}
            <motion.div
              variants={fadeUp}
              className="mt-12 flex flex-wrap items-center gap-6 text-sm text-[var(--md-sys-color-on-primary)]/50"
            >
              {[
                { Icon: CheckCircle2, label: "FCA-Backed Escrow" },
                { Icon: CheckCircle2, label: "AI-Powered Contracts" },
                { Icon: CheckCircle2, label: "Milestone Payments" },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-[var(--md-sys-color-tertiary-container)]" />
                  <span>{label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Trust Bar ──────────────────────────────────────────── */}
      <section className="border-b border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface)] py-5">
        <div className="container">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-[var(--md-sys-color-on-surface-variant)]">
            {[
              { Icon: Shield,   label: "FCA Regulated"        },
              { Icon: Lock,     label: "Bank-Grade Security"  },
              { Icon: Scale,    label: "SRA-Approved Lawyers" },
              { Icon: Star,     label: "UK-Only Platform"     },
            ].map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-[var(--md-sys-color-primary)]" />
                <span className="font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Problem Statement ───────────────────────────────────── */}
      <section className="py-12 md:py-20 bg-[var(--md-sys-color-surface)]">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="mx-auto max-w-3xl space-y-6 text-center"
          >
            <span className="inline-block md3-label-large uppercase tracking-[0.2em] text-[var(--md-sys-color-primary)]">
              The Problem
            </span>
            <h2 className="md3-headline-large tracking-tight sm:text-4xl md:text-5xl text-[var(--md-sys-color-on-surface)]">
              A £30 Billion Market{" "}
              <span className="bg-gradient-to-r from-[var(--md-sys-color-primary)] to-[var(--md-sys-color-inverse-primary)] bg-clip-text text-transparent">
                Plagued by Payment Disputes
              </span>
            </h2>
            <p className="md3-body-large leading-relaxed text-[var(--md-sys-color-on-surface-variant)] md:text-xl">
              Builders, contractors, and freelancers face constant risk: non-payment,
              scope creep, and projects that go sideways. Current solutions are
              fragmented, expensive, and built for lawyers — not tradespeople.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Key Features — MD3 Elevated Cards ───────────────────── */}
      <section className="bg-[var(--md-sys-color-surface-container-low)] py-20 md:py-28">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="mx-auto mb-14 max-w-2xl text-center"
          >
            <span className="mb-4 inline-block md3-label-large uppercase tracking-[0.2em] text-[var(--md-sys-color-primary)]">
              Features
            </span>
            <h2 className="md3-headline-large tracking-tight sm:text-4xl md:text-5xl mb-4 text-[var(--md-sys-color-on-surface)]">
              Everything in One Platform
            </h2>
            <p className="md3-body-large leading-relaxed text-[var(--md-sys-color-on-surface-variant)]">
              AllSquared is the only integrated solution combining contracts,
              escrow, and milestone management for UK professionals.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {FEATURES.map((feature) => (
              <motion.div key={feature.title} variants={scaleIn}>
                <MD3Card variant="elevated" className="h-full group transition-all duration-300 hover:shadow-[var(--md-sys-elevation-3)]">
                  <MD3CardContent className="flex h-full flex-col pb-6 pt-7">
                    {/* MD3 icon container — gradient filled */}
                    <div
                      className={`mb-5 inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[var(--md-sys-shape-medium)] bg-gradient-to-br ${feature.tint}`}
                    >
                      <feature.Icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="md3-title-large mb-2 font-semibold text-[var(--md-sys-color-on-surface)]">{feature.title}</h3>
                    <p className="md3-body-medium flex-1 leading-relaxed text-[var(--md-sys-color-on-surface-variant)]">
                      {feature.description}
                    </p>
                  </MD3CardContent>
                </MD3Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────── */}
      <section className="py-12 md:py-20 bg-[var(--md-sys-color-surface)]">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="mx-auto mb-14 max-w-2xl text-center"
          >
            <span className="mb-4 inline-block md3-label-large uppercase tracking-[0.2em] text-[var(--md-sys-color-primary)]">
              How It Works
            </span>
            <h2 className="md3-headline-large tracking-tight sm:text-4xl md:text-5xl mb-4 text-[var(--md-sys-color-on-surface)]">
              Sorted in Three Steps
            </h2>
            <p className="md3-body-large leading-relaxed text-[var(--md-sys-color-on-surface-variant)]">
              From contract to payment — without the drama.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            className="mx-auto grid max-w-5xl gap-10 md:grid-cols-3"
          >
            {HOW_IT_WORKS.map(({ step, Icon, title, description }) => (
              <motion.div key={step} variants={fadeUp} className="relative text-center">
                {/* Step icon container — MD3 primary container */}
                <div className="mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-[var(--md-sys-shape-extra-large)] bg-[var(--md-sys-color-primary-container)]">
                  <Icon className="h-7 w-7 text-[var(--md-sys-color-on-primary-container)]" />
                </div>
                {/* Step number badge */}
                <div className="absolute right-1/4 -top-1 flex h-8 w-8 items-center justify-center rounded-[var(--md-sys-shape-medium)] bg-gradient-to-br from-[var(--md-sys-color-primary)] to-[var(--md-sys-color-inverse-primary)] text-xs font-bold text-white shadow-[var(--md-sys-elevation-2)] md:right-auto md:-left-1">
                  {step}
                </div>
                <h3 className="md3-title-large mb-3 font-semibold text-[var(--md-sys-color-on-surface)]">{title}</h3>
                <p className="md3-body-medium leading-relaxed text-[var(--md-sys-color-on-surface-variant)]">{description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Stats — Dark surface, MD3 cards ───────────────────────── */}
      <section className="relative overflow-hidden bg-[var(--md-sys-color-inverse-surface)] py-20 md:py-28 text-white">
        {/* Subtle glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[var(--md-sys-color-primary)]/15 blur-[80px]" />
        </div>
        <div className="container relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="mb-12 text-center"
          >
            <span className="mb-4 inline-block md3-label-large uppercase tracking-[0.2em] text-[var(--md-sys-color-inverse-primary)]">
              Built for Scale
            </span>
            <h2 className="md3-headline-large tracking-tight sm:text-4xl text-[var(--md-sys-color-inverse-on-surface)]">
              Trusted by the UK Freelance Economy
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {STATS.map(({ value, label, Icon }) => (
              <motion.div
                key={label}
                variants={scaleIn}
                className="group rounded-[var(--md-sys-shape-extra-large)] border border-white/10 bg-white/[0.05] p-8 text-center transition-colors hover:bg-white/[0.08]"
              >
                <Icon className="mx-auto mb-4 h-6 w-6 text-[var(--md-sys-color-inverse-primary)]" />
                <div className="md3-display-small font-bold text-[var(--md-sys-color-inverse-on-surface)] mb-2">{value}</div>
                <div className="md3-body-small text-white/60">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="py-14 md:py-24 bg-[var(--md-sys-color-surface)]">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="mx-auto max-w-3xl space-y-8 text-center"
          >
            <h2 className="md3-headline-large tracking-tight sm:text-4xl md:text-5xl text-[var(--md-sys-color-on-surface)]">
              Ready to Square Away{" "}
              <span className="bg-gradient-to-r from-[var(--md-sys-color-primary)] to-[var(--md-sys-color-inverse-primary)] bg-clip-text text-transparent">
                Your Next Project?
              </span>
            </h2>
            <p className="md3-body-large leading-relaxed text-[var(--md-sys-color-on-surface-variant)] md:text-xl">
              Join UK builders, contractors, and professional services teams
              who use AllSquared to protect every deal over £10K.
            </p>
            <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:justify-center">
              <MD3Button
                variant="filled"
                size="lg"
                className="h-13 shadow-md shadow-[var(--md-sys-color-primary)]/20 hover:shadow-lg"
                onClick={handleGetStarted}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : null}
                {isAuthenticated ? "Go to Dashboard" : "Join Waitlist — Free"}
                {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
              </MD3Button>
              <MD3Button
                variant="outlined"
                size="lg"
                className="h-13 hover:bg-[var(--md-sys-color-primary-container)]"
                asChild
              >
                <Link href="/pricing">View Pricing</Link>
              </MD3Button>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
