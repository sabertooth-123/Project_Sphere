import { z } from "zod";

const optionalUrl = z
  .union([z.literal(""), z.string().url()])
  .transform((value) => (value === "" ? undefined : value));

export const profileFormSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  name: z.string().min(1, "Name is required").max(80),
  headline: z.string().max(120).optional(),
  bio: z.string().max(500).optional(),
  departmentId: z.string().optional(),
  githubUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  portfolioUrl: optionalUrl,
  skills: z.string().max(300).optional(),
});

export type ProfileFormInput = z.infer<typeof profileFormSchema>;
