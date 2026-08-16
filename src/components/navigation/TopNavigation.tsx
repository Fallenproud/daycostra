import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useLocation } from "@tanstack/react-router";
import { Lockup } from "@/components/brand/Lockup";
import { mainNav } from "@/config/site";
import { cn } from "@/lib/utils";

type SiteTheme = "dark" | "light";
const COOKIE_NAME = "daycostra-theme";

function readThemeCookie(): SiteTheme | null {
  if (typeof document === "undefined") return null;
  const raw = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`));
  const value = raw?.split("=")[1];
  return value === "light" || value === "dark" ? value : null;
}

function applyTheme(theme: SiteTheme) {
  document.documentElement.setAttribute("data-site-theme", theme);
}

export function TopNavigation() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<SiteTheme>("dark");

  useEffect(() => {
    const explicit = readThemeCookie();
    const initial = explicit ?? (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    setTheme(initial);
    applyTheme(initial);

    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    document.cookie = `${COOKIE_NAME}=${next}; Max-Age=31536000; Path=/; SameSite=Lax`;
  };

  return (
    <header className={cn("dc-header", scrolled && "dc-header--scrolled")}>
      <div className="dc-shell dc-header__inner">
        <a href="/" className="dc-header__brand" aria-label="Daycostra home">
          <Lockup markSize={36} />
        </a>

        <nav className="dc-header__nav" aria-label="Primary navigation">
          {mainNav.map((item) => {
            const active = location.pathname === item.href || location.pathname.startsWith(`${item.href}/`);
            return (
              <a key={item.href} href={item.href} className={cn("dc-nav-link", active && "is-active")}>
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="dc-header__actions">
          <button
            type="button"
            className="dc-theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            aria-pressed={theme === "light"}
          >
            <span className="dc-theme-toggle__thumb" data-theme={theme}>
              {theme === "dark" ? <Moon size={12} /> : <Sun size={12} />}
            </span>
          </button>
          <a href="/contact?intent=request-access" className="dc-button dc-button--outline dc-request-access">
            Request Access
          </a>
          <button
            type="button"
            className="dc-mobile-toggle"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="dc-shell dc-mobile-menu">
          <nav aria-label="Mobile navigation">
            {mainNav.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </a>
            ))}
            <a href="/contact?intent=request-access" onClick={() => setOpen(false)}>
              Request Platform Access
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
