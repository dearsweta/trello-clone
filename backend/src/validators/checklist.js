import { z } from 'zod';

export const createChecklistSchema = z.object({
  text: z.string().min(1).max(255),
});

export const updateChecklistSchema = z.object({
  completed: z.boolean(),
});
