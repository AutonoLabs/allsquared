import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { guides, getGuideBySlug } from "@/lib/guides";

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const guide = getGuideBySlug(params.slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.metaDescription,
  };
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const guide = getGuideBySlug(params.slug);
  if (!guide) notFound();

  return (
    <article>
      <h1 className="text-3xl font-bold text-ink">{guide.title}</h1>
      <p className="mt-4 text-lg text-ink/80">{guide.intro}</p>
      <div className="mt-6 space-y-4 text-ink/80">
        {guide.body.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
      <Link
        href="/checker"
        className="mt-8 inline-block rounded-md bg-accent px-6 py-3 font-medium text-white"
      >
        Check your notice free
      </Link>
    </article>
  );
}
