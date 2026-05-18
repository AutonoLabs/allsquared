import { MarketingPageHero } from "@/components/marketing/MarketingPageHero";
import { MarketingSection } from "@/components/marketing/MarketingSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin } from "lucide-react";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type Intent = "apply" | "venture" | "message";

const intentCopy: Record<Intent, { label: string; title: string; body: string; prompt: string }> = {
  apply: {
    label: "Apply to work",
    title: "Work with the AllSquared team",
    body: "For builders, designers, operators, researchers, legal minds, and care-system thinkers who want to build high-trust products from a UK base with a global team.",
    prompt: "Tell us what you do well, what you have shipped, and why trust infrastructure is the kind of problem you want to work on.",
  },
  venture: {
    label: "Submit venture",
    title: "Submit a project or venture",
    body: "For serious operators with a trust-heavy workflow, partnership, pilot, or venture that may belong in the Projects portfolio.",
    prompt: "Describe the venture, the user, the trust failure, and what evidence would prove the problem is worth building around.",
  },
  message: {
    label: "Submit message",
    title: "Send a focused message",
    body: "For partnerships, press, research, AllSquared deals, Yapper/AllSquared article ideas, or anything that needs a direct human reply.",
    prompt: "Give us the context, the ask, and what a useful first response would include.",
  },
};

function getInitialIntent(): Intent {
  if (typeof window === "undefined") return "message";
  const value = new URLSearchParams(window.location.search).get("intent");
  return value === "apply" || value === "venture" || value === "message" ? value : "message";
}

export default function Contact() {
  const [intent, setIntent] = useState<Intent>(getInitialIntent);
  const [formData, setFormData] = useState({ name: "", email: "", organisation: "", message: "" });
  const active = useMemo(() => intentCopy[intent], [intent]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const next = new URLSearchParams(window.location.search).get("intent");
    if (next === "apply" || next === "venture" || next === "message") setIntent(next);
  }, []);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const subject = encodeURIComponent(`[AllSquared] ${active.label}: ${formData.name}`);
    const body = encodeURIComponent(
      `Intent: ${active.label}\nName: ${formData.name}\nEmail: ${formData.email}\nOrganisation: ${formData.organisation || "n/a"}\n\n${formData.message}`,
    );
    window.location.href = `mailto:hello@allsquared.uk?subject=${subject}&body=${body}`;
    toast.success("Opening your email client with the message prepared.");
  }

  return (
    <div className="overflow-hidden bg-[#fafaf7] text-[#0b1b33]">
      <MarketingPageHero
        badge="UK based · global team"
        kicker="Contact"
        title="Three doors. One useful first reply."
        accent="useful"
        description="Choose the path closest to your situation: apply to work with the team, submit a venture or project, or send a direct message. The form is intentionally Typeform-like: fewer fields, more context."
        primaryAction={{ label: "See projects", href: "/projects" }}
        secondaryAction={{ label: "Read the journal", href: "/blog" }}
        highlights={["London base", "Distributed operators", "High-trust services"]}
      />

      <MarketingSection
        numeral="I"
        kicker="Submit"
        title="Start with the kind of conversation you actually want to have."
        accent="actually"
        tone="white"
      >
        <div className="mt-14 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-3">
            {(Object.keys(intentCopy) as Intent[]).map((key, index) => {
              const item = intentCopy[key];
              const selected = intent === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setIntent(key)}
                  className={`w-full rounded-[16px] border p-6 text-left transition-all hover:-translate-y-[2px] ${
                    selected
                      ? "border-[#1f6b3f] bg-[#e5f1ea] shadow-[0_12px_30px_-18px_rgba(31,107,63,0.45)]"
                      : "border-[#e2e0d6] bg-white hover:border-[#c7d0e0]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <div className="as25-font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#1f6b3f]">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <h2 className="as25-font-display mt-3 text-[28px] font-normal leading-[1.1] tracking-[-0.02em] text-[#0b1b33]">
                        {item.label}
                      </h2>
                      <p className="mt-3 text-[14px] leading-6 text-[#2d466f]">{item.body}</p>
                    </div>
                    <span className="as25-font-display text-[30px] italic text-[#2d466f]">→</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="rounded-[18px] border border-[#e2e0d6] bg-white p-7 shadow-[0_1px_0_#e2e0d6] md:p-9">
            <div className="as25-font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#1f6b3f]">{active.label}</div>
            <h2 className="as25-font-display mt-3 text-[34px] font-normal leading-[1.08] tracking-[-0.03em] text-[#0b1b33] md:text-[46px]">
              {active.title}
            </h2>
            <p className="mt-5 max-w-[620px] text-[15.5px] leading-7 text-[#2d466f]">{active.prompt}</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    placeholder="Jane Smith"
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
                    placeholder="jane@example.com"
                    value={formData.email}
                    onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="organisation">Organisation / project</Label>
                <Input
                  id="organisation"
                  placeholder={intent === "venture" ? "Project or venture name" : "Company, studio, or independent"}
                  value={formData.organisation}
                  onChange={(event) => setFormData({ ...formData, organisation: event.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Context</Label>
                <Textarea
                  id="message"
                  placeholder={active.prompt}
                  rows={7}
                  value={formData.message}
                  onChange={(event) => setFormData({ ...formData, message: event.target.value })}
                  required
                />
              </div>

              <Button className="w-full rounded-[8px] bg-[#1f6b3f] text-white hover:bg-[#2a8554]" type="submit" size="lg">
                {active.label}
              </Button>
            </form>
          </div>
        </div>
      </MarketingSection>

      <MarketingSection
        numeral="II"
        kicker="Where we are"
        title="UK based, not UK boxed in."
        accent="not UK boxed in."
      >
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          <div className="rounded-[16px] border border-[#e2e0d6] bg-white p-7">
            <Mail className="h-5 w-5 text-[#1f6b3f]" />
            <div className="as25-font-mono mt-5 text-[10.5px] uppercase tracking-[0.16em] text-[#6b7e9e]">Email</div>
            <a href="mailto:hello@allsquared.uk" className="as25-font-display mt-2 block text-[28px] font-normal leading-[1.1] text-[#0b1b33]">
              hello@allsquared.uk
            </a>
          </div>
          <div className="rounded-[16px] border border-[#e2e0d6] bg-white p-7">
            <MapPin className="h-5 w-5 text-[#1f6b3f]" />
            <div className="as25-font-mono mt-5 text-[10.5px] uppercase tracking-[0.16em] text-[#6b7e9e]">Base</div>
            <p className="mt-2 text-[15.5px] leading-7 text-[#2d466f]">
              London / United Kingdom, with a distributed global team across product, legal, design, AI, and operations.
            </p>
          </div>
        </div>
      </MarketingSection>
    </div>
  );
}
