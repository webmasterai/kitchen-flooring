import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/content";

function siteBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url;
}

export default function robots(): MetadataRoute.Robots {
  const base = siteBaseUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${base.replace(/\/$/, "")}/sitemap.xml`,
  };
}
