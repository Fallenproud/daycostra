import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Sparkles } from "lucide-react";
import { nav } from "@/config/page-content";
import { cn } from "@/lib/utils";

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 group" aria-label="Daycostra home">
      <div
        className="relative flex h-8 w-8 items-center justify-center rounded-lg"
        style={{
          background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
          boxShadow: "0 0 20px var(--glow-primary)",
        }}
      >
        <span className="text-[var(--accent-on)] font-black text-lg leading-none italic">D</span>
      </div>
      <span className="text-[15px] font-semibold tracking-tight text-[var(--text-primary)]">
        Daycostra
      </span>
    </Link>
  );
}

export function TopNavigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-40 transition-all duration-500",
        scrolled ? "py-2" : "py-4",
      )}
    >
      <div className="mx-auto max-w-[var(--shell-max-w)] px-5 sm:px-8 lg:px-12">
        <div
          className={cn(
            "flex items-center justify-between rounded-2xl px-4 sm:px-5 py-2.5 transition-all",
            scrolled ? "glass-nav elev-2" : "bg-transparent",
          )}
        >
          <Logo />

          <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
            {nav.primary.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-md px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#login"
              className="hidden sm:inline-flex rounded-md px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Log in
            </a>
            <Link
              to="/ide"
              className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition-all hover:scale-[1.02] elev-2"
              style={{
                background:
                  "linear-gradient(180deg, var(--accent-secondary), var(--accent-primary))",
                color: "var(--accent-on)",
                boxShadow: "0 0 24px var(--glow-primary), var(--elev-2)",
              }}
            >
              Enter environment
              <Sparkles className="h-3.5 w-3.5" />
            </Link>
            <button
              className="lg:hidden rounded-md p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden mt-2 glass-panel elev-4 rounded-2xl p-3 fade-up">
            <nav className="flex flex-col" aria-label="Mobile">
              {nav.primary.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-sm text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]"
                >
                  {item.label}
                </a>
              ))}
              <Link
                to="/ide"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-[var(--accent-primary)] hover:bg-[var(--surface-secondary)]"
              >
                Studio playground
              </Link>
              <a
                href="#login"
                onClick={() => setOpen(false)}
                className="mt-1 border-t border-[var(--border-soft)] pt-3 rounded-md px-3 py-2.5 text-sm text-[var(--text-secondary)]"
              >
                Log in
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
