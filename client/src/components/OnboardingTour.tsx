import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { X, ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";
import { MD3Button } from "@/components/md3/Button";

const TOUR_KEY = "allsquared_tour_v1";

type Step = {
  title: string;
  description: string;
  action?: { label: string; href: string };
  highlight?: string; // CSS selector to highlight
};

const STEPS: Step[] = [
  {
    title: "Welcome to AllSquared 👋",
    description:
      "AllSquared is your end-to-end platform for freelance contracts — create, sign, and get paid securely. This quick tour takes 60 seconds.",
  },
  {
    title: "1. Create a Contract",
    description:
      "Use the AI-powered contract builder to generate a legally binding UK contract in minutes. Choose a template or start from scratch.",
    action: { label: "Open Contract Builder", href: "/dashboard/contracts/new" },
  },
  {
    title: "2. Invite the Other Party",
    description:
      "Once your contract is drafted, invite your client or freelancer to review and sign electronically via DocuSign-powered e-signatures.",
  },
  {
    title: "3. Payments & Escrow",
    description:
      "AllSquared holds milestone payments in escrow. Funds are only released when work is approved — protecting both sides.",
    action: { label: "View Payments", href: "/dashboard/payments" },
  },
  {
    title: "4. Dispute Resolution",
    description:
      "If something goes wrong, our built-in ADR (Alternative Dispute Resolution) service resolves disputes fairly — no lawyers needed for most cases.",
  },
  {
    title: "You're all set! 🎉",
    description:
      "Complete your profile to verify your identity and unlock higher payment limits. Then create your first contract.",
    action: { label: "Complete Profile", href: "/dashboard/profile" },
  },
];

export function OnboardingTour() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const done = localStorage.getItem(TOUR_KEY) === "done";
      if (!done) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    try { localStorage.setItem(TOUR_KEY, "done"); } catch {}
    setVisible(false);
  }

  function next() {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else dismiss();
  }

  function prev() {
    if (step > 0) setStep((s) => s - 1);
  }

  function handleAction(href: string) {
    dismiss();
    setLocation(href);
  }

  if (!visible) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-[var(--md-sys-shape-extra-large)] bg-[var(--md-sys-color-surface)] shadow-2xl overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-[var(--md-sys-color-surface-variant)]">
          <div
            className="h-1 bg-[var(--md-sys-color-primary)] transition-all duration-300"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <button
            onClick={dismiss}
            className="absolute top-4 right-4 rounded-full p-1.5 text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container-high)] transition-colors"
            aria-label="Skip tour"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Step indicator */}
          <div className="flex gap-1.5 mb-4">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  i === step
                    ? "w-6 bg-[var(--md-sys-color-primary)]"
                    : i < step
                    ? "w-3 bg-[var(--md-sys-color-primary)]/60"
                    : "w-3 bg-[var(--md-sys-color-surface-variant)]"
                }`}
              />
            ))}
          </div>

          <h2 className="md3-headline-small font-semibold text-[var(--md-sys-color-on-surface)] mb-2">
            {current.title}
          </h2>
          <p className="md3-body-medium text-[var(--md-sys-color-on-surface-variant)] mb-6 leading-relaxed">
            {current.description}
          </p>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex gap-2">
              {step > 0 && (
                <MD3Button variant="text" onClick={prev} icon={<ChevronLeft className="h-4 w-4" />}>
                  Back
                </MD3Button>
              )}
              {step === 0 && (
                <MD3Button variant="text" onClick={dismiss}>
                  Skip tour
                </MD3Button>
              )}
            </div>

            <div className="flex gap-2">
              {current.action && (
                <MD3Button variant="outlined" onClick={() => handleAction(current.action!.href)}>
                  {current.action.label}
                </MD3Button>
              )}
              <MD3Button
                variant="filled"
                onClick={next}
                icon={isLast ? <CheckCircle2 className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              >
                {isLast ? "Get Started" : "Next"}
              </MD3Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
