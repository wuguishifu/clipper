import z from 'zod';

const clipResultFoundSchema = z.object({
  found: z.literal(true),
  reasoning: z.string(),
  quoteStart: z.string(),
  quoteEnd: z.string(),
  startSeconds: z.number(),
  endSeconds: z.number(),
  clipTitle: z.string(),
});

const clipResultNotFoundSchema = z.object({
  found: z.literal(false),
  reasoning: z.string(),
});

export const clipResultSchema = z.discriminatedUnion('found', [
  clipResultFoundSchema,
  clipResultNotFoundSchema,
]);
