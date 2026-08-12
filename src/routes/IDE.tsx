import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/IDE")({
  component: LegacyIdeRedirect,
});

function LegacyIdeRedirect() {
  return <Navigate to="/ide" search={{}} replace />;
}
