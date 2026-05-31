import { Inject, Injectable } from '@nestjs/common';
import z from 'zod';

import {
  ENVIRONMENT_OPTIONS,
  ENVIRONMENT_SCHEMA,
  type EnvironmentOptions,
} from './local-environment.constants';

@Injectable()
export class LocalEnvironmentService<T extends z.ZodType = z.ZodType> {
  private cached: unknown | null = null;

  constructor(
    @Inject(ENVIRONMENT_SCHEMA) private readonly schema: T,
    @Inject(ENVIRONMENT_OPTIONS) private readonly options: EnvironmentOptions,
  ) {}

  public get environment(): z.infer<T> {
    if (this.cached) {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      return this.cached as z.infer<T>;
    }

    const raw = this.rawEnvObject;
    const parsed = this.schema.parse(raw);
    this.cached = parsed;
    return parsed;
  }

  private get rawEnvObject(): Record<string, unknown> {
    const { prefix, camelize } = this.options;
    const env = camelize ? this.camelize(process.env) : process.env;

    if (!prefix) {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      return env as unknown as Record<string, unknown>;
    }

    return Object.entries(env).reduce<Record<string, unknown>>(
      (acc, [key, value]) => {
        if (key.startsWith(prefix)) {
          acc[key.slice(prefix.length)] = value;
        }
        return acc;
      },
      {},
    );
  }

  private camelize(
    env: Record<string, string | undefined>,
  ): Record<string, string> {
    return Object.entries(env).reduce<Record<string, string>>(
      (acc, [key, value]) => {
        if (value === undefined) {
          return acc;
        }
        acc[this.snakeToCamel(key)] = value;
        return acc;
      },
      {},
    );
  }

  private snakeToCamel(s: string): string {
    return s
      .toLowerCase()
      .replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
  }
}
