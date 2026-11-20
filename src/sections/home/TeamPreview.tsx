import { FadeIn } from '../../animation/Reveal';
import { Button } from '../../components/Button';
import { SectionHeader } from '../../components/SectionHeader';
import { TeamCard } from '../../components/TeamCard';
import { TEAM, TEAM_PREVIEW_IDS } from '../../data/team';

export default function TeamPreview() {
  const members = TEAM_PREVIEW_IDS.map((id) => TEAM.find((m) => m.id === id)).filter(
    (m): m is NonNullable<typeof m> => Boolean(m),
  );

  return (
    <section className="section team-preview" aria-labelledby="team-preview-title">
      <div className="container">
        <div className="featured__head">
          <SectionHeader eyebrow="Our team" title="The people *behind it*." />
          <FadeIn>
            <Button to="/team" variant="ghost">
              Meet the team
            </Button>
          </FadeIn>
        </div>
        <span id="team-preview-title" className="sr-only">
          Team preview
        </span>

        <FadeIn className="team-grid team-grid--preview" stagger={0.1} y={56}>
          {members.map((m) => (
            <TeamCard key={m.id} member={m} />
          ))}
        </FadeIn>
      </div>
    </section>
  );
}
