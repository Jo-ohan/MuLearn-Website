import { FadeIn } from '../animation/Reveal';
import { SplitText } from '../animation/SplitText';
import { Button } from '../components/Button';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

/**
 * About page — simplified and focused.
 * Communicates what µLearn CHN is quickly and clearly with the official heading and description.
 *
 * Previous lengthy sub-sections (01 About µLearn, 02 CHN community, 03 Vision & mission,
 * 04 Philosophy, 05 Offerings, 06 Circles, 07 Achievements) are removed from rendering.
 * All respective data files (achievements.ts, offerings.ts, site.ts) remain intact.
 */
export default function About() {
  useDocumentTitle('About Us — µLearn CHN');

  return (
    <div className="about-page">
      <section className="section about-hero" aria-labelledby="about-title">
        <div className="container about-hero__inner">
          <FadeIn y={12}>
            <span className="eyebrow" id="about-title">About Us</span>
          </FadeIn>

          <SplitText
            as="h1"
            variant="heading"
            className="h1 about-hero__title"
            text="About *Us*"
          />

          <FadeIn delay={0.15} y={16}>
            <p className="lead about-hero__desc">
              µLearn CHN is a dynamic community powered by GTech, dedicated to fostering growth through mutual learning. We bring together curious minds to explore new ideas, develop skills, and collaborate on innovative projects. Our community thrives on peer learning, mentorship, and hands-on experiences, empowering individuals to grow both personally and professionally. Join us and be part of a movement that transforms learning into action!
            </p>
          </FadeIn>

          <FadeIn delay={0.25} y={16} className="about-hero__actions">
            <Button to="/join">Join µLearn</Button>
            <Button to="/events" variant="ghost">
              Explore events
            </Button>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
