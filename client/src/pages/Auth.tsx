import { AllSquaredWordmark } from "@/components/marketing/AllSquaredWordmark";
import { Button } from "@/components/ui/button";
import { hasClerkPublishableKey, SignIn, SignUp } from "@/lib/clerk";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

type AuthPageProps = {
  mode: "sign-in" | "sign-up";
};

function getRedirectPath() {
  const params = new URLSearchParams(window.location.search);
  const redirect = params.get("redirect");
  if (!redirect || !redirect.startsWith("/")) return "/dashboard";
  return redirect;
}

export default function AuthPage({ mode }: AuthPageProps) {
  const redirectPath = getRedirectPath();
  const isSignUp = mode === "sign-up";

  return (
    <section className="as25-hero-bg min-h-[calc(100vh-76px)] bg-[#fafaf7] px-5 py-12 md:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="space-y-8">
          <AllSquaredWordmark />
          <div className="space-y-5">
            <p className="as25-font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#1f6b3f]">
              {isSignUp ? "Create account" : "Welcome back"}
            </p>
            <h1 className="as25-font-display max-w-xl text-5xl font-normal leading-[0.95] tracking-[-0.04em] text-[#0b1b33] md:text-6xl">
              {isSignUp ? "Draft your first contract in a protected workspace." : "Sign in to continue your contracts."}
            </h1>
            <p className="max-w-lg text-lg leading-8 text-[#2d466f]">
              AllSquared uses Clerk for authentication. After auth, you will land in the app with contract drafting, escrow, evidence, and signature tools in one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button className="rounded-[8px] bg-[#1f6b3f] px-5 text-white hover:bg-[#2a8554]" asChild>
              <Link href={isSignUp ? "/sign-in" : `/sign-up?redirect=${encodeURIComponent(redirectPath)}`}>
                {isSignUp ? "Already have an account" : "Create an account"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              className="rounded-[8px] border-[#c7d0e0] bg-[#fafaf7] text-[#0b1b33] hover:bg-white"
              asChild
            >
              <Link href="/">Back to website</Link>
            </Button>
          </div>
        </div>

        <div className="rounded-[24px] border border-[#c7d0e0] bg-white p-4 shadow-[0_18px_60px_rgba(11,27,51,0.12)] md:p-6">
          {!hasClerkPublishableKey ? (
            <div className="space-y-4 p-4 text-[#0b1b33]">
              <p className="as25-font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#b45309]">
                Auth configuration missing
              </p>
              <h2 className="as25-font-display text-3xl font-normal tracking-[-0.04em]">
                Clerk is not configured for this environment.
              </h2>
              <p className="text-sm leading-6 text-[#2d466f]">
                Set `VITE_CLERK_PUBLISHABLE_KEY` before testing sign-up or sign-in. The app now shows this state instead of hanging on a blank screen.
              </p>
            </div>
          ) : isSignUp ? (
            <SignUp
              routing="hash"
              signInUrl="/sign-in"
              afterSignUpUrl={redirectPath}
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "w-full shadow-none border-0 bg-transparent",
                },
              }}
            />
          ) : (
            <SignIn
              routing="hash"
              signUpUrl={`/sign-up?redirect=${encodeURIComponent(redirectPath)}`}
              afterSignInUrl={redirectPath}
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "w-full shadow-none border-0 bg-transparent",
                },
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
}
