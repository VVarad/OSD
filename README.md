# Open Source Day 2026 · WLUG

Halloween-themed landing page for **Open Source Day 2026** by the Walchand Linux Users' Group (WLUG), Walchand College of Engineering, Sangli. Sunday, 25 October 2026.

> Community | Knowledge | Share

## Repository layout

```
osd-2k26/
├── frontend/                 Static site (Vite + plain HTML/CSS/JS)
│   ├── index.html            All page content, one <section> per "stop"
│   ├── public/               Files served as-is (images, favicon, share image)
│   │   └── assets/images/    WebP artwork
│   └── src/
│       ├── config/event.js   Event date, register link, social links
│       ├── styles/           tokens → base → animations → components → sections/
│       └── scripts/          One module per feature (countdown, faq, sessions, fog…)
└── .github/                  CI workflow and PR template
```

## Getting started

Requirements: **Node 20+** (22 recommended, see `frontend/.nvmrc`).

```bash
cd frontend
npm install        # first time only; commit the generated package-lock.json
npm run dev        # http://localhost:5173 with live reload
```

| Command                | What it does                                  |
| ---------------------- | --------------------------------------------- |
| `npm run dev`          | Local dev server                              |
| `npm run build`        | Production build into `frontend/dist`         |
| `npm run preview`      | Serve the production build locally            |
| `npm run lint`         | ESLint                                        |
| `npm run format`       | Format everything with Prettier               |
| `npm run format:check` | Check formatting (CI runs this)               |

## Where to change things

| I want to change…                           | Edit                                       |
| ------------------------------------------- | ------------------------------------------ |
| Countdown time, register link, social links | `frontend/src/config/event.js`             |
| Any text on the page                        | `frontend/index.html`                      |
| Colours, fonts, spacing                     | `frontend/src/styles/tokens.css`           |
| Styling of one section                      | `frontend/src/styles/sections/<name>.css`  |
| Behaviour of one feature                    | `frontend/src/scripts/<feature>.js`        |

If the event date changes, update **both** `startsAt` in `event.js` and the dates written in `index.html` (hero, register section, meta description).

## Performance rules (please keep these)

Smoothness is the top priority for this site.

- **Images:** WebP only, exported at about 2× their on-screen size, always with `width` and `height` attributes. Everything below the hero uses `loading="lazy"`.
- **Animation:** animate only `transform`, `translate`, `rotate`, `scale` and `opacity`. Never animate `width`, `top`, `margin`, etc.
- **Looping animations** pause automatically when their section is off-screen (`scripts/motion.js`). Add new looping classes to the list in `styles/animations.css`.
- **The WebGL fog** (`scripts/fog/`) is skipped for reduced-motion users and low-power devices, pauses when the hero is off-screen or the tab is hidden, renders at reduced resolution, and turns itself off if the frame rate drops.
- **Fonts** are self-hosted through `@fontsource` (no Google Fonts request).
- Run Lighthouse (mobile) before merging visual changes. Target: performance ≥ 90.

## Accessibility

Native `<details>` for the FAQ, real `<button>`s with `aria-expanded` for the curriculum houses, a skip link, visible focus styles, and `prefers-reduced-motion` support. Keep it that way.

## Deployment (Vercel).

Import the repository in Vercel and set **Root Directory** to `frontend`. Vercel detects Vite automatically (build: `npm run build`, output: `dist`).

## Secrets

This repo is public. **Never commit** API keys or `.env` files, not even temporarily: git history is permanent and readable by anyone. Secrets live in environment variables.
