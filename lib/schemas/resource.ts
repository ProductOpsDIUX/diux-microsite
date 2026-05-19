import { z } from 'zod';

export const ResourceSchema = z.object({
  title: z.string().min(1, 'Required').max(160),
  description: z.string().max(400),
  kind: z.enum(['template', 'manual'], { message: 'Pick a category' }),
  url: z.string().url('Must be a full URL'),
  file_path: z.string().nullable().or(z.literal('').transform(() => null)),
  position: z.number().int().min(0).max(9999),
});

export type ResourceFormValues = z.infer<typeof ResourceSchema>;
