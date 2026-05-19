import { z } from 'zod';

const SlugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const CaseStudySchema = z.object({
  slug: z
    .string()
    .min(1, 'Required')
    .max(120)
    .regex(SlugRegex, 'Use lowercase letters, numbers, and hyphens only'),
  title: z.string().min(1, 'Required').max(200),
  summary: z.string().max(600),
  year: z.string().max(20),
  client: z.string().max(120),
  category: z.string().max(60),
  tags: z.array(z.string().max(40)).max(20),
  hero_image: z.string().url().nullable().or(z.literal('').transform(() => null)),
  body: z.string().max(200_000),
  featured: z.boolean(),
  position: z.number().int().min(0).max(9999),
});

export type CaseStudyFormValues = z.infer<typeof CaseStudySchema>;
