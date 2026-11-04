import type { MetadataRoute } from "next";
import { allProjects, getService, siteConfig } from "@/lib/content";

function siteBaseUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url).replace(/\/$/, "");
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteBaseUrl();
  const now = new Date();

  const staticPaths = [
    "",
    "/services",
    "/cabinets",
    "/flooring",
    "/countertops",
    "/bathroom-vanities",
    "/kitchen-remodel",
    "/our-work",
    "/gallery",
    "/about",
    "/contact",
    "/request-quote",
    "/faq",
    "/privacy-policy",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  const flooring = getService("flooring");
  const flooringTypes =
    flooring && "types" in flooring && flooring.types
      ? flooring.types.map((type) => ({
          url: `${base}/flooring/${type.slug}`,
          lastModified: now,
          changeFrequency: "monthly" as const,
          priority: 0.6,
        }))
      : [];

  const projectEntries = allProjects.map((project) => ({
    url: `${base}/our-work/${project.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...flooringTypes, ...projectEntries];
}
