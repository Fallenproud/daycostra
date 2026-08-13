import { createFileRoute } from "@tanstack/react-router";
import { getAgentOsReadiness } from "@/lib/runtime/agentos-readiness.server";

export const Route = createFileRoute("/api/runtime/health")({
  server: {
    handlers: {
      GET: async () => {
        const status = await getAgentOsReadiness();
        return Response.json(status, {
          status: 200,
          headers: { "cache-control": "no-store" },
        });
      },
    },
  },
});
