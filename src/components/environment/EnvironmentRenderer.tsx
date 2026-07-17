import { useEffect, useRef } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { ENVIRONMENTS } from "@/config/environments";

const PARTICLE_MULT: Record<string, number> = { off: 0, low: 0.35, medium: 0.7, high: 1.2 };

/**
 * Cinematic environment runtime.
 * Layers (bottom → top):
 *   1. Sky gradient (theme-configured, CSS)
 *   2. Aurora ribbons (aurora only, CSS animated)
 *   3. Far mountain silhouette (SVG)
 *   4. Mid mountain silhouette (SVG, parallax)
 *   5. Lava fissures (volcanic only, CSS)
 *   6. Fog / atmospheric haze
 *   7. Canvas particle field
 *   8. Color grade + vignette
 */
export function EnvironmentRenderer() {
  const { theme, particles, motion, reducedMotion, preset } = useTheme();
  const manifest = ENVIRONMENTS[theme];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  // parallax on scroll
  const rootRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (reducedMotion || preset === "static") return;
    const el = rootRef.current;
    if (!el) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        el.style.setProperty("--scrollY", `${y}px`);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reducedMotion, preset]);

  // canvas particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cfg = manifest.particle;
    const mult = PARTICLE_MULT[particles] ?? 0.7;
    const animate = !(reducedMotion || preset === "static" || motion === "low");

    if (mult === 0) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    let width = 0, height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width; height = rect.height;
      canvas.width = width * dpr; canvas.height = height * dpr;
      const ctx = canvas.getContext("2d");
      ctx?.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const ctx = canvas.getContext("2d")!;
    const count = Math.floor(cfg.count * mult);
    interface P { x: number; y: number; r: number; vx: number; vy: number; a: number; }
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const particlesArr: P[] = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: rand(cfg.size[0], cfg.size[1]),
      vx: rand(cfg.drift[0], cfg.drift[1]) * 0.5,
      vy: rand(cfg.drift[0], cfg.drift[1]),
      a: rand(cfg.opacity[0], cfg.opacity[1]),
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particlesArr) {
        if (animate) {
          p.x += p.vx; p.y += p.vy;
          if (p.y < -5) { p.y = height + 5; p.x = Math.random() * width; }
          if (p.y > height + 5) { p.y = -5; p.x = Math.random() * width; }
          if (p.x < -5) p.x = width + 5;
          if (p.x > width + 5) p.x = -5;
        }
        ctx.beginPath();
        ctx.fillStyle = cfg.color;
        ctx.globalAlpha = p.a;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (animate) rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [theme, particles, motion, reducedMotion, preset, manifest]);

  const showAurora = !!manifest.aurora && preset !== "minimal";
  const showLava = !!manifest.lava && preset !== "minimal";

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ transition: "background 0.9s var(--ease-cinematic)" }}
    >
      {/* Sky */}
      <div
        className="absolute inset-0 env-anim"
        style={{
          background: manifest.sky,
          transform: "translateY(calc(var(--scrollY, 0px) * 0.15))",
          willChange: "transform",
        }}
      />

      {/* Aurora (aurora theme) */}
      {showAurora && (
        <>
          <div
            className="absolute inset-x-0 top-[10%] h-[45%] env-anim"
            style={{
              background: `radial-gradient(ellipse 50% 40% at 30% 50%, ${manifest.aurora!.colors[0]}55, transparent 70%),
                           radial-gradient(ellipse 40% 30% at 65% 40%, ${manifest.aurora!.colors[1]}44, transparent 75%),
                           radial-gradient(ellipse 35% 25% at 80% 55%, ${manifest.aurora!.colors[2]}33, transparent 70%)`,
              filter: "blur(30px)",
              mixBlendMode: "screen",
              animation: "auroraShift 18s var(--ease-cinematic) infinite",
            }}
          />
          {/* starfield */}
          <div
            className="absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                "radial-gradient(1px 1px at 20% 30%, #fff, transparent), radial-gradient(1px 1px at 40% 70%, #fff, transparent), radial-gradient(1px 1px at 60% 20%, #fff9, transparent), radial-gradient(1px 1px at 80% 50%, #fff, transparent), radial-gradient(1px 1px at 10% 80%, #fff8, transparent), radial-gradient(1px 1px at 90% 15%, #fff, transparent), radial-gradient(1px 1px at 50% 90%, #fffa, transparent)",
              backgroundSize: "600px 600px",
            }}
          />
        </>
      )}

      {/* Far mountains */}
      <svg
        className="absolute bottom-0 left-0 w-full h-[55%]"
        viewBox="0 0 1440 500"
        preserveAspectRatio="none"
        style={{ transform: "translateY(calc(var(--scrollY, 0px) * 0.08))" }}
      >
        <path
          d="M0,500 L0,340 L120,240 L220,290 L340,180 L460,260 L580,200 L720,280 L850,190 L980,270 L1120,220 L1260,300 L1440,240 L1440,500 Z"
          fill={manifest.mountains[2]}
          opacity="0.75"
        />
      </svg>

      {/* Mid mountains */}
      <svg
        className="absolute bottom-0 left-0 w-full h-[48%]"
        viewBox="0 0 1440 500"
        preserveAspectRatio="none"
        style={{ transform: "translateY(calc(var(--scrollY, 0px) * 0.04))" }}
      >
        <path
          d="M0,500 L0,380 L100,300 L200,360 L320,260 L440,340 L560,270 L700,350 L820,280 L960,340 L1100,300 L1240,370 L1440,320 L1440,500 Z"
          fill={manifest.mountains[1]}
          opacity="0.9"
        />
      </svg>

      {/* Near ground */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[22%]"
        style={{ background: manifest.ground }}
      />

      {/* Lava fissures */}
      {showLava && (
        <div
          className="absolute inset-x-0 bottom-[8%] h-[24%] env-anim"
          style={{
            background: `radial-gradient(ellipse 20% 4% at 30% 60%, ${manifest.lava!.color}, transparent 70%),
                         radial-gradient(ellipse 15% 3% at 70% 75%, ${manifest.lava!.color}dd, transparent 70%),
                         radial-gradient(ellipse 10% 2% at 50% 85%, ${manifest.lava!.color}, transparent 70%)`,
            filter: "blur(6px)",
            mixBlendMode: "screen",
            animation: "envPulse 6s ease-in-out infinite",
          }}
        />
      )}

      {/* Fog */}
      <div
        className="absolute inset-x-0 bottom-0 h-[45%]"
        style={{
          background: `linear-gradient(180deg, transparent, ${
            theme === "cryogenic" ? "rgba(220,236,250,0.5)" : "var(--fog-primary)"
          })`,
        }}
      />

      {/* Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Color grade */}
      <div className="absolute inset-0" style={{ background: "var(--env-grade)" }} />
      {/* Vignette / readability */}
      <div className="absolute inset-0" style={{ background: "var(--env-vignette)", opacity: 0.6 }} />
    </div>
  );
}
