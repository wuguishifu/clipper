import { initContract } from '@ts-rest/core';

import { v1Router } from './routers/v1';

const c = initContract();

export const saturnRootRouter = c.router(
  {
    v1: v1Router,
  },
  {
    pathPrefix: '/api',
    strictStatusCodes: true,
  },
);
