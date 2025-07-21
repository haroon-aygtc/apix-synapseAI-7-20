/**
 * Video Effects and Filters System
 * Implements CSS and WebGL-based video effects for enhanced visual processing
 */

import { Effect, EffectType } from './types';

export interface EffectDefinition {
  id: string;
  name: string;
  type: EffectType;
  description: string;
  parameters: EffectParameter[];
  category: 'color' | 'blur' | 'distortion' | 'artistic' | 'lighting';
  cssFilter?: (params: Record<string, any>) => string;
  webglShader?: {
    vertex: string;
    fragment: string;
  };
}

export interface EffectParameter {
  name: string;
  type: 'number' | 'color' | 'boolean' | 'select';
  min?: number;
  max?: number;
  step?: number;
  default: any;
  options?: string[];
  unit?: string;
}

export class VideoEffectsSystem {
  private canvas: HTMLCanvasElement | null = null;
  private gl: WebGLRenderingContext | null = null;
  private programs: Map<string, WebGLProgram> = new Map();
  private textures: Map<string, WebGLTexture> = new Map();

  constructor() {
    this.initializeEffects();
  }

  /**
   * Initialize WebGL context
   */
  initializeWebGL(canvas: HTMLCanvasElement): boolean {
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!this.gl) {
      console.warn('WebGL not supported, falling back to CSS filters');
      return false;
    }

