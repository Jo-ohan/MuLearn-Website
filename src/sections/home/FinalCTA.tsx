import { FadeIn } from '../../animation/Reveal';
import { SplitText } from '../../animation/SplitText';
import { Button } from '../../components/Button';
import { LINKS } from '../../data/site';

export default function FinalCTA() {
  return (
    <section className="section final-cta" aria-labelledby="final-cta-title">
      <div className="final-cta__glow" aria-hidden="true" />
      <div className="container final-cta__inner">
        <FadeIn y={12}>
          <span className="eyebrow" id="final-cta-title">
            Join us
          </span>
        </FadeIn>
        <SplitText
          as="h2"
          variant="heading"
          className="final-cta__title"
          text={'Be Part of *µLearn*'}
        />
        <SplitText
          as="p"
          variant="paragraph"
          className="lead final-cta__lead"
          delay={0.2}
          text="No prerequisites beyond curiosity. Join µLearn CHN and start learning and building with students who want the same."
        />
        <FadeIn className="final-cta__actions" delay={0.3} stagger={0.1}>
          <Button to="/join" className="btn--xl">
            Join µLearn
          </Button>
          <Button href={LINKS.discord.href} variant="ghost" className="btn--xl">
            Join the Discord
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}
