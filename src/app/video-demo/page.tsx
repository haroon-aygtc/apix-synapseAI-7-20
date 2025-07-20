"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/sections/hero-section";
import { WhyChooseUsSection } from "@/components/sections/why-choose-us-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Monitor, 
  Smartphone, 
  Tablet,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

export default function VideoDemo() {
  const [heroBackgroundVideo, setHeroBackgroundVideo] = useState(false);
  const [whyUsBackgroundVideo, setWhyUsBackgroundVideo] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(true);

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
                <span className="text-primary-foreground font-bold">S</span>
              </div>
              <span className="font-bold text-xl">Video Demo</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline">Interactive Demo</Badge>
          </div>
        </div>
      </header>

      {/* Demo Controls */}
      <section className="py-8 border-b bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Video Components Demo</h1>
            <p className="text-muted-foreground mb-8">
              Explore the enhanced hero and "Why Choose Us" sections with video capabilities.
              Toggle between different modes to see how the components adapt.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Hero Section</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="hero-video-player"
                      checked={showVideoPlayer}
                      onCheckedChange={setShowVideoPlayer}
                    />
                    <Label htmlFor="hero-video-player">Video Player</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="hero-background"
                      checked={heroBackgroundVideo}
                      onCheckedChange={setHeroBackgroundVideo}
                    />
                    <Label htmlFor="hero-background">Background Video</Label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Why Choose Us</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="why-us-video-player"
                      checked={showVideoPlayer}
                      onCheckedChange={setShowVideoPlayer}
                    />
                    <Label htmlFor="why-us-video-player">Video Player</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="why-us-background"
                      checked={whyUsBackgroundVideo}
                      onCheckedChange={setWhyUsBackgroundVideo}
                    />
                    <Label htmlFor="why-us-background">Background Video</Label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Play className="h-4 w-4 text-green-500" />
                      <span>Play/Pause Controls</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4 text-blue-500" />
                      <span>Volume Control</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4 text-purple-500" />
                      <span>Responsive Design</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-orange-500" />
                      <span>Mobile Optimized</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Sections */}
      <main>
        {/* Hero Section Demo */}
        <HeroSection
          title="Enhanced Video Hero Section"
          subtitle="Interactive Demo"
          description="Experience our advanced video capabilities with responsive design, accessibility features, and performance optimizations."
          primaryButtonText="Try It Now"
          secondaryButtonText="Learn More"
          videoSrc={[
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
          ]}
          videoPoster="https://placehold.co/800x450/2563eb/ffffff?text=Hero+Video"
          showVideoPlayer={showVideoPlayer}
          backgroundVideo={heroBackgroundVideo}
          onPrimaryClick={() => {
            console.log("Hero primary button clicked");
          }}
          onSecondaryClick={() => {
            console.log("Hero secondary button clicked");
          }}
        />

        {/* Why Choose Us Section Demo */}
        <WhyChooseUsSection
          title="Enhanced Why Choose Us Section"
          description="Discover how our video-enhanced sections provide better engagement and user experience across all devices."
          buttonText="Explore Features"
          videoSrc={[
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          ]}
          videoPoster="https://placehold.co/800x450/2563eb/ffffff?text=Why+Choose+Us"
          showVideoPlayer={showVideoPlayer}
          backgroundVideo={whyUsBackgroundVideo}
          features={[
            {
              title: "Video Performance",
              description: "Optimized video loading with format detection and adaptive streaming for all devices.",
              icon: <Play className="h-5 w-5 text-primary" />
            },
            {
              title: "Accessibility First",
              description: "Full keyboard navigation, screen reader support, and reduced motion preferences.",
              icon: <Monitor className="h-5 w-5 text-primary" />
            },
            {
              title: "Mobile Optimized",
              description: "Responsive design with touch-friendly controls and mobile-specific optimizations.",
              icon: <Smartphone className="h-5 w-5 text-primary" />
            },
            {
              title: "Smart Loading",
              description: "Lazy loading, intersection observers, and performance-based quality selection.",
              icon: <Tablet className="h-5 w-5 text-primary" />
            }
          ]}
          onButtonClick={() => {
            console.log("Why Choose Us button clicked");
          }}
        />

        {/* Technical Details */}
        <section className="py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Technical Implementation</h2>
              
              <Tabs defaultValue="features" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
                  <TabsTrigger value="responsive">Responsive</TabsTrigger>
                </TabsList>
                
                <TabsContent value="features" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Video Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li>• Custom video player with full controls</li>
                        <li>• Background video with overlay support</li>
                        <li>• Play/pause, volume, and fullscreen controls</li>
                        <li>• Progress bar with seeking capability</li>
                        <li>• Multiple video format support</li>
                        <li>• Poster image fallbacks</li>
                        <li>• Error handling and retry functionality</li>
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="performance" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Optimizations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li>• Lazy loading with intersection observers</li>
                        <li>• Adaptive quality based on connection speed</li>
                        <li>• Format detection and optimal source selection</li>
                        <li>• Mobile-specific optimizations</li>
                        <li>• Preload strategies (none, metadata, auto)</li>
                        <li>• Hardware acceleration support</li>
                        <li>• Memory usage optimization</li>
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="accessibility" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Accessibility Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li>• Full keyboard navigation support</li>
                        <li>• Screen reader compatible</li>
                        <li>• ARIA labels and roles</li>
                        <li>• High contrast mode support</li>
                        <li>• Reduced motion preferences</li>
                        <li>• Focus management</li>
                        <li>• Caption support ready</li>
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="responsive" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Responsive Design</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li>• Mobile-first responsive design</li>
                        <li>• Touch-friendly controls</li>
                        <li>• Adaptive layouts for all screen sizes</li>
                        <li>• Orientation change handling</li>
                        <li>• High DPI display support</li>
                        <li>• Ultra-wide screen optimization</li>
                        <li>• Print-friendly styles</li>
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
