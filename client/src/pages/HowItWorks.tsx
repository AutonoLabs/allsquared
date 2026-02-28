import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  CheckCircle2,
  FileSignature,
  FileText,
  MessageSquare,
  Shield,
  TrendingUp,
} from "lucide-react";
import { Link } from "wouter";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Generate Contract",
      description:
        "Answer a few simple questions about your project. Our AI generates a professional, legally-sound contract tailored to your needs.",
      icon: FileText,
      color: "primary",
    },
    {
      number: "02",
      title: "Sign Digitally",
      description:
        "Both parties review and sign the contract electronically. All signatures are legally binding and securely stored.",
      icon: FileSignature,
      color: "secondary",
    },
    {
      number: "03",
      title: "Secure Payment",
      description:
        "Client deposits funds into FCA-backed escrow. Your money is protected until milestones are completed.",
      icon: Shield,
      color: "accent",
    },
    {
      number: "04",
      title: "Deliver Work",
      description:
        "Service provider completes work according to agreed milestones. Track progress in real-time through the platform.",
      icon: TrendingUp,
      color: "primary",
    },
    {
      number: "05",
      title: "Release Funds",
      description:
        "Once milestones are approved, funds are automatically released from escrow. Fast, secure, and transparent.",
      icon: CheckCircle2,
      color: "secondary",
    },
    {
      number: "06",
      title: "Resolve Disputes",
      description:
        "If issues arise, our AI-assisted mediation helps resolve conflicts. Optional lawyer referrals available.",
      icon: MessageSquare,
      color: "accent",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              How AllSquared Works
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Six simple steps to secure, professional service contracts. From
              generation to payment, we've got you covered.
            </p>
          </div>
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
                <div
                  key={step.number}
                  className={`grid gap-8 lg:grid-cols-2 lg:gap-16 items-center ${
                    isEven ? "" : "lg:grid-flow-dense"
                  }`}
                >
                  <div
                    className={`space-y-4 ${isEven ? "" : "lg:col-start-2"}`}
                  >
                    <div className="inline-flex items-center gap-3">
                      <span className="text-5xl font-bold text-muted-foreground/20">
                        {step.number}
                      </span>
                      <div
                        className={`inline-flex h-12 w-12 items-center justify-center rounded-lg bg-${step.color}/10`}
                      >
                        <Icon className={`h-6 w-6 text-${step.color}`} />
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight">
                      {step.title}
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      {step.description}
                    </p>
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

      {/* Benefits */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Why Choose AllSquared?
            </h2>
            <p className="text-lg text-muted-foreground">
              The only platform that integrates everything you need for secure
              service contracts.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Save Time",
                description:
                  "Generate contracts in minutes, not hours. No legal jargon or complex templates.",
              },
              {
                title: "Reduce Risk",
                description:
                  "FCA-backed escrow protects your payments. No more chasing invoices or worrying about non-payment.",
              },
              {
                title: "Stay Organized",
                description:
                  "Track all your contracts and milestones in one place. Never lose track of project status.",
              },
              {
                title: "Build Trust",
                description:
                  "Professional contracts and secure payments build confidence with clients.",
              },
              {
                title: "Resolve Faster",
                description:
                  "AI-assisted dispute resolution helps solve conflicts quickly and fairly.",
              },
              {
                title: "Scale Easily",
                description:
                  "From one project to hundreds, AllSquared grows with your business.",
              },
            ].map((benefit) => (
              <Card key={benefit.title}>
                <CardContent className="pt-6">
                  <h3 className="mb-2 text-xl font-semibold">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
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
              Join the waitlist and be among the first to experience secure,
              professional service contracts.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/contact">
                  Join Waitlist <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/features">Explore Features</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

