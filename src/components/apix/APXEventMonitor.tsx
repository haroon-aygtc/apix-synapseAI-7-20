"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAPXSubscription, useAPXReplay } from '@/lib/apix/hooks';
import { APXEvent, APXEventType } from '@/lib/apix/types';
import { Activity, Clock, Filter, Play, Trash2, AlertCircle } from 'lucide-react';

// Real-time event monitor for debugging and observability
export function APXEventMonitor() {
  const [events, setEvents] = useState<APXEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<APXEvent[]>([]);
  const [selectedEventTypes, setSelectedEventTypes] = useState<APXEventType[]>([]);
  const [maxEvents, setMaxEvents] = useState(100);
  const [isPaused, setIsPaused] = useState(false);

  const { requestReplay, isReplaying, replayEvents, error } = useAPXReplay();

  // Subscribe to all event types for monitoring
  const allEventTypes: APXEventType[] = [
    'AGENT_EXECUTION_STARTED', 'AGENT_EXECUTION_COMPLETED', 'AGENT_EXECUTION_FAILED',
    'TOOL_EXECUTION_STARTED', 'TOOL_EXECUTION_COMPLETED', 'TOOL_EXECUTION_FAILED',
    'WORKFLOW_STARTED', 'WORKFLOW_COMPLETED', 'WORKFLOW_FAILED',
    'KNOWLEDGE_SEARCH_STARTED', 'KNOWLEDGE_SEARCH_COMPLETED',
    'HITL_APPROVAL_REQUESTED', 'HITL_APPROVAL_COMPLETED',
    'WIDGET_EXECUTION_STARTED', 'WIDGET_EXECUTION_COMPLETED',
    'SESSION_CREATED', 'SESSION_UPDATED',
    'USAGE_METERED', 'QUOTA_EXCEEDED',
    'NOTIFICATION_CREATED', 'SYSTEM_ALERT'
  ];

  useAPXSubscription(
    allEventTypes,
    (event: APXEvent) => {
      if (!isPaused) {
        setEvents(prev => {
          const updated = [event, ...prev].slice(0, maxEvents);
          return updated;
        });
      }
    },
    { enabled: true }
  );

  // Filter events based on selected types
  useEffect(() => {
    if (selectedEventTypes.length === 0) {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter(event => selectedEventTypes.includes(event.type)));
    }
  }, [events, selectedEventTypes]);

  // Handle replay events
  useEffect(() => {
    if (replayEvents.length > 0) {
      setEvents(prev => [...replayEvents, ...prev].slice(0, maxEvents));
    }
  }, [replayEvents, maxEvents]);

  const clearEvents = () => {
    setEvents([]);
  };

  const toggleEventType = (eventType: APXEventType) => {
    setSelectedEventTypes(prev => {
      if (prev.includes(eventType)) {
        return prev.filter(type => type !== eventType);
      } else {
        return [...prev, eventType];
      }
    });
  };

  const getEventTypeColor = (eventType: APXEventType): string => {
    if (eventType.includes('FAILED') || eventType.includes('ERROR')) return 'destructive';
    if (eventType.includes('COMPLETED') || eventType.includes('SUCCESS')) return 'default';
    if (eventType.includes('STARTED') || eventType.includes('CREATED')) return 'secondary';
    if (eventType.includes('APPROVAL')) return 'outline';
    return 'secondary';
  };

  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const handleReplay = async () => {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    await requestReplay({
      fromTimestamp: oneHourAgo,
      maxEvents: 50
    });
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>APIX Event Monitor</span>
            <Badge variant="outline">{filteredEvents.length} events</Badge>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPaused(!isPaused)}
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReplay}
              disabled={isReplaying}
            >
              <Clock className="h-4 w-4 mr-1" />
              {isReplaying ? 'Replaying...' : 'Replay'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearEvents}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>
        </div>
        
        {/* Event Type Filters */}
        <div className="flex flex-wrap gap-2 mt-3">
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>Filter:</span>
          </div>
          {['AGENT', 'TOOL', 'WORKFLOW', 'KNOWLEDGE', 'HITL', 'WIDGET', 'SESSION', 'BILLING'].map(category => {
            const categoryEvents = allEventTypes.filter(type => type.includes(category));
            const isSelected = categoryEvents.some(type => selectedEventTypes.includes(type));
            
            return (
              <Badge
                key={category}
                variant={isSelected ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => {
                  if (isSelected) {
                    setSelectedEventTypes(prev => prev.filter(type => !categoryEvents.includes(type)));
                  } else {
                    setSelectedEventTypes(prev => [...prev, ...categoryEvents]);
                  }
                }}
              >
                {category}
              </Badge>
            );
          })}
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {error && (
          <div className="p-4 bg-destructive/10 border-b">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}
        
        <ScrollArea className="h-96">
          <div className="space-y-1">
            {filteredEvents.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No events to display</p>
                <p className="text-xs mt-1">
                  {isPaused ? 'Monitoring is paused' : 'Waiting for real-time events...'}
                </p>
              </div>
            ) : (
              filteredEvents.map((event, index) => (
                <div key={`${event.id}-${index}`}>
                  <div className="p-3 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge variant={getEventTypeColor(event.type) as any} className="text-xs">
                            {event.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(event.timestamp)}
                          </span>
                          {event.sessionId && (
                            <span className="text-xs text-muted-foreground">
                              Session: {event.sessionId.slice(-8)}
                            </span>
                          )}
                        </div>
                        
                        <div className="text-sm font-medium mb-1">
                          Event ID: {event.id}
                        </div>
                        
                        {event.data && (
                          <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded mt-2">
                            <pre className="whitespace-pre-wrap break-all">
                              {JSON.stringify(event.data, null, 2)}
                            </pre>
                          </div>
                        )}
                        
                        {event.metadata && (
                          <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                            <span>Source: {event.metadata.source}</span>
                            {event.metadata.correlationId && (
                              <span>Correlation: {event.metadata.correlationId.slice(-8)}</span>
                            )}
                            {event.metadata.retryCount && (
                              <span>Retries: {event.metadata.retryCount}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {index < filteredEvents.length - 1 && <Separator />}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
