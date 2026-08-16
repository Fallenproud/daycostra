import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/hero/HeroSection";
import {
  PillarGrid,
  CapabilityGrid,
  AdaptiveResponseStrip,
  InsightTeaser,
  TrustSection,
  FinalCTA,
  SiteFooter,
} from "@/components/sections";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Daycostra — Control the unknown" },
      {
        name: "description",
        content:
          "Sovereign intelligence and controlled response across unpredictable environments.",
      },
    ],
  }),
});

function Home() {
  return (
    <main className="dc-page">
      <HeroSection />
      <PillarGrid />
      <CapabilityGrid />
      <AdaptiveResponseStrip />
      <InsightTeaser />
      <TrustSection />
      <FinalCTA />
      <SiteFooter />
    </main>
  );
}
