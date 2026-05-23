import { z } from 'zod';

export const createListSchema = z.object({
  boardId: z.coerce.number().int().positive(),
  title: z.string().min(1).max(255),
});

export const updateListSchema = z.object({
  title: z.string().min(1).max(255),
});

export const reorderListSchema = z.object({
  listId: z.coerce.number().int().positive(),
  newPosition: z.coerce.number().int().positive(),
});
