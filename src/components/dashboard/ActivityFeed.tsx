"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  AlertCircle,
  Clock,
  Filter,
  RefreshCw,
} from "lucide-react";

interface FeedItem {
  id: string;
  type: "agent" | "tool" | "workflow" | "hitl" | "error";
  title: string;
  description: string;
  timestamp: string;
  status: "success" | "pending" | "error";
}

interface ActivityFeedProps {
  items?: FeedItem[];
}

export default function ActivityFeed({ items = [] }: ActivityFeedProps) {
  const [timeRange, setTimeRange] = useState<string>("today");
  const [eventType, setEventType] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");

  // Default feed items if none are provided
  const defaultItems: FeedItem[] = [
    {
      id: "1",
      type: "agent",
      title: "Customer Support Agent",
      description: "Successfully answered 5 customer queries",
      timestamp: "10 minutes ago",
      status: "success",
    },
    {
      id: "2",
      type: "tool",
      title: "Email Integration",
      description: "Successfully sent 3 notification emails",
      timestamp: "25 minutes ago",
      status: "success",
    },
    {
      id: "3",
      type: "workflow",
      title: "Lead Qualification Flow",
      description: "Processed 12 new leads from website",
      timestamp: "1 hour ago",
      status: "success",
    },
    {
      id: "4",
      type: "hitl",
      title: "Approval Request",
      description: "Waiting for approval on high-value transaction",
      timestamp: "2 hours ago",
      status: "pending",
    },
    {
      id: "5",
      type: "error",
      title: "Database Connection Error",
      description: "Failed to connect to external CRM database",
      timestamp: "3 hours ago",
      status: "error",
    },
  ];

  const feedItems = items.length > 0 ? items : defaultItems;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "agent":
        return "bg-blue-100 text-blue-800";
      case "tool":
        return "bg-purple-100 text-purple-800";
      case "workflow":
        return "bg-green-100 text-green-800";
      case "hitl":
        return "bg-yellow-100 text-yellow-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="w-full h-full bg-white">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Activity Feed</CardTitle>
          <Button variant="ghost" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <div className="px-6 pb-2">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
          </TabsList>

          <div className="flex flex-wrap gap-2 mb-4">
            <div className="flex items-center">
              <Filter className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-sm text-gray-500 mr-2">Filters:</span>
            </div>

            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="h-8 w-[120px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>

            <Select value={eventType} onValueChange={setEventType}>
              <SelectTrigger className="h-8 w-[120px]">
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="agent">Agent</SelectItem>
                <SelectItem value="tool">Tool</SelectItem>
                <SelectItem value="workflow">Workflow</SelectItem>
                <SelectItem value="hitl">Approval</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-8 w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="all" className="m-0">
            <CardContent className="p-0 max-h-[400px] overflow-y-auto">
              <div className="space-y-4">
                {feedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start p-3 border rounded-md hover:bg-gray-50"
                  >
                    <div className="mr-3 mt-1">
                      {getStatusIcon(item.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{item.title}</h4>
                          <Badge
                            className={getTypeColor(item.type)}
                            variant="outline"
                          >
                            {item.type.charAt(0).toUpperCase() +
                              item.type.slice(1)}
                          </Badge>
                        </div>
                        <span className="text-xs text-gray-500">
                          {item.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="agents" className="m-0">
            <CardContent className="p-0 max-h-[400px] overflow-y-auto">
              <div className="space-y-4">
                {feedItems
                  .filter((item) => item.type === "agent")
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start p-3 border rounded-md hover:bg-gray-50"
                    >
                      <div className="mr-3 mt-1">
                        {getStatusIcon(item.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{item.title}</h4>
                            <Badge
                              className={getTypeColor(item.type)}
                              variant="outline"
                            >
                              Agent
                            </Badge>
                          </div>
                          <span className="text-xs text-gray-500">
                            {item.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="tools" className="m-0">
            <CardContent className="p-0 max-h-[400px] overflow-y-auto">
              <div className="space-y-4">
                {feedItems
                  .filter((item) => item.type === "tool")
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start p-3 border rounded-md hover:bg-gray-50"
                    >
                      <div className="mr-3 mt-1">
                        {getStatusIcon(item.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{item.title}</h4>
                            <Badge
                              className={getTypeColor(item.type)}
                              variant="outline"
                            >
                              Tool
                            </Badge>
                          </div>
                          <span className="text-xs text-gray-500">
                            {item.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="workflows" className="m-0">
            <CardContent className="p-0 max-h-[400px] overflow-y-auto">
              <div className="space-y-4">
                {feedItems
                  .filter((item) => item.type === "workflow")
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start p-3 border rounded-md hover:bg-gray-50"
                    >
                      <div className="mr-3 mt-1">
                        {getStatusIcon(item.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{item.title}</h4>
                            <Badge
                              className={getTypeColor(item.type)}
                              variant="outline"
                            >
                              Workflow
                            </Badge>
                          </div>
                          <span className="text-xs text-gray-500">
                            {item.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}
