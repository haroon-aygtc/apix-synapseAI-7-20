"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart, Activity } from "lucide-react";

interface UsageMeterProps {
  title: string;
  current: number;
  max: number;
  unit?: string;
}

const UsageMeter = ({ title, current, max, unit = "" }: UsageMeterProps) => {
  const percentage = Math.min(Math.round((current / max) * 100), 100);

  return (
    <div className="mb-4 bg-card">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">{title}</span>
        <span className="text-sm text-muted-foreground">
          {current.toLocaleString()}/{max.toLocaleString()} {unit}
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
};

interface ResourceMetricsProps {
  usageData?: {
    agentExecutions: { current: number; max: number };
    storageUsed: { current: number; max: number };
    apiCalls: { current: number; max: number };
  };
  billingInfo?: {
    currentPlan: string;
    nextBillingDate: string;
    currentCharges: number;
  };
  performanceData?: {
    responseTime: number[];
    successRate: number;
    errorRate: number;
  };
}

const ResourceMetrics = ({
  usageData = {
    agentExecutions: { current: 1250, max: 5000 },
    storageUsed: { current: 2.3, max: 10 },
    apiCalls: { current: 15000, max: 25000 },
  },
  billingInfo = {
    currentPlan: "Pro",
    nextBillingDate: "2023-06-15",
    currentCharges: 149.99,
  },
  performanceData = {
    responseTime: [120, 135, 110, 125, 115, 130, 125],
    successRate: 98.5,
    errorRate: 1.5,
  },
}: ResourceMetricsProps) => {
  return (
    <Card className="w-full bg-background">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">
          Resource Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="usage">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="usage" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span className="hidden sm:inline">Usage</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              <span className="hidden sm:inline">Billing</span>
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="flex items-center gap-2"
            >
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Performance</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="usage" className="space-y-4">
            <UsageMeter
              title="Agent Executions"
              current={usageData.agentExecutions.current}
              max={usageData.agentExecutions.max}
            />
            <UsageMeter
              title="Storage Used"
              current={usageData.storageUsed.current}
              max={usageData.storageUsed.max}
              unit="GB"
            />
            <UsageMeter
              title="API Calls"
              current={usageData.apiCalls.current}
              max={usageData.apiCalls.max}
            />
          </TabsContent>

          <TabsContent value="billing" className="space-y-4">
            <div className="grid gap-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Current Plan</span>
                <span className="text-sm font-bold">
                  {billingInfo.currentPlan}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Next Billing Date</span>
                <span className="text-sm">{billingInfo.nextBillingDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Current Charges</span>
                <span className="text-sm font-bold">
                  ${billingInfo.currentCharges.toFixed(2)}
                </span>
              </div>
              <div className="mt-2">
                <button className="text-sm text-primary hover:underline">
                  View Billing Details
                </button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid gap-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium">
                  Average Response Time
                </span>
                <span className="text-sm">
                  {Math.round(
                    performanceData.responseTime.reduce((a, b) => a + b, 0) /
                      performanceData.responseTime.length,
                  )}{" "}
                  ms
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Success Rate</span>
                <span className="text-sm text-green-500">
                  {performanceData.successRate}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Error Rate</span>
                <span className="text-sm text-red-500">
                  {performanceData.errorRate}%
                </span>
              </div>
              <div className="h-24 mt-2 flex items-end justify-between">
                {performanceData.responseTime.map((time, index) => (
                  <div
                    key={index}
                    className="bg-primary w-6 rounded-t"
                    style={{ height: `${(time / 150) * 100}%` }}
                    title={`${time} ms`}
                  />
                ))}
              </div>
              <div className="text-xs text-center text-muted-foreground mt-1">
                Response Time (Last 7 Days)
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ResourceMetrics;
