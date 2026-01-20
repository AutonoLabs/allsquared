import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import {
  Shield,
  Clock,
  FileCheck,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Briefcase,
  Palette,
  PenTool,
  Camera,
  TrendingUp,
  MessageSquare,
  Wrench,
  Calendar,
} from "lucide-react";

export default function Freelancers() {
  const painPoints = [
    "Clients who vanish after seeing the final work",
    '"Just one more revision" that turns into ten',
    "Chasing invoices instead of doing what you love",
    "The fear of asking for deposits upfront",
    "Disputes with no paper trail",
  ];

  const benefits = [
    {
      icon: Clock,
      title: "Never Chase Payments Again",
      description:
        "When clients fund the escrow before work begins, you know the money exists. No more unpaid invoices.",
    },
    {
      icon: FileCheck,
      title: "Clear Scope = No Scope Creep",
      description:
        "Our AI helps you define exactly what's included. Everything else is a change order.",
    },
    {
      icon: Briefcase,
      title: "Professional Image, Zero Effort",
      description:
        "Send contracts that make you look established and trustworthy—even if you're just starting out.",
    },
    {
      icon: Shield,
      title: "Protection When Things Go Wrong",
      description:
        "If a client disputes unfairly, you have evidence and access to mediation. The funds stay protected until resolved.",
    },
  ];

  const categories = [
    { icon: Palette, name: "Web Design & Development" },
    { icon: PenTool, name: "Graphic Design & Branding" },
    { icon: MessageSquare, name: "Writing & Content Creation" },
    { icon: Camera, name: "Photography & Videography" },
    { icon: TrendingUp, name: "Marketing & Social Media" },
    { icon: Briefcase, name: "Consulting & Coaching" },
    { icon: Wrench, name: "Home Renovation & Trades" },
    { icon: Calendar, name: "Event Planning & Services" },
  ];

  const testimonials = [
    {
      quote:
        "Finally, a platform that protects both sides. I no longer worry about scope creep or late payments.",
      author: "Sarah K.",
      role: "Freelance Designer",
    },
    {
      quote:
        "After a client tried to dispute completed work, AllSquared's mediation saved me thousands.",
      author: "Mike T.",
      role: "Web Developer",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Get Paid What You're Worth.
              <br />
              <span className="text-primary">On Time. Every Time.</span>
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Professional contracts, secure payments, and protection from scope
              creep—all in one platform designed for UK freelancers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/contact">
                  Start Getting Protected
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
              Sound Familiar?
            </h2>
            <p className="text-lg text-muted-foreground text-center mb-12">
              These problems cost UK freelancers millions every year.
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
                AllSquared eliminates these problems with secure escrow, clear
                milestones, and contracts that protect your work.
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
              Built specifically for freelancers who are tired of getting burned.
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

      {/* Statistics */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 md:grid-cols-3 text-center">
              <div className="space-y-2">
                <p className="text-4xl font-bold text-primary">62%</p>
                <p className="text-lg font-medium">
                  of freelancers have experienced late or non-payment
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-bold text-primary">30+ days</p>
                <p className="text-lg font-medium">
                  average time spent chasing overdue invoices
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-bold text-primary">£5,400</p>
                <p className="text-lg font-medium">
                  average lost annually to bad clients
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Built for Your Work
            </h2>
            <p className="text-lg text-muted-foreground">
              Templates and workflows designed for how freelancers actually work.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 max-w-5xl mx-auto">
            {categories.map((category) => (
              <div
                key={category.name}
                className="flex items-center gap-3 p-4 rounded-lg border bg-background"
              >
                <category.icon className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm font-medium">{category.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
              What Freelancers Say
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
              Ready to Protect Your Income?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of UK freelancers who no longer worry about getting
              paid.
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
