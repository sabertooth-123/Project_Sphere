// Shared motion vocabulary — every animated component pulls from here so
// timing stays consistent instead of each component inventing its own.

export const EASE = [0.4, 0, 0.2, 1] as const; // standard ease-in-out

export const DURATION = {
  hover: 0.18, // 150-200ms
  card: 0.25, // 250ms
  page: 0.4, // 350-500ms
  stagger: 0.06, // 50-80ms
} as const;

export const SPRING = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
  mass: 0.8,
};

export const SPRING_SNAPPY = {
  type: "spring" as const,
  stiffness: 420,
  damping: 32,
};

export function staggerContainer(staggerDelay: number = DURATION.stagger, delayChildren = 0) {
  return {
    hidden: {},
    show: {
      transition: { staggerChildren: staggerDelay, delayChildren },
    },
  };
}

export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: DURATION.card, ease: EASE } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DURATION.card, ease: EASE } },
};
