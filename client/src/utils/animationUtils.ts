import { Variants } from "framer-motion";

// Custom easing curves
export const EASE_OUT = [0.25, 0.1, 0.25, 1.0] as const;
export const EASE_IN_OUT = [0.42, 0, 0.58, 1] as const;
export const PREMIUM_SPRING = { type: "spring", stiffness: 350, damping: 25 } as const;

// Transition presets
export const FAST_TRANSITION = { duration: 0.25, ease: EASE_OUT };
export const MEDIUM_TRANSITION = { duration: 0.4, ease: EASE_OUT };
export const ENTRANCE_TRANSITION = { duration: 0.6, ease: EASE_OUT };

// Fade and Slide Up variant for Scroll Reveals
export const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: MEDIUM_TRANSITION,
  },
};

// Stagger Container variant for lists/grids
export const staggerContainerVariants = (staggerDelay = 0.08, delayChildren = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren,
    },
  },
});

// Stagger item variant
export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: FAST_TRANSITION,
  },
};

// Hero Load Sequence Variants
export const heroSequenceVariants = {
  badge: {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: EASE_OUT } },
  },
  headline: {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT, delay: 0.1 } },
  },
  subtext: {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT, delay: 0.2 } },
  },
  cta: {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT, delay: 0.3 } },
  },
  stats: {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT, delay: 0.4 } },
  },
  image: {
    hidden: { opacity: 0, scale: 0.96, y: 16 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT, delay: 0.35 } },
  },
  floatingCards: {
    hidden: { opacity: 0, y: 14, scale: 0.92 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: EASE_OUT, delay: 0.5 } },
  },
};

// Reduced motion helper for Framer Motion
export const getReducedMotionProps = (isReducedMotion: boolean | null) => {
  if (isReducedMotion) {
    return {
      initial: { opacity: 1, y: 0, scale: 1 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.05 },
    };
  }
  return null;
};
