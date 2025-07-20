/**
 * Video optimization and utility functions for SynapseAI
 * Handles format detection, lazy loading, compression, and mobile optimization
 */

export interface VideoSource {
  src: string;
  type: string;
  quality?: 'low' | 'medium' | 'high' | '4k';
  size?: number;
}

export interface VideoOptimizationOptions {
  enableLazyLoading?: boolean;
  preferredFormats?: string[];
  maxBitrate?: number;
  adaptiveStreaming?: boolean;
  mobileOptimization?: boolean;
  preloadStrategy?: 'none' | 'metadata' | 'auto';
}

/**
 * Detects browser support for video formats
 */
export function detectVideoSupport(): Record<string, boolean> {
  const video = document.createElement('video');
  
  return {
    mp4: video.canPlayType('video/mp4') !== '',
    webm: video.canPlayType('video/webm') !== '',
    ogg: video.canPlayType('video/ogg') !== '',
    av1: video.canPlayType('video/mp4; codecs="av01.0.08M.10"') !== '',
    hevc: video.canPlayType('video/mp4; codecs="hev1.1.6.L93.B0"') !== '',
  };
}

/**
 * Gets the optimal video source based on browser support and device capabilities
 */
export function getOptimalVideoSource(
  sources: string[] | VideoSource[],
  options: VideoOptimizationOptions = {}
): string {
  const support = detectVideoSupport();
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  const isSlowConnection = 'connection' in navigator && 
    (navigator as any).connection?.effectiveType === 'slow-2g' ||
    (navigator as any).connection?.effectiveType === '2g';

  // Convert string array to VideoSource array
  const videoSources: VideoSource[] = sources.map(source => {
    if (typeof source === 'string') {
      const extension = source.split('.').pop()?.toLowerCase() || '';
      return {
        src: source,
        type: `video/${extension}`,
        quality: source.includes('4k') ? '4k' : 
                source.includes('hd') ? 'high' : 
                source.includes('low') ? 'low' : 'medium'
      };
    }
    return source;
  });

  // Filter by supported formats
  const supportedSources = videoSources.filter(source => {
    const format = source.type.split('/')[1];
    return support[format as keyof typeof support];
  });

  if (supportedSources.length === 0) {
    return videoSources[0]?.src || '';
  }

  // Mobile optimization
  if (isMobile || isSlowConnection) {
    const mobileSources = supportedSources.filter(source => 
      source.quality === 'low' || source.quality === 'medium'
    );
    if (mobileSources.length > 0) {
      return mobileSources[0].src;
    }
  }

  // Prefer WebM for modern browsers (better compression)
  if (support.webm && options.preferredFormats?.includes('webm')) {
    const webmSource = supportedSources.find(source => source.type.includes('webm'));
    if (webmSource) return webmSource.src;
  }

  // Prefer AV1 for ultra-modern browsers (best compression)
  if (support.av1 && options.preferredFormats?.includes('av1')) {
    const av1Source = supportedSources.find(source => source.type.includes('av01'));
    if (av1Source) return av1Source.src;
  }

  // Default to first supported source
  return supportedSources[0].src;
}

/**
 * Creates optimized video sources for different qualities and formats
 */
export function generateVideoSources(baseUrl: string): VideoSource[] {
  const sources: VideoSource[] = [];
  const formats = ['webm', 'mp4'];
  const qualities = [
    { suffix: '_4k', quality: '4k' as const },
    { suffix: '_hd', quality: 'high' as const },
    { suffix: '_md', quality: 'medium' as const },
    { suffix: '_low', quality: 'low' as const },
  ];

  formats.forEach(format => {
    qualities.forEach(({ suffix, quality }) => {
      const url = baseUrl.replace(/\.[^/.]+$/, `${suffix}.${format}`);
      sources.push({
        src: url,
        type: `video/${format}`,
        quality,
      });
    });
  });

  return sources;
}

/**
 * Lazy loading implementation for videos
 */
