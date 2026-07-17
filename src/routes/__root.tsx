import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { EnvironmentRenderer } from "@/components/environment/EnvironmentRenderer";
import { ThemeControlPanel } from "@/components/theme/ThemeControlPanel";
import { TopNavigation } from "@/components/navigation/TopNavigation";

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="max-w-md text-center glass-panel elev-4 rounded-2xl p-10">
        <h1 className="text-6xl font-bold text-[var(--text-primary)]">404</h1>
        <h2 className="mt-3 text-lg font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold"
          style={{
            background: "linear-gradient(180deg, var(--accent-secondary), var(--accent-primary))",
            color: "var(--accent-on)",
          }}
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="max-w-md text-center glass-panel elev-4 rounded-2xl p-10">
        <h1 className="text-xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Something went wrong. Try again or head home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-md px-4 py-2 text-sm font-semibold"
            style={{
              background: "linear-gradient(180deg, var(--accent-secondary), var(--accent-primary))",
              color: "var(--accent-on)",
            }}
          >
            Try again
          </button>
          <a href="/" className="rounded-md hairline px-4 py-2 text-sm font-semibold">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Daycostra 2027 — From prompt to product" },
      {
        name: "description",
        content:
          "Daycostra is the canonical prompt composer for engineering, product, and operations teams — from idea to production, instantly.",
      },
      { name: "author", content: "Daycostra" },
      { property: "og:title", content: "Daycostra 2027 — From prompt to product" },
      {
        property: "og:description",
        content:
          "The modern prompt-to-product surface. Cinematic, structured, production-ready.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://rsms.me" },
      { rel: "stylesheet", href: "https://rsms.me/inter/inter.css" },
      {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-sans/style.css",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="volcanic">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <EnvironmentRenderer />
        <TopNavigation />
        <ThemeControlPanel />
        <Outlet />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
