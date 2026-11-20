import { FadeIn } from '../animation/Reveal';
import { SplitText } from '../animation/SplitText';
import { Button } from '../components/Button';
import { PageHero } from '../components/PageHero';
import { SectionHeader } from '../components/SectionHeader';
import { CONTACT, LINKS, SOCIAL_LINKS } from '../data/site';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const WHY = [
  { t: 'Learn with peers', d: 'Find people at your level and above who are happy to explain, and to be explained to.' },
  { t: 'Build real things', d: 'Move from tutorials to projects with a team that will give you honest feedback.' },
  { t: 'Show up as you are', d: 'Any branch, any year, any starting point. Curiosity is the only entry requirement.' },
];

const BENEFITS = [
  'Workshops and sessions run by students',
  'Collaborative projects with teammates',
  'Peer learning circles around topics you choose',
  'Mentors and seniors to learn from',
  'A network that reaches beyond campus',
  'A place to practise teaching and presenting',
];

const STEPS = [
  { t: 'Open the official joining link', d: 'Use the button below. It takes you to the official µLearn onboarding.' },
  { t: 'Complete the onboarding', d: 'Follow the instructions on the official page to set up your membership.' },
  { t: 'Join the community Discord', d: 'This is where sessions, announcements and conversations happen.' },
  { t: 'Show up to something', d: 'Pick an upcoming event or a learning circle and take part.' },
];

const joinHref = LINKS.join.href;

export default function Join() {
  useDocumentTitle('Join µLearn — µLearn CHN');

  return (
    <>
      <PageHero
        eyebrow="Join µLearn"
        title={'Come learn\n*with us.*'}
        lead="Joining µLearn CHN is free of ceremony — here is why you might, and exactly how to start."
        aside=""
      />

      {/* Why join */}
      <section className="section join-why">
        <div className="container">
          <SectionHeader eyebrow="Why join" title="Three good reasons." />
          <FadeIn as="ul" className="why-grid" stagger={0.12} y={48}>
            {WHY.map((w, i) => (
              <li key={w.t} className="why-card">
                <span className="why-card__num">0{i + 1}</span>
                <h3 className="h3">{w.t}</h3>
                <p className="dim">{w.d}</p>
              </li>
            ))}
          </FadeIn>
        </div>
      </section>

      {/* Opportunities */}
      <section className="section join-benefits">
        <div className="container join-benefits__grid">
          <SectionHeader eyebrow="Opportunities & benefits" title="What membership *opens up*." />
          <FadeIn as="ul" className="checklist" stagger={0.07} y={24}>
            {BENEFITS.map((b) => (
              <li key={b}>
                <span className="checklist__tick" aria-hidden="true">
                  ✓
                </span>
                {b}
              </li>
            ))}
          </FadeIn>
        </div>
      </section>

      {/* How to get started
      <section className="section join-steps">
        <div className="container">
          <SectionHeader eyebrow="How to get started" title="Four steps." />
          <FadeIn as="ol" className="steps" stagger={0.1} y={40}>
            {STEPS.map((s, i) => (
              <li key={s.t} className="step">
                <span className="step__num">{i + 1}</span>
                <div>
                  <h3 className="h3">{s.t}</h3>
                  <p className="dim">{s.d}</p>
                </div>
              </li>
            ))}
          </FadeIn>
          <FadeIn className="step-note">
            <span className="placeholder-tag">Onboarding details — confirm exact steps with the core team</span>
          </FadeIn>
        </div>
      </section>
      */}

      {/* Official link */}
      <section className="section join-link" aria-labelledby="official-link">
        <div className="join-link__glow" aria-hidden="true" />
        <div className="container join-link__inner">
          <FadeIn y={12}>
            <span className="eyebrow" id="official-link">
              We would love to have you
            </span>
          </FadeIn>
          <SplitText as="h2" variant="heading" className="h2" text="Ready? *Start here.*" />
          <FadeIn delay={0.2} className="join-link__actions">
            <Button href={joinHref} className="btn--xl">
              Join µLearn
            </Button>
            {!joinHref && (
              <span className="placeholder-tag">Official joining link to be added in src/data/site.ts</span>
            )}
          </FadeIn>
        </div>
      </section>

      {/* Community + contact */}
      <section className="section join-community">
        <div className="container join-community__grid">
          <FadeIn className="join-panel" y={40}>
            <h3 className="h3">Discord & community</h3>
            <p className="dim">Sessions, announcements and day-to-day conversation live on Discord.</p>
            <div className="join-panel__actions">
              <Button href={LINKS.discord.href} variant="ghost" small>
                Open Discord
              </Button>
            </div>
            <ul className="join-panel__links">
              {SOCIAL_LINKS.filter((l) => l !== LINKS.discord).map((l) => (
                <li key={l.label}>
                  {l.href ? (
                    <a className="text-link" href={l.href} target="_blank" rel="noopener noreferrer">
                      {l.label} <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <span className="footer__placeholder">{l.label} — link pending</span>
                  )}
                </li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn className="join-panel" delay={0.1} y={40}>
            <h3 className="h3">Contact</h3>
            <p className="dim">Questions before you join? Get in touch.</p>
            <ul className="join-panel__links">
              <li>
                {CONTACT.email ? (
                  <a className="text-link" href={`mailto:${CONTACT.email}`}>
                    {CONTACT.email}
                  </a>
                ) : (
                  <span className="footer__placeholder">Contact email — to be added</span>
                )}
              </li>
              <li className="dim">{CONTACT.address}</li>
            </ul>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
