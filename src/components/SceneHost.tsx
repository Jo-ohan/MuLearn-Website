import { Component, lazy, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { detectWebGL, useQuality, useReducedMotion } from '../hooks/useMedia';
import { sceneRuntime, setSceneFailed, setSceneReady, useIntro } from '../state/intro';

/** The whole 3D bundle (three + R3F) is loaded lazily, off the critical path. */
const SceneCanvas = lazy(() => import('../three/SceneCanvas'));

class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** Pure-CSS stand-in used when WebGL is unavailable or the context is lost. */
const SceneFallback = () => (
  <div className="scene-fallback" aria-hidden="true">
    <span className="sf sf--orb" />
    <span className="sf sf--a" />
    <span className="sf sf--b" />
    <span className="sf sf--c" />
    <span className="sf sf--d" />
  </div>
);

/**
 * Persistent, fixed 3D backdrop shared by every route.
 *  - Home: full-intensity hero scene that fades out as you scroll past the hero
 *    (rendering pauses when invisible).
 *  - Other routes: a quieter ambient version (not rendered on small phones).
 */
export const SceneHost = () => {
  const { pathname } = useLocation();
  const quality = useQuality();
  const reduced = useReducedMotion();
  const { sceneFailed } = useIntro();
  const webgl = useMemo(() => detectWebGL(), []);
  const wrap = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  const mode = pathname === '/' ? 'hero' : 'ambient';
  const skipCanvas = !webgl || sceneFailed || (mode === 'ambient' && quality === 'low');

  // If there is no canvas to wait for, don't hold the loader up.
  useEffect(() => {
    if (!webgl) setSceneFailed();
    else if (skipCanvas) setSceneReady();
  }, [webgl, skipCanvas]);

  // Non-home first loads start from the pulled-back camera.
  useEffect(() => {
    if (pathname !== '/' || reduced) sceneRuntime.cameraIntro = 1;
  }, [pathname, reduced]);

  // Scroll-linked visibility (direct style writes — no re-render per scroll event).
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let ticking = false;
    const update = () => {
      ticking = false;
      const h = window.innerHeight;
      const base = mode === 'hero' ? Math.max(0, 1 - window.scrollY / (h * 0.85)) : 0.4;
      el.style.opacity = String(base);
      const shouldPause = base < 0.01;
      setPaused((p) => (p === shouldPause ? p : shouldPause));
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [mode]);

  return (
    <div ref={wrap} className={`scene scene--${mode}`} aria-hidden="true">
      <div className="scene__glow" />
      {skipCanvas ? (
        webgl && !sceneFailed ? null : <SceneFallback />
      ) : (
        <SceneBoundary onError={setSceneFailed}>
          <Suspense fallback={null}>
            <SceneCanvas mode={mode} quality={quality} reduced={reduced} paused={paused} />
          </Suspense>
        </SceneBoundary>
      )}
      <div className="scene__vignette" />
    </div>
  );
};
