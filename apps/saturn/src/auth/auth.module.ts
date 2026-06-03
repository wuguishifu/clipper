import { Global, Module } from '@nestjs/common';

import { EnvironmentService } from '../environment/environment-service';

import {
  buildConvexAuthOptions,
  ConvexAuthModule,
} from './convex/convex-auth.module';

@Global()
@Module({
  imports: [
    ConvexAuthModule.register({
      inject: [EnvironmentService],
      useFactory: (environmentService: EnvironmentService) =>
        buildConvexAuthOptions(environmentService.environment.convexSiteUrl),
    }),
  ],
  exports: [ConvexAuthModule],
})
export class AuthModule {}
