import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  Bell,
  Boxes,
  Check,
  ChevronDown,
  ChevronLeft,
  CircleUserRound,
  Database,
  ExternalLink,
  GitBranch,
  Grid2X2,
  MessageSquare,
  Monitor,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Paperclip,
  Pin,
  RefreshCw,
  Send,
  Settings,
  ShieldCheck,
  Smartphone,
  Sparkles,
  SquareTerminal,
  Tablet,
  X,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/ThemeProvider";

type DeviceMode = "desktop" | "tablet" | "mobile";
type RuntimePhase = "ready" | "running" | "applying" | "complete" | "error" | "awaiting-runtime";
type FrameStatus = "loading" | "live" | "error";
type MessageRole = "user" | "assistant";
type RailId = "overview" | "assistant" | "projects" | "workflows" | "data" | "terminal";
type InstructionSource = "assistant" | "terminal";

interface ChatMessage {
  id: number;
  role: MessageRole;
  body: string;
  meta?: string;
}

interface LocalRun {
  id: number;
  phase: RuntimePhase;
  label: string;
  command: string;
  at: string;
}

interface ActivityItem {
  id: number;
  title: string;
  detail: string;
  phase: RuntimePhase;
  at: string;
}

interface LocalAttachment {
  name: string;
  size: number;
}

interface TerminalEntry {
  id: number;
  command: string;
  output: string;
  at: string;
  phase: RuntimePhase;
}

const DEVICE_WIDTH: Record<DeviceMode, number | string> = {
  desktop: "100%",
  tablet: 820,
  mobile: 390,
};

const RAIL_ITEMS = [
  { id: "overview" as const, label: "Overview", icon: Grid2X2 },
  { id: "assistant" as const, label: "Assistant", icon: MessageSquare },
  { id: "projects" as const, label: "Projects", icon: Boxes },
  { id: "workflows" as const, label: "Workflows", icon: GitBranch },
  { id: "data" as const, label: "Data", icon: Database },
  { id: "terminal" as const, label: "Terminal", icon: SquareTerminal },
];

const PHASE_ORDER: RuntimePhase[] = ["ready", "running", "applying", "complete"];
const BASE_COMMANDS = [
  "volcanic",
  "cryogenic",
  "aurora",
  "refresh preview",
  "open preview",
] as const;

function timeLabel() {
  return new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" }).format(
    new Date(),
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function detectLocalCommand(input: string) {
  const value = input.trim().toLowerCase();
  if (value.includes("volcanic")) return { type: "theme" as const, theme: "volcanic" as const };
  if (value.includes("cryogenic")) return { type: "theme" as const, theme: "cryogenic" as const };
  if (value.includes("aurora")) return { type: "theme" as const, theme: "aurora" as const };
  if (
    value === "refresh" ||
    value.includes("refresh preview") ||
    value.includes("reload preview")
  ) {
    return { type: "refresh" as const };
  }
  if (value === "open" || value.includes("open preview") || value.includes("open homepage")) {
    return { type: "open" as const };
  }
  return { type: "runtime" as const };
}

function phaseLabel(phase: RuntimePhase) {
  if (phase === "awaiting-runtime") return "Awaiting runtime";
  return phase.charAt(0).toUpperCase() + phase.slice(1);
}

function phaseTone(phase: RuntimePhase) {
  if (phase === "complete") return "border-emerald-400/20 text-emerald-300";
  if (phase === "error") return "border-red-400/20 text-red-300";
  if (phase === "awaiting-runtime") return "border-amber-400/20 text-amber-300";
  if (phase === "running" || phase === "applying") return "border-violet-300/20 text-violet-200";
  return "border-white/[0.1] text-zinc-400";
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
  disabled,
  children,
  onClick,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "group relative grid h-12 w-12 place-items-center rounded-xl text-zinc-500 transition-colors hover:bg-white/[0.04] hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/70 disabled:cursor-not-allowed disabled:opacity-35",
        active && "bg-white/[0.035] text-violet-200",
      )}
    >
      {active && <span className="absolute -left-[14px] h-8 w-0.5 rounded-full bg-orange-500" />}
      {children}
    </button>
  );
}

