declare const __non_webpack_require__: ((id: string) => any) | undefined;

import site from "../../content/site.json";
import home from "../../content/home.json";
import services from "../../content/services.json";
import testimonials from "../../content/testimonials.json";
import projects from "../../content/projects.json";
import gallery from "../../content/gallery.json";
import about from "../../content/pages/about.json";
import faq from "../../content/pages/faq.json";
import privacy from "../../content/pages/privacy.json";
import contact from "../../content/pages/contact.json";
import kitchenRemodel from "../../content/pages/kitchen-remodel.json";
import portfolio from "../../content/pages/portfolio.json";
import countertops from "../../content/pages/countertops.json";
import cabinets from "../../content/pages/cabinets.json";
import flooring from "../../content/pages/flooring.json";
import bathroomVanities from "../../content/pages/bathroom-vanities.json";
import servicesOverview from "../../content/pages/services.json";

export type Service = (typeof services)[number];
export type Project = (typeof projects)[number];
export type Testimonial = (typeof testimonials)[number];
export type HomeContent = typeof home;
export type HeroSlide = (typeof home.hero.slides)[number];

export type CabinetSwatch = {
  id: string;
  label: string;
  alt?: string;
  order?: number;
  visible?: boolean;
  image: { src: string; alt: string; objectPosition?: string };
};

export type CabinetsPageContent = Omit<typeof cabinets, "options" | "storage"> & {
  storage: {
    headingLine1: string;
    headingLine2: string;
    body: string;
    image: { src: string; alt: string; objectPosition?: string } | null;
    missingAssetsNote?: string;
  };
  options: Omit<(typeof cabinets)["options"], "woods" | "finishes"> & {
    woods: CabinetSwatch[];
    finishes: CabinetSwatch[];
  };
};

export type ServicesOverviewPageContent = typeof servicesOverview;

// Content loader supporting dynamic synchronous live updates on server without rebuild
function getLiveContentSync<T>(moduleKey: string, fallback: T): T {
  if (typeof window !== "undefined") return fallback;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nodeReq = (globalThis as any).require;
    if (typeof nodeReq === "function") {
      const nodeFs = nodeReq("fs");
      const nodePath = nodeReq("path");
      const filePath = nodePath.join(process.cwd(), "content", `${moduleKey}.json`);
      if (nodeFs.existsSync(filePath)) {
        const raw = nodeFs.readFileSync(filePath, "utf8");
        return JSON.parse(raw) as T;
      }
    }
  } catch {
    // fallback
  }
  return fallback;
}

function createLiveProxy<T extends object>(moduleKey: string, fallback: T): T {
  const isArray = Array.isArray(fallback);
  return new Proxy(fallback, {
    get(target, prop, receiver) {
      const data = typeof window === "undefined" ? getLiveContentSync(moduleKey, fallback) : fallback;
      if (isArray && Array.isArray(data)) {
        if (prop === "length") return data.length;
        if (typeof prop === "string" && !isNaN(Number(prop))) return data[Number(prop)];
        if (prop === Symbol.iterator) return data[Symbol.iterator].bind(data);
        const val = Reflect.get(data, prop);
        if (typeof val === "function") return val.bind(data);
        return val;
      }
      return Reflect.get(data as object, prop);
    },
    has(target, prop) {
      const data = typeof window === "undefined" ? getLiveContentSync(moduleKey, fallback) : fallback;
      return prop in data;
    },
    ownKeys(target) {
      const data = typeof window === "undefined" ? getLiveContentSync(moduleKey, fallback) : fallback;
      return Reflect.ownKeys(data as object);
    },
    getOwnPropertyDescriptor(target, prop) {
      const data = typeof window === "undefined" ? getLiveContentSync(moduleKey, fallback) : fallback;
      return Reflect.getOwnPropertyDescriptor(data as object, prop);
    },
  });
}

function createDerivedArrayProxy<T>(getArr: () => T[]): T[] {
  return new Proxy([] as T[], {
    get(target, prop, receiver) {
      const arr = getArr();
      if (prop === "length") return arr.length;
      if (typeof prop === "string" && !isNaN(Number(prop))) return arr[Number(prop)];
      if (prop === Symbol.iterator) return arr[Symbol.iterator].bind(arr);
      const val = Reflect.get(arr, prop);
      if (typeof val === "function") return val.bind(arr);
      return val;
    },
    has(target, prop) {
      return prop in getArr();
    },
    ownKeys(target) {
      return Reflect.ownKeys(getArr());
    },
    getOwnPropertyDescriptor(target, prop) {
      return Reflect.getOwnPropertyDescriptor(getArr(), prop);
    },
  });
}

