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
import { TopNavigation } from "@/components/navigation/TopNavigation";
import { Lockup } from "@/components/brand/Lockup";

const themeBootScript = `(() => {
  try {
    const match = document.cookie.match(/(?:^|; )daycostra-theme=(dark|light)/);
    const theme = match?.[1] || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.setAttribute('data-site-theme', theme);
  } catch {
    document.documentElement.setAttribute('data-site-theme', 'dark');
  }
})();`;

function NotFoundComponent() {
  return (
    <main className="dc-page dc-system-page">
      <div className="dc-system-card dc-glass dc-elev-7">
        <Lockup markSize={42} />
        <div className="dc-kicker">404 · outside the mapped surface</div>
        <h1>Even here, control the unknown.</h1>
        <p>The requested route is not part of the current Daycostra frontend.</p>
        <Link to="/" className="dc-button dc-button--primary">Return home</Link>
      </div>
    </main>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <main className="dc-page dc-system-page">
      <div className="dc-system-card dc-glass dc-elev-7">
        <Lockup markSize={42} />
        <div className="dc-kicker">Frontend boundary</div>
        <h1>This surface did not load.</h1>
        <p>The error was captured. You can retry the route without implying that the underlying operation succeeded.</p>
        <div className="dc-system-actions">
          <button
            type="button"
            className="dc-button dc-button--primary"
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            Try again
          </button>
          <Link to="/" className="dc-button dc-button--outline">Return home</Link>
        </div>
      </div>
    </main>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Daycostra — Control the unknown" },
      {
        name: "description",
        content: "Sovereign intelligence and controlled response across unpredictable environments.",
      },
      { name: "author", content: "Daycostra" },
      { property: "og:title", content: "Daycostra — Control the unknown" },
      {
        property: "og:description",
        content: "Detect meaningful change, unify operational context and orchestrate accountable response.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Daycostra — Control the unknown" },
      {
        name: "twitter:description",
        content: "Detect meaningful change, unify operational context and orchestrate accountable response.",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
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
    <html lang="en" data-theme="volcanic" data-site-theme="dark">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
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
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {!isIdeWorkspace && <EnvironmentRenderer />}
        {!isIdeWorkspace && <TopNavigation />}
        <Outlet />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
