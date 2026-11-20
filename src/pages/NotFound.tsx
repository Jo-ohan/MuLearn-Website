import { FadeIn } from '../animation/Reveal';
import { Button } from '../components/Button';
import { PageHero } from '../components/PageHero';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function NotFound() {
  useDocumentTitle('Page not found — µLearn CHN');
  return (
    <>
      <PageHero eyebrow="404" title={'Lost in\n*space.*'} lead="That page doesn’t exist — but the rest of the community does." />
      <section className="section">
        <div className="container">
          <FadeIn>
            <Button to="/">Back home</Button>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
