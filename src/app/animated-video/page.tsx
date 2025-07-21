"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AnimatedVideoPlayer } from "@/components/animated-video/animated-video-player";
import { TimelineEditor } from "@/components/animated-video/timeline-editor";
import { TextEditorPanel } from "@/components/animated-video/text-editor-panel";
import { LayerPropertiesPanel } from "@/components/animated-video/layer-properties-panel";
import { AssetLibrary } from "@/components/animated-video/asset-library";
import { AnimationPresetsPanel } from "@/components/animated-video/animation-presets-panel";
import { OnboardingTour } from "@/components/animated-video/onboarding-tour";
import {
  Play,
  Pause,
  Square,
  Download,
  Settings,
  Layers,
  Palette,
  Sparkles,
  Video,
  ArrowLeft,
  Plus,
  Eye,
  Code,
  Wand2,
  Type,
  Image,
  Shapes,
  Zap,
  PanelLeftOpen,
  PanelRightOpen
} from "lucide-react";
import Link from "next/link";
import { VideoProject, VideoLayer, AnimationTemplate } from "@/lib/animated-video/types";
import { motionGraphics } from "@/lib/animated-video/motion-graphics";
import { videoTemplates } from "@/lib/animated-video/templates";
import { videoEffects } from "@/lib/animated-video/video-effects";

