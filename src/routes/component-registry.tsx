import { createFileRoute } from "@tanstack/react-router";
import { SectionContainer } from "@/components/layout/SectionContainer";

export const Route = createFileRoute("/component-registry")({
  component: Registry,
  head: () => ({
    meta: [
      { title: "Component Registry — Daycostra 2027" },
      { name: "description", content: "Canonical components, contracts, and states." },
    ],
  }),
});

interface Entry {
  name: string;
  purpose: string;
  props: string;
  states: string[];
  backend: string;
}

const registry: Entry[] = [
  {
    name: "TopNavigation",
    purpose: "Primary site navigation with adaptive glass surface.",
    props: "—",
    states: ["idle", "scrolled", "mobile-open"],
    backend: "auth session, workspace selector",
  },
  {
    name: "HeroSection",
    purpose: "Canonical hero composition with badge, title, composer, value strip, partners.",
    props: "—",
    states: ["default", "reduced-motion"],
    backend: "hero copy from CMS-shape config",
  },
  {
    name: "PromptComposer",
    purpose: "Signature command surface. Text input + attachments + model + generate.",
    props: "models, activeModelId, onSubmit, onAttach, onVoiceInput, isSubmitting",
    states: ["idle", "focus", "typing", "drag-over", "submitting", "disabled", "error"],
    backend: "prompt submission, model registry, attachments upload",
  },
  {
    name: "ThemeProvider",
    purpose:
      "Runtime theme + environment state via context + localStorage + prefers-reduced-motion.",
    props: "children",
    states: ["hydrating", "hydrated", "reduced-motion"],
    backend: "user preferences persistence",
  },
  {
    name: "EnvironmentRenderer",
    purpose: "Layered cinematic background: sky, mountains, fog, particles, grade, vignette.",
    props: "—",
    states: ["cinematic", "balanced", "minimal", "static"],
    backend: "—",
  },
  {
    name: "ThemeControlPanel",
    purpose: "Floating control surface for theme, motion, particles, glass, shadow, performance.",
    props: "—",
    states: ["collapsed", "expanded"],
    backend: "—",
  },
  {
    name: "FeatureGrid",
    purpose: "Four-up builder value proposition.",
    props: "—",
    states: ["default"],
    backend: "content config",
  },
  {
    name: "ProcessTimeline",
    purpose: "Four-step describe → compose → generate → ship sequence.",
    props: "—",
    states: ["default"],
    backend: "content config",
  },
  {
    name: "CapabilityShowcase",
    purpose: "Six capability cards with meaningful product surfaces.",
    props: "—",
    states: ["default", "hover"],
    backend: "capability catalog",
  },
  {
    name: "TrustSection",
    purpose: "Testimonials + partner marks.",
    props: "—",
    states: ["default"],
    backend: "testimonial CMS",
  },
  {
    name: "FinalCTA",
    purpose: "High-value conversion surface.",
    props: "—",
    states: ["default"],
    backend: "signup / demo booking",
  },
  {
    name: "SiteFooter",
    purpose: "Structural footer with columns + social.",
    props: "—",
    states: ["default"],
    backend: "—",
  },
];

function Registry() {
  return (
    <main className="pt-28 pb-20">
      <SectionContainer
        eyebrow="Component registry"
        title="The canonical inventory."
        subtitle="Every surface below is composed from these primitives. Contracts are typed and backend-ready."
      >
        <div className="overflow-hidden rounded-2xl glass-card elev-2">
          <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-[var(--border-soft)] text-[10.5px] uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
            <div className="col-span-3">Component</div>
            <div className="col-span-4">Purpose</div>
            <div className="col-span-3">States</div>
            <div className="col-span-2">Backend hooks</div>
          </div>
          {registry.map((e) => (
            <div
              key={e.name}
              className="grid grid-cols-12 gap-4 px-4 py-4 border-b border-[var(--border-soft)] last:border-0 text-sm items-start"
            >
              <div className="col-span-3">
                <div className="font-mono font-semibold text-[var(--text-primary)]">{e.name}</div>
                {e.props !== "—" && (
                  <div className="mt-1 font-mono text-[10px] text-[var(--text-muted)] leading-relaxed">
                    {e.props}
                  </div>
                )}
              </div>
              <div className="col-span-4 text-[var(--text-secondary)] leading-relaxed">
                {e.purpose}
              </div>
              <div className="col-span-3 flex flex-wrap gap-1">
                {e.states.map((s) => (
                  <span
                    key={s}
                    className="rounded-full px-2 py-0.5 text-[10px] font-medium hairline text-[var(--text-secondary)]"
                    style={{ background: "var(--surface-secondary)" }}
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="col-span-2 text-[11px] text-[var(--text-muted)] leading-relaxed">
                {e.backend}
              </div>
            </div>
          ))}
        </div>
      </SectionContainer>
    </main>
  );
}
