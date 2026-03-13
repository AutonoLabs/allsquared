import { Button } from "@/components/ui/button";
import { APP_LOGO, APP_TITLE } from "@/const";
import { Menu, X, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import NotificationCenter from "./NotificationCenter";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = [
    { name: "How It Works", href: "/how-it-works" },
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-xl shadow-[0_1px_0_0_var(--border)] border-b border-border"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <img src={APP_LOGO} alt={APP_TITLE} className="h-9 w-auto transition-transform group-hover:scale-105" />
          <span className="font-heading font-bold text-lg tracking-tight hidden sm:inline">{APP_TITLE}</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-0.5">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                location === item.href
                  ? "text-primary bg-primary/8"
                  : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex md:items-center md:gap-3">
          <NotificationCenter />
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
            <Link href="/dashboard">Sign In</Link>
          </Button>
          <Button size="sm" className="btn-state-layer shadow-sm shadow-primary/20 bg-primary hover:bg-primary/90" asChild>
            <Link href="/dashboard">
              Get Started
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden p-2 rounded-xl hover:bg-primary/5 transition-colors"
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

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur-xl">
          <div className="container space-y-1 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 text-base font-medium rounded-xl transition-colors ${
                  location === item.href
                    ? "bg-primary/8 text-primary"
                    : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
                <ArrowRight className="h-4 w-4 opacity-40" />
              </Link>
            ))}
            <div className="pt-4 space-y-2 border-t mt-2">
              <Button variant="outline" className="w-full rounded-xl" asChild>
                <Link href="/dashboard">Sign In</Link>
              </Button>
              <Button className="w-full rounded-xl btn-state-layer shadow-sm shadow-primary/20" asChild>
                <Link href="/dashboard">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