export const siteConfig = createLiveProxy("site", site);
export const homeContent = createLiveProxy("home", home);
export const allServices = createLiveProxy("services", services);
export const allTestimonials = createLiveProxy("testimonials", testimonials);
export const allProjects = createLiveProxy("projects", projects);
export const galleryContent = createLiveProxy("gallery", gallery);
export const aboutPage = createLiveProxy("pages/about", about);
export const faqPage = createLiveProxy("pages/faq", faq);
export const privacyPage = createLiveProxy("pages/privacy", privacy);
export const contactPage = createLiveProxy("pages/contact", contact);
export const kitchenRemodelPage = createLiveProxy("pages/kitchen-remodel", kitchenRemodel);
export const portfolioPage = createLiveProxy("pages/portfolio", portfolio);
export const countertopsPage = createLiveProxy("pages/countertops", countertops);
export const cabinetsPage = createLiveProxy("pages/cabinets", cabinets) as CabinetsPageContent;
export const flooringPage = createLiveProxy("pages/flooring", flooring);
export const bathroomVanitiesPage = createLiveProxy("pages/bathroom-vanities", bathroomVanities);
export const servicesOverviewPage = createLiveProxy("pages/services", servicesOverview);

export const publishedProjects = createDerivedArrayProxy(() => {
  return (allProjects as Project[])
    .filter((p) => p.published !== false)
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
});

export const primaryServices = createDerivedArrayProxy(() => {
  return (allServices as Service[]).filter((s) =>
    ["cabinets", "flooring", "countertops", "bathroom-vanities"].includes(s.id),
  );
});

export function getService(slug: string) {
  return (allServices as Service[]).find((s) => s.slug === slug);
}

export function getProject(slug: string) {
  return (allProjects as Project[]).find((p) => p.slug === slug);
}

export function getFlooringType(slug: string) {
  const flooringService = (allServices as Service[]).find((s) => s.id === "flooring");
  if (!flooringService || !("types" in flooringService) || !flooringService.types) return undefined;
  return flooringService.types.find((t) => t.slug === slug);
}

export const homepageTestimonials = createDerivedArrayProxy(() => {
  const ids = homeContent.testimonials?.ids || [];
  return ids
    .map((id: string) => (allTestimonials as Testimonial[]).find((t) => t.id === id))
    .filter((t: Testimonial | undefined): t is Testimonial => Boolean(t));
});

export const featuredProjects = createDerivedArrayProxy(() => {
  return (allProjects as Project[]).filter((p) => p.featuredOnHome).slice(0, 3);
});

export const serviceNavItems = siteConfig.navigation?.mainNav?.find((item) => item.href === "/services")?.children || [
  { href: "/cabinets", label: "Cabinets" },
  { href: "/flooring", label: "Flooring" },
  { href: "/countertops", label: "Countertops" },
  { href: "/bathroom-vanities", label: "Bathroom Vanities" },
];

export const mainNav = siteConfig.navigation?.mainNav || [
  { href: "/", label: "Home" },
  {
    href: "/services",
    label: "Services",
    children: serviceNavItems,
  },
  { href: "/kitchen-remodel", label: "Kitchen Remodel" },
  { href: "/gallery", label: "Gallery" },
  { href: "/our-work", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
];

export const footerExplore = siteConfig.navigation?.footerExplore || [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/our-work", label: "Portfolio" },
  { href: "/about", label: "About Us" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
  { href: "/contact#contact-form", label: "Request a Quote" },
];

export const quoteServiceOptions = [
  { value: "kitchen-remodel", label: "Kitchen Remodel" },
  { value: "cabinets", label: "Cabinets" },
  { value: "flooring", label: "Flooring" },
  { value: "countertops", label: "Countertops" },
  { value: "bathroom-vanities", label: "Bathroom Vanities" },
  { value: "other", label: "Other / Not sure" },
];
