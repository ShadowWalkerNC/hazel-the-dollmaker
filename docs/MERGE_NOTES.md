# Hazel source consolidation — October 21, 2026

Canonical repository: https://github.com/ShadowWalkerNC/hazel-the-dollmaker

Original baseline: `3432838dc8c2ca0c16156eca2b8aa71e8ea1344e`.
Original source preserved on `backup/pre-collectibles-merge-2026-10-21`.
Initial collectibles site baseline: `6250861b3885d110c93bd9fec7636f2d0a71ff76`.

## Merge decisions

| Original project | Unified site |
| --- | --- |
| Hazel logo | Retained as public/hazel-logo.jpg and used in header, about, footer, and mockups |
| Apparel, sticker and other merchandise artwork | Retained in components/brand/MerchMockup.tsx; tee, hoodie, and sticker previews rendered |
| Crochet vector icons | Retained in components/brand/CrochetIcons.tsx; yarn icon rendered |
| Doll/Instagram gallery | Instagram profile linked; approved image/caption gallery can be populated later |
| Seeded doll stories, likes, product reviews, stock | Original data preserved as explicitly unverified review files under docs/review, not rendered as facts |
| Original Vite App, duplicate landing page | Consolidated into one app/page.tsx and one Vinext build |
| Cart and checkout UI | Retired from active application: no connected payment processor or confirmed inventory |
| Public order/inventory APIs and JSON-file server | Removed from active source; no customer-order endpoint or public inventory writes |
| Collector club, collaboration requests, nominations | Retained with D1 persistence from the limited-drop build |
| Brand identity | Uses existing Hazel The Dollmaker name and artwork, not a separate collectibles company |

The old checkout and admin were not a completed secure commerce service: product writes and all customer orders could be accessed without authentication, orders were accepted from client-supplied totals, and customer data was mirrored to browser storage. Those endpoints must not be deployed. Implement authenticated administration, server-calculated orders, and a real payment service before reopening sales.

Old gallery data includes placeholder image URLs, placeholder post IDs, unverified reactions/quotes, and synthetic counts. Review it with Hazel; do not present it as verified history or licensing approval. Merchandise mockups are design concepts rather than supplier specifications.

## Windows checkout

The cloud editor cannot access `C:\Users\white\Desktop\The Doll Marker (HAZEL)` or verify its uncommitted files. That folder has **not** been deleted or modified by this merge.

Use `scripts/Update-Hazel.ps1` after obtaining this commit. The script checks the remote, refuses a dirty checkout, verifies the backup branch exists on GitHub, records the old HEAD locally, and fast-forwards the existing folder. It does not delete customer files, the folder, or untracked changes.

If the checkout has uncommitted work, commit or separately back it up and inspect it against the merged version before updating. Files in the Windows checkout may contain work that was never pushed to GitHub. Do not remove that folder until those files are accounted for.

## One product, one maintained source

Use the existing GitHub repository for future source work. The Sites remote stores the same deployed source for hosting. It is not an additional app or separate business. Obsolete application entrypoints are removed from the active branch and remain recoverable from Git history.
