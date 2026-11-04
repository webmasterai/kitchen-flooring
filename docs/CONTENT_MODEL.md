# Content model

Static JSON under `content/` drives the site. `@/lib/content` imports and re-exports typed helpers.

## `site.json`

Global brand, contact, SEO defaults, logo paths, social links, and footer copy. Used by layout metadata, footer, CTAs, and contact blocks.

## `home.json`

Homepage-only editorial settings. Publish by editing this file and rebuilding (same static import flow as other content JSON).

| Field | Purpose |
| --- | --- |
| `hero` | Eyebrow, heading lines, body, CTA, and `slides[]` (`id`, `src`, `alt`, `objectPosition`) for the hero carousel |
| `benefitsBar.items[]` | Three value props under the hero (`title`, `body`, `icon`) |
| `services` | Section eyebrow, heading, intro |
| `showroom` | About/showroom heading + CTA (body/image still from `pages/about.json`) |
| `projects` | Project inspiration eyebrow, heading, intro, CTA |
| `valueBand` | Benefits band heading + three items |
| `testimonials` | Heading, CTA, and ordered `ids[]` referencing `testimonials.json` |
| `quote` | Quote section `headingLine1`, `headingLine2`, and body |

Helper: `homeContent`, `homepageTestimonials` (resolved from `testimonials.ids`).

## `services.json`

Array of service records. Common fields:

| Field | Purpose |
| --- | --- |
| `id`, `slug`, `name` | Stable keys and URL segment (`/${slug}`) |
| `shortDescription`, `summary`, `cardDescription` | Hero and card copy |
| `heroImage`, `cardImage` | Paths under `public/media/` |
| `sourceUrl` | Provenance from the legacy WordPress site |
| `pricingNote` | Quote-only disclaimer (no invented prices) |
| `features[]` | `{ title, body }` blocks (cabinets, countertops) |
| `sections[]` | `{ title, body }` blocks (kitchen remodel) |
| `intro`, `types[]` | Flooring overview and `/flooring/[type]` pages (`types`: `id`, `slug`, `name`, `description`, `image`) |

Helpers: `getService(slug)`, `getFlooringType(slug)`, `primaryServices`, `allServices`.

## `projects.json`

Portfolio sets for `/our-work` (Portfolio) and `/our-work/[slug]`.

| Field | Purpose |
| --- | --- |
| `slug` | URL segment |
| `title`, `category`, `description` | Source-backed copy (no fabricated specs) |
| `displayTitle`, `displayDescription` | Portfolio listing titles/blurbs |
| `filterId`, `categoryLabel` | Portfolio tab filter + row label |
| `collage` | Layout: `hero-two-detail`, `landscape-detail`, `single-left`, `single-right` |
| `published`, `order` | Visibility and sort for Portfolio listing |
| `coverImage`, `images[]` | Gallery paths |
| `featuredOnHome`, `homeLabel`, `homeBlurb` | Homepage subset |

Helpers: `getProject(slug)`, `allProjects`, `publishedProjects`, `featuredProjects`.

## `pages/portfolio.json`

Portfolio listing intro, filters, page size, empty message, browse-more label, and closing CTA.

## `gallery.json`

Drives `/gallery`.

| Field | Purpose |
| --- | --- |
| `hero` | Split-hero eyebrow, heading lines, body, and `image` (`src`, `alt`) |
| `filters[]` | Pill filter ids/labels (`all`, category ids) |
| `categories[]` | Section order, headings, descriptions (`id`, `label`, `heading`, `description`) |
| `images[]` | `id`, `src`, `alt`, `caption`, `category`, `visible`, optional `sourceUrl` |
| `cta` | Bottom strip heading, body, button label/href, optional `backgroundImage` |
| `note` | Inspiration vs inventory disclaimer |

## `testimonials.json`

Customer quotes with `id`, `name`, `quote`, `sourceUrl`, `ratingPublished`.

## `content/pages/*.json`

| File | Route | Notes |
| --- | --- | --- |
| `about.json` | `/about` | `body[]`, showroom images, headline |
| `contact.json` | `/contact` (`/contact-us` redirects here) | Hero, intro, kitchen image, form copy/labels/budget options, map, call strip |
| `kitchen-remodel.json` | `/kitchen-remodel` | Hero, benefits, storage, materials cards, process, story, inspiration, CTA |
| `countertops.json` | `/countertops` | Hero, benefits, materials (expandable), feature, swatches, gallery, process, CTA; `visibleSections` |
| `cabinets.json` | `/cabinets` | Split hero, benefits, style cards, storage, wood/finish options, process, inspiration gallery, CTA; `visibleSections` |
| `flooring.json` | `/flooring` | Full-bleed hero, benefits, option cards (+ detail panels), lifestyle, finish look samples, process, inspiration gallery, CTA; `visibleSections`; look labels are not SKUs |
| `bathroom-vanities.json` | `/bathroom-vanities` | Split hero, benefits, style cards, storage, finish/handle/basin options, gallery (+ View Gallery link), process, CTA; `visibleSections`; finish/hardware looks are not SKUs |
| `faq.json` | `/faq` | `items[]` with `question` / `answer` |
| `privacy.json` | `/privacy-policy` | `sections[]`, `effectiveDate`, `note` |

## Media

Image paths are relative to `public/` (e.g. `/media/services/...`). Do not reference assets that are not present in the repo.

## Future CMS

A headless CMS can mirror these shapes: one collection per file above, with slugs matching App Router segments. Keep `pricingNote` and portfolio disclaimers as editorial fields so published copy stays honest about source limitations.
