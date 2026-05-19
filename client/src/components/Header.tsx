import { AllSquaredWordmark } from "@/components/marketing/AllSquaredWordmark";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useUser } from "@clerk/react";
import { hasClerkPublishableKey, UserButton } from "@/lib/clerk";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const reduceMotion = useReducedMotion();
  const clerkUser = hasClerkPublishableKey ? useUser() : { isSignedIn: false };
  const { isSignedIn } = clerkUser;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = [
    { name: "How it works", href: "/how-it-works" },
    { name: "Features", href: "/features" },
    { name: "Legal services", href: "/legal-services" },
    { name: "Pricing", href: "/pricing" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-[#c7d0e0] bg-[#fafaf7]/92 shadow-[0_1px_0_rgba(199,208,224,1)] backdrop-blur-xl"
          : "border-b border-[#c7d0e0] bg-[#fafaf7]/92 backdrop-blur-xl"
      }`}
    >
      <nav className="mx-auto flex h-[76px] w-full max-w-[1240px] items-center justify-between gap-6 px-5 md:px-8 lg:px-10">
        <AllSquaredWordmark />

        <div className="hidden md:flex md:items-center md:gap-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="as25-nav-link as25-font-body text-[14px] font-medium text-[#2d466f] transition-colors hover:text-[#0b1b33]"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex md:items-center md:gap-3">
          {isSignedIn ? (
            <>
              <Button
                size="sm"
                className="rounded-[8px] bg-[#1f6b3f] px-5 py-5 text-white shadow-none hover:bg-[#2a8554]"
                asChild
              >
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <UserButton
                appearance={{
                  elements: {
                    userButtonPopoverCard: { boxShadow: 'none' },
                    userButtonPopoverActionButton: 'text-[#0b1b33]',
                    userButtonPopoverActionButtonText: 'text-[#0b1b33]',
                  },
                }}
              />
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-[8px] border border-[#c7d0e0] bg-transparent px-5 py-5 text-[#0b1b33] hover:border-[#0b1b33] hover:bg-[rgba(11,27,51,0.03)]"
                asChild
              >
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button
                size="sm"
                className="rounded-[8px] bg-[#1f6b3f] px-5 py-5 text-white shadow-none hover:bg-[#2a8554]"
                asChild
              >
                <Link href="/sign-up">
                  Get started
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-[8px] p-2 text-[#0b1b33] transition-colors hover:bg-[rgba(11,27,51,0.03)] md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="sr-only">Toggle menu</span>
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </nav>

      <AnimatePresence initial={false}>
        {mobileMenuOpen && (
          <motion.div
            initial={reduceMotion ? false : { height: 0, opacity: 0, y: -8 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden border-t border-[#c7d0e0] bg-[#fafaf7]/95 backdrop-blur-xl md:hidden"
          >
          <div className="space-y-1 px-5 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center justify-between rounded-[10px] px-3 py-3 text-base font-medium text-[#0b1b33] transition-colors hover:bg-[rgba(11,27,51,0.03)]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
                <ArrowRight className="h-4 w-4 opacity-40" />
              </Link>
            ))}
            <div className="mt-2 space-y-2 border-t border-[#c7d0e0] pt-4">
              {isSignedIn ? (
                <Button className="w-full rounded-[8px] bg-[#1f6b3f] text-white hover:bg-[#2a8554]" asChild>
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    Dashboard
                  </Link>
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="w-full rounded-[8px] border-[#c7d0e0] bg-transparent text-[#0b1b33]"
                    asChild
                  >
                    <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>Sign in</Link>
                  </Button>
                  <Button className="w-full rounded-[8px] bg-[#1f6b3f] text-white hover:bg-[#2a8554]" asChild>
                    <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                      Get started
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
