"use client";

import { io, Socket } from 'socket.io-client';
import {
  APXEvent,
  APXEventType,
  APXSubscription,
  APXConnectionStatus,
  APXStateSync,
  APXReplayConfig,
  APXCrossModuleContext,
  APXMetrics,
  APXError,
  APXConfig,
  APXPersistenceConfig
} from './types';

// APIX Real-Time Engine Client
export class APXClient {
  private socket: Socket | null = null;
  private subscriptions: Map<string, APXSubscription> = new Map();
  private connectionStatus: APXConnectionStatus = 'disconnected';
  private eventQueue: APXEvent[] = [];
  private stateCache: Map<string, APXStateSync> = new Map();
  private metrics: APXMetrics = {
    eventsProcessed: 0,
    eventsPerSecond: 0,
    averageLatency: 0,
    errorRate: 0,
    connectionUptime: 0,
    activeSubscriptions: 0,
    queueSize: 0
  };
  private config: APXConfig;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private metricsTimer: NodeJS.Timeout | null = null;
  private eventBuffer: APXEvent[] = [];
  private persistenceEnabled = false;

  constructor(config: Partial<APXConfig> = {}) {
    this.config = {
      websocketUrl: process.env.NEXT_PUBLIC_APIX_URL || 'ws://localhost:3001',
      reconnectAttempts: 5,
      reconnectDelay: 2000,
      heartbeatInterval: 30000,
      eventQueueSize: 1000,
      persistence: {
        enabled: true,
        storageType: 'localStorage',
        maxEvents: 10000,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        compression: false
      },
      debug: process.env.NODE_ENV === 'development',
      ...config
    };

    this.initializePersistence();
    this.startMetricsCollection();
  }

  // Initialize connection to APIX WebSocket gateway
  async connect(organizationId: string, userId: string, sessionId?: string): Promise<void> {
    if (this.socket?.connected) {
      this.debug('Already connected to APIX');
      return;
    }

    this.connectionStatus = 'connecting';
    this.debug('Connecting to APIX Real-Time Engine...');

    try {
      this.socket = io(this.config.websocketUrl, {
        auth: {
          organizationId,
          userId,
          sessionId
        },
        transports: ['websocket'],
        upgrade: false,
        rememberUpgrade: false
      });

      this.setupEventHandlers();
      this.startHeartbeat();

      return new Promise((resolve, reject) => {
        this.socket!.on('connect', () => {
          this.connectionStatus = 'connected';
          this.debug('Connected to APIX Real-Time Engine');
          this.processEventQueue();
          resolve();
        });

        this.socket!.on('connect_error', (error: any) => {
          this.connectionStatus = 'error';
          this.debug('APIX connection error:', error);
          reject(error);
        });
      });
    } catch (error) {
      this.connectionStatus = 'error';
      this.debug('Failed to connect to APIX:', error);
      throw error;
    }
  }

