import { MarketingPageHero } from "@/components/marketing/MarketingPageHero";
import { MarketingSection } from "@/components/marketing/MarketingSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMarketingCta } from "@/hooks/useMarketingCta";
import { Mail, MapPin, Phone } from "lucide-react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

const contactTracks = [
  {
    title: "Platform fit",
    body: "You're considering AllSquared for live deals and want to pressure-test whether it fits your contract flow before you commit.",
  },
  {
    title: "High-value project fit",
    body: "You already know the deal is large enough or awkward enough that invoice-chasing would be a real risk event.",
  },
  {
    title: "Legal-services query",
    body: "You need a contract review, bespoke draft, or dispute conversation and want to understand the handoff first.",
  },
];

export default function Contact() {
  const { handleGetStarted } = useMarketingCta();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    userType: "",
    message: "",
  });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    toast.success("Thanks. We've got your note and we'll follow up shortly.");
    setFormData({ name: "", email: "", userType: "", message: "" });
  }

  return (
    <div className="overflow-hidden bg-[#fafaf7] text-[#0b1b33]">
      <MarketingPageHero
        badge="Talk to the team"
        kicker="Contact"
        title="If you have a real deal in mind, start there."
        accent="start there."
        description="The best introductions are concrete: the kind of work, the deal size, where trust tends to break down, and whether you need core platform flow or additional legal support."
        primaryAction={{ label: "Draft a contract instead", onClick: handleGetStarted }}
        highlights={[
          "London-based team",
          "High-value UK project focus",
          "Direct line to the founders",
        ]}
        heroVariant="split"
      />

      <MarketingSection
        numeral="I"
        kicker="Get in touch"
        title="Tell us enough to make the first reply useful."
        accent="first reply useful."
        tone="white"
      >
        <div className="mt-14 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[14px] border border-[#e2e0d6] bg-white p-8">
            <h2 className="as25-font-display text-[30px] font-normal leading-[1.1] tracking-[-0.02em] text-[#0b1b33]">
              Contact form
            </h2>
            <p className="mt-3 max-w-[540px] text-[14.5px] leading-7 text-[#2d466f]">
              This is for platform-fit conversations, legal-services questions, and serious project inquiries.
              serious project inquiries.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  placeholder="John Smith"
                  value={formData.name}
                  onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="userType">I am a...</Label>
                <Select
                  value={formData.userType}
                  onValueChange={(value) => setFormData({ ...formData, userType: value })}
                >
                  <SelectTrigger id="userType">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="freelancer">Freelancer / consultant</SelectItem>
                    <SelectItem value="contractor">Contractor / tradesperson</SelectItem>
                    <SelectItem value="client">Client / service buyer</SelectItem>
                    <SelectItem value="agency">Agency / business</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about the kind of deal, the problem you're solving, or the legal support you need."
                  rows={5}
                  value={formData.message}
                  onChange={(event) => setFormData({ ...formData, message: event.target.value })}
                />
              </div>

              <Button className="w-full rounded-[8px] bg-[#1f6b3f] text-white hover:bg-[#2a8554]" type="submit" size="lg">
                Send enquiry
              </Button>
            </form>
          </div>

          <div className="space-y-5">
            <div className="rounded-[14px] border border-[#e2e0d6] bg-white p-7">
              <div className="flex items-start gap-4">
                <div className="grid h-11 w-11 place-items-center rounded-[8px] border border-[#c7d0e0] bg-[#fafaf7] text-[#0b1b33]">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="as25-font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#6b7e9e]">
                    Email
                  </div>
                  <a
                    href="mailto:hello@allsquared.uk"
                    className="as25-font-display mt-2 block text-[24px] font-normal leading-[1.15] text-[#0b1b33]"
                  >
                    hello@allsquared.uk
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-[14px] border border-[#e2e0d6] bg-white p-7">
              <div className="flex items-start gap-4">
                <div className="grid h-11 w-11 place-items-center rounded-[8px] border border-[#c7d0e0] bg-[#fafaf7] text-[#0b1b33]">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <div className="as25-font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#6b7e9e]">
                    Phone
                  </div>
                  <p className="mt-2 text-[14.5px] leading-7 text-[#2d466f]">Introductions are currently handled by email first.</p>
                </div>
              </div>
            </div>

            <div className="rounded-[14px] border border-[#e2e0d6] bg-white p-7">
              <div className="flex items-start gap-4">
                <div className="grid h-11 w-11 place-items-center rounded-[8px] border border-[#c7d0e0] bg-[#fafaf7] text-[#0b1b33]">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="as25-font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#6b7e9e]">
                    Base
                  </div>
                  <p className="mt-2 text-[14.5px] leading-7 text-[#2d466f]">London, United Kingdom.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MarketingSection>

      <MarketingSection
        numeral="II"
        kicker="What to include"
        title="Three kinds of conversation that help immediately."
        accent="help immediately."
      >
        <div className="mt-14 grid gap-5 xl:grid-cols-3">
          {contactTracks.map((track) => (
            <article key={track.title} className="rounded-[14px] border border-[#e2e0d6] bg-white px-7 py-8">
              <h3 className="as25-font-display text-[24px] font-normal leading-[1.15] tracking-[-0.01em] text-[#0b1b33]">
                {track.title}
              </h3>
              <p className="mt-4 text-[14.5px] leading-7 text-[#2d466f]">{track.body}</p>
            </article>
          ))}
        </div>
      </MarketingSection>
    </div>
  );
}
