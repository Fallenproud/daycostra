import { ClerkProvider } from "@clerk/tanstack-react-start";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useLocation,
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
            onClick={() => {
              router.invalidate();
              reset();
            }}
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
          "Compose context, models, and constraints into production-ready software — instantly, end to end.",
      },
      { name: "author", content: "Daycostra" },
      { property: "og:title", content: "Daycostra 2027 — From prompt to product" },
      {
        property: "og:description",
        content:
          "Compose context, models, and constraints into production-ready software — instantly, end to end.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Daycostra 2027 — From prompt to product" },
      {
        name: "twitter:description",
        content:
          "Compose context, models, and constraints into production-ready software — instantly, end to end.",
      },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/52346c50-ed8a-40ad-8d55-5a00bc0b0dc0/id-preview-5127cb84--8677977c-25c3-459f-91bb-9837b2f3acc9.lovable.app-1784247368081.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/52346c50-ed8a-40ad-8d55-5a00bc0b0dc0/id-preview-5127cb84--8677977c-25c3-459f-91bb-9837b2f3acc9.lovable.app-1784247368081.png",
      },
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
  const location = useLocation();
  const isIdeWorkspace = location.pathname.toLowerCase() === "/ide";

  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          {!isIdeWorkspace && <EnvironmentRenderer />}
          {!isIdeWorkspace && <TopNavigation />}
          {!isIdeWorkspace && <ThemeControlPanel />}
          <Outlet />
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
