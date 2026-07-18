"use client";

import { motion } from "framer-motion";
import { staggerContainer } from "@/lib/motion";
import { StatCard } from "@/components/shared/StatCard";
import type { OwnerAnalytics } from "@/services/analytics";

export function AnalyticsStats({ totals }: { totals: OwnerAnalytics["totals"] }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={staggerContainer()}
      className="grid grid-cols-2 gap-4 sm:grid-cols-4"
    >
      <StatCard label="Projects" value={totals.projects} />
      <StatCard label="Total views" value={totals.views} />
      <StatCard label="Total likes" value={totals.likes} />
      <StatCard label="Bookmarks" value={totals.bookmarks} />
    </motion.div>
  );
}
