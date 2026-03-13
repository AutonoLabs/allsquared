import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Target, Users, Zap } from "lucide-react";
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
              Building the Future of Service Contracts
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
      <section className="py-16 md:py-24">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center"
          >
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Our Mission
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
            </div>
            <div className="relative">
              <img
                src="/hero-handshake.jpg"
                alt="Business handshake"
                className="rounded-lg shadow-xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
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
              Our Values
            </h2>
            <p className="text-lg text-muted-foreground">
              The principles that guide everything we do.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
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
      <section className="py-16 md:py-24">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="mx-auto max-w-3xl text-center mb-12"
          >
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
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid gap-8 md:grid-cols-3"
          >
            {[
              { value: "4.4M", label: "Self-employed workers in the UK", color: "text-primary" },
              { value: "£30B", label: "Home improvement market annually", color: "text-secondary" },
              { value: "16%", label: "Annual growth rate of freelance platforms", color: "text-accent" },
            ].map((stat) => (
              <motion.div key={stat.label} variants={scaleIn}>
                <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300">
                  <CardContent className="pt-6 text-center">
                    <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                      {stat.value}
                    </div>
                    <p className="text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Regulatory Compliance */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-muted/50 to-background">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="mx-auto max-w-3xl text-center space-y-6"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Regulatory Compliance
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
