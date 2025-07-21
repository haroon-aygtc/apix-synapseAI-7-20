"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Play,
  ArrowRight,
  RotateCw,
  ZoomIn,
  Zap,
  Heart,
  Star,
  TrendingUp,
  Waves,
  Target,
  Eye,
  Settings
} from "lucide-react";
import { VideoLayer, Animation } from "@/lib/animated-video/types";

export interface AnimationPresetsPanelProps {
  selectedLayer: VideoLayer | null;
  onApplyAnimation: (layer: VideoLayer, animation: Animation) => void;
  onPreviewAnimation: (animation: Animation) => void;
  className?: string;
}

const ENTRANCE_ANIMATIONS = [
  {
    id: "fade-in",
    name: "Fade In",
    description: "Smooth opacity transition",
    icon: "✨",
    duration: 1.5,
    preview: "opacity: 0 → 1",
    category: "entrance",
    difficulty: "easy",
    keyframes: [
      { time: 0, value: 0 },
      { time: 1, value: 1 }
    ],
    property: "opacity" as const,
    easing: "ease-out" as const
  },
  {
    id: "slide-in-left",
    name: "Slide In Left",
    description: "Slides from left side",
    icon: "➡️",
    duration: 1.2,
    preview: "x: -100 → 0",
    category: "entrance",
    difficulty: "easy",
    keyframes: [
      { time: 0, value: -100 },
      { time: 1, value: 0 }
    ],
    property: "x" as const,
    easing: "ease-out" as const
  },
  {
    id: "slide-in-right",
    name: "Slide In Right",
    description: "Slides from right side",
    icon: "⬅️",
    duration: 1.2,
    preview: "x: 100 → 0",
    category: "entrance",
    difficulty: "easy",
    keyframes: [
      { time: 0, value: 100 },
      { time: 1, value: 0 }
    ],
    property: "x" as const,
    easing: "ease-out" as const
  },
  {
    id: "slide-in-up",
    name: "Slide In Up",
    description: "Slides from bottom",
    icon: "⬆️",
    duration: 1.2,
    preview: "y: 100 → 0",
    category: "entrance",
    difficulty: "easy",
    keyframes: [
      { time: 0, value: 100 },
      { time: 1, value: 0 }
    ],
    property: "y" as const,
    easing: "ease-out" as const
  },
  {
    id: "scale-in",
    name: "Scale In",
    description: "Grows from small to normal",
    icon: "🔍",
    duration: 1.0,
    preview: "scale: 0 → 1",
    category: "entrance",
    difficulty: "easy",
    keyframes: [
      { time: 0, value: 0 },
      { time: 1, value: 1 }
    ],
    property: "scaleX" as const,
    easing: "spring" as const
  },
  {
    id: "bounce-in",
    name: "Bounce In",
    description: "Bouncy entrance effect",
    icon: "🏀",
    duration: 1.5,
    preview: "scale: 0 → 1.2 → 1",
    category: "entrance",
    difficulty: "medium",
    keyframes: [
      { time: 0, value: 0 },
      { time: 0.6, value: 1.2 },
      { time: 1, value: 1 }
    ],
    property: "scaleX" as const,
    easing: "bounce" as const
  }
];

const EMPHASIS_ANIMATIONS = [
  {
    id: "pulse",
    name: "Pulse",
    description: "Rhythmic scaling effect",
    icon: "💓",
    duration: 1.0,
    preview: "scale: 1 → 1.1 → 1",
    category: "emphasis",
    difficulty: "easy",
    keyframes: [
      { time: 0, value: 1 },
      { time: 0.5, value: 1.1 },
      { time: 1, value: 1 }
    ],
    property: "scaleX" as const,
    easing: "ease-in-out" as const
  },
  {
    id: "shake",
    name: "Shake",
    description: "Horizontal shaking motion",
    icon: "📳",
    duration: 0.8,
    preview: "x: 0 → -10 → 10 → 0",
    category: "emphasis",
    difficulty: "medium",
    keyframes: [
      { time: 0, value: 0 },
      { time: 0.25, value: -10 },
      { time: 0.75, value: 10 },
      { time: 1, value: 0 }
    ],
    property: "x" as const,
    easing: "linear" as const
  },
  {
    id: "glow",
    name: "Glow",
    description: "Opacity pulsing effect",
    icon: "💫",
    duration: 2.0,
    preview: "opacity: 1 → 0.5 → 1",
    category: "emphasis",
    difficulty: "easy",
    keyframes: [
      { time: 0, value: 1 },
      { time: 0.5, value: 0.5 },
      { time: 1, value: 1 }
    ],
    property: "opacity" as const,
    easing: "ease-in-out" as const
  },
  {
    id: "rotate-emphasis",
    name: "Rotate",
    description: "Quick rotation emphasis",
    icon: "🔄",
    duration: 0.6,
    preview: "rotation: 0 → 15 → 0",
    category: "emphasis",
    difficulty: "medium",
    keyframes: [
      { time: 0, value: 0 },
      { time: 0.5, value: 15 },
      { time: 1, value: 0 }
    ],
    property: "rotation" as const,
    easing: "ease-out" as const
  }
];

