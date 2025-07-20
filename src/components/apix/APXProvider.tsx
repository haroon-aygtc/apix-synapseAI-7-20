"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { APXClient, getAPXClient } from "@/lib/apix/client";
import { APXConnectionStatus, APXMetrics } from "@/lib/apix/types";

// APIX Context for providing real-time engine access throughout the app
interface APXContextValue {
  client: APXClient;
  status: APXConnectionStatus;
  metrics: APXMetrics | null;
  isConnected: boolean;
  connect: (
    organizationId: string,
    userId: string,
    sessionId?: string,
  ) => Promise<void>;
  disconnect: () => void;
}

const APXContext = createContext<APXContextValue | null>(null);

interface APXProviderProps {
  children: ReactNode;
  autoConnect?: boolean;
  organizationId?: string;
  userId?: string;
  sessionId?: string;
  config?: {
    websocketUrl?: string;
    reconnectAttempts?: number;
    reconnectDelay?: number;
    heartbeatInterval?: number;
    debug?: boolean;
  };
}

export function APXProvider({
  children,
  autoConnect = true,
  organizationId = "org_default",
  userId = "user_default",
  sessionId,
  config = {},
}: APXProviderProps) {
  const [client] = useState(() => getAPXClient(config));
  const [status, setStatus] = useState<APXConnectionStatus>("disconnected");
  const [metrics, setMetrics] = useState<APXMetrics | null>(null);

  // Monitor connection status and metrics
  useEffect(() => {
    const updateStatus = () => {
      setStatus(client.getConnectionStatus());
      setMetrics(client.getMetrics());
    };

    const interval = setInterval(updateStatus, 1000);
    updateStatus(); // Initial update

    return () => clearInterval(interval);
  }, [client]);

  // Auto-connect on mount if enabled
  useEffect(() => {
    if (autoConnect && status === "disconnected") {
      connect(organizationId, userId, sessionId);
    }
  }, [autoConnect, organizationId, userId, sessionId]);

  const connect = async (orgId: string, uId: string, sId?: string) => {
    try {
      await client.connect(orgId, uId, sId);
    } catch (error) {
      console.error("Failed to connect to APIX:", error);
    }
  };

  const disconnect = () => {
    client.disconnect();
  };

  const contextValue: APXContextValue = {
    client,
    status,
    metrics,
    isConnected: status === "connected",
    connect,
    disconnect,
  };

  return (
    <APXContext.Provider value={contextValue}>{children}</APXContext.Provider>
  );
}

// Hook to use APIX context
export function useAPXContext(): APXContextValue {
  const context = useContext(APXContext);
  if (!context) {
    throw new Error("useAPXContext must be used within an APXProvider");
  }
  return context;
}

// Connection status indicator component
export function APXConnectionIndicator() {
  const { status, metrics } = useAPXContext();

  const getStatusColor = () => {
    switch (status) {
      case "connected":
        return "bg-green-500";
      case "connecting":
        return "bg-yellow-500";
      case "reconnecting":
        return "bg-orange-500";
      case "disconnected":
        return "bg-gray-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "connected":
        return "Connected";
      case "connecting":
        return "Connecting...";
      case "reconnecting":
        return "Reconnecting...";
      case "disconnected":
        return "Disconnected";
      case "error":
        return "Connection Error";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="flex items-center space-x-2 text-sm">
      <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
      <span className="text-muted-foreground">{getStatusText()}</span>
      {metrics && status === "connected" && (
        <span className="text-xs text-muted-foreground">
          ({metrics.eventsProcessed} events)
        </span>
      )}
    </div>
  );
}

// Real-time metrics display component
export function APXMetricsDisplay() {
  const { metrics, isConnected } = useAPXContext();

  if (!isConnected || !metrics) {
    return (
      <div className="text-sm text-muted-foreground">No metrics available</div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
      <div className="space-y-1">
        <div className="text-muted-foreground">Events Processed</div>
        <div className="font-medium">
          {metrics.eventsProcessed.toLocaleString()}
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-muted-foreground">Events/sec</div>
        <div className="font-medium">{metrics.eventsPerSecond.toFixed(1)}</div>
      </div>
      <div className="space-y-1">
        <div className="text-muted-foreground">Avg Latency</div>
        <div className="font-medium">{metrics.averageLatency.toFixed(0)}ms</div>
      </div>
      <div className="space-y-1">
        <div className="text-muted-foreground">Subscriptions</div>
        <div className="font-medium">{metrics.activeSubscriptions}</div>
      </div>
      <div className="space-y-1">
        <div className="text-muted-foreground">Queue Size</div>
        <div className="font-medium">{metrics.queueSize}</div>
      </div>
      <div className="space-y-1">
        <div className="text-muted-foreground">Error Rate</div>
        <div className="font-medium">
          {(metrics.errorRate * 100).toFixed(1)}%
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-muted-foreground">Uptime</div>
        <div className="font-medium">
          {Math.floor(metrics.connectionUptime / 1000)}s
        </div>
      </div>
    </div>
  );
}
