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
} from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-blue-900 py-24 md:py-36">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-blue-500/5 blur-3xl" />
        </div>

        <div className="container relative">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mx-auto max-w-4xl text-center"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/90 backdrop-blur-sm">
                <span className="mr-2 h-2 w-2 rounded-full bg-secondary animate-pulse" />
                Launching Soon in the UK
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
            >
              Secure Contracts &amp;{" "}
              <span className="bg-gradient-to-r from-secondary to-emerald-300 bg-clip-text text-transparent">
                Escrow Payments
              </span>{" "}
              for Freelancers
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mt-6 text-lg text-blue-100/80 md:text-xl lg:text-2xl max-w-3xl mx-auto"
            >
              The only platform combining AI-generated contracts, FCA-backed escrow,
              and milestone management. Protect your payments, deliver with confidence.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center"
            >
              {isAuthenticated ? (
                <Button size="lg" variant="secondary" className="text-base px-8 h-12 shadow-lg shadow-secondary/25" asChild>
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <Button size="lg" variant="secondary" className="text-base px-8 h-12 shadow-lg shadow-secondary/25" asChild>
                  <Link href="/dashboard">
                    Join Waitlist
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 h-12 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                asChild
              >
                <Link href="/how-it-works">See How It Works</Link>
              </Button>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-blue-100/70"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-secondary" />
                <span>FCA-Backed Escrow</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-secondary" />
                <span>AI-Powered Contracts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-secondary" />
                <span>Milestone Payments</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-b bg-muted/30 py-6">
        <div className="container">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-medium">FCA Regulated</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              <span className="font-medium">Bank-Grade Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              <span className="font-medium">SRA-Approved Lawyers</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              <span className="font-medium">UK-Focused Platform</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 md:py-24">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="mx-auto max-w-3xl text-center space-y-6"
          >
            <span className="inline-block text-sm font-semibold uppercase tracking-wider text-primary">
              The Problem
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              A £30 Billion Market{" "}
              <span className="text-primary">Plagued by Payment Disputes</span>
            </h2>
            <p className="text-lg text-muted-foreground md:text-xl">
              Freelancers and service providers face constant risks: non-payment,
              scope creep, and project failures. Clients struggle with quality
              concerns and lack of protection. Current solutions are fragmented,
              expensive, and complex.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="mx-auto max-w-2xl text-center mb-16"
          >
            <span className="inline-block text-sm font-semibold uppercase tracking-wider text-primary mb-4">
              Features
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              Everything You Need in One Platform
            </h2>
            <p className="text-lg text-muted-foreground">
              AllSquared is the only integrated solution combining contracts,
              escrow, and milestone management.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {[
              {
                icon: FileText,
                title: "AI Contract Generation",
                description: "Generate professional, legally-sound contracts in minutes for freelance services, home improvements, events, and more.",
                color: "bg-blue-500/10 text-blue-600",
              },
              {
                icon: Shield,
                title: "FCA-Backed Escrow",
                description: "Secure payments with FCA-authorised escrow. Funds released only when milestones are met, protecting both parties.",
                color: "bg-emerald-500/10 text-emerald-600",
              },
              {
                icon: TrendingUp,
                title: "Milestone Management",
                description: "Track project progress with clear milestones. Automatic payment releases keep projects moving forward.",
                color: "bg-orange-500/10 text-orange-600",
              },
              {
                icon: MessageSquare,
                title: "AI Dispute Resolution",
                description: "Resolve conflicts quickly with AI-assisted mediation. Optional lawyer referrals for complex cases.",
                color: "bg-purple-500/10 text-purple-600",
              },
              {
                icon: Lock,
                title: "Bank-Grade Security",
                description: "Your data and funds are protected with enterprise-level encryption and FCA-regulated escrow partners.",
                color: "bg-rose-500/10 text-rose-600",
              },
              {
                icon: Scale,
                title: "Lawyer-in-the-Loop",
                description: "Need expert advice? Connect with SRA-regulated solicitors for contract review or legal guidance.",
                color: "bg-amber-500/10 text-amber-600",
              },
            ].map((feature, i) => (
              <motion.div key={feature.title} variants={scaleIn}>
                <Card className="h-full border-0 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="pt-6">
                    <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="mx-auto max-w-2xl text-center mb-16"
          >
            <span className="inline-block text-sm font-semibold uppercase tracking-wider text-primary mb-4">
              How It Works
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              Get Started in Minutes
            </h2>
            <p className="text-lg text-muted-foreground">
              Three simple steps to protect your next project
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto"
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
            ].map((item, i) => (
              <motion.div key={item.step} variants={fadeInUp} className="relative text-center">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <item.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 md:right-auto md:-left-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-lg">
                  {item.step}
                </div>
                <h3 className="mb-3 text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary via-primary/95 to-blue-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-secondary/10 blur-3xl" />
        </div>
        <div className="container relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <span className="inline-block text-sm font-semibold uppercase tracking-wider text-blue-200 mb-4">
              Built for Scale
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Trusted by the UK Freelance Economy
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-center"
          >
            {[
              { value: "1,000+", label: "Contracts Created", icon: FileText },
              { value: "£2M+", label: "Secured in Escrow", icon: Banknote },
              { value: "10M+", label: "UK Freelancers Served", icon: Users },
              { value: "99.9%", label: "Payment Success Rate", icon: CheckCircle2 },
            ].map((stat) => (
              <motion.div key={stat.label} variants={scaleIn} className="p-6">
                <stat.icon className="h-8 w-8 mx-auto mb-4 text-secondary" />
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-blue-200">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="mx-auto max-w-3xl text-center space-y-8"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Ready to Protect Your{" "}
              <span className="text-primary">Next Project?</span>
            </h2>
            <p className="text-lg text-muted-foreground md:text-xl">
              Join thousands of freelancers and service providers who trust
              AllSquared for secure contracts and guaranteed payments.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              {isAuthenticated ? (
                <Button size="lg" className="text-base px-8 h-12 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200" asChild>
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <Button size="lg" className="text-base px-8 h-12 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200" asChild>
                  <Link href="/dashboard">
                    Join Waitlist - It's Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              )}
              <Button size="lg" variant="outline" className="text-base px-8 h-12 hover:scale-[1.02] transition-all duration-200" asChild>
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
