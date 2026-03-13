import { APP_LOGO, APP_TITLE } from "@/const";
import { Link } from "wouter";
import { Shield, Mail, Twitter, Linkedin, Github } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="container py-14 md:py-18">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-5 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 group">
              <img src={APP_LOGO} alt={APP_TITLE} className="h-8 w-auto transition-transform group-hover:scale-105" />
              <span className="font-heading font-bold text-lg tracking-tight">{APP_TITLE}</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Secure service contracts and escrow payments for the UK's freelance economy.
            </p>
            <div className="inline-flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-1.5 text-xs text-primary font-medium">
              <Shield className="h-3.5 w-3.5" />
              <span>FCA-Regulated Escrow</span>
            </div>
            <div className="flex items-center gap-1 pt-1">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-xl hover:bg-primary/5">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-xl hover:bg-primary/5">
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-xl hover:bg-primary/5">
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-heading mb-4 text-sm font-semibold uppercase tracking-wider text-foreground/40">Product</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-muted-foreground hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/freelancers" className="text-muted-foreground hover:text-primary transition-colors">
                  For Freelancers
                </Link>
              </li>
              <li>
                <Link href="/clients" className="text-muted-foreground hover:text-primary transition-colors">
                  For Clients
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-heading mb-4 text-sm font-semibold uppercase tracking-wider text-foreground/40">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/legal-services" className="text-muted-foreground hover:text-primary transition-colors">
                  Legal Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-heading mb-4 text-sm font-semibold uppercase tracking-wider text-foreground/40">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-border/60 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} {APP_TITLE}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/contact" className="hover:text-primary transition-colors flex items-center gap-1.5">
              <Mail className="h-4 w-4" />
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
