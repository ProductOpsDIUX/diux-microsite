import { z } from 'zod';

const PillarSchema = z.object({
  title: z.string().min(1, 'Title is required').max(120),
  body: z.string().min(1, 'Body is required').max(800),
});

const StatSchema = z.object({
  value: z.string().min(1, 'Value is required').max(20),
  label: z.string().min(1, 'Label is required').max(60),
});

export const HomeSchema = z.object({
  hero_eyebrow: z.string().max(80),
  hero_h1_prefix: z.string().min(1, 'Required').max(60),
  hero_h1_rotator: z
    .array(z.string().min(1).max(40))
    .min(1, 'Add at least one rotating word')
    .max(8),
  hero_h1_suffix: z.string().min(1, 'Required').max(60),
  hero_sub: z.string().min(1, 'Required').max(600),
  pillars: z.array(PillarSchema).min(1).max(6),
  mission_eyebrow: z.string().max(60),
  mission_lines: z.array(z.string().min(1).max(80)).min(1).max(8),
  stats: z.array(StatSchema).min(1).max(8),
});

export type HomeFormValues = z.infer<typeof HomeSchema>;
