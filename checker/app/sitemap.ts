import type { MetadataRoute } from "next";
import { guides } from "@/lib/guides";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://allsquared-checker.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL, lastModified: new Date() },
    { url: `${BASE_URL}/checker`, lastModified: new Date() },
    ...guides.map((guide) => ({
      url: `${BASE_URL}/guides/${guide.slug}`,
      lastModified: new Date(),
    })),
  ];
}
