import { formatEventDate, type CommunityEvent } from '../data/events';

interface Props {
  event: CommunityEvent;
  /** Larger editorial treatment (used for the lead featured event). */
  large?: boolean;
}

export const EventCard = ({ event, large }: Props) => {
  const { name, date, category, description, image, href, placeholder, mediaType = 'poster' } = event;
  const isPoster = mediaType === 'poster';

  return (
    <article className={`event-card ${large ? 'event-card--lg' : ''}`}>
      <div
        className={`event-card__media ${isPoster ? 'event-card__media--poster' : 'event-card__media--photo'}`}
        data-cursor={href ? 'view' : undefined}
        data-cursor-label="Open"
      >
        {image ? (
          <img src={image} alt={`${name} — event ${isPoster ? 'poster' : 'photo'}`} loading="lazy" decoding="async" />
        ) : (
          <div className="media-ph" role="img" aria-label="Event photo placeholder">
            <span>Poster / photo</span>
          </div>
        )}
        <span className="event-card__cat">{category}</span>
      </div>

      <div className="event-card__body">
        <p className="event-card__date">{formatEventDate(date, placeholder, event.endDate)}</p>
        <h3 className="h3">{name}</h3>
        <p className="dim event-card__desc">{description}</p>
        <div className="event-card__foot">
          {href && (
            <a className="text-link" href={href} target="_blank" rel="noopener noreferrer">
              Event details <span aria-hidden="true">→</span>
            </a>
          )}
          {placeholder && <span className="placeholder-tag">Placeholder</span>}
        </div>
      </div>
    </article>
  );
};
