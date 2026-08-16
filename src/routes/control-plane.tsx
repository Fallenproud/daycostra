import { createFileRoute } from "@tanstack/react-router";
import { Activity, Database, LockKeyhole, Workflow } from "lucide-react";
import { ProductSurface } from "@/components/product/ProductSurface";
import { PlatformStack } from "@/components/product/PlatformStack";

export const Route = createFileRoute("/control-plane")({
  component: ControlPlanePage,
  head: () => ({ meta: [{ title: "Daycostra Control Plane — Preview" }] }),
});

function ControlPlanePage() {
  return (
    <ProductSurface
      eyebrow="Control Plane"
      title="Govern the operating loop."
      body="A preview of the surface intended to make source state, orchestration boundaries and action authority visible in one place."
    >
      <div className="dc-preview-status-grid">
        <div><Activity size={16} /><span>Runtime telemetry</span><strong>Not connected</strong></div>
        <div><Database size={16} /><span>Source registry</span><strong>Preview only</strong></div>
        <div><Workflow size={16} /><span>Execution state</span><strong>No live runs</strong></div>
        <div><LockKeyhole size={16} /><span>Authority</span><strong>Static policy view</strong></div>
      </div>
      <PlatformStack compact />
    </ProductSurface>
  );
}