const EXIT_ANIMATIONS = [
  {
    id: "fade-out",
    name: "Fade Out",
    description: "Smooth opacity fade",
    icon: "🌫️",
    duration: 1.0,
    preview: "opacity: 1 → 0",
    category: "exit",
    difficulty: "easy",
    keyframes: [
      { time: 0, value: 1 },
      { time: 1, value: 0 }
    ],
    property: "opacity" as const,
    easing: "ease-in" as const
  },
  {
    id: "slide-out-right",
    name: "Slide Out Right",
    description: "Slides to the right",
    icon: "➡️",
    duration: 1.0,
    preview: "x: 0 → 100",
    category: "exit",
    difficulty: "easy",
    keyframes: [
      { time: 0, value: 0 },
      { time: 1, value: 100 }
    ],
    property: "x" as const,
    easing: "ease-in" as const
  },
  {
    id: "scale-out",
    name: "Scale Out",
    description: "Shrinks to nothing",
    icon: "🔍",
    duration: 0.8,
    preview: "scale: 1 → 0",
    category: "exit",
    difficulty: "easy",
    keyframes: [
      { time: 0, value: 1 },
      { time: 1, value: 0 }
    ],
    property: "scaleX" as const,
    easing: "ease-in" as const
  }
];

const SPECIAL_ANIMATIONS = [
  {
    id: "typewriter",
    name: "Typewriter",
    description: "Text appears character by character",
    icon: "⌨️",
    duration: 3.0,
    preview: "Custom text reveal",
    category: "special",
    difficulty: "advanced",
    keyframes: [
      { time: 0, value: 0 },
      { time: 1, value: 1 }
    ],
    property: "opacity" as const,
    easing: "linear" as const
  },
  {
    id: "flip-in",
    name: "Flip In",
    description: "3D flip entrance",
    icon: "🔃",
    duration: 1.2,
    preview: "rotationY: 90 → 0",
    category: "special",
    difficulty: "advanced",
    keyframes: [
      { time: 0, value: 90 },
      { time: 1, value: 0 }
    ],
    property: "rotation" as const,
    easing: "ease-out" as const
  }
];

const DIFFICULTY_COLORS = {
  easy: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  advanced: "bg-red-100 text-red-800"
};

