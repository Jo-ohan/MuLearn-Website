import { Counter, FadeIn } from '../../animation/Reveal';
import { SectionHeader } from '../../components/SectionHeader';
import { STATS } from '../../data/stats';

export default function Highlights() {
  const anyVerified = STATS.some((s) => s.value !== null);

  return (
    <section className="section highlights" aria-labelledby="highlights-title">
      <div className="container">
        <SectionHeader eyebrow="Community highlights" title="The community, *in numbers*." />
        <span id="highlights-title" className="sr-only">
          Community highlights
        </span>

        <FadeIn as="ul" className="stats" stagger={0.1}>
          {STATS.map((s) => (
            <li key={s.id} className="stat">
              <Counter value={s.value} suffix={s.suffix} className="stat__value" />
              <p className="stat__label">{s.label}</p>
              {s.value === null && <span className="placeholder-tag">Awaiting verified figure</span>}
            </li>
          ))}
        </FadeIn>

        {!anyVerified && (
          <p className="stats__note dim">
            These figures are intentionally blank. They appear here once the team supplies verified numbers
            in <code>src/data/stats.ts</code>.
          </p>
        )}
      </div>
    </section>
  );
}
