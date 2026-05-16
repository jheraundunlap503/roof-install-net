import type { MetadataRoute } from "next";
import { getAllStaticPaths } from "@/lib/content";
import { siteUrl, staticRoutes } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [...staticRoutes, ...getAllStaticPaths()];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7
  }));
}
