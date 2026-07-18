"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { DURATION, EASE } from "@/lib/motion";

export type ProjectCardData = {
  slug: string;
  title: string;
  shortDescription: string;
  coverImageUrl: string | null;
  viewCount: number;
  likeCount: number;
  technologies?: { technology: { id: string; name: string } }[];
};

export function ProjectCard({ project, role }: { project: ProjectCardData; role?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -4 }}
      transition={{ duration: DURATION.card, ease: EASE }}
      className="group"
    >
      <Link
        href={`/projects/${project.slug}`}
        className="block overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-[box-shadow,border-color] duration-200 ease-out group-hover:border-primary/50 group-hover:shadow-lg"
      >
        <div className="relative h-32 w-full overflow-hidden bg-muted">
          {project.coverImageUrl && (
            <Image
              src={project.coverImageUrl}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            />
          )}
          {role && role !== "OWNER" && (
            <span className="absolute right-2 top-2 rounded-full bg-background/90 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
              {role.toLowerCase()}
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="mb-1 font-display text-base font-semibold transition-colors group-hover:text-primary">
            {project.title}
          </h3>
          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
            {project.shortDescription}
          </p>
          {project.technologies && project.technologies.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1.5 transition-transform duration-200 ease-out group-hover:-translate-y-0.5">
              {project.technologies.map(({ technology }) => (
                <span
                  key={technology.id}
                  className="rounded-md bg-accent2/10 px-1.5 py-0.5 font-mono text-[10px] text-accent2"
                >
                  {technology.name}
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-3 font-mono text-xs text-muted-foreground tabular-nums">
            <span>{project.viewCount} views</span>
            <span>{project.likeCount} likes</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
