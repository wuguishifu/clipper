import { z } from 'zod';

export type EnvironmentSchema = z.infer<typeof environmentSchema>;
export const environmentSchema = z.object({
  environment: z.enum(['development', 'production']).default('development'),
  claudeApiToken: z.string(),
  adminApiToken: z.string(),
  convexUrl: z.string(),
  convexSiteUrl: z.string(),
});
