# Project Sphere

A platform for university students to publish the projects they've built, discover what their peers are building, and maintain a public profile worth linking on a resume.

**Live:** [project-sphere-ashy.vercel.app](https://project-sphere-ashy.vercel.app)
**Repo:** [github.com/sabertooth-123/Project_Sphere](https://github.com/sabertooth-123/Project_Sphere)

---

## What it does

- **Publish a project** — cover image, tech stack, contributors, links to the repo and live demo, one page that actually does the project justice.
- **Get discovered** — browsable by technology, category, and department, with search, sort, and filters, not just a search box.
- **Get noticed** — a public profile, likes/bookmarks/comments, and an analytics dashboard showing real engagement.
- **Team credit** — contributors can be platform users or external (non-member) teammates, and every credited contributor shows up on their own profile, not just the owner's.
- **Live GitHub activity** — a project page pulls a real commit timeline from its linked repo.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 + a custom design system |
| Motion | Framer Motion |
| Database | PostgreSQL on Neon, via Prisma 7 |
| Auth | Clerk (Google OAuth) |
| Image storage | Cloudinary |
| Hosting | Vercel |

## Getting started

```bash
git clone https://github.com/sabertooth-123/Project_Sphere.git
cd Project_Sphere
npm install
```

Create a `.env` with:

```
DATABASE_URL=            # Neon pooled connection string
DIRECT_URL=               # Neon direct (unpooled) connection string
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Then:

```bash
npx prisma migrate dev   # apply the schema
npx prisma db seed        # seed departments, categories, technologies
npm run dev                # http://localhost:3000
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | `prisma generate && next build` — production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint |

## Project structure

```
src/
├─ app/          routes only
├─ features/     domain modules (projects, discovery, engagement, comments, onboarding, profile, collections)
├─ components/   ui/, layout/, shared/
├─ services/     the only code that talks to Prisma directly
├─ lib/          Prisma client, Clerk helper, Cloudinary, GitHub client, motion tokens
└─ types/, utils/
```

