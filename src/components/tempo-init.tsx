"use client";

import { TempoDevtools } from "tempo-devtools";
import { useEffect } from "react";
import { APXProvider } from "@/components/apix/APXProvider";

export function TempoInit({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_TEMPO) {
      TempoDevtools.init();
    }
  }, []);

  return (
    <APXProvider
      autoConnect={true}
      organizationId="org_synapseai"
      userId="user_default"
      config={{
        websocketUrl: process.env.NEXT_PUBLIC_APIX_URL || 'ws://localhost:3001',
        debug: process.env.NODE_ENV === 'development',
        reconnectAttempts: 5,
        reconnectDelay: 2000,
        heartbeatInterval: 30000
      }}
    >
      {children}
    </APXProvider>
  );
}