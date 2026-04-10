import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Coins, Shield, Sparkles, Zap } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6  } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5  } },
};

export default function Pricing() {
  const tiers = [
    {
      name: "Basic",
      price: "£0",
      period: "/month",
      description: "Perfect for occasional freelancers",
      icon: Sparkles,
      features: [
        "1 active contract per month",
        "AI contract generation",
        "Digital signatures",
        "Basic milestone tracking",
        "Email support",
      ],
      cta: "Get Started Free",
      highlighted: false,
    },
    {
      name: "Professional",
      price: "£29",
      period: "/month",
      description: "For active freelancers and service providers",
      icon: Zap,
      features: [
        "Unlimited contracts",
        "AI contract generation",
        "FCA-backed escrow (2.5% fee)",
        "Advanced milestone management",
        "AI dispute resolution",
        "Priority support",
        "Contract templates library",
      ],
      cta: "Join Waitlist",
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For agencies and businesses",
      icon: Shield,
      features: [
        "Everything in Professional",
        "Custom escrow fee rates",
        "Dedicated account manager",
        "API access",
        "White-label options",
        "Custom integrations",
        "SLA guarantee",
      ],
      cta: "Contact Sales",
      highlighted: false,
    },
  ];

  const addons = [
    {
      name: "Lawyer-in-the-Loop (LITL)",
      price: "£99",
      period: "/call",
      description:
        "Connect with SRA-regulated solicitors for contract review or legal advice.",
      icon: Shield,
    },
    {
      name: "Premium Contract Customization",
      price: "£299",
      period: "/contract",
      description:
        "Fully customized contract drafted by legal professionals for complex projects.",
      icon: Coins,
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden py-12 md:py-20 bg-gradient-to-b from-primary/5 via-primary/3 to-background">
        {/* Decorative shapes */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-primary/10 blur-[100px]" />
          <div className="absolute bottom-0 left-1/4 h-60 w-60 rounded-full bg-accent/15 blur-[80px]" />
          <div className="absolute top-16 right-[15%] h-16 w-16 rotate-12 rounded-lg border-2 border-primary/20" />
          <div className="absolute top-24 right-[12%] h-12 w-12 -rotate-[8deg] rounded-md bg-primary/10" />
          <div className="absolute bottom-20 left-[10%] h-14 w-14 rotate-[20deg] rounded-lg border-2 border-accent/20" />
          <Coins className="absolute top-32 left-[20%] h-8 w-8 text-primary/20 rotate-12" />
          <Sparkles className="absolute bottom-32 right-[25%] h-6 w-6 text-accent/30 -rotate-6" />
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
              Simple, transparent{" "}
              <span className="text-primary">pricing</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-muted-foreground md:text-xl"
            >
              No hidden fees. No surprises. Pay only for what you need, when you
              need it.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-10 md:py-20">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid gap-6 md:grid-cols-3"
          >
            {tiers.map((tier) => {
              const Icon = tier.icon;
              return (
                <motion.div key={tier.name} variants={scaleIn}>
                  <Card
                    className={`relative h-full ${
                      tier.highlighted
                        ? "border-primary shadow-lg shadow-primary/10"
                        : ""
                    }`}
                  >
                    {tier.highlighted && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                          <Sparkles className="h-3 w-3" />
                          Most Popular
                        </span>
                      </div>
                    )}
                    <CardHeader className="text-center pb-8 pt-8">
                      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-2xl">{tier.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-2">
                        {tier.description}
                      </p>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">{tier.price}</span>
                        {tier.period && (
                          <span className="text-muted-foreground">
                            {tier.period}
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-3">
                        {tier.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3">
                            <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        className="w-full"
                        variant={tier.highlighted ? "default" : "outline"}
                        asChild
                      >
                        <Link href="/contact">{tier.cta}</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-10 md:py-20 bg-muted/30">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="mx-auto max-w-2xl text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Optional Add-ons
            </h2>
            <p className="text-muted-foreground">
              Need extra help? Add professional services on-demand.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2"
          >
            {addons.map((addon) => {
              const Icon = addon.icon;
              return (
                <motion.div key={addon.name} variants={scaleIn}>
                  <Card className="h-full">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{addon.name}</CardTitle>
                          <div className="mt-2">
                            <span className="text-2xl font-bold">{addon.price}</span>
                            <span className="text-muted-foreground text-sm">
                              {addon.period}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {addon.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-10 md:py-20">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="mx-auto max-w-2xl text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Frequently asked questions
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mx-auto max-w-3xl space-y-4"
          >
            {[
              {
                q: "What's the escrow fee?",
                a: "Professional and Enterprise plans include FCA-backed escrow at 2.5% per transaction. The Basic plan does not include escrow.",
              },
              {
                q: "Can I switch plans?",
                a: "Yes. You can upgrade or downgrade at any time. Changes take effect immediately, with pro-rated billing.",
              },
              {
                q: "Do you offer refunds?",
                a: "We offer a 14-day money-back guarantee on all paid plans. Escrow fees are non-refundable once a contract is created.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit and debit cards, as well as direct bank transfers for Enterprise plans.",
              },
            ].map((faq, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.q}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-14 md:py-24 bg-primary text-primary-foreground">
        {/* Decorative elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/5 blur-[80px]" />
          <div className="absolute bottom-0 left-1/4 h-48 w-48 rounded-full bg-white/5 blur-[60px]" />
          <Zap className="absolute top-20 right-[20%] h-12 w-12 text-white/10 rotate-12" />
          <Shield className="absolute bottom-16 left-[15%] h-10 w-10 text-white/10 -rotate-12" />
        </div>

        <div className="container relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mx-auto max-w-2xl text-center space-y-6"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to protect your work?
            </h2>
            <p className="text-lg text-primary-foreground/80">
              Join the waitlist and be the first to know when we launch in the UK.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/contact">Join Waitlist</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10" asChild>
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
