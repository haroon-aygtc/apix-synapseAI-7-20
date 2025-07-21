/**
 * Motion Graphics System
 * Handles creation and management of animated graphics, text, and interactive elements
 */

import { VideoLayer, LayerData, Animation, Keyframe, Vector2D, Color } from './types';

export class MotionGraphicsSystem {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private imageCache: Map<string, HTMLImageElement> = new Map();
  private fontCache: Map<string, boolean> = new Map();

  constructor(canvas?: HTMLCanvasElement) {
    if (canvas) {
      this.setCanvas(canvas);
    }
  }

  /**
   * Set the canvas for rendering
   */
  setCanvas(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  /**
   * Create a text layer with animation
   */
  createTextLayer(options: {
    text: string;
    fontSize: number;
    fontFamily: string;
    color: string;
    position: Vector2D;
    animation?: 'fadeIn' | 'slideIn' | 'typewriter' | 'bounce' | 'glow';
    duration?: number;
    delay?: number;
  }): VideoLayer {
    const layer: VideoLayer = {
      id: this.generateId(),
      name: `Text: ${options.text.substring(0, 20)}...`,
      type: 'text',
      visible: true,
      locked: false,
      opacity: 1,
      blendMode: 'normal',
      startTime: options.delay || 0,
      endTime: (options.delay || 0) + (options.duration || 3),
      zIndex: 1,
      transform: {
        x: options.position.x,
        y: options.position.y,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        skewX: 0,
        skewY: 0,
        anchorX: 0.5,
        anchorY: 0.5,
      },
      animations: [],
      effects: [],
      data: {
        text: {
          content: options.text,
          fontSize: options.fontSize,
          fontFamily: options.fontFamily,
          fontWeight: 'normal',
          color: options.color,
          textAlign: 'center',
          lineHeight: 1.2,
          letterSpacing: 0,
        }
      }
    };

    // Add animation based on type
    if (options.animation) {
      layer.animations.push(this.createTextAnimation(options.animation, options.duration || 3));
    }

    return layer;
  }

  /**
   * Create a shape layer with animation
   */
  createShapeLayer(options: {
    type: 'rectangle' | 'circle' | 'polygon';
    size: Vector2D;
    position: Vector2D;
    fill: string;
    stroke?: string;
    strokeWidth?: number;
    animation?: 'scaleIn' | 'rotateIn' | 'morphIn' | 'drawOn';
    duration?: number;
    delay?: number;
  }): VideoLayer {
    const layer: VideoLayer = {
      id: this.generateId(),
      name: `Shape: ${options.type}`,
      type: 'shape',
      visible: true,
      locked: false,
      opacity: 1,
      blendMode: 'normal',
      startTime: options.delay || 0,
      endTime: (options.delay || 0) + (options.duration || 2),
      zIndex: 0,
      transform: {
        x: options.position.x,
        y: options.position.y,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        skewX: 0,
        skewY: 0,
        anchorX: 0.5,
        anchorY: 0.5,
      },
      animations: [],
      effects: [],
      data: {
        shape: {
          type: options.type,
          fill: options.fill,
          stroke: options.stroke || 'transparent',
          strokeWidth: options.strokeWidth || 0,
        }
      }
    };

    // Add animation based on type
    if (options.animation) {
      layer.animations.push(this.createShapeAnimation(options.animation, options.duration || 2));
    }

    return layer;
  }

  /**
   * Create particle system layer
   */
  createParticleLayer(options: {
    count: number;
    position: Vector2D;
    type: 'circle' | 'square' | 'triangle' | 'star';
    size: { min: number; max: number };
    colors: string[];
    animation?: 'explosion' | 'fountain' | 'spiral' | 'rain';
    duration?: number;
    delay?: number;
  }): VideoLayer {
    const layer: VideoLayer = {
      id: this.generateId(),
      name: `Particles: ${options.type}`,
      type: 'particle',
      visible: true,
      locked: false,
      opacity: 1,
      blendMode: 'normal',
      startTime: options.delay || 0,
      endTime: (options.delay || 0) + (options.duration || 5),
      zIndex: 2,
      transform: {
        x: options.position.x,
        y: options.position.y,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        skewX: 0,
        skewY: 0,
        anchorX: 0.5,
        anchorY: 0.5,
      },
      animations: [],
      effects: [],
      data: {
        particles: {
          count: options.count,
          type: options.type,
          size: options.size,
          speed: { min: 50, max: 200 },
          color: options.colors,
          gravity: 0.5,
          wind: 0,
        }
      }
    };

    // Add particle animation
    if (options.animation) {
      layer.animations.push(this.createParticleAnimation(options.animation, options.duration || 5));
    }

    return layer;
  }

  /**
   * Create text animation
   */
  private createTextAnimation(type: string, duration: number): Animation {
    const baseAnimation: Omit<Animation, 'keyframes'> = {
      id: this.generateId(),
      property: 'opacity',
      easing: 'ease-out',
      duration,
      delay: 0,
      iterations: 1,
      direction: 'normal',
    };

    switch (type) {
      case 'fadeIn':
        return {
          ...baseAnimation,
          property: 'opacity',
          keyframes: [
            { time: 0, value: 0 },
            { time: 1, value: 1 }
          ]
        };

      case 'slideIn':
        return {
          ...baseAnimation,
          property: 'x',
          keyframes: [
            { time: 0, value: -100 },
            { time: 1, value: 0 }
          ]
        };

      case 'bounce':
        return {
          ...baseAnimation,
          property: 'scaleY',
          easing: 'bounce',
          keyframes: [
            { time: 0, value: 0 },
            { time: 0.6, value: 1.2 },
            { time: 1, value: 1 }
          ]
        };

      case 'glow':
        return {
          ...baseAnimation,
          property: 'opacity',
          iterations: 'infinite',
          direction: 'alternate',
          keyframes: [
            { time: 0, value: 0.5 },
            { time: 1, value: 1 }
          ]
        };

      default:
        return {
          ...baseAnimation,
          keyframes: [
            { time: 0, value: 0 },
            { time: 1, value: 1 }
          ]
        };
    }
  }

  /**
   * Create shape animation
   */
  private createShapeAnimation(type: string, duration: number): Animation {
    const baseAnimation: Omit<Animation, 'keyframes'> = {
      id: this.generateId(),
      property: 'scaleX',
      easing: 'ease-out',
      duration,
      delay: 0,
      iterations: 1,
      direction: 'normal',
    };

    switch (type) {
      case 'scaleIn':
        return {
          ...baseAnimation,
          property: 'scaleX',
          keyframes: [
            { time: 0, value: 0 },
            { time: 1, value: 1 }
          ]
        };

      case 'rotateIn':
        return {
          ...baseAnimation,
          property: 'rotation',
          keyframes: [
            { time: 0, value: -180 },
            { time: 1, value: 0 }
          ]
        };

      case 'morphIn':
        return {
          ...baseAnimation,
          property: 'scaleY',
          easing: 'spring',
          keyframes: [
            { time: 0, value: 0 },
            { time: 0.7, value: 1.3 },
            { time: 1, value: 1 }
          ]
        };

      default:
        return {
          ...baseAnimation,
          keyframes: [
            { time: 0, value: 0 },
            { time: 1, value: 1 }
          ]
        };
    }
  }

  /**
   * Create particle animation
   */
  private createParticleAnimation(type: string, duration: number): Animation {
    const baseAnimation: Omit<Animation, 'keyframes'> = {
      id: this.generateId(),
      property: 'opacity',
      easing: 'linear',
      duration,
      delay: 0,
      iterations: 1,
      direction: 'normal',
    };

    switch (type) {
      case 'explosion':
        return {
          ...baseAnimation,
          property: 'scaleX',
          keyframes: [
            { time: 0, value: 0 },
            { time: 0.1, value: 2 },
            { time: 1, value: 0.5 }
          ]
        };

      case 'fountain':
        return {
          ...baseAnimation,
          property: 'y',
          keyframes: [
            { time: 0, value: 0 },
            { time: 0.5, value: -200 },
            { time: 1, value: 200 }
          ]
        };

      case 'spiral':
        return {
          ...baseAnimation,
          property: 'rotation',
          keyframes: [
            { time: 0, value: 0 },
            { time: 1, value: 720 }
          ]
        };

      default:
        return {
          ...baseAnimation,
          keyframes: [
            { time: 0, value: 1 },
            { time: 1, value: 0 }
          ]
        };
    }
  }

  /**
   * Create animated logo reveal
   */
  createLogoReveal(options: {
    imageSrc: string;
    position: Vector2D;
    size: Vector2D;
    animation: 'slideUp' | 'fadeScale' | 'drawMask' | 'particles';
    duration?: number;
    delay?: number;
  }): VideoLayer[] {
    const layers: VideoLayer[] = [];

    // Main logo layer
    const logoLayer: VideoLayer = {
      id: this.generateId(),
      name: 'Logo',
      type: 'image',
      visible: true,
      locked: false,
      opacity: 1,
      blendMode: 'normal',
      startTime: options.delay || 0,
      endTime: (options.delay || 0) + (options.duration || 3),
      zIndex: 1,
      transform: {
        x: options.position.x,
        y: options.position.y,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        skewX: 0,
        skewY: 0,
        anchorX: 0.5,
        anchorY: 0.5,
      },
      animations: [],
      effects: [],
      data: {
        image: {
          src: options.imageSrc,
          fit: 'contain'
        }
      }
    };

    // Add animation based on type
    switch (options.animation) {
      case 'slideUp':
        logoLayer.animations.push({
          id: this.generateId(),
          property: 'y',
          easing: 'ease-out',
          duration: options.duration || 3,
          delay: 0,
          iterations: 1,
          direction: 'normal',
          keyframes: [
            { time: 0, value: 100 },
            { time: 1, value: 0 }
          ]
        });
        break;

      case 'fadeScale':
        logoLayer.animations.push(
          {
            id: this.generateId(),
            property: 'opacity',
            easing: 'ease-out',
            duration: options.duration || 3,
            delay: 0,
            iterations: 1,
            direction: 'normal',
            keyframes: [
              { time: 0, value: 0 },
              { time: 1, value: 1 }
            ]
          },
          {
            id: this.generateId(),
            property: 'scaleX',
            easing: 'spring',
            duration: options.duration || 3,
            delay: 0,
            iterations: 1,
            direction: 'normal',
            keyframes: [
              { time: 0, value: 0.5 },
              { time: 1, value: 1 }
            ]
          }
        );
        break;

      case 'particles':
        // Add particle effect
        const particleLayer = this.createParticleLayer({
          count: 50,
          position: options.position,
          type: 'star',
          size: { min: 2, max: 8 },
          colors: ['#FFD700', '#FFA500', '#FF6347'],
          animation: 'explosion',
          duration: 2,
          delay: (options.delay || 0) + 1
        });
        layers.push(particleLayer);
        break;
    }

    layers.unshift(logoLayer);
    return layers;
  }

  /**
   * Create lower third graphics
   */
  createLowerThird(options: {
    title: string;
    subtitle?: string;
    position?: Vector2D;
    colors?: { background: string; text: string; accent: string };
    animation?: 'slideIn' | 'wipeIn' | 'fadeIn';
    duration?: number;
    delay?: number;
  }): VideoLayer[] {
    const layers: VideoLayer[] = [];
    const colors = options.colors || {
      background: '#1a1a1a',
      text: '#ffffff',
      accent: '#0066cc'
    };

    // Background bar
    const backgroundLayer = this.createShapeLayer({
      type: 'rectangle',
      size: { x: 400, y: 80 },
      position: options.position || { x: 50, y: -100 },
      fill: colors.background,
      animation: options.animation === 'slideIn' ? 'scaleIn' : undefined,
      duration: options.duration || 2,
      delay: options.delay || 0
    });

    // Accent bar
    const accentLayer = this.createShapeLayer({
      type: 'rectangle',
      size: { x: 8, y: 80 },
      position: { x: (options.position?.x || 50) - 196, y: (options.position?.y || -100) },
      fill: colors.accent,
      animation: options.animation === 'wipeIn' ? 'scaleIn' : undefined,
      duration: options.duration || 2,
      delay: (options.delay || 0) + 0.2
    });

    // Title text
    const titleLayer = this.createTextLayer({
      text: options.title,
      fontSize: 24,
      fontFamily: 'Arial, sans-serif',
      color: colors.text,
      position: { x: (options.position?.x || 50) + 20, y: (options.position?.y || -100) - 10 },
      animation: options.animation === 'fadeIn' ? 'fadeIn' : 'slideIn',
      duration: options.duration || 2,
      delay: (options.delay || 0) + 0.5
    });

    // Subtitle text (if provided)
    if (options.subtitle) {
      const subtitleLayer = this.createTextLayer({
        text: options.subtitle,
        fontSize: 16,
        fontFamily: 'Arial, sans-serif',
        color: colors.text,
        position: { x: (options.position?.x || 50) + 20, y: (options.position?.y || -100) + 15 },
        animation: options.animation === 'fadeIn' ? 'fadeIn' : 'slideIn',
        duration: options.duration || 2,
        delay: (options.delay || 0) + 0.7
      });
      layers.push(subtitleLayer);
    }

    layers.push(backgroundLayer, accentLayer, titleLayer);
    return layers;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `layer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Preload image
   */
  async preloadImage(src: string): Promise<HTMLImageElement> {
    if (this.imageCache.has(src)) {
      return this.imageCache.get(src)!;
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.imageCache.set(src, img);
        resolve(img);
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  /**
   * Load font
   */
  async loadFont(fontFamily: string, fontUrl?: string): Promise<void> {
    if (this.fontCache.has(fontFamily)) {
      return;
    }

    if (fontUrl) {
      const font = new FontFace(fontFamily, `url(${fontUrl})`);
      await font.load();
      document.fonts.add(font);
    }

    this.fontCache.set(fontFamily, true);
  }
}

// Export singleton instance
export const motionGraphics = new MotionGraphicsSystem();
