import { Global, Module } from '@nestjs/common';

import { LocalEnvironmentModule } from '@clipper/nest-common';

import { environmentSchema } from './environment-schema';
import { EnvironmentService } from './environment-service';

@Global()
@Module({
  imports: [
    LocalEnvironmentModule.forRoot({
      schema: environmentSchema,
      options: {
        camelize: true,
      },
    }),
  ],
  providers: [EnvironmentService],
  exports: [EnvironmentService],
})
export class EnvironmentModule {}
