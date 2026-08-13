import { Link } from "@tanstack/react-router";
import { SectionContainer } from "@/components/layout/SectionContainer";
import {
  features,
  capabilities,
  process,
  testimonials,
  partners,
  footerColumns,
} from "@/config/page-content";
import { Sparkles, Twitter, Github, Linkedin, ArrowRight } from "lucide-react";

export function FeatureGrid() {
  return (
    <SectionContainer
      id="product"
      eyebrow="Built for builders"
      title="Everything you need to ship."
      subtitle="Modern components. Powerful patterns. Infinite possibilities."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((f) => (
          <div
            key={f.title}
            className="glass-card elev-2 rounded-2xl p-6 group hover:elev-3 transition-shadow"
          >
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl mb-5"
              style={{
                background: "var(--surface-elevated)",
                color: "var(--accent-primary)",
                boxShadow: "inset 0 0 0 1px var(--border-soft), 0 0 20px var(--glow-primary)",
              }}
            >
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1.5">{f.title}</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{f.body}</p>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}

export function ProcessTimeline() {
  return (
    <SectionContainer
      id="how-it-works"
      eyebrow="How it works"
      title="From prompt to production in four steps."
    >
      <div className="relative">
        <div
          className="hidden md:block absolute left-0 right-0 top-6 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--border-primary), var(--accent-primary), var(--border-primary), transparent)",
          }}
        />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {process.map((p, i) => (
            <div key={p.n} className="relative text-center">
              <div
                className="relative z-10 mx-auto flex h-12 w-12 items-center justify-center rounded-full mb-4 font-mono text-sm font-semibold"
                style={{
                  background: "var(--surface-elevated)",
                  color: "var(--accent-primary)",
                  border: "1px solid var(--border-primary)",
                  boxShadow: "0 0 24px var(--glow-primary)",
                }}
              >
                {i + 1}
              </div>
              <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2">{p.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}

export function CapabilityShowcase() {
  return (
    <SectionContainer
      id="capabilities"
      eyebrow="Capabilities"
      title="A composer for every workflow."
      subtitle="Modular surfaces that scale from an inline prompt to an enterprise operations plane."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {capabilities.map((c, i) => (
          <div
            key={c.title}
            className="glass-card elev-2 rounded-2xl p-6 hover:elev-4 transition-all hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between mb-5">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl"
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent-primary)33, var(--surface-elevated))",
                  color: "var(--accent-primary)",
                  boxShadow: "inset 0 0 0 1px var(--border-primary)",
                }}
              >
                <c.icon className="h-5 w-5" />
              </div>
              <span className="font-mono text-[11px] text-[var(--text-muted)]">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{c.title}</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{c.body}</p>
            <div className="mt-5 pt-5 border-t border-[var(--border-soft)] flex items-center gap-1.5 text-xs font-medium text-[var(--accent-primary)] hover:gap-2.5 transition-all cursor-pointer">
              Explore
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}

export function TrustSection() {
  return (
    <SectionContainer id="trust" eyebrow="Trusted by builders">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14">
        {testimonials.map((t) => (
          <figure key={t.name} className="glass-card elev-2 rounded-2xl p-6">
            <blockquote className="text-[15px] leading-relaxed text-[var(--text-primary)]">
              "{t.quote}"
            </blockquote>
            <figcaption className="mt-5 pt-5 border-t border-[var(--border-soft)] flex items-center gap-3">
              <div
                className="h-9 w-9 rounded-full shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
                }}
              />
              <div className="min-w-0">
                <div className="text-sm font-semibold text-[var(--text-primary)]">{t.name}</div>
                <div className="text-xs text-[var(--text-secondary)]">{t.role}</div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4 opacity-70">
        {partners.map((p) => (
          <span key={p} className="text-sm font-bold tracking-wide text-[var(--text-secondary)]">
            {p}
          </span>
        ))}
      </div>
    </SectionContainer>
  );
}

export function FinalCTA() {
  return (
    <section id="get-started" className="relative py-20 sm:py-28 px-5 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[var(--content-max-w)]">
        <div
          className="relative overflow-hidden rounded-3xl p-10 sm:p-14 lg:p-16 text-center"
          style={{
            background: "linear-gradient(135deg, var(--surface-elevated), var(--surface-primary))",
            border: "1px solid var(--border-primary)",
            boxShadow: "var(--elev-5), 0 0 80px var(--glow-primary)",
          }}
        >
          <div
            aria-hidden
            className="absolute -top-1/2 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full opacity-40 blur-3xl"
            style={{
              background: "radial-gradient(circle, var(--accent-primary), transparent 70%)",
            }}
          />
          <div className="relative">
            <h2 className="font-display font-semibold tracking-[-0.02em] text-[var(--text-primary)] text-[clamp(1.75rem,4vw,3rem)] leading-[1.05]">
              Ready to build the future?
            </h2>
            <p className="mt-4 text-[var(--text-secondary)] text-base sm:text-lg max-w-[520px] mx-auto">
              Enter the Daycostra environment and work against a live application preview.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/ide"
                className="inline-flex items-center gap-1.5 rounded-lg px-6 py-3 text-sm font-bold transition-all hover:scale-[1.02]"
                style={{
                  background:
                    "linear-gradient(180deg, var(--accent-secondary), var(--accent-primary))",
                  color: "var(--accent-on)",
                  boxShadow: "0 8px 30px var(--glow-primary)",
                }}
              >
                <Sparkles className="h-4 w-4" />
                Enter the environment
              </Link>
              <a
                href="#demo"
                className="inline-flex items-center gap-1.5 rounded-lg px-6 py-3 text-sm font-semibold text-[var(--text-primary)] hairline hover:bg-[var(--surface-secondary)] transition-colors"
              >
                Book a demo
              </a>
            </div>
            <div className="mt-6 flex flex-wrap justify-center items-center gap-x-5 gap-y-2 text-xs text-[var(--text-secondary)]">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)]" />
                Live homepage preview
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)]" />
                Responsive device modes
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)]" />
                Runtime-ready shell
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative border-t border-[var(--border-soft)] py-14 px-5 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[var(--content-max-w)]">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg italic font-black text-lg"
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
                  color: "var(--accent-on)",
                }}
              >
                D
              </div>
              <span className="text-[15px] font-semibold text-[var(--text-primary)]">
                Daycostra
              </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] max-w-[300px]">
              The canonical prompt-to-product surface for modern teams.
            </p>
          </div>
          {footerColumns.map((col) => (
            <div key={col.title}>
              <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-3">
                {col.title}
              </div>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t border-[var(--border-soft)] flex flex-wrap justify-between items-center gap-4">
          <p className="text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} Daycostra. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            {[Twitter, Github, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="rounded-md p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]"
                aria-label="Social link"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
