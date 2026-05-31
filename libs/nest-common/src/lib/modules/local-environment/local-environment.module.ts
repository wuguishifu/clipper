import { DynamicModule, Module } from '@nestjs/common';
import { z } from 'zod';

import {
  ENVIRONMENT_OPTIONS,
  ENVIRONMENT_SCHEMA,
  EnvironmentOptions,
} from './local-environment.constants';
import { LocalEnvironmentService } from './local-environment.service';

@Module({})
export class LocalEnvironmentModule {
  public static forRoot<T extends z.ZodType>({
    schema,
    options,
  }: {
    schema: T;
    options: EnvironmentOptions;
  }): DynamicModule {
    return {
      module: LocalEnvironmentModule,
      providers: [
        LocalEnvironmentService,
        { provide: ENVIRONMENT_SCHEMA, useValue: schema },
        { provide: ENVIRONMENT_OPTIONS, useValue: options },
      ],
      exports: [
        LocalEnvironmentService,
        ENVIRONMENT_SCHEMA,
        ENVIRONMENT_OPTIONS,
      ],
    };
  }
}
