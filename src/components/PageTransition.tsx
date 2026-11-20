import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { gsap, ScrollTrigger } from '../animation/gsap';
import { prefersReducedMotion } from '../hooks/useMedia';
import { NAV_ITEMS } from '../data/site';

/**
 * Route transitions: a violet curtain rises from the bottom, the route swaps while
 * it is fully opaque, then the curtain continues upward and reveals the new page.
 * Browser back/forward and reduced-motion users navigate instantly.
 */

interface Ctx {
  go: (to: string) => void;
}
const TransitionContext = createContext<Ctx>({ go: () => undefined });

const labelFor = (path: string) =>
  path === '/join' ? 'Join µLearn' : NAV_ITEMS.find((n) => n.to === path)?.label ?? '';

export const PageTransitionProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const panelRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const busy = useRef(false);
  const current = useRef(location.pathname);
  current.current = location.pathname;

  const go = useCallback(
    (to: string) => {
      const [path] = to.split('#');
      if (busy.current) return;
      if (path === current.current) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const panel = panelRef.current;
      if (!panel || prefersReducedMotion()) {
        navigate(to);
        return;
      }
      busy.current = true;
      if (labelRef.current) labelRef.current.textContent = labelFor(path);

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(panel, { display: 'none', yPercent: 100 });
          busy.current = false;
          ScrollTrigger.refresh();
        },
      });

      tl.set(panel, { display: 'flex', yPercent: 100 })
        .to(panel, { yPercent: 0, duration: 0.65, ease: 'power3.inOut' })
        .add(() => {
          navigate(to);
          window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
        })
        .to({}, { duration: 0.28 }) // let the new route (and lazy chunk) mount behind the curtain
        .add(() => ScrollTrigger.refresh())
        .to(panel, { yPercent: -100, duration: 0.8, ease: 'power3.inOut' });
    },
    [navigate],
  );

  const value = useMemo(() => ({ go }), [go]);

  return (
    <TransitionContext.Provider value={value}>
      {children}
      <div ref={panelRef} className="curtain" aria-hidden="true" style={{ display: 'none' }}>
        <span ref={labelRef} className="curtain__label" />
      </div>
    </TransitionContext.Provider>
  );
};

export const usePageTransition = () => useContext(TransitionContext);

/** Internal link that plays the route transition. Falls back to a normal anchor for modified clicks. */
export const TLink = ({
  to,
  onClick,
  children,
  ...rest
}: { to: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) => {
  const { go } = usePageTransition();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      rest.target === '_blank'
    )
      return;
    e.preventDefault();
    go(to);
  };
  return (
    <a href={to} onClick={handle} {...rest}>
      {children}
    </a>
  );
};
