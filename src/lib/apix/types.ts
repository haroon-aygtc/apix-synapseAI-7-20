// APIX Real-Time Engine Types

// Core event types for cross-module communication
export type APXEventType =
  // Agent Events
  | 'AGENT_EXECUTION_STARTED'
  | 'AGENT_EXECUTION_COMPLETED'
  | 'AGENT_EXECUTION_FAILED'
  | 'AGENT_CALLS_TOOL'
  | 'AGENT_REQUESTS_KNOWLEDGE'
  | 'AGENT_STATE_UPDATED'
  
  // Tool Events
  | 'TOOL_EXECUTION_STARTED'
  | 'TOOL_EXECUTION_COMPLETED'
  | 'TOOL_EXECUTION_FAILED'
  | 'TOOL_RETURNS_RESULT'
  | 'TOOL_INTEGRATION_UPDATED'
  
  // Workflow Events
  | 'WORKFLOW_STARTED'
  | 'WORKFLOW_STEP_COMPLETED'
  | 'WORKFLOW_COMPLETED'
  | 'WORKFLOW_FAILED'
  | 'WORKFLOW_STARTS_AGENT'
  | 'WORKFLOW_PAUSED_FOR_APPROVAL'
  
  // Knowledge Events
  | 'KNOWLEDGE_SEARCH_STARTED'
  | 'KNOWLEDGE_SEARCH_COMPLETED'
  | 'KNOWLEDGE_PROVIDES_CONTEXT'
  | 'KNOWLEDGE_DOCUMENT_UPDATED'
  
  // HITL Events
  | 'HITL_APPROVAL_REQUESTED'
  | 'HITL_APPROVAL_COMPLETED'
  | 'HITL_APPROVAL_REJECTED'
  | 'EXECUTION_NEEDS_APPROVAL'
  | 'APPROVAL_COMPLETED'
  
  // Widget Events
  | 'WIDGET_EXECUTION_STARTED'
  | 'WIDGET_EXECUTION_COMPLETED'
  | 'WIDGET_DEPLOYED'
  | 'WIDGET_ANALYTICS_UPDATED'
  
  // Session Events
  | 'SESSION_CREATED'
  | 'SESSION_UPDATED'
  | 'SESSION_CONTEXT_CHANGED'
  | 'SESSION_EXPIRED'
  
  // Billing Events
  | 'USAGE_METERED'
  | 'QUOTA_EXCEEDED'
  | 'BILLING_UPDATED'
  | 'COST_THRESHOLD_REACHED'
  
  // Analytics Events
  | 'ANALYTICS_DATA_UPDATED'
  | 'PERFORMANCE_METRICS_UPDATED'
  | 'SYSTEM_HEALTH_CHANGED'
  
  // Notification Events
  | 'NOTIFICATION_CREATED'
  | 'NOTIFICATION_READ'
  | 'SYSTEM_ALERT'
  | 'SECURITY_EVENT'
  
  // System Events
  | 'CONNECTION_ESTABLISHED'
  | 'CONNECTION_LOST'
  | 'RECONNECTION_ATTEMPT'
  | 'SYSTEM_STATUS_CHANGED';

// Base event structure
export interface APXEvent<T = any> {
  id: string;
  type: APXEventType;
  timestamp: number;
  organizationId: string;
  userId: string;
  sessionId?: string;
  data: T;
  metadata?: {
    source: string;
    version: string;
    correlationId?: string;
    parentEventId?: string;
    retryCount?: number;
  };
}

// Event subscription configuration
export interface APXSubscription {
  eventTypes: APXEventType[];
  organizationId?: string;
  userId?: string;
  sessionId?: string;
  callback: (event: APXEvent) => void;
  filter?: (event: APXEvent) => boolean;
}

// Connection status
export type APXConnectionStatus = 
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'reconnecting'
  | 'error';

// Real-time state synchronization
export interface APXStateSync {
  moduleId: string;
  state: Record<string, any>;
  version: number;
  lastUpdated: number;
}

// Event replay configuration
export interface APXReplayConfig {
  fromTimestamp?: number;
  toTimestamp?: number;
  eventTypes?: APXEventType[];
  sessionId?: string;
  maxEvents?: number;
}

// Cross-module context for event routing
export interface APXCrossModuleContext {
  sourceModule: string;
  targetModule?: string;
  executionPath: string[];
  sessionContext: {
    agentMemory?: any[];
    toolResults?: any[];
    workflowState?: any[];
    knowledgeContext?: any[];
    approvalRequests?: any[];
  };
  userJourney: {
    path: string[];
    timestamp: number;
    context: Record<string, any>;
  };
}

// Pub/Sub topic configuration
export interface APXTopic {
  name: string;
  eventTypes: APXEventType[];
  subscribers: string[];
  retentionPolicy: {
    maxAge: number; // milliseconds
    maxEvents: number;
  };
}

// Event persistence configuration
export interface APXPersistenceConfig {
  enabled: boolean;
  storageType: 'memory' | 'localStorage' | 'indexedDB';
  maxEvents: number;
  maxAge: number; // milliseconds
  compression: boolean;
}

// Analytics and monitoring
export interface APXMetrics {
  eventsProcessed: number;
  eventsPerSecond: number;
  averageLatency: number;
  errorRate: number;
  connectionUptime: number;
  activeSubscriptions: number;
  queueSize: number;
}

// Error types
export interface APXError {
  code: string;
  message: string;
  timestamp: number;
  eventId?: string;
  context?: Record<string, any>;
}

// Configuration for the APIX engine
export interface APXConfig {
  websocketUrl: string;
  reconnectAttempts: number;
  reconnectDelay: number;
  heartbeatInterval: number;
  eventQueueSize: number;
  persistence: APXPersistenceConfig;
  debug: boolean;
}
