import { FadeIn } from '../../animation/Reveal';
import { SplitText } from '../../animation/SplitText';
import { Button } from '../../components/Button';

/**
 * Custom scalable vector illustration representing collaborative learning circles:
 * Diverse learners gathered around a shared technological circle, collaborating on laptops,
 * exchanging ideas with floating interest-group badges and the glowing µLearn core.
 */
const LearningCircleIllustration = () => (
  <svg
    viewBox="0 0 600 500"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="learning-circles__svg"
    role="img"
    aria-label="Illustration of learners collaborating in a circle with laptops and shared ideas"
  >
    <defs>
      {/* Background ambient radial glow */}
      <radialGradient id="lc-glow-bg" cx="50%" cy="54%" r="48%">
        <stop offset="0%" stopColor="#7a3df0" stopOpacity="0.32" />
        <stop offset="55%" stopColor="#3b1c7a" stopOpacity="0.12" />
        <stop offset="100%" stopColor="#0b0614" stopOpacity="0" />
      </radialGradient>

      {/* Central table glow */}
      <radialGradient id="lc-table-glow" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stopColor="#9a63ff" stopOpacity="0.4" />
        <stop offset="60%" stopColor="#2a1458" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#140b28" stopOpacity="0.95" />
      </radialGradient>

      {/* Hologram beam */}
      <linearGradient id="lc-beam" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#b8f55a" stopOpacity="0.6" />
        <stop offset="50%" stopColor="#7a3df0" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#5a2bc2" stopOpacity="0" />
      </linearGradient>

      {/* Screen gradient */}
      <linearGradient id="lc-screen" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7a3df0" />
        <stop offset="100%" stopColor="#3b1c7a" />
      </linearGradient>

      {/* Screen 2 gradient */}
      <linearGradient id="lc-screen-lime" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#b8f55a" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#5a2bc2" stopOpacity="0.9" />
      </linearGradient>

      {/* Card gradient */}
      <linearGradient id="lc-card-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2a1650" stopOpacity="0.88" />
        <stop offset="100%" stopColor="#150a2c" stopOpacity="0.92" />
      </linearGradient>

      {/* Filter for subtle neon glow */}
      <filter id="lc-neon-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* Ambient background glow */}
    <ellipse cx="300" cy="270" rx="270" ry="190" fill="url(#lc-glow-bg)" />

    {/* Outer orbital rings (connecting the learning circle nodes) */}
    <ellipse cx="300" cy="280" rx="240" ry="120" stroke="#7a3df0" strokeOpacity="0.22" strokeWidth="1.5" strokeDasharray="4 8" />
    <ellipse cx="300" cy="280" rx="200" ry="95" stroke="#b79cff" strokeOpacity="0.18" strokeWidth="1.2" />

    {/* Central collaboration surface / table */}
    <ellipse cx="300" cy="285" rx="155" ry="72" fill="url(#lc-table-glow)" stroke="#7a3df0" strokeOpacity="0.45" strokeWidth="1.8" />
    <ellipse cx="300" cy="285" rx="125" ry="54" stroke="#b8f55a" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="6 6" />

    {/* Central Hologram Core (µ emblem and beam) */}
    <ellipse cx="300" cy="280" rx="42" ry="18" fill="#7a3df0" fillOpacity="0.4" filter="url(#lc-neon-glow)" />
    <path d="M 280 280 L 295 185 L 305 185 L 320 280 Z" fill="url(#lc-beam)" opacity="0.4" />

    {/* Floating µ Hologram Icon in Center */}
    <g transform="translate(300, 195)" filter="url(#lc-neon-glow)">
      <circle cx="0" cy="0" r="26" fill="#1a0e35" stroke="#b8f55a" strokeWidth="1.8" />
      <circle cx="0" cy="0" r="32" fill="none" stroke="#7a3df0" strokeWidth="1" strokeDasharray="3 4" opacity="0.7" />
      {/* µ lettermark */}
      <path
        d="M -9 -7 L -9 3 C -9 8 -5 11 0 11 C 5 11 9 8 9 3 L 9 -7 M 9 3 L 9 12"
        fill="none"
        stroke="#b8f55a"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>

    {/* Data transmission / constellation lines from learners to core */}
    <line x1="165" y1="285" x2="275" y2="280" stroke="#b8f55a" strokeOpacity="0.4" strokeWidth="1.2" strokeDasharray="3 4" />
    <line x1="435" y1="285" x2="325" y2="280" stroke="#b8f55a" strokeOpacity="0.4" strokeWidth="1.2" strokeDasharray="3 4" />
    <line x1="225" y1="210" x2="280" y2="250" stroke="#b79cff" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="2 4" />
    <line x1="375" y1="210" x2="320" y2="250" stroke="#b79cff" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="2 4" />

    {/* ============================================================== */}
    {/* LEARNER 1 (Left Back - Researcher / Learner)                   */}
    {/* ============================================================== */}
    <g transform="translate(210, 150)">
      {/* Body / Torso */}
      <path d="M 12 75 C 12 55 24 45 42 45 C 60 45 72 55 72 75 Z" fill="#2d1754" stroke="#7a3df0" strokeWidth="1.2" />
      {/* Neck */}
      <rect x="37" y="36" width="10" height="12" rx="3" fill="#e8cfa8" />
      {/* Head */}
      <circle cx="42" cy="24" r="16" fill="#fadab2" />
      {/* Hair */}
      <path d="M 26 24 C 26 12 33 8 42 8 C 52 8 58 13 58 24 C 54 20 48 22 42 20 C 35 22 28 20 26 24 Z" fill="#4a2278" />
      {/* Laptop on table */}
      <g transform="translate(25, 68)">
        <polygon points="0,22 40,22 46,28 -6,28" fill="#1e1038" stroke="#7a3df0" strokeWidth="1" />
        <polygon points="4,4 36,4 40,22 0,22" fill="url(#lc-screen)" stroke="#b79cff" strokeWidth="1" />
        <line x1="8" y1="9" x2="24" y2="9" stroke="#b8f55a" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        <line x1="8" y1="14" x2="30" y2="14" stroke="#ece4ff" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
      </g>
    </g>

    {/* ============================================================== */}
    {/* LEARNER 2 (Right Back - Developer / Problem Solver)            */}
    {/* ============================================================== */}
    <g transform="translate(325, 150)">
      {/* Body / Torso */}
      <path d="M 12 75 C 12 55 24 45 42 45 C 60 45 72 55 72 75 Z" fill="#1b2a4a" stroke="#4a6ca8" strokeWidth="1.2" />
      {/* Neck */}
      <rect x="37" y="36" width="10" height="12" rx="3" fill="#d2a378" />
      {/* Head */}
      <circle cx="42" cy="24" r="16" fill="#dfb388" />
      {/* Hair & glasses */}
      <path d="M 25 22 C 25 10 32 6 42 6 C 52 6 59 10 59 22 C 55 16 48 18 42 16 C 36 18 29 16 25 22 Z" fill="#160e29" />
      {/* Glasses */}
      <circle cx="37" cy="25" r="4.5" fill="none" stroke="#b8f55a" strokeWidth="1.2" />
      <circle cx="47" cy="25" r="4.5" fill="none" stroke="#b8f55a" strokeWidth="1.2" />
      <line x1="41.5" y1="25" x2="42.5" y2="25" stroke="#b8f55a" strokeWidth="1.2" />
      {/* Laptop on table */}
      <g transform="translate(18, 68)">
        <polygon points="0,22 40,22 46,28 -6,28" fill="#151b32" stroke="#3b4c7a" strokeWidth="1" />
        <polygon points="4,4 36,4 40,22 0,22" fill="url(#lc-screen-lime)" stroke="#b8f55a" strokeWidth="1" />
        <line x1="8" y1="9" x2="28" y2="9" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
        <line x1="8" y1="14" x2="22" y2="14" stroke="#d4c4ff" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
      </g>
    </g>

    {/* ============================================================== */}
    {/* LEARNER 3 (Front Left - Collaborative Discussion Lead)         */}
    {/* ============================================================== */}
    <g transform="translate(115, 230)">
      {/* Body / Torso */}
      <path d="M 10 100 C 10 70 28 58 52 58 C 76 58 94 70 94 100 Z" fill="#3b1c7a" stroke="#9a63ff" strokeWidth="1.5" />
      {/* Neck */}
      <rect x="46" y="46" width="12" height="15" rx="4" fill="#fadab2" />
      {/* Head */}
      <circle cx="52" cy="30" r="20" fill="#fedec0" />
      {/* Hair (curly / modern cut) */}
      <path d="M 32 30 C 30 14 40 8 52 8 C 64 8 74 14 72 30 C 67 22 59 24 52 22 C 44 24 36 22 32 30 Z" fill="#1b1030" />
      {/* Raised arm gesturing toward table */}
      <path d="M 78 72 C 90 70 102 68 114 62" stroke="#fedec0" strokeWidth="8" strokeLinecap="round" />
      {/* Tablet / Open notebook */}
      <g transform="translate(68, 76) rotate(-8)">
        <rect x="0" y="0" width="36" height="24" rx="3" fill="#1a1030" stroke="#b79cff" strokeWidth="1.2" />
        <line x1="6" y1="7" x2="24" y2="7" stroke="#b8f55a" strokeWidth="1.5" />
        <line x1="6" y1="13" x2="30" y2="13" stroke="#ece4ff" strokeWidth="1.2" />
      </g>
    </g>

    {/* ============================================================== */}
    {/* LEARNER 4 (Front Right - Builder / Creative Designer)          */}
    {/* ============================================================== */}
    <g transform="translate(390, 230)">
      {/* Body / Torso */}
      <path d="M 10 100 C 10 70 28 58 52 58 C 76 58 94 70 94 100 Z" fill="#1a1035" stroke="#7a3df0" strokeWidth="1.5" />
      {/* Neck */}
      <rect x="46" y="46" width="12" height="15" rx="4" fill="#e0b892" />
      {/* Head */}
      <circle cx="52" cy="30" r="20" fill="#ebbfa0" />
      {/* Hair (flowing side sweep) */}
      <path d="M 32 28 C 30 12 40 8 52 8 C 65 8 74 14 74 34 C 65 38 60 26 50 26 C 40 26 35 34 32 28 Z" fill="#582a8a" />
      {/* Left arm typing on laptop */}
      <path d="M 26 72 C 16 70 6 74 -4 78" stroke="#ebbfa0" strokeWidth="8" strokeLinecap="round" />
      {/* Laptop facing right */}
      <g transform="translate(-15, 68)">
        <polygon points="0,26 44,26 50,34 -6,34" fill="#241442" stroke="#7a3df0" strokeWidth="1.2" />
        <polygon points="6,6 40,6 44,26 0,26" fill="url(#lc-screen)" stroke="#b8f55a" strokeWidth="1.2" />
        <line x1="12" y1="12" x2="32" y2="12" stroke="#b8f55a" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="12" y1="18" x2="26" y2="18" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
      </g>
    </g>

    {/* ============================================================== */}
    {/* FLOATING INTEREST GROUP TOPIC CARDS                            */}
    {/* ============================================================== */}
    {/* 1. AI & Machine Learning (Top Left) */}
    <g transform="translate(50, 95)" filter="url(#lc-neon-glow)">
      <rect x="0" y="0" width="130" height="42" rx="10" fill="url(#lc-card-bg)" stroke="#7a3df0" strokeWidth="1.4" />
      {/* Chip icon */}
      <rect x="12" y="13" width="16" height="16" rx="3" fill="#3b1c7a" stroke="#b8f55a" strokeWidth="1.2" />
      <circle cx="20" cy="21" r="3" fill="#b8f55a" />
      {/* Label */}
      <text x="36" y="26" fill="#f6f2ff" fontSize="12" fontFamily="Sora, sans-serif" fontWeight="600">
        AI & ML
      </text>
    </g>

    {/* 2. Web & Mobile Development (Top Right) */}
    <g transform="translate(420, 85)" filter="url(#lc-neon-glow)">
      <rect x="0" y="0" width="140" height="42" rx="10" fill="url(#lc-card-bg)" stroke="#b79cff" strokeWidth="1.4" />
      {/* Code icon */}
      <circle cx="21" cy="21" r="10" fill="#3b1c7a" />
      <path d="M 17 18 L 14 21 L 17 24 M 25 18 L 28 21 L 25 24" stroke="#b8f55a" strokeWidth="1.4" strokeLinecap="round" />
      {/* Label */}
      <text x="39" y="26" fill="#f6f2ff" fontSize="12" fontFamily="Sora, sans-serif" fontWeight="600">
        Web Dev
      </text>
    </g>

    {/* 3. UI/UX Design (Middle Right) */}
    <g transform="translate(445, 360)" filter="url(#lc-neon-glow)">
      <rect x="0" y="0" width="130" height="42" rx="10" fill="url(#lc-card-bg)" stroke="#7a3df0" strokeWidth="1.4" />
      {/* Palette / Design icon */}
      <circle cx="21" cy="21" r="10" fill="#2d1754" />
      <circle cx="18" cy="18" r="2" fill="#b8f55a" />
      <circle cx="24" cy="19" r="2" fill="#d4c4ff" />
      <circle cx="20" cy="24" r="2" fill="#9a63ff" />
      {/* Label */}
      <text x="38" y="26" fill="#f6f2ff" fontSize="12" fontFamily="Sora, sans-serif" fontWeight="600">
        UI / UX
      </text>
    </g>

    {/* 4. Cyber Security (Bottom Left) */}
    <g transform="translate(40, 365)" filter="url(#lc-neon-glow)">
      <rect x="0" y="0" width="145" height="42" rx="10" fill="url(#lc-card-bg)" stroke="#7a3df0" strokeWidth="1.4" />
      {/* Shield icon */}
      <circle cx="21" cy="21" r="10" fill="#1f103d" />
      <path d="M 21 15 L 26 17 C 26 22 23 25 21 27 C 19 25 16 22 16 17 Z" fill="none" stroke="#b8f55a" strokeWidth="1.2" />
      {/* Label */}
      <text x="38" y="26" fill="#f6f2ff" fontSize="12" fontFamily="Sora, sans-serif" fontWeight="600">
        Cybersecurity
      </text>
    </g>

    {/* ============================================================== */}
    {/* DECORATIVE SPARKS / CONSTELLATION NODES                        */}
    {/* ============================================================== */}
    {/* Little 4-point stars */}
    <g transform="translate(180, 80)">
      <path d="M 0 -7 Q 0 0 7 0 Q 0 0 0 7 Q 0 0 -7 0 Q 0 0 0 -7 Z" fill="#b8f55a" opacity="0.85" />
    </g>
    <g transform="translate(410, 430)">
      <path d="M 0 -6 Q 0 0 6 0 Q 0 0 0 6 Q 0 0 -6 0 Q 0 0 0 -6 Z" fill="#b8f55a" opacity="0.85" />
    </g>
    <g transform="translate(290, 80)">
      <path d="M 0 -5 Q 0 0 5 0 Q 0 0 0 5 Q 0 0 -5 0 Q 0 0 0 -5 Z" fill="#d4c4ff" opacity="0.75" />
    </g>
    <g transform="translate(130, 180)">
      <path d="M 0 -4 Q 0 0 4 0 Q 0 0 0 4 Q 0 0 -4 0 Q 0 0 0 -4 Z" fill="#b79cff" opacity="0.6" />
    </g>
    <g transform="translate(480, 200)">
      <path d="M 0 -5 Q 0 0 5 0 Q 0 0 0 5 Q 0 0 -5 0 Q 0 0 0 -5 Z" fill="#d4c4ff" opacity="0.7" />
    </g>

    {/* Orbit connector dots */}
    <circle cx="95" cy="250" r="3" fill="#b8f55a" opacity="0.7" />
    <circle cx="505" cy="250" r="3" fill="#b79cff" opacity="0.7" />
  </svg>
);

