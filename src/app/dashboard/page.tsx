import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import QuickActions from "@/components/dashboard/QuickActions";
import ResourceMetrics from "@/components/dashboard/ResourceMetrics";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardLayout>
        <div className="p-6 space-y-6">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome to SynapseAI Platform. Here's an overview of your
              activity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card rounded-lg shadow p-4 flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">
                Active Agents
              </span>
              <span className="text-2xl font-bold">12</span>
              <div className="mt-2 text-xs text-green-500">
                +2 from last week
              </div>
            </div>
            <div className="bg-card rounded-lg shadow p-4 flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">
                Tools Created
              </span>
              <span className="text-2xl font-bold">24</span>
              <div className="mt-2 text-xs text-green-500">
                +5 from last week
              </div>
            </div>
            <div className="bg-card rounded-lg shadow p-4 flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">
                Workflows Running
              </span>
              <span className="text-2xl font-bold">8</span>
              <div className="mt-2 text-xs text-amber-500">
                -1 from last week
              </div>
            </div>
            <div className="bg-card rounded-lg shadow p-4 flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">
                Monthly Usage
              </span>
              <span className="text-2xl font-bold">68%</span>
              <div className="mt-2 text-xs text-muted-foreground">
                2,450/5,000 credits
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg shadow">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Activity Feed</h2>
                  <ActivityFeed />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-card rounded-lg shadow">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                  <QuickActions />
                </div>
              </div>

              <div className="bg-card rounded-lg shadow">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Resource Management
                  </h2>
                  <ResourceMetrics />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
}
