import { useEffect, useRef } from 'react';
import type { TeamMember } from '../data/team';

/**
 * Individual profile, shown in a native <dialog> (focus trapping, Escape to close and
 * inert background come for free). Closing returns focus to the card that opened it.
 */
export const ProfileDialog = ({ member, onClose }: { member: TeamMember | null; onClose: () => void }) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (member && !d.open) d.showModal();
    if (!member && d.open) d.close();
  }, [member]);

  return (
    <dialog
      ref={ref}
      className="profile"
      aria-labelledby="profile-name"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
    >
      {member && (
        <div className="profile__inner">
          <button type="button" className="profile__close" onClick={onClose} aria-label="Close profile">
            ✕
          </button>
          <div className="profile__photo">
            {member.photo ? (
              <img src={member.photo} alt={`Portrait of ${member.name}`} />
            ) : (
              <div className="portrait-ph" role="img" aria-label="Portrait placeholder">
                <svg viewBox="0 0 120 150" aria-hidden="true" className="portrait-ph__svg">
                  <circle cx="60" cy="52" r="24" fill="currentColor" />
                  <path d="M14 150c2-34 20-54 46-54s44 20 46 54z" fill="currentColor" />
                </svg>
              </div>
            )}
          </div>
          <div className="profile__info">
            <h2 id="profile-name" className="h2 profile__name">
              {member.name}
            </h2>
            <p className="profile__role">{member.designation}</p>
            <p className="dim profile__bio">{member.bio ?? 'Bio to be added.'}</p>
            {member.links?.length ? (
              <ul className="team-card__links">
                {member.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} target="_blank" rel="noopener noreferrer">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
            {member.placeholder && <span className="placeholder-tag">Placeholder profile</span>}
          </div>
        </div>
      )}
    </dialog>
  );
};
