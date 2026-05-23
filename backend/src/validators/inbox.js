import { z } from 'zod';

export const createInboxSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().nullable().optional(),
  createdBy: z.coerce.number().int().positive().nullable().optional(),
  fromCardId: z.coerce.number().int().positive().optional(),
}).refine(
  (data) => data.fromCardId || data.title,
  { message: 'title is required when fromCardId is not provided' }
);

export const updateInboxSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().nullable().optional(),
});
