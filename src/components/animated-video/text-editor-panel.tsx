"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Type,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Move,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Play,
  Eye
} from "lucide-react";
import { VideoLayer } from "@/lib/animated-video/types";

export interface TextEditorPanelProps {
  selectedLayer: VideoLayer | null;
  onLayerUpdate: (layer: VideoLayer) => void;
  onPreviewAnimation: (layer: VideoLayer) => void;
  className?: string;
}

const FONT_FAMILIES = [
  { name: "Arial", value: "Arial, sans-serif" },
  { name: "Helvetica", value: "Helvetica, sans-serif" },
  { name: "Times New Roman", value: "Times New Roman, serif" },
  { name: "Georgia", value: "Georgia, serif" },
  { name: "Verdana", value: "Verdana, sans-serif" },
  { name: "Trebuchet MS", value: "Trebuchet MS, sans-serif" },
  { name: "Impact", value: "Impact, sans-serif" },
  { name: "Comic Sans MS", value: "Comic Sans MS, cursive" },
  { name: "Courier New", value: "Courier New, monospace" },
  { name: "Roboto", value: "Roboto, sans-serif" },
  { name: "Open Sans", value: "Open Sans, sans-serif" },
  { name: "Lato", value: "Lato, sans-serif" },
  { name: "Montserrat", value: "Montserrat, sans-serif" },
  { name: "Poppins", value: "Poppins, sans-serif" }
];

const FONT_WEIGHTS = [
  { name: "Light", value: "300" },
  { name: "Normal", value: "normal" },
  { name: "Medium", value: "500" },
  { name: "Semi Bold", value: "600" },
  { name: "Bold", value: "bold" },
  { name: "Extra Bold", value: "800" }
];

const ANIMATION_PRESETS = [
  { name: "Fade In", value: "fadeIn", icon: "✨" },
  { name: "Slide In", value: "slideIn", icon: "➡️" },
  { name: "Bounce", value: "bounce", icon: "🏀" },
  { name: "Glow", value: "glow", icon: "💫" },
  { name: "Typewriter", value: "typewriter", icon: "⌨️" },
  { name: "Scale In", value: "scaleIn", icon: "🔍" },
  { name: "Rotate In", value: "rotateIn", icon: "🔄" },
  { name: "Flip In", value: "flipIn", icon: "🔃" }
];

const COLOR_PRESETS = [
  "#ffffff", "#000000", "#ff6b35", "#4ecdc4", "#45b7d1",
  "#96ceb4", "#feca57", "#ff9ff3", "#54a0ff", "#5f27cd",
  "#00d2d3", "#ff9f43", "#ee5a24", "#0abde3", "#10ac84"
];

