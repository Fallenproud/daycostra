# ADR 001 — AgentOS is the Daycostra runtime substrate

Status: Accepted
Date: 2026-08-13

## Decision

Daycostra will not build a second general-purpose execution engine.

The canonical separation is:

- **Daycostra** owns the product/control surface, project context, preview experience and operator-facing mission state.
- **Daycostra Authority S6** is the delegation and authorization boundary for governed execution.
- **AgentOS 2.0 RC4.2** is the reusable runtime and policy substrate for durable execution, runtime lifecycle and guarded tools.

## Integration rule

The current Daycostra application may observe AgentOS readiness through a server-side adapter. Mutation/execution remains locked until the canonical authenticated mission and delegation boundary is present.

The browser must never receive AgentOS service credentials or become a direct privileged runtime client.

## Reuse rule

Do not copy AgentOS queue, lease, retry, cancellation, checkpoint, policy or runtime-event semantics into Daycostra. Integrate those capabilities through explicit contracts and adapters.

Do not replace the S6 authority model with frontend flags or a generic proxy.

## Truthfulness rule

Daycostra may show only execution states backed by actual runtime or authority evidence. A prompt, animation or optimistic UI transition is not proof that code or artifacts changed.

## Promotion rule

The first real integration proof must close one mission end to end with authenticated authority, an explicit runtime terminal state, attributable artifact output and correlated evidence. Production promotion is a separate release gate from that first controlled proof.
