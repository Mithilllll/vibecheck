import { z } from "zod";

export const projectCreateSchema = z.object({
  title: z.string().trim().min(2, "Title is too short").max(120),
  intendedVibe: z
    .string()
    .trim()
    .min(3, "Describe the vibe in a few more characters")
    .max(400),
  targetAudience: z.string().trim().max(200).optional().or(z.literal("")),
  platformContext: z.string().trim().max(80).optional().or(z.literal("")),
  captionContext: z.string().trim().max(800).optional().or(z.literal("")),
});

export type ProjectCreateInput = z.infer<typeof projectCreateSchema>;

export const ALLOWED_IMAGE_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const ALLOWED_VIDEO_MIME = [
  "video/mp4",
  "video/quicktime",
  "video/webm",
] as const;

export const ALLOWED_AUDIO_MIME = [
  "audio/mpeg",
  "audio/wav",
  "audio/mp4",
  "audio/ogg",
  "audio/webm",
] as const;

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_VIDEO_BYTES = 100 * 1024 * 1024; // 100 MB
export const MAX_AUDIO_BYTES = 25 * 1024 * 1024; // 25 MB
