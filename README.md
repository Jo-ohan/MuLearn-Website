# Gtech µLearn CHN — Website

Original, from-scratch website for Gtech µLearn CHN (College of Engineering Chengannur).
React 19 · Vite · TypeScript · custom CSS · React Three Fiber · GSAP + ScrollTrigger · Sora & Inter via Fontsource.

## Run
```bash
npm install
npm run dev        # local dev server
npm run build      # type-check + production build -> dist/
npm run preview    # serve the production build
```

## Deploy (Vercel)
Import the repo; framework preset **Vite**, build command `npm run build`, output `dist`.
`vercel.json` rewrites all routes to `index.html` so deep links (/about, /events, /team, /join) work.

## Structure
```
src/
  animation/   GSAP setup, SplitText (word reveals), Reveal helpers
  components/  Nav, Footer, Button, Cursor, Loader, PageTransition, cards…
  sections/    Hero and home-page sections
  pages/       Home, About, Events, Team, Join, NotFound
  three/       3D scene (lazy-loaded)
  data/        ALL content — site links, events, team, stats, memories, achievements
  styles/      tokens + component/page CSS
public/        static assets
docs/          BUILD_STATUS.md
```

## Content: placeholders
No community facts were invented. Anything unverified is clearly marked as a placeholder in the UI
and lives in `src/data/`. See `docs/BUILD_STATUS.md` for the list of what to fill in
(official links, events + photos, team + portraits, verified stats, memories, logo).
Empty link strings render as "link pending" rather than a dead link.

## Accessibility & performance
Respects `prefers-reduced-motion`; custom cursor is disabled on touch; the site works without WebGL
(CSS fallback scene); the 3D bundle and non-critical sections are lazy-loaded.
