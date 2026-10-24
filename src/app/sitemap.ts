import type { MetadataRoute } from "next";
import { publicRoutes } from "@/lib/routes";
import { abs } from "@/lib/schema";

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes().map((r) => ({
    url: abs(r.path),
    lastModified: new Date(`${r.updated}T00:00:00+09:00`),
    priority: r.priority,
  }));
}
