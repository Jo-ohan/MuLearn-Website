import { FadeIn } from '../animation/Reveal';
import { SplitText } from '../animation/SplitText';
import { Caps } from './Caps';

interface Props {
  eyebrow?: string;
  title: string;
  lead?: string;
  as?: 'h1' | 'h2';
  className?: string;
  /** Heading size class */
  size?: 'h1' | 'h2';
  align?: 'left' | 'center';
}

/**
 * Shared section intro: eyebrow, word-by-word heading and a lead paragraph whose
 * entrance is staggered to follow the heading, so text and layout arrive together.
 */
export const SectionHeader = ({
  eyebrow,
  title,
  lead,
  as = 'h2',
  size = 'h2',
  align = 'left',
  className = '',
}: Props) => (
  <header className={`section-header section-header--${align} ${className}`}>
    {eyebrow && (
      <FadeIn y={12}>
        <span className="eyebrow"><Caps>{eyebrow}</Caps></span>
      </FadeIn>
    )}
    <SplitText as={as} variant="heading" className={size} text={title} />
    {lead && <SplitText as="p" variant="paragraph" className="lead" text={lead} delay={0.25} />}
  </header>
);
