"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  Play,
  Pause,
  Plus,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ChevronDown,
  ChevronRight,
  Scissors,
  Move,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { VideoProject, VideoLayer, TimelineMarker } from "@/lib/animated-video/types";

export interface TimelineEditorProps {
  project: VideoProject;
  currentTime: number;
  isPlaying: boolean;
  onTimeChange: (time: number) => void;
  onLayerSelect: (layer: VideoLayer | null) => void;
  onLayerUpdate: (layer: VideoLayer) => void;
  onLayerDelete: (layerId: string) => void;
  onLayerDuplicate: (layer: VideoLayer) => void;
  onMarkerAdd: (time: number) => void;
  onMarkerDelete: (markerId: string) => void;
  className?: string;
}

export function TimelineEditor({
  project,
  currentTime,
  isPlaying,
  onTimeChange,
  onLayerSelect,
  onLayerUpdate,
  onLayerDelete,
  onLayerDuplicate,
  onMarkerAdd,
  onMarkerDelete,
  className,
}: TimelineEditorProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [selectedLayer, setSelectedLayer] = useState<VideoLayer | null>(null);
  const [draggedLayer, setDraggedLayer] = useState<VideoLayer | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [viewStart, setViewStart] = useState(0);
  const [collapsedLayers, setCollapsedLayers] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<'move' | 'resize-start' | 'resize-end' | null>(null);

  const timelineWidth = 800;
  const layerHeight = 40;
  const headerWidth = 200;
  const pixelsPerSecond = 50 * zoom;

  // Calculate timeline dimensions
  const totalWidth = project.duration * pixelsPerSecond;
  const viewEnd = viewStart + timelineWidth / pixelsPerSecond;

  // Format time for display
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const frames = Math.floor((time % 1) * project.fps);
    return `${minutes}:${seconds.toString().padStart(2, "0")}:${frames.toString().padStart(2, "0")}`;
  };

  // Convert time to pixel position
  const timeToPixel = (time: number) => {
    return (time - viewStart) * pixelsPerSecond;
  };

  // Convert pixel position to time
  const pixelToTime = (pixel: number) => {
    return viewStart + pixel / pixelsPerSecond;
  };

  // Handle timeline click
  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - headerWidth;
    const time = pixelToTime(x);
    
    if (time >= 0 && time <= project.duration) {
      onTimeChange(time);
    }
  };

  // Handle layer selection
  const handleLayerSelect = (layer: VideoLayer) => {
    setSelectedLayer(layer);
    onLayerSelect(layer);
  };

  // Handle layer visibility toggle
  const toggleLayerVisibility = (layer: VideoLayer) => {
    const updatedLayer = { ...layer, visible: !layer.visible };
    onLayerUpdate(updatedLayer);
  };

  // Handle layer lock toggle
  const toggleLayerLock = (layer: VideoLayer) => {
    const updatedLayer = { ...layer, locked: !layer.locked };
    onLayerUpdate(updatedLayer);
  };

  // Handle layer collapse toggle
  const toggleLayerCollapse = (layerId: string) => {
    const newCollapsed = new Set(collapsedLayers);
    if (newCollapsed.has(layerId)) {
      newCollapsed.delete(layerId);
    } else {
      newCollapsed.add(layerId);
    }
    setCollapsedLayers(newCollapsed);
  };

  // Handle drag start
  const handleDragStart = (e: React.MouseEvent, layer: VideoLayer, type: 'move' | 'resize-start' | 'resize-end') => {
    if (layer.locked) return;
    
    e.preventDefault();
    setDraggedLayer(layer);
    setDragType(type);
    setIsDragging(true);
    
    const rect = timelineRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  // Handle drag move
  const handleDragMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !draggedLayer || !timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - headerWidth;
    const time = pixelToTime(x);
    
    let updatedLayer = { ...draggedLayer };
    
    switch (dragType) {
      case 'move':
        const duration = draggedLayer.endTime - draggedLayer.startTime;
        const newStartTime = Math.max(0, Math.min(time, project.duration - duration));
        updatedLayer.startTime = newStartTime;
        updatedLayer.endTime = newStartTime + duration;
        break;
        
      case 'resize-start':
        const newStartTime2 = Math.max(0, Math.min(time, draggedLayer.endTime - 0.1));
        updatedLayer.startTime = newStartTime2;
        break;
        
      case 'resize-end':
        const newEndTime = Math.max(draggedLayer.startTime + 0.1, Math.min(time, project.duration));
        updatedLayer.endTime = newEndTime;
        break;
    }
    
    setDraggedLayer(updatedLayer);
  }, [isDragging, draggedLayer, dragType, pixelToTime, project.duration]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    if (draggedLayer && isDragging) {
      onLayerUpdate(draggedLayer);
    }
    setIsDragging(false);
    setDraggedLayer(null);
    setDragType(null);
  }, [draggedLayer, isDragging, onLayerUpdate]);

  // Add event listeners for drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  // Handle zoom
  const handleZoom = (newZoom: number[]) => {
    setZoom(newZoom[0]);
  };

  // Handle scroll
  const handleScroll = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaX || e.deltaY;
    const scrollSpeed = 0.01;
    const newViewStart = Math.max(0, Math.min(viewStart + delta * scrollSpeed, project.duration - viewEnd + viewStart));
    setViewStart(newViewStart);
  };

  // Render time ruler
  const renderTimeRuler = () => {
    const ticks = [];
    const majorTickInterval = 1; // 1 second
    const minorTickInterval = 0.2; // 0.2 seconds
    
    for (let time = Math.floor(viewStart); time <= Math.ceil(viewEnd); time += minorTickInterval) {
      const x = timeToPixel(time);
      const isMajor = time % majorTickInterval === 0;
      
      if (x >= 0 && x <= timelineWidth) {
        ticks.push(
          <div
            key={time}
            className={cn(
              "absolute border-l border-border",
              isMajor ? "h-6" : "h-3"
            )}
            style={{ left: x }}
          >
            {isMajor && (
              <span className="absolute top-0 left-1 text-xs text-muted-foreground">
                {formatTime(time)}
              </span>
            )}
          </div>
        );
      }
    }
    
    return ticks;
  };

  // Render layer bar
  const renderLayerBar = (layer: VideoLayer) => {
    const startX = timeToPixel(layer.startTime);
    const endX = timeToPixel(layer.endTime);
    const width = endX - startX;
    
    if (startX > timelineWidth || endX < 0) return null;
    
    const displayLayer = draggedLayer?.id === layer.id ? draggedLayer : layer;
    const actualStartX = timeToPixel(displayLayer.startTime);
    const actualEndX = timeToPixel(displayLayer.endTime);
    const actualWidth = actualEndX - actualStartX;
    
    return (
      <div
        key={layer.id}
        className={cn(
          "absolute h-8 rounded border-2 cursor-pointer transition-colors",
          selectedLayer?.id === layer.id
            ? "border-primary bg-primary/20"
            : "border-border bg-card hover:bg-accent",
          layer.locked && "opacity-50 cursor-not-allowed"
        )}
        style={{
          left: Math.max(0, actualStartX),
          width: Math.max(10, actualWidth),
          top: 4,
        }}
        onClick={() => handleLayerSelect(layer)}
        onMouseDown={(e) => handleDragStart(e, layer, 'move')}
      >
        {/* Layer content */}
        <div className="px-2 py-1 text-xs font-medium truncate">
          {layer.name}
        </div>
        
        {/* Resize handles */}
        {!layer.locked && selectedLayer?.id === layer.id && (
          <>
            <div
              className="absolute left-0 top-0 w-2 h-full cursor-ew-resize bg-primary/50 hover:bg-primary"
              onMouseDown={(e) => {
                e.stopPropagation();
                handleDragStart(e, layer, 'resize-start');
              }}
            />
            <div
              className="absolute right-0 top-0 w-2 h-full cursor-ew-resize bg-primary/50 hover:bg-primary"
              onMouseDown={(e) => {
                e.stopPropagation();
                handleDragStart(e, layer, 'resize-end');
              }}
            />
          </>
        )}
      </div>
    );
  };

  return (
    <div className={cn("flex flex-col bg-background border rounded-lg", className)}>
      {/* Timeline header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold">Timeline</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Zoom:</span>
          <div className="w-24">
            <Slider
              value={[zoom]}
              min={0.1}
              max={5}
              step={0.1}
              onValueChange={handleZoom}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMarkerAdd(currentTime)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Timeline content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Layer list */}
        <div className="w-48 border-r bg-muted/30">
          <div className="p-2 border-b bg-background">
            <span className="text-sm font-medium">Layers</span>
          </div>
          <div className="overflow-y-auto max-h-96">
            {project.layers.map((layer) => (
              <div
                key={layer.id}
                className={cn(
                  "flex items-center p-2 border-b cursor-pointer hover:bg-accent",
                  selectedLayer?.id === layer.id && "bg-accent"
                )}
                onClick={() => handleLayerSelect(layer)}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 mr-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLayerCollapse(layer.id);
                  }}
                >
                  {collapsedLayers.has(layer.id) ? (
                    <ChevronRight className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 mr-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLayerVisibility(layer);
                  }}
                >
                  {layer.visible ? (
                    <Eye className="h-3 w-3" />
                  ) : (
                    <EyeOff className="h-3 w-3" />
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 mr-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLayerLock(layer);
                  }}
                >
                  {layer.locked ? (
                    <Lock className="h-3 w-3" />
                  ) : (
                    <Unlock className="h-3 w-3" />
                  )}
                </Button>
                
                <span className="text-sm truncate flex-1">{layer.name}</span>
                
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLayerDuplicate(layer);
                    }}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLayerDelete(layer.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline area */}
        <div className="flex-1 overflow-hidden">
          <div
            ref={timelineRef}
            className="relative h-full overflow-auto"
            onWheel={handleScroll}
            onClick={handleTimelineClick}
          >
            {/* Time ruler */}
            <div className="relative h-8 border-b bg-muted/50">
              {renderTimeRuler()}
            </div>

            {/* Current time indicator */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-primary z-10 pointer-events-none"
              style={{ left: headerWidth + timeToPixel(currentTime) }}
            />

            {/* Timeline markers */}
            {project.timeline.markers.map((marker) => (
              <div
                key={marker.id}
                className="absolute top-0 bottom-0 w-0.5 bg-yellow-500 z-5 cursor-pointer"
                style={{ left: headerWidth + timeToPixel(marker.time) }}
                title={marker.label}
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkerDelete(marker.id);
                }}
              />
            ))}

            {/* Layer tracks */}
            <div className="relative">
              {project.layers.map((layer, index) => (
                <div
                  key={layer.id}
                  className="relative border-b"
                  style={{ height: layerHeight }}
                >
                  {renderLayerBar(layer)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline footer */}
      <div className="flex items-center justify-between p-2 border-t bg-muted/30">
        <div className="text-sm text-muted-foreground">
          {formatTime(currentTime)} / {formatTime(project.duration)}
        </div>
        <div className="text-sm text-muted-foreground">
          {project.layers.length} layers
        </div>
      </div>
    </div>
  );
}
