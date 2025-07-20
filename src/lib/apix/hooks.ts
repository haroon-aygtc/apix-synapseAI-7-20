"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { APXClient, getAPXClient } from "./client";
import {
  APXEvent,
  APXEventType,
  APXConnectionStatus,
  APXMetrics,
  APXCrossModuleContext,
} from "./types";

// Hook for managing APIX connection
export const useAPXConnection = () => {
  const [status, setStatus] = useState<APXConnectionStatus>("disconnected");
  const [metrics, setMetrics] = useState<APXMetrics | null>(null);
  const clientRef = useRef<APXClient | null>(null);

  useEffect(() => {
    clientRef.current = getAPXClient();

    // Monitor connection status
    const checkStatus = () => {
      if (clientRef.current) {
        setStatus(clientRef.current.getConnectionStatus());
        setMetrics(clientRef.current.getMetrics());
      }
    };

    const interval = setInterval(checkStatus, 1000);
    checkStatus(); // Initial check

    return () => {
      clearInterval(interval);
    };
  }, []);

  const connect = useCallback(
    async (organizationId: string, userId: string, sessionId?: string) => {
      if (clientRef.current) {
        try {
          await clientRef.current.connect(organizationId, userId, sessionId);
          setStatus(clientRef.current.getConnectionStatus());
        } catch (error) {
          console.error("Failed to connect to APIX:", error);
          setStatus("error");
        }
      }
    },
    [],
  );

  const disconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.disconnect();
      setStatus("disconnected");
    }
  }, []);

  return {
    status,
    metrics,
    connect,
    disconnect,
    client: clientRef.current,
  };
};

// Hook for subscribing to specific events
export const useAPXSubscription = (
  eventTypes: APXEventType[],
  callback: (event: APXEvent) => void,
  options: {
    organizationId?: string;
    userId?: string;
    sessionId?: string;
    filter?: (event: APXEvent) => boolean;
    enabled?: boolean;
  } = {},
) => {
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [eventCount, setEventCount] = useState(0);
  const [lastEvent, setLastEvent] = useState<APXEvent | null>(null);
  const clientRef = useRef<APXClient | null>(null);
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (options.enabled === false) return;

    clientRef.current = getAPXClient();

    const wrappedCallback = (event: APXEvent) => {
      setEventCount((prev) => prev + 1);
      setLastEvent(event);
      callbackRef.current(event);
    };

    const subId = clientRef.current.subscribe({
      eventTypes,
      organizationId: options.organizationId,
      userId: options.userId,
      sessionId: options.sessionId,
      filter: options.filter,
      callback: wrappedCallback,
    });

    setSubscriptionId(subId);

    return () => {
      if (clientRef.current && subId) {
        clientRef.current.unsubscribe(subId);
      }
    };
  }, [
    eventTypes.join(","),
    options.organizationId,
    options.userId,
    options.sessionId,
    options.enabled,
  ]);

  return {
    subscriptionId,
    eventCount,
    lastEvent,
    isSubscribed: subscriptionId !== null,
  };
};

// Hook for emitting events
export const useAPXEmitter = () => {
  const clientRef = useRef<APXClient | null>(null);

  useEffect(() => {
    clientRef.current = getAPXClient();
  }, []);

  const emit = useCallback(
    <T = any>(
      eventType: APXEventType,
      data: T,
      context?: APXCrossModuleContext,
    ) => {
      if (clientRef.current) {
        clientRef.current.emit(eventType, data, context);
      }
    },
    [],
  );

  return { emit };
};

// Hook for real-time state synchronization
export const useAPXState = <T = any>(moduleId: string, initialState: T) => {
  const [state, setState] = useState<T>(initialState);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSync, setLastSync] = useState<number | null>(null);
  const clientRef = useRef<APXClient | null>(null);

  useEffect(() => {
    clientRef.current = getAPXClient();

    // Try to get existing state
    const existingState = clientRef.current.getState(moduleId);
    if (existingState) {
      setState(existingState as T);
      setLastSync(Date.now());
    }
    setIsLoading(false);
  }, [moduleId]);

  const syncState = useCallback(
    (newState: Partial<T>) => {
      const updatedState = { ...state, ...newState };
      setState(updatedState);

      if (clientRef.current) {
        clientRef.current.syncState(moduleId, updatedState);
        setLastSync(Date.now());
      }
    },
    [moduleId, state],
  );

  const resetState = useCallback(() => {
    setState(initialState);
    if (clientRef.current) {
      clientRef.current.syncState(moduleId, initialState);
      setLastSync(Date.now());
    }
  }, [moduleId, initialState]);

  return {
    state,
    syncState,
    resetState,
    isLoading,
    lastSync,
  };
};

// Hook for cross-module event routing
export const useAPXCrossModule = () => {
  const clientRef = useRef<APXClient | null>(null);

  useEffect(() => {
    clientRef.current = getAPXClient();
  }, []);

  const routeToModule = useCallback(
    (
      targetModule: string,
      eventType: APXEventType,
      data: any,
      context: Partial<APXCrossModuleContext> = {},
    ) => {
      if (clientRef.current) {
        const fullContext: APXCrossModuleContext = {
          sourceModule: "unknown",
          targetModule,
          executionPath: [],
          sessionContext: {},
          userJourney: {
            path: [],
            timestamp: Date.now(),
            context: {},
          },
          ...context,
        };

        clientRef.current.emit(eventType, data, fullContext);
      }
    },
    [],
  );

  return { routeToModule };
};

// Hook for event replay and debugging
export const useAPXReplay = () => {
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayEvents, setReplayEvents] = useState<APXEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const clientRef = useRef<APXClient | null>(null);

  useEffect(() => {
    clientRef.current = getAPXClient();
  }, []);

  const requestReplay = useCallback(
    async (config: {
      fromTimestamp?: number;
      toTimestamp?: number;
      eventTypes?: APXEventType[];
      sessionId?: string;
      maxEvents?: number;
    }) => {
      if (!clientRef.current) return;

      setIsReplaying(true);
      setError(null);

      try {
        const events = await clientRef.current.requestReplay(config);
        setReplayEvents(events);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Replay failed");
      } finally {
        setIsReplaying(false);
      }
    },
    [],
  );

  const clearReplay = useCallback(() => {
    setReplayEvents([]);
    setError(null);
  }, []);

  return {
    requestReplay,
    clearReplay,
    isReplaying,
    replayEvents,
    error,
  };
};

// Hook for monitoring APIX health and performance
export const useAPXMonitoring = () => {
  const [metrics, setMetrics] = useState<APXMetrics | null>(null);
  const [connectionHealth, setConnectionHealth] = useState<
    "healthy" | "degraded" | "unhealthy"
  >("healthy");
  const clientRef = useRef<APXClient | null>(null);

  useEffect(() => {
    clientRef.current = getAPXClient();

    const updateMetrics = () => {
      if (clientRef.current) {
        const currentMetrics = clientRef.current.getMetrics();
        setMetrics(currentMetrics);

        // Determine connection health
        if (currentMetrics.errorRate > 0.1) {
          setConnectionHealth("unhealthy");
        } else if (
          currentMetrics.averageLatency > 1000 ||
          currentMetrics.queueSize > 100
        ) {
          setConnectionHealth("degraded");
        } else {
          setConnectionHealth("healthy");
        }
      }
    };

    const interval = setInterval(updateMetrics, 5000);
    updateMetrics(); // Initial update

    return () => clearInterval(interval);
  }, []);

  return {
    metrics,
    connectionHealth,
    isHealthy: connectionHealth === "healthy",
  };
};
