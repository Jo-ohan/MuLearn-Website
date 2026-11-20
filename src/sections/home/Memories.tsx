import { FadeIn, Parallax } from '../../animation/Reveal';
import { SectionHeader } from '../../components/SectionHeader';
import { MEMORIES } from '../../data/memories';

export default function Memories() {
  return (
    <section className="section memories" aria-labelledby="memories-title">
      <div className="container">
        <SectionHeader
          eyebrow="Memories"
          title="Moments from *the community*."
          lead="A look back at the sessions, late nights and small wins."
        />
        <span id="memories-title" className="sr-only">
          Memories
        </span>

        <FadeIn className="memories__grid" stagger={0.08} y={48}>
          {MEMORIES.map((m) => (
            <figure key={m.id} className={`memory memory--${m.size}`} data-cursor="view" data-cursor-label="View">
              <div className="memory__frame">
                <Parallax amount={5} className="memory__parallax">
                  {m.src ? (
                    <img src={m.src} alt={m.alt ?? m.caption} loading="lazy" decoding="async" />
                  ) : (
                    <div className="media-ph media-ph--fill" role="img" aria-label="Photo placeholder">
                      <span>Photo placeholder</span>
                    </div>
                  )}
                </Parallax>
              </div>
              <figcaption className="memory__cap">{m.caption}</figcaption>
            </figure>
          ))}
        </FadeIn>
      </div>
    </section>
  );
}
