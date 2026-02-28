import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import {
  Scale,
  Clock,
  FileText,
  Users,
  AlertCircle,
  Check,
  ArrowRight,
  Shield,
  Phone,
  FileSearch,
  PenTool,
  MessageSquare,
} from "lucide-react";

export default function LegalServices() {
  const services = [
    {
      icon: Phone,
      title: "Quick Legal Review",
      price: "£99",
      description: "15-20 minute consultation with a solicitor",
      features: [
        "Get specific questions answered",
        "Understand your rights and obligations",
        "Receive practical guidance",
        "Perfect for 'quick check' situations",
      ],
    },
    {
      icon: FileSearch,
      title: "Contract Review",
      price: "£199",
      description: "Written review of your contract",
      features: [
        "Line-by-line analysis",
        "Risk identification",
        "Suggested amendments",
        "Written summary of findings",
      ],
    },
    {
      icon: PenTool,
      title: "Custom Contract Drafting",
      price: "From £499",
      description: "Bespoke contract created for your needs",
      features: [
        "Initial consultation included",
        "Tailored to your specific requirements",
        "Multiple revision rounds",
        "Final signed version",
      ],
    },
    {
      icon: MessageSquare,
      title: "Dispute Support",
      price: "From £299",
      description: "Help navigating contract disputes",
      features: [
        "Assessment of your position",
        "Strategy recommendations",
        "Representation in mediation (additional)",
        "Litigation referral if needed",
      ],
    },
  ];

  const solicitorFeatures = [
    "Registered with the Solicitors Regulation Authority (SRA)",
    "Carrying professional indemnity insurance",
    "Experienced in contract and commercial law",
    "Committed to fixed-fee, transparent pricing",
  ];

  const faqs = [
    {
      q: "Is AllSquared a law firm?",
      a: "No. AllSquared is a technology platform that connects you with independent, SRA-regulated solicitors. We don't provide legal advice directly—the solicitors in our network do.",
    },
    {
      q: "How do I know the solicitors are qualified?",
      a: "All solicitors in our LITL network are verified members of the Solicitors Regulation Authority and carry professional indemnity insurance. You can verify their credentials on the SRA website.",
    },
    {
      q: "What happens during a Quick Legal Review?",
      a: "You'll have a 15-20 minute video or phone call with a solicitor. You can ask questions about your contract, understand your rights, and get practical guidance on next steps.",
    },
    {
      q: "Can LITL solicitors represent me in court?",
      a: "Yes, if your dispute escalates to litigation, our network solicitors can represent you. This would be quoted separately based on the complexity of your case.",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <div className="flex justify-center mb-4">
              <Scale className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Expert Legal Help
              <br />
              <span className="text-primary">When You Need It</span>
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Access SRA-regulated solicitors for contract reviews, legal advice,
              and dispute support—at fixed, transparent prices.
            </p>
            <Button size="lg" asChild>
              <Link href="/contact">
                Book a Consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-start gap-4 p-6 rounded-lg border bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900">
              <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900 dark:text-amber-100">
                  Important Notice
                </p>
                <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
                  AllSquared is not a law firm and does not provide legal advice.
                  Our LITL service connects you with independent, SRA-regulated
                  solicitors who provide advice directly to you under their own
                  professional terms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Legal Services
            </h2>
            <p className="text-lg text-muted-foreground">
              Fixed-fee legal help for every stage of your contract journey.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
            {services.map((service) => (
              <Card key={service.title}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <div className="mt-1">
                        <span className="text-2xl font-bold">{service.price}</span>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="mt-2">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6" variant="outline" asChild>
                    <Link href="/contact">Learn More</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solicitor Network */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-12">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Our Solicitor Network
              </h2>
              <p className="text-lg text-muted-foreground">
                All LITL solicitors meet our strict quality standards.
              </p>
            </div>
            <div className="space-y-4">
              {solicitorFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-lg border bg-background"
                >
                  <Shield className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 p-6 rounded-lg bg-primary/5 border border-primary/20 text-center">
              <p className="text-muted-foreground">
                You can verify any solicitor's credentials on the{" "}
                <a
                  href="https://www.sra.org.uk/consumers/register/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  SRA Register
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* When to Use LITL */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              When to Use LITL
            </h2>
            <p className="text-lg text-muted-foreground">
              Our legal services complement AllSquared's contract platform.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold mb-2">
                  1
                </div>
                <CardTitle className="text-lg">Before Signing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Have a solicitor review any contract before you sign. Identify
                  risks and get amendments suggested.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold mb-2">
                  2
                </div>
                <CardTitle className="text-lg">Complex Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  For high-value or complex work, get a custom contract drafted
                  to protect your specific interests.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold mb-2">
                  3
                </div>
                <CardTitle className="text-lg">During Disputes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  If a dispute can't be resolved through mediation, get legal
                  support to understand your options.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq) => (
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

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center space-y-8">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Need Legal Help?
            </h2>
            <p className="text-lg text-muted-foreground">
              Connect with a qualified solicitor today. Fixed fees, no surprises.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/contact">Book a Consultation</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/pricing">View All Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
