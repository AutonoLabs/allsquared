import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  FileText,
  Hammer,
  Home,
  MessageSquare,
  Music,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import { Link } from "wouter";

export default function Features() {
  const features = [
    {
      icon: FileText,
      title: "AI Contract Generation",
      description:
        "Generate professional, legally-sound contracts in minutes using our AI-powered platform.",
      benefits: [
        "5 service categories covered",
        "Customizable templates",
        "Plain English, no legal jargon",
        "Instant generation",
      ],
    },
    {
      icon: Shield,
      title: "FCA-Backed Escrow",
      description:
        "Secure your payments with FCA-authorised escrow partners. Funds released only when milestones are met.",
      benefits: [
        "FCA-regulated partners",
        "Bank-grade security",
        "Automatic fund release",
        "Full payment protection",
      ],
    },
    {
      icon: TrendingUp,
      title: "Milestone Management",
      description:
        "Track project progress with clear milestones. Both parties stay aligned on deliverables and timelines.",
      benefits: [
        "Visual progress tracking",
        "Automatic notifications",
        "Flexible milestone structure",
        "Real-time updates",
      ],
    },
    {
      icon: MessageSquare,
      title: "AI Dispute Resolution",
      description:
        "Resolve conflicts quickly with AI-assisted mediation. Fair, fast, and cost-effective.",
      benefits: [
        "AI-powered mediation",
        "Evidence-based decisions",
        "Optional lawyer referrals",
        "Quick resolution",
      ],
    },
    {
      icon: Users,
      title: "Lawyer-in-the-Loop (LITL)",
      description:
        "Need expert legal advice? Connect with SRA-regulated solicitors for contract review or guidance.",
      benefits: [
        "SRA-regulated solicitors",
        "Pay-per-call pricing",
        "Premium customization",
        "Expert legal advice",
      ],
    },
  ];

  const serviceCategories = [
    {
      icon: Briefcase,
      title: "Freelance Services",
      description:
        "Consulting, design, development, writing, and professional services.",
    },
    {
      icon: Home,
      title: "Home Improvements",
      description:
        "Renovations, repairs, installations, and construction projects.",
    },
    {
      icon: Music,
      title: "Event Services",
      description: "Photography, catering, entertainment, and event planning.",
    },
    {
      icon: Hammer,
      title: "Trade Services",
      description: "Plumbing, electrical, HVAC, and skilled trades.",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Everything You Need for Secure Service Contracts
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              AllSquared is the only platform that combines AI contracts,
              FCA-backed escrow, and milestone management in one seamless
              solution.
            </p>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid gap-8 lg:gap-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={feature.title}
                  className={`grid gap-8 lg:grid-cols-2 lg:gap-16 items-center ${
                    isEven ? "" : "lg:grid-flow-dense"
                  }`}
                >
                  <div
                    className={`space-y-4 ${isEven ? "" : "lg:col-start-2"}`}
                  >
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight">
                      {feature.title}
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      {feature.description}
                    </p>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit) => (
                        <li
                          key={benefit}
                          className="flex items-center gap-2 text-muted-foreground"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Card className={isEven ? "lg:col-start-2" : ""}>
                    <CardContent className="p-8">
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                        <Icon className="h-24 w-24 text-muted-foreground/20" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Service Categories
            </h2>
            <p className="text-lg text-muted-foreground">
              Professional contracts for every type of service project.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {serviceCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Card key={category.title}>
                  <CardHeader>
                    <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center space-y-8">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Experience AllSquared?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join the waitlist and be among the first to access the UK's most
              comprehensive service contract platform.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/contact">Join Waitlist</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