export default function AnimatedVideoShowcase() {
  const [currentProject, setCurrentProject] = useState<VideoProject | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState<VideoLayer | null>(null);
  const [showTimeline, setShowTimeline] = useState(true);
  const [showPerformance, setShowPerformance] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<string>('marketing-product-reveal');
  const [activePanel, setActivePanel] = useState<'text' | 'properties' | 'assets' | 'animations'>('text');
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Initialize demo project
  useEffect(() => {
    const demoProject = createDemoProject();
    setCurrentProject(demoProject);

    // Show onboarding for first-time users
    const hasSeenOnboarding = localStorage.getItem('synapseai-onboarding-seen');
    if (!hasSeenOnboarding) {
      setTimeout(() => setShowOnboarding(true), 1000);
    }
  }, []);

  const createDemoProject = (): VideoProject => {
    const project: VideoProject = {
      id: 'demo-project',
      name: 'Animated Video Demo',
      description: 'Showcase of animated video capabilities',
      duration: 10,
      fps: 30,
      resolution: { width: 1920, height: 1080 },
      videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      poster: 'https://placehold.co/1920x1080/2563eb/ffffff?text=Animated+Video+Demo',
      layers: [],
      timeline: {
        currentTime: 0,
        playbackRate: 1,
        isPlaying: false,
        loop: true,
        markers: [
          { id: 'intro', time: 2, label: 'Intro', color: '#ff6b35' },
          { id: 'main', time: 5, label: 'Main Content', color: '#4ecdc4' },
          { id: 'outro', time: 8, label: 'Outro', color: '#45b7d1' }
        ],
        zoom: 1,
        viewStart: 0,
        viewEnd: 10,
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

    // Add demo layers
    project.layers = [
      motionGraphics.createTextLayer({
        text: 'Welcome to SynapseAI',
        fontSize: 48,
        fontFamily: 'Arial, sans-serif',
        color: '#ffffff',
        position: { x: 0, y: -100 },
        animation: 'slideIn',
        duration: 3,
        delay: 1
      }),
      motionGraphics.createTextLayer({
        text: 'Animated Video Platform',
        fontSize: 24,
        fontFamily: 'Arial, sans-serif',
        color: '#cccccc',
        position: { x: 0, y: -50 },
        animation: 'fadeIn',
        duration: 2,
        delay: 2
      }),
      motionGraphics.createShapeLayer({
        type: 'rectangle',
        size: { x: 300, y: 60 },
        position: { x: 0, y: 50 },
        fill: '#ff6b35',
        animation: 'scaleIn',
        duration: 1.5,
        delay: 3.5
      }),
      motionGraphics.createTextLayer({
        text: 'Get Started',
        fontSize: 20,
        fontFamily: 'Arial, sans-serif',
        color: '#ffffff',
        position: { x: 0, y: 50 },
        animation: 'fadeIn',
        duration: 1,
        delay: 4
      }),
      motionGraphics.createParticleLayer({
        count: 30,
        position: { x: 0, y: 0 },
        type: 'star',
        size: { min: 2, max: 8 },
        colors: ['#FFD700', '#FFA500', '#FF6347'],
        animation: 'explosion',
        duration: 3,
        delay: 5
      })
    ];

    return project;
  };

  const handleTemplateSelect = (templateId: string) => {
    setActiveTemplate(templateId);
    const template = videoTemplates.getTemplate(templateId);
    if (template) {
      const project = videoTemplates.createProjectFromTemplate(templateId, {
        name: `Demo: ${template.name}`,
        videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        duration: template.duration,
        customizations: {
          text: {
            content: 'Your Custom Text Here'
          },
          colors: {
            primary: '#ff6b35',
            secondary: '#4ecdc4'
          }
        }
      });
      if (project) {
        setCurrentProject(project);
      }
    }
  };

  const handleLayerUpdate = (layer: VideoLayer) => {
    if (!currentProject) return;
    
    const updatedProject = {
      ...currentProject,
      layers: currentProject.layers.map(l => l.id === layer.id ? layer : l)
    };
    setCurrentProject(updatedProject);
  };

  const handleLayerDelete = (layerId: string) => {
    if (!currentProject) return;
    
    const updatedProject = {
      ...currentProject,
      layers: currentProject.layers.filter(l => l.id !== layerId)
    };
    setCurrentProject(updatedProject);
  };

  const handleLayerDuplicate = (layer: VideoLayer) => {
    if (!currentProject) return;
    
    const duplicatedLayer = {
      ...layer,
      id: `layer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: `${layer.name} Copy`,
      startTime: layer.endTime,
      endTime: layer.endTime + (layer.endTime - layer.startTime)
    };
    
    const updatedProject = {
      ...currentProject,
      layers: [...currentProject.layers, duplicatedLayer]
    };
    setCurrentProject(updatedProject);
  };

  const addTextLayer = () => {
    if (!currentProject) return;
    
    const textLayer = motionGraphics.createTextLayer({
      text: 'New Text Layer',
      fontSize: 32,
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      position: { x: 0, y: 0 },
      animation: 'fadeIn',
      duration: 3,
      delay: currentTime
    });
    
    const updatedProject = {
      ...currentProject,
      layers: [...currentProject.layers, textLayer]
    };
    setCurrentProject(updatedProject);
  };

  const addShapeLayer = () => {
    if (!currentProject) return;

    const shapeLayer = motionGraphics.createShapeLayer({
      type: 'circle',
      size: { x: 100, y: 100 },
      position: { x: 0, y: 0 },
      fill: '#4ecdc4',
      animation: 'scaleIn',
      duration: 2,
      delay: currentTime
    });

    const updatedProject = {
      ...currentProject,
      layers: [...currentProject.layers, shapeLayer]
    };
    setCurrentProject(updatedProject);
  };

  const handleAddLayer = (layer: VideoLayer) => {
    if (!currentProject) return;

    const updatedProject = {
      ...currentProject,
      layers: [...currentProject.layers, layer]
    };
    setCurrentProject(updatedProject);
    setSelectedLayer(layer);
  };

  const handleApplyAnimation = (layer: VideoLayer, animation: any) => {
    const updatedLayer = {
      ...layer,
      animations: [animation]
    };
    handleLayerUpdate(updatedLayer);
  };

  const handlePreviewAnimation = (animation: any) => {
    console.log('Preview animation:', animation);
    // Animation preview logic would go here
  };

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">Animated Video Studio</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLeftPanel(!showLeftPanel)}
              >
                <PanelLeftOpen className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRightPanel(!showRightPanel)}
              >
                <PanelRightOpen className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowOnboarding(true)}
            >
              Help & Tour
            </Button>
            <Badge variant="outline" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
              <Wand2 className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Panel */}
        {showLeftPanel && (
          <div className="w-80 border-r bg-background flex flex-col">
            {/* Panel Tabs */}
            <div className="border-b p-2">
              <div className="grid grid-cols-4 gap-1">
                <Button
                  variant={activePanel === 'text' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActivePanel('text')}
                  className="flex flex-col items-center gap-1 h-auto py-2"
                >
                  <Type className="h-4 w-4" />
                  <span className="text-xs">Text</span>
                </Button>
                <Button
                  variant={activePanel === 'properties' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActivePanel('properties')}
                  className="flex flex-col items-center gap-1 h-auto py-2"
                >
                  <Settings className="h-4 w-4" />
                  <span className="text-xs">Props</span>
                </Button>
                <Button
                  variant={activePanel === 'assets' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActivePanel('assets')}
                  className="flex flex-col items-center gap-1 h-auto py-2"
                >
                  <Image className="h-4 w-4" />
                  <span className="text-xs">Assets</span>
                </Button>
                <Button
                  variant={activePanel === 'animations' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActivePanel('animations')}
                  className="flex flex-col items-center gap-1 h-auto py-2"
                >
                  <Zap className="h-4 w-4" />
                  <span className="text-xs">Animate</span>
                </Button>
              </div>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-hidden">
              {activePanel === 'text' && (
                <TextEditorPanel
                  selectedLayer={selectedLayer}
                  onLayerUpdate={handleLayerUpdate}
                  onPreviewAnimation={handlePreviewAnimation}
                />
              )}
              {activePanel === 'properties' && (
                <LayerPropertiesPanel
                  selectedLayer={selectedLayer}
                  onLayerUpdate={handleLayerUpdate}
                  onLayerDelete={handleLayerDelete}
                  onLayerDuplicate={handleLayerDuplicate}
                />
              )}
              {activePanel === 'assets' && (
                <AssetLibrary
                  onAddLayer={handleAddLayer}
                />
              )}
              {activePanel === 'animations' && (
                <AnimationPresetsPanel
                  selectedLayer={selectedLayer}
                  onApplyAnimation={handleApplyAnimation}
                  onPreviewAnimation={handlePreviewAnimation}
                />
              )}
            </div>
          </div>
        )}

        {/* Center Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-6 space-y-6">
            {/* Video Player */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Video Preview
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="performance"
                        checked={showPerformance}
                        onCheckedChange={setShowPerformance}
                      />
                      <Label htmlFor="performance" className="text-sm">Performance</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="timeline"
                        checked={showTimeline}
                        onCheckedChange={setShowTimeline}
                      />
                      <Label htmlFor="timeline" className="text-sm">Timeline</Label>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <AnimatedVideoPlayer
                  project={currentProject}
                  showControls={true}
                  showTimeline={false}
                  showPerformance={showPerformance}
                  onTimeUpdate={setCurrentTime}
                  onLayerSelect={setSelectedLayer}
                />
              </CardContent>
            </Card>

            {/* Timeline */}
            {showTimeline && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    Timeline Editor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TimelineEditor
                    project={currentProject}
                    currentTime={currentTime}
                    isPlaying={isPlaying}
                    onTimeChange={setCurrentTime}
                    onLayerSelect={setSelectedLayer}
                    onLayerUpdate={handleLayerUpdate}
                    onLayerDelete={handleLayerDelete}
                    onLayerDuplicate={handleLayerDuplicate}
                    onMarkerAdd={(time) => console.log('Add marker at', time)}
                    onMarkerDelete={(id) => console.log('Delete marker', id)}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Right Panel - Quick Actions */}
        {showRightPanel && (
          <div className="w-80 border-l bg-background p-4 space-y-4">
            {/* Quick Add */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Quick Add
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={addTextLayer}
                >
                  <Type className="h-4 w-4 mr-2" />
                  Add Text
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={addShapeLayer}
                >
                  <Shapes className="h-4 w-4 mr-2" />
                  Add Shape
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    const particleLayer = motionGraphics.createParticleLayer({
                      count: 20,
                      position: { x: 0, y: 0 },
                      type: 'circle',
                      size: { min: 3, max: 10 },
                      colors: ['#ff6b35', '#4ecdc4', '#45b7d1'],
                      animation: 'fountain',
                      duration: 4,
                      delay: currentTime
                    });
                    handleAddLayer(particleLayer);
                  }}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Add Particles
                </Button>
              </CardContent>
            </Card>

            {/* Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Templates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {videoTemplates.getTemplates().slice(0, 5).map((template) => (
                    <Button
                      key={template.id}
                      variant={activeTemplate === template.id ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => handleTemplateSelect(template.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {template.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Project Info */}
            <Card>
              <CardHeader>
                <CardTitle>Project Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{currentProject.duration}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Resolution:</span>
                    <span>{currentProject.resolution.width}x{currentProject.resolution.height}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>FPS:</span>
                    <span>{currentProject.fps}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Layers:</span>
                    <span>{currentProject.layers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Time:</span>
                    <span>{currentTime.toFixed(1)}s</span>
                  </div>
                  {selectedLayer && (
                    <div className="flex justify-between">
                      <span>Selected:</span>
                      <span className="truncate">{selectedLayer.name}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Export */}
            <Card>
              <CardHeader>
                <CardTitle>Export</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full" disabled>
                  <Download className="h-4 w-4 mr-2" />
                  Export Video (Coming Soon)
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Video export functionality will be available in the full version.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Onboarding Tour */}
      <OnboardingTour
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={() => {
          localStorage.setItem('synapseai-onboarding-seen', 'true');
          setShowOnboarding(false);
        }}
      />
    </div>
  );
}
