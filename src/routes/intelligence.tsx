import { createFileRoute } from "@tanstack/react-router";
import { ProductSurface } from "@/components/product/ProductSurface";

export const Route = createFileRoute("/intelligence")({
  component: IntelligencePage,
  head: () => ({ meta: [{ title: "Daycostra Intelligence — Preview" }] }),
});

function IntelligencePage() {
  return (
    <ProductSurface
      eyebrow="Unified Intelligence Layer"
      title="One governed view across signals and source context."
      body="This preview demonstrates the intended information hierarchy for correlation and investigation without representing synthetic signals as a live feed."
    >
      <div className="dc-radar-preview" role="img" aria-label="Static intelligence visualization preview">
        <div className="dc-radar-preview__rings" aria-hidden="true" />
        <div className="dc-radar-preview__sweep" aria-hidden="true" />
        <span className="dc-radar-dot dc-radar-dot--one" />
        <span className="dc-radar-dot dc-radar-dot--two" />
        <span className="dc-radar-dot dc-radar-dot--three" />
        <div className="dc-radar-preview__legend">
          <span><i className="is-source" /> Source context</span>
          <span><i className="is-candidate" /> Candidate anomaly</span>
          <span><i className="is-review" /> Requires review</span>
        </div>
      </div>
    </ProductSurface>
  );
}
