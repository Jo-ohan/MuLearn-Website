import { FadeIn } from '../animation/Reveal';
import { SplitText } from '../animation/SplitText';
import { Caps } from './Caps';

interface Props {
  eyebrow: string;
  title: string;
  lead?: string;
  /** Short text shown at the right edge, e.g. a section index. */
  aside?: string;
}

/** Compact page opener for inner routes. The headline and lead are coordinated word reveals. */
export const PageHero = ({ eyebrow, title, lead, aside }: Props) => (
  <section className="page-hero">
    <div className="container page-hero__inner">
      <FadeIn y={12}>
        <span className="eyebrow"><Caps>{eyebrow}</Caps></span>
      </FadeIn>
      <SplitText as="h1" variant="heading" className="h1 page-hero__title" text={title} />
      {lead && <SplitText as="p" variant="paragraph" className="lead" text={lead} delay={0.3} />}
      {aside && (
        <FadeIn className="page-hero__aside" delay={0.5} y={12}>
          <span aria-hidden="true">{aside}</span>
        </FadeIn>
      )}
    </div>
  </section>
);