export default function LearningCircles() {
  return (
    <section className="section learning-circles" aria-labelledby="lc-eyebrow">
      <div className="learning-circles__ambient-glow" aria-hidden="true" />
      <div className="container">
        <div className="learning-circles__grid">
          {/* Left Column: Collaborative Learning Artwork */}
          <FadeIn className="learning-circles__visual" y={32}>
            <div className="learning-circles__artwork-wrap">
              <LearningCircleIllustration />
            </div>
          </FadeIn>

          {/* Right Column: Heading, Description, and CTA */}
          <div className="learning-circles__content">
            <FadeIn y={16}>
              <span className="eyebrow" id="lc-eyebrow">
                Peer Learning
              </span>
            </FadeIn>

            <SplitText
              as="h2"
              variant="heading"
              className="h2 learning-circles__title"
              text="Explore *Learning Circles*"
            />

            <FadeIn delay={0.15} y={20}>
              <p className="lead learning-circles__desc">
                An informal mechanism for bringing together learners who are interested in the same topic from across different fields and disciplines. A fantastic way to spend a small amount of time learning about new things with a group of people with same interests!
              </p>
            </FadeIn>

            <FadeIn delay={0.25} y={20} className="learning-circles__actions">
              <Button
                href="https://mulearn.org/learning-circle"
                className="btn--xl"
              >
                Create/Join Learning Circles
              </Button>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
