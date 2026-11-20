import { Caps } from '../components/Caps';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap, EASE } from '../animation/gsap';
import { SplitText } from '../animation/SplitText';
import { Button } from '../components/Button';
import { sceneRuntime, useIntro } from '../state/intro';
import { prefersReducedMotion } from '../hooks/useMedia';
import { SITE } from '../data/site';

/**
 * Cinematic hero. The 3D scene (SceneHost) is already running underneath; this
 * component choreographs the camera pull-back and the type around it:
 *
 *   1. tight framing  →  2. camera zooms out, objects revealed
 *   3. headline, word by word  →  4. supporting copy  →  5. CTA expands horizontally
 *
 * The full sequence plays once per page load. Returning to Home from another
 * route replays only the (much shorter) type + CTA entrance.
 */
export const Hero = () => {
  const { phase } = useIntro();
  // Only the loading → started transition matters; 'opening' → 'done' must not restart/kill the timeline.
  const active = phase !== 'loading';
  const root = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const eyebrow = useRef<HTMLParagraphElement>(null);
  const title = useRef<HTMLDivElement>(null);
  const desc = useRef<HTMLDivElement>(null);
  const cta = useRef<HTMLDivElement>(null);
  const cta2 = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const reduced = prefersReducedMotion();

  // Hide the non-text hero elements before first paint (text hides via CSS).
  useLayoutEffect(() => {
    if (reduced) return;
    gsap.set([eyebrow.current, cta2.current, hint.current], { opacity: 0 });
    gsap.set(cta.current, { opacity: 0 });
  }, [reduced]);

  useEffect(() => {
    if (started.current || !active) return;
    started.current = true;

    const titleEl = title.current?.querySelector<HTMLElement>('[data-split]');
    const descEl = desc.current?.querySelector<HTMLElement>('[data-split]');
    const titleWords = title.current?.querySelectorAll<HTMLElement>('.split-word > span') ?? [];
    const descWords = desc.current?.querySelectorAll<HTMLElement>('.split-w') ?? [];
    const everything = [eyebrow.current, cta.current, cta2.current, hint.current];

    const reveal = () => {
      titleEl?.setAttribute('data-split', 'shown');
      descEl?.setAttribute('data-split', 'shown');
      gsap.set(everything, { clearProps: 'opacity,transform,clipPath' });
      sceneRuntime.cameraIntro = 1;
    };

    if (reduced) {
      reveal();
      return;
    }

    const full = sceneRuntime.cameraIntro < 1;
    const T = full
      ? { head: 1.0, desc: 2.2, cta: 2.7, cta2: 3.1, hint: 3.5, eyebrow: 0.7 }
      : { head: 0.1, desc: 0.65, cta: 0.9, cta2: 1.1, hint: 1.3, eyebrow: 0.05 };

    titleEl?.setAttribute('data-split', 'animating');
    descEl?.setAttribute('data-split', 'animating');

    const tl = gsap.timeline({ onComplete: () => (sceneRuntime.heroIntroPlayed = true) });

    // 1–2. camera: tightly framed → pulled back
    if (full) {
      tl.to(sceneRuntime, { cameraIntro: 1, duration: 3.8, ease: 'power3.inOut' }, 0);
    }

    // eyebrow
    tl.fromTo(eyebrow.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1, ease: EASE.expo }, T.eyebrow);

    // 3. headline — word by word, rising out of its mask with a touch of depth
    tl.fromTo(
      titleWords,
      { yPercent: 118, opacity: 0, rotate: 2.5, transformOrigin: '0% 100%' },
      {
        yPercent: 0,
        opacity: 1,
        rotate: 0,
        duration: 1.35,
        ease: EASE.expo,
        stagger: { each: 0.12, ease: 'power1.in' },
      },
      T.head,
    );

    // 4. supporting copy
    tl.fromTo(
      descWords,
      { opacity: 0, y: '0.7em' },
      { opacity: 1, y: 0, duration: 0.9, ease: EASE.out, stagger: { amount: 0.8 } },
      T.desc,
    );

    // 5. CTA: a small pill that expands horizontally into the full button
    const ctaEl = cta.current;
    if (ctaEl) {
      const w = ctaEl.getBoundingClientRect().width;
      const inset = Math.max(0, (w - 54) / 2);
      tl.set(ctaEl, { opacity: 1 }, T.cta);
      tl.fromTo(
        ctaEl,
        { clipPath: `inset(0px ${inset}px 0px ${inset}px round 999px)` },
        { clipPath: 'inset(0px 0px 0px 0px round 999px)', duration: 1.25, ease: 'expo.inOut' },
        T.cta,
      );
    }
    tl.fromTo(cta2.current, { opacity: 0, x: -18 }, { opacity: 1, x: 0, duration: 0.9, ease: EASE.expo }, T.cta2);
    tl.fromTo(hint.current, { opacity: 0 }, { opacity: 1, duration: 1 }, T.hint);

    tl.add(reveal);

    return () => {
      tl.kill();
      started.current = false; // StrictMode re-run / unmount safety
    };
  }, [active, reduced]);

  // Failsafe: hero content can never stay hidden.
  useEffect(() => {
    const t = window.setTimeout(() => {
      if (!started.current) {
        started.current = true;
        title.current?.querySelector('[data-split]')?.setAttribute('data-split', 'shown');
        desc.current?.querySelector('[data-split]')?.setAttribute('data-split', 'shown');
        gsap.set([eyebrow.current, cta.current, cta2.current, hint.current], { clearProps: 'all' });
        sceneRuntime.cameraIntro = 1;
      }
    }, 12000);
    return () => window.clearTimeout(t);
  }, []);

  // Scroll-out: content drifts up and fades while the scene recedes.
  useLayoutEffect(() => {
    if (reduced || !content.current || !root.current) return;
    const tween = gsap.to(content.current, {
      yPercent: -14,
      opacity: 0,
      ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom 25%', scrub: true },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [reduced]);

  return (
    <section ref={root} className="hero" aria-label="Introduction">
      <div ref={content} className="hero__content container">
        <p ref={eyebrow} className="eyebrow hero__eyebrow">
          <span>
            <Caps>{SITE.fullName}</Caps> · {SITE.institution}
          </span>
        </p>

        <div ref={title}>
          <SplitText
            as="h1"
            variant="heading"
            mode="manual"
            className="hero__title"
            text={'Welcome to the\n*µverse*'}
          />
        </div>

        <div ref={desc}>
          <SplitText
            as="p"
            variant="paragraph"
            mode="manual"
            className="lead hero__lead"
            text="µLearn CHN is the peer-learning community at College of Engineering Chengannur — students learning from each other, and building things together."
          />
        </div>

        <div className="hero__actions">
          <div ref={cta} className="hero__cta">
            <Button to="/join">Join µLearn</Button>
          </div>
          <div ref={cta2}>
            <Button to="/events" variant="ghost">
              Explore events
            </Button>
          </div>
        </div>
      </div>

      <div ref={hint} className="hero__hint" aria-hidden="true">
        <span>Scroll</span>
        <i />
      </div>
    </section>
  );
};
