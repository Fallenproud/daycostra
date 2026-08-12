import { useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { PromptComposer } from "@/components/composer/PromptComposer";
import { heroCopy, quickSuggestions, builderValues, partners } from "@/config/page-content";

const CHIP_PROMPTS: Record<string, string> = {
  "CRM Dashboard":
    "Build a CRM dashboard with pipeline stages, contact records, and revenue analytics.",
  "SaaS Starter Kit":
    "Build a SaaS starter kit with authentication, billing, and a team workspace.",
  "E-commerce Store": "Build an e-commerce store with product catalog, cart, and checkout.",
  "Landing Page": "Build a high-conversion landing page with hero, social proof, and pricing.",
  "API Service": "Build an API service with typed endpoints, validation, and rate limiting.",
};

export function HeroSection() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const launch = (text: string, modelId: string) => {
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    void navigate({ to: "/ide", search: { prompt: text.trim(), model: modelId } });
  };

  return (
    <section
      id="hero"
      className="relative min-h-[var(--hero-min-h)] flex flex-col items-center justify-center pt-32 pb-16 sm:pt-36 sm:pb-24 px-5 sm:px-8"
    >
      <div className="w-full max-w-[var(--content-max-w)] mx-auto flex flex-col items-center text-center">
        {/* Badge */}
        <div
          className="fade-up inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-6 text-[10.5px] font-semibold uppercase tracking-[0.16em] hairline"
          style={{
            background: "var(--surface-primary)",
            color: "var(--accent-primary)",
            boxShadow: "0 0 30px var(--glow-primary)",
          }}
        >
          <span className="h-1 w-1 rounded-full bg-[var(--accent-primary)]" />
          {heroCopy.badge}
        </div>

        {/* Title */}
        <h1
          className="fade-up font-display font-semibold tracking-[-0.03em] leading-[1] text-[var(--text-primary)]"
          style={{
            fontSize: "clamp(2.5rem, 7vw + 1rem, 6rem)",
            animationDelay: "0.05s",
          }}
        >
          {heroCopy.titleTop}
          <br />
          <span className="text-gradient-accent italic">{heroCopy.titleAccent}</span>
        </h1>

        <p
          className="fade-up mt-6 max-w-[560px] text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed"
          style={{ animationDelay: "0.1s" }}
        >
          {heroCopy.subtitle}
        </p>

        {/* Composer */}
        <div className="fade-up w-full mt-10" style={{ animationDelay: "0.2s" }}>
          <PromptComposer
            value={prompt}
            onTextChange={setPrompt}
            isSubmitting={submitting}
            onSubmit={({ text, modelId }) => launch(text, modelId)}
            onAttach={() => fileInputRef.current?.click()}
            quickChips={
              <div className="flex flex-wrap justify-center gap-2">
                {quickSuggestions.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => setPrompt(CHIP_PROMPTS[s.label] ?? s.label)}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium hairline text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-colors"
                    style={{ background: "var(--surface-secondary)" }}
                  >
                    <span aria-hidden>{s.icon}</span>
                    {s.label}
                  </button>
                ))}
              </div>
            }
          />
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            aria-hidden
            tabIndex={-1}
            onChange={(event) => {
              const names = Array.from(event.target.files ?? []).map((file) => file.name);
              if (names.length) {
                setPrompt(
                  (current) =>
                    `${current}${current ? "\n\n" : ""}Attached context: ${names.join(", ")}`,
                );
              }
              event.target.value = "";
            }}
          />
        </div>

        {/* Builder value strip */}
        <div
          className="fade-up mt-10 grid w-full max-w-[860px] grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3"
          style={{ animationDelay: "0.3s" }}
        >
          {builderValues.map((v) => (
            <div
              key={v.title}
              className="glass-card elev-2 rounded-xl p-3 sm:p-4 flex items-center gap-3 text-left"
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{
                  background: "var(--surface-elevated)",
                  color: "var(--accent-primary)",
                  boxShadow: "inset 0 0 0 1px var(--border-soft)",
                }}
              >
                <v.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-[var(--text-primary)] leading-tight">
                  {v.title}
                </div>
                <div className="text-[11px] text-[var(--text-secondary)] leading-tight mt-0.5">
                  {v.body}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Partners */}
        <div className="fade-up mt-12 w-full max-w-[860px]" style={{ animationDelay: "0.4s" }}>
          <p className="text-[10.5px] uppercase tracking-[0.2em] text-[var(--text-muted)] mb-4">
            Trusted by builders and teams worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3">
            {partners.map((p) => (
              <span
                key={p}
                className="text-sm font-semibold text-[var(--text-secondary)] opacity-70 hover:opacity-100 transition-opacity"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
