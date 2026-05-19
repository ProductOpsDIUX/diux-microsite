import { z } from 'zod';

export const TeamMemberSchema = z.object({
  name: z.string().min(1, 'Required').max(120),
  role: z.string().max(120),
  bio: z.string().max(1200),
  photo: z.string().url().nullable().or(z.literal('').transform(() => null)),
  position: z.number().int().min(0).max(9999),
});

export type TeamMemberFormValues = z.infer<typeof TeamMemberSchema>;
