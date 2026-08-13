export type AuthorityOperation =
  | "discover"
  | "read"
  | "write"
  | "execute"
  | "publish"
  | "destructive";

export type AuthorityActionState =
  | "received"
  | "authorized"
  | "dispatching"
  | "completed"
  | "failed"
  | "denied"
  | "timed_out"
  | "cancelled";

export interface AuthorityRuntimeCredentials {
  /** Short-lived credential for the workload identity bound to the mission. */
  workloadCredential: string;
  /** One-time delegation lease token. Only its digest is persisted by Authority S6. */
  leaseToken: string;
}

export interface GovernedActionCreateInput {
  resourceId: string;
  operation: AuthorityOperation;
  idempotencyKey: string;
  input: Record<string, unknown>;
  modelId?: string;
  traceId?: string;
  projectedTokens?: number;
  projectedCostMinor?: number;
  timeoutMs?: number;
}

export interface GovernedActionDispatch {
  id?: string;
  attempt?: number;
  adapterKey?: string;
  state?: string;
  timeoutMs?: number;
  tokensUsed?: number;
  costMinor?: number;
  statusCode?: number | null;
  errorCode?: string | null;
  errorMessage?: string | null;
  startedAt?: string;
  completedAt?: string | null;
}

export interface GovernedArtifact {
  id?: string;
  title?: string;
  type?: string;
  format?: string;
  storageRef?: string;
  contentHash?: string;
  validationState?: string;
  createdAt?: string;
}

export interface GovernedAction {
  id: string;
  actionKey?: string;
  organizationId?: string;
  workspaceId?: string;
  missionId?: string;
  taskId?: string;
  agentIdentityId?: string;
  boxId?: string | null;
  workloadId?: string;
  leaseId?: string;
  resourceId?: string;
  traceId?: string;
  operation?: AuthorityOperation;
  modelId?: string | null;
  adapterKey?: string | null;
  state: AuthorityActionState;
  inputDigest?: string;
  projectedTokens?: number;
  projectedCostMinor?: number;
  timeoutMs?: number;
  resultDigest?: string | null;
  errorCode?: string | null;
  errorMessage?: string | null;
  createdAt?: string;
  completedAt?: string | null;
  dispatches?: GovernedActionDispatch[];
  artifact?: GovernedArtifact | null;
}

export interface GovernedActionResponse {
  action?: GovernedAction;
  allowed?: boolean;
  code?: string;
  reasons?: string[];
  error?: string;
}

export interface AuthorityBoundaryStatus {
  provider: "daycostra-s6";
  configured: boolean;
  connected: boolean;
  executionReady: boolean;
  release: "authority-s6-v0.5.0";
  reason: string;
}
