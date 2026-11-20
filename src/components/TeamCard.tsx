import type { TeamMember } from '../data/team';

interface Props {
  member: TeamMember;
  onSelect?: (member: TeamMember) => void;
}

/**
 * Team directory card.
 * Displays an empty circular profile photo placeholder (ready for future images),
 * with the member's name directly underneath and their designation in the purple accent color.
 */
export const TeamCard = ({ member, onSelect }: Props) => {
  const imgSrc = member.image || member.photo;

  return (
    <article
      className={`team-card ${onSelect ? 'team-card--interactive' : ''}`}
      onClick={onSelect ? () => onSelect(member) : undefined}
      tabIndex={onSelect ? 0 : undefined}
      role={onSelect ? 'button' : undefined}
      onKeyDown={
        onSelect
          ? (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelect(member);
            }
          }
          : undefined
      }
    >
      <div className="team-card__photo" aria-hidden="true">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={member.name}
            loading="lazy"
            decoding="async"
          />
        ) : null}
      </div>
      <div className="team-card__content">
        <h3 className="team-card__name">{member.name}</h3>
        <p className="team-card__role">{member.designation}</p>
      </div>
    </article>
  );
};
