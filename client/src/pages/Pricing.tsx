import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Link } from "wouter";

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
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Choose the plan that fits your needs. Start free, upgrade as you
              grow.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-3">
            {tiers.map((tier) => (
              <Card
                key={tier.name}
                className={
                  tier.highlighted
                    ? "border-primary shadow-lg relative"
                    : ""
                }
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
                    className="w-full"
                    variant={tier.highlighted ? "default" : "outline"}
                    asChild
                  >
                    <Link href="/contact">{tier.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Optional Add-Ons
            </h2>
            <p className="text-lg text-muted-foreground">
              Enhance your experience with professional legal services.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            {addons.map((addon) => (
              <Card key={addon.name}>
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
            ))}
          </div>
        </div>
      </section>

      {/* Escrow Fees */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <Card>
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
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
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
                <Card key={faq.q}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.q}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center space-y-8">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join the waitlist and be among the first to access AllSquared.
            </p>
            <Button size="lg" asChild>
              <Link href="/contact">Join Waitlist</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

