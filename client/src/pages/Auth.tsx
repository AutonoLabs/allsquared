import { AllSquaredWordmark } from "@/components/marketing/AllSquaredWordmark";
import { Button } from "@/components/ui/button";
import { hasClerkPublishableKey, SignIn, SignUp } from "@/lib/clerk";
import { Link } from "wouter";
import { ClerkLoading, ClerkLoaded } from "@clerk/react";
import { Spinner } from "@/components/ui/spinner";

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
              {isSignUp ? "Sign up" : "Sign in"}
            </p>
            <h1 className="as25-font-display max-w-xl text-5xl font-normal leading-[0.95] tracking-[-0.04em] text-[#0b1b33] md:text-6xl">
              {isSignUp ? "Create your AllSquared account." : "Welcome back to AllSquared."}
            </h1>
            <p className="max-w-lg text-lg leading-8 text-[#2d466f]">
              Use your account to access contracts, escrow, evidence, and signature tools in one workspace.
            </p>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-[#2d466f]">
              {isSignUp ? "Already have an account?" : "New to AllSquared?"}{" "}
              <Link
                href={isSignUp ? `/sign-in?redirect=${encodeURIComponent(redirectPath)}` : `/sign-up?redirect=${encodeURIComponent(redirectPath)}`}
                className="font-semibold text-[#1f6b3f] underline-offset-4 hover:underline"
              >
                {isSignUp ? "Sign in" : "Create an account"}
              </Link>
            </p>
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
          <ClerkLoading>
            <div className="flex items-center justify-center py-12">
              <Spinner className="h-8 w-8 text-[#1f6b3f]" />
            </div>
          </ClerkLoading>
          <ClerkLoaded>
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
                fallbackRedirectUrl={redirectPath}
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "w-full shadow-none border-0 bg-transparent",
                    socialButtonsBlockButton__github: { display: "none" },
                    socialButtonsIconButton__github: { display: "none" },
                  },
                }}
              />
            ) : (
              <SignIn
                routing="hash"
                signUpUrl={`/sign-up?redirect=${encodeURIComponent(redirectPath)}`}
                fallbackRedirectUrl={redirectPath}
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "w-full shadow-none border-0 bg-transparent",
                    socialButtonsBlockButton__github: { display: "none" },
                    socialButtonsIconButton__github: { display: "none" },
                  },
                }}
              />
            )}
          </ClerkLoaded>
        </div>
      </div>
    </section>
  );
}
