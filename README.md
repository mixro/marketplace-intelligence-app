# AMIP prototype (React + Vite)

Frontend-only prototype of the African Market Intelligence Platform. Tanzania pilot:
solar inverters, MPPT charge controllers and solar water pumps.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview  # serve the production build
```

## What is inside

- `src/data/`   researched records: `sources.js`, `catalog.js` (categories, attribute templates, products), `orgs.js`, `misc.js` (offers, problems)
- `src/lib/`    data builder, search (typo tolerant, EN + SW keywords), router, store, i18n
- `src/pages/`  Home, Search, Product, Org, Compare, Category, Problem, Admin, About
- Admin edits, added products and suggestions persist in the browser (localStorage) only.

## Data rules

- Every claim = value + status + source ids (+ note). Missing values stay missing ("Not available").
- Statuses: submitted, source_checked, confirmed (2+ sources agree), needs_review (conflict/outdated).
- Tanzanian supplier links are brand-level (directory listings), not proof of model stock.
- Prices are reference listings from other markets. No Tanzanian prices are recorded.
- Sources were read as page extracts on 2026-10-15 and still need full datasheet review.

## Moving to a real backend

All reads go through `src/lib/data.js` (`buildData`). Replace it with API calls (e.g. Django + PostgreSQL)
and keep the screens unchanged.
