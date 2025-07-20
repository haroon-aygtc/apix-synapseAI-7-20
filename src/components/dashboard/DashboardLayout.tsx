"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";
import { Bell, ChevronDown, Home } from "lucide-react";
import { NavigationSidebar } from "../navigation/NavigationSidebar";
import { NavigationBreadcrumbs } from "../navigation/NavigationBreadcrumbs";
import ActivityFeed from "./ActivityFeed";
import QuickActions from "./QuickActions";
import ResourceMetrics from "./ResourceMetrics";
import { APXConnectionIndicator } from "../apix/APXConnectionIndicator";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps = {}) {
  return (
    <div className="flex h-screen bg-background">
      {/* Unified Navigation Sidebar */}
      <NavigationSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Home className="h-5 w-5 mr-2" />
              <h2 className="text-lg font-medium">Dashboard</h2>
            </div>
            <NavigationBreadcrumbs />
            <Separator orientation="vertical" className="h-6" />
            <APXConnectionIndicator />
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Separator orientation="vertical" className="h-8" />
            <div className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=user123"
                  alt="User"
                />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="ml-2 mr-1">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">Active Agents</p>
                  <h3 className="text-2xl font-bold">24</h3>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">Tools Created</p>
                  <h3 className="text-2xl font-bold">18</h3>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">
                    Workflows Running
                  </p>
                  <h3 className="text-2xl font-bold">7</h3>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">Monthly Usage</p>
                  <h3 className="text-2xl font-bold">68%</h3>
                </Card>
              </div>

              {/* Main Content Area */}
              <Card className="p-6">
                {children || (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold">
                      Welcome to SynapseAI Platform
                    </h2>
                    <p className="text-muted-foreground">
                      This is your central hub for creating AI agents, building
                      tools, managing workflows, and more. Get started by
                      exploring the quick actions or check your recent activity
                      in the feed.
                    </p>
                    <ResourceMetrics />
                  </div>
                )}
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <QuickActions />
              <ActivityFeed />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
