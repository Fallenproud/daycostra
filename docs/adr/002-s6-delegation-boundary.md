# ADR 002 — Daycostra Authority S6 is the mandatory execution boundary

Status: accepted

## Decision

Daycostra will not expose AgentOS durable job execution directly to browser sessions or treat an AgentOS service credential as user execution authority.

The canonical mutation path is:

`authenticated Daycostra identity → organization/workspace → mission/task → workload identity → Delegation Lease → Authority S6 → AgentOS → governed worker/tool → artifact/evidence → preview reconciliation`

AgentOS readiness is necessary but never sufficient to unlock execution.

## Pinned authority release

The recovered authority candidate is pinned to:

- release: `authority-s6-v0.5.0`
- release head: `17452f5087609e567d37582d2724f8ed8e95ed7b`
- source archive SHA-256: `d9147009bb25e991a94dc3feedfb00f6cf88987fcc6030cbbcb88574fffde88f`
- git bundle SHA-256: `64ff186c015df0607e09e5c8973a027703ce851377e9ee48ba78d993808f6482`

The exact source archive or Git bundle should be restored and verified against these digests before the authority service is promoted into a deployment environment. The current TanStack Daycostra shell must not bulk-merge the older authority application.

## S6 action contract

Canonical API surface from the recovered release:

- `GET /api/authority/bridge/actions`
- `POST /api/authority/bridge/actions`
- `GET /api/authority/bridge/actions/{actionId}`

A create request contains:

- `resourceId`
- `operation`: `discover | read | write | execute | publish | destructive`
- `idempotencyKey`
- optional `modelId`
- optional `traceId`
- `projectedTokens`
- `projectedCostMinor`
- `timeoutMs`
- governed `input`

S6 selects the registered adapter from the governed resource. Callers do not gain authority by choosing an adapter.

## Runtime credential contract

Execution requires two independent runtime credentials:

- `Authorization: Workload <short-lived workload credential>`
- `x-daycostra-lease-token: <Delegation Lease token>`

A Clerk session token, browser cookie, AgentOS service credential, model provider key, or arbitrary caller claim is not a substitute for either runtime credential.

The browser must not receive workload or lease secrets merely to submit an IDE prompt. Daycostra must first resolve the authenticated actor and workspace, create/authorize a mission and task, bind a workload, evaluate policy, obtain any required approval, and issue a bounded lease.

## Truthful readiness semantics

`/api/runtime/health` may expose sanitized readiness only.

- AgentOS configured/reachable: runtime engine is available.
- S6 configured: authority endpoint location is configured, but live authority is not yet proven.
- S6 authority proven: only after a real authenticated mission succeeds through workload + lease validation.
- execution ready: only after both runtime and authority gates are satisfied by the governed path.

No synthetic health probe may mint authority or make execution appear enabled.

## Idempotency and provenance

Each governed action is mission scoped and uses S6 workspace/workload idempotency. A repeated key is accepted only when lease, resource, operation, model and input digest match the original action.

Artifacts must remain attributable through the available organization, workspace, mission, task, agent, workload, lease, resource, action, dispatch and trace identifiers.

The Daycostra preview may refresh after a mutation only when the terminal runtime result and governed artifact/evidence reconciliation agree.

## Authentication provider

Clerk is the selected human identity provider for the current TanStack Start shell. The integration must use the official `@clerk/tanstack-react-start` SDK, server middleware and server-side auth checks. Public `/` remains available without authentication; execution surfaces such as `/ide` become protected.

Human identity establishes who may request/approve a mission. It does not replace S6 workload identity or Delegation Lease authority.

## Current implementation state

Implemented:

- AgentOS server-only readiness federation.
- Authority S6 request/response TypeScript contracts.
- Authority S6 configuration readiness gate.
- Runtime health separates engine readiness from authority readiness.
- IDE runtime status exposes both gates and keeps execution locked.
- Deployment environment contract documents AgentOS, S6 and Clerk configuration.

Intentionally not implemented yet:

- browser-accessible runtime mutation endpoint.
- direct browser-to-AgentOS job creation.
- workload/lease secret forwarding from the browser.
- claims that S6 is connected merely because an endpoint is configured.

Next acceptance proof:

`sign in → resolve workspace → create one mission/task → bind one workload → issue one scoped lease → execute one S6 action through AgentOS → receive one artifact → correlate evidence/runtime events → reconcile preview → revoke/close authority`
