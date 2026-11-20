import { FadeIn } from '../animation/Reveal';
import { PageHero } from '../components/PageHero';
import { SectionHeader } from '../components/SectionHeader';
import { TeamCard } from '../components/TeamCard';
import { TEAM, TEAM_GROUPS } from '../data/team';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function Team() {
  useDocumentTitle('Our Team — µLearn CHN');

  return (
    <>
      <PageHero
        eyebrow="Our team"
        title={'The people\n*behind µLearn CHN.*'}
        lead="Students and mentors who give their time to keep the community learning, building and welcoming."
        aside=""
      />

      {TEAM_GROUPS.map((g) => {
        const members = TEAM.filter((m) => m.group === g.id);
        if (!members.length) return null;
        return (
          <section key={g.id} className="section team-section" aria-labelledby={`team-${g.id}`}>
            <div className="container">
              <SectionHeader eyebrow={g.title} title={g.blurb} />
              <span id={`team-${g.id}`} className="sr-only">
                {g.title}
              </span>
              <FadeIn className={`team-grid team-grid--${g.id}`} stagger={0.06} y={32}>
                {members.map((m) => (
                  <TeamCard key={m.id} member={m} />
                ))}
              </FadeIn>
            </div>
          </section>
        );
      })}
    </>
  );
}
