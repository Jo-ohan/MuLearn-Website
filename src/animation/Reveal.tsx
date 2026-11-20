import {
  createElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react';
import { gsap, ScrollTrigger, EASE } from './gsap';
import { useIntro } from '../state/intro';
import { prefersReducedMotion } from '../hooks/useMedia';

/* -------------------------------------------------------------------------- */
/* FadeIn — block-level reveal, coordinated with text via shared start/delay   */
/* -------------------------------------------------------------------------- */

interface FadeInProps {
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  delay?: number;
  /** Animate direct children one after another instead of the wrapper. */
  stagger?: boolean | number;
  /** Starting offset in px. */
  y?: number;
  start?: string;
}

export const FadeIn = ({
  as = 'div',
  className = '',
  style,
  children,
  delay = 0,
  stagger = false,
  y = 36,
  start = 'top 90%',
}: FadeInProps) => {
  const ref = useRef<HTMLElement>(null);
  const { phase } = useIntro();
  const ready = phase === 'done';
  const reduced = prefersReducedMotion();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const show = () => el.setAttribute('data-fade', 'shown');
    if (reduced) return show();
    if (!ready) return;

    const targets = stagger ? Array.from(el.children) : [el];
    let played = false;
    const play = () => {
      if (played) return;
      played = true;
      el.setAttribute('data-fade', 'animating');
      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay,
          ease: EASE.expo,
          stagger: typeof stagger === 'number' ? stagger : stagger ? 0.09 : 0,
          onComplete: () => {
            gsap.set(targets, { clearProps: 'opacity,transform' });
            show();
          },
        },
      );
    };

    const st = ScrollTrigger.create({ trigger: el, start, once: true, onEnter: play });
    const failsafe = window.setTimeout(() => {
      const r = el.getBoundingClientRect();
      if (!played && r.top < window.innerHeight && r.bottom > 0) play();
    }, 3500);

    return () => {
      window.clearTimeout(failsafe);
      st.kill();
      gsap.killTweensOf(targets);
    };
  }, [ready, reduced, delay, stagger, y, start]);

  return createElement(
    as,
    {
      ref,
      className: `fade ${stagger ? 'fade--stagger' : ''} ${className}`,
      'data-fade': reduced ? 'shown' : 'pending',
      style,
    },
    children,
  );
};

/* -------------------------------------------------------------------------- */
/* Parallax — controlled scroll-linked drift for images and decorative layers  */
/* -------------------------------------------------------------------------- */

interface ParallaxProps {
  children: ReactNode;
  /** Percentage of the element's own height to travel. Keep small (4–14). */
  amount?: number;
  className?: string;
  style?: CSSProperties;
}

export const Parallax = ({ children, amount = 8, className = '', style }: ParallaxProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const tween = gsap.fromTo(
      el,
      { yPercent: -amount },
      {
        yPercent: amount,
        ease: 'none',
        scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [amount]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Counter — verified numbers only. `value === null` renders a placeholder.    */
/* -------------------------------------------------------------------------- */

interface CounterProps {
  value: number | null;
  suffix?: string;
  className?: string;
}

export const Counter = ({ value, suffix = '', className = '' }: CounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const { phase } = useIntro();
  const [display, setDisplay] = useState(value === null ? 0 : prefersReducedMotion() ? value : 0);

  useEffect(() => {
    if (value === null || phase !== 'done') return;
    if (prefersReducedMotion()) {
      setDisplay(value);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const state = { n: 0 };
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(state, {
          n: value,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => setDisplay(Math.round(state.n)),
        });
      },
    });
    return () => st.kill();
  }, [value, phase]);

  if (value === null) {
    return (
      <span ref={ref} className={`counter counter--empty ${className}`} aria-label="Figure not yet verified">
        —
      </span>
    );
  }
  return (
    <span ref={ref} className={`counter ${className}`}>
      {display.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
};
