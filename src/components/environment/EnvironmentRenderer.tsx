import { useTheme } from "@/components/theme/ThemeProvider";

export function EnvironmentRenderer() {
  const { theme, preset, motion, particles, performance, glass, shadow, reducedMotion } = useTheme();

  return (
    <div
      className="dc-environment"
      aria-hidden="true"
      data-theme={theme}
      data-preset={preset}
      data-motion={reducedMotion ? "static" : motion}
      data-particles={particles}
      data-performance={performance}
      data-glass={glass}
      data-shadow={shadow}
    >
      <div className="dc-environment__base" />
      <div className="dc-environment__scale" />
      <div className="dc-environment__wire" />
      <div className="dc-environment__haze dc-environment__haze--one" />
      <div className="dc-environment__haze dc-environment__haze--two" />
      <div className="dc-environment__grain" />
      <div className="dc-environment__vignette" />
    </div>
  );
}
