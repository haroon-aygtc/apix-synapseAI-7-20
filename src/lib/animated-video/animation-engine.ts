/**
 * Animation Engine Core
 * Handles animation calculations, easing functions, and timeline management
 */

import { 
  Animation, 
  Keyframe, 
  EasingFunction, 
  AnimatableProperty,
  VideoProject,
  VideoLayer,
  TimelineData,
  PerformanceMetrics
} from './types';

export class AnimationEngine {
  private project: VideoProject | null = null;
  private animationFrame: number | null = null;
  private startTime: number = 0;
  private lastFrameTime: number = 0;
  private performanceMetrics: PerformanceMetrics = {
    fps: 0,
    frameTime: 0,
    memoryUsage: 0,
    renderTime: 0,
    layerCount: 0,
    effectCount: 0
  };
  private frameCount: number = 0;
  private fpsUpdateTime: number = 0;

  constructor() {
    this.tick = this.tick.bind(this);
  }

  /**
   * Load a video project
   */
  loadProject(project: VideoProject): void {
    this.project = project;
    this.reset();
  }

  /**
   * Start animation playback
   */
  play(): void {
    if (!this.project) return;
    
    this.project.timeline.isPlaying = true;
    this.startTime = performance.now() - (this.project.timeline.currentTime * 1000);
    this.tick();
  }

