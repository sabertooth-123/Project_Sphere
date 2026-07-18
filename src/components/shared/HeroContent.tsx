"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { HomeCTA } from "@/components/shared/HomeCTA";
import { HeroSearchBar } from "@/components/shared/HeroSearchBar";

export function HeroContent() {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={staggerContainer(0.08, 0.1)}
      className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-6 pt-20 pb-16 text-center"
    >
      <motion.span
        variants={fadeUp}
        className="font-mono text-xs uppercase tracking-wide text-accent2"
      >
        For student builders
      </motion.span>
      <motion.h1 variants={fadeUp} className="font-display text-4xl font-semibold sm:text-5xl">
        Show the world what you built
      </motion.h1>
      <motion.p variants={fadeUp} className="max-w-lg text-muted-foreground">
        A home for student projects — discover what your peers are building, find your next
        collaborator, and publish work that&apos;s good enough to put on a resume.
      </motion.p>
      <motion.div variants={fadeUp} className="w-full">
        <HeroSearchBar />
      </motion.div>
      <motion.div variants={fadeUp}>
        <HomeCTA />
      </motion.div>
    </motion.div>
  );
}
