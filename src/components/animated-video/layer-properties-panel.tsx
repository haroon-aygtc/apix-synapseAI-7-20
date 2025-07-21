"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  Layers,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Move,
  RotateCw,
  Palette,
  Clock,
  Zap,
  Settings,
  Trash2,
  Copy,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { VideoLayer, BlendMode } from "@/lib/animated-video/types";

export interface LayerPropertiesPanelProps {
  selectedLayer: VideoLayer | null;
  onLayerUpdate: (layer: VideoLayer) => void;
  onLayerDelete: (layerId: string) => void;
  onLayerDuplicate: (layer: VideoLayer) => void;
  className?: string;
}

const BLEND_MODES: { name: string; value: BlendMode }[] = [
  { name: "Normal", value: "normal" },
  { name: "Multiply", value: "multiply" },
  { name: "Screen", value: "screen" },
  { name: "Overlay", value: "overlay" },
  { name: "Soft Light", value: "soft-light" },
  { name: "Hard Light", value: "hard-light" },
  { name: "Color Dodge", value: "color-dodge" },
  { name: "Color Burn", value: "color-burn" },
  { name: "Darken", value: "darken" },
  { name: "Lighten", value: "lighten" },
  { name: "Difference", value: "difference" },
  { name: "Exclusion", value: "exclusion" }
];

const LAYER_TYPE_ICONS = {
  text: "📝",
  image: "🖼️",
  shape: "🔷",
  video: "🎥",
  audio: "🔊",
  particle: "✨",
  mask: "🎭",
  adjustment: "⚙️"
};

