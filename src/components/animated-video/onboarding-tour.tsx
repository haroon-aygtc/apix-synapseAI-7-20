"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  X,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  Play,
  Type,
  Palette,
  Zap,
  Eye,
  MousePointer,
  Keyboard,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const TOUR_STEPS = [
  {
    id: "welcome",
    title: "Welcome to SynapseAI Studio! 🎬",
    description: "Let's take a quick tour to help you create amazing animated videos. This will only take 2 minutes!",
    icon: <Sparkles className="h-6 w-6" />,
    tips: [
      "Create professional animated videos without any technical skills",
      "Use pre-built templates or start from scratch",
      "Real-time preview of all your changes"
    ]
  },
  {
    id: "panels",
    title: "Editing Panels 📝",
    description: "The left panel contains all your editing tools. Switch between different panels to access various features.",
    icon: <Type className="h-6 w-6" />,
    tips: [
      "Text Panel: Edit text content, fonts, colors, and positioning",
      "Properties Panel: Adjust layer settings like opacity, blend modes",
      "Assets Panel: Access fonts, colors, shapes, and stock media",
      "Animations Panel: Apply pre-built animation effects"
    ],
    highlight: "left-panel"
  },
  {
    id: "video-player",
    title: "Video Preview 🎥",
    description: "The center area shows your video preview. Click on any element to select and edit it.",
    icon: <Play className="h-6 w-6" />,
    tips: [
      "Click on text or shapes to select them",
      "Use the play button to preview animations",
      "Toggle performance metrics to monitor rendering",
      "Real-time updates as you make changes"
    ],
    highlight: "video-player"
  },
  {
    id: "timeline",
    title: "Timeline Editor ⏱️",
    description: "The timeline shows all your layers and their timing. Drag to reposition or resize layer duration.",
    icon: <Eye className="h-6 w-6" />,
    tips: [
      "Each row represents a layer in your video",
      "Drag layer bars to change timing",
      "Click the eye icon to hide/show layers",
      "Use the lock icon to prevent accidental changes"
    ],
    highlight: "timeline"
  },
  {
    id: "quick-actions",
    title: "Quick Actions ⚡",
    description: "The right panel provides quick access to common actions and project information.",
    icon: <Zap className="h-6 w-6" />,
    tips: [
      "Quickly add text, shapes, or particle effects",
      "View project details and current selection",
      "Access export options (coming soon)",
      "Monitor project statistics"
    ],
    highlight: "right-panel"
  },
  {
    id: "getting-started",
    title: "Getting Started 🚀",
    description: "Here are some quick ways to start creating your first animated video:",
    icon: <MousePointer className="h-6 w-6" />,
    tips: [
      "1. Click 'Add Text' to create your first text element",
      "2. Select the text and use the Text Panel to customize it",
      "3. Go to Animations Panel and apply an entrance effect",
      "4. Press play to see your animation in action!"
    ]
  },
  {
    id: "keyboard-shortcuts",
    title: "Pro Tips ⌨️",
    description: "Some helpful shortcuts and tips to speed up your workflow:",
    icon: <Keyboard className="h-6 w-6" />,
    tips: [
      "Spacebar: Play/pause video preview",
      "Delete: Remove selected layer",
      "Ctrl+D: Duplicate selected layer",
      "Use templates for quick starts",
      "Experiment with different animation combinations!"
    ]
  }
];

export function OnboardingTour({ isOpen, onClose, onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setCurrentStep(0);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
      onClose();
    }, 300);
  };

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const currentStepData = TOUR_STEPS[currentStep];
  const progress = ((currentStep + 1) / TOUR_STEPS.length) * 100;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <Card className="relative overflow-hidden">
                {/* Progress bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {currentStepData.icon}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Step {currentStep + 1} of {TOUR_STEPS.length}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSkip}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div>
                    <p className="text-base leading-relaxed mb-4">
                      {currentStepData.description}
                    </p>

                    <div className="space-y-2">
                      {currentStepData.tips.map((tip, index) => (
                        <motion.div
                          key={index}
                          className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <p className="text-sm">{tip}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Special highlight for certain steps */}
                  {currentStepData.highlight && (
                    <div className="p-4 border-2 border-dashed border-primary/30 rounded-lg bg-primary/5">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary">Look for this area</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {currentStepData.highlight === 'left-panel' && "Check the left side of your screen for the editing panels"}
                        {currentStepData.highlight === 'video-player' && "The video preview is in the center of your screen"}
                        {currentStepData.highlight === 'timeline' && "The timeline appears below the video player"}
                        {currentStepData.highlight === 'right-panel' && "Look at the right side for quick actions and project info"}
                      </p>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2">
                      {TOUR_STEPS.map((_, index) => (
                        <div
                          key={index}
                          className={cn(
                            "w-2 h-2 rounded-full transition-colors",
                            index === currentStep ? "bg-primary" : "bg-muted"
                          )}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentStep === 0}
                        className="gap-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Previous
                      </Button>

                      {currentStep === TOUR_STEPS.length - 1 ? (
                        <Button onClick={handleComplete} className="gap-2">
                          Get Started
                          <Sparkles className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button onClick={handleNext} className="gap-2">
                          Next
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
