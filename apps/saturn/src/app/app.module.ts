import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { EnvironmentModule } from '../environment/environment-module';
import { AnalysisModule } from '../modules/analysis/analysis.module';

import { AppController } from './app.controller';

@Module({
  imports: [EnvironmentModule, AuthModule, AnalysisModule],
  controllers: [AppController],
})
export class AppModule {}
