import { z } from 'zod';

export const createBoardSchema = z.object({
  title: z.string().min(1).max(255),
});

export const updateBoardSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  background: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});
