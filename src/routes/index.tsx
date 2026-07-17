import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/hero/HeroSection";
import {
  FeatureGrid,
  ProcessTimeline,
  CapabilityShowcase,
  TrustSection,
  FinalCTA,
  SiteFooter,
} from "@/components/sections";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Daycostra 2027 — From prompt to product" },
      {
        name: "description",
        content:
          "Compose context, models, and constraints into production-ready software — instantly, end to end.",
      },
    ],
  }),
});

function Home() {
  return (
    <main>
      <HeroSection />
      <FeatureGrid />
      <ProcessTimeline />
      <CapabilityShowcase />
      <TrustSection />
      <FinalCTA />
      <SiteFooter />
    </main>
  );
}
