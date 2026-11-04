# Deployment (Coolify) — Kitchen & Flooring Depot

## Tested runtime / dependencies

| Item | Version |
|------|---------|
| Node.js (Docker / `.nvmrc`) | **26.13.0** Active LTS |
| Node.js (local verify host) | **24.14.0** Maintenance LTS |
| Next.js | **16.4.3** |
| React / React DOM | **19.3.1** |
| TypeScript | **5.9.3** |
| Tailwind CSS | **4.3.3** |
| Zod | **4.6.7** |
| Nodemailer | **10.3.1** |
| sanitize-html | **2.18.1** |

Production start (standalone image): `node server.js`  
Local production: `npm run build && npm run start`

## Coolify notes

1. Build with the included `Dockerfile` (multi-stage, Node 26.13.0).
2. Do **not** bake secrets into the image. Set env vars in Coolify.
3. Mount a persistent volume at **`/data`** only (enquiries). Never mount over `/app`.
4. Set `ENQUIRY_DATA_DIR=/data/enquiries`.
5. Expose port `3000`. Terminate TLS at the proxy / Coolify HTTPS.
6. No destructive seed runs on startup.

## Environment variables

See `.env.example` for placeholders only.

## Manual / unverified external controls

Do **not** claim these are enabled without access and verification:

- [ ] HTTPS certificate + redirect
- [ ] Coolify management access restricted
- [ ] Origin protection / allowlist
- [ ] Cloudflare WAF rules
- [ ] Cloudflare rate limiting
- [ ] Backup job for `/data` and restore test

## Website-security skill

The project-requested `website-security` skill file was **not present** in the workspace at build time. Security controls implemented from the user brief and common practice include: server-side Zod validation, request size limits, honeypot, IP rate limiting, enquiry persistence before notify, separate save vs notification status, security headers + CSP, no-store on API, secrets via env, dependency audit for production deps (0 known prod vulns after Nodemailer 10.3.1). Apply the official skill content when supplied and re-check.
