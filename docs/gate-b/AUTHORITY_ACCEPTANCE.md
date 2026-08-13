# Gate B — Authority S6 Acceptance Proof

Status: active delivery gate

This lane does not recreate Authority S6. It defines the proof Daycostra must demand from the restored `authority-s6-v0.5.0` service before runtime mutation is enabled.

## Pinned authority candidate

- Release: `authority-s6-v0.5.0`
- Release head: `17452f5087609e567d37582d2724f8ed8e95ed7b`
- Source archive SHA-256: `d9147009bb25e991a94dc3feedfb00f6cf88987fcc6030cbbcb88574fffde88f`
- Git bundle SHA-256: `64ff186c015df0607e09e5c8973a027703ce851377e9ee48ba78d993808f6482`

The restored source must match one of the pinned digests before it is considered the canonical authority service.

## Required execution chain

A successful Gate B proof must preserve this order:

`authenticated human → workspace → mission → task → workload identity → active Delegation Lease → S6 online validation → AgentOS durable job → governed tool → artifact/evidence → preview reconciliation → lease close/revoke`

Human authentication is request/approval identity. It is not workload execution authority.

## S6 request contract

The Daycostra-side request model is pinned to the recovered S6 bridge contract:

- `resourceId`
- `operation`: `discover | read | write | execute | publish | destructive`
- `idempotencyKey`
- optional `modelId`
- optional `traceId`
- `projectedTokens`
- `projectedCostMinor`
- `timeoutMs`
- governed `input`

The registered resource determines the adapter. A browser or product caller does not acquire authority by selecting an adapter.

## Mandatory runtime credentials

S6 runtime execution requires both of the following, issued outside the browser session:

- short-lived Workload Identity credential
- Delegation Lease token

A Clerk cookie/session, AgentOS service key, provider API key, browser-supplied claim, or project identifier cannot substitute for either credential.

## Fail-closed acceptance cases

Before any mutation endpoint is enabled, the restored service must demonstrate all of these outcomes:

1. Missing human/workspace context cannot create an executable mission path.
2. Missing workload identity is denied.
3. Missing lease token is denied.
4. Expired lease is denied.
5. Revoked lease is denied.
6. Lease/resource mismatch is denied.
7. Lease/operation mismatch is denied.
8. Trace mismatch against the leased task is denied.
9. Unsupported/unregistered adapter fails closed.
10. Credential-bearing or oversized governed input is rejected according to the S6 limits.
11. Projected budget is reserved before dispatch.
12. Failed dispatch settles/refunds budget correctly.
13. Repeated idempotency key with the same governed digest resolves to the original action.
14. Repeated idempotency key with a changed resource, operation, model, lease or input digest is rejected.
15. Artifact evidence remains attributable to organization/workspace/mission/task/agent/workload/lease/resource/action/dispatch/trace where those identifiers exist.
16. Revocation after a completed action prevents subsequent actions under the revoked authority.

## First positive proof

The first allowed mutation must be intentionally narrow and reversible.

Acceptance evidence must contain:

- authenticated user identifier
- resolved workspace identifier
- mission identifier
- task identifier
- workload identifier
- active lease identifier
- resource identifier
- action identifier
- AgentOS job identifier
- shared trace/correlation identifier
- terminal action/job result
- produced artifact identifier/digest
- verification result
- preview reconciliation result
- terminal lease state

The Daycostra UI must not report `complete` merely because the worker returned success. Completion requires terminal execution plus reconciled artifact/evidence.

## Non-goals for this lane

- no browser-to-AgentOS mutation endpoint
- no AgentOS service credential in client code
- no workload/lease secret in client code
- no synthetic S6 authority probe that mints credentials
- no duplicate queue/retry/lease state machine in Daycostra
- no bulk merge of the historical Authority application into the current TanStack shell

## Promotion rule

`DAYCOSTRA_RUNTIME_EXECUTION_MODE=authenticated` may be considered only after the positive proof and fail-closed cases above are demonstrated against a restored, digest-verified S6 service and the AgentOS readiness gate is green.