export function AnimationPresetsPanel({
  selectedLayer,
  onApplyAnimation,
  onPreviewAnimation,
  className
}: AnimationPresetsPanelProps) {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [customDuration, setCustomDuration] = useState([1.5]);
  const [customDelay, setCustomDelay] = useState([0]);

  const createAnimationFromPreset = (preset: any): Animation => {
    return {
      id: `${preset.id}-${Date.now()}`,
      property: preset.property,
      keyframes: preset.keyframes,
      easing: preset.easing,
      duration: customDuration[0],
      delay: customDelay[0],
      iterations: 1,
      direction: 'normal'
    };
  };

  const handleApplyAnimation = (preset: any) => {
    if (!selectedLayer) return;
    
    const animation = createAnimationFromPreset(preset);
    onApplyAnimation(selectedLayer, animation);
    setSelectedPreset(preset.id);
  };

  const handlePreviewAnimation = (preset: any) => {
    const animation = createAnimationFromPreset(preset);
    onPreviewAnimation(animation);
  };

  const renderAnimationGrid = (animations: any[]) => (
    <div className="grid grid-cols-2 gap-3">
      {animations.map((preset) => (
        <div
          key={preset.id}
          className={cn(
            "p-3 border rounded-lg cursor-pointer transition-all hover:border-primary hover:shadow-md",
            selectedPreset === preset.id ? "border-primary bg-primary/5" : "border-border"
          )}
          onClick={() => handleApplyAnimation(preset)}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="text-2xl">{preset.icon}</div>
            <Badge 
              variant="secondary" 
              className={cn("text-xs", DIFFICULTY_COLORS[preset.difficulty as keyof typeof DIFFICULTY_COLORS])}
            >
              {preset.difficulty}
            </Badge>
          </div>
          
          <h4 className="font-medium text-sm mb-1">{preset.name}</h4>
          <p className="text-xs text-muted-foreground mb-2">{preset.description}</p>
          <p className="text-xs font-mono bg-muted px-2 py-1 rounded">{preset.preview}</p>
          
          <div className="flex gap-1 mt-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                handlePreviewAnimation(preset);
              }}
            >
              <Eye className="h-3 w-3 mr-1" />
              Preview
            </Button>
            <span className="text-xs text-muted-foreground self-center">
              {preset.duration}s
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card className={cn("w-full h-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Animation Presets
          {selectedLayer && (
            <Badge variant="outline" className="ml-auto">
              {selectedLayer.name}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {!selectedLayer ? (
          <div className="text-center text-muted-foreground py-8 px-4">
            <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select a layer to apply animations</p>
            <p className="text-sm mt-2">Choose any element to see available animations</p>
          </div>
        ) : (
          <>
            {/* Animation Controls */}
            <div className="p-4 border-b space-y-4">
              <div className="space-y-2">
                <Label>Duration: {customDuration[0]}s</Label>
                <Slider
                  value={customDuration}
                  onValueChange={setCustomDuration}
                  min={0.1}
                  max={5}
                  step={0.1}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Delay: {customDelay[0]}s</Label>
                <Slider
                  value={customDelay}
                  onValueChange={setCustomDelay}
                  min={0}
                  max={3}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>

            {/* Animation Categories */}
            <Tabs defaultValue="entrance" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mx-4 mt-4">
                <TabsTrigger value="entrance" className="text-xs">
                  <ArrowRight className="h-3 w-3 mr-1" />
                  Enter
                </TabsTrigger>
                <TabsTrigger value="emphasis" className="text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  Emphasis
                </TabsTrigger>
                <TabsTrigger value="exit" className="text-xs">
                  <ArrowRight className="h-3 w-3 mr-1 rotate-180" />
                  Exit
                </TabsTrigger>
                <TabsTrigger value="special" className="text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  Special
                </TabsTrigger>
              </TabsList>

              <TabsContent value="entrance" className="p-4">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <ArrowRight className="h-4 w-4 text-green-600" />
                      <h3 className="font-medium">Entrance Animations</h3>
                      <Badge variant="secondary">{ENTRANCE_ANIMATIONS.length}</Badge>
                    </div>
                    {renderAnimationGrid(ENTRANCE_ANIMATIONS)}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="emphasis" className="p-4">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="h-4 w-4 text-yellow-600" />
                      <h3 className="font-medium">Emphasis Animations</h3>
                      <Badge variant="secondary">{EMPHASIS_ANIMATIONS.length}</Badge>
                    </div>
                    {renderAnimationGrid(EMPHASIS_ANIMATIONS)}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="exit" className="p-4">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <ArrowRight className="h-4 w-4 text-red-600 rotate-180" />
                      <h3 className="font-medium">Exit Animations</h3>
                      <Badge variant="secondary">{EXIT_ANIMATIONS.length}</Badge>
                    </div>
                    {renderAnimationGrid(EXIT_ANIMATIONS)}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="special" className="p-4">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="h-4 w-4 text-purple-600" />
                      <h3 className="font-medium">Special Effects</h3>
                      <Badge variant="secondary">{SPECIAL_ANIMATIONS.length}</Badge>
                    </div>
                    {renderAnimationGrid(SPECIAL_ANIMATIONS)}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  );
}
