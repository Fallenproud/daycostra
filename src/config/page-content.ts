import {
  Zap,
  Boxes,
  ShieldCheck,
  Sparkles,
  Workflow,
  Bot,
  Database,
  FileCode2,
  Lock,
} from "lucide-react";

export const nav = {
  primary: [
    { label: "Product", href: "#product" },
    { label: "Solutions", href: "#solutions" },
    { label: "Templates", href: "#templates" },
    { label: "Pricing", href: "#pricing" },
    { label: "Resources", href: "#resources" },
    { label: "Company", href: "#company" },
  ],
};

export const heroCopy = {
  badge: "AI-NATIVE · PROMPT COMPOSER",
  titleTop: "From prompt",
  titleAccent: "to product.",
  subtitle:
    "Daycostra composes context, models, and constraints into production-ready software — instantly, and end to end.",
};

export const quickSuggestions = [
  { label: "CRM Dashboard", icon: "📊" },
  { label: "SaaS Starter Kit", icon: "⚡" },
  { label: "E-commerce Store", icon: "🛍" },
  { label: "Landing Page", icon: "🎯" },
  { label: "API Service", icon: "🔌" },
];

export const builderValues = [
  { title: "Understand", body: "AI analyzes your intent.", icon: Sparkles },
  { title: "Plan", body: "Breaks it down smartly.", icon: Boxes },
  { title: "Build", body: "Generate & refine.", icon: Workflow },
  { title: "Deploy", body: "One-click to production.", icon: Zap },
];

export const partners = ["Acme Corp", "Sphere", "Hyperscale", "Penta", "Cloudsmith", "Frames"];

export const features = [
  {
    title: "Faster from first prompt",
    body: "Generate structured, production-ready outputs in seconds — not sprints.",
    icon: Zap,
  },
  {
    title: "Context that scales",
    body: "Compose goals, constraints, audience, and tools so the AI stays on target.",
    icon: Boxes,
  },
  {
    title: "Production-ready output",
    body: "Advanced models, better defaults, and built-in tools for real-world delivery.",
    icon: FileCode2,
  },
  {
    title: "Private by design",
    body: "Your ideas stay yours. Secure, isolated, enterprise-grade privacy.",
    icon: ShieldCheck,
  },
];

export const process = [
  { n: "01", title: "Describe", body: "Share your idea in natural language. Broad or detailed." },
  { n: "02", title: "Compose", body: "Daycostra structures context, tools, and constraints." },
  { n: "03", title: "Generate", body: "Production-ready code, docs, UI, workflows, and more." },
  { n: "04", title: "Ship", body: "Refine, iterate, export. Ship with confidence." },
];

export const capabilities = [
  { title: "Prompt Composer", body: "The signature entry surface — modular, keyboard-first, and context-aware.", icon: Sparkles },
  { title: "Workflow Builder", body: "Visually chain agents, data, and models into repeatable pipelines.", icon: Workflow },
  { title: "Agent Coordination", body: "Multiple agents collaborate through structured shared context.", icon: Bot },
  { title: "Structured Context", body: "Goals, audience, constraints, and memory as first-class inputs.", icon: Boxes },
  { title: "Production Export", body: "Deploy, download, or push directly to your existing repo.", icon: Database },
  { title: "Secure Execution", body: "Isolated runtimes, private by default, enterprise-grade.", icon: Lock },
];

export const testimonials = [
  { quote: "Daycostra cut our build cycle in half. Outputs are insanely good out of the gate.", name: "Sarah J.", role: "Head of Product" },
  { quote: "Finally, a prompt tool that thinks in context. It just gets what we're building.", name: "Mike T.", role: "CTO" },
  { quote: "From docs to dashboards, it handles everything. Our new secret weapon.", name: "Priya K.", role: "Director of Engineering" },
];

export const footerColumns = [
  { title: "Product", links: ["Features", "Examples", "Pricing", "Docs"] },
  { title: "Company", links: ["About", "Careers", "Blog", "Contact"] },
  { title: "Resources", links: ["Changelog", "Security", "Privacy", "Terms"] },
];
