"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useReducedMotion, useTransform, animate } from "framer-motion";
import { EASE } from "@/lib/motion";

export function CountUp({ value, duration = 1.1 }: { value: number; duration?: number }) {
  const prefersReducedMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    if (prefersReducedMotion) {
      motionValue.set(value);
      return;
    }
    const controls = animate(motionValue, value, { duration, ease: EASE });
    return () => controls.stop();
  }, [value, prefersReducedMotion, duration, motionValue]);

  return <motion.span>{rounded}</motion.span>;
}
