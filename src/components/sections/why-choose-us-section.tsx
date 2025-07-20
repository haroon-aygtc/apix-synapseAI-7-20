"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { VideoPlayer } from "@/components/ui/video-player";
import { VideoBackground } from "@/components/ui/video-background";
import { CheckCircle, ChevronRight, Play, Zap, Shield, Users, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export interface WhyChooseUsSectionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  videoSrc?: string | string[];
  videoPoster?: string;
  showVideoPlayer?: boolean;
  backgroundVideo?: boolean;
  features?: Array<{
    title: string;
    description: string;
    icon?: React.ReactNode;
  }>;
  onButtonClick?: () => void;
  className?: string;
}

export function WhyChooseUsSection({
  title = "Why Choose SynapseAI",
  description = "We deliver exceptional value through our cutting-edge AI platform designed specifically for enterprise needs.",
  buttonText = "Learn More",
  videoSrc = [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "/why-choose-us-video.mp4"
  ],
  videoPoster = "/why-choose-us-poster.jpg",
  showVideoPlayer = true,
  backgroundVideo = false,
  features = [
    {
      title: "Unmatched Performance",
      description: "Our AI agents deliver 99.9% accuracy and process requests 10x faster than competitors.",
      icon: <Zap className="h-5 w-5 text-primary" />
    },
    {
      title: "Enterprise Security",
      description: "Bank-grade security with SOC 2 compliance and end-to-end encryption for all your data.",
      icon: <Shield className="h-5 w-5 text-primary" />
    },
    {
      title: "Dedicated Support",
      description: "24/7 expert support with dedicated customer success managers for enterprise clients.",
      icon: <Users className="h-5 w-5 text-primary" />
    },
    {
      title: "Scalable Infrastructure",
      description: "Built to handle millions of operations per second with 99.99% uptime guarantee.",
      icon: <TrendingUp className="h-5 w-5 text-primary" />
    }
  ],
  onButtonClick,
  className,
}: WhyChooseUsSectionProps) {
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
        <p className="text-muted-foreground">Platform Benefits</p>
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
          <div className="absolute inset-0 bg-black/60" />
          
          <div className="container px-4 md:px-6 relative z-20">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ duration: 0.5 }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white mb-4">
                  {title}
                </h2>
                <p className="text-xl text-white/90 max-w-3xl mx-auto">
                  {description}
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {features.map((feature, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <div className="mr-4 mt-1 p-2 rounded-lg bg-white/20">
                      {feature.icon || <CheckCircle className="h-5 w-5 text-white" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-white/80">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="text-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Button 
                  size="lg" 
                  className="group bg-white text-black hover:bg-white/90"
                  onClick={onButtonClick}
                >
                  {buttonText}
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </div>
          </div>
        </VideoBackground>
      </section>
    );
  }

  return (
    <section className={`py-20 md:py-32 bg-muted/30 ${className || ""}`}>
      <div className="container px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.5 }}
            className="relative rounded-xl border bg-card shadow-xl overflow-hidden"
          >
            {showVideoPlayer ? (
              <VideoPlayer
                src={Array.isArray(videoSrc) ? videoSrc[0] : videoSrc}
                poster={videoPoster}
                className="aspect-video"
                autoPlay={false}
                muted={true}
                loop={true}
                onPlay={handleVideoPlay}
                onPause={handleVideoPause}
                fallbackContent={fallbackContent}
              />
            ) : (
              <div className="aspect-video">
                <img
                  src="/why-choose-us.png"
                  alt="Platform Benefits"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://placehold.co/600x400/2563eb/ffffff?text=Why+Choose+SynapseAI";
                  }}
                />
              </div>
            )}
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col space-y-8"
          >
            <div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                {title}
              </h2>
              <p className="mt-4 text-muted-foreground">
                {description}
              </p>
            </div>

            <div className="space-y-6">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  className="flex items-start"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                >
                  <div className="mr-4 mt-1">
                    {feature.icon || <CheckCircle className="h-5 w-5 text-primary" />}
                  </div>
                  <div>
                    <h3 className="font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div>
              <Button size="lg" className="group" onClick={onButtonClick}>
                {buttonText}
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
