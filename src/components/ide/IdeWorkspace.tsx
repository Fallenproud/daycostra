import { useEffect, useMemo, useRef, useState } from "react";
import {
  AppWindow,
  Bell,
  Bot,
  Boxes,
  Check,
  ChevronDown,
  ChevronLeft,
  CircleUserRound,
  Code2,
  Database,
  ExternalLink,
  GitBranch,
  Grid2X2,
  Laptop,
  MessageSquare,
  Monitor,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Pin,
  Play,
  RefreshCw,
  Send,
  Settings,
  ShieldCheck,
  Smartphone,
  Sparkles,
  SquareTerminal,
  Tablet,
  Workflow,
  X,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/ThemeProvider";

type DeviceMode = "desktop" | "tablet" | "mobile";
type RunStatus = "working" | "completed" | "queued";
type StageState = "pending" | "active" | "done";

interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  body: string;
  meta?: string;
}

interface RunStage {
  label: string;
  state: StageState;
}

interface LocalRun {
  id: number;
  status: RunStatus;
  label: string;
  stages: RunStage[];
}

const DEVICE_WIDTH: Record<DeviceMode, number | string> = {
  desktop: "100%",
  tablet: 820,
  mobile: 390,
};

const RAIL_ITEMS = [
  { id: "overview", label: "Overview", icon: Grid2X2 },
  { id: "assistant", label: "Assistant", icon: MessageSquare },
  { id: "projects", label: "Projects", icon: Boxes },
  { id: "workflows", label: "Workflows", icon: GitBranch },
  { id: "data", label: "Data", icon: Database },
  { id: "terminal", label: "Terminal", icon: SquareTerminal },
] as const;

type RailId = (typeof RAIL_ITEMS)[number]["id"];

const RAIL_DETAIL: Record<Exclude<RailId, "assistant">, { title: string; body: string; rows: string[] }> = {
  overview: {
    title: "Overview",
    body: "Local snapshot of this workspace session.",
    rows: ["Environment · live theme tokens", "Preview target · Daycostra homepage", "Runtime · local shell executor"],
  },
  projects: {
    title: "Projects",
    body: "Project registry is provided by the Daycostra runtime.",
    rows: ["Project Aurora · current", "Volcanic launch site · archived", "Cryogenic docs · archived"],
  },
  workflows: {
    title: "Workflows",
    body: "Chain agents, data, and models into repeatable pipelines.",
    rows: ["Compose → Generate → Review", "Design token sync", "Preview smoke check"],
  },
  data: {
    title: "Data",
    body: "No datasource is connected to this local shell.",
    rows: ["Structured context · in-memory", "Attachments · session only", "Vector memory · not connected"],
  },
  terminal: {
    title: "Terminal",
    body: "Local command surface mirrored from the assistant.",
    rows: ["volcanic · cryogenic · aurora", "refresh preview", "open preview"],
  },
};

const BASE_STAGES = ["Interpreting intent", "Designing action", "Updating preview"];

function timeLabel() {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function detectLocalCommand(input: string) {
  const value = input.trim().toLowerCase();
  if (value.includes("volcanic")) return { type: "theme" as const, theme: "volcanic" as const };
  if (value.includes("cryogenic")) return { type: "theme" as const, theme: "cryogenic" as const };
  if (value.includes("aurora")) return { type: "theme" as const, theme: "aurora" as const };
  if (value === "refresh" || value.includes("refresh preview") || value.includes("reload preview")) {
    return { type: "refresh" as const };
  }
  if (value === "open" || value.includes("open preview") || value.includes("open homepage")) {
    return { type: "open" as const };
  }
  return { type: "queue" as const };
}

function DaycostraMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative grid h-9 w-9 shrink-0 place-items-center rounded-[10px] border border-orange-500/60 bg-black/60 shadow-[0_0_28px_rgba(255,92,27,0.18)]">
        <span className="font-black italic tracking-[-0.12em] text-orange-500">D</span>
        <span className="absolute left-1.5 h-px w-2 bg-orange-500/80" />
      </div>
      {!compact && (
        <div className="leading-none">
          <span className="text-[14px] font-semibold tracking-[0.15em] text-white">DAYCOSTRA</span>
          <span className="ml-1.5 text-[9px] font-bold tracking-[0.18em] text-violet-300">OS</span>
        </div>
      )}
    </div>
  );
}

