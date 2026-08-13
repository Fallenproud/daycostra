import type { AuthorityBoundaryStatus } from "./contracts";

function envValue(name: string) {
  if (typeof process === "undefined") return undefined;
  const value = process.env?.[name]?.trim();
  return value || undefined;
}

function configuredAuthorityUrl() {
  const raw = envValue("DAYCOSTRA_AUTHORITY_S6_URL");
  if (!raw) return undefined;

  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") return undefined;
    return url;
  } catch {
    return undefined;
  }
}

/**
 * Configuration readiness only.
 *
 * S6 has no unauthenticated health contract in the recovered v0.5 release. We
 * therefore do not invent one and do not treat an endpoint string as proof of
 * live authority. Connectivity is proven later by an authenticated mission
 * flow using a workload identity and Delegation Lease.
 */
export function getAuthorityBoundaryStatus(): AuthorityBoundaryStatus {
  const configured = Boolean(configuredAuthorityUrl());

  return {
    provider: "daycostra-s6",
    configured,
    connected: false,
    executionReady: false,
    release: "authority-s6-v0.5.0",
    reason: configured
      ? "Authority S6 is configured. Live authority remains unproven until an authenticated mission obtains workload identity and a Delegation Lease."
      : "Authority S6 is not configured on the Daycostra server.",
  };
}
