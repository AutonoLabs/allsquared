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

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section — Bold asymmetric layout with gradient mesh */}
      <section className="relative overflow-hidden gradient-mesh py-28 md:py-40 lg:py-48">
        {/* Decorative geometric shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[oklch(0.637_0.194_25/0.1)] blur-[100px]" />
          <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-[oklch(0.78_0.14_175/0.12)] blur-[80px]" />
          {/* Rotated squares — brand motif */}
          <div className="absolute top-20 right-[15%] h-20 w-20 rounded-2xl border border-white/[0.06] rotate-12" />
          <div className="absolute top-32 right-[12%] h-14 w-14 rounded-xl bg-[oklch(0.637_0.194_25/0.12)] rotate-[-8deg]" />
          <div className="absolute bottom-24 left-[10%] h-16 w-16 rounded-2xl border border-white/[0.06] rotate-[20deg]" />
          <div className="absolute bottom-36 left-[8%] h-10 w-10 rounded-lg bg-[oklch(0.81_0.16_85/0.15)] rotate-[-15deg]" />
        </div>

        <div className="container relative">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl"
          >
            <motion.div variants={fadeInUp} className="mb-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-1.5 text-sm text-white/80 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-[oklch(0.637_0.194_25)]" />
                Launching Soon in the UK
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[4.5rem] lg:leading-[1.05]"
            >
              Ship work.
              <br />
              Get paid.{" "}
              <span className="bg-gradient-to-r from-[oklch(0.637_0.194_25)] via-[oklch(0.78_0.14_175)] to-[oklch(0.81_0.16_85)] bg-clip-text text-transparent">
                No drama.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mt-6 text-lg text-white/60 md:text-xl max-w-2xl leading-relaxed"
            >
              AI-generated contracts, FCA-backed escrow, and milestone payments
              — everything freelancers and clients need in one sharp platform.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              {isAuthenticated ? (
                <Button size="lg" className="btn-state-layer text-base px-8 h-13 bg-white text-[oklch(0.216_0.014_58)] hover:bg-white/90 shadow-lg shadow-white/10 rounded-xl font-semibold" asChild>
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <Button size="lg" className="btn-state-layer text-base px-8 h-13 bg-white text-[oklch(0.216_0.014_58)] hover:bg-white/90 shadow-lg shadow-white/10 rounded-xl font-semibold" asChild>
                  <Link href="/dashboard">
                    Join the Waitlist
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 h-13 border-white/15 bg-white/[0.04] text-white hover:bg-white/[0.08] hover:text-white rounded-xl backdrop-blur-sm"
                asChild
              >
                <Link href="/how-it-works">See How It Works</Link>
              </Button>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="mt-12 flex flex-wrap items-center gap-6 text-sm text-white/50"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[oklch(0.81_0.16_85)]" />
                <span>FCA-Backed Escrow</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[oklch(0.81_0.16_85)]" />
                <span>AI-Powered Contracts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[oklch(0.81_0.16_85)]" />
                <span>Milestone Payments</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-b border-border/60 py-5 bg-background">
        <div className="container">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="font-medium">FCA Regulated</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              <span className="font-medium">Bank-Grade Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-primary" />
              <span className="font-medium">SRA-Approved Lawyers</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" />
              <span className="font-medium">UK-Focused Platform</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 md:py-28">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="mx-auto max-w-3xl text-center space-y-6"
          >
            <span className="font-heading inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              The Problem
            </span>
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              A £30 Billion Market{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Plagued by Payment Disputes
              </span>
            </h2>
            <p className="text-lg text-muted-foreground md:text-xl leading-relaxed">
              Freelancers and service providers face constant risks: non-payment,
              scope creep, and project failures. Clients struggle with quality
              concerns and lack of protection. Current solutions are fragmented,
              expensive, and complex.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Key Features — M3 surface tint cards */}
      <section className="py-20 md:py-28 bg-muted/40">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="mx-auto max-w-2xl text-center mb-16"
          >
            <span className="font-heading inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4">
              Features
            </span>
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-5">
              Everything You Need in One Platform
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              AllSquared is the only integrated solution combining contracts,
              escrow, and milestone management.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
          >
            {[
              {
                icon: FileText,
                title: "AI Contract Generation",
                description: "Generate professional, legally-sound contracts in minutes for freelance services, home improvements, events, and more.",
                gradient: "from-[oklch(0.78_0.14_175)] to-[oklch(0.637_0.194_25)]",
              },
              {
                icon: Shield,
                title: "FCA-Backed Escrow",
                description: "Secure payments with FCA-authorised escrow. Funds released only when milestones are met, protecting both parties.",
                gradient: "from-[oklch(0.81_0.16_85)] to-[oklch(0.72_0.12_175)]",
              },
              {
                icon: TrendingUp,
                title: "Milestone Management",
                description: "Track project progress with clear milestones. Automatic payment releases keep projects moving forward.",
                gradient: "from-[oklch(0.637_0.194_25)] to-[oklch(0.81_0.16_85)]",
              },
              {
                icon: MessageSquare,
                title: "AI Dispute Resolution",
                description: "Resolve conflicts quickly with AI-assisted mediation. Optional lawyer referrals for complex cases.",
                gradient: "from-[oklch(0.78_0.14_175)] to-[oklch(0.78_0.14_175)]",
              },
              {
                icon: Lock,
                title: "Bank-Grade Security",
                description: "Your data and funds are protected with enterprise-level encryption and FCA-regulated escrow partners.",
                gradient: "from-[oklch(0.72_0.12_175)] to-[oklch(0.637_0.194_25)]",
              },
              {
                icon: Scale,
                title: "Lawyer-in-the-Loop",
                description: "Need expert advice? Connect with SRA-regulated solicitors for contract review or legal guidance.",
                gradient: "from-[oklch(0.637_0.194_25)] to-[oklch(0.81_0.16_85)]",
              },
            ].map((feature) => (
              <motion.div key={feature.title} variants={scaleIn}>
                <Card className="group h-full border border-border/60 bg-card hover:border-primary/20 shadow-none hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 rounded-2xl">
                  <CardContent className="pt-7 pb-6">
                    <div className={`mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient}`}>
                      <feature.icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-heading mb-2 text-lg font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="mx-auto max-w-2xl text-center mb-16"
          >
            <span className="font-heading inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4">
              How It Works
            </span>
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-5">
              Get Started in Minutes
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Three simple steps to protect your next project
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid gap-10 md:grid-cols-3 max-w-5xl mx-auto"
          >
            {[
              {
                step: "01",
                icon: FileText,
                title: "Create Your Contract",
                description: "Use our AI-powered templates to generate a professional contract tailored to your service. Customise terms, milestones, and payment schedules.",
              },
              {
                step: "02",
                icon: Banknote,
                title: "Secure Funds in Escrow",
                description: "Your client deposits funds into FCA-regulated escrow. Money is safely held until work is completed and approved.",
              },
              {
                step: "03",
                icon: Zap,
                title: "Deliver & Get Paid",
                description: "Complete milestones, get approval, and receive instant payments. No more chasing invoices or worrying about non-payment.",
              },
            ].map((item) => (
              <motion.div key={item.step} variants={fadeInUp} className="relative text-center">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10">
                  <item.icon className="h-7 w-7 text-primary" />
                </div>
                <div className="absolute -top-1 right-1/4 md:right-auto md:-left-1 flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-xs font-bold text-white shadow-md shadow-primary/20">
                  {item.step}
                </div>
                <h3 className="font-heading mb-3 text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-20 md:py-28 bg-muted/40 relative overflow-hidden">
        <div className="container relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-14"
          >
            <span className="font-heading inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4">
              Built for Scale
            </span>
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Trusted by the UK Freelance Economy
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {[
              { value: "1,000+", label: "Contracts Created", icon: FileText },
              { value: "£2M+", label: "Secured in Escrow", icon: Banknote },
              { value: "10M+", label: "UK Freelancers Served", icon: Users },
              { value: "99.9%", label: "Payment Success Rate", icon: CheckCircle2 },
            ].map((stat) => (
              <motion.div key={stat.label} variants={scaleIn} className="rounded-2xl border border-border/60 bg-card p-8 text-center">
                <stat.icon className="h-6 w-6 mx-auto mb-4 text-primary" />
                <div className="font-heading text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="mx-auto max-w-3xl text-center space-y-8"
          >
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Ready to Protect Your{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Next Project?
              </span>
            </h2>
            <p className="text-lg text-muted-foreground md:text-xl leading-relaxed">
              Join thousands of freelancers and service providers who trust
              AllSquared for secure contracts and guaranteed payments.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center pt-2">
              {isAuthenticated ? (
                <Button size="lg" className="btn-state-layer text-base px-8 h-13 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 rounded-xl font-semibold transition-all duration-200" asChild>
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <Button size="lg" className="btn-state-layer text-base px-8 h-13 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 rounded-xl font-semibold transition-all duration-200" asChild>
                  <Link href="/dashboard">
                    Join Waitlist — It's Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              )}
              <Button size="lg" variant="outline" className="text-base px-8 h-13 rounded-xl border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-200" asChild>
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
