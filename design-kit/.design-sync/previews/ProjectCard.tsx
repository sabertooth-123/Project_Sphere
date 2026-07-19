import { ProjectCard } from "project-sphere-design-kit";

const project = {
  slug: "campus-ride-share",
  title: "Campus RideShare",
  shortDescription: "A carpooling app for students commuting to campus, matched by route and schedule.",
  coverImageUrl: null,
  viewCount: 312,
  likeCount: 47,
  technologies: [
    { technology: { id: "1", name: "next-js" } },
    { technology: { id: "2", name: "postgresql" } },
    { technology: { id: "3", name: "typescript" } },
  ],
};

export function Default() {
  return <ProjectCard project={project} />;
}

export function AsContributor() {
  return <ProjectCard project={{ ...project, slug: "team-project" }} role="CONTRIBUTOR" />;
}
