import { Suspense, useEffect, useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SceneHost } from './SceneHost';
import { Nav } from './Nav';
import { Footer } from './Footer';
import { Loader } from './Loader';
import { Cursor } from './Cursor';
import { refreshScrollTriggers } from '../animation/gsap';

export const Layout = () => {
  const { pathname } = useLocation();

  // Every route starts at the top (also covers browser back/forward).
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  // Re-measure scroll triggers after a route mounts and whenever the document height changes
  // (lazy sections, images, fonts).
  useEffect(() => {
    refreshScrollTriggers();
  }, [pathname]);

  useEffect(() => {
    const ro = new ResizeObserver(() => refreshScrollTriggers());
    ro.observe(document.body);
    window.addEventListener('load', refreshScrollTriggers);
    return () => {
      ro.disconnect();
      window.removeEventListener('load', refreshScrollTriggers);
    };
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SceneHost />
      <Nav />
      <main id="main" className="page">
        <Suspense fallback={<div className="page-fallback" aria-hidden="true" />}>
          <Outlet />
        </Suspense>
      </main>
      <div className="page">
        <Footer />
      </div>
      <Loader />
      <Cursor />
      <div className="grain" aria-hidden="true" />
    </>
  );
};
