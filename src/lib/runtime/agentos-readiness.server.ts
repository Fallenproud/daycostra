import type { RuntimeBridgeStatus, RuntimeExecutionMode, RuntimeReadinessCheck } from "./contracts";

const TIMEOUT_MS = 8_000;

function envValue(name: string) {
  if (typeof process === "undefined") return undefined;
  const value = process.env?.[name]?.trim();
  return value || undefined;
}

function executionMode(): RuntimeExecutionMode {
  const value = envValue("DAYCOSTRA_RUNTIME_EXECUTION_MODE");
  if (value === "development" || value === "authenticated") return value;
  return "disabled";
}

function baseUrl() {
  const raw = envValue("DAYCOSTRA_AGENTOS_URL");
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") return undefined;
    url.pathname = url.pathname.replace(/\/$/, "");
    url.search = "";
    url.hash = "";
    return url;
  } catch {
    return undefined;
  }
}

function safeObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function safeString(value: unknown, max = 500) {
  return typeof value === "string" && value.length <= max ? value : undefined;
}

export async function getAgentOsReadiness(): Promise<RuntimeBridgeStatus> {
  const checkedAt = new Date().toISOString();
  const url = baseUrl();
  const apiKey = envValue("DAYCOSTRA_AGENTOS_API_KEY");
  const mode = executionMode();

  if (!url || !apiKey) {
    return {
      engine: "agentos",
      configured: false,
      connected: false,
      executionReady: false,
      executionMode: mode,
      reason: "AgentOS endpoint and service credential are not configured on the Daycostra server.",
      checkedAt,
      checks: [],
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const endpoint = new URL("/api/agentos/runtime/readiness", url);
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        accept: "application/json",
        "X-AgentOS-Key": apiKey,
      },
      redirect: "error",
      signal: controller.signal,
    });

    if (!response.ok) {
      return {
        engine: "agentos",
        configured: true,
        connected: false,
        executionReady: false,
        executionMode: mode,
        reason: `AgentOS readiness returned HTTP ${response.status}.`,
        checkedAt,
        checks: [],
      };
    }

    const body = safeObject(await response.json());
    const upstreamChecks = Array.isArray(body.checks) ? body.checks : [];
    const checks: RuntimeReadinessCheck[] = upstreamChecks.slice(0, 50).flatMap((value) => {
      const row = safeObject(value);
      const name = safeString(row.name, 160);
      return name ? [{ name, ready: row.ready === true }] : [];
    });
    const overall = body.overall === true;

    return {
      engine: "agentos",
      configured: true,
      connected: true,
      executionReady: false,
      executionMode: mode,
      reason: overall
        ? "AgentOS is connected. Execution remains locked until Daycostra identity, mission scope and delegation authority are wired."
        : "AgentOS is connected but its readiness gate is not green.",
      checkedAt,
      upstreamTimestamp: safeString(body.timestamp, 80),
      checks,
    };
  } catch {
    return {
      engine: "agentos",
      configured: true,
      connected: false,
      executionReady: false,
      executionMode: mode,
      reason: "AgentOS readiness could not be reached from the Daycostra server.",
      checkedAt,
      checks: [],
    };
  } finally {
    clearTimeout(timeout);
  }
}
