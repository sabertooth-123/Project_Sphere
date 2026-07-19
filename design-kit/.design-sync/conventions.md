## Project Sphere Design Kit — conventions

This is a **scoped subset** (10 components) of Project Sphere's in-app design system — the motion-forward pieces from its Framer Motion polish pass and analytics dashboard. It is not the full app UI, and unlike a typical synced design system, it's built **directly from Project Sphere's real source files** (`../src/components/...`, `../src/features/discovery/components/ProjectCard.tsx`) via re-export, not copies — there is exactly one copy of each component's code in the whole project.

**Wrapping and setup.** No required root provider for most components. Two exceptions:
- `ProjectCard` normally uses Next.js's `Link`/`Image`; those need Next's router/image-optimizer context, which doesn't exist in claude.ai/design's runtime, so this bundle's build step swaps them for plain `<a>`/`<img>` shims (`design-kit/shims/`) purely at bundle time — the real app still uses genuine `next/link`/`next/image`.
- `ThemeToggle` reads `next-themes`' `useTheme()`. Without a `<ThemeProvider attribute="class">` ancestor it still renders (falls back to light/`Moon` icon) but won't persist or actually flip a theme.

Dark mode is a literal `.dark` class on an ancestor element (`<html class="dark">`), not a data attribute or media query — every token below is redefined inside `.dark { ... }`.

**Styling idiom — Tailwind utility classes over CSS custom properties, not hardcoded colors.** Never write a raw hex or `rgb()` value; always reach for the token name. Real names from this build:

| Purpose | Classes |
|---|---|
| Page/surface | `bg-background text-foreground`, `bg-card text-card-foreground` |
| Primary action | `bg-primary text-primary-foreground` |
| Secondary/muted | `bg-secondary text-secondary-foreground`, `bg-muted text-muted-foreground` |
| Accents | `bg-accent`, `text-accent2` / `bg-accent2` |
| Borders/inputs | `border-border`, `border-input`, `ring-ring` |
| Destructive | `bg-destructive`, `text-destructive` |
| Radius | `rounded-md` (`--radius-md`), `rounded-lg` (`--radius-lg`) |
| Type | `font-mono` (labels/numbers — this DS uses mono for stat values and metadata), `font-display` (headings) |

Numeric/tabular content (counts, stats) pairs `font-mono` with `tabular-nums`, e.g. `StatCard`'s value line.

**Where the truth lives.** `styles.css` (the bound copy) is compiled straight from Project Sphere's actual `src/app/globals.css` — read it before styling anything new; token values here can never drift from the app since there's no manual copy. Per-component API and usage: `components/<group>/<Name>/<Name>.d.ts` and `<Name>.prompt.md`.

**One idiomatic composition** (a stat row using this system's real parts):

```tsx
import { StatCard, MotionButton } from "project-sphere-design-kit";

<div className="grid grid-cols-2 gap-4">
  <StatCard label="Total views" value={4213} />
  <StatCard label="Total likes" value={186} />
</div>
<MotionButton variant="primary">Publish project</MotionButton>
```

Motion throughout this kit follows one vocabulary (`design-kit/../src/lib/motion.ts`, not exported but worth matching if extending it): ease `[0.4, 0, 0.2, 1]`, hover/tap durations ~0.18s, card transitions ~0.25s. Keep new compositions inside that range rather than inventing new timing.
