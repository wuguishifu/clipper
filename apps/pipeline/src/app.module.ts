import { Module } from '@nestjs/common';

import { OrchestratorModule } from './modules/orchestrator/orchestrator.module';

@Module({
  imports: [OrchestratorModule],
})
export class AppModule {}