function RailButton({
  label,
  active,
  children,
  onClick,
}: {
  label: string;
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        "group relative grid h-12 w-12 place-items-center rounded-xl text-zinc-500 transition-colors hover:bg-white/[0.04] hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/70",
        active && "bg-white/[0.035] text-violet-200",
      )}
    >
      {active && <span className="absolute -left-[14px] h-8 w-0.5 rounded-full bg-orange-500" />}
      {children}
    </button>
  );
}

function StatusDot({ state }: { state: StageState }) {
  if (state === "done") {
    return (
      <span className="grid h-5 w-5 place-items-center rounded-full text-zinc-400">
        <Check className="h-4 w-4" />
      </span>
    );
  }
  return (
    <span
      className={cn(
        "h-2 w-2 rounded-full",
        state === "active" ? "bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.7)]" : "bg-violet-300/80",
      )}
    />
  );
}

function RunCard({ run }: { run: LocalRun }) {
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-white/[0.08] bg-black/35">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-3.5 py-3">
        <div>
          <div className="text-[12px] font-semibold text-zinc-100">{run.label}</div>
          <div className="mt-0.5 text-[9px] uppercase tracking-[0.14em] text-zinc-500">Local execution · Run {String(run.id).padStart(3, "0")}</div>
        </div>
        <span
          className={cn(
            "rounded-full border px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em]",
            run.status === "completed" && "border-emerald-400/20 text-emerald-300",
            run.status === "queued" && "border-amber-400/20 text-amber-300",
            run.status === "working" && "border-violet-300/20 text-violet-200",
          )}
        >
          {run.status}
        </span>
      </div>
      <div className="space-y-4 px-4 py-4">
        {run.stages.map((stage) => (
          <div key={stage.label} className="grid grid-cols-[12px_1fr_24px] items-center gap-2.5">
            <span className={cn("h-2 w-2 rounded-full", stage.state === "active" ? "bg-emerald-400" : "bg-violet-300/80")} />
            <div>
              <div className="text-[11px] text-zinc-400">{stage.label}</div>
              <div className="mt-2 h-[2px] overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    stage.state === "done" && "w-full bg-violet-300/80",
                    stage.state === "active" && "w-4/5 bg-emerald-400",
                    stage.state === "pending" && "w-0",
                  )}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <StatusDot state={stage.state} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MessageCard({ message, run }: { message: ChatMessage; run?: LocalRun }) {
  const isUser = message.role === "user";
  return (
    <article className="rounded-xl border border-white/[0.07] bg-white/[0.018] px-4 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "grid h-8 w-8 place-items-center rounded-lg border",
              isUser
                ? "border-violet-300/20 bg-violet-400/10 text-violet-200"
                : "border-orange-500/25 bg-orange-500/10 text-orange-400",
            )}
          >
            {isUser ? <CircleUserRound className="h-4 w-4" /> : <span className="font-black italic text-[13px]">D</span>}
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-300">
              {isUser ? "You" : "Daycostra OS"}
            </div>
            {message.meta && <div className="mt-0.5 text-[9px] text-zinc-600">{message.meta}</div>}
          </div>
        </div>
      </div>
      <p className="text-[13px] leading-6 text-zinc-200">{message.body}</p>
      {run && <RunCard run={run} />}
    </article>
  );
}

interface IdeWorkspaceProps {
  initialPrompt?: string;
  initialModel?: string;
}

