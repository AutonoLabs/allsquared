import type { Metadata } from "next";
import Link from "next/link";
import { guides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Has Your Payer Served a Valid Pay Less Notice?",
  description:
    "Free checker for UK construction subcontractors: find out if your main contractor's pay less notice was valid, and what you're owed if it wasn't.",
};

export default function HomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-ink">
        Has your payer served a valid pay less notice?
      </h1>
      <p className="mt-4 text-lg text-ink/80">
        If they haven&apos;t — or served it late — the full amount you applied for is
        likely payable, and we can get it. Check your dates for free below.
      </p>
      <Link
        href="/checker"
        className="mt-6 inline-block rounded-md bg-accent px-6 py-3 font-medium text-white"
      >
        Check your notice free
      </Link>

      <section className="mt-16">
        <h2 className="text-xl font-semibold text-ink">More on payment recovery</h2>
        <ul className="mt-4 space-y-2">
          {guides.map((guide) => (
            <li key={guide.slug}>
              <Link href={`/guides/${guide.slug}`} className="text-accent underline">
                {guide.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
