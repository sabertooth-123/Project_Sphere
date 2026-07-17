import { z } from "zod";

const optionalUrl = z
  .union([z.literal(""), z.string().url()])
  .transform((value) => (value === "" ? undefined : value));

const commaList = z
  .string()
  .max(300)
  .optional()
  .transform((value) =>
    (value ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  );

export const projectFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120),
  shortDescription: z.string().min(10, "Give at least a short sentence").max(200),
  longDescription: z.string().min(20, "Description is too short").max(5000),
  coverImageUrl: z.union([z.literal(""), z.string().url()]).optional(),
  demoVideoUrl: optionalUrl,
  githubUrl: optionalUrl,
  liveUrl: optionalUrl,
  documentationUrl: optionalUrl,
  technologies: commaList,
  tags: commaList,
  categoryIds: z.array(z.string()).default([]),
  publish: z.enum(["draft", "publish"]).default("draft"),
});

export type ProjectFormInput = z.infer<typeof projectFormSchema>;