export function TextEditorPanel({
  selectedLayer,
  onLayerUpdate,
  onPreviewAnimation,
  className
}: TextEditorPanelProps) {
  const [textContent, setTextContent] = useState("");
  const [fontSize, setFontSize] = useState([32]);
  const [fontFamily, setFontFamily] = useState("Arial, sans-serif");
  const [fontWeight, setFontWeight] = useState("normal");
  const [textColor, setTextColor] = useState("#ffffff");
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("center");
  const [letterSpacing, setLetterSpacing] = useState([0]);
  const [lineHeight, setLineHeight] = useState([1.2]);
  const [positionX, setPositionX] = useState([0]);
  const [positionY, setPositionY] = useState([0]);
  const [rotation, setRotation] = useState([0]);
  const [scaleX, setScaleX] = useState([1]);
  const [scaleY, setScaleY] = useState([1]);
  const [opacity, setOpacity] = useState([1]);
  const [selectedAnimation, setSelectedAnimation] = useState("fadeIn");

  // Update state when selected layer changes
  useEffect(() => {
    if (selectedLayer?.type === "text" && selectedLayer.data.text) {
      const textData = selectedLayer.data.text;
      setTextContent(textData.content);
      setFontSize([textData.fontSize]);
      setFontFamily(textData.fontFamily);
      setFontWeight(textData.fontWeight);
      setTextColor(textData.color);
      setTextAlign(textData.textAlign);
      setLetterSpacing([textData.letterSpacing]);
      setLineHeight([textData.lineHeight]);
      setPositionX([selectedLayer.transform.x]);
      setPositionY([selectedLayer.transform.y]);
      setRotation([selectedLayer.transform.rotation]);
      setScaleX([selectedLayer.transform.scaleX]);
      setScaleY([selectedLayer.transform.scaleY]);
      setOpacity([selectedLayer.opacity]);
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

  const updateTextData = (textUpdates: any) => {
    if (!selectedLayer?.data.text) return;
    
    updateLayer({
      data: {
        ...selectedLayer.data,
        text: {
          ...selectedLayer.data.text,
          ...textUpdates
        }
      }
    });
  };

  const updateTransform = (transformUpdates: any) => {
    if (!selectedLayer) return;
    
    updateLayer({
      transform: {
        ...selectedLayer.transform,
        ...transformUpdates
      }
    });
  };

  const handleTextChange = (value: string) => {
    setTextContent(value);
    updateTextData({ content: value });
  };

  const handleFontSizeChange = (value: number[]) => {
    setFontSize(value);
    updateTextData({ fontSize: value[0] });
  };

  const handleColorChange = (color: string) => {
    setTextColor(color);
    updateTextData({ color });
  };

  const handleAlignmentChange = (align: "left" | "center" | "right") => {
    setTextAlign(align);
    updateTextData({ textAlign: align });
  };

  const handlePositionChange = (axis: "x" | "y", value: number[]) => {
    if (axis === "x") {
      setPositionX(value);
      updateTransform({ x: value[0] });
    } else {
      setPositionY(value);
      updateTransform({ y: value[0] });
    }
  };

  const applyAnimation = (animationType: string) => {
    if (!selectedLayer) return;
    
    // Create animation based on type
    const animation = {
      id: `${animationType}-animation`,
      property: animationType === "fadeIn" ? "opacity" : 
                animationType === "slideIn" ? "x" :
                animationType === "scaleIn" ? "scaleX" : "opacity",
      easing: "ease-out" as const,
      duration: 2,
      delay: 0,
      iterations: 1 as const,
      direction: "normal" as const,
      keyframes: animationType === "fadeIn" ? [
        { time: 0, value: 0 },
        { time: 1, value: 1 }
      ] : animationType === "slideIn" ? [
        { time: 0, value: -100 },
        { time: 1, value: positionX[0] }
      ] : animationType === "bounce" ? [
        { time: 0, value: 0.5 },
        { time: 0.6, value: 1.2 },
        { time: 1, value: 1 }
      ] : [
        { time: 0, value: 0 },
        { time: 1, value: 1 }
      ]
    };

    const updatedLayer = {
      ...selectedLayer,
      animations: [animation]
    };
    
    onLayerUpdate(updatedLayer);
    setSelectedAnimation(animationType);
  };

  if (!selectedLayer || selectedLayer.type !== "text") {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Text Editor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <Type className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select a text layer to edit</p>
            <p className="text-sm mt-2">Click on a text element or add a new one</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Type className="h-5 w-5" />
          Text Editor
          <Badge variant="secondary" className="ml-auto">
            {selectedLayer.name}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Text Content */}
        <div className="space-y-2">
          <Label htmlFor="text-content">Text Content</Label>
          <Textarea
            id="text-content"
            value={textContent}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Enter your text here..."
            className="min-h-[80px]"
          />
        </div>

        <Separator />

        {/* Font Settings */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Type className="h-4 w-4" />
            Font Settings
          </h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Font Family</Label>
              <Select value={fontFamily} onValueChange={(value) => {
                setFontFamily(value);
                updateTextData({ fontFamily: value });
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_FAMILIES.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      <span style={{ fontFamily: font.value }}>{font.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Font Weight</Label>
              <Select value={fontWeight} onValueChange={(value) => {
                setFontWeight(value);
                updateTextData({ fontWeight: value });
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_WEIGHTS.map((weight) => (
                    <SelectItem key={weight.value} value={weight.value}>
                      {weight.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Font Size: {fontSize[0]}px</Label>
            <Slider
              value={fontSize}
              onValueChange={handleFontSizeChange}
              min={8}
              max={120}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Letter Spacing: {letterSpacing[0]}px</Label>
            <Slider
              value={letterSpacing}
              onValueChange={(value) => {
                setLetterSpacing(value);
                updateTextData({ letterSpacing: value[0] });
              }}
              min={-5}
              max={20}
              step={0.5}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Line Height: {lineHeight[0]}</Label>
            <Slider
              value={lineHeight}
              onValueChange={(value) => {
                setLineHeight(value);
                updateTextData({ lineHeight: value[0] });
              }}
              min={0.8}
              max={3}
              step={0.1}
              className="w-full"
            />
          </div>
        </div>

        <Separator />

        {/* Color and Alignment */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Color & Alignment
          </h4>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Text Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={textColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-12 h-8 p-1 border rounded"
                />
                <Input
                  value={textColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  placeholder="#ffffff"
                  className="flex-1"
                />
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {COLOR_PRESETS.map((color) => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded border-2 border-border hover:border-primary transition-colors"
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange(color)}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Text Alignment</Label>
              <div className="flex gap-1">
                <Button
                  variant={textAlign === "left" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleAlignmentChange("left")}
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant={textAlign === "center" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleAlignmentChange("center")}
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                  variant={textAlign === "right" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleAlignmentChange("right")}
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Position and Transform */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Move className="h-4 w-4" />
            Position & Transform
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>X Position: {positionX[0]}</Label>
              <Slider
                value={positionX}
                onValueChange={(value) => handlePositionChange("x", value)}
                min={-500}
                max={500}
                step={1}
              />
            </div>
            <div className="space-y-2">
              <Label>Y Position: {positionY[0]}</Label>
              <Slider
                value={positionY}
                onValueChange={(value) => handlePositionChange("y", value)}
                min={-300}
                max={300}
                step={1}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Rotation: {rotation[0]}°</Label>
            <Slider
              value={rotation}
              onValueChange={(value) => {
                setRotation(value);
                updateTransform({ rotation: value[0] });
              }}
              min={-180}
              max={180}
              step={1}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Scale X: {scaleX[0]}</Label>
              <Slider
                value={scaleX}
                onValueChange={(value) => {
                  setScaleX(value);
                  updateTransform({ scaleX: value[0] });
                }}
                min={0.1}
                max={3}
                step={0.1}
              />
            </div>
            <div className="space-y-2">
              <Label>Scale Y: {scaleY[0]}</Label>
              <Slider
                value={scaleY}
                onValueChange={(value) => {
                  setScaleY(value);
                  updateTransform({ scaleY: value[0] });
                }}
                min={0.1}
                max={3}
                step={0.1}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Opacity: {Math.round(opacity[0] * 100)}%</Label>
            <Slider
              value={opacity}
              onValueChange={(value) => {
                setOpacity(value);
                updateLayer({ opacity: value[0] });
              }}
              min={0}
              max={1}
              step={0.01}
            />
          </div>
        </div>

        <Separator />

        {/* Animation Presets */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Animation Presets
          </h4>

          <div className="grid grid-cols-2 gap-2">
            {ANIMATION_PRESETS.map((preset) => (
              <Button
                key={preset.value}
                variant={selectedAnimation === preset.value ? "default" : "outline"}
                size="sm"
                onClick={() => applyAnimation(preset.value)}
                className="justify-start"
              >
                <span className="mr-2">{preset.icon}</span>
                {preset.name}
              </Button>
            ))}
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => onPreviewAnimation(selectedLayer)}
            className="w-full"
          >
            <Play className="h-4 w-4 mr-2" />
            Preview Animation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
