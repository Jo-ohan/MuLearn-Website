import { createElement, useLayoutEffect, useMemo, useRef, type ElementType } from 'react';
import { gsap, ScrollTrigger, EASE } from './gsap';
import { useIntro } from '../state/intro';
import { prefersReducedMotion } from '../hooks/useMedia';

/**
 * Word-by-word text reveal.
 *
 * - Headings: each word rises out of a mask with a soft opacity ramp.
 * - Paragraphs: words fade/lift in a tightly staggered wave (total duration capped,
 *   so long paragraphs never feel slow).
 *
 * Accessibility: the full text is exposed once via a visually-hidden span, the
 * animated copy is aria-hidden. Reduced-motion users get the text immediately.
 *
 * Markup: `*accent*` highlights words, `\n` inserts a line break.
 *
 * Words are hidden through CSS ([data-split='pending']) until the intro has
 * finished, then revealed once when scrolled into view. A failsafe guarantees
 * the text can never remain invisible.
 */

type Variant = 'heading' | 'paragraph';

interface Props {
  text: string;
  as?: ElementType;
  className?: string;
  variant?: Variant;
  /** Seconds added before the reveal starts. */
  delay?: number;
  /** 'scroll' reveals on entering the viewport; 'manual' leaves the words hidden for a parent timeline. */
  mode?: 'scroll' | 'manual';
  /** ScrollTrigger start position. */
  start?: string;
}

interface Token {
  word: string;
  accent: boolean;
  br?: boolean;
  /** Attached to the previous word with no space (e.g. punctuation after an accent). */
  glue?: boolean;
}

const tokenise = (text: string): Token[] => {
  const out: Token[] = [];
  let prevEndsNonSpace = false;
  text.split(/(\*[^*]+\*)/g).forEach((chunk) => {
    if (!chunk) return;
    const accent = chunk.startsWith('*') && chunk.endsWith('*') && chunk.length > 2;
    const raw = accent ? chunk.slice(1, -1) : chunk;
    const startsNonSpace = /^\S/.test(raw);
    let first = true;
    raw.split('\n').forEach((line, li) => {
      if (li > 0) {
        out.push({ word: '', accent: false, br: true });
        first = false;
        prevEndsNonSpace = false;
      }
      line
        .split(/\s+/)
        .filter(Boolean)
        .forEach((word) => {
          const glue = first && li === 0 && startsNonSpace && prevEndsNonSpace && out.length > 0;
          out.push({ word, accent, glue });
          first = false;
        });
    });
    prevEndsNonSpace = /\S$/.test(raw);
  });
  return out;
};

const plain = (text: string) => text.replace(/\*/g, '').replace(/\n/g, ' ');

export const SplitText = ({
  text,
  as = 'p',
  className = '',
  variant = 'paragraph',
  delay = 0,
  mode = 'scroll',
  start = 'top 88%',
}: Props) => {
  const ref = useRef<HTMLElement>(null);
  const { phase } = useIntro();
  const tokens = useMemo(() => tokenise(text), [text]);
  const ready = phase === 'done';

  const reduced = prefersReducedMotion();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || mode === 'manual') return;

    const show = () => el.setAttribute('data-split', 'shown');

    if (reduced) {
      show();
      return;
    }
    if (!ready) return;

    const words = el.querySelectorAll<HTMLElement>(variant === 'heading' ? '.split-word > span' : '.split-w');
    if (!words.length) {
      show();
      return;
    }

    let played = false;
    const play = () => {
      if (played) return;
      played = true;
      gsap.set(words, { clearProps: 'all' }); // drop inline state, let tweens own it
      const base = variant === 'heading'
        ? { yPercent: 115, opacity: 0, rotate: 2 }
        : { y: '0.7em', opacity: 0 };
      el.setAttribute('data-split', 'animating');
      gsap.fromTo(
        words,
        base,
        {
          yPercent: 0,
          y: 0,
          rotate: 0,
          opacity: 1,
          duration: variant === 'heading' ? 1.05 : 0.8,
          ease: variant === 'heading' ? EASE.expo : EASE.out,
          delay,
          stagger:
            variant === 'heading'
              ? { each: 0.07, ease: 'power1.in' }
              : { amount: Math.min(0.9, words.length * 0.02) },
          onComplete: () => {
            gsap.set(words, { clearProps: 'all' });
            show();
          },
        },
      );
    };

    const trigger = ScrollTrigger.create({
      trigger: el,
      start,
      once: true,
      onEnter: play,
    });

    // Failsafe: never leave readable text hidden if triggers misfire.
    const failsafe = window.setTimeout(() => {
      const r = el.getBoundingClientRect();
      if (!played && r.top < window.innerHeight && r.bottom > 0) play();
    }, 3500);

    return () => {
      window.clearTimeout(failsafe);
      trigger.kill();
      gsap.killTweensOf(words);
    };
  }, [ready, mode, variant, delay, start, reduced, text]);

  const initial = reduced ? 'shown' : 'pending';

  // Group glued tokens (punctuation after an accent word) so they can't wrap apart.
  const groups: Token[][] = [];
  tokens.forEach((t) => {
    if (t.glue && groups.length) groups[groups.length - 1].push(t);
    else groups.push([t]);
  });

  const piece = (t: Token, k: number) =>
    variant === 'heading' ? (
      <span className="split-word" key={k}>
        <span className={t.accent ? 'accent' : undefined}>{t.word}</span>
      </span>
    ) : (
      <span className={`split-w ${t.accent ? 'accent' : ''}`} key={k}>
        {t.word}
      </span>
    );

  const visual = groups.map((g, i) => {
    if (g[0].br) return <br key={i} />;
    const next = groups[i + 1];
    const space = next && !next[0].br ? ' ' : '';
    return (
      <span key={i} className={g.length > 1 ? 'split-group' : undefined}>
        {g.map(piece)}
        {space}
      </span>
    );
  });

  return createElement(
    as,
    { ref, className: `split ${className}`, 'data-split': initial, 'data-variant': variant },
    <span className="sr-only">{plain(text)}</span>,
    <span aria-hidden="true">{visual}</span>,
  );
};

/** Convenience wrappers */
export const Heading = (p: Omit<Props, 'variant'>) => <SplitText variant="heading" as="h2" {...p} />;
export const Paragraph = (p: Omit<Props, 'variant'>) => <SplitText variant="paragraph" as="p" {...p} />;
