import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Eye,
  FileCheck,
  Scale,
  Wallet,
} from "lucide-react";

export default function Clients() {
  const painPoints = [
    "Paying deposits that disappear",
    "Work that doesn't match what was promised",
    "No way to hold contractors accountable",
    "Surprise costs and scope changes",
    "Being stuck with substandard results",
  ];

  const benefits = [
    {
      icon: Wallet,
      title: "Your Money Stays Protected",
      description:
        "Funds only release when you approve each milestone. You're never paying for work you haven't seen.",
    },
    {
      icon: FileCheck,
      title: "Clear Deliverables Upfront",
      description:
        "Know exactly what you're getting before you commit. Milestones define success criteria.",
    },
    {
      icon: Eye,
      title: "Quality Assurance Built In",
      description:
        "If work doesn't meet agreed standards, you can request revisions before releasing payment.",
    },
    {
      icon: Scale,
      title: "Fair Dispute Resolution",
      description:
        "When things go wrong, our mediation process finds fair solutions—without expensive lawyers.",
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Post Your Project",
      description:
        "Describe what you need. Our AI helps create a clear contract with defined milestones and deliverables.",
    },
    {
      step: 2,
      title: "Deposit to Escrow",
      description:
        "Your payment is held securely by our FCA-regulated escrow partner. The contractor can see it's funded.",
    },
    {
      step: 3,
      title: "Review Each Milestone",
      description:
        "As work is delivered, review and approve each milestone. Request changes if needed.",
    },
    {
      step: 4,
      title: "Release Payment",
      description:
        "Once satisfied, approve the milestone to release payment. Only pay for work that meets your standards.",
    },
  ];

  const testimonials = [
    {
      quote:
        "The milestone system means I only pay for work I've approved. It's transformed how I hire contractors.",
      author: "James M.",
      role: "Small Business Owner",
    },
    {
      quote:
        "I used to dread hiring freelancers because I'd been burned so many times. AllSquared changed that.",
      author: "Lisa R.",
      role: "Marketing Director",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Hire with Confidence.
              <br />
              <span className="text-primary">Pay for Results.</span>
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              AllSquared protects your deposits, ensures quality work, and gives
              you recourse when things go wrong.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/contact">
                  Post Your First Project
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/how-it-works">See How It Works</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-4">
              Tired of Getting Burned?
            </h2>
            <p className="text-lg text-muted-foreground text-center mb-12">
              34% of clients have paid deposits that were never returned.
            </p>
            <div className="space-y-4">
              {painPoints.map((point, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-lg border bg-muted/50"
                >
                  <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
            <div className="mt-12 p-6 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-center text-lg font-medium">
                AllSquared holds your payment in escrow and only releases it when
                you approve the work. Clear milestones mean you pay as you go.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              How AllSquared Protects You
            </h2>
            <p className="text-lg text-muted-foreground">
              Every feature designed to give you confidence when hiring.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
            {benefits.map((benefit) => (
              <Card key={benefit.title}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Simple, Protected Process
            </h2>
            <p className="text-lg text-muted-foreground">
              From posting to payment, we've got you covered.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {howItWorks.map((item) => (
              <div key={item.step} className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Built on Trust and Security
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-4 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center p-4">
              <Shield className="h-10 w-10 text-primary mb-3" />
              <p className="font-semibold">FCA-Regulated Escrow</p>
              <p className="text-sm text-muted-foreground">Transpact (Ref: 546279)</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <Shield className="h-10 w-10 text-primary mb-3" />
              <p className="font-semibold">Bank-Level Encryption</p>
              <p className="text-sm text-muted-foreground">256-bit SSL security</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <Shield className="h-10 w-10 text-primary mb-3" />
              <p className="font-semibold">SRA-Regulated Network</p>
              <p className="text-sm text-muted-foreground">Qualified solicitors</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <Shield className="h-10 w-10 text-primary mb-3" />
              <p className="font-semibold">UK-Based Company</p>
              <p className="text-sm text-muted-foreground">Regulated and compliant</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
              What Clients Say
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.author}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col h-full">
                      <p className="text-lg italic flex-1">"{testimonial.quote}"</p>
                      <div className="mt-6 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-semibold">{testimonial.author}</p>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary/5">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center space-y-8">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Hire with Confidence?
            </h2>
            <p className="text-lg text-muted-foreground">
              Post your project and start working with protected payments today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/contact">Create Your First Contract Free</Link>
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
