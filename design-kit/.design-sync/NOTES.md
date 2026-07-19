# Design-sync notes — Project Sphere Design Kit (merged, in-repo)

## What this is

`design-kit/` lives inside the `Project_Sphere` repo itself and syncs 10 components to claude.ai/design. Unlike a typical design-sync setup, **there is no copied component source** — `design-kit/src/index.ts` re-exports directly from `../src/components/...` and `../src/features/discovery/components/ProjectCard.tsx`, the same files the live app uses. `design-kit/dist/styles.css` is compiled straight from `../src/app/globals.css` via `@tailwindcss/cli` (Project Sphere itself only ships `@tailwindcss/postcss`, the Next.js integration — this kit's own `@tailwindcss/cli` devDependency is the only thing added here). So there's exactly one copy of each component and every token in the whole project — editing the real files under `src/` is enough; no manual porting step.

**History**: this started as a fully separate scratch repo (`D:\Project-Sphere-Design-Kit`) with hand-copied/adapted component files, because building a design-system package from a Next.js app looked hard. It's since been superseded by this in-repo, zero-duplication version — see the git log for that repo's rationale if useful context, but treat *this* directory as current.

## The only real adaptation: two shims

`ProjectCard.tsx` imports `next/image`/`next/link`, which need Next's router/image-optimizer runtime — absent in claude.ai/design's renderer. `tsup.config.ts` aliases those two bare imports to `design-kit/shims/next-image.tsx` / `next-link.tsx` (plain `<img>`/`<a>`) **at bundle time only** — the real app still imports genuine `next/image`/`next/link`; nothing in `src/` changed.

## Build mechanics worth remembering

- `design-kit/tsconfig.json` sets its own explicit `paths: {"@/*": ["../src/*"]}` rather than relying on `extends`' inherited paths — tsup's DTS worker didn't resolve inherited `paths` correctly through the extends chain (repro: switching to explicit paths in the child config fixed a `Cannot find module '@/lib/utils'` error). If bumping tsup, re-check whether this workaround is still needed.
- `--node-modules` for `package-build.mjs` points at `../node_modules` (Project Sphere's real one) — every runtime dependency (react, framer-motion, next-themes, lucide-react, @base-ui/react, class-variance-authority, clsx, tailwind-merge) is already installed there; `design-kit/node_modules` only holds the build tooling itself (`tsup`, `@tailwindcss/cli`) plus the staged `.ds-sync/` converter's own deps (`esbuild`, `ts-morph`, `@types/react`, `playwright`).
- Tailwind's automatic content detection, run against the real `globals.css`, scans the whole `Project_Sphere` repo (nearest `.git` boundary), not just the 10 synced components — `dist/styles.css` is a safe superset (~1340 lines vs. the old standalone kit's ~1156), functionally fine, just not minimal.

## Re-sync risks — read before the next sync

- **5 of 10 components have authored previews** (`CountUp`, `MotionButton`, `ProjectCard`, `StatCard`, `ViewsChart`) in `.design-sync/previews/` — the other 5 (`Button`, `HeroBackground`, `Skeleton`, `StickyHeaderShell`, `ThemeToggle`) intentionally ship the floor card (scope decision: floor cards for now, upgrade incrementally later).
- **`ThemeToggle`'s preview has no `ThemeProvider` wrapped around it.** Renders fine (falls back to light/`Moon` icon rather than crashing) but never demonstrates the dark-mode toggle actually working. Could add via `cfg.provider` on a future sync.
- **`CountUp`'s render-check screenshot may show a mid-animation value**, not the authored `value` prop — it animates on every mount and the check is a single frame. Not a bug.
- **If Project Sphere's component props/behavior change**, this kit picks it up automatically on the next `npm run build` (no porting needed) — but the authored previews in `.design-sync/previews/` are hand-written against the current API shape, so a breaking prop change could make a preview stop compiling. Re-run build + validate after any prop-shape change to the 10 synced components and fix previews if flagged.

## Known render warns

None outstanding — validate is clean (`bad: 0, thin: 0, variantsIdentical: 0`) across all 10 components on the merged setup.
