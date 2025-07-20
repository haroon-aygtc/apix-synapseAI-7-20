"use client";

import React from "react";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { useAPXConnection } from "../../lib/apix/hooks";
import { APXConnectionStatus } from "../../lib/apix/types";
import { cn } from "../../lib/utils";

/**
 * A component that displays the current APIX connection status
 * with appropriate visual indicators and detailed tooltip information
 */
export function APXConnectionIndicator() {
  const { status, metrics } = useAPXConnection();
  
  // Map connection status to visual properties
  const statusConfig = {
    connected: {
      label: "APIX Connected",
      variant: "success" as const,
      dotColor: "bg-green-500",
      tooltip: "Connected to APIX services"
    },
    connecting: {
      label: "APIX Connecting",
      variant: "warning" as const,
      dotColor: "bg-yellow-500",
      tooltip: "Establishing connection to APIX services..."
    },
    reconnecting: {
      label: "APIX Reconnecting",
      variant: "warning" as const,
      dotColor: "bg-yellow-500",
      tooltip: "Attempting to reconnect to APIX services..."
    },
    disconnected: {
      label: "APIX Disconnected",
      variant: "destructive" as const,
      dotColor: "bg-red-500",
      tooltip: "Disconnected from APIX services"
    },
    error: {
      label: "APIX Error",
      variant: "destructive" as const,
      dotColor: "bg-red-500",
      tooltip: "Error connecting to APIX services"
    }
  };

  const config = statusConfig[status];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant={config.variant}
            className="px-2 py-1 flex items-center gap-1.5 cursor-default"
          >
            <span className={cn("h-2 w-2 rounded-full animate-pulse", config.dotColor)} />
            <span className="text-xs font-medium">{config.label}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="flex flex-col gap-1 max-w-[220px]">
          <p className="font-medium">{config.tooltip}</p>
          {metrics && status === "connected" && (
            <div className="text-xs text-primary-foreground/80">
              <div>Uptime: {formatTime(metrics.connectionUptime)}</div>
              <div>Events: {metrics.eventsProcessed} ({metrics.eventsPerSecond}/s)</div>
              <div>Latency: {metrics.averageLatency.toFixed(0)}ms</div>
            </div>
          )}
          {status === "error" && (
            <p className="text-xs">Check network connection or contact system administrator.</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Helper function to format uptime in a human-readable format
function formatTime(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ${seconds % 60}s`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
} 