# La Reiné — website (localhost build)

Next.js 16 (App Router, TypeScript). Built from the `web-*` skill pipeline on 2026-10-14. Runs locally only; nothing is deployed and the live WordPress store is never written to.

## Run

```bash
npm install
npm run dev          # http://localhost:3000
```

Production preview:

```bash
npm run build && npm run start -- -p 3100
```

The preview pane can also start it from `../.claude/launch.json` ("la-reine-site").

## How data works

- **Gel prices and stock** are read (read-only, cached 5 minutes) from the live WooCommerce Store API for product IDs 640 and 648. If the store is unreachable, local prices are used.
- **Mists and sets** are not in WooCommerce yet. They live in `src/content/products.ts` with `source: "local"`.
- **All copy** (product stories, ritual, chooser, founder's note, journal, FAQ) lives in `src/content/`. A Markdown export for review is in `../06-voice/copy/` (`npx tsx qa/export-copy.ts`).
- **Policies** are imported from the old site (`src/content/policies.json`). Its unfilled template placeholders are shown highlighted as "to be confirmed".

## Checkout

Mock mode. The payment step is labelled "Test mode"; `/api/orders` re-validates prices against the catalogue and saves orders to `.data/orders.json`. Newsletter and contact forms save to `.data/` too. To move to real payments, follow `~/.claude/skills/web-architecture/references/stacks.md` (Razorpay Orders API + signature check + WooCommerce REST order creation). Keys go in `.env.local`, never in the repo.

## Settings

`src/content/site.ts → settings`: announcement line, free-shipping threshold (null hides the progress bar), delivery window, WhatsApp number, Instagram.

## QA

```bash
node qa/shoot-scroll.mjs ../11-qa/urls.txt ../11-qa/screens     # scroll-first full-page screenshots
node qa/a11y.mjs http://localhost:3100 ../11-qa/urls.txt          # axe scan + console errors + overflow
bash ~/.claude/skills/web-qa/scripts/lighthouse.sh http://localhost:3100 ../11-qa/lighthouse /
```

## Placeholders still in the site

See `../CLIENT-TODO.md`.
