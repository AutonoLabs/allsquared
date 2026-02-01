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
} from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 md:py-32">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm">
                <span className="mr-2 h-2 w-2 rounded-full bg-secondary"></span>
                <span className="text-muted-foreground">
                  Launching Soon in the UK
                </span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Secure Service Contracts for{" "}
                <span className="text-primary">Freelancers</span>
              </h1>
              <p className="text-xl text-muted-foreground md:text-2xl">
                The only platform combining AI contracts, FCA-backed escrow, and
                milestone management. Protect your payments, deliver with
                confidence.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                {isAuthenticated ? (
                  <Button size="lg" asChild>
                    <Link href="/dashboard">Go to Dashboard</Link>
                  </Button>
                ) : (
                  <Button size="lg" asChild>
                    <Link href="/contact">Join Waitlist</Link>
                  </Button>
                )}
                <Button size="lg" variant="outline" asChild>
                  <Link href="/how-it-works">See How It Works</Link>
                </Button>
              </div>
              <div className="flex items-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-secondary" />
                  <span>FCA-Backed Escrow</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-secondary" />
                  <span>AI-Powered Contracts</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="/hero-freelancer.jpg"
                alt="Professional freelancer working"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              £30 Billion Market Plagued by Payment Disputes
            </h2>
            <p className="text-lg text-muted-foreground md:text-xl">
              Freelancers and service providers face constant risks: non-payment,
              scope creep, and project failures. Clients struggle with quality
              concerns and lack of protection. Current solutions are fragmented,
              expensive, and complex.
            </p>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              Everything You Need in One Platform
            </h2>
            <p className="text-lg text-muted-foreground">
              AllSquared is the only integrated solution combining contracts,
              escrow, and milestone management.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  AI Contract Generation
                </h3>
                <p className="text-muted-foreground">
                  Generate professional, legally-sound contracts in minutes for
                  freelance services, home improvements, events, and more.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                  <Shield className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  FCA-Backed Escrow
                </h3>
                <p className="text-muted-foreground">
                  Secure payments with FCA-authorised escrow. Funds released only
                  when milestones are met, protecting both parties.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  Milestone Management
                </h3>
                <p className="text-muted-foreground">
                  Track project progress with clear milestones. Automatic payment
                  releases keep projects moving forward.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  AI Dispute Resolution
                </h3>
                <p className="text-muted-foreground">
                  Resolve conflicts quickly with AI-assisted mediation. Optional
                  lawyer referrals for complex cases.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                  <Lock className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  Bank-Grade Security
                </h3>
                <p className="text-muted-foreground">
                  Your data and funds are protected with enterprise-level
                  encryption and FCA-regulated escrow partners.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <CheckCircle2 className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  Lawyer-in-the-Loop (LITL)
                </h3>
                <p className="text-muted-foreground">
                  Need expert advice? Connect with SRA-regulated solicitors for
                  contract review or legal guidance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-3 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10M+</div>
              <div className="text-primary-foreground/80">
                Potential Users in UK
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">£30B</div>
              <div className="text-primary-foreground/80">
                Market Opportunity
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">56%</div>
              <div className="text-primary-foreground/80">Gross Margin</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center space-y-8">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Ready to Protect Your Next Project?
            </h2>
            <p className="text-lg text-muted-foreground md:text-xl">
              Join thousands of freelancers and service providers who are signing
              up for early access.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              {isAuthenticated ? (
                <Button size="lg" asChild>
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              ) : (
                <Button size="lg" asChild>
                  <Link href="/contact">Join Waitlist</Link>
                </Button>
              )}
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

