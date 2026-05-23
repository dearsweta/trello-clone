import { z } from 'zod';

export const createCardSchema = z.object({
  listId: z.coerce.number().int().positive(),
  title: z.string().min(1).max(255),
});

export const updateCardSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  coverImageUrl: z.union([z.string().url(), z.literal(''), z.null()]).optional(),
});

export const archiveCardSchema = z.object({
  archived: z.boolean(),
});

export const moveCardSchema = z.object({
  newListId: z.coerce.number().int().positive(),
  newPosition: z.coerce.number().int().positive(),
});

export const reorderCardSchema = z.object({
  newPosition: z.coerce.number().int().positive(),
});

export const replaceMemberIdsSchema = z.object({
  memberIds: z.array(z.coerce.number().int().positive()),
});

export const replaceLabelIdsSchema = z.object({
  labelIds: z.array(z.coerce.number().int().positive()),
});
