import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../animation/gsap';
import { setPhase, useIntro } from '../state/intro';
import { prefersReducedMotion } from '../hooks/useMedia';
import { LogoMark } from './Logo';

/**
 * Cinematic loader.
 *
 * It waits for two REAL conditions — web fonts and the first rendered frames of
 * the 3D scene (or a confirmed fallback if WebGL fails) — and opens the moment
 * both are true. There is no artificial minimum duration. A 9s ceiling makes sure
 * a stalled asset can never trap the visitor.
 *
 * The progress bar reflects completed stages (0 → ½ → 1), not a fake timer.
 */

const Brand = () => (
  <div className="loader__brand">
    <LogoMark className="loader__mark" />
    <span className="loader__sub">College of Engineering Chengannur</span>
  </div>
);

const loadFonts = () =>
  Promise.race([
    Promise.all([
      document.fonts.load('600 48px Sora'),
      document.fonts.load('700 48px Sora'),
      document.fonts.load('400 16px Inter'),
      document.fonts.load('500 16px Inter'),
    ]).then(() => document.fonts.ready),
    new Promise((r) => window.setTimeout(r, 5000)),
  ]);

export const Loader = () => {
  const intro = useIntro();
  const [mounted, setMounted] = useState(true);
  const [fontsReady, setFontsReady] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const started = useRef(false);

  const root = useRef<HTMLDivElement>(null);
  const left = useRef<HTMLDivElement>(null);
  const right = useRef<HTMLDivElement>(null);
  const status = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  const sceneOk = intro.sceneReady || intro.sceneFailed;
  const stages = (fontsReady ? 1 : 0) + (sceneOk ? 1 : 0);

  useEffect(() => {
    document.body.classList.add('is-loading');
    let alive = true;
    loadFonts().then(() => alive && setFontsReady(true));
    const t = window.setTimeout(() => alive && setTimedOut(true), 9000);
    return () => {
      alive = false;
      window.clearTimeout(t);
    };
  }, []);

  // Real progress: eases toward the share of completed stages.
  useEffect(() => {
    if (!bar.current) return;
    gsap.to(bar.current, { scaleX: Math.max(0.08, stages / 2), duration: 0.6, ease: 'power2.out' });
  }, [stages]);

  useEffect(() => {
    if (started.current || !((fontsReady && sceneOk) || timedOut)) return;
    started.current = true;

    const finish = () => {
      setPhase('done');
      document.body.classList.remove('is-loading');
      setMounted(false);
      ScrollTrigger.refresh();
    };

    if (prefersReducedMotion()) {
      setPhase('opening');
      gsap.to(root.current, { opacity: 0, duration: 0.4, onComplete: finish });
      return;
    }

    // Let the compositor present one more frame of the tightly framed scene, then open.
    requestAnimationFrame(() => {
      setPhase('opening'); // hero timeline starts here (camera pull-back + headline)
      const tl = gsap.timeline({ onComplete: finish });
      tl.to(status.current, { opacity: 0, y: 12, duration: 0.3, ease: 'power2.in' })
        .to(left.current, { xPercent: -101, duration: 1.4, ease: 'power4.inOut' }, 0.05)
        .to(right.current, { xPercent: 101, duration: 1.4, ease: 'power4.inOut' }, 0.05)
        // scroll-triggered reveals may begin while the doors are still sliding
        .add(() => setPhase('done'), 0.7);
    });
  }, [fontsReady, sceneOk, timedOut]);

  if (!mounted) return null;

  return (
    <div ref={root} className="loader" role="status" aria-live="polite">
      <span className="sr-only">Loading µLearn CHN</span>
      <div ref={left} className="loader__panel loader__panel--l" aria-hidden="true">
        <Brand />
      </div>
      <div ref={right} className="loader__panel loader__panel--r" aria-hidden="true">
        <Brand />
      </div>
      <div ref={status} className="loader__status" aria-hidden="true">
        <div className="loader__bar">
          <span ref={bar} />
        </div>
        <p>{fontsReady && sceneOk ? 'Ready' : !fontsReady ? 'Loading type' : 'Building scene'}</p>
      </div>
    </div>
  );
};
