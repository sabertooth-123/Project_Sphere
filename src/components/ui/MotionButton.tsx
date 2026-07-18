"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { DURATION, EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "destructive";

const variantClasses: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground",
  secondary: "border border-input text-foreground hover:bg-accent",
  ghost: "text-muted-foreground hover:bg-accent",
  destructive: "text-destructive hover:bg-destructive/10",
};

type MotionButtonProps = HTMLMotionProps<"button"> & { variant?: Variant };

export function MotionButton({ variant = "primary", className, children, ...props }: MotionButtonProps) {
  return (
    <motion.button
      whileHover={{ y: -1, scale: 1.015 }}
      whileTap={{ scale: 0.97, y: 0 }}
      transition={{ duration: DURATION.hover, ease: EASE }}
      className={cn(
        "rounded-md px-4 py-2 text-sm font-medium disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
