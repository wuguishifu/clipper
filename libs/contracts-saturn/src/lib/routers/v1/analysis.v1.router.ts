import { initContract } from '@ts-rest/core';
import z from 'zod';

import { clipResultSchema } from '../../types';

const c = initContract();

export const analysisRouter = c.router(
  {
    analyzeTranscript: {
      method: 'POST',
      path: '/transcript',
      body: z.object({
        transcript: z.string(),
      }),
      responses: {
        200: clipResultSchema,
      },
    },
  },
  {
    pathPrefix: '/analysis',
  },
);
