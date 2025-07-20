/**
 * SynapseAI Animation Library
 * A comprehensive set of animation variants for framer-motion
 */

import { Variants, Transition, Easing, EasingDefinition } from "framer-motion";

// Base timing functions
export const timings = {
  easeOut: [0.16, 1, 0.3, 1] as EasingDefinition,
  easeIn: [0.67, 0, 0.83, 0] as EasingDefinition,
  easeInOut: [0.65, 0, 0.35, 1] as EasingDefinition,
  bounce: [0.22, 1.2, 0.36, 1] as EasingDefinition,
  spring: [0.43, 1.14, 0.23, 0.98] as EasingDefinition,
};

// Base durations
export const durations = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.7,
  verySlow: 1.2,
};

// Staggering children
export const staggerContainer = (staggerTime = 0.05): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerTime,
    },
  },
});

/**
 * Fade animations
 */
export const fadeIn = (
  direction: "up" | "down" | "left" | "right" | "none" = "up",
  duration = durations.normal,
  delay = 0,
  timing: EasingDefinition = timings.easeOut
): Variants => {
  const directions = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
    none: {},
  };

  return {
    hidden: {
      opacity: 0,
      ...directions[direction],
    },
    visible: {
      opacity: 1,
      ...Object.fromEntries(
        Object.entries(directions[direction]).map(([key]) => [key, 0])
      ),
      transition: {
        duration,
        delay,
        ease: timing,
      },
    },
  };
};

/**
 * Scale animations
 */
export const scaleIn = (
  initialScale = 0.9,
  duration = durations.normal,
  delay = 0,
  timing: EasingDefinition = timings.spring
): Variants => ({
  hidden: {
    opacity: 0,
    scale: initialScale,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration,
      delay,
      ease: timing,
    },
  },
});

/**
 * Slide animations
 */
export const slideIn = (
  direction: "up" | "down" | "left" | "right",
  distance = 100,
  duration = durations.normal,
  delay = 0,
  timing: EasingDefinition = timings.easeOut
): Variants => {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  };

  return {
    hidden: {
      ...directions[direction],
      opacity: 0,
    },
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        duration,
        delay,
        ease: timing,
      },
    },
  };
};

/**
 * Rotate animations
 */
export const rotateIn = (
  initialRotation = 10,
  duration = durations.normal,
  delay = 0,
  timing: EasingDefinition = timings.easeOut
): Variants => ({
  hidden: {
    opacity: 0,
    rotate: initialRotation,
  },
  visible: {
    opacity: 1,
    rotate: 0,
    transition: {
      duration,
      delay,
      ease: timing,
    },
  },
});

/**
 * Flip animations
 */
export const flipIn = (
  direction: "x" | "y",
  duration = durations.normal,
  delay = 0,
  timing: EasingDefinition = timings.spring
): Variants => ({
  hidden: {
    opacity: 0,
    rotateX: direction === "x" ? 90 : 0,
    rotateY: direction === "y" ? 90 : 0,
  },
  visible: {
    opacity: 1,
    rotateX: 0,
    rotateY: 0,
    transition: {
      duration,
      delay,
      ease: timing,
    },
  },
});

/**
 * Blur animations
 */
export const blurIn = (
  initialBlur = 20,
  duration = durations.normal,
  delay = 0,
  timing: EasingDefinition = timings.easeOut
): Variants => ({
  hidden: {
    opacity: 0,
    filter: `blur(${initialBlur}px)`,
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration,
      delay,
      ease: timing,
    },
  },
});

/**
 * Bounce animations
 */
export const bounceIn = (
  direction: "up" | "down" | "left" | "right" = "up",
  distance = 50,
  duration = durations.normal,
  delay = 0
): Variants => {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  };

  return {
    hidden: {
      ...directions[direction],
      opacity: 0,
    },
    visible: {
      ...Object.fromEntries(
        Object.entries(directions[direction]).map(([key]) => [key, 0])
      ),
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
        delay,
        duration,
      },
    },
  };
};

/**
 * Staggered list item animations
 */
export const listItem = (
  index: number,
  staggerDelay = 0.05,
  duration = durations.normal,
  direction: "up" | "down" | "left" | "right" = "up"
): Variants => {
  const directions = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
  };

  return {
    hidden: {
      opacity: 0,
      ...directions[direction],
    },
    visible: {
      opacity: 1,
      ...Object.fromEntries(
        Object.entries(directions[direction]).map(([key]) => [key, 0])
      ),
      transition: {
        duration,
        delay: index * staggerDelay,
        ease: timings.easeOut,
      },
    },
  };
};

/**
 * Reveal text animation
 */
export const textReveal = (
  delay = 0,
  duration = durations.normal
): Variants => ({
  hidden: {
    y: "100%",
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration,
      delay,
      ease: timings.easeOut,
    },
  },
});

/**
 * Path drawing animation for SVGs
 */
export const drawPath = (
  duration = durations.slow,
  delay = 0,
  easing: EasingDefinition = timings.easeInOut
): Variants => ({
  hidden: {
    pathLength: 0,
    opacity: 0,
  },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        duration,
        delay,
        ease: easing,
      },
      opacity: {
        duration: duration * 0.5,
        delay,
      },
    },
  },
});

/**
 * Hover animations
 */
export const hoverScale = {
  scale: 1.05,
  transition: { duration: 0.2 },
};

export const hoverElevate = {
  y: -5,
  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
  transition: { duration: 0.2 },
};

export const hoverGlow = (color = "rgba(0, 0, 255, 0.3)") => ({
  boxShadow: `0 0 15px ${color}`,
  transition: { duration: 0.2 },
});

/**
 * Page transitions
 */
export const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: {
    duration: 0.3,
    ease: timings.easeInOut,
  },
};

/**
 * Scroll-triggered animations
 */
export const scrollFadeIn = (
  threshold = 0.1,
  duration = durations.normal
): Variants => ({
  offscreen: {
    opacity: 0,
    y: 50,
  },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: {
      duration,
      ease: timings.easeOut,
    },
  },
});

/**
 * Utility to create sequential animations
 */
export const sequence = (
  animations: Variants[],
  staggerTime = 0.2
): Variants => {
  const result: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerTime,
      },
    },
  };

  return result;
};

/**
 * Parallax scroll effect
 */
export const parallaxScroll = (speed = 0.5) => ({
  y: [`${speed * -10}%`, `${speed * 10}%`],
  transition: {
    repeat: 0,
    repeatType: "reverse" as const,
    duration: 1,
    ease: "linear",
  },
}); 