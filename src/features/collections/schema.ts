import { z } from "zod";

export const collectionFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(80),
  description: z.string().max(300).optional(),
  isPublic: z.boolean().default(true),
});

export type CollectionFormInput = z.infer<typeof collectionFormSchema>;
