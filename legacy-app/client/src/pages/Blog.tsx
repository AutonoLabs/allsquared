import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, CalendarDays, Newspaper } from "lucide-react";
import { fetchBlogPosts, sanityEnabled, type SanityPost } from "@/lib/sanity";

const fallbackPosts: SanityPost[] = [
  {
    _id: "fallback-1",
    title: "How AllSquared keeps freelance work moving",
    slug: "how-allsquared-keeps-freelance-work-moving",
    excerpt: "Contracts, escrow, signatures, and dispute resolution in one neutral workflow for clients and freelancers.",
    category: "Product",
  },
  {
    _id: "fallback-2",
    title: "A practical model for low-value service disputes",
    slug: "practical-model-low-value-service-disputes",
    excerpt: "Why fast evidence exchange and settlement options beat expensive legal escalation for most service disagreements.",
    category: "Disputes",
  },
];

function formatDate(value?: string) {
  if (!value) return "AllSquared";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

export default function Blog() {
  const [posts, setPosts] = useState<SanityPost[]>(fallbackPosts);
  const [loading, setLoading] = useState(sanityEnabled);

  useEffect(() => {
    let cancelled = false;
    if (!sanityEnabled) return;

    fetchBlogPosts()
      .then((items) => {
        if (!cancelled && items.length > 0) setPosts(items);
      })
      .catch((error) => {
        console.warn("[Sanity] Failed to load blog posts", error);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="bg-[#fafaf7] text-[#0b1b33]">
      <section className="border-b border-[#e2e0d6] px-5 py-20 md:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="as25-font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#1f6b3f]">AllSquared blog</p>
          <div className="mt-5 max-w-3xl space-y-5">
            <h1 className="as25-font-display text-5xl font-normal leading-[0.95] tracking-[-0.04em] md:text-7xl">
              Practical notes on contracts, escrow, and dispute resolution.
            </h1>
            <p className="text-lg leading-8 text-[#2d466f]">
              Powered by Sanity CMS when configured, with sensible fallback content so the public page never breaks.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          {loading ? (
            <div className="col-span-full rounded-[18px] border border-[#e2e0d6] bg-white p-8 text-[#2d466f]">Loading posts…</div>
          ) : (
            posts.map((post) => (
              <article key={post._id} className="group rounded-[18px] border border-[#e2e0d6] bg-white p-7 transition hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(11,27,51,0.10)]">
                {post.mainImageUrl ? (
                  <img src={post.mainImageUrl} alt="" className="mb-6 h-52 w-full rounded-[14px] object-cover" />
                ) : (
                  <div className="mb-6 flex h-52 w-full items-center justify-center rounded-[14px] bg-[#f0efe8] text-[#1f6b3f]">
                    <Newspaper className="h-10 w-10" />
                  </div>
                )}
                <div className="mb-4 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#61708a]">
                  <span>{post.category || "Insight"}</span>
                  <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> {formatDate(post.publishedAt)}</span>
                </div>
                <h2 className="as25-font-display text-3xl font-normal tracking-[-0.035em]">{post.title}</h2>
                <p className="mt-3 leading-7 text-[#2d466f]">{post.excerpt || "Read the latest AllSquared update."}</p>
                <Link href={post.slug ? `/blog/${post.slug}` : "/contact"} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#1f6b3f]">
                  Read more <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </Link>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
