import { createFileRoute } from "@tanstack/react-router";
import { THEMES } from "@/config/themes";
import { useTheme } from "@/components/theme/ThemeProvider";
import { PromptComposer } from "@/components/composer/PromptComposer";
import { SectionContainer } from "@/components/layout/SectionContainer";

export const Route = createFileRoute("/design-system")({
  component: DesignSystem,
  head: () => ({
    meta: [
      { title: "Design System — Daycostra 2027" },
      { name: "description", content: "Canonical tokens, elevation, glass, motion, and controls." },
    ],
  }),
});

const semanticTokens = [
  "--background",
  "--background-deep",
  "--surface-primary",
  "--surface-secondary",
  "--surface-elevated",
  "--accent-primary",
  "--accent-secondary",
  "--accent-soft",
  "--text-primary",
  "--text-secondary",
  "--border-primary",
  "--border-soft",
  "--glow-primary",
  "--fog-primary",
];

function TokenSwatch({ name }: { name: string }) {
  return (
    <div className="glass-card rounded-lg p-3 flex items-center gap-3">
      <div
        className="h-10 w-10 rounded-md shrink-0 hairline"
        style={{ background: `var(${name})` }}
      />
      <div className="min-w-0">
        <div className="font-mono text-xs text-[var(--text-primary)] truncate">{name}</div>
        <div className="text-[10px] text-[var(--text-secondary)]">semantic</div>
      </div>
    </div>
  );
}

function DesignSystem() {
  const { theme, setTheme } = useTheme();
  return (
    <main className="pt-28 pb-20">
      <SectionContainer
        eyebrow="Design system"
        title="One canonical language."
        subtitle="Everything below is powered by live tokens. Switch themes to see the entire system re-cast."
      >
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {THEMES.map((th) => (
            <button
              key={th.id}
              onClick={() => setTheme(th.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium hairline capitalize ${
                theme === th.id
                  ? "bg-[var(--accent-primary)] text-[var(--accent-on)]"
                  : "text-[var(--text-secondary)]"
              }`}
            >
              {th.label}
            </button>
          ))}
        </div>

        <h3 className="text-lg font-semibold mb-4">Semantic color tokens</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-14">
          {semanticTokens.map((t) => (
            <TokenSwatch key={t} name={t} />
          ))}
        </div>

        <h3 className="text-lg font-semibold mb-4">Elevation</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-14">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className={`glass-card rounded-xl p-6 text-center elev-${n}`}>
              <div className="text-xs text-[var(--text-secondary)] mb-1">Elevation</div>
              <div className="text-2xl font-bold">{n}</div>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold mb-4">Typography</h3>
        <div className="glass-card rounded-2xl p-8 mb-14 space-y-4">
          <div
            style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
            className="font-display font-semibold tracking-[-0.03em] leading-none"
          >
            Display / from prompt to product.
          </div>
          <div className="text-2xl font-semibold">Heading — the modern composer.</div>
          <div className="text-base text-[var(--text-secondary)]">
            Body — used for descriptive prose and paragraph copy. Kept legible against every theme.
          </div>
          <div className="font-mono text-xs text-[var(--text-secondary)]">
            mono — JetBrains Mono · system metadata & code
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-4">Buttons</h3>
        <div className="flex flex-wrap gap-3 mb-14">
          <button
            className="rounded-lg px-4 py-2 text-sm font-semibold"
            style={{
              background: "linear-gradient(180deg, var(--accent-secondary), var(--accent-primary))",
              color: "var(--accent-on)",
              boxShadow: "0 4px 20px var(--glow-primary)",
            }}
          >
            Primary action
          </button>
          <button className="rounded-lg px-4 py-2 text-sm font-semibold hairline text-[var(--text-primary)]">
            Secondary
          </button>
          <button className="rounded-lg px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            Ghost
          </button>
        </div>

        <h3 className="text-lg font-semibold mb-4">Prompt Composer</h3>
        <PromptComposer />
      </SectionContainer>
    </main>
  );
}
