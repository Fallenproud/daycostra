import type { ThemeId } from "./themes";

export interface EnvironmentManifest {
  /** stacked CSS gradients rendered as sky layers */
  sky: string;
  /** SVG mountain silhouette color triplet: [near, mid, far] */
  mountains: [string, string, string];
  /** ground/water color */
  ground: string;
  /** particle appearance */
  particle: {
    color: string;
    size: [number, number];
    count: number;
    drift: [number, number];
    opacity: [number, number];
  };
  /** optional aurora ribbons (aurora only) */
  aurora?: { colors: string[] };
  /** optional lava fissures (volcanic only) */
  lava?: { color: string };
  focalPoint: {
    desktop: { x: number; y: number };
    tablet: { x: number; y: number };
    mobile: { x: number; y: number };
  };
}

export const ENVIRONMENTS: Record<ThemeId, EnvironmentManifest> = {
  volcanic: {
    sky: `
      radial-gradient(ellipse 90% 60% at 78% 22%, rgba(255,140,50,0.35), transparent 55%),
      radial-gradient(ellipse 60% 40% at 20% 30%, rgba(180,40,10,0.28), transparent 60%),
      linear-gradient(180deg, #0a0509 0%, #180804 45%, #2a0d05 70%, #ff5a0a22 100%)
    `,
    mountains: ["#02030a", "#0a0710", "#1a0f18"],
    ground: "linear-gradient(180deg, #1a0805 0%, #05020a 100%)",
    particle: {
      color: "#ff8848",
      size: [1, 3],
      count: 90,
      drift: [-0.15, -0.6],
      opacity: [0.3, 0.9],
    },
    lava: { color: "#ff6b1a" },
    focalPoint: { desktop: { x: 50, y: 55 }, tablet: { x: 50, y: 60 }, mobile: { x: 50, y: 65 } },
  },
  cryogenic: {
    sky: `
      radial-gradient(ellipse 90% 60% at 82% 30%, rgba(255,240,220,0.55), transparent 55%),
      radial-gradient(ellipse 60% 50% at 18% 25%, rgba(180,215,245,0.5), transparent 60%),
      linear-gradient(180deg, #dfeeff 0%, #c8dff5 45%, #a8c8e8 100%)
    `,
    mountains: ["#e6f0fa", "#c9dcee", "#a8c1d8"],
    ground: "linear-gradient(180deg, #cfe1f2 0%, #a4c1db 100%)",
    particle: {
      color: "#ffffff",
      size: [1, 4],
      count: 80,
      drift: [-0.2, 0.4],
      opacity: [0.4, 0.95],
    },
    focalPoint: { desktop: { x: 50, y: 50 }, tablet: { x: 50, y: 55 }, mobile: { x: 50, y: 60 } },
  },
  aurora: {
    sky: `
      radial-gradient(ellipse 100% 70% at 50% 15%, rgba(124,92,255,0.22), transparent 60%),
      radial-gradient(ellipse 70% 50% at 20% 40%, rgba(56,189,248,0.18), transparent 65%),
      linear-gradient(180deg, #04041a 0%, #0a0a25 50%, #060520 100%)
    `,
    mountains: ["#020212", "#050518", "#0a0a20"],
    ground: "linear-gradient(180deg, #060620 0%, #030315 100%)",
    particle: {
      color: "#a9d7ff",
      size: [1, 2],
      count: 140,
      drift: [-0.05, -0.15],
      opacity: [0.3, 1],
    },
    aurora: { colors: ["#7c5cff", "#38bdf8", "#b45cff"] },
    focalPoint: { desktop: { x: 50, y: 45 }, tablet: { x: 50, y: 50 }, mobile: { x: 50, y: 55 } },
  },
};
