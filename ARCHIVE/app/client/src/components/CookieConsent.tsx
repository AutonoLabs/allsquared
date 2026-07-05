import { useEffect, useState } from "react";
import { Link } from "wouter";

/**
 * UK GDPR / PECR cookie consent banner.
 *
 * - Shows on first visit. Persists choice in localStorage under "as_cookie_choice".
 * - Three states: "accepted", "rejected", "custom".
 * - Default ("essential-only") is set if the user makes no choice — i.e. we never
 *   set non-essential cookies without explicit consent. This is the
 *   ICO-recommended default for UK GDPR compliance.
 * - "strictly necessary" cookies (auth, security, routing) are always allowed;
 *   this banner only governs analytics and product-improvement cookies.
 */
type ConsentState = "accepted" | "rejected" | "essential-only";

const STORAGE_KEY = "as_cookie_choice";

function readStoredChoice(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v === "accepted" || v === "rejected" || v === "essential-only") return v;
    return null;
  } catch {
    return null;
  }
}

function persistChoice(choice: ConsentState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    // localStorage may be blocked (e.g. private mode). Best-effort only.
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const existing = readStoredChoice();
    if (!existing) {
      // Defer one tick so we never block first paint.
      const t = window.setTimeout(() => setVisible(true), 200);
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, []);

  if (!visible) return null;

  const handle = (choice: ConsentState) => {
    persistChoice(choice);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie preferences"
      className="fixed inset-x-0 bottom-0 z-[200] border-t border-[#c7d0e0] bg-white shadow-[0_-8px_24px_rgba(11,27,51,0.08)]"
    >
      <div className="mx-auto w-full max-w-[1240px] px-5 py-5 md:px-8 md:py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-8">
          <div className="max-w-[760px] text-sm leading-6 text-[#2d466f]">
            <p className="font-semibold text-[#0b1b33]">Cookies on AllSquared</p>
            <p className="mt-2">
              We use strictly necessary cookies to keep the platform secure and working. With
              your permission, we also use analytics cookies to understand how the site is used
              and improve it. You can change your choice at any time.{" "}
              <Link
                href="/cookies"
                className="font-semibold text-[#1f6b3f] underline decoration-[rgba(31,107,63,0.35)] underline-offset-4"
              >
                Read our cookie policy
              </Link>
              .
            </p>
            {expanded ? (
              <div className="mt-4 rounded-lg border border-[#e2e0d6] bg-[#fafaf7] p-4 text-xs leading-6 text-[#2d466f]">
                <p className="font-semibold uppercase tracking-[0.16em] text-[#1f6b3f]">
                  Categories
                </p>
                <ul className="mt-3 space-y-2">
                  <li>
                    <span className="font-semibold text-[#0b1b33]">Strictly necessary</span> —
                    authentication, session integrity, fraud prevention, routing. Always active.
                  </li>
                  <li>
                    <span className="font-semibold text-[#0b1b33]">Analytics</span> — aggregate,
                    privacy-conscious usage data to improve reliability and content. Off until
                    you accept.
                  </li>
                  <li>
                    <span className="font-semibold text-[#0b1b33]">Third-party</span> — set by
                    authentication, hosting, payments, or escrow-related providers under their
                    own terms.
                  </li>
                </ul>
              </div>
            ) : null}
          </div>
          <div className="flex flex-col gap-2 md:items-end">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handle("rejected")}
                className="rounded-md border border-[#c7d0e0] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#2d466f] transition-colors hover:border-[#0b1b33] hover:text-[#0b1b33]"
              >
                Reject non-essential
              </button>
              <button
                type="button"
                onClick={() => handle("accepted")}
                className="rounded-md bg-[#1f6b3f] px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-[#1a5a36]"
              >
                Accept all
              </button>
            </div>
            <div className="flex gap-4 text-xs text-[#6b7e9e]">
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="font-semibold uppercase tracking-[0.1em] hover:text-[#0b1b33]"
              >
                {expanded ? "Hide details" : "Customise"}
              </button>
              <button
                type="button"
                onClick={() => handle("essential-only")}
                className="font-semibold uppercase tracking-[0.1em] hover:text-[#0b1b33]"
              >
                Essential only
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}