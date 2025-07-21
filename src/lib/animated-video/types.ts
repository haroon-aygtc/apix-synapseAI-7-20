/**
 * Animated Video System Types
 * Comprehensive type definitions for the animated video project
 */

export interface VideoProject {
  id: string;
  name: string;
  description?: string;
  duration: number;
  fps: number;
  resolution: {
    width: number;
    height: number;
  };
  videoSrc: string;
  poster?: string;
  layers: VideoLayer[];
  timeline: TimelineData;
  settings: ProjectSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface VideoLayer {
  id: string;
  name: string;
  type: LayerType;
  visible: boolean;
  locked: boolean;
  opacity: number;
  blendMode: BlendMode;
  startTime: number;
  endTime: number;
  zIndex: number;
  transform: LayerTransform;
  animations: Animation[];
  effects: Effect[];
  data: LayerData;
}

export type LayerType = 
  | 'text' 
  | 'image' 
  | 'shape' 
  | 'video' 
  | 'audio' 
  | 'particle' 
  | 'mask'
  | 'adjustment';

export type BlendMode = 
  | 'normal' 
  | 'multiply' 
  | 'screen' 
  | 'overlay' 
  | 'soft-light' 
  | 'hard-light'
  | 'color-dodge' 
  | 'color-burn' 
  | 'darken' 
  | 'lighten' 
  | 'difference' 
  | 'exclusion';

export interface LayerTransform {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  skewX: number;
  skewY: number;
  anchorX: number;
  anchorY: number;
}

export interface Animation {
  id: string;
  property: AnimatableProperty;
  keyframes: Keyframe[];
  easing: EasingFunction;
  duration: number;
  delay: number;
  iterations: number | 'infinite';
  direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
}

export type AnimatableProperty = 
  | 'x' | 'y' | 'scaleX' | 'scaleY' | 'rotation' | 'opacity'
  | 'color' | 'backgroundColor' | 'borderRadius' | 'fontSize'
  | 'letterSpacing' | 'lineHeight' | 'blur' | 'brightness'
  | 'contrast' | 'saturate' | 'hue-rotate';

export interface Keyframe {
  time: number; // 0-1 (percentage of animation duration)
  value: any;
  easing?: EasingFunction;
}

export type EasingFunction = 
  | 'linear' 
  | 'ease' 
  | 'ease-in' 
  | 'ease-out' 
  | 'ease-in-out'
  | 'cubic-bezier'
  | 'spring'
  | 'bounce';

export interface Effect {
  id: string;
  name: string;
  type: EffectType;
  enabled: boolean;
  parameters: Record<string, any>;
}

export type EffectType = 
  | 'blur' 
  | 'brightness' 
  | 'contrast' 
  | 'saturate' 
  | 'hue-rotate'
  | 'sepia' 
  | 'grayscale' 
  | 'invert' 
  | 'drop-shadow'
  | 'glow' 
  | 'outline' 
  | 'noise' 
  | 'pixelate';

export interface LayerData {
  // Text layer data
  text?: {
    content: string;
    fontSize: number;
    fontFamily: string;
    fontWeight: string;
    color: string;
    textAlign: 'left' | 'center' | 'right';
    lineHeight: number;
    letterSpacing: number;
  };
  
  // Image layer data
  image?: {
    src: string;
    alt?: string;
    fit: 'cover' | 'contain' | 'fill' | 'scale-down';
  };
  
  // Shape layer data
  shape?: {
    type: 'rectangle' | 'circle' | 'polygon' | 'path';
    fill: string;
    stroke: string;
    strokeWidth: number;
    borderRadius?: number;
    path?: string; // SVG path for custom shapes
  };
  
  // Video layer data
  video?: {
    src: string;
    volume: number;
    playbackRate: number;
    loop: boolean;
  };
  
  // Particle system data
  particles?: {
    count: number;
    type: 'circle' | 'square' | 'triangle' | 'star';
    size: { min: number; max: number };
    speed: { min: number; max: number };
    color: string[];
    gravity: number;
    wind: number;
  };
}

export interface TimelineData {
  currentTime: number;
  playbackRate: number;
  isPlaying: boolean;
  loop: boolean;
  markers: TimelineMarker[];
  zoom: number;
  viewStart: number;
  viewEnd: number;
}

export interface TimelineMarker {
  id: string;
  time: number;
  label: string;
  color: string;
}

export interface ProjectSettings {
  backgroundColor: string;
  quality: 'low' | 'medium' | 'high' | 'ultra';
  exportFormat: 'mp4' | 'webm' | 'gif' | 'png-sequence';
  compression: number; // 0-100
  enableMotionBlur: boolean;
  enableAntialiasing: boolean;
  previewQuality: 'low' | 'medium' | 'high';
}

export interface AnimationTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  thumbnail: string;
  duration: number;
  layers: Partial<VideoLayer>[];
  previewVideo?: string;
}

export type TemplateCategory = 
  | 'text-animations'
  | 'logo-reveals' 
  | 'transitions'
  | 'lower-thirds'
  | 'call-to-action'
  | 'social-media'
  | 'presentations'
  | 'marketing';

export interface ExportOptions {
  format: 'mp4' | 'webm' | 'gif' | 'png-sequence';
  quality: 'low' | 'medium' | 'high' | 'ultra';
  resolution?: {
    width: number;
    height: number;
  };
  fps?: number;
  bitrate?: number;
  startTime?: number;
  endTime?: number;
  includeAudio: boolean;
  watermark?: {
    text?: string;
    image?: string;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    opacity: number;
  };
}

export interface RenderProgress {
  progress: number; // 0-100
  currentFrame: number;
  totalFrames: number;
  estimatedTimeRemaining: number;
  status: 'preparing' | 'rendering' | 'encoding' | 'complete' | 'error';
  error?: string;
}

// Event types for the animation system
export interface AnimationEvent {
  type: 'play' | 'pause' | 'stop' | 'seek' | 'layer-change' | 'timeline-change';
  timestamp: number;
  data?: any;
}

// Utility types
export type Vector2D = {
  x: number;
  y: number;
};

export type Color = {
  r: number;
  g: number;
  b: number;
  a?: number;
};

export type BoundingBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

// Plugin system types
export interface AnimationPlugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  effects?: Effect[];
  templates?: AnimationTemplate[];
  exporters?: ExportOptions[];
}

// Performance monitoring
export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  renderTime: number;
  layerCount: number;
  effectCount: number;
}
