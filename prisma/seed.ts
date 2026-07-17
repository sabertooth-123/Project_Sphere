import { prisma } from "../src/lib/prisma";
import { slugify } from "../src/utils/slugify";
import type { TechnologyCategory } from "../src/generated/prisma/client";

const departments = [
  "Computer Science",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Data Science",
  "Information Systems",
  "Design & HCI",
  "Mathematics",
  "Business & Entrepreneurship",
  "Bioengineering",
  "Physics",
];

const categories: { name: string; description: string }[] = [
  { name: "Web Development", description: "Full-stack, frontend, and backend web apps." },
  { name: "Mobile Development", description: "iOS, Android, and cross-platform apps." },
  { name: "AI / Machine Learning", description: "Models, training pipelines, and applied ML." },
  { name: "Data Science", description: "Analysis, visualization, and data engineering." },
  { name: "Game Development", description: "Games and interactive experiences." },
  { name: "Hardware / IoT", description: "Embedded systems, sensors, and connected devices." },
  { name: "AR / VR", description: "Augmented and virtual reality experiences." },
  { name: "Blockchain", description: "Smart contracts and decentralized applications." },
  { name: "Developer Tools", description: "Libraries, CLIs, and productivity tooling." },
  { name: "Social Impact", description: "Projects built for a civic or nonprofit purpose." },
  { name: "Cybersecurity", description: "Security tooling, research, and CTF projects." },
];

const technologies: { name: string; category: TechnologyCategory }[] = [
  { name: "Python", category: "LANGUAGE" },
  { name: "TypeScript", category: "LANGUAGE" },
  { name: "JavaScript", category: "LANGUAGE" },
  { name: "Java", category: "LANGUAGE" },
  { name: "C++", category: "LANGUAGE" },
  { name: "Go", category: "LANGUAGE" },
  { name: "Rust", category: "LANGUAGE" },

  { name: "React", category: "FRAMEWORK" },
  { name: "Next.js", category: "FRAMEWORK" },
  { name: "Vue", category: "FRAMEWORK" },
  { name: "Django", category: "FRAMEWORK" },
  { name: "FastAPI", category: "FRAMEWORK" },
  { name: "Express", category: "FRAMEWORK" },
  { name: "Flask", category: "FRAMEWORK" },
  { name: "Spring Boot", category: "FRAMEWORK" },

  { name: "PyTorch", category: "LIBRARY" },
  { name: "TensorFlow", category: "LIBRARY" },
  { name: "scikit-learn", category: "LIBRARY" },
  { name: "Pandas", category: "LIBRARY" },
  { name: "NumPy", category: "LIBRARY" },

  { name: "PostgreSQL", category: "DATABASE" },
  { name: "MongoDB", category: "DATABASE" },
  { name: "MySQL", category: "DATABASE" },
  { name: "Redis", category: "DATABASE" },
  { name: "SQLite", category: "DATABASE" },

  { name: "AWS", category: "CLOUD" },
  { name: "Vercel", category: "CLOUD" },
  { name: "Google Cloud", category: "CLOUD" },
  { name: "Azure", category: "CLOUD" },

  { name: "Git", category: "TOOL" },
  { name: "Docker", category: "TOOL" },
  { name: "Kubernetes", category: "TOOL" },
  { name: "Figma", category: "TOOL" },
  { name: "Grafana", category: "TOOL" },
  { name: "Arduino", category: "TOOL" },
  { name: "ESP32", category: "TOOL" },

  { name: "GraphQL", category: "OTHER" },
  { name: "WebSockets", category: "OTHER" },
  { name: "Solidity", category: "OTHER" },
];

async function main() {
  await Promise.all(
    departments.map((name) =>
      prisma.department.upsert({
        where: { slug: slugify(name) },
        update: {},
        create: { name, slug: slugify(name) },
      })
    )
  );

  await Promise.all(
    categories.map(({ name, description }) =>
      prisma.category.upsert({
        where: { slug: slugify(name) },
        update: { description },
        create: { name, slug: slugify(name), description },
      })
    )
  );

  await Promise.all(
    technologies.map(({ name, category }) =>
      prisma.technology.upsert({
        where: { slug: slugify(name) },
        update: { category },
        create: { name, slug: slugify(name), category },
      })
    )
  );

  console.log(
    `Seeded ${departments.length} departments, ${categories.length} categories, ${technologies.length} technologies.`
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
