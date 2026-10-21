# Hazel The Dollmaker

The single maintained source for Hazel’s handmade wrestling collectibles site.

This repository combines the original `ShadowWalkerNC/hazel-the-dollmaker` project with the limited-drop site created on October 21, 2026. The existing GitHub repository remains canonical; the Sites Git remote is a deployment mirror, not a separate product.

## What is included

- Original Hazel logo, merchandise mockup artwork, and crochet icons.
- Limited collectible, bundle, and signature-edition previews.
- Collector signup, wrestler collaboration, and fan nomination forms backed by Cloudflare D1.
- Instagram showcase entry point, about section, and FAQs.
- Responsive layout, accessible forms, server validation, and consent recording.

The site is in **prelaunch** mode. Prices are planning figures. Orders, payments, inventory promises, shipping discounts, countdown promotions, and automated email are not enabled.

## Development

Use Node 22.13 or newer and pnpm.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm exec tsc --noEmit
pnpm build
```

`app/page.tsx` is the single storefront. `components/brand/` contains retained artwork components. `app/api/interest/route.ts` handles validated form submissions; `db/schema.ts` and `drizzle/` define persistent storage. `scripts/` contains the supported build/runtime helpers. Do not bring back the old Node JSON-file server or browser-local customer order records.

The server runtime requires the `DB` D1 binding. After building once, apply the migration to the local database before testing forms:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_goofy_kylun.sql
```

Hosted migrations are applied by the Sites publishing workflow. Hosted and local databases are separate.

## Deployment

The existing `.openai/hosting.json` points to the existing private Sites project. Do not create a second Site. Use the Sites source workflow to package and publish after GitHub changes are reviewed. GitHub pushes alone do not publish the Site automatically.

Live review URL: https://hazels-handmade-collectibles.shadowwalkernc.chatgpt.site

## Source consolidation

See [docs/MERGE_NOTES.md](docs/MERGE_NOTES.md) for retained features, retired code, and the Windows checkout update process. The original source remains available in Git history and on `backup/pre-collectibles-merge-2026-10-21`.
