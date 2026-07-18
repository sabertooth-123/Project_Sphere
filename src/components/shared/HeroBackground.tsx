"use client";

import { motion } from "framer-motion";

const SHAPES = [
  { color: "var(--accent)", size: 340, top: "-8%", left: "8%", dur: 11, delay: 0 },
  { color: "var(--accent2)", size: 280, top: "10%", left: "70%", dur: 14, delay: 1.5 },
  { color: "var(--accent2)", size: 220, top: "55%", left: "20%", dur: 9, delay: 0.6 },
  { color: "var(--accent)", size: 260, top: "50%", left: "80%", dur: 13, delay: 2 },
];

export function HeroBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden [mask-image:linear-gradient(to_bottom,black,transparent)]"
    >
      <div className="hero-gradient-layer absolute inset-0" />
      {SHAPES.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-[0.14] blur-3xl"
          style={{
            width: shape.size,
            height: shape.size,
            top: shape.top,
            left: shape.left,
            backgroundColor: shape.color,
          }}
          animate={{ x: [0, 24, -16, 0], y: [0, -18, 14, 0] }}
          transition={{
            duration: shape.dur,
            delay: shape.delay,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