export function setupVideoLazyLoading(
  videoElement: HTMLVideoElement,
  options: VideoOptimizationOptions = {}
): () => void {
  if (!options.enableLazyLoading) {
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const video = entry.target as HTMLVideoElement;
          
          // Load video sources
          const sources = video.querySelectorAll('source[data-src]');
          sources.forEach((source) => {
            const src = source.getAttribute('data-src');
            if (src) {
              source.setAttribute('src', src);
              source.removeAttribute('data-src');
            }
          });

          // Load video src if present
          const dataSrc = video.getAttribute('data-src');
          if (dataSrc) {
            video.src = dataSrc;
            video.removeAttribute('data-src');
          }

          video.load();
          observer.unobserve(video);
        }
      });
    },
    {
      rootMargin: '50px 0px',
      threshold: 0.1,
    }
  );

  observer.observe(videoElement);

  return () => {
    observer.unobserve(videoElement);
  };
}

/**
 * Detects user's connection speed and adjusts video quality
 */
export function getAdaptiveVideoQuality(): 'low' | 'medium' | 'high' | '4k' {
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    
    switch (connection.effectiveType) {
      case 'slow-2g':
      case '2g':
        return 'low';
      case '3g':
        return 'medium';
      case '4g':
        return connection.downlink > 10 ? '4k' : 'high';
      default:
        return 'medium';
    }
  }

  // Fallback based on device type
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  
  return isMobile ? 'medium' : 'high';
}

/**
 * Preloads video metadata or full video based on strategy
 */
export function preloadVideo(
  src: string,
  strategy: 'none' | 'metadata' | 'auto' = 'metadata'
): Promise<HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = strategy;
    video.src = src;

    const handleLoad = () => {
      video.removeEventListener('loadedmetadata', handleLoad);
      video.removeEventListener('error', handleError);
      resolve(video);
    };

    const handleError = () => {
      video.removeEventListener('loadedmetadata', handleLoad);
      video.removeEventListener('error', handleError);
      reject(new Error('Failed to preload video'));
    };

    video.addEventListener('loadedmetadata', handleLoad);
    video.addEventListener('error', handleError);

    if (strategy !== 'none') {
      video.load();
    } else {
      resolve(video);
    }
  });
}

/**
 * Compresses video quality based on device performance
 */
export function getDeviceOptimizedSettings(): {
  quality: 'low' | 'medium' | 'high' | '4k';
  preload: 'none' | 'metadata' | 'auto';
  enableHardwareAcceleration: boolean;
} {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  const isLowEndDevice = navigator.hardwareConcurrency <= 2;
  const hasLimitedMemory = 'memory' in navigator && (navigator as any).memory?.jsHeapSizeLimit < 1000000000;

  if (isMobile || isLowEndDevice || hasLimitedMemory) {
    return {
      quality: 'low',
      preload: 'none',
      enableHardwareAcceleration: true,
    };
  }

  return {
    quality: getAdaptiveVideoQuality(),
    preload: 'metadata',
    enableHardwareAcceleration: true,
  };
}

/**
 * Creates a video element with optimized settings
 */
export function createOptimizedVideo(
  sources: string[] | VideoSource[],
  options: VideoOptimizationOptions = {}
): HTMLVideoElement {
  const video = document.createElement('video');
  const deviceSettings = getDeviceOptimizedSettings();
  const optimalSource = getOptimalVideoSource(sources, options);

  // Apply device-optimized settings
  video.preload = options.preloadStrategy || deviceSettings.preload;
  video.playsInline = true;
  video.muted = true; // Required for autoplay in most browsers

  // Set source
  if (options.enableLazyLoading) {
    video.setAttribute('data-src', optimalSource);
  } else {
    video.src = optimalSource;
  }

  // Add multiple sources for better compatibility
  if (Array.isArray(sources) && sources.length > 1) {
    const videoSources = typeof sources[0] === 'string' 
      ? sources.map(src => ({ src, type: `video/${src.split('.').pop()}` }))
      : sources as VideoSource[];

    videoSources.forEach(source => {
      const sourceElement = document.createElement('source');
      if (options.enableLazyLoading) {
        sourceElement.setAttribute('data-src', source.src);
      } else {
        sourceElement.src = source.src;
      }
      sourceElement.type = source.type;
      video.appendChild(sourceElement);
    });
  }

  return video;
}