export function LayerPropertiesPanel({
  selectedLayer,
  onLayerUpdate,
  onLayerDelete,
  onLayerDuplicate,
  className
}: LayerPropertiesPanelProps) {
  const [layerName, setLayerName] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [opacity, setOpacity] = useState([1]);
  const [blendMode, setBlendMode] = useState<BlendMode>("normal");
  const [startTime, setStartTime] = useState([0]);
  const [endTime, setEndTime] = useState([3]);
  const [zIndex, setZIndex] = useState([0]);
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    timing: true,
    transform: false,
    effects: false
  });

  // Update state when selected layer changes
  useEffect(() => {
    if (selectedLayer) {
      setLayerName(selectedLayer.name);
      setIsVisible(selectedLayer.visible);
      setIsLocked(selectedLayer.locked);
      setOpacity([selectedLayer.opacity]);
      setBlendMode(selectedLayer.blendMode);
      setStartTime([selectedLayer.startTime]);
      setEndTime([selectedLayer.endTime]);
      setZIndex([selectedLayer.zIndex]);
    }
  }, [selectedLayer]);

  const updateLayer = (updates: Partial<VideoLayer>) => {
    if (!selectedLayer) return;
    
    const updatedLayer = {
      ...selectedLayer,
      ...updates
    };
    onLayerUpdate(updatedLayer);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleNameChange = (name: string) => {
    setLayerName(name);
    updateLayer({ name });
  };

  const handleVisibilityToggle = (visible: boolean) => {
    setIsVisible(visible);
    updateLayer({ visible });
  };

  const handleLockToggle = (locked: boolean) => {
    setIsLocked(locked);
    updateLayer({ locked });
  };

  const handleOpacityChange = (value: number[]) => {
    setOpacity(value);
    updateLayer({ opacity: value[0] });
  };

  const handleBlendModeChange = (mode: BlendMode) => {
    setBlendMode(mode);
    updateLayer({ blendMode: mode });
  };

  const handleTimingChange = (type: "start" | "end", value: number[]) => {
    if (type === "start") {
      setStartTime(value);
      updateLayer({ startTime: value[0] });
    } else {
      setEndTime(value);
      updateLayer({ endTime: value[0] });
    }
  };

  const handleZIndexChange = (value: number[]) => {
    setZIndex(value);
    updateLayer({ zIndex: value[0] });
  };

  if (!selectedLayer) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Layer Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <Layers className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No layer selected</p>
            <p className="text-sm mt-2">Select a layer to edit its properties</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5" />
          Layer Properties
          <Badge variant="secondary" className="ml-auto">
            {LAYER_TYPE_ICONS[selectedLayer.type]} {selectedLayer.type}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Properties */}
        <div className="space-y-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleSection("basic")}
            className="w-full justify-between p-2"
          >
            <span className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Basic Properties
            </span>
            {expandedSections.basic ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>

          {expandedSections.basic && (
            <div className="space-y-3 pl-4">
              <div className="space-y-2">
                <Label htmlFor="layer-name">Layer Name</Label>
                <Input
                  id="layer-name"
                  value={layerName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Enter layer name..."
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="visibility"
                    checked={isVisible}
                    onCheckedChange={handleVisibilityToggle}
                  />
                  <Label htmlFor="visibility" className="flex items-center gap-2">
                    {isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    Visible
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="locked"
                    checked={isLocked}
                    onCheckedChange={handleLockToggle}
                  />
                  <Label htmlFor="locked" className="flex items-center gap-2">
                    {isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                    Locked
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Opacity: {Math.round(opacity[0] * 100)}%</Label>
                <Slider
                  value={opacity}
                  onValueChange={handleOpacityChange}
                  min={0}
                  max={1}
                  step={0.01}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Blend Mode</Label>
                <Select value={blendMode} onValueChange={handleBlendModeChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BLEND_MODES.map((mode) => (
                      <SelectItem key={mode.value} value={mode.value}>
                        {mode.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Layer Order (Z-Index): {zIndex[0]}</Label>
                <Slider
                  value={zIndex}
                  onValueChange={handleZIndexChange}
                  min={-10}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Timing Properties */}
        <div className="space-y-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleSection("timing")}
            className="w-full justify-between p-2"
          >
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Timing
            </span>
            {expandedSections.timing ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>

          {expandedSections.timing && (
            <div className="space-y-3 pl-4">
              <div className="space-y-2">
                <Label>Start Time: {startTime[0].toFixed(1)}s</Label>
                <Slider
                  value={startTime}
                  onValueChange={(value) => handleTimingChange("start", value)}
                  min={0}
                  max={30}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>End Time: {endTime[0].toFixed(1)}s</Label>
                <Slider
                  value={endTime}
                  onValueChange={(value) => handleTimingChange("end", value)}
                  min={startTime[0] + 0.1}
                  max={30}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="text-sm text-muted-foreground">
                Duration: {(endTime[0] - startTime[0]).toFixed(1)}s
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Transform Properties */}
        <div className="space-y-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleSection("transform")}
            className="w-full justify-between p-2"
          >
            <span className="flex items-center gap-2">
              <Move className="h-4 w-4" />
              Transform
            </span>
            {expandedSections.transform ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>

          {expandedSections.transform && (
            <div className="space-y-3 pl-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>X: {selectedLayer.transform.x}</Label>
                  <Slider
                    value={[selectedLayer.transform.x]}
                    onValueChange={(value) => updateLayer({
                      transform: { ...selectedLayer.transform, x: value[0] }
                    })}
                    min={-500}
                    max={500}
                    step={1}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Y: {selectedLayer.transform.y}</Label>
                  <Slider
                    value={[selectedLayer.transform.y]}
                    onValueChange={(value) => updateLayer({
                      transform: { ...selectedLayer.transform, y: value[0] }
                    })}
                    min={-300}
                    max={300}
                    step={1}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Rotation: {selectedLayer.transform.rotation}°</Label>
                <Slider
                  value={[selectedLayer.transform.rotation]}
                  onValueChange={(value) => updateLayer({
                    transform: { ...selectedLayer.transform, rotation: value[0] }
                  })}
                  min={-180}
                  max={180}
                  step={1}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Scale X: {selectedLayer.transform.scaleX}</Label>
                  <Slider
                    value={[selectedLayer.transform.scaleX]}
                    onValueChange={(value) => updateLayer({
                      transform: { ...selectedLayer.transform, scaleX: value[0] }
                    })}
                    min={0.1}
                    max={3}
                    step={0.1}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Scale Y: {selectedLayer.transform.scaleY}</Label>
                  <Slider
                    value={[selectedLayer.transform.scaleY]}
                    onValueChange={(value) => updateLayer({
                      transform: { ...selectedLayer.transform, scaleY: value[0] }
                    })}
                    min={0.1}
                    max={3}
                    step={0.1}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Effects */}
        <div className="space-y-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleSection("effects")}
            className="w-full justify-between p-2"
          >
            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Effects ({selectedLayer.effects.length})
            </span>
            {expandedSections.effects ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>

          {expandedSections.effects && (
            <div className="space-y-2 pl-4">
              {selectedLayer.effects.length === 0 ? (
                <p className="text-sm text-muted-foreground">No effects applied</p>
              ) : (
                selectedLayer.effects.map((effect) => (
                  <div key={effect.id} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">{effect.name}</span>
                    <Switch checked={effect.enabled} />
                  </div>
                ))
              )}
              <Button variant="outline" size="sm" className="w-full">
                Add Effect
              </Button>
            </div>
          )}
        </div>

        <Separator />

        {/* Layer Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onLayerDuplicate(selectedLayer)}
            className="flex-1"
          >
            <Copy className="h-4 w-4 mr-2" />
            Duplicate
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onLayerDelete(selectedLayer.id)}
            className="flex-1"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
