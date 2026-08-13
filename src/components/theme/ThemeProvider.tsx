import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type {
  ThemeId,
  MotionDensity,
  ParticleDensity,
  PerformanceMode,
  EnvironmentPreset,
  GlassIntensity,
  ShadowDepth,
} from "@/config/themes";

interface ThemeState {
  theme: ThemeId;
  preset: EnvironmentPreset;
  motion: MotionDensity;
  particles: ParticleDensity;
  performance: PerformanceMode;
  glass: GlassIntensity;
  shadow: ShadowDepth;
}

interface ThemeContextValue extends ThemeState {
  setTheme: (t: ThemeId) => void;
  setPreset: (p: EnvironmentPreset) => void;
  setMotion: (m: MotionDensity) => void;
  setParticles: (p: ParticleDensity) => void;
  setPerformance: (p: PerformanceMode) => void;
  setGlass: (g: GlassIntensity) => void;
  setShadow: (s: ShadowDepth) => void;
  reducedMotion: boolean;
}

const DEFAULTS: ThemeState = {
  theme: "volcanic",
  preset: "cinematic",
  motion: "medium",
  particles: "medium",
  performance: "auto",
  glass: "standard",
  shadow: "standard",
};

const STORAGE_KEY = "daycostra.theme.v1";

const ThemeContext = createContext<ThemeContextValue | null>(null);

function sameThemeState(a: ThemeState, b: ThemeState) {
  return (
    a.theme === b.theme &&
    a.preset === b.preset &&
    a.motion === b.motion &&
    a.particles === b.particles &&
    a.performance === b.performance &&
    a.glass === b.glass &&
    a.shadow === b.shadow
  );
}

function mergeStoredState(current: ThemeState, raw: string | null) {
  if (!raw) return current;
  try {
    const parsed = JSON.parse(raw) as Partial<ThemeState>;
    const next = { ...current, ...parsed };
    return sameThemeState(current, next) ? current : next;
  } catch {
    return current;
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ThemeState>(DEFAULTS);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    try {
      setState((current) => mergeStoredState(current, localStorage.getItem(STORAGE_KEY)));
    } catch {}

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      setState((current) => mergeStoredState(current, event.newValue));
    };

    mq.addEventListener("change", onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      mq.removeEventListener("change", onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  useEffect(() => {
    const el = document.documentElement;
    el.setAttribute("data-theme", state.theme);
    el.setAttribute("data-preset", state.preset);
    el.setAttribute("data-motion", reducedMotion ? "static" : state.motion);
    el.setAttribute("data-particles", state.particles);
    el.setAttribute("data-performance", state.performance);
    el.setAttribute("data-glass", state.glass);
    el.setAttribute("data-shadow", state.shadow);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state, reducedMotion]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      ...state,
      reducedMotion,
      setTheme: (theme) => setState((s) => ({ ...s, theme })),
      setPreset: (preset) => setState((s) => ({ ...s, preset })),
      setMotion: (motion) => setState((s) => ({ ...s, motion })),
      setParticles: (particles) => setState((s) => ({ ...s, particles })),
      setPerformance: (performance) => setState((s) => ({ ...s, performance })),
      setGlass: (glass) => setState((s) => ({ ...s, glass })),
      setShadow: (shadow) => setState((s) => ({ ...s, shadow })),
    }),
    [state, reducedMotion],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be inside ThemeProvider");
  return ctx;
}
