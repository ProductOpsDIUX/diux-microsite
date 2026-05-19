import { z } from 'zod';

export const PageSeoSchema = z.object({
  path: z.string().min(1).max(120),
  title: z.string().max(70, 'Title should stay under 70 chars for Google SERPs'),
  description: z.string().max(170, 'Description should stay under 170 chars'),
  og_image: z.string().url().nullable().or(z.literal('').transform(() => null)),
});

export type PageSeoFormValues = z.infer<typeof PageSeoSchema>;
