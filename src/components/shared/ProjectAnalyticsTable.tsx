"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";
import type { ProjectAnalyticsRow } from "@/services/analytics";

export function ProjectAnalyticsTable({ projects }: { projects: ProjectAnalyticsRow[] }) {
  if (projects.length === 0) {
    return <p className="text-sm text-muted-foreground">Publish a project to start collecting stats.</p>;
  }

  return (
    <motion.ul initial="hidden" animate="show" variants={staggerContainer()} className="flex flex-col gap-2">
      {projects.map((project) => (
        <motion.li
          key={project.id}
          variants={fadeUp}
          className="flex items-center justify-between gap-4 rounded-lg border border-border px-4 py-3"
        >
          <div className="min-w-0">
            <Link href={`/projects/${project.slug}`} className="truncate font-medium hover:underline">
              {project.title}
            </Link>
            {project.status !== "PUBLISHED" && (
              <span className="ml-2 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                {project.status.toLowerCase()}
              </span>
            )}
          </div>
          <div className="flex shrink-0 gap-4 font-mono text-xs text-muted-foreground tabular-nums">
            <span>{project.viewCount} views</span>
            <span>{project.likeCount} likes</span>
            <span>{project.bookmarkCount} saves</span>
          </div>
        </motion.li>
      ))}
    </motion.ul>
  );
}
