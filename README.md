<div align="center">

<img src=".github/banner.png" alt="Pflanzengilde.de" width="600" />

# Pflanzengilde

**An evidence-based planner for permaculture plant guilds.**

Pick a tree, add companions by what they do, and get a metric planting plan that flags bad combinations.

[**pflanzengilde.de**](https://pflanzengilde.de) · [Guides](https://pflanzengilde.de/guides) · [Garden Planner](https://pflanzengilde.de/garten) · [Report a bug](../../issues)

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![Languages](https://img.shields.io/badge/i18n-DE%20%7C%20EN-16a34a)
![Tracking](https://img.shields.io/badge/cookies%20%26%20tracking-none-16a34a)

</div>

---

## Table of contents

- [About](#about)
- [Features](#features)
- [Getting started](#getting-started)
- [Available scripts](#available-scripts)
- [Project structure](#project-structure)
- [How it works](#how-it-works)
- [Privacy by design](#privacy-by-design)
- [Contributing](#contributing)
- [License](#license)

## About

A plant guild is a group of plants arranged around a central tree, where each plant has a job: fixing nitrogen, drawing up nutrients, attracting pollinators, repelling pests, or suppressing grass. Advice on guilds is spread across scientific papers, forums, and videos, and a lot of it contradicts itself.

Pflanzengilde puts that knowledge in one place. Each companion recommendation comes with an evidence tier and sources, so you can see whether a claim rests on field trials or on folklore. The app runs entirely in the browser, works in German and English, and uses metric units throughout.

## Features

### Guild planner
- **28 star trees and shrubs.** Fruit and nut trees, nitrogen-fixing trees, and tea (*Camellia sinensis* var. *sinensis* and *assamica*), each with its own pest profile and site needs.
- **96 companion species** grouped into **9 ecological roles**: nitrogen fixer, dynamic accumulator, pollinator attractor, pest repeller, living mulch, grass barrier, and more.
- **Radial zone plan.** Companions are placed automatically into zones (collar, bulb ring, mid taproots, drip line, outer buffer), and the harvest path is kept clear.
- **Role coverage and seasonal gaps.** Shows which roles your guild still lacks and when nothing is flowering.

### Evidence and conflict checks
- **Antagonism detection.** Flags allelopathy (e.g. walnut juglone), alliums next to legumes, shared diseases and alternate hosts (e.g. rust fungi), and spacing conflicts.
- **Key-pest defenses.** Maps each tree's main pests to companions that help against them, with evidence tiers and climate-zone awareness.
- **Site conditions.** Climate zone and soil type change the recommendations.

### Garden planner (`/garten`)
- Metric canvas for laying out **several guilds** in one garden, with cluster layout, shade-pocket detection, and cross-guild conflict checks.

### Export and sharing
- **PDF planting plans** generated in the browser.
- **Calendar export** (RFC 5545 `.ics`) for planting, pruning, and harvest tasks.
- **Share links and embeds.** The whole guild or garden is encoded in the URL, so nothing is stored on a server.

### Guides (`/guides`)
- Long-form reference articles on the 9 plant roles, guild design, chop-and-drop, allelopathy, key pests and biological defense, shade-tolerant star plants, and two tea-growing guides, all with citations.

## Getting started

**Prerequisites:** Node.js 18 or newer, and npm.

```bash
git clone https://github.com/leks2205/pflanzengilde.git
cd pflanzengilde
npm ci
npm run dev
```

The dev server runs at <http://localhost:3000>.

To build a production bundle:

```bash
npm run build     # type-check, bundle to dist/, write static route pages
npm run preview   # serve the production build locally
```

The build output in `dist/` is fully static and can be served by any web server. `scripts/postbuild.ts` copies `index.html` to each route (`/guides/`, `/garten/`, …), so direct links work on a stock nginx without rewrite rules. See [`nginx.conf`](nginx.conf) for a reference config.

### Running your own instance

Files that depend on who runs the site are not part of the repository and are gitignored:

- **Legal pages.** Put an `Impressum.tsx` and/or `Datenschutz.tsx` into `src/legal/`, each exporting a component of the same name. The app picks them up at build time and enables the `/impressum` and `/datenschutz` routes and footer links. Without them, those routes and links are simply left out. If you host the site publicly in Germany or the EU, you will likely need both.
- **`public/robots.txt` and `public/sitemap.xml`** for your domain.
- **Deployment scripts** for your own server.

## Available scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start the Vite dev server with hot reload |
| `npm run build` | Type-check, build for production, and generate static route pages |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run the test suites (pests, conflicts, garden optimizer, calendar, PDF, share links) |
| `npm run generate-og` | Regenerate per-tree Open Graph preview images in `public/og/` |

## Project structure

```
├── public/
│   ├── images/plants/     # Self-hosted, optimized WebP plant photos
│   ├── images/soils/      # Soil type images
│   └── og/                # Social preview images per star tree
├── scripts/               # Build steps, test suites, and asset tooling
└── src/
    ├── components/        # React UI (planner, garden canvas, guides, modals)
    ├── core/              # Domain logic, independent of the UI
    │   ├── antagonistEngine.ts      # Allelopathy and incompatibility checks
    │   ├── pestCompanionEngine.ts   # Key-pest → companion defense rules
    │   ├── placementRules.ts        # Zone-based automatic placement
    │   ├── roleCoverageEngine.ts    # Ecological role coverage
    │   ├── seasonalGapEngine.ts     # Bloom and forage gaps across the year
    │   ├── spacingEngine.ts         # Spacing and crowding warnings
    │   ├── gardenOptimizer.ts       # Multi-guild garden layout
    │   ├── pdfExporter.ts           # Client-side PDF generation
    │   └── calendarExporter.ts      # iCalendar (.ics) export
    ├── data/              # Star trees, companion plants, climate regions
    ├── i18n/              # German and English dictionaries (kept key-symmetric)
    └── types/             # Shared TypeScript types
```

## How it works

Plant data lives in plain TypeScript modules ([`src/data/starTrees.ts`](src/data/starTrees.ts) and [`src/data/guildPlants.ts`](src/data/guildPlants.ts)). The engines in [`src/core/`](src/core/) are pure functions over that data, so they can be tested from the command line without a browser, which is what the suites in `scripts/test_*.ts` do.

A few rules hold across the codebase:

- **Metric only.** All distances, heights, and radii are in metres and centimetres.
- **Bilingual parity.** Every user-facing string exists in both [`de.ts`](src/i18n/de.ts) and [`en.ts`](src/i18n/en.ts). Data fields use `{ de, en }` objects.
- **Claims need sources.** Companion effects and pest defenses carry an evidence tier and citations. Weakly supported claims are labelled as such rather than dropped silently.

## Privacy by design

Pflanzengilde sets no cookies, runs no analytics, and makes no third-party requests on page load. Fonts and images are self-hosted. Planner state is kept in `localStorage` on your device, and shared plans travel inside the URL. Please keep it that way in contributions: anything that loads external resources or adds a storage key has to be disclosed in the privacy policy of every instance running the site, so call it out clearly in your pull request.

## Contributing

Contributions are welcome, especially from people with field experience in permaculture, agroforestry, or plant ecology.

- **Found a bug or a wrong plant fact?** [Open an issue](../../issues). For plant data, please include a source (paper, extension service publication, or similar).
- **Missing a plant or pest rule?** You don't need to write code for it: [open an issue](../../issues/new/choose) with the plant or pest, what it does in a guild, and a source if you have one.
- **Want to add it yourself?** Add it to the relevant file in `src/data/` or `src/core/pestCompanionEngine.ts`, include German and English text, and run `npm test` before opening a pull request.
- **Code changes:** keep the domain logic in `src/core/` free of React so it stays testable, and make sure `npm run build` passes.

## License

**Code** is licensed under the [GNU Affero General Public License v3.0](LICENSE). You can use, modify and self-host it; if you run a modified version as a public website, you have to publish your source code under the same license.

**Guide texts and plant data** (the guide articles in `src/i18n/`, and the plant and research data in `src/data/` and `src/core/`) may also be used under [Creative Commons Attribution-ShareAlike 4.0](LICENSE-CONTENT). Please credit Pflanzengilde with a link to [pflanzengilde.de](https://pflanzengilde.de).

**Plant photographs and soil textures** (`public/images/`, and the tree photos composited into `public/og/`) are sourced from [Wikimedia Commons](https://commons.wikimedia.org/), were cropped, resized and converted to WebP, and remain under their respective licenses (mostly CC BY-SA, CC BY, CC0 or public domain). Author, license and source of every image are listed on the [photo credits page](https://pflanzengilde.de/credits) and in [`src/data/imageCredits.ts`](src/data/imageCredits.ts), which is generated by `npx tsx scripts/fetch_image_credits.ts`.

The name "Pflanzengilde" is not covered by these licenses. If you run a public fork, please give it a different name.
