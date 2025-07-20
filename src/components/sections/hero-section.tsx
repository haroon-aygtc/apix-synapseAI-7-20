"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { VideoBackground } from "@/components/ui/video-background";
import { VideoPlayer } from "@/components/ui/video-player";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";

export interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  videoSrc?: string | string[];
  videoPoster?: string;
  showVideoPlayer?: boolean;
  backgroundVideo?: boolean;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  className?: string;
}

export function HeroSection({
  title = "Build Intelligent AI Agents for Your Business",
  subtitle = "New Features Available",
  description = "SynapseAI platform empowers you to create, deploy, and manage AI agents that transform your business operations.",
  primaryButtonText = "Get Started Free",
  secondaryButtonText = "Book a Demo",
  videoSrc = [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "/hero-video.mp4"
  ],
  videoPoster = "/hero-poster.jpg",
  showVideoPlayer = true,
  backgroundVideo = false,
  onPrimaryClick,
  onSecondaryClick,
  className,
}: HeroSectionProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
  };

  const handleVideoPause = () => {
    setIsVideoPlaying(false);
  };

  const fallbackContent = (
    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
          <Play className="h-8 w-8 text-primary" />
        </div>
        <p className="text-muted-foreground">Interactive Demo</p>
      </div>
    </div>
  );

  if (backgroundVideo) {
    return (
      <section className={`relative py-20 md:py-32 overflow-hidden ${className || ""}`}>
        <VideoBackground
          src={videoSrc}
          poster={videoPoster}
          className="absolute inset-0"
          overlayClassName="relative z-10"
          autoPlay={true}
          muted={true}
          loop={true}
          showControls={true}
          showMuteButton={true}
          showPlayButton={false}
          fallbackContent={fallbackContent}
          onPlay={handleVideoPlay}
          onPause={handleVideoPause}
        >
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40" />
          
          <div className="container px-4 md:px-6 relative z-20">
            <div className="max-w-4xl mx-auto text-center text-white">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="inline-block rounded-lg bg-white/10 backdrop-blur-sm px-3 py-1 text-sm mb-6">
                  <span className="font-medium">{subtitle}</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
                  {title}
                </h1>
                
                <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                  {description}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                  <Button 
                    size="lg" 
                    className="group bg-white text-black hover:bg-white/90"
                    onClick={onPrimaryClick}
                  >
                    {primaryButtonText}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-white/30 text-white hover:bg-white/10"
                    onClick={onSecondaryClick}
                  >
                    {secondaryButtonText}
                  </Button>
                </div>
                
                <div className="flex items-center justify-center gap-4 pt-8">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-8 w-8 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm overflow-hidden"
                      >
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`}
                          alt={`User ${i}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-white/80">
                    <span className="font-medium">500+</span> companies already onboard
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </VideoBackground>
      </section>
    );
  }

  return (
    <section className={`py-20 md:py-32 bg-gradient-to-b from-background to-muted/30 ${className || ""}`}>
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <motion.div
            className="flex flex-col justify-center space-y-4"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm mb-6 w-fit">
              <span className="font-medium">{subtitle}</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
              {title}
            </h1>
            
            <p className="text-muted-foreground md:text-xl">
              {description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button size="lg" className="group" onClick={onPrimaryClick}>
                {primaryButtonText}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg" onClick={onSecondaryClick}>
                {secondaryButtonText}
              </Button>
            </div>
            
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full border-2 border-background bg-muted overflow-hidden"
                  >
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`}
                      alt={`User ${i}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">500+</span> companies already onboard
              </div>
            </div>
          </motion.div>
          
          <motion.div
            className="relative mx-auto w-full max-w-[500px] aspect-video"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-primary-foreground/20 blur-3xl opacity-20" />
            <div className="relative rounded-xl border bg-card p-1 shadow-xl">
              {showVideoPlayer ? (
                <VideoPlayer
                  src={Array.isArray(videoSrc) ? videoSrc[0] : videoSrc}
                  poster={videoPoster}
                  className="rounded-lg aspect-video"
                  autoPlay={false}
                  muted={true}
                  loop={true}
                  onPlay={handleVideoPlay}
                  onPause={handleVideoPause}
                  fallbackContent={fallbackContent}
                />
              ) : (
                <div className="rounded-lg bg-muted aspect-video overflow-hidden">
                  <img
                    src="/dashboard-preview.png"
                    alt="Platform Dashboard"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/600x400/2563eb/ffffff?text=SynapseAI+Dashboard";
                    }}
                  />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