function RunCard({ run }: { run: LocalRun }) {
  const currentIndex = PHASE_ORDER.indexOf(run.phase);
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-white/[0.08] bg-black/35">
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-3.5 py-3">
        <div className="min-w-0">
          <div className="truncate text-[12px] font-semibold text-zinc-100">{run.label}</div>
          <div className="mt-0.5 text-[9px] uppercase tracking-[0.14em] text-zinc-500">
            Local execution · Run {String(run.id).padStart(3, "0")} · {run.at}
          </div>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full border px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.1em]",
            phaseTone(run.phase),
          )}
        >
          {phaseLabel(run.phase)}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2 px-3.5 py-3">
        {PHASE_ORDER.map((phase, index) => {
          const isSpecial = run.phase === "error" || run.phase === "awaiting-runtime";
          const done = !isSpecial && currentIndex >= index;
          const active = !isSpecial && currentIndex === index;
          return (
            <div key={phase} className="min-w-0">
              <div className="mb-1.5 flex items-center gap-1.5">
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    done ? "bg-emerald-400" : active ? "bg-violet-300" : "bg-zinc-700",
                  )}
                />
                <span
                  className={cn(
                    "truncate text-[8px] font-semibold uppercase tracking-[0.08em]",
                    done || active ? "text-zinc-300" : "text-zinc-600",
                  )}
                >
                  {phase}
                </span>
              </div>
              <div className="h-px bg-white/[0.06]">
                <div
                  className={cn(
                    "h-full transition-all",
                    done ? "w-full bg-emerald-400/70" : active ? "w-1/2 bg-violet-300/70" : "w-0",
                  )}
                />
              </div>
            </div>
          );
        })}
      </div>
      {(run.phase === "awaiting-runtime" || run.phase === "error") && (
        <div
          className={cn(
            "mx-3.5 mb-3 flex items-start gap-2 rounded-lg border px-3 py-2 text-[10px] leading-4",
            run.phase === "error"
              ? "border-red-400/15 bg-red-400/[0.03] text-red-200"
              : "border-amber-400/15 bg-amber-400/[0.03] text-amber-200",
          )}
        >
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {run.phase === "error"
            ? "The requested local action did not complete. No project code was changed."
            : "This instruction requires the Daycostra runtime. It is recorded locally, but no project code was changed."}
        </div>
      )}
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
            {isUser ? (
              <CircleUserRound className="h-4 w-4" />
            ) : (
              <span className="font-black italic text-[13px]">D</span>
            )}
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

function DataRow({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-lg border border-white/[0.07] bg-white/[0.018] px-3.5 py-3">
      <div className="text-[9px] font-semibold uppercase tracking-[0.12em] text-zinc-600">
        {label}
      </div>
      <div className={cn("mt-1.5 break-words text-[12px] text-zinc-300", tone)}>{value}</div>
    </div>
  );
}

function SettingsRow<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="text-[9px] font-semibold uppercase tracking-[0.13em] text-zinc-500">
        {label}
      </div>
      <div className="flex flex-wrap gap-1 rounded-lg border border-white/[0.07] bg-black/25 p-1">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "min-w-[64px] flex-1 rounded-md px-2 py-2 text-[9px] font-semibold capitalize text-zinc-500 transition-colors hover:text-zinc-200",
              value === option && "bg-white/[0.065] text-zinc-100",
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

interface IdeWorkspaceProps {
  initialPrompt?: string;
  initialModel?: string;
}

