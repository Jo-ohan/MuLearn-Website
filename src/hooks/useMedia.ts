import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const get = () => (typeof window === 'undefined' ? false : window.matchMedia(query).matches);
  const [matches, setMatches] = useState(get);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');

/** True only for devices with a precise hover-capable pointer (desktop/laptop mice). */
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)');

export type Quality = 'high' | 'medium' | 'low';

/** Rough capability tier used to scale the 3D scene. */
export function useQuality(): Quality {
  const fine = useFinePointer();
  const wide = useMediaQuery('(min-width: 1024px)');
  const tablet = useMediaQuery('(min-width: 700px)');
  if (fine && wide) return 'high';
  if (tablet) return 'medium';
  return 'low';
}

/** Non-hook reduced-motion check for use inside imperative code. */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('webgl'))
    );
  } catch {
    return false;
  }
}
