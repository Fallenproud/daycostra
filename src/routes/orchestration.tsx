import { createFileRoute } from "@tanstack/react-router";
import { ProductSurface } from "@/components/product/ProductSurface";
import { OrchestrationGraph } from "@/components/product/OrchestrationGraph";

export const Route = createFileRoute("/orchestration")({
  component: OrchestrationPage,
  head: () => ({ meta: [{ title: "Daycostra Orchestration — Preview" }] }),
});

function OrchestrationPage() {
  return (
    <ProductSurface
      eyebrow="Adaptive Response Orchestration"
      title="Make the response path explicit."
      body="A demo-labelled topology of the intended signal → context → policy → routing → approval/action → trace flow."
    >
      <OrchestrationGraph />
      <div className="dc-orchestration-legend">
        <span>Automation path: illustrative</span>
        <span>Human approval: explicit</span>
        <span>Execution: not connected</span>
      </div>
    </ProductSurface>
  );
}
