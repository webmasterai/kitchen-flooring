import { Breadcrumbs } from "@/components/page/Breadcrumbs";
import { ButtonLink } from "@/components/ui/ButtonLink";

export default function NotFound() {
  return (
    <>
      <section className="bg-forest-deep py-20 text-white lg:py-28">
        <div className="container-wide">
          <p className="mb-3 text-xs font-semibold tracking-[0.16em] text-[#cfe0d5] uppercase">404</p>
          <h1 className="heading-display text-4xl sm:text-5xl">Page not found</h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-white/90">
            The page you requested is not available. Try our services, portfolio, or contact pages
            instead.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/" className="bg-white text-forest hover:bg-ivory">
              Back to Home →
            </ButtonLink>
            <ButtonLink
              href="/contact"
              variant="secondary"
              className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              Contact Us
            </ButtonLink>
          </div>
        </div>
      </section>
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Not found" }]} />
    </>
  );
}
