import { useState } from "react";
import { Settings2, X, Sparkles, Snowflake, Flame } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { THEMES } from "@/config/themes";
import type {
  EnvironmentPreset,
  MotionDensity,
  ParticleDensity,
  PerformanceMode,
  GlassIntensity,
  ShadowDepth,
  ThemeId,
} from "@/config/themes";
import { cn } from "@/lib/utils";

const themeIcon: Record<ThemeId, typeof Flame> = {
  volcanic: Flame,
  cryogenic: Snowflake,
  aurora: Sparkles,
};

function Row<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--text-secondary)]">
        {label}
      </div>
      <div className="flex flex-wrap gap-1 rounded-lg bg-[var(--surface-secondary)] p-1 hairline">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={cn(
              "flex-1 min-w-0 rounded-md px-2 py-1.5 text-xs font-medium capitalize transition-colors",
              value === o
                ? "bg-[var(--accent-primary)] text-[var(--accent-on)] shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ThemeControlPanel() {
  const t = useTheme();
  const [open, setOpen] = useState(false);
  const Icon = themeIcon[t.theme];

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open theme controls"
          className="glass-panel elev-3 flex items-center gap-2 rounded-full px-3.5 py-2.5 text-sm font-medium text-[var(--text-primary)] transition-all hover:scale-[1.02]"
        >
          <Icon className="h-4 w-4 text-[var(--accent-primary)]" />
          <span className="capitalize hidden sm:inline">{t.theme}</span>
          <Settings2 className="h-3.5 w-3.5 opacity-60" />
        </button>
      ) : (
        <div
          role="dialog"
          aria-label="Theme controls"
          className="glass-panel elev-5 w-[300px] sm:w-[340px] max-h-[80dvh] overflow-y-auto rounded-2xl p-4 fade-up"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-[var(--text-secondary)]">
                Environment
              </div>
              <div className="text-sm font-semibold">Daycostra Control</div>
            </div>
            <button
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="rounded-full p-1.5 text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Theme picker */}
          <div className="space-y-1.5 mb-3">
            <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--text-secondary)]">
              Theme
            </div>
            <div className="grid grid-cols-3 gap-2">
              {THEMES.map((th) => {
                const active = th.id === t.theme;
                const ThIcon = themeIcon[th.id];
                return (
                  <button
                    key={th.id}
                    onClick={() => t.setTheme(th.id)}
                    className={cn(
                      "group relative overflow-hidden rounded-lg p-2 text-left transition-all hairline",
                      active ? "ring-2 ring-[var(--accent-primary)] elev-2" : "hover:elev-1",
                    )}
                    style={{
                      background: `linear-gradient(135deg, ${th.swatches[0]}, ${th.swatches[1]}66)`,
                    }}
                  >
                    <ThIcon className="h-4 w-4 text-white mb-1 drop-shadow" />
                    <div className="text-[11px] font-semibold text-white drop-shadow">
                      {th.label}
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] pt-1">
              {THEMES.find((th) => th.id === t.theme)?.tagline}
            </p>
          </div>

          <div className="space-y-3">
            <Row<EnvironmentPreset>
              label="Preset"
              value={t.preset}
              options={["cinematic", "balanced", "minimal", "static"]}
              onChange={t.setPreset}
            />
            <Row<MotionDensity>
              label="Motion"
              value={t.motion}
              options={["low", "medium", "high"]}
              onChange={t.setMotion}
            />
            <Row<ParticleDensity>
              label="Particles"
              value={t.particles}
              options={["off", "low", "medium", "high"]}
              onChange={t.setParticles}
            />
            <Row<PerformanceMode>
              label="Performance"
              value={t.performance}
              options={["auto", "quality", "balanced", "efficiency", "static"]}
              onChange={t.setPerformance}
            />
            <Row<GlassIntensity>
              label="Glass"
              value={t.glass}
              options={["soft", "standard", "dense"]}
              onChange={t.setGlass}
            />
            <Row<ShadowDepth>
              label="Shadow"
              value={t.shadow}
              options={["shallow", "standard", "deep"]}
              onChange={t.setShadow}
            />
          </div>

          {t.reducedMotion && (
            <p className="mt-3 rounded-md bg-[var(--surface-secondary)] p-2 text-[11px] text-[var(--text-secondary)]">
              Reduced-motion is on — ambient animation paused.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