export function IdeWorkspace({ initialPrompt, initialModel }: IdeWorkspaceProps = {}) {
  const themeState = useTheme();
  const { theme, setTheme } = themeState;
  const [device, setDevice] = useState<DeviceMode>("desktop");
  const [railCollapsed, setRailCollapsed] = useState(false);
  const [railView, setRailView] = useState<RailId>("assistant");
  const [mobilePanel, setMobilePanel] = useState<"assistant" | "preview">("preview");
  const [composer, setComposer] = useState("");
  const [terminalCommand, setTerminalCommand] = useState("");
  const [previewKey, setPreviewKey] = useState(0);
  const [frameStatus, setFrameStatus] = useState<FrameStatus>("loading");
  const [runCounter, setRunCounter] = useState(24);
  const [activeRun, setActiveRun] = useState<LocalRun>({
    id: 24,
    phase: "ready",
    label: "Workspace ready",
    command: "ready",
    at: timeLabel(),
  });
  const [runHistory, setRunHistory] = useState<LocalRun[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: 1,
      title: "Workspace ready",
      detail: "Live Daycostra landing preview initialized locally.",
      phase: "ready",
      at: timeLabel(),
    },
  ]);
  const [terminalHistory, setTerminalHistory] = useState<TerminalEntry[]>([]);
  const [attachments, setAttachments] = useState<LocalAttachment[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, role: "user", body: "Create the launch experience.", meta: "Local workspace seed" },
    {
      id: 2,
      role: "assistant",
      body: "Preview shell is ready. Local commands can switch environments, refresh the live homepage, or open it in a new tab. Project-code changes stay disabled until a Daycostra runtime is connected.",
      meta: "Local executor only",
    },
  ]);
  const [assistantPinned, setAssistantPinned] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const handoffRef = useRef(false);

  const previewWidth = DEVICE_WIDTH[device];
  const runId = String(activeRun.id).padStart(3, "0");
  const busy = activeRun.phase === "running" || activeRun.phase === "applying";

  const helperText = useMemo(
    () =>
      `Local commands: ${BASE_COMMANDS.join(" · ")}${initialModel ? ` · model ${initialModel}` : ""}`,
    [initialModel],
  );

  useEffect(() => {
    if (frameStatus !== "loading") return;
    const timeout = window.setTimeout(
      () => setFrameStatus((current) => (current === "loading" ? "error" : current)),
      8000,
    );
    return () => window.clearTimeout(timeout);
  }, [frameStatus, previewKey]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, activeRun.phase]);

  const addActivity = (title: string, detail: string, phase: RuntimePhase) => {
    setActivities((items) =>
      [{ id: Date.now() + Math.random(), title, detail, phase, at: timeLabel() }, ...items].slice(
        0,
        20,
      ),
    );
  };

  const refreshPreview = () => {
    setFrameStatus("loading");
    setPreviewKey((value) => value + 1);
    addActivity("Preview refresh", "Reloaded the local Daycostra landing preview.", "complete");
  };

  const openPreview = () => {
    const opened = window.open("/", "_blank", "noopener,noreferrer");
    return Boolean(opened);
  };

  const finalizeRun = (run: LocalRun) => {
    setActiveRun(run);
    setRunHistory((items) => [run, ...items].slice(0, 30));
  };

  const executeInstruction = async (rawValue: string, source: InstructionSource = "assistant") => {
    const value = rawValue.trim();
    if (!value || busy) return;

    const nextRunId = runCounter + 1;
    const command = detectLocalCommand(value);
    const startedAt = timeLabel();
    const attachmentMeta = attachments.length
      ? ` · ${attachments.length} local context file${attachments.length === 1 ? "" : "s"}`
      : "";
    setRunCounter(nextRunId);
    if (source === "assistant") {
      setComposer("");
      setMessages((items) => [
        ...items,
        { id: Date.now(), role: "user", body: value, meta: `${startedAt}${attachmentMeta}` },
      ]);
    } else {
      setTerminalCommand("");
    }

    const label = command.type === "runtime" ? "Runtime instruction" : "Local preview action";
    setActiveRun({ id: nextRunId, phase: "running", label, command: value, at: startedAt });
    await sleep(280);

    if (command.type === "runtime") {
      const waitingRun: LocalRun = {
        id: nextRunId,
        phase: "awaiting-runtime",
        label,
        command: value,
        at: startedAt,
      };
      finalizeRun(waitingRun);
      const response =
        "Instruction recorded locally. The remote Daycostra runtime is not connected, so no project code was changed.";
      addActivity("Runtime required", value, "awaiting-runtime");
      if (source === "assistant") {
        setMessages((items) => [
          ...items,
          {
            id: Date.now() + 1,
            role: "assistant",
            body: response,
            meta: "Awaiting Daycostra runtime",
          },
        ]);
      } else {
        setTerminalHistory((items) =>
          [
            {
              id: Date.now(),
              command: value,
              output: response,
              at: timeLabel(),
              phase: "awaiting-runtime" as RuntimePhase,
            },
            ...items,
          ].slice(0, 30),
        );
      }
      return;
    }

    setActiveRun({ id: nextRunId, phase: "applying", label, command: value, at: startedAt });
    await sleep(320);

    let response = "Local action complete.";
    let finalPhase: RuntimePhase = "complete";
    if (command.type === "theme") {
      setTheme(command.theme);
      response = `Applied the ${command.theme} environment locally. The same-origin live preview is synchronized through the shared Daycostra theme state.`;
    } else if (command.type === "refresh") {
      refreshPreview();
      response = "Refreshed the live Daycostra homepage preview locally.";
    } else if (command.type === "open") {
      const opened = openPreview();
      if (opened) {
        response = "Opened the Daycostra homepage in a new tab.";
      } else {
        finalPhase = "error";
        response =
          "The browser blocked the new preview tab. No project code was changed; allow pop-ups or use the preview toolbar button.";
      }
    }

    const finalRun: LocalRun = {
      id: nextRunId,
      phase: finalPhase,
      label,
      command: value,
      at: startedAt,
    };
    finalizeRun(finalRun);
    addActivity(
      finalPhase === "complete" ? "Local action complete" : "Local action failed",
      value,
      finalPhase,
    );
    if (source === "assistant") {
      setMessages((items) => [
        ...items,
        {
          id: Date.now() + 1,
          role: "assistant",
          body: response,
          meta: finalPhase === "complete" ? "Local workspace action" : "Local action error",
        },
      ]);
    } else {
      setTerminalHistory((items) =>
        [
          { id: Date.now(), command: value, output: response, at: timeLabel(), phase: finalPhase },
          ...items,
        ].slice(0, 30),
      );
    }
  };

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
        body: `Handoff received from the landing composer${initialModel ? ` on ${initialModel}` : ""}. Running it through the local capability gate now.`,
        meta: "Composer handoff",
      },
    ]);
    void executeInstruction(seed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt]);

  const changeTheme = (nextTheme: "volcanic" | "cryogenic" | "aurora") => {
    setTheme(nextTheme);
    addActivity(
      "Environment changed",
      `${nextTheme} theme applied to the workspace and live preview.`,
      "complete",
    );
  };

  const onFilesSelected = (files: FileList | null) => {
    if (!files?.length) return;
    const next = Array.from(files).map((file) => ({ name: file.name, size: file.size }));
    setAttachments((current) => {
      const known = new Set(current.map((item) => `${item.name}:${item.size}`));
      return [...current, ...next.filter((item) => !known.has(`${item.name}:${item.size}`))].slice(
        0,
        12,
      );
    });
    addActivity(
      "Local context added",
      `${next.length} filename${next.length === 1 ? "" : "s"} added to this browser session. File contents were not uploaded.`,
      "complete",
    );
  };

  const clearConversation = () => {
    setMessages([
      {
        id: Date.now(),
        role: "assistant",
        body: "Local conversation cleared. Preview state and run history are preserved.",
        meta: "Local workspace",
      },
    ]);
    setOptionsOpen(false);
  };

  const railTitle =
    railView === "assistant"
      ? "AI Assistant"
      : (RAIL_ITEMS.find((item) => item.id === railView)?.label ?? "Workspace");

  const renderRailContent = () => {
    if (railView === "overview") {
      return (
        <div className="space-y-3">
          <p className="text-[12px] leading-6 text-zinc-400">
            Live values from this browser workspace.
          </p>
          <DataRow label="Environment" value={theme} />
          <DataRow
            label="Preview"
            value={`Daycostra Landing · ${device} · ${frameStatus}`}
            tone={
              frameStatus === "error"
                ? "text-red-300"
                : frameStatus === "live"
                  ? "text-emerald-300"
                  : "text-amber-300"
            }
          />
          <DataRow label="Runtime" value={`${phaseLabel(activeRun.phase)} · Run ${runId}`} />
          <DataRow
            label="Executor"
            value="Local preview commands only · remote runtime not connected"
          />
        </div>
      );
    }
    if (railView === "projects") {
      return (
        <div className="space-y-3">
          <p className="text-[12px] leading-6 text-zinc-400">
            The server-side project registry is not connected. This is the real local preview
            target.
          </p>
          <div className="rounded-xl border border-violet-300/15 bg-violet-300/[0.035] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[12px] font-semibold text-zinc-100">Daycostra Landing</div>
                <div className="mt-1 text-[10px] text-zinc-500">/ · same-origin live preview</div>
              </div>
              <span className="rounded-full border border-emerald-400/15 px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.1em] text-emerald-300">
                Current
              </span>
            </div>
          </div>
          <DataRow
            label="Registry"
            value="Not connected — no remote projects are being fabricated in this UI."
          />
        </div>
      );
    }
    if (railView === "workflows") {
      return (
        <div className="space-y-3">
          <p className="text-[12px] leading-6 text-zinc-400">
            Session execution history generated by real interactions in this workspace.
          </p>
          {runHistory.length === 0 ? (
            <DataRow label="Runs" value="No commands executed in this session yet." />
          ) : (
            runHistory.map((run) => (
              <div
                key={`${run.id}-${run.at}`}
                className="rounded-lg border border-white/[0.07] bg-white/[0.018] px-3.5 py-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate text-[11px] text-zinc-300">{run.command}</span>
                  <span
                    className={cn(
                      "shrink-0 text-[8px] font-semibold uppercase",
                      run.phase === "complete"
                        ? "text-emerald-300"
                        : run.phase === "error"
                          ? "text-red-300"
                          : run.phase === "awaiting-runtime"
                            ? "text-amber-300"
                            : "text-violet-200",
                    )}
                  >
                    {phaseLabel(run.phase)}
                  </span>
                </div>
                <div className="mt-1 text-[9px] text-zinc-600">
                  Run {String(run.id).padStart(3, "0")} · {run.at}
                </div>
              </div>
            ))
          )}
        </div>
      );
    }
    if (railView === "data") {
      return (
        <div className="space-y-3">
          <p className="text-[12px] leading-6 text-zinc-400">
            Only context that actually exists in this browser session is shown.
          </p>
          <DataRow label="Landing handoff prompt" value={initialPrompt?.trim() || "None"} />
          <DataRow label="Landing model" value={initialModel?.trim() || "Not specified"} />
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.018] px-3.5 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="text-[9px] font-semibold uppercase tracking-[0.12em] text-zinc-600">
                Local attachments
              </div>
              <span className="text-[9px] text-zinc-600">{attachments.length}/12</span>
            </div>
            {attachments.length === 0 ? (
              <div className="mt-1.5 text-[12px] text-zinc-300">None</div>
            ) : (
              <div className="mt-2 space-y-1.5">
                {attachments.map((file) => (
                  <div
                    key={`${file.name}-${file.size}`}
                    className="flex items-center justify-between gap-3 text-[11px]"
                  >
                    <span className="truncate text-zinc-300">{file.name}</span>
                    <span className="shrink-0 text-zinc-600">{formatBytes(file.size)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <p className="text-[10px] leading-5 text-zinc-600">
            Only filenames and sizes are retained locally here. This shell does not upload file
            contents.
          </p>
        </div>
      );
    }
    if (railView === "terminal") {
      return (
        <div className="flex h-full min-h-[360px] flex-col gap-3">
          <p className="text-[12px] leading-6 text-zinc-400">
            A constrained command console using the same local executor as the assistant.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {BASE_COMMANDS.map((command) => (
              <button
                key={command}
                type="button"
                onClick={() => void executeInstruction(command, "terminal")}
                disabled={busy}
                className="rounded-md border border-white/[0.08] px-2.5 py-1.5 text-[9px] text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200 disabled:opacity-40"
              >
                {command}
              </button>
            ))}
          </div>
          <div className="ide-scrollbar min-h-0 flex-1 space-y-2 overflow-y-auto rounded-lg border border-white/[0.07] bg-black/30 p-3 font-mono">
            {terminalHistory.length === 0 ? (
              <div className="text-[10px] leading-5 text-zinc-600">
                $ supported commands only
                <br />
                No arbitrary shell access is exposed.
              </div>
            ) : (
              terminalHistory.map((entry) => (
                <div key={entry.id} className="border-b border-white/[0.05] pb-2 last:border-0">
                  <div className="text-[10px] text-violet-200">$ {entry.command}</div>
                  <div className="mt-1 text-[10px] leading-5 text-zinc-500">{entry.output}</div>
                  <div className="mt-1 text-[8px] uppercase tracking-[0.1em] text-zinc-700">
                    {entry.at} · {phaseLabel(entry.phase)}
                  </div>
                </div>
              ))
            )}
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void executeInstruction(terminalCommand, "terminal");
            }}
            className="flex gap-2"
          >
            <input
              value={terminalCommand}
              onChange={(event) => setTerminalCommand(event.target.value)}
              placeholder="refresh preview"
              aria-label="Local terminal command"
              className="min-w-0 flex-1 rounded-lg border border-white/[0.08] bg-black/25 px-3 py-2 text-[11px] text-zinc-200 outline-none focus:border-violet-300/40"
            />
            <button
              type="submit"
              disabled={!terminalCommand.trim() || busy}
              className="rounded-lg border border-white/[0.08] px-3 text-[9px] font-semibold uppercase tracking-[0.1em] text-zinc-300 hover:bg-white/[0.04] disabled:opacity-40"
            >
              Run
            </button>
          </form>
        </div>
      );
    }
    return null;
  };

  return (
    <main className="ide-shell fixed inset-0 z-[80] overflow-hidden bg-[#090a0c] text-zinc-100">
      <style>{`
        .ide-shell { color-scheme: dark; background-image: radial-gradient(circle at 72% 20%, rgba(126,79,143,.08), transparent 35%), radial-gradient(circle at 35% 100%, rgba(255,80,24,.035), transparent 32%), linear-gradient(180deg,#0b0c0f 0%,#08090b 100%); }
        .ide-grid { background-image: linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px), linear-gradient(90deg,rgba(255,255,255,.018) 1px, transparent 1px); background-size:32px 32px; }
        .ide-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.12) transparent; }
        .ide-panel { background: linear-gradient(180deg,rgba(17,18,22,.92),rgba(10,11,14,.92)); box-shadow: inset 0 1px 0 rgba(255,255,255,.025); }
        @media (prefers-reduced-motion: reduce) { .ide-shell *, .ide-shell *::before, .ide-shell *::after { scroll-behavior:auto!important; transition-duration:.01ms!important; animation-duration:.01ms!important; animation-iteration-count:1!important; } }
      `}</style>

      <div className="grid h-full grid-cols-[76px_minmax(0,1fr)] max-md:grid-cols-[64px_minmax(0,1fr)]">
        <aside
          className="flex min-h-0 flex-col items-center border-r border-white/[0.07] bg-black/20 py-4"
          aria-label="Daycostra workspace navigation"
        >
          <Link
            to="/"
            aria-label="Daycostra home"
            className="mb-7 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/70"
          >
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
            <RailButton
              label="Settings"
              active={settingsOpen}
              onClick={() => setSettingsOpen(true)}
            >
              <Settings className="h-[19px] w-[19px]" />
            </RailButton>
            <RailButton
              label={
                assistantPinned
                  ? "Assistant is pinned"
                  : railCollapsed
                    ? "Expand assistant"
                    : "Collapse assistant"
              }
              disabled={assistantPinned}
              onClick={() => setRailCollapsed((value) => !value)}
            >
              {railCollapsed ? (
                <PanelLeftOpen className="h-[19px] w-[19px]" />
              ) : (
                <PanelLeftClose className="h-[19px] w-[19px]" />
              )}
            </RailButton>
          </div>
        </aside>

        <section className="grid min-h-0 grid-rows-[84px_minmax(0,1fr)]">
          <header className="relative flex items-center justify-between gap-5 border-b border-white/[0.07] px-6 max-lg:px-4">
            <div className="flex min-w-0 items-center gap-7">
              <div className="max-lg:hidden">
                <DaycostraMark />
              </div>
              <div className="flex min-w-0 items-center gap-2.5 text-[13px]">
                <span className="text-zinc-600">/</span>
                <span className="text-zinc-500">studio</span>
                <span className="text-zinc-600">/</span>
                <span className="truncate text-violet-300">playground</span>
              </div>
            </div>

            <div className="absolute left-1/2 hidden -translate-x-1/2 lg:block">
              <button
                type="button"
                aria-expanded={projectOpen}
                onClick={() => setProjectOpen((value) => !value)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-200 hover:bg-white/[0.04]"
              >
                Daycostra Landing <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
              </button>
              {projectOpen && (
                <div className="absolute left-1/2 top-[calc(100%+8px)] w-72 -translate-x-1/2 rounded-xl border border-white/[0.08] bg-[#111217]/95 p-3 shadow-2xl backdrop-blur-xl">
                  <div className="text-[9px] font-semibold uppercase tracking-[0.13em] text-zinc-600">
                    Local preview target
                  </div>
                  <button
                    type="button"
                    onClick={() => setProjectOpen(false)}
                    className="mt-2 w-full rounded-lg border border-violet-300/15 bg-violet-300/[0.035] px-3 py-3 text-left"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[11px] font-semibold text-zinc-100">
                        Daycostra Landing
                      </span>
                      <Check className="h-3.5 w-3.5 text-emerald-300" />
                    </div>
                    <div className="mt-1 text-[9px] text-zinc-600">
                      / · current same-origin preview
                    </div>
                  </button>
                  <p className="mt-2 text-[9px] leading-4 text-zinc-600">
                    Remote project registry is not connected.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="mr-2 hidden text-[9px] font-semibold uppercase tracking-[0.17em] text-zinc-500 xl:inline">
                System
              </span>
              <div
                className="hidden items-center rounded-full border border-white/[0.08] bg-black/30 p-1 sm:flex"
                aria-label="Environment theme"
              >
                {(["volcanic", "cryogenic", "aurora"] as const).map((themeId) => (
                  <button
                    key={themeId}
                    type="button"
                    onClick={() => changeTheme(themeId)}
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
              <div className="relative">
                <RailButton
                  label="Notifications"
                  active={notificationsOpen}
                  onClick={() => {
                    setNotificationsOpen((value) => !value);
                    setProfileOpen(false);
                  }}
                >
                  <Bell className="h-[18px] w-[18px]" />
                </RailButton>
                {notificationsOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] z-30 w-[min(340px,80vw)] rounded-xl border border-white/[0.08] bg-[#111217]/95 p-3 shadow-2xl backdrop-blur-xl">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-300">
                        Session activity
                      </span>
                      <span className="text-[9px] text-zinc-600">local only</span>
                    </div>
                    <div className="max-h-72 space-y-2 overflow-y-auto">
                      {activities.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-lg border border-white/[0.06] bg-black/20 px-3 py-2.5"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-[10px] font-medium text-zinc-200">
                              {item.title}
                            </span>
                            <span
                              className={cn(
                                "text-[8px] font-semibold uppercase",
                                item.phase === "complete"
                                  ? "text-emerald-300"
                                  : item.phase === "error"
                                    ? "text-red-300"
                                    : item.phase === "awaiting-runtime"
                                      ? "text-amber-300"
                                      : "text-zinc-500",
                              )}
                            >
                              {phaseLabel(item.phase)}
                            </span>
                          </div>
                          <div className="mt-1 text-[9px] leading-4 text-zinc-500">
                            {item.detail}
                          </div>
                          <div className="mt-1 text-[8px] text-zinc-700">{item.at}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="hidden h-7 w-7 rounded-full border border-emerald-400/25 p-1 md:block">
                <div className="h-full w-full rounded-full bg-emerald-400/80 shadow-[0_0_14px_rgba(74,222,128,.55)]" />
              </div>
              <div className="relative">
                <RailButton
                  label="Profile"
                  active={profileOpen}
                  onClick={() => {
                    setProfileOpen((value) => !value);
                    setNotificationsOpen(false);
                  }}
                >
                  <CircleUserRound className="h-[19px] w-[19px]" />
                </RailButton>
                {profileOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] z-30 w-64 rounded-xl border border-white/[0.08] bg-[#111217]/95 p-3 shadow-2xl backdrop-blur-xl">
                    <div className="rounded-lg border border-white/[0.06] bg-black/20 p-3">
                      <div className="text-[11px] font-semibold text-zinc-100">Guest workspace</div>
                      <div className="mt-1 text-[9px] leading-4 text-zinc-500">
                        Authentication is not connected to this Daycostra shell.
                      </div>
                    </div>
                    <Link
                      to="/"
                      className="mt-2 flex w-full items-center justify-between rounded-lg px-3 py-2 text-[10px] text-zinc-300 hover:bg-white/[0.04]"
                    >
                      Back to landing <ChevronLeft className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="min-h-0 p-3 sm:p-4 lg:p-5">
            <div
              className={cn(
                "grid h-full min-h-0 gap-3 lg:gap-4",
                railCollapsed
                  ? "grid-cols-1"
                  : "lg:grid-cols-[minmax(300px,0.72fr)_minmax(0,1.55fr)]",
              )}
            >
              {!railCollapsed && (
                <section
                  className={cn(
                    "ide-panel min-h-0 overflow-hidden rounded-xl border border-white/[0.08]",
                    mobilePanel !== "assistant" && "max-lg:hidden",
                  )}
                  aria-label="AI assistant"
                >
                  <div className="flex h-full min-h-0 flex-col">
                    <header className="flex h-[74px] shrink-0 items-center justify-between border-b border-white/[0.07] px-5">
                      <h1 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-zinc-200">
                        {railTitle}
                      </h1>
                      <div className="flex items-center gap-1">
                        <RailButton
                          label={assistantPinned ? "Unpin assistant" : "Pin assistant"}
                          active={assistantPinned}
                          onClick={() => setAssistantPinned((value) => !value)}
                        >
                          <Pin className="h-4 w-4" />
                        </RailButton>
                        <div className="relative">
                          <RailButton
                            label="Assistant options"
                            active={optionsOpen}
                            onClick={() => setOptionsOpen((value) => !value)}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </RailButton>
                          {optionsOpen && (
                            <div className="absolute right-0 top-[calc(100%+6px)] z-20 w-48 rounded-lg border border-white/[0.08] bg-[#121318]/95 p-1.5 shadow-xl">
                              <button
                                type="button"
                                onClick={clearConversation}
                                className="w-full rounded-md px-2.5 py-2 text-left text-[10px] text-zinc-300 hover:bg-white/[0.05]"
                              >
                                Clear conversation
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  refreshPreview();
                                  setOptionsOpen(false);
                                }}
                                className="w-full rounded-md px-2.5 py-2 text-left text-[10px] text-zinc-300 hover:bg-white/[0.05]"
                              >
                                Refresh preview
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setRailView("overview");
                                  setOptionsOpen(false);
                                }}
                                className="w-full rounded-md px-2.5 py-2 text-left text-[10px] text-zinc-300 hover:bg-white/[0.05]"
                              >
                                Open overview
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </header>

                    {railView !== "assistant" ? (
                      <div className="ide-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-5">
                        {renderRailContent()}
                        <button
                          type="button"
                          onClick={() => setRailView("assistant")}
                          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/[0.08] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-300 hover:bg-white/[0.04]"
                        >
                          <ChevronLeft className="h-3.5 w-3.5" /> Back to assistant
                        </button>
                      </div>
                    ) : (
                      <div
                        ref={scrollRef}
                        className="ide-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-5"
                      >
                        {messages.map((message, index) => {
                          const showRun =
                            index === messages.length - 1 &&
                            message.role === "assistant" &&
                            activeRun.phase !== "ready";
                          return (
                            <MessageCard
                              key={message.id}
                              message={message}
                              run={showRun ? activeRun : undefined}
                            />
                          );
                        })}
                        {busy && <RunCard run={activeRun} />}
                      </div>
                    )}

                    <div
                      className={cn(
                        "shrink-0 border-t border-white/[0.06] bg-black/10 p-4",
                        railView !== "assistant" && "hidden",
                      )}
                    >
                      {attachments.length > 0 && (
                        <div className="mb-2 flex flex-wrap gap-1.5">
                          {attachments.map((file) => (
                            <button
                              key={`${file.name}-${file.size}`}
                              type="button"
                              title="Remove local context filename"
                              onClick={() =>
                                setAttachments((items) =>
                                  items.filter(
                                    (item) => !(item.name === file.name && item.size === file.size),
                                  ),
                                )
                              }
                              className="inline-flex max-w-[180px] items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.025] px-2 py-1 text-[9px] text-zinc-400"
                            >
                              <span className="truncate">{file.name}</span>
                              <X className="h-2.5 w-2.5 shrink-0" />
                            </button>
                          ))}
                        </div>
                      )}
                      <div className="rounded-xl border border-violet-300/30 bg-black/25 p-3.5 shadow-[0_0_0_1px_rgba(255,255,255,.01),0_12px_40px_rgba(0,0,0,.25)] focus-within:border-violet-300/55">
                        <textarea
                          value={composer}
                          onChange={(event) => setComposer(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                              event.preventDefault();
                              void executeInstruction(composer);
                            }
                          }}
                          rows={3}
                          placeholder="Describe what should change..."
                          aria-label="Describe what should change"
                          className="w-full resize-none bg-transparent text-[13px] leading-5 text-zinc-100 outline-none placeholder:text-zinc-600"
                        />
                        <div className="mt-2 flex items-end justify-between gap-3">
                          <div className="flex min-w-0 items-end gap-2">
                            <input
                              ref={fileRef}
                              type="file"
                              multiple
                              className="hidden"
                              onChange={(event) => {
                                onFilesSelected(event.target.files);
                                event.currentTarget.value = "";
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => fileRef.current?.click()}
                              aria-label="Add local context filenames"
                              title="Add local context filenames"
                              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/[0.07] text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200"
                            >
                              <Paperclip className="h-4 w-4" />
                            </button>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.12em] text-zinc-600">
                                <Sparkles className="h-3 w-3" /> Local preview executor
                              </div>
                              <div
                                className="mt-1 truncate text-[9px] text-zinc-700"
                                title={helperText}
                              >
                                {helperText}
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => void executeInstruction(composer)}
                            disabled={!composer.trim() || busy}
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

              <section
                className={cn(
                  "ide-panel min-h-0 overflow-hidden rounded-xl border border-white/[0.08]",
                  mobilePanel !== "preview" && "max-lg:hidden",
                )}
                aria-label="Live preview"
              >
                <div className="grid h-full min-h-0 grid-rows-[74px_minmax(0,1fr)]">
                  <header className="flex items-center justify-between border-b border-white/[0.07] px-5">
                    <h2 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-zinc-200">
                      Live Preview
                    </h2>
                    <div className="flex items-center gap-3">
                      <span className="hidden text-[9px] uppercase tracking-[0.12em] text-zinc-500 sm:inline">
                        Run {runId}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.025] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-emerald-300">
                        <ShieldCheck className="h-3.5 w-3.5" /> Local shell
                      </span>
                    </div>
                  </header>
                  <div className="grid min-h-0 grid-rows-[64px_minmax(0,1fr)] p-3.5 sm:p-4">
                    <div className="flex items-center justify-between gap-3 px-1">
                      <div className="flex items-center gap-1 rounded-lg border border-white/[0.07] bg-black/25 p-1">
                        {(
                          [
                            ["desktop", Monitor],
                            ["tablet", Tablet],
                            ["mobile", Smartphone],
                          ] as const
                        ).map(([mode, Icon]) => (
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
                        <span
                          className={cn(
                            "hidden items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] sm:flex",
                            frameStatus === "live"
                              ? "text-emerald-300"
                              : frameStatus === "error"
                                ? "text-red-300"
                                : "text-amber-300",
                          )}
                        >
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              frameStatus === "live"
                                ? "bg-emerald-400"
                                : frameStatus === "error"
                                  ? "bg-red-400"
                                  : "bg-amber-400",
                            )}
                          />
                          {frameStatus}
                        </span>
                        <button
                          type="button"
                          onClick={refreshPreview}
                          aria-label="Refresh preview"
                          title="Refresh preview"
                          className="grid h-9 w-9 place-items-center rounded-lg border border-white/[0.07] text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/60"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!openPreview())
                              addActivity(
                                "Preview open blocked",
                                "Browser blocked the new tab.",
                                "error",
                              );
                          }}
                          aria-label="Open preview in a new tab"
                          title="Open preview"
                          className="grid h-9 w-9 place-items-center rounded-lg border border-white/[0.07] text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/60"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="ide-grid relative min-h-0 overflow-hidden rounded-xl border border-white/[0.08] bg-[#07080b] p-2 sm:p-3">
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/25 to-transparent" />
                      {frameStatus === "error" && (
                        <div className="absolute inset-0 z-10 grid place-items-center bg-[#08090b]/90 p-6">
                          <div className="max-w-sm text-center">
                            <AlertTriangle className="mx-auto h-6 w-6 text-red-300" />
                            <div className="mt-3 text-[12px] font-semibold text-zinc-100">
                              Preview did not report ready
                            </div>
                            <p className="mt-2 text-[10px] leading-5 text-zinc-500">
                              The local iframe may have failed or timed out. Retry without changing
                              any project code.
                            </p>
                            <button
                              type="button"
                              onClick={refreshPreview}
                              className="mt-4 rounded-lg border border-white/[0.08] px-3 py-2 text-[10px] text-zinc-300 hover:bg-white/[0.04]"
                            >
                              Retry preview
                            </button>
                          </div>
                        </div>
                      )}
                      <div className="flex h-full min-h-0 items-start justify-center overflow-auto rounded-lg bg-black/30">
                        <div
                          className="h-full min-h-[540px] max-w-full overflow-hidden rounded-lg border border-white/[0.08] bg-black shadow-[0_20px_80px_rgba(0,0,0,.45)] transition-[width] duration-300"
                          style={{ width: previewWidth }}
                        >
                          <iframe
                            key={previewKey}
                            src="/"
                            title="Daycostra live homepage preview"
                            onLoad={() => setFrameStatus("live")}
                            onError={() => setFrameStatus("error")}
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

      {settingsOpen && (
        <div
          className="fixed inset-0 z-[130] bg-black/55 backdrop-blur-[2px]"
          onMouseDown={() => setSettingsOpen(false)}
        >
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="IDE settings"
            onMouseDown={(event) => event.stopPropagation()}
            className="ide-scrollbar absolute inset-y-3 right-3 w-[min(420px,calc(100vw-24px))] overflow-y-auto rounded-2xl border border-white/[0.09] bg-[#111217]/98 p-5 shadow-2xl"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
                  Workspace settings
                </div>
                <div className="mt-1 text-[16px] font-semibold text-zinc-100">
                  Daycostra environment
                </div>
                <p className="mt-1 text-[10px] leading-5 text-zinc-500">
                  These settings persist locally and synchronize to the same-origin preview.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-lg border border-white/[0.07] text-zinc-500 hover:text-zinc-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              <SettingsRow
                label="Theme"
                value={themeState.theme}
                options={["volcanic", "cryogenic", "aurora"] as const}
                onChange={themeState.setTheme}
              />
              <SettingsRow
                label="Preset"
                value={themeState.preset}
                options={["cinematic", "balanced", "minimal", "static"] as const}
                onChange={themeState.setPreset}
              />
              <SettingsRow
                label="Motion"
                value={themeState.motion}
                options={["low", "medium", "high"] as const}
                onChange={themeState.setMotion}
              />
              <SettingsRow
                label="Particles"
                value={themeState.particles}
                options={["off", "low", "medium", "high"] as const}
                onChange={themeState.setParticles}
              />
              <SettingsRow
                label="Performance"
                value={themeState.performance}
                options={["auto", "quality", "balanced", "efficiency", "static"] as const}
                onChange={themeState.setPerformance}
              />
              <SettingsRow
                label="Glass"
                value={themeState.glass}
                options={["soft", "standard", "dense"] as const}
                onChange={themeState.setGlass}
              />
              <SettingsRow
                label="Shadow"
                value={themeState.shadow}
                options={["shallow", "standard", "deep"] as const}
                onChange={themeState.setShadow}
              />
              {themeState.reducedMotion && (
                <p className="rounded-lg border border-amber-400/10 bg-amber-400/[0.03] p-3 text-[10px] leading-5 text-amber-200">
                  Reduced-motion is enabled at OS/browser level, so ambient motion is forced static.
                </p>
              )}
            </div>
          </aside>
        </div>
      )}

      <div className="fixed bottom-4 left-1/2 z-[100] hidden -translate-x-1/2 items-center gap-1 rounded-full border border-white/[0.08] bg-black/80 p-1 shadow-2xl backdrop-blur-xl max-lg:flex">
        <button
          type="button"
          onClick={() => setMobilePanel("assistant")}
          className={cn(
            "flex items-center gap-2 rounded-full px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-500",
            mobilePanel === "assistant" && "bg-white/[0.07] text-zinc-100",
          )}
        >
          <MessageSquare className="h-3.5 w-3.5" /> Assistant
        </button>
        <button
          type="button"
          onClick={() => setMobilePanel("preview")}
          className={cn(
            "flex items-center gap-2 rounded-full px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-500",
            mobilePanel === "preview" && "bg-white/[0.07] text-zinc-100",
          )}
        >
          <Monitor className="h-3.5 w-3.5" /> Preview
        </button>
      </div>
    </main>
  );
}
