"use client";
import { useState, useMemo } from "react";
import { StatCards } from "./StatCards";
import { Pipeline } from "./Pipeline";
import { ContractInfoPanel } from "./ContractInfoPanel";
import { RecentTxTable } from "./RecentTxTable";
import { TxDetailModal } from "@/components/transactions/TxDetailModal";
import { MOCK_CONTRACT_INFO, MOCK_TXS } from "@/lib/mock-data";
import { useSorobanEvents } from "@/lib/soroban/SorobanProvider";
import type { Transaction } from "@/lib/types";

function eventsToTransactions(
  events: ReturnType<typeof useSorobanEvents>,
): Transaction[] {
  const txMap = new Map<string, Transaction>();
  for (const tx of MOCK_TXS) {
    txMap.set(tx.id, tx);
  }
  for (const event of events) {
    if (event.type === "StatusChanged" && event.txId && event.toStatus) {
      const existing = txMap.get(event.txId);
      if (existing) {
        txMap.set(event.txId, {
          ...existing,
          status: event.toStatus as Transaction["status"],
          timestamp: event.timestamp,
        });
      }
    }
  }
  return Array.from(txMap.values());
}

export function DashboardTab() {
  const [selected, setSelected] = useState<Transaction | null>(null);
  const sorobanEvents = useSorobanEvents();
  const txs = useMemo(() => eventsToTransactions(sorobanEvents), [sorobanEvents]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }} className="animate-fade-in">
      {selected && <TxDetailModal tx={selected} onClose={() => setSelected(null)} />}
      <StatCards txs={txs} />
      <Pipeline txs={txs} />
      <div className="dashboard-grid">
        <ContractInfoPanel info={MOCK_CONTRACT_INFO} />
        <RecentTxTable txs={txs} onSelect={setSelected} />
      </div>
    </div>
  );
}
