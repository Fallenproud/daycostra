export type ThemeId = "volcanic" | "cryogenic" | "aurora";
export type MotionDensity = "low" | "medium" | "high";
export type ParticleDensity = "off" | "low" | "medium" | "high";
export type PerformanceMode = "auto" | "quality" | "balanced" | "efficiency" | "static";
export type EnvironmentPreset = "cinematic" | "balanced" | "minimal" | "static";
export type GlassIntensity = "soft" | "standard" | "dense";
export type ShadowDepth = "shallow" | "standard" | "deep";

export interface ThemeMeta {
  id: ThemeId;
  label: string;
  tagline: string;
  swatches: [string, string, string];
}

export const THEMES: ThemeMeta[] = [
  {
    id: "volcanic",
    label: "Volcanic",
    tagline: "Molten obsidian. Warm directional light. Deep contrast.",
    swatches: ["#03070b", "#ff5a0a", "#ffb066"],
  },
  {
    id: "cryogenic",
    label: "Cryogenic",
    tagline: "Frozen lake. Crystalline glass. Cool alpine daylight.",
    swatches: ["#eaf4ff", "#2779ff", "#b9dcff"],
  },
  {
    id: "aurora",
    label: "Aurora",
    tagline: "Midnight sky. Spectral drift. Celestial depth.",
    swatches: ["#040612", "#7c5cff", "#38bdf8"],
  },
];
