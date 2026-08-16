export function EnvironmentRenderer() {
  return (
    <div className="dc-environment" aria-hidden="true">
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
