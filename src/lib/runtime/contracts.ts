export type RuntimeExecutionMode = "disabled" | "development" | "authenticated";

export interface RuntimeReadinessCheck {
  name: string;
  ready: boolean;
  detail?: string;
}

export interface RuntimeBridgeStatus {
  engine: "agentos";
  configured: boolean;
  connected: boolean;
  executionReady: boolean;
  executionMode: RuntimeExecutionMode;
  reason: string;
  checkedAt: string;
  upstreamTimestamp?: string;
  checks: RuntimeReadinessCheck[];
}

export type RuntimeRunStatus =
  | "queued"
  | "leased"
  | "running"
  | "retrying"
  | "completed"
  | "failed"
  | "cancelled"
  | "expired"
  | "unknown";

export interface RuntimeRun {
  id: string;
  status: RuntimeRunStatus;
  action?: string;
  resource?: string;
  traceId?: string;
  requestId?: string;
  attempts?: number;
  maxAttempts?: number;
  queuedAt?: string;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  expiredAt?: string;
  nextRetryAt?: string;
  errorCode?: string;
  errorMessage?: string;
  output?: unknown;
}

export interface RuntimeEvent {
  eventId: string;
  eventType: string;
  status?: string;
  severity?: string;
  message?: string;
  jobId?: string;
  traceId?: string;
  createdAt?: string;
  payload?: unknown;
}

export interface RuntimeRunCreateInput {
  prompt: string;
  model?: string;
  idempotencyKey: string;
  attachments?: Array<{ name: string; size: number }>;
}

export interface RuntimeRunEventsResponse {
  events: RuntimeEvent[];
  total: number;
}

export const TERMINAL_RUNTIME_STATUSES = new Set<RuntimeRunStatus>([
  "completed",
  "failed",
  "cancelled",
  "expired",
]);
