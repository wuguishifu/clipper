import { initContract } from '@ts-rest/core';

import { analysisRouter } from './analysis.v1.router';

const c = initContract();

export const v1Router = c.router(
  {
    analysis: analysisRouter,
  },
  {
    pathPrefix: '/v1',
  },
);
