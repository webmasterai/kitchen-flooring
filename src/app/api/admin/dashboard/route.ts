import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/cms-auth";
import { getAuditLogs } from "@/lib/cms-store";
import { listEnquiries } from "@/lib/enquiry-store";
import { listMediaAssets } from "@/lib/cms-media";
import { allServices, allProjects, galleryContent, allTestimonials } from "@/lib/content";
import { readdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAuth(["Owner", "Admin", "Editor"]);

    // Real counts
    const pagesDir = path.join(process.cwd(), "content", "pages");
    const pageFiles = existsSync(pagesDir) ? await readdir(pagesDir) : [];
    const totalPages = pageFiles.filter((f) => f.endsWith(".json")).length + 3; // + home, our-work, gallery

    const totalServices = allServices.length;
    const totalProjects = allProjects.length;
    const totalGalleryImages = galleryContent.images ? galleryContent.images.length : 0;

    const mediaList = await listMediaAssets();
    const totalMediaFiles = mediaList.length;

    const allEnquiries = await listEnquiries();
    const newEnquiries = allEnquiries.filter((e) => e.status === "New").length;
    const recentEnquiries = allEnquiries.slice(0, 5);

    const totalReviews = allTestimonials.length;
    const recentActivity = await getAuditLogs(8);

    return NextResponse.json({
      ok: true,
      stats: {
        totalPages,
        totalServices,
        totalProjects,
        totalGalleryImages,
        totalMediaFiles,
        newEnquiries,
        totalEnquiries: allEnquiries.length,
        totalReviews,
      },
      recentEnquiries,
      recentActivity,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    const status = msg === "UNAUTHORIZED" ? 401 : msg === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}
