"use client";
import { useState, useEffect } from "react";
import { useSorobanHealth } from "./SorobanProvider";

export type ConnectionStatus = "connected" | "disconnected" | "error";

export function useSorobanStatus() {
  const health = useSorobanHealth();
  const [lastEventAge, setLastEventAge] = useState<string | null>(null);

  useEffect(() => {
    if (!health.lastEventTimestamp) {
      setLastEventAge(null);
      return;
    }
    function update() {
      const seconds = Math.floor((Date.now() - health.lastEventTimestamp) / 1000);
      if (seconds < 60) {
        setLastEventAge(`${seconds}s ago`);
      } else {
        const minutes = Math.floor(seconds / 60);
        setLastEventAge(`${minutes}m ago`);
      }
    }
    update();
    const timer = setInterval(update, 5000);
    return () => clearInterval(timer);
  }, [health.lastEventTimestamp]);

  const status: ConnectionStatus = health.error
    ? "error"
    : health.connected
      ? "connected"
      : "disconnected";

  return {
    status,
    lastEventAge,
    health,
  };
}
