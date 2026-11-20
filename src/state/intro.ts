import { useSyncExternalStore } from 'react';

/**
 * Tiny external store coordinating the loader, the 3D scene and the hero.
 * Lives outside React so pointer/animation-heavy code never triggers re-renders.
 *
 *  loading  → loader visible, waiting for fonts + first rendered 3D frame
 *  opening  → loader "doors" are opening, hero timeline starts
 *  done     → loader removed, page fully interactive
 */
export type IntroPhase = 'loading' | 'opening' | 'done';

interface Snapshot {
  phase: IntroPhase;
  sceneReady: boolean;
  sceneFailed: boolean;
}

let snapshot: Snapshot = { phase: 'loading', sceneReady: false, sceneFailed: false };
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

export const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
export const getSnapshot = () => snapshot;

export const setPhase = (phase: IntroPhase) => {
  if (snapshot.phase === phase) return;
  snapshot = { ...snapshot, phase };
  emit();
};
export const setSceneReady = () => {
  if (snapshot.sceneReady) return;
  snapshot = { ...snapshot, sceneReady: true };
  emit();
};
export const setSceneFailed = () => {
  if (snapshot.sceneFailed) return;
  snapshot = { ...snapshot, sceneFailed: true };
  emit();
};

export const useIntro = () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

/**
 * Mutable values read every frame by the 3D scene (not React state on purpose).
 * `cameraIntro`: 0 = tightly framed, 1 = fully pulled back.
 */
export const sceneRuntime = {
  cameraIntro: 0,
  /** 0..1 – how visible the hero scene is (fades out while scrolling past hero) */
  visibility: 1,
  /** Raw pointer in normalised device coords (-1..1). */
  pointer: { x: 0, y: 0 },
  /** False when the pointer left the window / touch ended — disables push interaction. */
  pointerActive: false,
  heroIntroPlayed: false,
};
