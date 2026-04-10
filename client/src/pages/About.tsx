import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Target, Users, Zap, Sparkles, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
} as const;

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
} as const;

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
} as const;

export default function About() {
  const values = [
    {
      icon: Shield,
      title: "Trust & Security",
      description:
        "We prioritize the security of your payments and data with FCA-regulated partners and bank-grade encryption.",
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-600",
    },
    {
      icon: Zap,
      title: "Innovation",
      description:
        "We leverage cutting-edge AI technology to make legal contracts accessible and affordable for everyone.",
      bgColor: "bg-amber-500/10",
      iconColor: "text-amber-600",
    },
    {
      icon: Users,
      title: "User-Centric",
      description:
        "We design every feature with freelancers and service providers in mind, solving real problems.",
      bgColor: "bg-violet-500/10",
      iconColor: "text-violet-600",
    },
    {
      icon: Target,
      title: "Transparency",
      description:
        "We believe in clear pricing, honest communication, and fair dispute resolution.",
      bgColor: "bg-emerald-500/10",
      iconColor: "text-emerald-600",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden py-12 md:py-20 bg-gradient-to-b from-primary/5 via-primary/3 to-background">
        {/* Decorative shapes */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/10 blur-[100px]" />
          <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-accent/15 blur-[80px]" />
          <div className="absolute top-20 right-[15%] h-20 w-20 rotate-12 rounded-lg border-2 border-primary/20" />
          <div className="absolute top-32 right-[12%] h-14 w-14 -rotate-[8deg] rounded-md bg-primary/10" />
          <div className="absolute bottom-24 left-[10%] h-16 w-16 rotate-[20deg] rounded-lg border-2 border-accent/20" />
          <Shield className="absolute top-24 left-[18%] h-10 w-10 text-primary/15 rotate-12" />
          <Sparkles className="absolute bottom-28 right-[22%] h-8 w-8 text-accent/20 -rotate-6" />
          <Target className="absolute top-16 right-[8%] h-7 w-7 text-primary/20 rotate-45" />
        </div>

        <div className="container relative">
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
              Building the Future of Service{" "}
              <span className="text-primary">Contracts</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-muted-foreground md:text-xl"
            >
              AllSquared is on a mission to make professional service contracts
              accessible, secure, and simple for the UK's 4.4 million
              self-employed workers.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-10 md:py-20">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center"
          >
            <motion.div variants={fadeInUp} className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
                <Target className="h-3.5 w-3.5" />
                Our Mission
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Protecting Every Service Transaction
              </h2>
              <p className="text-lg text-muted-foreground">
                Every year, freelancers and service providers lose billions to
                payment disputes, scope creep, and project failures. Traditional
                legal solutions are expensive, complex, and fragmented.
              </p>
              <p className="text-lg text-muted-foreground">
                We're changing that. AllSquared combines AI-powered contract
                generation, FCA-backed escrow, and milestone management into one
                seamless platform. Our goal is to protect every service
                transaction in the UK, making professional contracts as easy as
                sending an email.
              </p>
            </motion.div>
            <motion.div variants={scaleIn} className="relative">
              <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-primary/20 to-accent/20 blur-2xl" />
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border/50 bg-muted/30 shadow-xl">
                <div className="flex h-full items-center justify-center p-8">
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="flex flex-col items-center justify-center rounded-lg bg-white/50 p-6 backdrop-blur-sm">
                      <Shield className="h-10 w-10 text-primary mb-2" />
                      <span className="text-xs font-medium text-center">Secure Escrow</span>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-lg bg-white/50 p-6 backdrop-blur-sm">
                      <Zap className="h-10 w-10 text-amber-600 mb-2" />
                      <span className="text-xs font-medium text-center">AI-Powered</span>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-lg bg-white/50 p-6 backdrop-blur-sm">
                      <Users className="h-10 w-10 text-violet-600 mb-2" />
                      <span className="text-xs font-medium text-center">User-First</span>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-lg bg-white/50 p-6 backdrop-blur-sm">
                      <Target className="h-10 w-10 text-emerald-600 mb-2" />
                      <span className="text-xs font-medium text-center">Transparent</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-10 md:py-20 bg-gradient-to-b from-muted/50 to-background">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="mx-auto max-w-3xl text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Our Values
            </h2>
            <p className="text-lg text-muted-foreground">
              The principles that guide everything we do.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <motion.div key={value.title} variants={scaleIn}>
                  <Card className="h-full border-0 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="pt-6 text-center">
                      <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${value.bgColor}`}>
                        <Icon className={`h-6 w-6 ${value.iconColor}`} />
                      </div>
                      <h3 className="mb-2 text-xl font-semibold">
                        {value.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Market Opportunity */}
      <section className="py-10 md:py-20">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="mx-auto max-w-3xl text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-sm text-accent mb-4">
              <TrendingUp className="h-3.5 w-3.5" />
              Market Opportunity
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              A Massive Market Opportunity
            </h2>
            <p className="text-lg text-muted-foreground">
              The UK's freelance economy is booming, and we're here to support it.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid gap-8 md:grid-cols-3"
          >
            {[
              { value: "4.4M", label: "Self-employed workers in the UK", color: "text-primary", icon: Users },
              { value: "£30B", label: "Home improvement market annually", color: "text-secondary", icon: TrendingUp },
              { value: "16%", label: "Annual growth rate of freelance platforms", color: "text-accent", icon: Sparkles },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div key={stat.label} variants={scaleIn}>
                  <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300">
                    <CardContent className="pt-6 text-center">
                      <Icon className={`h-8 w-8 mx-auto mb-3 ${stat.color}`} />
                      <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                        {stat.value}
                      </div>
                      <p className="text-muted-foreground">{stat.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Regulatory Compliance */}
      <section className="py-10 md:py-20 bg-gradient-to-b from-muted/50 to-background">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="mx-auto max-w-3xl text-center space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary mb-4">
              <Shield className="h-3.5 w-3.5" />
              Regulatory Compliance
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Fully Compliant & Regulated
            </h2>
            <p className="text-lg text-muted-foreground">
              AllSquared operates within the UK's unreserved legal services
              market, as defined by the Solicitors Regulation Authority (SRA).
              Our escrow partners are FCA-authorised, ensuring your funds are
              protected with the highest standards of financial regulation.
            </p>
            <p className="text-muted-foreground">
              We work closely with legal and financial regulators to maintain
              compliance and provide the safest possible platform for our users.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-14 md:py-24">
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-16 -left-16 h-64 w-64 rounded-full bg-primary/5 blur-[80px]" />
          <div className="absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-accent/10 blur-[60px]" />
          <Sparkles className="absolute top-16 right-[15%] h-10 w-10 text-primary/10 rotate-12" />
          <Shield className="absolute bottom-20 left-[20%] h-8 w-8 text-accent/10 -rotate-12" />
        </div>

        <div className="container relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mx-auto max-w-3xl text-center space-y-8"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Join Us on This Journey
            </h2>
            <p className="text-lg text-muted-foreground">
              Be part of the future of service contracts. Sign up for early
              access today.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200" asChild>
                <Link href="/contact">Join Waitlist</Link>
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
