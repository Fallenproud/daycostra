import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, Check, ChevronDown, RefreshCw, ShieldAlert, ShieldCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RuntimeBridgeStatus } from "@/lib/runtime/contracts";

type LoadState = "loading" | "ready" | "error";

const FALLBACK_STATUS: RuntimeBridgeStatus = {
  engine: "agentos",
  configured: false,
  connected: false,
  executionReady: false,
  executionMode: "disabled",
  reason: "Daycostra runtime readiness endpoint is unavailable.",
  checkedAt: "",
  checks: [],
};

export function RuntimeStatusIndicator() {
  const [status, setStatus] = useState<RuntimeBridgeStatus>(FALLBACK_STATUS);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [open, setOpen] = useState(false);

  const checkRuntime = useCallback(async () => {
    try {
      const response = await fetch("/api/runtime/health", {
        method: "GET",
        headers: { accept: "application/json" },
        cache: "no-store",
      });
      if (!response.ok) throw new Error(`Runtime health returned ${response.status}`);
      const next = (await response.json()) as RuntimeBridgeStatus;
      setStatus(next);
      setLoadState("ready");
    } catch {
      setStatus({ ...FALLBACK_STATUS, checkedAt: new Date().toISOString() });
      setLoadState("error");
    }
  }, []);

  useEffect(() => {
    void checkRuntime();
    const interval = window.setInterval(() => void checkRuntime(), 15_000);
    return () => window.clearInterval(interval);
  }, [checkRuntime]);

  const readyChecks = useMemo(() => status.checks.filter((item) => item.ready).length, [status.checks]);
  const totalChecks = status.checks.length;

  const presentation = useMemo(() => {
    if (loadState === "loading") {
      return { label: "Checking AgentOS", tone: "text-zinc-400", dot: "bg-zinc-500" };
    }
    if (status.connected) {
      return {
        label: status.executionReady ? "AgentOS ready" : "AgentOS connected · authority locked",
        tone: status.executionReady ? "text-emerald-300" : "text-violet-200",
        dot: status.executionReady ? "bg-emerald-400" : "bg-violet-300",
      };
    }
    if (status.configured) {
      return { label: "AgentOS unavailable", tone: "text-amber-300", dot: "bg-amber-400" };
    }
    return { label: "Runtime not configured", tone: "text-zinc-500", dot: "bg-zinc-600" };
  }, [loadState, status.configured, status.connected, status.executionReady]);

  return (
    <div className="fixed right-[210px] top-[22px] z-[125] hidden lg:block">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 items-center gap-2 rounded-xl border border-white/[0.08] bg-black/70 px-3 shadow-xl backdrop-blur-xl transition-colors hover:bg-white/[0.04]"
      >
        <span className={cn("h-1.5 w-1.5 rounded-full", presentation.dot)} />
        <span className={cn("text-[9px] font-semibold uppercase tracking-[0.11em]", presentation.tone)}>{presentation.label}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-zinc-600 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-[360px] rounded-2xl border border-white/[0.09] bg-[#111217]/98 p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-semibold text-zinc-100">
                {status.connected ? <ShieldCheck className="h-4 w-4 text-emerald-300" /> : <ShieldAlert className="h-4 w-4 text-amber-300" />}
                AgentOS runtime substrate
              </div>
              <p className="mt-2 text-[10px] leading-5 text-zinc-500">{status.reason}</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close runtime status" className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/[0.07] text-zinc-600 hover:text-zinc-200">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <StatusCell label="Connection" value={status.connected ? "Connected" : status.configured ? "Unavailable" : "Not configured"} good={status.connected} />
            <StatusCell label="Execution" value={status.executionReady ? "Authorized" : "Locked"} good={status.executionReady} />
            <StatusCell label="Mode" value={status.executionMode} />
            <StatusCell label="Readiness" value={totalChecks ? `${readyChecks}/${totalChecks} checks` : "No probe data"} good={Boolean(totalChecks && readyChecks === totalChecks)} />
          </div>

          {status.checks.length > 0 && (
            <div className="mt-3 max-h-48 space-y-1 overflow-y-auto rounded-xl border border-white/[0.06] bg-black/25 p-2.5">
              {status.checks.map((item) => (
                <div key={item.name} className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5">
                  <span className="truncate text-[9px] text-zinc-500">{item.name}</span>
                  {item.ready ? <Check className="h-3.5 w-3.5 shrink-0 text-emerald-300" /> : <Activity className="h-3.5 w-3.5 shrink-0 text-amber-300" />}
                </div>
              ))}
            </div>
          )}

          <button type="button" onClick={() => void checkRuntime()} className="mt-3 inline-flex items-center gap-2 rounded-lg border border-white/[0.07] px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200">
            <RefreshCw className="h-3.5 w-3.5" /> Recheck runtime
          </button>
        </div>
      )}
    </div>
  );
}

function StatusCell({ label, value, good = false }: { label: string; value: string; good?: boolean }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-black/25 p-3">
      <div className="text-[8px] font-semibold uppercase tracking-[0.12em] text-zinc-700">{label}</div>
      <div className={cn("mt-1.5 truncate text-[10px] font-medium capitalize text-zinc-400", good && "text-emerald-300")}>{value}</div>
    </div>
  );
}
