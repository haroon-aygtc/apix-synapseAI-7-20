"use client";

import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import QuickActions from "@/components/dashboard/QuickActions";
import ResourceMetrics from "@/components/dashboard/ResourceMetrics";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "../../lib/motion";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Zap } from "lucide-react";

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

         {/* Dashboard Preview Section */}
        <section className="py-20 md:py-32 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Powerful Dashboard</h2>
              <p className="mt-4 text-muted-foreground md:text-xl max-w-[700px] mx-auto">
                Monitor and manage your AI agents with our intuitive dashboard
              </p>
            </div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer()}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-card rounded-lg shadow">
                    <div className="p-6">
                      <h2 className="text-xl font-semibold mb-4">Activity Feed</h2>
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Zap className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">Agent {i} completed task successfully</p>
                              <p className="text-sm text-muted-foreground">2 minutes ago</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-card rounded-lg shadow">
                    <div className="p-6">
                      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                      <div className="space-y-2">
                        {["Create Agent", "Run Workflow", "View Reports"].map((action) => (
                          <Button key={action} variant="outline" className="w-full justify-start">
                            <ChevronRight className="mr-2 h-4 w-4" />
                            {action}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-card rounded-lg shadow">
                    <div className="p-6">
                      <h2 className="text-xl font-semibold mb-4">Resource Management</h2>
                      <div className="space-y-3">
                        {[
                          { name: "CPU Usage", value: 42 },
                          { name: "Memory", value: 68 },
                          { name: "Storage", value: 27 }
                        ].map((resource) => (
                          <div key={resource.name} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{resource.name}</span>
                              <span className="font-medium">{resource.value}%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary" 
                                style={{ width: `${resource.value}%` }} 
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        </div>
      </DashboardLayout>
    </div>
  );
}
