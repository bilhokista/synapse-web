"use client";
import type { CSSProperties } from "react";
import { BORDER, DIM } from "@/lib/constants";
import type { TableStatus } from "@/lib/types";

interface TableStateRowProps {
  status: TableStatus;
  /** Number of columns to span, so the message stays centred under the header. */
  colSpan: number;
  /** Present only when `status` is "error". Shown so the cause is visible. */
  error?: string | null;
  /**
   * Whether a filter is currently narrowing the data. Distinguishes "nothing
   * matched what you typed" from "this account has no transactions at all" —
   * telling someone to adjust a filter they never set is the specific failure
   * this component exists to avoid.
   */
  isFiltered?: boolean;
}

const CELL_STYLE: CSSProperties = {
  padding: 24,
  textAlign: "center",
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 11,
};

const SKELETON_ROW_STYLE: CSSProperties = {
  height: 10,
  background: BORDER,
  margin: "8px auto",
  maxWidth: 420,
};

export function TableStateRow({ status, colSpan, error, isFiltered = true }: TableStateRowProps) {
  if (status === "loading") {
    return (
      <tr>
        <td colSpan={colSpan} style={{ ...CELL_STYLE, color: DIM }}>
          {/* Three bars rather than a spinner: the height stays close to a few
              rows of data, so the table does not jump when results arrive. */}
          <div aria-hidden style={{ ...SKELETON_ROW_STYLE, opacity: 0.55 }} />
          <div aria-hidden style={{ ...SKELETON_ROW_STYLE, opacity: 0.4 }} />
          <div aria-hidden style={{ ...SKELETON_ROW_STYLE, opacity: 0.25 }} />
          <span role="status">loading transactions…</span>
        </td>
      </tr>
    );
  }

  if (status === "error") {
    return (
      <tr>
        <td colSpan={colSpan} style={{ ...CELL_STYLE, color: "#e5484d" }}>
          <div role="alert">could not load transactions</div>
          {error && (
            <div style={{ marginTop: 6, fontSize: 10, color: DIM }}>{error}</div>
          )}
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td colSpan={colSpan} style={{ ...CELL_STYLE, color: DIM }}>
        {isFiltered ? "no transactions match filter" : "no transactions registered yet"}
      </td>
    </tr>
  );
}
