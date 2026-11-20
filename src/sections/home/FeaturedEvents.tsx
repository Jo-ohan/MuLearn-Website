import { FadeIn } from '../../animation/Reveal';
import { Button } from '../../components/Button';
import { EventCard } from '../../components/EventCard';
import { SectionHeader } from '../../components/SectionHeader';
import { EVENTS } from '../../data/events';

export default function FeaturedEvents() {
  const featured = EVENTS.filter((e) => e.featured)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, 3);

  return (
    <section className="section featured" aria-labelledby="featured-title">
      <div className="container">
        <div className="featured__head">
          <SectionHeader eyebrow="Featured events" title="What we've been *up to*." />
          <FadeIn>
            <Button to="/events" variant="ghost">
              All events
            </Button>
          </FadeIn>
        </div>
        <span id="featured-title" className="sr-only">
          Featured events
        </span>

        <FadeIn className="featured__grid" stagger={0.12} y={56}>
          {featured.map((e, i) => (
            <EventCard key={e.id} event={e} large={i === 0} />
          ))}
        </FadeIn>
      </div>
    </section>
  );
}
