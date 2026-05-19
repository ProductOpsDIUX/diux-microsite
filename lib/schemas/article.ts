import { z } from 'zod';

const SlugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const ArticleSchema = z.object({
  slug: z
    .string()
    .min(1, 'Required')
    .max(120)
    .regex(SlugRegex, 'Use lowercase letters, numbers, and hyphens only'),
  title: z.string().min(1, 'Required').max(200),
  excerpt: z.string().max(400),
  cover_image: z.string().url().nullable().or(z.literal('').transform(() => null)),
  topic: z.string().max(40),
  body_html: z.string().max(200_000),
  is_published: z.boolean(),
});

export type ArticleFormValues = z.infer<typeof ArticleSchema>;

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}