  // Disconnect from APIX
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.connectionStatus = 'disconnected';
    this.clearTimers();
    this.debug('Disconnected from APIX');
  }

  // Emit event to APIX gateway
  emit<T = any>(eventType: APXEventType, data: T, context?: APXCrossModuleContext): void {
    const event: APXEvent<T> = {
      id: this.generateEventId(),
      type: eventType,
      timestamp: Date.now(),
      organizationId: this.getOrganizationId(),
      userId: this.getUserId(),
      sessionId: this.getSessionId(),
      data,
      metadata: {
        source: 'apix-client',
        version: '1.0.0',
        correlationId: context?.sessionContext ? this.generateCorrelationId() : undefined
      }
    };

    if (this.socket?.connected) {
      this.socket.emit('apix:event', event, context);
      this.metrics.eventsProcessed++;
      this.debug('Emitted event:', event.type, event.id);
    } else {
      // Queue event for later transmission
      this.eventQueue.push(event);
      this.debug('Queued event (not connected):', event.type, event.id);
    }

    // Persist event if enabled
    if (this.persistenceEnabled) {
      this.persistEvent(event);
    }
  }

  // Subscribe to specific event types
  subscribe(subscription: Omit<APXSubscription, 'callback'> & { callback: (event: APXEvent) => void }): string {
    const subscriptionId = this.generateSubscriptionId();
    this.subscriptions.set(subscriptionId, subscription as APXSubscription);
    this.metrics.activeSubscriptions = this.subscriptions.size;

    // Register subscription with server
    if (this.socket?.connected) {
      this.socket.emit('apix:subscribe', {
        subscriptionId,
        eventTypes: subscription.eventTypes,
        organizationId: subscription.organizationId,
        userId: subscription.userId,
        sessionId: subscription.sessionId
      });
    }

    this.debug('Created subscription:', subscriptionId, subscription.eventTypes);
    return subscriptionId;
  }

  // Unsubscribe from events
  unsubscribe(subscriptionId: string): void {
    if (this.subscriptions.has(subscriptionId)) {
      this.subscriptions.delete(subscriptionId);
      this.metrics.activeSubscriptions = this.subscriptions.size;

      if (this.socket?.connected) {
        this.socket.emit('apix:unsubscribe', { subscriptionId });
      }

      this.debug('Removed subscription:', subscriptionId);
    }
  }

  // Request event replay for debugging/recovery
  requestReplay(config: APXReplayConfig): Promise<APXEvent[]> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error('Not connected to APIX'));
        return;
      }

      const requestId = this.generateEventId();
      
      this.socket.emit('apix:replay', { requestId, ...config });
      
      this.socket.once(`apix:replay:${requestId}`, (events: APXEvent[]) => {
        this.debug('Received replay events:', events.length);
        resolve(events);
      });

      // Timeout after 30 seconds
      setTimeout(() => {
        reject(new Error('Replay request timeout'));
      }, 30000);
    });
  }

  // Synchronize state across modules
  syncState(moduleId: string, state: Record<string, any>): void {
    const stateSync: APXStateSync = {
      moduleId,
      state,
      version: Date.now(),
      lastUpdated: Date.now()
    };

    this.stateCache.set(moduleId, stateSync);

    if (this.socket?.connected) {
      this.socket.emit('apix:state:sync', stateSync);
      this.debug('Synchronized state for module:', moduleId);
    }
  }

  // Get synchronized state for a module
  getState(moduleId: string): Record<string, any> | null {
    const stateSync = this.stateCache.get(moduleId);
    return stateSync ? stateSync.state : null;
  }

  // Get connection status
  getConnectionStatus(): APXConnectionStatus {
    return this.connectionStatus;
  }

  // Get real-time metrics
  getMetrics(): APXMetrics {
    return { ...this.metrics };
  }

  // Setup WebSocket event handlers
  private setupEventHandlers(): void {
    if (!this.socket) return;

    // Handle incoming events
    this.socket.on('apix:event', (event: APXEvent, context?: APXCrossModuleContext) => {
      this.handleIncomingEvent(event, context);
    });

    // Handle state synchronization
    this.socket.on('apix:state:update', (stateSync: APXStateSync) => {
      this.stateCache.set(stateSync.moduleId, stateSync);
      this.debug('Received state update for module:', stateSync.moduleId);
    });

    // Handle connection events
    this.socket.on('disconnect', (reason: any) => {
      this.connectionStatus = 'disconnected';
      this.debug('Disconnected from APIX:', reason);
      this.attemptReconnection();
    });

    this.socket.on('reconnect', () => {
      this.connectionStatus = 'connected';
      this.debug('Reconnected to APIX');
      this.reestablishSubscriptions();
      this.processEventQueue();
    });

    // Handle errors
    this.socket.on('apix:error', (error: APXError) => {
      this.debug('APIX error:', error);
      this.metrics.errorRate++;
    });
  }

  // Handle incoming events and route to subscribers
  private handleIncomingEvent(event: APXEvent, context?: APXCrossModuleContext): void {
    this.metrics.eventsProcessed++;
    this.debug('Received event:', event.type, event.id);

    // Route to matching subscriptions
    for (const [subscriptionId, subscription] of Array.from(this.subscriptions.entries())) {
      if (subscription.eventTypes.includes(event.type)) {
        // Apply filters if present
        if (subscription.filter && !subscription.filter(event)) {
          continue;
        }

        // Check organization/user/session filters
        if (subscription.organizationId && subscription.organizationId !== event.organizationId) {
          continue;
        }
        if (subscription.userId && subscription.userId !== event.userId) {
          continue;
        }
        if (subscription.sessionId && subscription.sessionId !== event.sessionId) {
          continue;
        }

        try {
          subscription.callback(event);
        } catch (error) {
          this.debug('Error in subscription callback:', error);
          this.metrics.errorRate++;
        }
      }
    }

    // Persist event if enabled
    if (this.persistenceEnabled) {
      this.persistEvent(event);
    }
  }

  // Process queued events when connection is restored
  private processEventQueue(): void {
    if (this.eventQueue.length === 0) return;

    this.debug('Processing queued events:', this.eventQueue.length);
    
    const events = [...this.eventQueue];
    this.eventQueue = [];

    for (const event of events) {
      if (this.socket?.connected) {
        this.socket.emit('apix:event', event);
      }
    }
  }

  // Attempt reconnection with exponential backoff
  private attemptReconnection(): void {
    if (this.connectionStatus === 'reconnecting') return;

    this.connectionStatus = 'reconnecting';
    let attempts = 0;

    const reconnect = () => {
      if (attempts >= this.config.reconnectAttempts) {
        this.connectionStatus = 'error';
        this.debug('Max reconnection attempts reached');
        return;
      }

      attempts++;
      const delay = this.config.reconnectDelay * Math.pow(2, attempts - 1);
      
      this.debug(`Reconnection attempt ${attempts} in ${delay}ms`);
      
      this.reconnectTimer = setTimeout(() => {
        if (this.socket) {
          this.socket.connect();
        }
      }, delay);
    };

    reconnect();
  }

  // Reestablish subscriptions after reconnection
  private reestablishSubscriptions(): void {
    for (const [subscriptionId, subscription] of Array.from(this.subscriptions.entries())) {
      if (this.socket?.connected) {
        this.socket.emit('apix:subscribe', {
          subscriptionId,
          eventTypes: subscription.eventTypes,
          organizationId: subscription.organizationId,
          userId: subscription.userId,
          sessionId: subscription.sessionId
        });
      }
    }
    this.debug('Reestablished subscriptions:', this.subscriptions.size);
  }

  // Start heartbeat to maintain connection
  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.socket?.connected) {
        this.socket.emit('apix:heartbeat', { timestamp: Date.now() });
      }
    }, this.config.heartbeatInterval);
  }

  // Initialize event persistence
  private initializePersistence(): void {
    if (!this.config.persistence.enabled) return;

    try {
      if (typeof window !== 'undefined' && this.config.persistence.storageType === 'localStorage') {
        this.persistenceEnabled = true;
        this.debug('Event persistence enabled (localStorage)');
      }
    } catch (error) {
      this.debug('Failed to initialize persistence:', error);
    }
  }

  // Persist event to storage
  private persistEvent(event: APXEvent): void {
    if (!this.persistenceEnabled || typeof window === 'undefined') return;

    try {
      const key = 'apix:events';
      const stored = localStorage.getItem(key);
      const events: APXEvent[] = stored ? JSON.parse(stored) : [];
      
      events.push(event);
      
      // Cleanup old events
      const maxAge = Date.now() - this.config.persistence.maxAge;
      const filteredEvents = events
        .filter(e => e.timestamp > maxAge)
        .slice(-this.config.persistence.maxEvents);
      
      localStorage.setItem(key, JSON.stringify(filteredEvents));
    } catch (error) {
      this.debug('Failed to persist event:', error);
    }
  }

  // Start metrics collection
  private startMetricsCollection(): void {
    this.metricsTimer = setInterval(() => {
      this.metrics.queueSize = this.eventQueue.length;
      this.metrics.connectionUptime = this.connectionStatus === 'connected' ? 
        this.metrics.connectionUptime + 1000 : 0;
    }, 1000);
  }

  // Clear all timers
  private clearTimers(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    if (this.metricsTimer) {
      clearInterval(this.metricsTimer);
      this.metricsTimer = null;
    }
  }

  // Utility methods
  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSubscriptionId(): string {
    return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateCorrelationId(): string {
    return `cor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getOrganizationId(): string {
    // In a real implementation, this would come from auth context
    return 'org_default';
  }

  private getUserId(): string {
    // In a real implementation, this would come from auth context
    return 'user_default';
  }

  private getSessionId(): string | undefined {
    // In a real implementation, this would come from session context
    return undefined;
  }

  private debug(...args: any[]): void {
    if (this.config.debug) {
      console.log('[APIX]', ...args);
    }
  }
}

// Singleton instance for global access
let apixInstance: APXClient | null = null;

export const getAPXClient = (config?: Partial<APXConfig>): APXClient => {
  if (!apixInstance) {
    apixInstance = new APXClient(config);
  }
  return apixInstance;
};

// React hook for using APIX in components
export const useAPX = () => {
  return getAPXClient();
};
