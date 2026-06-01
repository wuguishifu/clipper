import {
  DynamicModule,
  FactoryProvider,
  Module,
  ModuleMetadata,
} from '@nestjs/common';
import { createRemoteJWKSet } from 'jose';

import { ConvexAuthGuard } from './convex-auth.guard';
import { CONVEX_AUTH_OPTIONS, CONVEX_JWKS } from './convex-auth.tokens';
import type { ConvexAuthOptions } from './convex-auth.types';

const DEFAULT_CACHE_MAX_AGE = 24 * 60 * 60 * 1000;
const DEFAULT_COOLDOWN_DURATION = 30 * 1000;
const DEFAULT_TIMEOUT_DURATION = 5 * 1000;

interface ConvexAuthModuleAsyncOptions<
  TArgs extends Array<unknown>,
> extends Pick<ModuleMetadata, 'imports'> {
  inject?: FactoryProvider['inject'];
  useFactory: (
    ...args: TArgs
  ) => ConvexAuthOptions | Promise<ConvexAuthOptions>;
}

export const buildConvexAuthOptions = (
  convexSiteUrl: string,
): ConvexAuthOptions => {
  return {
    convexSiteUrl,
    issuer: convexSiteUrl,
    jwksUri: `${convexSiteUrl}/.well-known/jwks.json`,
    cacheMaxAge: DEFAULT_CACHE_MAX_AGE,
    cooldownDuration: DEFAULT_COOLDOWN_DURATION,
    timeoutDuration: DEFAULT_TIMEOUT_DURATION,
  };
};

@Module({})
export class ConvexAuthModule {
  static register<TArgs extends Array<unknown>>(
    options: ConvexAuthModuleAsyncOptions<TArgs>,
  ): DynamicModule {
    return {
      module: ConvexAuthModule,
      imports: options.imports ?? [],
      providers: [
        {
          provide: CONVEX_AUTH_OPTIONS,
          inject: options.inject ?? [],
          useFactory: async (...args: TArgs): Promise<ConvexAuthOptions> => {
            const authOptions = await options.useFactory(...args);
            return authOptions;
          },
        },
        {
          provide: CONVEX_JWKS,
          inject: [CONVEX_AUTH_OPTIONS],
          useFactory: (authOptions: ConvexAuthOptions) =>
            createRemoteJWKSet(new URL(authOptions.jwksUri), {
              cacheMaxAge: authOptions.cacheMaxAge,
              cooldownDuration: authOptions.cooldownDuration,
              timeoutDuration: authOptions.timeoutDuration,
            }),
        },
        ConvexAuthGuard,
      ],
      exports: [CONVEX_AUTH_OPTIONS, CONVEX_JWKS, ConvexAuthGuard],
    };
  }
}
