import { createFileRoute } from "@tanstack/react-router";
import { IdeWorkspace } from "@/components/ide/IdeWorkspace";

export const Route = createFileRoute("/ide")({
  component: IdePage,
  head: () => ({
    meta: [
      { title: "Daycostra OS — Studio Playground" },
      {
        name: "description",
        content: "Daycostra OS Studio Playground with a local assistant shell and live application preview.",
      },
    ],
  }),
});

function IdePage() {
  return <IdeWorkspace />;
}
