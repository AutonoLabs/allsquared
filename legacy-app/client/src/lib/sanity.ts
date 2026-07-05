import { createClient } from "@sanity/client";

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET || "production";
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || "2025-01-01";

export const sanityEnabled = Boolean(projectId && dataset);

export const sanityClient = createClient({
  projectId: projectId || "placeholder",
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

export type SanityPost = {
  _id: string;
  title: string;
  slug?: string;
  excerpt?: string;
  publishedAt?: string;
  category?: string;
  authorName?: string;
  mainImageUrl?: string;
};

export async function fetchBlogPosts(): Promise<SanityPost[]> {
  if (!sanityEnabled) return [];

  return sanityClient.fetch<SanityPost[]>(
    `*[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0...24] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      category,
      "authorName": author->name,
      "mainImageUrl": mainImage.asset->url
    }`
  );
}
