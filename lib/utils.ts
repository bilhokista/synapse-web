import type { Transaction } from "./types";

export function shortId(id: string): string {
  return id ? id.slice(0, 13) + "…" : "—";
}

export function elapsed(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

export function formatAmount(n: number): string {
  return n.toFixed(2);
}

// Case-insensitive across every field. Previously `status` and `asset` were
// compared against an uppercased query while `id` and `memo` used the raw
// string, so "usdc" matched the asset but "USDC" did not match a lowercase
// memo — the field you happened to search decided whether case mattered.
//
// Exported as a pure function so it can be tested directly once a test runner
// exists (see #19); today it has no test to attach to.
export function matchesTransactionFilter(tx: Transaction, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    tx.id.toLowerCase().includes(q) ||
    tx.status.toLowerCase().includes(q) ||
    tx.asset.toLowerCase().includes(q) ||
    tx.memo.toLowerCase().includes(q)
  );
}
