"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getOptimalVideoSource,
  setupVideoLazyLoading,
  getDeviceOptimizedSettings,
  VideoOptimizationOptions
} from "@/lib/video-utils";

export interface VideoBackgroundProps {
  src: string | string[];
  poster?: string;
  className?: string;
  overlayClassName?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  showControls?: boolean;
  showMuteButton?: boolean;
  showPlayButton?: boolean;
  children?: React.ReactNode;
  onPlay?: () => void;
  onPause?: () => void;
  onMute?: (muted: boolean) => void;
  fallbackContent?: React.ReactNode;
  priority?: "performance" | "quality";
  optimizationOptions?: VideoOptimizationOptions;
}

export function VideoBackground({
  src,
  poster,
  className,
  overlayClassName,
  autoPlay = true,
  muted = true,
  loop = true,
  showControls = true,
  showMuteButton = true,
  showPlayButton = false,
  children,
  onPlay,
  onPause,
  onMute,
  fallbackContent,
  priority = "performance",
  optimizationOptions = {},
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrcIndex, setCurrentSrcIndex] = useState(0);

  // Handle multiple video sources with optimization
  const videoSources = Array.isArray(src) ? src : [src];
  const deviceSettings = getDeviceOptimizedSettings();
  const optimizedSrc = getOptimalVideoSource(videoSources, {
    enableLazyLoading: priority === "performance",
    mobileOptimization: true,
    preloadStrategy: priority === "performance" ? "none" : "metadata",
    ...optimizationOptions,
  });

  // Handle play/pause
  const togglePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {
        // Handle autoplay restrictions
        setIsPlaying(false);
      });
    }
  };

  // Handle mute toggle
  const toggleMute = () => {
    if (!videoRef.current) return;

    const newMuted = !isMuted;
    setIsMuted(newMuted);
    videoRef.current.muted = newMuted;
    onMute?.(newMuted);
  };

  // Try next video source on error
  const tryNextSource = () => {
    if (Array.isArray(src) && currentSrcIndex < src.length - 1) {
      setCurrentSrcIndex(currentSrcIndex + 1);
      setHasError(false);
      setIsLoading(true);
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  };

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoading(false);
      setHasError(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      onPlay?.();
    };

    const handlePause = () => {
      setIsPlaying(false);
      onPause?.();
    };

    const handleError = () => {
      tryNextSource();
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("error", handleError);
    video.addEventListener("loadstart", handleLoadStart);

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("error", handleError);
      video.removeEventListener("loadstart", handleLoadStart);
    };
  }, [currentSrcIndex, onPlay, onPause]);

  // Handle intersection observer and lazy loading for performance
  useEffect(() => {
    if (videoRef.current) {
      let cleanup: (() => void) | undefined;

      // Setup lazy loading if enabled
      if (optimizationOptions.enableLazyLoading || priority === "performance") {
        cleanup = setupVideoLazyLoading(videoRef.current, {
          enableLazyLoading: true,
          ...optimizationOptions,
        });
      }

      // Setup intersection observer for performance
      if (priority === "performance") {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                if (autoPlay && videoRef.current) {
                  videoRef.current.play().catch(() => {
                    setIsPlaying(false);
                  });
                }
              } else {
                if (videoRef.current) {
                  videoRef.current.pause();
                }
              }
            });
          },
          { threshold: 0.1 }
        );

        observer.observe(videoRef.current);

        return () => {
          observer.disconnect();
          cleanup?.();
        };
      }

      return cleanup;
    }
  }, [autoPlay, priority, optimizationOptions]);

  // Preload optimization based on device capabilities
  const preloadValue = optimizationOptions.preloadStrategy || deviceSettings.preload;

  if (hasError && fallbackContent) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        {fallbackContent}
        {children && (
          <div className={cn("relative z-10", overlayClassName)}>
            {children}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Video element */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay={autoPlay}
        muted={isMuted}
        loop={loop}
        playsInline
        preload={preloadValue}
        poster={poster}
        aria-label="Background video"
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src={optimizedSrc} type="video/mp4" />
        {Array.isArray(src) && src.map((source, index) => (
          <source key={index} src={source} type={`video/${source.split('.').pop()}`} />
        ))}
        Your browser does not support the video tag.
      </video>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}

      {/* Error fallback */}
      {hasError && !fallbackContent && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p>Video unavailable</p>
          </div>
        </div>
      )}

      {/* Content overlay */}
      {children && (
        <div className={cn("relative z-10", overlayClassName)}>
          {children}
        </div>
      )}

      {/* Controls */}
      {showControls && !isLoading && !hasError && (
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          {showPlayButton && (
            <Button
              variant="secondary"
              size="sm"
              onClick={togglePlayPause}
              className="bg-black/50 hover:bg-black/70 text-white border-white/20"
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          )}
          
          {showMuteButton && (
            <Button
              variant="secondary"
              size="sm"
              onClick={toggleMute}
              className="bg-black/50 hover:bg-black/70 text-white border-white/20"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      )}

      {/* Accessibility: Reduced motion fallback */}
      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          video {
            animation-play-state: paused !important;
          }
        }
      `}</style>
    </div>
  );
}
