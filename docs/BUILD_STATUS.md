# µLearn CHN redesign — build status (2026-11-18)

Stack: React 19 + Vite + TypeScript, React Three Fiber, GSAP/ScrollTrigger, Fontsource Sora/Inter. `npm run build` passes.

Done: loader, 3D hero, 5 routes (/, /about, /events, /team, /join), SplitText word animation system, custom cursor, horizontal-expand buttons, no-WebGL fallback, reduced-motion, vercel.json SPA rewrite.
Verified in browser: no horizontal overflow (desktop + mobile), no console errors, no text stuck hidden, mobile menu works.
Fixed: µ→M under CSS uppercase (Caps helper), stray space before punctuation after accent words, hero CTA fit at 800px height.

## Placeholders awaiting REAL data (nothing invented)
- src/data/site.ts: join link, Discord, Instagram, LinkedIn, GitHub, YouTube, contact email
- src/data/events.ts: real events + photos (currently 5 flagged placeholders)
- src/data/team.ts: real members + photos in public/team/
- src/data/stats.ts: verified numbers (null = shown as placeholder)
- src/data/memories.ts: real photos in public/memories/
- src/data/achievements.ts: verified achievements
- Official logo (currently an original wordmark/mark)
