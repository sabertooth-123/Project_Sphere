"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { CountUp } from "@/components/shared/CountUp";

export function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <motion.div variants={fadeUp} className="rounded-lg border border-border p-4">
      <p className="font-mono text-2xl tabular-nums">
        <CountUp value={value} />
      </p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </motion.div>
  );
}