    return true;
  }

  /**
   * Apply effects to a video element or canvas
   */
  applyEffects(
    target: HTMLVideoElement | HTMLCanvasElement,
    effects: Effect[]
  ): void {
    if (target instanceof HTMLVideoElement) {
      this.applyCSSEffects(target, effects);
    } else if (this.gl && target instanceof HTMLCanvasElement) {
      this.applyWebGLEffects(target, effects);
    }
  }

  /**
   * Apply CSS-based effects
   */
  private applyCSSEffects(element: HTMLElement, effects: Effect[]): void {
    const filterStrings: string[] = [];

    effects.forEach(effect => {
      if (!effect.enabled) return;

      const definition = this.getEffectDefinition(effect.type);
      if (definition?.cssFilter) {
        const filterString = definition.cssFilter(effect.parameters);
        if (filterString) {
          filterStrings.push(filterString);
        }
      }
    });

    element.style.filter = filterStrings.join(' ');
  }

  /**
   * Apply WebGL-based effects
   */
  private applyWebGLEffects(canvas: HTMLCanvasElement, effects: Effect[]): void {
    if (!this.gl) return;

    // Implementation would involve creating and applying WebGL shaders
    // This is a simplified version showing the structure
    effects.forEach(effect => {
      if (!effect.enabled) return;

      const program = this.programs.get(effect.type);
      if (program) {
        this.gl!.useProgram(program);
        this.setShaderUniforms(program, effect.parameters);
        this.renderEffect();
      }
    });
  }

  /**
   * Create WebGL shader program
   */
  private createShaderProgram(vertexSource: string, fragmentSource: string): WebGLProgram | null {
    if (!this.gl) return null;

    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentSource);

    if (!vertexShader || !fragmentShader) return null;

    const program = this.gl.createProgram();
    if (!program) return null;

    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.error('Shader program linking failed:', this.gl.getProgramInfoLog(program));
      return null;
    }

    return program;
  }

  /**
   * Create individual shader
   */
  private createShader(type: number, source: string): WebGLShader | null {
    if (!this.gl) return null;

    const shader = this.gl.createShader(type);
    if (!shader) return null;

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader compilation failed:', this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  /**
   * Set shader uniforms
   */
  private setShaderUniforms(program: WebGLProgram, parameters: Record<string, any>): void {
    if (!this.gl) return;

    Object.entries(parameters).forEach(([name, value]) => {
      const location = this.gl!.getUniformLocation(program, name);
      if (location) {
        if (typeof value === 'number') {
          this.gl!.uniform1f(location, value);
        } else if (Array.isArray(value)) {
          if (value.length === 2) {
            this.gl!.uniform2fv(location, value);
          } else if (value.length === 3) {
            this.gl!.uniform3fv(location, value);
          } else if (value.length === 4) {
            this.gl!.uniform4fv(location, value);
          }
        }
      }
    });
  }

  /**
   * Render effect
   */
  private renderEffect(): void {
    if (!this.gl) return;

    // Basic quad rendering for full-screen effects
    const vertices = new Float32Array([
      -1, -1, 0, 0,
       1, -1, 1, 0,
      -1,  1, 0, 1,
       1,  1, 1, 1,
    ]);

    const buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }

  /**
   * Get effect definition by type
   */
  private getEffectDefinition(type: EffectType): EffectDefinition | null {
    return this.effectDefinitions.find(def => def.type === type) || null;
  }

  /**
   * Initialize built-in effects
   */
  private initializeEffects(): void {
    // CSS-based effects will be initialized here
    // WebGL shaders would be compiled and stored
  }

  /**
   * Built-in effect definitions
   */
  private effectDefinitions: EffectDefinition[] = [
    {
      id: 'blur',
      name: 'Blur',
      type: 'blur',
      description: 'Apply gaussian blur to the video',
      category: 'blur',
      parameters: [
        {
          name: 'radius',
          type: 'number',
          min: 0,
          max: 20,
          step: 0.1,
          default: 0,
          unit: 'px'
        }
      ],
      cssFilter: (params) => `blur(${params.radius || 0}px)`
    },
    {
      id: 'brightness',
      name: 'Brightness',
      type: 'brightness',
      description: 'Adjust video brightness',
      category: 'color',
      parameters: [
        {
          name: 'value',
          type: 'number',
          min: 0,
          max: 2,
          step: 0.01,
          default: 1,
          unit: ''
        }
      ],
      cssFilter: (params) => `brightness(${params.value || 1})`
    },
    {
      id: 'contrast',
      name: 'Contrast',
      type: 'contrast',
      description: 'Adjust video contrast',
      category: 'color',
      parameters: [
        {
          name: 'value',
          type: 'number',
          min: 0,
          max: 2,
          step: 0.01,
          default: 1,
          unit: ''
        }
      ],
      cssFilter: (params) => `contrast(${params.value || 1})`
    },
    {
      id: 'saturate',
      name: 'Saturation',
      type: 'saturate',
      description: 'Adjust color saturation',
      category: 'color',
      parameters: [
        {
          name: 'value',
          type: 'number',
          min: 0,
          max: 2,
          step: 0.01,
          default: 1,
          unit: ''
        }
      ],
      cssFilter: (params) => `saturate(${params.value || 1})`
    },
    {
      id: 'hue-rotate',
      name: 'Hue Rotate',
      type: 'hue-rotate',
      description: 'Rotate hue values',
      category: 'color',
      parameters: [
        {
          name: 'angle',
          type: 'number',
          min: 0,
          max: 360,
          step: 1,
          default: 0,
          unit: 'deg'
        }
      ],
      cssFilter: (params) => `hue-rotate(${params.angle || 0}deg)`
    },
    {
      id: 'sepia',
      name: 'Sepia',
      type: 'sepia',
      description: 'Apply sepia tone effect',
      category: 'artistic',
      parameters: [
        {
          name: 'value',
          type: 'number',
          min: 0,
          max: 1,
          step: 0.01,
          default: 0,
          unit: ''
        }
      ],
      cssFilter: (params) => `sepia(${params.value || 0})`
    },
    {
      id: 'grayscale',
      name: 'Grayscale',
      type: 'grayscale',
      description: 'Convert to grayscale',
      category: 'artistic',
      parameters: [
        {
          name: 'value',
          type: 'number',
          min: 0,
          max: 1,
          step: 0.01,
          default: 0,
          unit: ''
        }
      ],
      cssFilter: (params) => `grayscale(${params.value || 0})`
    },
    {
      id: 'invert',
      name: 'Invert',
      type: 'invert',
      description: 'Invert colors',
      category: 'artistic',
      parameters: [
        {
          name: 'value',
          type: 'number',
          min: 0,
          max: 1,
          step: 0.01,
          default: 0,
          unit: ''
        }
      ],
      cssFilter: (params) => `invert(${params.value || 0})`
    },
    {
      id: 'drop-shadow',
      name: 'Drop Shadow',
      type: 'drop-shadow',
      description: 'Add drop shadow effect',
      category: 'lighting',
      parameters: [
        {
          name: 'offsetX',
          type: 'number',
          min: -20,
          max: 20,
          step: 1,
          default: 0,
          unit: 'px'
        },
        {
          name: 'offsetY',
          type: 'number',
          min: -20,
          max: 20,
          step: 1,
          default: 0,
          unit: 'px'
        },
        {
          name: 'blur',
          type: 'number',
          min: 0,
          max: 20,
          step: 1,
          default: 0,
          unit: 'px'
        },
        {
          name: 'color',
          type: 'color',
          default: '#000000'
        }
      ],
      cssFilter: (params) => 
        `drop-shadow(${params.offsetX || 0}px ${params.offsetY || 0}px ${params.blur || 0}px ${params.color || '#000000'})`
    }
  ];

  /**
   * Get all available effects
   */
  getAvailableEffects(): EffectDefinition[] {
    return this.effectDefinitions;
  }

  /**
   * Get effects by category
   */
  getEffectsByCategory(category: string): EffectDefinition[] {
    return this.effectDefinitions.filter(effect => effect.category === category);
  }

  /**
   * Create effect instance
   */
  createEffect(type: EffectType, parameters?: Record<string, any>): Effect {
    const definition = this.getEffectDefinition(type);
    if (!definition) {
      throw new Error(`Effect type "${type}" not found`);
    }

    const defaultParams: Record<string, any> = {};
    definition.parameters.forEach(param => {
      defaultParams[param.name] = param.default;
    });

    return {
      id: `effect_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: definition.name,
      type,
      enabled: true,
      parameters: { ...defaultParams, ...parameters }
    };
  }

  /**
   * Validate effect parameters
   */
  validateEffectParameters(effect: Effect): boolean {
    const definition = this.getEffectDefinition(effect.type);
    if (!definition) return false;

    return definition.parameters.every(param => {
      const value = effect.parameters[param.name];
      
      if (value === undefined || value === null) return false;
      
      if (param.type === 'number') {
        if (typeof value !== 'number') return false;
        if (param.min !== undefined && value < param.min) return false;
        if (param.max !== undefined && value > param.max) return false;
      }
      
      if (param.type === 'boolean' && typeof value !== 'boolean') return false;
      if (param.type === 'color' && typeof value !== 'string') return false;
      if (param.type === 'select' && param.options && !param.options.includes(value)) return false;
      
      return true;
    });
  }

  /**
   * Clone effect
   */
  cloneEffect(effect: Effect): Effect {
    return {
      ...effect,
      id: `effect_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      parameters: { ...effect.parameters }
    };
  }
}

// Export singleton instance
export const videoEffects = new VideoEffectsSystem();
