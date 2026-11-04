# Kitchen & Flooring Depot (redesign)

Next.js App Router rebuild matching the approved forest/ivory homepage design, with content imported from the public source site.

## Local development

```bash
cd web
npm ci
cp .env.example .env
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port Next prints if 3000 is already taken).

Production locally:

```bash
# Stop any previous Kitchen & Flooring Node server first.
# Rebuilding while a standalone server is still running can leave HTML
# pointing at deleted CSS chunks (unstyled page / giant default SVGs).
npm run build
set PORT=3001
npm run start
```

`npm run build` copies static assets into `.next/standalone` and verifies CSS chunk names match prerendered HTML. Always restart `npm run start` after a rebuild.

If another project is already on port 3000 (for example Pink Baby), start this app on a free port with `PORT=3001`.

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run import:content` | Re-download source media + write import manifest |
| `npm run typecheck` | TypeScript |
| `npm run lint` | ESLint |
| `npm run audit:deps` | Production dependency audit |

## Documentation

- `docs/IMPORT_REPORT.md` — source reconciliation
- `docs/CONTENT_MODEL.md` — CMS-ready content shape
- `docs/DEPLOYMENT.md` — Coolify / Docker / env checklist

Keep work local for review. Do not push, deploy, or alter the live WordPress site from this project.
