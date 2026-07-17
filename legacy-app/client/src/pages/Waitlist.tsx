import { AllSquaredWordmark } from "@/components/marketing/AllSquaredWordmark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link } from "wouter";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [joined, setJoined] = useState(false);
  const joinWaitlist = trpc.waitlist.join.useMutation();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!EMAIL_PATTERN.test(normalizedEmail) || normalizedEmail.length > 320) {
      setError("Enter a valid email address.");
      return;
    }

    setError("");
    joinWaitlist.mutate(
      { email: normalizedEmail },
      {
        onSuccess: () => setJoined(true),
        onError: () => setError("We couldn't save your email. Please try again."),
      },
    );
  }

  return (
    <section className="as25-hero-bg min-h-[calc(100vh-76px)] bg-[#fafaf7] px-5 py-12 md:px-8 md:py-20">
      <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="space-y-8">
          <AllSquaredWordmark />
          <div className="space-y-5">
            <p className="as25-font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#1f6b3f]">
              Prelaunch access
            </p>
            <h1 className="as25-font-display max-w-xl text-5xl font-normal leading-[0.95] tracking-[-0.04em] text-[#0b1b33] md:text-6xl">
              Join the AllSquared waitlist.
            </h1>
            <p className="max-w-lg text-lg leading-8 text-[#2d466f]">
              AllSquared is opening access carefully. Leave your email and we'll let you know when the platform is ready for you.
            </p>
          </div>
          <Button
            variant="outline"
            className="rounded-[8px] border-[#c7d0e0] bg-[#fafaf7] text-[#0b1b33] hover:bg-white"
            asChild
          >
            <Link href="/">Back to website</Link>
          </Button>
        </div>

        <div className="rounded-[24px] border border-[#c7d0e0] bg-white p-6 shadow-[0_18px_60px_rgba(11,27,51,0.12)] md:p-8">
          {joined ? (
            <div className="flex min-h-64 flex-col justify-center space-y-5" aria-live="polite">
              <CheckCircle2 className="h-11 w-11 text-[#1f6b3f]" aria-hidden="true" />
              <div className="space-y-2">
                <h2 className="as25-font-display text-4xl font-normal tracking-[-0.04em] text-[#0b1b33]">
                  You're on the list.
                </h2>
                <p className="leading-7 text-[#2d466f]">
                  Thanks for your interest. We'll be in touch when access opens.
                </p>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit} aria-label="Join the waitlist" noValidate>
              <div className="space-y-2">
                <h2 className="as25-font-display text-3xl font-normal tracking-[-0.04em] text-[#0b1b33]">
                  Request early access
                </h2>
                <p className="text-sm leading-6 text-[#2d466f]">
                  One email is all we need. No account will be created yet.
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="waitlist-email" className="text-sm font-semibold text-[#0b1b33]">
                  Email address
                </label>
                <Input
                  id="waitlist-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  maxLength={320}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "waitlist-email-error" : undefined}
                  placeholder="you@example.com"
                  className="h-12 rounded-[8px] border-[#c7d0e0] bg-white text-[#0b1b33] focus-visible:ring-[#1f6b3f]"
                />
                {error && (
                  <p id="waitlist-email-error" role="alert" className="text-sm text-[#b42318]">
                    {error}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={joinWaitlist.isPending}
                className="h-12 w-full rounded-[8px] bg-[#1f6b3f] text-white shadow-none hover:bg-[#2a8554]"
              >
                {joinWaitlist.isPending ? "Joining…" : "Join the waitlist"}
                {!joinWaitlist.isPending && <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />}
              </Button>
              <p className="text-xs leading-5 text-[#6b7e9e]">
                By joining, you agree that AllSquared may contact you about launch access. See our{" "}
                <Link href="/privacy" className="underline underline-offset-2 hover:text-[#0b1b33]">
                  privacy policy
                </Link>
                .
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