  /**
   * Pause animation playback
   */
  pause(): void {
    if (!this.project) return;
    
    this.project.timeline.isPlaying = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  /**
   * Stop animation and reset to beginning
   */
  stop(): void {
    this.pause();
    if (this.project) {
      this.project.timeline.currentTime = 0;
    }
  }

  /**
   * Seek to specific time
   */
  seek(time: number): void {
    if (!this.project) return;
    
    this.project.timeline.currentTime = Math.max(0, Math.min(time, this.project.duration));
    this.startTime = performance.now() - (this.project.timeline.currentTime * 1000);
    
    if (!this.project.timeline.isPlaying) {
      this.updateFrame();
    }
  }

  /**
   * Set playback rate
   */
  setPlaybackRate(rate: number): void {
    if (!this.project) return;
    
    this.project.timeline.playbackRate = rate;
    this.startTime = performance.now() - (this.project.timeline.currentTime * 1000 / rate);
  }

  /**
   * Main animation loop
   */
  private tick(): void {
    if (!this.project || !this.project.timeline.isPlaying) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastFrameTime;
    
    // Update performance metrics
    this.updatePerformanceMetrics(deltaTime);
    
    // Calculate current timeline position
    const elapsedTime = (currentTime - this.startTime) * this.project.timeline.playbackRate / 1000;
    this.project.timeline.currentTime = elapsedTime;

    // Check if we've reached the end
    if (this.project.timeline.currentTime >= this.project.duration) {
      if (this.project.timeline.loop) {
        this.project.timeline.currentTime = 0;
        this.startTime = currentTime;
      } else {
        this.pause();
        return;
      }
    }

    this.updateFrame();
    this.lastFrameTime = currentTime;
    this.animationFrame = requestAnimationFrame(this.tick);
  }

  /**
   * Update all layers for current frame
   */
  private updateFrame(): void {
    if (!this.project) return;

    const renderStartTime = performance.now();
    
    this.project.layers.forEach(layer => {
      if (!layer.visible || 
          this.project!.timeline.currentTime < layer.startTime || 
          this.project!.timeline.currentTime > layer.endTime) {
        return;
      }

      this.updateLayerAnimations(layer);
    });

    const renderTime = performance.now() - renderStartTime;
    this.performanceMetrics.renderTime = renderTime;
  }

  /**
   * Update animations for a specific layer
   */
  private updateLayerAnimations(layer: VideoLayer): void {
    const currentTime = this.project!.timeline.currentTime;
    const layerTime = currentTime - layer.startTime;
    const layerDuration = layer.endTime - layer.startTime;
    const progress = Math.max(0, Math.min(1, layerTime / layerDuration));

    layer.animations.forEach(animation => {
      const animationProgress = this.calculateAnimationProgress(animation, layerTime);
      if (animationProgress >= 0 && animationProgress <= 1) {
        const value = this.interpolateKeyframes(animation.keyframes, animationProgress, animation.easing);
        this.applyAnimationValue(layer, animation.property, value);
      }
    });
  }

  /**
   * Calculate animation progress considering delay and iterations
   */
  private calculateAnimationProgress(animation: Animation, layerTime: number): number {
    const startTime = animation.delay;
    const endTime = startTime + animation.duration;
    
    if (layerTime < startTime) return -1;
    if (layerTime > endTime && animation.iterations !== 'infinite') return -1;
    
    const animationTime = layerTime - startTime;
    let progress = (animationTime % animation.duration) / animation.duration;
    
    // Handle animation direction
    const iteration = Math.floor(animationTime / animation.duration);
    switch (animation.direction) {
      case 'reverse':
        progress = 1 - progress;
        break;
      case 'alternate':
        if (iteration % 2 === 1) progress = 1 - progress;
        break;
      case 'alternate-reverse':
        if (iteration % 2 === 0) progress = 1 - progress;
        break;
    }
    
    return progress;
  }

  /**
   * Interpolate between keyframes
   */
  private interpolateKeyframes(keyframes: Keyframe[], progress: number, easing: EasingFunction): any {
    if (keyframes.length === 0) return null;
    if (keyframes.length === 1) return keyframes[0].value;
    
    // Find surrounding keyframes
    let startKeyframe = keyframes[0];
    let endKeyframe = keyframes[keyframes.length - 1];
    
    for (let i = 0; i < keyframes.length - 1; i++) {
      if (progress >= keyframes[i].time && progress <= keyframes[i + 1].time) {
        startKeyframe = keyframes[i];
        endKeyframe = keyframes[i + 1];
        break;
      }
    }
    
    // Calculate local progress between keyframes
    const keyframeDuration = endKeyframe.time - startKeyframe.time;
    const localProgress = keyframeDuration === 0 ? 0 : (progress - startKeyframe.time) / keyframeDuration;
    
    // Apply easing
    const easedProgress = this.applyEasing(localProgress, endKeyframe.easing || easing);
    
    // Interpolate values
    return this.interpolateValues(startKeyframe.value, endKeyframe.value, easedProgress);
  }

  /**
   * Apply easing function to progress
   */
  private applyEasing(progress: number, easing: EasingFunction): number {
    switch (easing) {
      case 'linear':
        return progress;
      case 'ease':
        return this.cubicBezier(progress, 0.25, 0.1, 0.25, 1);
      case 'ease-in':
        return this.cubicBezier(progress, 0.42, 0, 1, 1);
      case 'ease-out':
        return this.cubicBezier(progress, 0, 0, 0.58, 1);
      case 'ease-in-out':
        return this.cubicBezier(progress, 0.42, 0, 0.58, 1);
      case 'spring':
        return this.springEasing(progress);
      case 'bounce':
        return this.bounceEasing(progress);
      default:
        return progress;
    }
  }

  /**
   * Cubic bezier easing implementation
   */
  private cubicBezier(t: number, x1: number, y1: number, x2: number, y2: number): number {
    const cx = 3 * x1;
    const bx = 3 * (x2 - x1) - cx;
    const ax = 1 - cx - bx;
    
    const cy = 3 * y1;
    const by = 3 * (y2 - y1) - cy;
    const ay = 1 - cy - by;
    
    const sampleCurveX = (t: number) => ((ax * t + bx) * t + cx) * t;
    const sampleCurveY = (t: number) => ((ay * t + by) * t + cy) * t;
    const sampleCurveDerivativeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
    
    // Newton-Raphson method
    let t2 = t;
    for (let i = 0; i < 8; i++) {
      const x2 = sampleCurveX(t2) - t;
      if (Math.abs(x2) < 1e-6) break;
      const d2 = sampleCurveDerivativeX(t2);
      if (Math.abs(d2) < 1e-6) break;
      t2 = t2 - x2 / d2;
    }
    
    return sampleCurveY(t2);
  }

  /**
   * Spring easing implementation
   */
  private springEasing(t: number): number {
    return 1 - Math.cos(t * Math.PI * 0.5);
  }

  /**
   * Bounce easing implementation
   */
  private bounceEasing(t: number): number {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    } else if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    } else {
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    }
  }

  /**
   * Interpolate between two values
   */
  private interpolateValues(start: any, end: any, progress: number): any {
    if (typeof start === 'number' && typeof end === 'number') {
      return start + (end - start) * progress;
    }
    
    if (typeof start === 'string' && typeof end === 'string') {
      // Handle color interpolation
      if (start.startsWith('#') && end.startsWith('#')) {
        return this.interpolateColor(start, end, progress);
      }
      // For other strings, just switch at 50%
      return progress < 0.5 ? start : end;
    }
    
    if (Array.isArray(start) && Array.isArray(end)) {
      return start.map((startVal, index) => 
        this.interpolateValues(startVal, end[index] || startVal, progress)
      );
    }
    
    if (typeof start === 'object' && typeof end === 'object') {
      const result: any = {};
      const keys = new Set([...Object.keys(start), ...Object.keys(end)]);
      keys.forEach(key => {
        result[key] = this.interpolateValues(start[key], end[key], progress);
      });
      return result;
    }
    
    return progress < 0.5 ? start : end;
  }

  /**
   * Interpolate between two hex colors
   */
  private interpolateColor(start: string, end: string, progress: number): string {
    const startRgb = this.hexToRgb(start);
    const endRgb = this.hexToRgb(end);
    
    if (!startRgb || !endRgb) return start;
    
    const r = Math.round(startRgb.r + (endRgb.r - startRgb.r) * progress);
    const g = Math.round(startRgb.g + (endRgb.g - startRgb.g) * progress);
    const b = Math.round(startRgb.b + (endRgb.b - startRgb.b) * progress);
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  /**
   * Convert hex color to RGB
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  /**
   * Apply animation value to layer property
   */
  private applyAnimationValue(layer: VideoLayer, property: AnimatableProperty, value: any): void {
    switch (property) {
      case 'x':
        layer.transform.x = value;
        break;
      case 'y':
        layer.transform.y = value;
        break;
      case 'scaleX':
        layer.transform.scaleX = value;
        break;
      case 'scaleY':
        layer.transform.scaleY = value;
        break;
      case 'rotation':
        layer.transform.rotation = value;
        break;
      case 'opacity':
        layer.opacity = value;
        break;
      // Add more property handlers as needed
    }
  }

  /**
   * Update performance metrics
   */
  private updatePerformanceMetrics(deltaTime: number): void {
    this.frameCount++;
    this.performanceMetrics.frameTime = deltaTime;
    
    // Update FPS every second
    if (performance.now() - this.fpsUpdateTime >= 1000) {
      this.performanceMetrics.fps = this.frameCount;
      this.frameCount = 0;
      this.fpsUpdateTime = performance.now();
      
      // Update memory usage if available
      if ('memory' in performance) {
        this.performanceMetrics.memoryUsage = (performance as any).memory.usedJSHeapSize;
      }
    }
    
    if (this.project) {
      this.performanceMetrics.layerCount = this.project.layers.length;
      this.performanceMetrics.effectCount = this.project.layers.reduce(
        (total, layer) => total + layer.effects.length, 0
      );
    }
  }

  /**
   * Reset animation state
   */
  private reset(): void {
    this.pause();
    this.frameCount = 0;
    this.fpsUpdateTime = performance.now();
  }

  /**
   * Get current performance metrics
   */
  getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.performanceMetrics };
  }

  /**
   * Get current project
   */
  getProject(): VideoProject | null {
    return this.project;
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.pause();
    this.project = null;
  }
}

// Export singleton instance
export const animationEngine = new AnimationEngine();