export function IdeWorkspace({ initialPrompt, initialModel }: IdeWorkspaceProps = {}) {
  const { theme, setTheme } = useTheme();
  const [device, setDevice] = useState<DeviceMode>("desktop");
  const [railCollapsed, setRailCollapsed] = useState(false);
  const [railView, setRailView] = useState<RailId>("assistant");
  const [mobilePanel, setMobilePanel] = useState<"assistant" | "preview">("preview");
  const [composer, setComposer] = useState("");
  const [previewKey, setPreviewKey] = useState(0);
  const [frameReady, setFrameReady] = useState(false);
  const [runCounter, setRunCounter] = useState(24);
  const [activeRun, setActiveRun] = useState<LocalRun | undefined>({
    id: 24,
    status: "completed",
    label: "Launch experience",
    stages: BASE_STAGES.map((label) => ({ label, state: "done" as const })),
  });
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, role: "user", body: "Create the launch experience.", meta: "Local workspace seed" },
    {
      id: 2,
      role: "assistant",
      body: "Preview shell is ready. The IDE is using the live Daycostra homepage below; local commands can switch environments or refresh the preview.",
      meta: "No remote AI runtime connected",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handoffRef = useRef(false);

  useEffect(() => {
    if (handoffRef.current) return;
    const seed = initialPrompt?.trim();
    if (!seed) return;
    handoffRef.current = true;
    setMessages((items) => [
      ...items,
      {
        id: Date.now() - 1,
        role: "assistant",
        body: `Handoff received from the landing composer${initialModel ? ` on ${initialModel}` : ""}. Queuing it in this workspace now.`,
        meta: "Composer handoff",
      },
    ]);
    void submitInstruction(seed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt]);

  const previewWidth = DEVICE_WIDTH[device];
  const runId = String(activeRun?.id ?? runCounter).padStart(3, "0");

  const helperText = useMemo(
    () =>
      `Local commands: volcanic · cryogenic · aurora · refresh preview · open preview${
        initialModel ? ` · model ${initialModel}` : ""
      }`,
    [initialModel],
  );

  const refreshPreview = () => {
    setFrameReady(false);
    setPreviewKey((value) => value + 1);
  };

  const openPreview = () => {
    window.open("/", "_blank", "noopener,noreferrer");
  };

  const setRunStage = (runIdValue: number, stageIndex: number, status?: RunStatus) => {
    setActiveRun((current) => {
      if (!current || current.id !== runIdValue) return current;
      return {
        ...current,
        status: status ?? current.status,
        stages: current.stages.map((stage, index) => ({
          ...stage,
          state: index < stageIndex ? "done" : index === stageIndex ? "active" : "pending",
        })),
      };
    });
  };

  const completeRun = (runIdValue: number, status: RunStatus) => {
    setActiveRun((current) => {
      if (!current || current.id !== runIdValue) return current;
      return {
        ...current,
        status,
        stages: current.stages.map((stage) => ({ ...stage, state: "done" })),
      };
    });
  };

  const submitInstruction = async (override?: string) => {
    const value = (override ?? composer).trim();
    if (!value || activeRun?.status === "working") return;

    const nextRunId = runCounter + 1;
    const command = detectLocalCommand(value);
    setRunCounter(nextRunId);
    setComposer("");
    setMessages((items) => [
      ...items,
      { id: Date.now(), role: "user", body: value, meta: timeLabel() },
    ]);
    setActiveRun({
      id: nextRunId,
      status: "working",
      label: command.type === "queue" ? "Queued instruction" : "Local preview action",
      stages: BASE_STAGES.map((label, index) => ({ label, state: index === 0 ? "active" : "pending" })),
    });

    await sleep(320);
    setRunStage(nextRunId, 1);
    await sleep(420);

    let response = "Instruction queued. No project code was changed because the remote Daycostra runtime is not connected to this workspace yet.";
    let finalStatus: RunStatus = "queued";

    if (command.type === "theme") {
      setTheme(command.theme);
      await sleep(80);
      refreshPreview();
      response = `Applied the ${command.theme} environment locally and refreshed the live homepage preview.`;
      finalStatus = "completed";
    } else if (command.type === "refresh") {
      refreshPreview();
      response = "Refreshed the live Daycostra homepage preview locally.";
      finalStatus = "completed";
    } else if (command.type === "open") {
      openPreview();
      response = "Opened the live Daycostra homepage in a new tab.";
      finalStatus = "completed";
    }

    setRunStage(nextRunId, 2);
    await sleep(360);
    completeRun(nextRunId, finalStatus);
    setMessages((items) => [
      ...items,
      {
        id: Date.now() + 1,
        role: "assistant",
        body: response,
        meta: finalStatus === "queued" ? "Awaiting runtime integration" : "Local workspace action",
      },
    ]);

    window.setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, 40);
  };

  return (
    <main className="ide-shell fixed inset-0 z-[80] overflow-hidden bg-[#090a0c] text-zinc-100">
      <style>{`
        .ide-shell { color-scheme: dark; background-image: radial-gradient(circle at 72% 20%, rgba(126, 79, 143, .08), transparent 35%), radial-gradient(circle at 35% 100%, rgba(255, 80, 24, .035), transparent 32%), linear-gradient(180deg, #0b0c0f 0%, #08090b 100%); }
        .ide-grid { background-image: linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.018) 1px, transparent 1px); background-size: 32px 32px; }
        .ide-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.12) transparent; }
        .ide-panel { background: linear-gradient(180deg, rgba(17,18,22,.92), rgba(10,11,14,.92)); box-shadow: inset 0 1px 0 rgba(255,255,255,.025); }
        @media (prefers-reduced-motion: reduce) { .ide-shell *, .ide-shell *::before, .ide-shell *::after { scroll-behavior: auto !important; transition-duration: .01ms !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; } }
      `}</style>

      <div className="grid h-full grid-cols-[76px_minmax(0,1fr)] max-md:grid-cols-[64px_minmax(0,1fr)]">
        <aside className="flex min-h-0 flex-col items-center border-r border-white/[0.07] bg-black/20 py-4" aria-label="Daycostra workspace navigation">
          <Link to="/" aria-label="Daycostra home" className="mb-7 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/70">
            <DaycostraMark compact />
          </Link>
          <nav className="flex flex-1 flex-col items-center gap-1.5">
            {RAIL_ITEMS.map((item) => (
              <RailButton
                key={item.id}
                label={item.label}
                active={railView === item.id}
                onClick={() => {
                  setRailView(item.id);
                  setRailCollapsed(false);
                  setMobilePanel("assistant");
                }}
              >
                <item.icon className="h-[19px] w-[19px]" />
              </RailButton>
            ))}
          </nav>
          <div className="flex flex-col items-center gap-1.5">
            <RailButton label="Settings"><Settings className="h-[19px] w-[19px]" /></RailButton>
            <RailButton label={railCollapsed ? "Expand assistant" : "Collapse assistant"} onClick={() => setRailCollapsed((value) => !value)}>
              {railCollapsed ? <PanelLeftOpen className="h-[19px] w-[19px]" /> : <PanelLeftClose className="h-[19px] w-[19px]" />}
            </RailButton>
          </div>
        </aside>

        <section className="grid min-h-0 grid-rows-[84px_minmax(0,1fr)]">
          <header className="flex items-center justify-between gap-5 border-b border-white/[0.07] px-6 max-lg:px-4">
            <div className="flex min-w-0 items-center gap-7">
              <div className="max-lg:hidden"><DaycostraMark /></div>
              <div className="flex min-w-0 items-center gap-2.5 text-[13px]">
                <span className="text-zinc-600">/</span>
                <span className="text-zinc-500">studio</span>
                <span className="text-zinc-600">/</span>
                <span className="truncate text-violet-300">playground</span>
              </div>
            </div>

            <button type="button" className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-lg px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-200 hover:bg-white/[0.04] lg:flex">
              Project Aurora <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
            </button>

            <div className="flex items-center gap-2">
              <span className="mr-2 hidden text-[9px] font-semibold uppercase tracking-[0.17em] text-zinc-500 xl:inline">System</span>
              <div className="hidden items-center rounded-full border border-white/[0.08] bg-black/30 p-1 sm:flex" aria-label="Environment theme">
                {(["volcanic", "cryogenic", "aurora"] as const).map((themeId) => (
                  <button
                    key={themeId}
                    type="button"
                    onClick={() => setTheme(themeId)}
                    className={cn(
                      "rounded-full px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-zinc-500 transition-colors hover:text-zinc-200",
                      theme === themeId && "bg-white/[0.055] text-zinc-100",
                    )}
                    aria-pressed={theme === themeId}
                  >
                    {themeId === "volcanic" ? "Dark" : themeId === "cryogenic" ? "Light" : "Aurora"}
                  </button>
                ))}
              </div>
              <span className="mx-2 hidden h-8 w-px bg-white/[0.06] md:block" />
              <RailButton label="Notifications"><Bell className="h-[18px] w-[18px]" /></RailButton>
              <div className="hidden h-7 w-7 rounded-full border border-emerald-400/25 p-1 md:block"><div className="h-full w-full rounded-full bg-emerald-400/80 shadow-[0_0_14px_rgba(74,222,128,.55)]" /></div>
              <RailButton label="Profile"><CircleUserRound className="h-[19px] w-[19px]" /></RailButton>
            </div>
          </header>

          <div className="min-h-0 p-3 sm:p-4 lg:p-5">
            <div
              className={cn(
                "grid h-full min-h-0 gap-3 lg:gap-4",
                railCollapsed ? "grid-cols-1" : "lg:grid-cols-[minmax(300px,0.72fr)_minmax(0,1.55fr)]",
              )}
            >
              {!railCollapsed && (
                <section className={cn("ide-panel min-h-0 overflow-hidden rounded-xl border border-white/[0.08]", mobilePanel !== "assistant" && "max-lg:hidden")} aria-label="AI assistant">
                  <div className="flex h-full min-h-0 flex-col">
                    <header className="flex h-[74px] shrink-0 items-center justify-between border-b border-white/[0.07] px-5">
                      <h1 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-zinc-200">
                        {railView === "assistant" ? "AI Assistant" : RAIL_DETAIL[railView].title}
                      </h1>
                      <div className="flex items-center gap-1">
                        <RailButton label="Pin assistant"><Pin className="h-4 w-4" /></RailButton>
                        <RailButton label="Assistant options"><MoreHorizontal className="h-4 w-4" /></RailButton>
                      </div>
                    </header>

                    {railView !== "assistant" && (
                      <div className="ide-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-5">
                        <p className="text-[12px] leading-6 text-zinc-400">{RAIL_DETAIL[railView].body}</p>
                        <ul className="space-y-2">
                          {RAIL_DETAIL[railView].rows.map((row) => (
                            <li
                              key={row}
                              className="rounded-lg border border-white/[0.07] bg-white/[0.018] px-3.5 py-3 text-[12px] text-zinc-300"
                            >
                              {row}
                            </li>
                          ))}
                        </ul>
                        <button
                          type="button"
                          onClick={() => setRailView("assistant")}
                          className="mt-2 inline-flex items-center gap-2 rounded-lg border border-white/[0.08] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-300 hover:bg-white/[0.04]"
                        >
                          <ChevronLeft className="h-3.5 w-3.5" /> Back to assistant
                        </button>
                      </div>
                    )}

                    <div
                      ref={scrollRef}
                      className={cn(
                        "ide-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-5",
                        railView !== "assistant" && "hidden",
                      )}
                    >
                      {messages.map((message, index) => {
                        const showRun = index === messages.length - 1 && message.role === "assistant" && activeRun;
                        return <MessageCard key={message.id} message={message} run={showRun ? activeRun : undefined} />;
                      })}
                      {activeRun?.status === "working" && <RunCard run={activeRun} />}
                    </div>

                    <div className="shrink-0 border-t border-white/[0.06] bg-black/10 p-4">
                      <div className="rounded-xl border border-violet-300/30 bg-black/25 p-3.5 shadow-[0_0_0_1px_rgba(255,255,255,.01),0_12px_40px_rgba(0,0,0,.25)] focus-within:border-violet-300/55">
                        <textarea
                          value={composer}
                          onChange={(event) => setComposer(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                              event.preventDefault();
                              void submitInstruction();
                            }
                          }}
                          rows={3}
                          placeholder="Describe what should change..."
                          aria-label="Describe what should change"
                          className="w-full resize-none bg-transparent text-[13px] leading-5 text-zinc-100 outline-none placeholder:text-zinc-600"
                        />
                        <div className="mt-2 flex items-end justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.12em] text-zinc-600">
                              <Sparkles className="h-3 w-3" /> Local preview executor
                            </div>
                            <div className="mt-1 truncate text-[9px] text-zinc-700" title={helperText}>{helperText}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => void submitInstruction()}
                            disabled={!composer.trim() || activeRun?.status === "working"}
                            aria-label="Run local instruction"
                            className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-orange-500 text-white shadow-[0_0_28px_rgba(255,92,27,.28)] transition-transform hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
                          >
                            <Send className="h-[18px] w-[18px]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              <section className={cn("ide-panel min-h-0 overflow-hidden rounded-xl border border-white/[0.08]", mobilePanel !== "preview" && "max-lg:hidden")} aria-label="Live preview">
                <div className="grid h-full min-h-0 grid-rows-[74px_minmax(0,1fr)]">
                  <header className="flex items-center justify-between border-b border-white/[0.07] px-5">
                    <h2 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-zinc-200">Live Preview</h2>
                    <div className="flex items-center gap-3">
                      <span className="hidden text-[9px] uppercase tracking-[0.12em] text-zinc-500 sm:inline">Run {runId}</span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.025] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-emerald-300">
                        <ShieldCheck className="h-3.5 w-3.5" /> Local shell
                      </span>
                    </div>
                  </header>

                  <div className="grid min-h-0 grid-rows-[64px_minmax(0,1fr)] p-3.5 sm:p-4">
                    <div className="flex items-center justify-between gap-3 px-1">
                      <div className="flex items-center gap-1 rounded-lg border border-white/[0.07] bg-black/25 p-1">
                        {([
                          ["desktop", Monitor],
                          ["tablet", Tablet],
                          ["mobile", Smartphone],
                        ] as const).map(([mode, Icon]) => (
                          <button
                            key={mode}
                            type="button"
                            aria-label={`${mode} preview`}
                            aria-pressed={device === mode}
                            onClick={() => setDevice(mode)}
                            className={cn(
                              "grid h-9 w-10 place-items-center rounded-md text-zinc-500 transition-colors hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/60",
                              device === mode && "bg-white/[0.055] text-violet-100",
                            )}
                          >
                            <Icon className="h-[17px] w-[17px]" />
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="hidden items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-emerald-300 sm:flex">
                          <span className={cn("h-1.5 w-1.5 rounded-full", frameReady ? "bg-emerald-400" : "bg-amber-400")} />
                          {frameReady ? "Live" : "Loading"}
                        </span>
                        <button type="button" onClick={refreshPreview} aria-label="Refresh preview" title="Refresh preview" className="grid h-9 w-9 place-items-center rounded-lg border border-white/[0.07] text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/60"><RefreshCw className="h-4 w-4" /></button>
                        <button type="button" onClick={openPreview} aria-label="Open preview in a new tab" title="Open preview" className="grid h-9 w-9 place-items-center rounded-lg border border-white/[0.07] text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/60"><ExternalLink className="h-4 w-4" /></button>
                      </div>
                    </div>

                    <div className="ide-grid relative min-h-0 overflow-hidden rounded-xl border border-white/[0.08] bg-[#07080b] p-2 sm:p-3">
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/25 to-transparent" />
                      <div className="flex h-full min-h-0 items-start justify-center overflow-auto rounded-lg bg-black/30">
                        <div
                          className="h-full min-h-[540px] max-w-full overflow-hidden rounded-lg border border-white/[0.08] bg-black shadow-[0_20px_80px_rgba(0,0,0,.45)] transition-[width] duration-300"
                          style={{ width: previewWidth }}
                        >
                          <iframe
                            key={previewKey}
                            src="/"
                            title="Daycostra live homepage preview"
                            onLoad={() => setFrameReady(true)}
                            className="h-full min-h-[540px] w-full border-0 bg-black"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>

      <div className="fixed bottom-4 left-1/2 z-[100] hidden -translate-x-1/2 items-center gap-1 rounded-full border border-white/[0.08] bg-black/80 p-1 shadow-2xl backdrop-blur-xl max-lg:flex">
        <button type="button" onClick={() => setMobilePanel("assistant")} className={cn("flex items-center gap-2 rounded-full px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-500", mobilePanel === "assistant" && "bg-white/[0.07] text-zinc-100")}><MessageSquare className="h-3.5 w-3.5" /> Assistant</button>
        <button type="button" onClick={() => setMobilePanel("preview")} className={cn("flex items-center gap-2 rounded-full px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-500", mobilePanel === "preview" && "bg-white/[0.07] text-zinc-100")}><Monitor className="h-3.5 w-3.5" /> Preview</button>
      </div>
    </main>
  );
}
