# Deal Ledger — Black Friday 2026

[![make.fun · black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/supremexcell/black-friday-deal-finder-01/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/supremexcell/black-friday-deal-finder-01/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)

A real Black Friday deal finder: **51 deals, $7,003.60 of total savings, 35% average discount** — every price checked live at the linked store on 27 Nov 2026, and every deal links to its exact product page (v2).

## What it does

- **Search** deals by product, store or category ("airpods", "lego", "dyson"…)
- **Filter** by category chips, store and minimum discount (25%+ / 40%+ / 50%+)
- **Sort** by biggest discount, biggest dollar saving, lowest price, or deal score
- **Deal cards** with sale price, usual price, % off, dollars saved, a NEW LOW / STRONG DEAL / ROUTINE signal, the exact check time and source, plus a link to the store
- **Deal pages** with a 0–100 deal score and its breakdown, a plain-language verdict, the cited source, and "also at" prices when the same product is cheaper elsewhere
- **My list**: tick deals to see your running total savings in the header
- **Phone layout**: single column, horizontally scrolling filter chips

## How the deals were verified

Each deal was checked live on 27 Nov 2026 (09:40–09:48 UTC) at the linked store page or a cited deal source (Best Buy, Amazon, Walmart, Target, Home Depot, Nike, CNN Underscored, DealNews, Tom's Guide, 9to5Toys and others). Product names that sounded like future models (MacBook Neo, MacBook Pro M6, Apple Watch Series 12, AirPods Max 2, iPad mini A20 Pro OLED, Echo Show 11, Roomba Max 715, LG B6E, TCL S4CF, Hisense H5R1, Galaxy Watch 8, Galaxy Tab S10 FE, DJI Mini 3, GoPro HERO13) were each confirmed as real, shipping products before inclusion. In v2 the same day (11:38–11:58 UTC) every store-search link was replaced with the exact product page — 19 same-store links plus the Shark FlexStyle, which moved to SharkNinja's own product page (list $349.99) — and three prices were updated to the live price: Ninja CREAMi NC301 $169.95 → $199.00 (signal lowered to ROUTINE), LEGO Ferrari SF-24 $15 → $15.39, Dyson V15 Detect $599 → $598.50. The Monopoly Harry Potter Walmart link was resolved in a live browser session. No product link is guessed. The Nike Air Force 1 price ($64) is the in-cart price with code BFRIDAY.

## Run it

```sh
node serve.ts          # http://localhost:8080
```

No build step, no framework, no network requests from the page — the whole finder is static files in `app/`, with all 51 deals baked into `app/deals.js`.

## Build the submission

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` into the output directory and writes `dossier.json` via the vendored make.fun library.

## Layout

```
app/            the site (index.html, style.css, main.js, views.js, filters.js, score.js, format.js, deals.js)
screenshots/    4 screenshots of the running site (see shots.json)
vendor/         make.fun frontend library (vendored, unchanged)
main.ts         submission builder (Node 22 stdlib only)
serve.ts        tiny static dev server
shots.json      what each screenshot shows
```

## License

MIT — see [LICENSE](LICENSE).
