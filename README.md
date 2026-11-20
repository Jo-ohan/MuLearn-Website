# µLearn CHN — GTech µLearn, College of Engineering Chengannur

The official web portal for **µLearn CHN**, the campus chapter of GTech µLearn at the College of Engineering Chengannur (CEC), Kerala. This platform serves as the digital front door for students, mentors, and tech enthusiasts to discover peer-led learning circles, explore technical events, meet the campus team, and join the community.

**Live Website:** [https://mulearn-chn-two.vercel.app/](https://mulearn-chn-two.vercel.app/)  
**Repository:** [https://github.com/Jo-ohan/MuLearn-Website](https://github.com/Jo-ohan/MuLearn-Website)

---

## Table of Contents

- [About the Project](#about-the-project)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Setup](#installation--setup)
  - [Available Scripts](#available-scripts)
- [Content & Data Management](#content--data-management)
- [3D Environment & Animation Architecture](#3d-environment--animation-architecture)
- [Performance & Accessibility](#performance--accessibility)
- [Deployment](#deployment)
- [License](#license)

---

## About the Project

**µLearn CHN** is an open, student-led peer-learning community powered by GTech, operating at the College of Engineering Chengannur. The community is built around the ethos of *mutual learning* and *learning by doing*—empowering learners across all engineering disciplines and academic years to collaborate, build real-world projects, conduct student-led workshops, and share knowledge openly.

The website delivers:
- **Community Identity & Mission:** Clear communication of what the campus chapter stands for without corporate clutter or unverified claims.
- **Event Discovery:** Dynamic visibility into technical workshops, hackathons, and bootcamps with real-time status detection (ongoing vs. completed).
- **Peer Learning Circles:** Direct access and orientation for students wanting to join interest groups (AI & ML, Web Dev, Cyber Security, UI/UX, IoT).
- **Team Transparency:** A comprehensive roster of campus leads, coordinators, and interest group leads.
- **Low-Friction Onboarding:** Direct avenues to join the official Discord server and GTech µLearn platform.

---

## Key Features

### 1. Interactive 3D Hero Environment
- **React Three Fiber & Three.js Canvas:** A persistent 3D cosmic background featuring a central glowing celestial orb, an orbital ring, low-poly floating islands, faceted crystals, and an asteroid field.
- **Dynamic 3D Collision Avoidance:** Floater geometries use Euclidean distance bounding-sphere calculations and frame-rate-independent damping (`THREE.MathUtils.damp`) to glide past each other without clipping.
- **Mouse & Pointer Parallax:** Depth-layered parallax response reacting smoothly to desktop cursor position.
- **Pure-CSS Fallback:** If WebGL is unavailable or a context loss occurs, the site automatically switches to an animated pure-CSS fallback stand-in (`SceneFallback`), ensuring zero layout breaks.

### 2. "What We Offer" Horizontal Accordion
- **Dynamic Card Expansion:** Desktop accordion expanding active panels smoothly (`flex: 2.5 1 0`) while keeping collapsed panels visually compact and legible.
- **Zero-Clipping Typography:** Long titles (*"Skill development"*, *"Collaborative projects"*) wrap naturally onto multiple lines without truncation or text overflow.
- **Stationary Title Geometry:** Titles remain stationary during card hover and expansion transitions, avoiding distracting vertical rising or falling text shifts.
- **Responsive Mobile Stack:** Seamlessly adapts to a vertically stacked accordion on screens below 840px, preserving the interactive expansion mechanism.

### 3. Explore Learning Circles
- **Custom Collaborative Vector Art:** Scalable vector artwork portraying four student figures collaborating around a digital learning surface with laptops, holographic projections, and interest-group badges.
- **Clear Value Proposition:** Highlights peer-to-peer study circles and links directly to official onboarding.

### 4. Events Archive & Date Management
- **Automatic Status Evaluation:** Calendar date comparison logic (`getEventStatus`, `isEventOngoing`) automatically flags events as *upcoming*, *ongoing*, or *completed*.
- **Poster Aspect Ratio Preservation:** Event posters render in their natural aspect ratios with `object-fit: contain`, eliminating artificial letterboxing and empty space.
- **Interactive Multi-Filter Archive:** Filter events simultaneously by category (*Workshop*, *Hackathon*, *Talk*, *Meetup*, *Initiative*) and year.

### 5. Campus Team Directory
- **21 Verified Members:** Structured across 5 functional leadership groups:
  - *Leadership* (Lead Enabler, Campus Lead, Campus Co-Lead, Creative Lead)
  - *Core Team* (Operations Lead, Technical Lead, Media Lead, Content Lead)
  - *Operations & Design* (Operations Team, Designers)
  - *Content & Media* (Content Team, Media Team)
  - *Interest Group Leads* (AI, UI/UX, Cyber Security, Web, Entrepreneurship)
- **Profile Photo Containers:** Standardized circular profile frames with subtle cosmic borders, ready to render member photographs or display a themed placeholder.

### 6. Desktop Custom Cursor
- Dual-element pointer (precise tracking dot + elastic trailing ring) with magnetic attraction to interactive elements (`.magnetic`).
- Automatically disabled on touch screens and fine-pointer-lacking viewports (`useFinePointer`).

---

## Tech Stack

| Category | Technologies / Libraries | Version |
| :--- | :--- | :--- |
| **Core Framework** | React | `^19.3.1` |
| **DOM Renderer** | React DOM | `^19.3.1` |
| **Build Tool & Dev Server** | Vite | `^8.3.8` |
| **Language** | TypeScript | `^7.0.2` |
| **Routing** | React Router DOM | `^7.18.5` |
| **3D Rendering** | Three.js<br>React Three Fiber | `^0.187.0`<br>`^9.8.2` |
| **Animation** | GreenSock Animation Platform (GSAP) | `^3.15.1` |
| **Typography** | Fontsource Sora (`@fontsource/sora`)<br>Fontsource Inter (`@fontsource/inter`) | `^5.3.0`<br>`^5.3.0` |
| **Deployment** | Vercel SPA Hosting | — |

---

## Project Structure

```
mulearn-chn/
├── docs/
│   └── BUILD_STATUS.md            # Technical verification notes & build audit
├── public/
│   ├── events/                    # Event poster and banner images
│   └── favicon.svg                # µLearn brand SVG favicon
├── src/
│   ├── animation/
│   │   ├── gsap.ts                # GSAP instance & custom easing registration
│   │   ├── Reveal.tsx             # FadeIn, ScaleIn, and staggered scroll reveals
│   │   └── SplitText.tsx          # Word-level text splitting for kinetic reveals
│   ├── assets/
│   │   └── events/                # Bundled event media assets
│   ├── components/
│   │   ├── Button.tsx             # Standard, ghost, and pill buttons with hover glow
│   │   ├── Caps.tsx               # Uppercase wrapper preserving micro-glyph 'µ'
│   │   ├── Cursor.tsx             # Desktop custom magnetic cursor implementation
│   │   ├── EventCard.tsx          # Event card supporting poster & photo treatments
│   │   ├── Footer.tsx             # Global footer with verified social media icons
│   │   ├── Layout.tsx             # Main page frame (Nav, SceneHost, Cursor, Footer)
│   │   ├── Loader.tsx             # Split-door entrance loader with animated logo
│   │   ├── Logo.tsx               # µLearn CHN dual-tone typographic logo mark
│   │   ├── Nav.tsx                # Responsive navigation bar & mobile slide-out menu
│   │   ├── PageHero.tsx           # Reusable inner-route hero header
│   │   ├── PageTransition.tsx     # Animated route transition provider
│   │   ├── ProfileDialog.tsx      # Modal dialog for member profile inspection
│   │   ├── SceneHost.tsx          # Canvas mount manager, scroll visibility & WebGL fallback
│   │   ├── SectionHeader.tsx      # Consistent section eyebrow, title & lead lockup
│   │   └── TeamCard.tsx           # Member card with circular photo placeholder
│   ├── data/
│   │   ├── achievements.ts        # Historical milestones & community awards
│   │   ├── events.ts              # Single source of truth for events & date helpers
│   │   ├── memories.ts            # Photographic community memory grid data
│   │   ├── offerings.ts           # 5 core offerings for accordion & about overview
│   │   ├── site.ts                # Central URLs, institution info, socials, and contacts
│   │   ├── stats.ts               # Key metrics (learners, circles, karma, groups)
│   │   └── team.ts                # 21 members organized into 5 functional groups
│   ├── hooks/
│   │   ├── useDocumentTitle.ts    # Route-level document title management
│   │   └── useMedia.ts            # Media query hooks (pointer type, quality, reduced-motion)
│   ├── pages/
│   │   ├── About.tsx              # Focused community overview & mission
│   │   ├── Events.tsx             # Events archive with category/year filtering
│   │   ├── Home.tsx               # Landing page orchestrator (code-split sections)
│   │   ├── Join.tsx               # Value proposition & Discord onboarding avenues
│   │   ├── NotFound.tsx           # 404 error page with return navigation
│   │   └── Team.tsx               # Grouped directory of the 21 campus team members
│   ├── sections/
│   │   ├── Hero.tsx               # Homepage hero section with headline & CTA actions
│   │   └── home/
│   │       ├── FeaturedEvents.tsx # Highlighted event showcases
│   │       ├── FinalCTA.tsx       # Bottom call-to-action banner ("Be Part of µLearn")
│   │       ├── Highlights.tsx     # Numerical stats and campus milestones
│   │       ├── Intro.tsx          # Introductory statement & video/visual block
│   │       ├── LearningCircles.tsx# Explore Learning Circles with custom vector artwork
│   │       ├── Memories.tsx       # Campus photo gallery
│   │       ├── Offer.tsx          # "What We Offer" interactive accordion
│   │       └── TeamPreview.tsx    # Compact leadership preview grid
│   ├── state/
│   │   └── intro.ts               # Shared loader runtime, camera timeline, pointer state
│   ├── styles/
│   │   ├── components.css         # Button, Nav, Footer, Card, and Dialog styles
│   │   ├── cursor.css             # Magnetic cursor positioning and state transitions
│   │   ├── global.css             # Base reset, layout containers, and typography primitives
│   │   ├── loader.css             # Entrance curtain and split-door animation styles
│   │   ├── motion.css             # Text reveal masks, italic overhang clipping fixes
│   │   ├── pages.css              # Section-specific styles across all routes
│   │   ├── scene.css              # WebGL canvas container and CSS fallback styles
│   │   └── tokens.css             # CSS custom properties (colors, type scale, easing)
│   ├── three/
│   │   └── SceneCanvas.tsx        # React Three Fiber scene, floating islands & physics loop
│   ├── App.tsx                    # Route definitions and lazy-loaded page mapping
│   └── main.tsx                   # React root entry, font imports, scroll restoration
├── index.html                     # HTML5 shell with viewport-fit and theme color
├── package.json                   # Dependencies, build scripts, and engine specifications
├── tsconfig.json                  # TypeScript compiler configuration (strict mode)
├── vercel.json                    # Single-Page Application (SPA) route rewrite rules
└── vite.config.ts                 # Vite bundler options and chunk limit configuration
```

---

## Getting Started

### Prerequisites
- **Node.js:** `v18.0.0` or higher (tested up to Node.js v24)
- **Package Manager:** `npm` (included with Node.js)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Jo-ohan/MuLearn-Website.git
   cd MuLearn-Website
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Vite local development server with Hot Module Replacement (HMR). |
| `npm run build` | Runs TypeScript type checking (`tsc --noEmit`) and compiles assets into `dist/`. |
| `npm run preview` | Spins up a local web server to preview the production `dist/` output. |
| `npm run typecheck` | Validates TypeScript types across the entire project without emitting code. |

---

## Content & Data Management

All dynamic textual content, team directories, events, and links are decoupled from layout code and reside inside `src/data/`:

### 1. Site Configuration & Links (`src/data/site.ts`)
Controls general chapter metadata, campus details, and social links:
```typescript
export const SITE = {
  name: 'µLearn CHN',
  fullName: 'Gtech µLearn CHN',
  institution: 'College of Engineering Chengannur',
  tagline: 'Learn together. Build together.',
};

export const LINKS = {
  join: { label: 'Join µLearn', href: 'http://app.mulearn.org/register' },
  discord: { label: 'Discord', href: 'https://discord.com/invite/DfnDfBhGha' },
  instagram: { label: 'Instagram', href: 'https://www.instagram.com/mulearn.chn' },
  // ...
};
```
*Note: Any link left as an empty string (`''`) automatically renders as a "link pending" label in the UI to prevent broken outbound links.*

### 2. Events & Workshops (`src/data/events.ts`)
To publish a new event, append an entry to the `EVENTS` array:
```typescript
{
  id: 'event-slug',
  name: 'Event Title',
  date: '2026-10-15',        // Start date (YYYY-MM-DD)
  endDate: '2026-10-17',     // Optional multi-day end date
  category: 'Workshop',      // 'Workshop' | 'Hackathon' | 'Talk' | 'Meetup' | 'Initiative'
  description: 'Detailed description of the session...',
  image: eventBanner,        // ESM import from src/assets/events/ or path string
  mediaType: 'poster',       // 'poster' (aspect preserved) or 'photo' (cover crop)
}
```

### 3. Team Roster (`src/data/team.ts`)
Team members are categorized across the 5 designated groups (`leadership`, `core`, `operations-design`, `content-media`, `interest-groups`):
```typescript
{
  id: 'member-id',
  name: 'Full Name',
  designation: 'Campus Lead',
  group: 'leadership',
  image: '/team/photo.jpg',  // Optional. Empty defaults to circular placeholder
}
```

---

## 3D Environment & Animation Architecture

### 3D Scene Performance
- **Dynamic Frameloop:** The canvas runs `frameloop="always"` while visible, pauses to `frameloop="never"` when scrolled out of view, and switches to `frameloop="demand"` if `prefers-reduced-motion` is active.
- **Off-Critical-Path Loading:** The 3D bundle (`three` + `@react-three/fiber`) is segregated into an asynchronous chunk via `React.lazy`, keeping initial page load swift.
- **Shared Geometry Memory:** Rock and crystal meshes reuse buffer geometries and shared materials; vertex normal calculations and array allocations are executed once at mount.

### Animation Systems
- **GSAP & ScrollTrigger:** Drives smooth scroll progress and section fades (`src/animation/gsap.ts`).
- **Word Split Reveals (`src/animation/SplitText.tsx`):** Headings break into word and accent spans that animate upward smoothly. Overhang clipping on italic text (`.accent`) is prevented via calibrated negative margins and generous padding.

---

## Performance & Accessibility

- **Accessibility (a11y):**
  - Accordion panels and interactive tabs implement WAI-ARIA standards (`role="tablist"`, `role="tab"`, `aria-selected`, `aria-expanded`).
  - Semantic heading hierarchy (`h1` through `h4`) maintained across all routes.
  - Interactive buttons retain `:focus-visible` outline rings with contrasting offsets.
  - Informative SVG icons include appropriate `aria-hidden="true"` or accessible text labels.
- **Responsive Adaptability:**
  - Fluid typography powered by CSS `clamp()` tokens (`tokens.css`).
  - Tested across standard viewports: Desktop (1920×1080, 1440×900), Tablet Landscape (1024×768), Tablet Portrait (768×1024), and Mobile (390×844).
- **Reduced Motion:**
  - Respects user operating system settings (`prefers-reduced-motion: reduce`) by disabling camera intro sweeps, particle drift, magnetic cursor movement, and kinetic text splitting.

---

## Deployment

The project is hosted and continuously deployed on [Vercel](https://vercel.com).

### Vercel Configuration (`vercel.json`)
Since the application uses client-side routing via `react-router-dom`, `vercel.json` rewrites all incoming routes to `index.html`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Manual Deployment via Vercel CLI
```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy preview build
vercel

# Deploy to production
vercel --prod
```

**Production URL:** [https://mulearn-chn-two.vercel.app/](https://mulearn-chn-two.vercel.app/)

---

## License

This project is licensed under the **ISC License** as specified in `package.json`. No separate `LICENSE` file is currently present in the repository root.
