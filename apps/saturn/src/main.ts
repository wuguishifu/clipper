import 'dotenv/config';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter({
    ignoreTrailingSlash: true,
    trustProxy: true,
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
    {
      rawBody: true,
      logger:
        process.env.DEBUG_LOGGING === 'true'
          ? ['verbose', 'debug', 'log', 'warn', 'error', 'fatal']
          : ['log', 'warn', 'error', 'fatal'],
    },
  );

  app.getHttpAdapter().getInstance();

  app.enableCors();

  const port = process.env.PORT || 3000;

  await app.listen(port, '0.0.0.0');

  const url = await app.getUrl();
  Logger.log(`🚀 Saturn is running on: ${url}`);
}

bootstrap();
