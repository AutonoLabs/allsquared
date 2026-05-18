import { AllSquaredWordmark } from "@/components/marketing/AllSquaredWordmark";
import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#c7d0e0] bg-[#f2f1eb] text-[#2d466f]">
      <div className="mx-auto w-full max-w-[1240px] px-5 py-16 md:px-8 md:py-20 lg:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="space-y-5">
            <AllSquaredWordmark />
            <p className="max-w-[320px] text-sm leading-6 text-[#2d466f]">
              One platform for the contract, the escrow, the verified payments, and the dispute safety
              net. UK based with a global team, built for serious professionals moving serious money.
            </p>
          </div>

          <div>
            <h3 className="as25-font-mono mb-5 text-[10.5px] uppercase tracking-[0.2em] text-[#1f6b3f]">
              Platform
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/how-it-works" className="transition-colors hover:text-[#0b1b33]">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/features" className="transition-colors hover:text-[#0b1b33]">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/legal-services" className="transition-colors hover:text-[#0b1b33]">
                  Legal Services
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="transition-colors hover:text-[#0b1b33]">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="transition-colors hover:text-[#0b1b33]">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="as25-font-mono mb-5 text-[10.5px] uppercase tracking-[0.2em] text-[#1f6b3f]">
              Built For
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/freelancers" className="transition-colors hover:text-[#0b1b33]">
                  Commercial trades & fit-out
                </Link>
              </li>
              <li>
                <Link href="/freelancers" className="transition-colors hover:text-[#0b1b33]">
                  Agencies & studios
                </Link>
              </li>
              <li>
                <Link href="/freelancers" className="transition-colors hover:text-[#0b1b33]">
                  Events & productions
                </Link>
              </li>
              <li>
                <Link href="/freelancers" className="transition-colors hover:text-[#0b1b33]">
                  Main contractors
                </Link>
              </li>
              <li>
                <Link href="/clients" className="transition-colors hover:text-[#0b1b33]">
                  Clients commissioning work
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="as25-font-mono mb-5 text-[10.5px] uppercase tracking-[0.2em] text-[#1f6b3f]">
              Company
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="transition-colors hover:text-[#0b1b33]">
                  About
                </Link>
              </li>
              <li>
                <Link href="/legal-services" className="transition-colors hover:text-[#0b1b33]">
                  Regulatory & compliance
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-[#0b1b33]">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition-colors hover:text-[#0b1b33]">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="transition-colors hover:text-[#0b1b33]">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-[#c7d0e0] pt-8">
          <div className="as25-font-mono flex flex-col gap-3 text-[11px] uppercase tracking-[0.1em] text-[#6b7e9e] md:flex-row md:items-center md:justify-between">
            <p>© AllSquared Ltd · {currentYear} · London</p>
            <div className="flex gap-6">
              <Link href="/terms" className="hover:text-[#0b1b33]">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-[#0b1b33]">
                Privacy
              </Link>
              <Link href="/cookies" className="hover:text-[#0b1b33]">
                Cookies
              </Link>
            </div>
          </div>
          <p className="max-w-[920px] text-xs leading-6 text-[#6b7e9e]">
            Statistics cited: Federation of Small Businesses late-payment research, 2023–2024
            (52% B2B late payment; c.50,000 SMEs closing annually); FSB &amp; Xero Small Business
            Index, 2024 (c.£22,000 average owed in overdue invoices); QuickBooks UK SME late-payment
            research, 2023 (56 million hours lost annually). AllSquared is a trading name of
            AllSquared Ltd, registered in England &amp; Wales. Escrow services are provided by
            Transpact, an FCA-authorised payment institution, under client-money rules. AllSquared
            is not a law firm; when you book a legal service we connect you with independent
            SRA-regulated solicitors who advise directly under their own professional terms.
          </p>
        </div>
      </div>
    </footer>
  );
}
