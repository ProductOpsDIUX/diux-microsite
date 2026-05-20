import { z } from 'zod';

export const HiringRoleSchema = z.object({
  title: z.string().min(1, 'Required').max(160),
  department: z.string().max(120).optional().default(''),
  location: z.string().max(120).optional().default('Singapore'),
  url: z.string().url('Must be a full URL (e.g. https://careersearch.dsta.gov.sg/...)'),
  summary: z.string().max(400).optional().default(''),
  position: z.number().int().min(0).max(9999).default(0),
  is_open: z.boolean().default(true),
});

export type HiringRoleFormValues = z.infer<typeof HiringRoleSchema>;
