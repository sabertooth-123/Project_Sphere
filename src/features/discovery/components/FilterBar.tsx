"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DURATION, EASE } from "@/lib/motion";
import { MotionButton } from "@/components/ui/MotionButton";

type Option = { slug: string; name: string };

export function FilterBar({
  categories,
  departments,
  technologies,
  defaults,
}: {
  categories: Option[];
  departments: Option[];
  technologies: Option[];
  defaults: {
    q?: string;
    categorySlug?: string;
    departmentSlug?: string;
    technologySlugs?: string[];
    sort: string;
  };
}) {
  const [focused, setFocused] = useState(false);

  return (
    <form method="get" className="mb-8 flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        <motion.div
          animate={{
            boxShadow: focused
              ? "0 0 0 3px var(--accent2-soft, rgba(113,183,196,0.16)), 0 4px 16px -6px rgba(0,0,0,0.2)"
              : "0 0 0 0px transparent, 0 0px 0px rgba(0,0,0,0)",
          }}
          transition={{ duration: DURATION.hover, ease: EASE }}
          className="min-w-[200px] flex-1 rounded-md"
        >
          <input
            type="search"
            name="q"
            defaultValue={defaults.q}
            placeholder="Search projects…"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none"
          />
        </motion.div>
        <select
          name="sort"
          defaultValue={defaults.sort}
          className="rounded-md border border-input px-3 py-2 text-sm"
        >
          <option value="recent">Recent</option>
          <option value="trending">Trending</option>
          <option value="most-liked">Most liked</option>
        </select>
        <select
          name="category"
          defaultValue={defaults.categorySlug ?? ""}
          className="rounded-md border border-input px-3 py-2 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          name="department"
          defaultValue={defaults.departmentSlug ?? ""}
          className="rounded-md border border-input px-3 py-2 text-sm"
        >
          <option value="">All departments</option>
          {departments.map((d) => (
            <option key={d.slug} value={d.slug}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="flex flex-wrap gap-2 text-sm">
        <legend className="mb-1 w-full text-xs uppercase tracking-wide text-muted-foreground">
          Technology
        </legend>
        {technologies.map((t) => (
          <label key={t.slug} className="cursor-pointer">
            <input
              type="checkbox"
              name="technology"
              value={t.slug}
              defaultChecked={defaults.technologySlugs?.includes(t.slug)}
              className="peer sr-only"
            />
            <span className="inline-block rounded-full border border-input px-3 py-1 text-xs font-medium text-muted-foreground transition-colors duration-200 ease-out peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background">
              {t.name}
            </span>
          </label>
        ))}
      </fieldset>

      <MotionButton type="submit" className="self-start">
        Apply filters
      </MotionButton>
    </form>
  );
}
