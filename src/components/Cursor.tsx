import { useEffect, useRef } from 'react';
import { gsap } from '../animation/gsap';
import { useFinePointer, useReducedMotion } from '../hooks/useMedia';

const INTERACTIVE = 'a, button, [role="button"], summary, label[for], [data-cursor="link"]';
const NATIVE = 'input, textarea, select, [contenteditable="true"]';

/**
 * Custom cursor (desktop / fine pointers only).
 *
 *  - dot follows the pointer exactly, ring eases behind it
 *  - ring grows over links/buttons, becomes a labelled disc over [data-cursor="view"]
 *  - elements wrapped in `.magnetic` drift slightly toward the pointer
 *  - form fields keep the native cursor; text selection is never intercepted
 *  - positions are written straight to the DOM (no React re-renders on move)
 */
export const Cursor = () => {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const ringShape = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!fine) return;
    const dotEl = dot.current;
    const ringEl = ring.current;
    const shape = ringShape.current;
    if (!dotEl || !ringEl || !shape) return;

    document.documentElement.classList.add('has-custom-cursor');

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { x: target.x, y: target.y };
    let raf = 0;
    let visible = false;
    let magnet: HTMLElement | null = null;

    const setVisible = (v: boolean) => {
      if (visible === v) return;
      visible = v;
      dotEl.classList.toggle('is-visible', v);
      ringEl.classList.toggle('is-visible', v);
    };

    const resetMagnet = () => {
      if (!magnet) return;
      gsap.to(magnet, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)', overwrite: true });
      magnet = null;
    };

    const setState = (el: Element | null) => {
      const native = !!el?.closest(NATIVE);
      const view = el?.closest<HTMLElement>('[data-cursor="view"]');
      const link = !native && !view && !!el?.closest(INTERACTIVE);
      ringEl.classList.toggle('is-hidden', native);
      dotEl.classList.toggle('is-hidden', native);
      shape.classList.toggle('is-link', link);
      shape.classList.toggle('is-view', !!view);
      if (label.current) label.current.textContent = view?.dataset.cursorLabel ?? 'View';
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      target.x = e.clientX;
      target.y = e.clientY;
      setVisible(true);
      const el = e.target as Element | null;
      setState(el);

      const m = el?.closest<HTMLElement>('.magnetic') ?? null;
      if (m !== magnet) resetMagnet();
      if (m) {
        magnet = m;
        const r = m.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        gsap.to(m, { x: dx * 0.22, y: dy * 0.3, duration: 0.45, ease: 'power3.out', overwrite: true });
      }
    };

    const onDown = () => shape.classList.add('is-down');
    const onUp = () => shape.classList.remove('is-down');
    const onLeave = () => {
      setVisible(false);
      resetMagnet();
    };

    const tick = () => {
      const k = reduced ? 1 : 0.17;
      pos.x += (target.x - pos.x) * k;
      pos.y += (target.y - pos.y) * k;
      dotEl.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
      ringEl.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      resetMagnet();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, [fine, reduced]);

  if (!fine) return null;

  return (
    <>
      <div ref={ring} className="cursor-pos cursor-ring-pos" aria-hidden="true">
        <div ref={ringShape} className="cursor-ring">
          <span ref={label} className="cursor-label" />
        </div>
      </div>
      <div ref={dot} className="cursor-pos cursor-dot" aria-hidden="true" />
    </>
  );
};
