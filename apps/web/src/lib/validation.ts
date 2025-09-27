import { z } from "zod";

export const pitchFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  pitch: z.string().min(10, "Pitch content is required"),
});

export type PitchFormValues = z.infer<typeof pitchFormSchema>;

export const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(200, "Comment must be 200 characters or less"),
  startupId: z.string().min(1, "Startup ID is required"),
});

export type CommentFormValues = z.infer<typeof commentSchema>;

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  position: z.string().max(100).optional().or(z.literal("")),
  bio: z.string().max(500).optional().or(z.literal("")),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
