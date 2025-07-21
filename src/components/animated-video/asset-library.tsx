"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Palette,
  Type,
  Shapes,
  Image,
  Music,
  Video,
  Search,
  Plus,
  Download,
  Heart,
  Star,
  Sparkles,
  Circle,
  Square,
  Triangle,
  Hexagon
} from "lucide-react";
import { VideoLayer } from "@/lib/animated-video/types";
import { motionGraphics } from "@/lib/animated-video/motion-graphics";

export interface AssetLibraryProps {
  onAddLayer: (layer: VideoLayer) => void;
  className?: string;
}

const COLOR_PALETTES = [
  {
    name: "Modern",
    colors: ["#ff6b35", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57"]
  },
  {
    name: "Sunset",
    colors: ["#ff9a9e", "#fecfef", "#fecfef", "#fad0c4", "#ffd1ff"]
  },
  {
    name: "Ocean",
    colors: ["#667eea", "#764ba2", "#6dd5ed", "#2193b0", "#cc2b5e"]
  },
  {
    name: "Forest",
    colors: ["#56ab2f", "#a8edea", "#fed6e3", "#d299c2", "#fef9d7"]
  },
  {
    name: "Corporate",
    colors: ["#2c3e50", "#3498db", "#e74c3c", "#f39c12", "#27ae60"]
  },
  {
    name: "Pastel",
    colors: ["#ffecd2", "#fcb69f", "#a8edea", "#fed6e3", "#d299c2"]
  }
];

const FONT_CATEGORIES = [
  {
    name: "Sans Serif",
    fonts: [
      { name: "Arial", family: "Arial, sans-serif", preview: "Aa" },
      { name: "Helvetica", family: "Helvetica, sans-serif", preview: "Aa" },
      { name: "Roboto", family: "Roboto, sans-serif", preview: "Aa" },
      { name: "Open Sans", family: "Open Sans, sans-serif", preview: "Aa" },
      { name: "Lato", family: "Lato, sans-serif", preview: "Aa" },
      { name: "Montserrat", family: "Montserrat, sans-serif", preview: "Aa" }
    ]
  },
  {
    name: "Serif",
    fonts: [
      { name: "Times New Roman", family: "Times New Roman, serif", preview: "Aa" },
      { name: "Georgia", family: "Georgia, serif", preview: "Aa" },
      { name: "Playfair Display", family: "Playfair Display, serif", preview: "Aa" },
      { name: "Merriweather", family: "Merriweather, serif", preview: "Aa" }
    ]
  },
  {
    name: "Display",
    fonts: [
      { name: "Impact", family: "Impact, sans-serif", preview: "Aa" },
      { name: "Bebas Neue", family: "Bebas Neue, cursive", preview: "Aa" },
      { name: "Oswald", family: "Oswald, sans-serif", preview: "Aa" },
      { name: "Raleway", family: "Raleway, sans-serif", preview: "Aa" }
    ]
  }
];

const SHAPE_PRESETS = [
  { name: "Circle", type: "circle", icon: Circle, color: "#4ecdc4" },
  { name: "Rectangle", type: "rectangle", icon: Square, color: "#ff6b35" },
  { name: "Triangle", type: "polygon", icon: Triangle, color: "#45b7d1" },
  { name: "Hexagon", type: "polygon", icon: Hexagon, color: "#96ceb4" }
];

const STOCK_IMAGES = [
  {
    id: "1",
    name: "Business Team",
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400",
    category: "Business",
    tags: ["team", "office", "meeting"]
  },
  {
    id: "2",
    name: "Technology",
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400",
    category: "Tech",
    tags: ["laptop", "code", "developer"]
  },
  {
    id: "3",
    name: "Nature",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    category: "Nature",
    tags: ["mountain", "landscape", "sky"]
  },
  {
    id: "4",
    name: "Abstract",
    url: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400",
    category: "Abstract",
    tags: ["colorful", "gradient", "modern"]
  }
];

const STOCK_VIDEOS = [
  {
    id: "1",
    name: "City Timelapse",
    thumbnail: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    duration: "0:30",
    category: "Urban"
  },
  {
    id: "2",
    name: "Ocean Waves",
    thumbnail: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    duration: "0:15",
    category: "Nature"
  }
];

export function AssetLibrary({ onAddLayer, className }: AssetLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPalette, setSelectedPalette] = useState<string | null>(null);

  const addTextLayer = (fontFamily: string) => {
    const textLayer = motionGraphics.createTextLayer({
      text: "Your Text Here",
      fontSize: 48,
      fontFamily,
      color: "#ffffff",
      position: { x: 0, y: 0 },
      animation: "fadeIn",
      duration: 3,
      delay: 0
    });
    onAddLayer(textLayer);
  };

  const addShapeLayer = (shapeType: "circle" | "rectangle" | "polygon", color: string) => {
    const shapeLayer = motionGraphics.createShapeLayer({
      type: shapeType,
      size: { x: 150, y: 150 },
      position: { x: 0, y: 0 },
      fill: color,
      animation: "scaleIn",
      duration: 2,
      delay: 0
    });
    onAddLayer(shapeLayer);
  };

  const addImageLayer = (imageUrl: string, imageName: string) => {
    const imageLayer: VideoLayer = {
      id: `layer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: `Image: ${imageName}`,
      type: 'image',
      visible: true,
      locked: false,
      opacity: 1,
      blendMode: 'normal',
      startTime: 0,
      endTime: 5,
      zIndex: 1,
      transform: {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        skewX: 0,
        skewY: 0,
        anchorX: 0.5,
        anchorY: 0.5,
      },
      animations: [{
        id: 'fade-in-animation',
        property: 'opacity',
        easing: 'ease-out',
        duration: 1,
        delay: 0,
        iterations: 1,
        direction: 'normal',
        keyframes: [
          { time: 0, value: 0 },
          { time: 1, value: 1 }
        ]
      }],
      effects: [],
      data: {
        image: {
          src: imageUrl,
          fit: 'contain'
        }
      }
    };
    onAddLayer(imageLayer);
  };

  return (
    <Card className={cn("w-full h-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Asset Library
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="colors" className="text-xs">
              <Palette className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="fonts" className="text-xs">
              <Type className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="shapes" className="text-xs">
              <Shapes className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="images" className="text-xs">
              <Image className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="videos" className="text-xs">
              <Video className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>

          {/* Colors Tab */}
          <TabsContent value="colors" className="p-4">
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {COLOR_PALETTES.map((palette, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{palette.name}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedPalette(palette.name)}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      {palette.colors.map((color, colorIndex) => (
                        <button
                          key={colorIndex}
                          className="w-12 h-12 rounded-lg border-2 border-border hover:border-primary transition-colors relative group"
                          style={{ backgroundColor: color }}
                          onClick={() => {
                            navigator.clipboard.writeText(color);
                          }}
                          title={color}
                        >
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Fonts Tab */}
          <TabsContent value="fonts" className="p-4">
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {FONT_CATEGORIES.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="font-medium">{category.name}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {category.fonts.map((font, fontIndex) => (
                        <Button
                          key={fontIndex}
                          variant="outline"
                          className="h-16 flex flex-col items-center justify-center"
                          onClick={() => addTextLayer(font.family)}
                        >
                          <span
                            className="text-lg font-medium"
                            style={{ fontFamily: font.family }}
                          >
                            {font.preview}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {font.name}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Shapes Tab */}
          <TabsContent value="shapes" className="p-4">
            <ScrollArea className="h-[400px]">
              <div className="grid grid-cols-2 gap-3">
                {SHAPE_PRESETS.map((shape, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center"
                    onClick={() => addShapeLayer(shape.type as any, shape.color)}
                  >
                    <shape.icon className="h-8 w-8 mb-2" style={{ color: shape.color }} />
                    <span className="text-sm">{shape.name}</span>
                  </Button>
                ))}
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-3">Custom Shapes</h4>
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Custom Shape
                </Button>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Images Tab */}
          <TabsContent value="images" className="p-4">
            <ScrollArea className="h-[400px]">
              <div className="grid grid-cols-2 gap-3">
                {STOCK_IMAGES.map((image) => (
                  <div key={image.id} className="space-y-2">
                    <div
                      className="aspect-video bg-cover bg-center rounded-lg border cursor-pointer hover:border-primary transition-colors"
                      style={{ backgroundImage: `url(${image.url})` }}
                      onClick={() => addImageLayer(image.url, image.name)}
                    />
                    <div>
                      <p className="text-sm font-medium">{image.name}</p>
                      <div className="flex gap-1 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {image.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos" className="p-4">
            <ScrollArea className="h-[400px]">
              <div className="grid grid-cols-1 gap-3">
                {STOCK_VIDEOS.map((video) => (
                  <div key={video.id} className="flex gap-3 p-3 border rounded-lg hover:border-primary transition-colors cursor-pointer">
                    <div
                      className="w-20 h-12 bg-cover bg-center rounded flex-shrink-0"
                      style={{ backgroundImage: `url(${video.thumbnail})` }}
                    />
                    <div className="flex-1">
                      <p className="font-medium">{video.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {video.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {video.duration}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Video
                </Button>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
