import { useState } from 'react';
import { FadeIn } from '../../animation/Reveal';
import { SectionHeader } from '../../components/SectionHeader';
import { OFFERINGS as ITEMS } from '../../data/offerings';

/**
 * "What we offer" — a horizontal accordion on desktop (panels widen on hover/focus/click),
 * a plain stacked list on small screens. Glyphs are original inline SVG.
 */

const Glyph = ({ kind }: { kind: string }) => {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
  switch (kind) {
    case 'peer':
      return (
        <svg viewBox="0 0 64 64" {...common} aria-hidden="true">
          <circle cx="24" cy="26" r="9" />
          <circle cx="42" cy="30" r="9" />
          <path d="M8 52c2-10 8-14 16-14M56 52c-2-10-8-14-16-14M24 52c1-8 4-12 8-12s7 4 8 12" />
        </svg>
      );
    case 'skill':
      return (
        <svg viewBox="0 0 64 64" {...common} aria-hidden="true">
          <path d="M10 50h12V38h12V26h12V14h8" />
          <path d="M44 14h8v8" />
          <path d="M10 56h44" />
        </svg>
      );
    case 'work':
      return (
        <svg viewBox="0 0 64 64" {...common} aria-hidden="true">
          <rect x="10" y="14" width="44" height="30" rx="4" />
          <path d="M22 54h20M32 44v10" />
          <path d="M22 26l-5 5 5 5M42 26l5 5-5 5M35 24l-6 14" />
        </svg>
      );
    case 'collab':
      return (
        <svg viewBox="0 0 64 64" {...common} aria-hidden="true">
          <rect x="8" y="10" width="20" height="20" rx="4" />
          <rect x="36" y="34" width="20" height="20" rx="4" />
          <path d="M28 20h8a8 8 0 0 1 8 8v6M36 44h-8a8 8 0 0 1-8-8v-6" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 64 64" {...common} aria-hidden="true">
          <circle cx="32" cy="14" r="6" />
          <circle cx="12" cy="48" r="6" />
          <circle cx="52" cy="48" r="6" />
          <path d="M28 19L15 43M36 19l13 24M18 48h28" />
        </svg>
      );
  }
};

export default function Offer() {
  const [active, setActive] = useState(0);

  return (
    <section className="section offer" aria-labelledby="offer-title">
      <div className="container">
        <SectionHeader
          eyebrow="What we offer"
          title="Everything is built around *learning by doing*."
          lead="Five ways µLearn CHN helps you learn faster and build more."
        />
        <span id="offer-title" className="sr-only">
          What we offer
        </span>

        <FadeIn className="offer__panels" y={48}>
          <ul className="offer__list" role="tablist" aria-orientation="horizontal">
            {ITEMS.map((item, i) => (
              <li key={item.id} className={`offer__item ${active === i ? 'is-active' : ''}`} role="presentation">
                <button
                  type="button"
                  role="tab"
                  className="offer__btn"
                  aria-selected={active === i}
                  aria-expanded={active === i}
                  aria-controls={`offer-panel-${item.id}`}
                  id={`offer-tab-${item.id}`}
                  tabIndex={0}
                  onMouseEnter={() => matchMedia('(hover: hover)').matches && setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                >
                  <div className="offer__header">
                    <span className="offer__num">0{i + 1}</span>
                  </div>
                  <div className="offer__content" id={`offer-panel-${item.id}`}>
                    <span className="offer__glyph">
                      <Glyph kind={item.id} />
                    </span>
                    <span className="offer__title">{item.title}</span>
                    <span className="offer__text">{item.text}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}
