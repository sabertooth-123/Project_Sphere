"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export function StickyHeaderShell({ children }: { children: React.ReactNode }) {
  const { scrollY } = useScroll();
  const paddingY = useTransform(scrollY, [0, 80], [16, 10]);
  const shadow = useTransform(
    scrollY,
    [0, 80],
    ["0px 0px 0px rgba(0,0,0,0)", "0px 1px 12px rgba(0,0,0,0.08)"]
  );

  return (
    <motion.header
      style={{ paddingTop: paddingY, paddingBottom: paddingY, boxShadow: shadow }}
      className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">{children}</div>
    </motion.header>
  );
}
