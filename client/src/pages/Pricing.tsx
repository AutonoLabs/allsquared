import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
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
    },
    {
      name: "Premium Contract Customization",
      price: "£299",
      period: "/contract",
      description:
        "Fully customized contract drafted by legal professionals for complex projects.",
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
              Simple, Transparent Pricing
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-muted-foreground md:text-xl"
            >
              Choose the plan that fits your needs. Start free, upgrade as you
              grow.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-16 md:py-24">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid gap-8 lg:grid-cols-3"
          >
            {tiers.map((tier) => (
              <motion.div key={tier.name} variants={scaleIn}>
                <Card
                  className={`h-full ${
                    tier.highlighted
                      ? "border-primary shadow-lg relative"
                      : "border-0 shadow-sm hover:shadow-md transition-all duration-300"
                  }`}
                >
                  {tier.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{tier.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{tier.price}</span>
                      <span className="text-muted-foreground">{tier.period}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {tier.description}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full ${tier.highlighted ? "shadow-md hover:shadow-lg" : ""} hover:scale-[1.02] transition-all duration-200`}
                      variant={tier.highlighted ? "default" : "outline"}
                      asChild
                    >
                      <Link href="/contact">{tier.cta}</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Add-ons */}
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
              Optional Add-Ons
            </h2>
            <p className="text-lg text-muted-foreground">
              Enhance your experience with professional legal services.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto"
          >
            {addons.map((addon) => (
              <motion.div key={addon.name} variants={scaleIn}>
                <Card className="h-full border-0 shadow-sm hover:shadow-md transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-xl">{addon.name}</CardTitle>
                    <div className="mt-2">
                      <span className="text-3xl font-bold">{addon.price}</span>
                      <span className="text-muted-foreground">{addon.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {addon.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Escrow Fees */}
      <section className="py-16 md:py-24">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            className="mx-auto max-w-3xl"
          >
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Escrow Transaction Fees</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="font-medium">Basic Plan</span>
                  <span className="text-muted-foreground">No escrow access</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="font-medium">Professional Plan</span>
                  <span className="font-semibold">2.5% per transaction</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="font-medium">Enterprise Plan</span>
                  <span className="font-semibold">Custom rates</span>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Escrow fees cover FCA-regulated payment protection, secure fund
                  holding, and automatic milestone-based releases.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-muted/50 to-background">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-3xl font-bold tracking-tight text-center mb-12"
            >
              Frequently Asked Questions
            </motion.h2>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="space-y-6"
            >
              {[
                {
                  q: "Can I switch plans anytime?",
                  a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
                },
                {
                  q: "What payment methods do you accept?",
                  a: "We accept all major credit and debit cards, as well as direct debit for monthly subscriptions.",
                },
                {
                  q: "Is there a free trial?",
                  a: "Our Basic plan is free forever with limited features. You can upgrade to Professional anytime.",
                },
                {
                  q: "How does escrow work?",
                  a: "Clients deposit funds with our FCA-regulated escrow partners. Funds are released to service providers when milestones are approved.",
                },
              ].map((faq) => (
                <motion.div key={faq.q} variants={fadeInUp}>
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg">{faq.q}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{faq.a}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
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
              Join the waitlist and be among the first to access AllSquared.
            </p>
            <Button size="lg" className="shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200" asChild>
              <Link href="/contact">Join Waitlist</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
