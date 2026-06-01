import { Module } from '@nestjs/common';

import { EnvironmentModule } from '../environment/environment-module';
import { AnalysisModule } from '../modules/analysis/analysis.module';

import { AppController } from './app.controller';

@Module({
  imports: [EnvironmentModule, AnalysisModule],
  controllers: [AppController],
})
export class AppModule {}
