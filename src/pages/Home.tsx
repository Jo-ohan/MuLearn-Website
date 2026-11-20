import { lazy, Suspense } from 'react';
import { Hero } from '../sections/Hero';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

// Everything below the fold is code-split and loaded after the hero is interactive.
const Intro = lazy(() => import('../sections/home/Intro'));
const Offer = lazy(() => import('../sections/home/Offer'));
const FeaturedEvents = lazy(() => import('../sections/home/FeaturedEvents'));
const Memories = lazy(() => import('../sections/home/Memories'));
const Highlights = lazy(() => import('../sections/home/Highlights'));
const LearningCircles = lazy(() => import('../sections/home/LearningCircles'));
const TeamPreview = lazy(() => import('../sections/home/TeamPreview'));
const FinalCTA = lazy(() => import('../sections/home/FinalCTA'));

const Slot = ({ height }: { height: string }) => <div style={{ minHeight: height }} aria-hidden="true" />;

export default function Home() {
  useDocumentTitle('µLearn CHN');

  return (
    <>
      <Hero />
      <div className="home-flow">
        {/* 1. Hero (above) */}
        {/* 2. Introduction / About */}
        <Suspense fallback={<Slot height="80vh" />}>
          <Intro />
        </Suspense>
        {/* 3. What We Offer */}
        <Suspense fallback={<Slot height="90vh" />}>
          <Offer />
        </Suspense>
        {/* 4. Featured Events */}
        <Suspense fallback={<Slot height="100vh" />}>
          <FeaturedEvents />
        </Suspense>
        {/* 5. Memories */}
        <Suspense fallback={<Slot height="100vh" />}>
          <Memories />
        </Suspense>
        {/* 6. Statistics*/}
        <Suspense fallback={<Slot height="40vh" />}>
          <Highlights />
        </Suspense>
        {/* 7. Explore Learning Circles */}
        <Suspense fallback={<Slot height="80vh" />}>
          <LearningCircles />
        </Suspense>
        {/* 8. Team preview */}
        <Suspense fallback={<Slot height="80vh" />}>
          <TeamPreview />
        </Suspense>
        {/* 8. Final CTA */}
        <Suspense fallback={<Slot height="80vh" />}>
          <FinalCTA />
        </Suspense>
      </div>
    </>
  );
}
