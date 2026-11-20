import { useMemo, useState } from 'react';
import { FadeIn } from '../animation/Reveal';
import { EventCard } from '../components/EventCard';
import { PageHero } from '../components/PageHero';
import { SectionHeader } from '../components/SectionHeader';
import {
  EVENTS,
  EVENT_CATEGORIES,
  formatEventDate,
  getEventStatus,
  getYears,
  type EventCategory,
} from '../data/events';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

type YearFilter = 'all' | number;
type CategoryFilter = 'all' | EventCategory;

const Chip = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button type="button" className={`chip ${active ? 'is-active' : ''}`} aria-pressed={active} onClick={onClick}>
    {children}
  </button>
);

export default function Events() {
  useDocumentTitle('Events & Initiatives — µLearn CHN');

  const years = useMemo(() => getYears(), []);
  const [year, setYear] = useState<YearFilter>('all');
  const [category, setCategory] = useState<CategoryFilter>('all');

  const sorted = useMemo(() => [...EVENTS].sort((a, b) => +new Date(b.date) - +new Date(a.date)), []);
  const featured = sorted.filter((e) => e.featured).slice(0, 3);
  const ongoing = sorted.filter((e) => !e.placeholder && getEventStatus(e) === 'ongoing');
  const photos = sorted.filter((e) => e.image);

  const filtered = useMemo(
    () =>
      sorted.filter(
        (e) =>
          (year === 'all' || new Date(e.date).getFullYear() === year) &&
          (category === 'all' || e.category === category),
      ),
    [sorted, year, category],
  );

  const reset = () => {
    setYear('all');
    setCategory('all');
  };

  return (
    <>
      <PageHero
        eyebrow="µLearn CHN"
        title={'*Events* & initiatives'}
        lead="Workshops, hackathons, talks and meetups run by the µLearn CHN community."
        aside=""
      />


      {/* Featured */}
      <section className="section events-featured">
        <div className="container">
          <SectionHeader title="*Featured* Highlights." />
          <FadeIn className="featured__grid" stagger={0.12} y={56}>
            {featured.map((e, i) => (
              <EventCard key={e.id} event={e} large={i === 0} />
            ))}
          </FadeIn>
        </div>
      </section>

      {/* Archive with filters */}
      <section className="section events-archive" aria-labelledby="archive-title">
        <div className="container">
          <SectionHeader eyebrow="Events archive" title="Everything, *filterable*." />
          <span id="archive-title" className="sr-only">
            Events archive
          </span>

          <FadeIn className="filters" y={20}>
            <fieldset className="filters__group">
              <legend className="filters__legend">Year</legend>
              <Chip active={year === 'all'} onClick={() => setYear('all')}>
                All
              </Chip>
              {years.map((y) => (
                <Chip key={y} active={year === y} onClick={() => setYear(y)}>
                  {y}
                </Chip>
              ))}
            </fieldset>
            <fieldset className="filters__group">
              <legend className="filters__legend">Category</legend>
              <Chip active={category === 'all'} onClick={() => setCategory('all')}>
                All
              </Chip>
              {EVENT_CATEGORIES.map((c) => (
                <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
                  {c}
                </Chip>
              ))}
            </fieldset>
          </FadeIn>

          <p className="filters__count" role="status" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? 'event' : 'events'}
            {(year !== 'all' || category !== 'all') && (
              <button type="button" className="text-link filters__reset" onClick={reset}>
                Clear filters
              </button>
            )}
          </p>

          {filtered.length ? (
            <ul className="archive-grid" key={`${year}-${category}`}>
              {filtered.map((e, i) => (
                <li key={e.id} className="archive-item" style={{ ['--i' as string]: i }}>
                  <EventCard event={e} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty">
              <p>No events match these filters.</p>
              <button type="button" className="text-link" onClick={reset}>
                Show all events
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Workshops & initiatives — displayed only if at least one genuine event is ongoing */}
      {ongoing.length > 0 && (
        <section className="section workshops" aria-labelledby="ongoing-workshops-title">
          <div className="container">
            <SectionHeader eyebrow="Workshops & initiatives" title="Hands-on, *ongoing*." />
            <span id="ongoing-workshops-title" className="sr-only">
              Workshops & initiatives
            </span>
            <FadeIn as="ul" className="rows" stagger={0.08} y={24}>
              {ongoing.map((e) => (
                <li key={e.id} className="row">
                  <span className="row__cat">{e.category}</span>
                  <h3 className="h3">{e.name}</h3>
                  <p className="dim">{e.description}</p>
                  <span className="row__date">{formatEventDate(e.date, e.placeholder, e.endDate)}</span>
                  {e.placeholder && <span className="placeholder-tag">Placeholder</span>}
                </li>
              ))}
            </FadeIn>
          </div>
        </section>
      )}

      {/* Photographs */}
      <section className="section event-photos">
        <div className="container">
          <SectionHeader eyebrow="Event photographs" title="From the *floor*." />
          <FadeIn className="photo-grid" stagger={0.08} y={36}>
            {photos.length
              ? photos.map((e) => (
                <figure key={e.id} className="photo" data-cursor="view" data-cursor-label="View">
                  <img src={e.image} alt={`${e.name} — photograph`} loading="lazy" decoding="async" />
                  <figcaption>{e.name}</figcaption>
                </figure>
              ))
              : [0, 1, 2].map((i) => (
                <figure key={i} className="photo">
                  <div className="media-ph media-ph--fill" role="img" aria-label="Photo placeholder">
                    <span>Event photo placeholder</span>
                  </div>
                </figure>
              ))}
          </FadeIn>
        </div>
      </section>
    </>
  );
}
