/**
 * Animated Video Templates
 * Pre-designed templates for different use cases
 */

import { VideoProject, AnimationTemplate, TemplateCategory } from './types';
import { motionGraphics } from './motion-graphics';
import { videoEffects } from './video-effects';

export class VideoTemplateSystem {
  private templates: AnimationTemplate[] = [];

  constructor() {
    this.initializeTemplates();
  }

  /**
   * Get all available templates
   */
  getTemplates(): AnimationTemplate[] {
    return this.templates;
  }

  /**
   * Get templates by category
   */
  getTemplatesByCategory(category: TemplateCategory): AnimationTemplate[] {
    return this.templates.filter(template => template.category === category);
  }

  /**
   * Get template by ID
   */
  getTemplate(id: string): AnimationTemplate | null {
    return this.templates.find(template => template.id === id) || null;
  }

  /**
   * Create project from template
   */
  createProjectFromTemplate(
    templateId: string,
    options: {
      name: string;
      videoSrc: string;
      duration: number;
      resolution?: { width: number; height: number };
      customizations?: Record<string, any>;
    }
  ): VideoProject | null {
    const template = this.getTemplate(templateId);
    if (!template) return null;

    const project: VideoProject = {
      id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: options.name,
      description: `Created from template: ${template.name}`,
      duration: options.duration,
      fps: 30,
      resolution: options.resolution || { width: 1920, height: 1080 },
      videoSrc: options.videoSrc,
      layers: [],
      timeline: {
        currentTime: 0,
        playbackRate: 1,
        isPlaying: false,
        loop: false,
        markers: [],
        zoom: 1,
        viewStart: 0,
        viewEnd: options.duration,
      },
      settings: {
        backgroundColor: '#000000',
        quality: 'high',
        exportFormat: 'mp4',
        compression: 80,
        enableMotionBlur: true,
        enableAntialiasing: true,
        previewQuality: 'medium',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Apply template layers with customizations
    template.layers.forEach((templateLayer, index) => {
      const layer = this.createLayerFromTemplate(templateLayer, options.customizations);
      if (layer) {
        layer.zIndex = index;
        project.layers.push(layer);
      }
    });

    return project;
  }

  /**
   * Create layer from template
   */
  private createLayerFromTemplate(templateLayer: any, customizations?: Record<string, any>): any {
    // Apply customizations to template layer
    const customized = { ...templateLayer };
    
    if (customizations) {
      // Apply text customizations
      if (customized.data?.text && customizations.text) {
        Object.assign(customized.data.text, customizations.text);
      }
      
      // Apply color customizations
      if (customizations.colors) {
        if (customized.data?.text?.color) {
          customized.data.text.color = customizations.colors.primary || customized.data.text.color;
        }
        if (customized.data?.shape?.fill) {
          customized.data.shape.fill = customizations.colors.secondary || customized.data.shape.fill;
        }
      }
    }

    return {
      id: `layer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      visible: true,
      locked: false,
      opacity: 1,
      blendMode: 'normal',
      animations: customized.animations || [],
      effects: customized.effects || [],
      ...customized,
    };
  }

  /**
   * Initialize built-in templates
   */
  private initializeTemplates(): void {
    this.templates = [
      // Marketing Templates
      {
        id: 'marketing-product-reveal',
        name: 'Product Reveal',
        description: 'Elegant product showcase with animated text and effects',
        category: 'marketing',
        thumbnail: '/templates/product-reveal.jpg',
        duration: 10,
        layers: [
          {
            name: 'Background Overlay',
            type: 'shape',
            startTime: 0,
            endTime: 10,
            transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0, skewX: 0, skewY: 0, anchorX: 0.5, anchorY: 0.5 },
            data: {
              shape: {
                type: 'rectangle',
                fill: 'rgba(0, 0, 0, 0.3)',
                stroke: 'transparent',
                strokeWidth: 0,
              }
            },
            animations: [
              {
                id: 'opacity-animation',
                property: 'opacity',
                keyframes: [
                  { time: 0, value: 0 },
                  { time: 0.2, value: 0.7 },
                  { time: 0.8, value: 0.7 },
                  { time: 1, value: 0 }
                ],
                easing: 'ease-in-out',
                duration: 10,
                delay: 0,
                iterations: 1,
                direction: 'normal'
              }
            ]
          },
          {
            name: 'Main Title',
            type: 'text',
            startTime: 1,
            endTime: 8,
            transform: { x: 0, y: -50, scaleX: 1, scaleY: 1, rotation: 0, skewX: 0, skewY: 0, anchorX: 0.5, anchorY: 0.5 },
            data: {
              text: {
                content: 'Introducing Our Latest Product',
                fontSize: 48,
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',
                color: '#ffffff',
                textAlign: 'center',
                lineHeight: 1.2,
                letterSpacing: 2,
              }
            },
            animations: [
              {
                id: 'y-animation',
                property: 'y',
                keyframes: [
                  { time: 0, value: -100 },
                  { time: 1, value: -50 }
                ],
                easing: 'ease-out',
                duration: 1.5,
                delay: 0,
                iterations: 1,
                direction: 'normal'
              },
              {
                id: 'opacity-animation',
                property: 'opacity',
                keyframes: [
                  { time: 0, value: 0 },
                  { time: 1, value: 1 }
                ],
                easing: 'ease-out',
                duration: 1.5,
                delay: 0,
                iterations: 1,
                direction: 'normal'
              }
            ]
          },
          {
            name: 'Subtitle',
            type: 'text',
            startTime: 2.5,
            endTime: 8,
            transform: { x: 0, y: 20, scaleX: 1, scaleY: 1, rotation: 0, skewX: 0, skewY: 0, anchorX: 0.5, anchorY: 0.5 },
            data: {
              text: {
                content: 'Innovation meets excellence',
                fontSize: 24,
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'normal',
                color: '#cccccc',
                textAlign: 'center',
                lineHeight: 1.2,
                letterSpacing: 1,
              }
            },
            animations: [
              {
                id: 'opacity-animation',
                property: 'opacity',
                keyframes: [
                  { time: 0, value: 0 },
                  { time: 1, value: 1 }
                ],
                easing: 'ease-out',
                duration: 1,
                delay: 0,
                iterations: 1,
                direction: 'normal'
              }
            ]
          }
        ]
      },

      // Logo Reveal Templates
      {
        id: 'logo-minimal-reveal',
        name: 'Minimal Logo Reveal',
        description: 'Clean and simple logo animation',
        category: 'logo-reveals',
        thumbnail: '/templates/minimal-logo.jpg',
        duration: 5,
        layers: [
          {
            name: 'Logo',
            type: 'image',
            startTime: 1,
            endTime: 4,
            transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0, skewX: 0, skewY: 0, anchorX: 0.5, anchorY: 0.5 },
            data: {
              image: {
                src: '/logo-placeholder.png',
                fit: 'contain'
              }
            },
            animations: [
              {
                id: 'scaleX-animation',
                property: 'scaleX',
                keyframes: [
                  { time: 0, value: 0.5 },
                  { time: 1, value: 1 }
                ],
                easing: 'spring',
                duration: 2,
                delay: 0,
                iterations: 1,
                direction: 'normal'
              },
              {
                id: 'opacity-animation',
                property: 'opacity',
                keyframes: [
                  { time: 0, value: 0 },
                  { time: 1, value: 1 }
                ],
                easing: 'ease-out',
                duration: 1.5,
                delay: 0,
                iterations: 1,
                direction: 'normal'
              }
            ]
          }
        ]
      },

      // Lower Third Templates
      {
        id: 'news-lower-third',
        name: 'News Lower Third',
        description: 'Professional news-style lower third graphics',
        category: 'lower-thirds',
        thumbnail: '/templates/news-lower-third.jpg',
        duration: 8,
        layers: [
          {
            name: 'Background Bar',
            type: 'shape',
            startTime: 0.5,
            endTime: 7,
            transform: { x: -300, y: 150, scaleX: 1, scaleY: 1, rotation: 0, skewX: 0, skewY: 0, anchorX: 0, anchorY: 0.5 },
            data: {
              shape: {
                type: 'rectangle',
                fill: '#1a1a1a',
                stroke: 'transparent',
                strokeWidth: 0,
              }
            },
            animations: [
              {
                id: 'x-animation',
                property: 'x',
                keyframes: [
                  { time: 0, value: -400 },
                  { time: 1, value: -300 }
                ],
                easing: 'ease-out',
                duration: 0.8,
                delay: 0,
                iterations: 1,
                direction: 'normal'
              }
            ]
          },
          {
            name: 'Accent Line',
            type: 'shape',
            startTime: 0.7,
            endTime: 7,
            transform: { x: -300, y: 150, scaleX: 1, scaleY: 1, rotation: 0, skewX: 0, skewY: 0, anchorX: 0, anchorY: 0.5 },
            data: {
              shape: {
                type: 'rectangle',
                fill: '#ff6b35',
                stroke: 'transparent',
                strokeWidth: 0,
              }
            },
            animations: [
              {
                id: 'scaleX-animation',
                property: 'scaleX',
                keyframes: [
                  { time: 0, value: 0 },
                  { time: 1, value: 1 }
                ],
                easing: 'ease-out',
                duration: 0.6,
                delay: 0,
                iterations: 1,
                direction: 'normal'
              }
            ]
          }
        ]
      },

      // Social Media Templates
      {
        id: 'instagram-story',
        name: 'Instagram Story',
        description: 'Trendy Instagram story template with animations',
        category: 'social-media',
        thumbnail: '/templates/instagram-story.jpg',
        duration: 6,
        layers: [
          {
            name: 'Title',
            type: 'text',
            startTime: 0.5,
            endTime: 5,
            transform: { x: 0, y: -100, scaleX: 1, scaleY: 1, rotation: 0, skewX: 0, skewY: 0, anchorX: 0.5, anchorY: 0.5 },
            data: {
              text: {
                content: 'Your Story Here',
                fontSize: 36,
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',
                color: '#ffffff',
                textAlign: 'center',
                lineHeight: 1.2,
                letterSpacing: 1,
              }
            },
            animations: [
              {
                id: 'scaleX-animation',
                property: 'scaleX',
                keyframes: [
                  { time: 0, value: 0.8 },
                  { time: 0.3, value: 1.1 },
                  { time: 1, value: 1 }
                ],
                easing: 'bounce',
                duration: 1.2,
                delay: 0,
                iterations: 1,
                direction: 'normal'
              }
            ]
          }
        ]
      },

      // Call to Action Templates
      {
        id: 'cta-button-pulse',
        name: 'Pulsing CTA Button',
        description: 'Attention-grabbing call-to-action with pulse animation',
        category: 'call-to-action',
        thumbnail: '/templates/cta-pulse.jpg',
        duration: 4,
        layers: [
          {
            name: 'CTA Button',
            type: 'shape',
            startTime: 1,
            endTime: 3.5,
            transform: { x: 0, y: 100, scaleX: 1, scaleY: 1, rotation: 0, skewX: 0, skewY: 0, anchorX: 0.5, anchorY: 0.5 },
            data: {
              shape: {
                type: 'rectangle',
                fill: '#ff4757',
                stroke: 'transparent',
                strokeWidth: 0,
                borderRadius: 25,
              }
            },
            animations: [
              {
                id: 'scaleX-animation',
                property: 'scaleX',
                keyframes: [
                  { time: 0, value: 1 },
                  { time: 0.5, value: 1.1 },
                  { time: 1, value: 1 }
                ],
                easing: 'ease-in-out',
                duration: 1,
                delay: 0,
                iterations: 'infinite',
                direction: 'normal'
              }
            ]
          },
          {
            name: 'CTA Text',
            type: 'text',
            startTime: 1.2,
            endTime: 3.5,
            transform: { x: 0, y: 100, scaleX: 1, scaleY: 1, rotation: 0, skewX: 0, skewY: 0, anchorX: 0.5, anchorY: 0.5 },
            data: {
              text: {
                content: 'CLICK NOW',
                fontSize: 20,
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',
                color: '#ffffff',
                textAlign: 'center',
                lineHeight: 1,
                letterSpacing: 2,
              }
            },
            animations: [
              {
                id: 'opacity-animation',
                property: 'opacity',
                keyframes: [
                  { time: 0, value: 0 },
                  { time: 1, value: 1 }
                ],
                easing: 'ease-out',
                duration: 0.5,
                delay: 0,
                iterations: 1,
                direction: 'normal'
              }
            ]
          }
        ]
      }
    ];
  }

  /**
   * Search templates
   */
  searchTemplates(query: string): AnimationTemplate[] {
    const lowercaseQuery = query.toLowerCase();
    return this.templates.filter(template =>
      template.name.toLowerCase().includes(lowercaseQuery) ||
      template.description.toLowerCase().includes(lowercaseQuery) ||
      template.category.toLowerCase().includes(lowercaseQuery)
    );
  }

  /**
   * Add custom template
   */
  addTemplate(template: AnimationTemplate): void {
    this.templates.push(template);
  }

  /**
   * Remove template
   */
  removeTemplate(id: string): boolean {
    const index = this.templates.findIndex(template => template.id === id);
    if (index !== -1) {
      this.templates.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Update template
   */
  updateTemplate(id: string, updates: Partial<AnimationTemplate>): boolean {
    const index = this.templates.findIndex(template => template.id === id);
    if (index !== -1) {
      this.templates[index] = { ...this.templates[index], ...updates };
      return true;
    }
    return false;
  }
}

// Export singleton instance
export const videoTemplates = new VideoTemplateSystem();
