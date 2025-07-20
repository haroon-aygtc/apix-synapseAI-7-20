"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Bot, Wrench, Zap, Upload, Palette } from "lucide-react";

interface QuickActionsProps {
  onCreateAgent?: () => void;
  onCreateTool?: () => void;
  onCreateWorkflow?: () => void;
  onUploadDocuments?: () => void;
  onGenerateWidget?: () => void;
}

const QuickActions = ({
  onCreateAgent = () => {},
  onCreateTool = () => {},
  onCreateWorkflow = () => {},
  onUploadDocuments = () => {},
  onGenerateWidget = () => {},
}: QuickActionsProps) => {
  return (
    <Card className="w-full bg-background">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Button
          variant="outline"
          className="flex items-center justify-start gap-2 h-auto py-3"
          onClick={onCreateAgent}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <div className="text-left">
            <p className="font-medium">Create Agent</p>
            <p className="text-xs text-muted-foreground">
              Build a new AI agent
            </p>
          </div>
        </Button>

        <Button
          variant="outline"
          className="flex items-center justify-start gap-2 h-auto py-3"
          onClick={onCreateTool}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <Wrench className="h-4 w-4 text-primary" />
          </div>
          <div className="text-left">
            <p className="font-medium">Create Tool</p>
            <p className="text-xs text-muted-foreground">Build a new tool</p>
          </div>
        </Button>

        <Button
          variant="outline"
          className="flex items-center justify-start gap-2 h-auto py-3"
          onClick={onCreateWorkflow}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <Zap className="h-4 w-4 text-primary" />
          </div>
          <div className="text-left">
            <p className="font-medium">Create Workflow</p>
            <p className="text-xs text-muted-foreground">
              Build a new workflow
            </p>
          </div>
        </Button>

        <Button
          variant="outline"
          className="flex items-center justify-start gap-2 h-auto py-3"
          onClick={onUploadDocuments}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <Upload className="h-4 w-4 text-primary" />
          </div>
          <div className="text-left">
            <p className="font-medium">Upload Documents</p>
            <p className="text-xs text-muted-foreground">
              Add to knowledge base
            </p>
          </div>
        </Button>

        <Button
          variant="outline"
          className="flex items-center justify-start gap-2 h-auto py-3"
          onClick={onGenerateWidget}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <Palette className="h-4 w-4 text-primary" />
          </div>
          <div className="text-left">
            <p className="font-medium">Generate Widget</p>
            <p className="text-xs text-muted-foreground">
              Create embeddable widget
            </p>
          </div>
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
