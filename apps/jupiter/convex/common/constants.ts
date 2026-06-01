import z from 'zod';

const environmentSchema = z
  .object({
    CONVEX_URL: z.string(),
    CONVEX_SITE_URL: z.string(),
  })
  .partial();

export const environment = environmentSchema.parse(process.env);
