"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { APXMetricsDisplay } from '@/components/apix/APXProvider';
import { APXConnectionIndicator } from '@/components/apix/APXConnectionIndicator';
import { APXEventMonitor } from '@/components/apix/APXEventMonitor';
import { Activity, BarChart3, Settings, Zap } from 'lucide-react';

// APIX Real-Time Engine Dashboard for monitoring and debugging
export function APXDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">APIX Real-Time Engine</h1>
          <p className="text-muted-foreground mt-1">
            Monitor cross-module events, state synchronization, and system performance
          </p>
        </div>
        <APXConnectionIndicator />
      </div>

      {/* Main Dashboard */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Event Monitor</span>
          </TabsTrigger>
          <TabsTrigger value="modules" className="flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span>Module Status</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Real-time Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Real-time Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <APXMetricsDisplay />
              </CardContent>
            </Card>

            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">WebSocket Gateway</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm text-muted-foreground">Healthy</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Event Processing</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm text-muted-foreground">Active</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">State Synchronization</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm text-muted-foreground">Synced</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cross-Module Routing</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm text-muted-foreground">Operational</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Module Integration Status */}
          <Card>
            <CardHeader>
              <CardTitle>Module Integration Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {[
                  { name: 'Agents', status: 'connected', events: 1250 },
                  { name: 'Tools', status: 'connected', events: 890 },
                  { name: 'Workflows', status: 'connected', events: 456 },
                  { name: 'Knowledge', status: 'connected', events: 234 },
                  { name: 'Widgets', status: 'connected', events: 123 },
                  { name: 'HITL', status: 'connected', events: 67 },
                  { name: 'Analytics', status: 'connected', events: 345 },
                  { name: 'Billing', status: 'connected', events: 89 }
                ].map((module) => (
                  <div key={module.name} className="text-center space-y-2">
                    <div className="w-12 h-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
                      <div className={`w-3 h-3 rounded-full ${
                        module.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{module.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {module.events.toLocaleString()} events
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Event Monitor Tab */}
        <TabsContent value="events">
          <APXEventMonitor />
        </TabsContent>

        {/* Module Status Tab */}
        <TabsContent value="modules" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Agent Builder',
                description: 'AI agent creation and management',
                status: 'active',
                connections: ['Tools', 'Knowledge', 'HITL'],
                lastEvent: '2 minutes ago'
              },
              {
                name: 'Tool Manager',
                description: 'External tool integrations',
                status: 'active',
                connections: ['Agents', 'Workflows'],
                lastEvent: '1 minute ago'
              },
              {
                name: 'Workflow Engine',
                description: 'Automated process orchestration',
                status: 'active',
                connections: ['Agents', 'Tools', 'HITL'],
                lastEvent: '30 seconds ago'
              },
              {
                name: 'Knowledge Base',
                description: 'Document storage and retrieval',
                status: 'active',
                connections: ['Agents', 'Workflows'],
                lastEvent: '5 minutes ago'
              },
              {
                name: 'Widget Generator',
                description: 'Embeddable UI components',
                status: 'active',
                connections: ['Agents', 'Tools', 'Workflows'],
                lastEvent: '3 minutes ago'
              },
              {
                name: 'HITL System',
                description: 'Human-in-the-loop approvals',
                status: 'active',
                connections: ['Agents', 'Workflows'],
                lastEvent: '8 minutes ago'
              }
            ].map((module) => (
              <Card key={module.name}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{module.name}</CardTitle>
                    <div className={`w-3 h-3 rounded-full ${
                      module.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                  </div>
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium mb-1">Connected Modules</div>
                      <div className="flex flex-wrap gap-1">
                        {module.connections.map((connection) => (
                          <span
                            key={connection}
                            className="text-xs bg-secondary px-2 py-1 rounded"
                          >
                            {connection}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Last event: {module.lastEvent}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>APIX Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">WebSocket URL</label>
                    <div className="text-sm text-muted-foreground mt-1">
                      {process.env.NEXT_PUBLIC_APIX_URL || 'ws://localhost:3001'}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Environment</label>
                    <div className="text-sm text-muted-foreground mt-1">
                      {process.env.NODE_ENV || 'development'}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Reconnect Attempts</label>
                    <div className="text-sm text-muted-foreground mt-1">5</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Heartbeat Interval</label>
                    <div className="text-sm text-muted-foreground mt-1">30 seconds</div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Event Persistence</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Storage Type:</span>
                      <span className="ml-2">localStorage</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Max Events:</span>
                      <span className="ml-2">10,000</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Max Age:</span>
                      <span className="ml-2">24 hours</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Compression:</span>
                      <span className="ml-2">Disabled</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
