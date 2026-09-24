import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteOrigin();
  return [
    { url: `${origin}/`, lastModified: new Date() },
    { url: `${origin}/privacy`, lastModified: new Date() },
  ];
}
