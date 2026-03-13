import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  FileSignature,
  MessageSquare,
  Shield,
  TrendingUp,
  Clock,
  Zap,
  Target,
  Users,
  Award,
} from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Generate Contract",
      description:
        "Answer a few simple questions about your project. Our AI generates a professional, legally-sound contract tailored to your needs.",
      icon: FileText,
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-600",
      ringColor: "ring-blue-500/20",
    },
    {
      number: "02",
      title: "Sign Digitally",
      description:
        "Both parties review and sign the contract electronically. All signatures are legally binding and securely stored.",
      icon: FileSignature,
      bgColor: "bg-violet-500/10",
      iconColor: "text-violet-600",
      ringColor: "ring-violet-500/20",
    },
    {
      number: "03",
      title: "Secure Payment",
      description:
        "Client deposits funds into FCA-backed escrow. Your money is protected until milestones are completed.",
      icon: Shield,
      bgColor: "bg-emerald-500/10",
      iconColor: "text-emerald-600",
      ringColor: "ring-emerald-500/20",
    },
    {
      number: "04",
      title: "Deliver Work",
      description:
        "Service provider completes work according to agreed milestones. Track progress in real-time through the platform.",
      icon: TrendingUp,
      bgColor: "bg-orange-500/10",
      iconColor: "text-orange-600",
      ringColor: "ring-orange-500/20",
    },
    {
      number: "05",
      title: "Release Funds",
      description:
        "Once milestones are approved, funds are automatically released from escrow. Fast, secure, and transparent.",
      icon: CheckCircle2,
      bgColor: "bg-teal-500/10",
      iconColor: "text-teal-600",
      ringColor: "ring-teal-500/20",
    },
    {
      number: "06",
      title: "Resolve Disputes",
      description:
        "If issues arise, our AI-assisted mediation helps resolve conflicts. Optional lawyer referrals available.",
      icon: MessageSquare,
      bgColor: "bg-rose-500/10",
      iconColor: "text-rose-600",
      ringColor: "ring-rose-500/20",
    },
  ];

  const benefits = [
    {
      icon: Clock,
      title: "Save Time",
      description:
        "Generate contracts in minutes, not hours. No legal jargon or complex templates.",
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-600",
    },
    {
      icon: Shield,
      title: "Reduce Risk",
      description:
        "FCA-backed escrow protects your payments. No more chasing invoices or worrying about non-payment.",
      bgColor: "bg-emerald-500/10",
      iconColor: "text-emerald-600",
    },
    {
      icon: Target,
      title: "Stay Organized",
      description:
        "Track all your contracts and milestones in one place. Never lose track of project status.",
      bgColor: "bg-orange-500/10",
      iconColor: "text-orange-600",
    },
    {
      icon: Users,
      title: "Build Trust",
      description:
        "Professional contracts and secure payments build confidence with clients.",
      bgColor: "bg-violet-500/10",
      iconColor: "text-violet-600",
    },
    {
      icon: Zap,
      title: "Resolve Faster",
      description:
        "AI-assisted dispute resolution helps solve conflicts quickly and fairly.",
      bgColor: "bg-amber-500/10",
      iconColor: "text-amber-600",
    },
    {
      icon: Award,
      title: "Scale Easily",
      description:
        "From one project to hundreds, AllSquared grows with your business.",
      bgColor: "bg-teal-500/10",
      iconColor: "text-teal-600",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 via-primary/3 to-background">
        <div className="container">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mx-auto max-w-3xl text-center space-y-6"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
            >
              How AllSquared Works
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-muted-foreground md:text-xl"
            >
              Six simple steps to secure, professional service contracts. From
              generation to payment, we've got you covered.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid gap-12 lg:gap-16">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={step.number}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeInUp}
                  className={`grid gap-8 lg:grid-cols-2 lg:gap-16 items-center ${
                    isEven ? "" : "lg:grid-flow-dense"
                  }`}
                >
                  <div
                    className={`space-y-4 ${isEven ? "" : "lg:col-start-2"}`}
                  >
                    <div className="inline-flex items-center gap-4">
                      <span className="text-5xl font-bold text-muted-foreground/20">
                        {step.number}
                      </span>
                      <div
                        className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${step.bgColor} ring-2 ${step.ringColor}`}
                      >
                        <Icon className={`h-7 w-7 ${step.iconColor}`} />
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight">
                      {step.title}
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                  <Card className={`${isEven ? "lg:col-start-2" : ""} border-0 shadow-sm`}>
                    <CardContent className="p-8">
                      <div className={`aspect-video rounded-xl flex items-center justify-center ${step.bgColor}`}>
                        <Icon className={`h-24 w-24 ${step.iconColor} opacity-30`} />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-muted/50 to-background">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="mx-auto max-w-3xl text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Why Choose AllSquared?
            </h2>
            <p className="text-lg text-muted-foreground">
              The only platform that integrates everything you need for secure
              service contracts.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <motion.div key={benefit.title} variants={fadeInUp}>
                  <Card className="h-full border-0 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="pt-6">
                      <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${benefit.bgColor}`}>
                        <Icon className={`h-6 w-6 ${benefit.iconColor}`} />
                      </div>
                      <h3 className="mb-2 text-xl font-semibold">
                        {benefit.title}
                      </h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="mx-auto max-w-3xl text-center space-y-8"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join the waitlist and be among the first to experience secure,
              professional service contracts.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200" asChild>
                <Link href="/contact">
                  Join Waitlist <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="hover:scale-[1.02] transition-all duration-200" asChild>
                <Link href="/features">Explore Features</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
