import { createFileRoute } from "@tanstack/react-router";
import { IdeWorkspace } from "@/components/ide/IdeWorkspace";

export const Route = createFileRoute("/ide")({
  validateSearch: (search: Record<string, unknown>): { prompt?: string; model?: string } => {
    const parsed: { prompt?: string; model?: string } = {};
    if (typeof search.prompt === "string" && search.prompt.trim()) {
      parsed.prompt = search.prompt.slice(0, 2000);
    }
    if (typeof search.model === "string" && search.model.trim()) {
      parsed.model = search.model.slice(0, 64);
    }
    return parsed;
  },
  component: IdePage,
  head: () => ({
    meta: [
      { title: "Daycostra OS — Studio Playground" },
      {
        name: "description",
        content: "Daycostra OS Studio Playground with a local assistant shell and live application preview.",
      },
      { property: "og:title", content: "Daycostra OS — Studio Playground" },
      {
        property: "og:description",
        content: "Run local instructions against a live application preview inside the Daycostra environment.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function IdePage() {
  const { prompt, model } = Route.useSearch();
  return <IdeWorkspace initialPrompt={prompt} initialModel={model} />;
}
