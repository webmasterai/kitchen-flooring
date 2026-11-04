# Source content import report

Source: https://website.kitchenflooringdepot.com/

## Pages discovered (WordPress sitemap)

10 public pages, including:

- `/` home
- `/services/`
- `/cabinets/`
- `/flooring/`
- `/countertops/`
- `/bathroom-vanities/`
- `/kitchen-remodel/`
- `/gallery/`
- `/portfolio/` (redirected in app to `/our-work`)
- `/contact-us/`

Also discovered via redirects: `/contact` → `/contact-us`.

Missing on source (404): `/about/`, `/about-us/`, `/faq/`, `/privacy-policy/`, `/hardwood/`, `/laminate/`, `/vinyl/`, `/tile/` as standalone URLs. Flooring **types** exist as sections on `/flooring/` and are modeled as `/flooring/[type]` here.

## Products / catalog

**No ecommerce product catalog, SKUs, stock counts, or prices** were published on the source site. Countertop/vanity/gallery imagery is showcase photography, not inventoriable products.

Imported as content collections instead:

| Collection | Count | Notes |
|------------|------:|-------|
| Services | 5 | Cabinets, Flooring (+3 types), Countertops, Bathroom Vanities, Kitchen Remodel |
| Portfolio project sets | 8 | Grouped from source portfolio filenames/alt labels (Jeff, Flora, Ali, H/J/G/L/M series) |
| Gallery images | 49 | Showcase photos; not named retail SKUs |
| Testimonials | 5 | Exact source wording (homepage shows 3 of 5) |
| Media files downloaded | 247 succeeded / 0 failed | See `content/import/RECONCILIATION.md` |

## Gaps

- Exact daily open/close hours not published (only “7 Days a Week”).
- No privacy/FAQ pages on source — FAQ/privacy written from verified facts + this app’s data handling.
- About page synthesized from home + kitchen-remodel + services copy (no dedicated about URL).
- Elementor thumbnails retained when full-size originals were unavailable.
- `showroom/` folder initially empty; populated with curated service photos for the about/showroom section.
- Reference screenshot resolution was low (394×1024); homepage hero uses a generated matching kitchen photo plus source photography elsewhere.

## Manifest

- `content/import/manifest.json`
- `content/import/pages-discovered.json`
- `content/import/RECONCILIATION.md`
