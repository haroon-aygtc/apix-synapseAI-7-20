"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  Layers,
  Clock,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { VideoProject, VideoLayer, PerformanceMetrics } from "@/lib/animated-video/types";
import { animationEngine } from "@/lib/animated-video/animation-engine";

export interface AnimatedVideoPlayerProps {
  project: VideoProject;
  className?: string;
  showControls?: boolean;
  showTimeline?: boolean;
  showLayers?: boolean;
  showPerformance?: boolean;
  onProjectChange?: (project: VideoProject) => void;
  onTimeUpdate?: (currentTime: number) => void;
  onLayerSelect?: (layer: VideoLayer | null) => void;
}

export function AnimatedVideoPlayer({
  project,
  className,
  showControls = true,
  showTimeline = true,
  showLayers = false,
  showPerformance = false,
  onProjectChange,
  onTimeUpdate,
  onLayerSelect,
}: AnimatedVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState<VideoLayer | null>(null);
  const [showControlsOverlay, setShowControlsOverlay] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    frameTime: 0,
    memoryUsage: 0,
    renderTime: 0,
    layerCount: 0,
    effectCount: 0,
  });

  // Load project into animation engine
  useEffect(() => {
    if (project) {
      animationEngine.loadProject(project);
    }
  }, [project]);

  // Update current time from animation engine
  useEffect(() => {
    const updateTime = () => {
      const engineProject = animationEngine.getProject();
      if (engineProject) {
        const newTime = engineProject.timeline.currentTime;
        setCurrentTime(newTime);
        setIsPlaying(engineProject.timeline.isPlaying);
        onTimeUpdate?.(newTime);
      }
      
      // Update performance metrics
      if (showPerformance) {
        setPerformanceMetrics(animationEngine.getPerformanceMetrics());
      }
    };

    const interval = setInterval(updateTime, 16); // ~60fps
    return () => clearInterval(interval);
  }, [onTimeUpdate, showPerformance]);

  // Render layers on canvas with real-time updates
  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video || !project) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderFrame = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw video background
      if (video.readyState >= 2) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }

      // Render visible layers
      project.layers
        .filter(layer => layer.visible &&
                currentTime >= layer.startTime &&
                currentTime <= layer.endTime)
        .sort((a, b) => a.zIndex - b.zIndex)
        .forEach(layer => {
          renderLayer(ctx, layer, canvas.width, canvas.height);
        });
    };

    renderFrame();

    // Force re-render when project changes
    const animationFrame = requestAnimationFrame(renderFrame);
    return () => cancelAnimationFrame(animationFrame);
  }, [project, currentTime, project.layers]);

  const renderLayer = (
    ctx: CanvasRenderingContext2D,
    layer: VideoLayer,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    ctx.save();

    // Calculate animated values
    const animatedLayer = calculateAnimatedValues(layer, currentTime);

    // Apply layer transform with animations
    const { transform } = animatedLayer;
    ctx.globalAlpha = animatedLayer.opacity;
    ctx.globalCompositeOperation = layer.blendMode as GlobalCompositeOperation;

    // Calculate center point for transformations
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    ctx.translate(centerX + transform.x, centerY + transform.y);
    ctx.rotate(transform.rotation * Math.PI / 180);
    ctx.scale(transform.scaleX, transform.scaleY);

    // Render based on layer type
    switch (layer.type) {
      case 'text':
        renderTextLayer(ctx, animatedLayer, canvasWidth, canvasHeight);
        break;
      case 'image':
        renderImageLayer(ctx, animatedLayer, canvasWidth, canvasHeight);
        break;
      case 'shape':
        renderShapeLayer(ctx, animatedLayer, canvasWidth, canvasHeight);
        break;
      case 'particle':
        renderParticleLayer(ctx, animatedLayer, canvasWidth, canvasHeight);
        break;
    }

    ctx.restore();
  };

  // Calculate animated values for current time
  const calculateAnimatedValues = (layer: VideoLayer, time: number): VideoLayer => {
    const animatedLayer = { ...layer };
    const layerTime = time - layer.startTime;

    // Apply animations
    layer.animations.forEach(animation => {
      if (layerTime >= animation.delay && layerTime <= animation.delay + animation.duration) {
        const animationProgress = (layerTime - animation.delay) / animation.duration;
        const easedProgress = applyEasing(animationProgress, animation.easing);
        const value = interpolateKeyframes(animation.keyframes, easedProgress);

        // Apply animated value to layer property
        switch (animation.property) {
          case 'opacity':
            animatedLayer.opacity = value;
            break;
          case 'x':
            animatedLayer.transform.x = value;
            break;
          case 'y':
            animatedLayer.transform.y = value;
            break;
          case 'scaleX':
            animatedLayer.transform.scaleX = value;
            break;
          case 'scaleY':
            animatedLayer.transform.scaleY = value;
            break;
          case 'rotation':
            animatedLayer.transform.rotation = value;
            break;
        }
      }
    });

    return animatedLayer;
  };

  // Apply easing function
  const applyEasing = (progress: number, easing: string): number => {
    switch (easing) {
      case 'ease-out':
        return 1 - Math.pow(1 - progress, 2);
      case 'ease-in':
        return Math.pow(progress, 2);
      case 'ease-in-out':
        return progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      case 'bounce':
        if (progress < 1 / 2.75) {
          return 7.5625 * progress * progress;
        } else if (progress < 2 / 2.75) {
          return 7.5625 * (progress -= 1.5 / 2.75) * progress + 0.75;
        } else if (progress < 2.5 / 2.75) {
          return 7.5625 * (progress -= 2.25 / 2.75) * progress + 0.9375;
        } else {
          return 7.5625 * (progress -= 2.625 / 2.75) * progress + 0.984375;
        }
      case 'spring':
        return 1 - Math.cos(progress * Math.PI * 0.5);
      default:
        return progress;
    }
  };

  // Interpolate between keyframes
  const interpolateKeyframes = (keyframes: any[], progress: number): number => {
    if (keyframes.length === 0) return 0;
    if (keyframes.length === 1) return keyframes[0].value;

    // Find surrounding keyframes
    let startFrame = keyframes[0];
    let endFrame = keyframes[keyframes.length - 1];

    for (let i = 0; i < keyframes.length - 1; i++) {
      if (progress >= keyframes[i].time && progress <= keyframes[i + 1].time) {
        startFrame = keyframes[i];
        endFrame = keyframes[i + 1];
        break;
      }
    }

    if (startFrame === endFrame) return startFrame.value;

    const localProgress = (progress - startFrame.time) / (endFrame.time - startFrame.time);
    return startFrame.value + (endFrame.value - startFrame.value) * localProgress;
  };

  const renderTextLayer = (
    ctx: CanvasRenderingContext2D,
    layer: VideoLayer,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    const textData = layer.data.text;
    if (!textData) return;

    // Set font properties
    ctx.font = `${textData.fontWeight} ${textData.fontSize}px ${textData.fontFamily}`;
    ctx.fillStyle = textData.color;
    ctx.textAlign = textData.textAlign as CanvasTextAlign;
    ctx.textBaseline = 'middle';

    // Handle letter spacing
    if (textData.letterSpacing && textData.letterSpacing !== 0) {
      ctx.letterSpacing = `${textData.letterSpacing}px`;
    }

    const lines = textData.content.split('\n');
    const lineHeight = textData.fontSize * textData.lineHeight;
    const totalHeight = lines.length * lineHeight;

    lines.forEach((line, index) => {
      const y = -(totalHeight / 2) + (index + 0.5) * lineHeight;
      let x = 0;

      // Adjust x position based on text alignment
      switch (textData.textAlign) {
        case 'left':
          x = -canvasWidth / 4;
          break;
        case 'right':
          x = canvasWidth / 4;
          break;
        case 'center':
        default:
          x = 0;
          break;
      }

      ctx.fillText(line, x, y);
    });
  };

  const renderImageLayer = (
    ctx: CanvasRenderingContext2D, 
    layer: VideoLayer, 
    canvasWidth: number, 
    canvasHeight: number
  ) => {
    // Image rendering would require loading images first
    // This is a simplified version
    const imageData = layer.data.image;
    if (!imageData) return;
    
    // Draw placeholder rectangle for now
    ctx.fillStyle = '#cccccc';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = '#666666';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Image Layer', canvasWidth / 2, canvasHeight / 2);
  };

  const renderShapeLayer = (
    ctx: CanvasRenderingContext2D,
    layer: VideoLayer,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    const shapeData = layer.data.shape;
    if (!shapeData) return;

    ctx.fillStyle = shapeData.fill;
    ctx.strokeStyle = shapeData.stroke || 'transparent';
    ctx.lineWidth = shapeData.strokeWidth || 0;

    switch (shapeData.type) {
      case 'rectangle':
        const width = 150; // Default size, can be made configurable
        const height = 100;
        const x = -width / 2;
        const y = -height / 2;

        if (shapeData.borderRadius) {
          ctx.beginPath();
          ctx.roundRect(x, y, width, height, shapeData.borderRadius);
          ctx.fill();
          if (shapeData.strokeWidth && shapeData.strokeWidth > 0) {
            ctx.stroke();
          }
        } else {
          ctx.fillRect(x, y, width, height);
          if (shapeData.strokeWidth && shapeData.strokeWidth > 0) {
            ctx.strokeRect(x, y, width, height);
          }
        }
        break;

      case 'circle':
        const radius = 75; // Default radius
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.fill();
        if (shapeData.strokeWidth && shapeData.strokeWidth > 0) {
          ctx.stroke();
        }
        break;

      case 'polygon':
        // Simple triangle for now
        const size = 75;
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(-size, size);
        ctx.lineTo(size, size);
        ctx.closePath();
        ctx.fill();
        if (shapeData.strokeWidth && shapeData.strokeWidth > 0) {
          ctx.stroke();
        }
        break;
    }
  };

  const renderParticleLayer = (
    ctx: CanvasRenderingContext2D,
    layer: VideoLayer,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    const particleData = layer.data.particles;
    if (!particleData) return;

    // Simple particle rendering - can be enhanced
    const particleCount = Math.min(particleData.count, 50);
    const time = currentTime - layer.startTime;

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const distance = time * 50; // Speed
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;

      ctx.fillStyle = particleData.color[i % particleData.color.length];
      ctx.beginPath();
      ctx.arc(x, y, particleData.size.min + Math.random() * (particleData.size.max - particleData.size.min), 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  const handlePlay = () => {
    if (isPlaying) {
      animationEngine.pause();
    } else {
      animationEngine.play();
    }
  };

  const handleStop = () => {
    animationEngine.stop();
  };

  const handleSeek = (newTime: number[]) => {
    animationEngine.seek(newTime[0]);
  };

  const handleVolumeChange = (newVolume: number[]) => {
    const vol = newVolume[0];
    setVolume(vol);
    setIsMuted(vol === 0);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      videoRef.current.muted = vol === 0;
    }
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (videoRef.current) {
      videoRef.current.muted = newMuted;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const showControlsTemporarily = () => {
    setShowControlsOverlay(true);
    setTimeout(() => setShowControlsOverlay(false), 3000);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative bg-black rounded-lg overflow-hidden",
        className
      )}
      onMouseEnter={showControlsTemporarily}
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => setShowControlsOverlay(false)}
    >
      {/* Hidden video element for background */}
      <video
        ref={videoRef}
        src={project.videoSrc}
        poster={project.poster}
        muted={isMuted}
        style={{ display: 'none' }}
        onTimeUpdate={() => {
          if (videoRef.current) {
            const videoTime = videoRef.current.currentTime;
            if (Math.abs(videoTime - currentTime) > 0.1) {
              videoRef.current.currentTime = currentTime;
            }
          }
        }}
      />

      {/* Canvas for rendering layers */}
      <canvas
        ref={canvasRef}
        width={project.resolution.width}
        height={project.resolution.height}
        className="w-full h-full object-contain"
        style={{ aspectRatio: `${project.resolution.width}/${project.resolution.height}` }}
      />

      {/* Performance overlay */}
      {showPerformance && (
        <div className="absolute top-4 left-4 bg-black/80 text-white p-2 rounded text-xs font-mono">
          <div>FPS: {performanceMetrics.fps}</div>
          <div>Frame: {performanceMetrics.frameTime.toFixed(1)}ms</div>
          <div>Render: {performanceMetrics.renderTime.toFixed(1)}ms</div>
          <div>Layers: {performanceMetrics.layerCount}</div>
          <div>Effects: {performanceMetrics.effectCount}</div>
        </div>
      )}

      {/* Controls overlay */}
      {showControls && (
        <AnimatePresence>
          {(showControlsOverlay || !isPlaying) && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Timeline */}
              {showTimeline && (
                <div className="mb-4">
                  <Slider
                    value={[currentTime]}
                    max={project.duration}
                    step={0.1}
                    onValueChange={handleSeek}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-white/70 mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(project.duration)}</span>
                  </div>
                </div>
              )}

              {/* Control buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => animationEngine.seek(0)}
                    className="text-white hover:bg-white/20"
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePlay}
                    className="text-white hover:bg-white/20"
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleStop}
                    className="text-white hover:bg-white/20"
                  >
                    <Square className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => animationEngine.seek(project.duration)}
                    className="text-white hover:bg-white/20"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleMute}
                      className="text-white hover:bg-white/20"
                    >
                      {isMuted ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                    <div className="w-20">
                      <Slider
                        value={[isMuted ? 0 : volume]}
                        max={1}
                        step={0.1}
                        onValueChange={handleVolumeChange}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {showLayers && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                    >
                      <Layers className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
