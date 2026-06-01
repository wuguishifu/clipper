import { Module } from '@nestjs/common';

import { ClaudeModule } from '../claude/claude.module';

@Module({
  imports: [ClaudeModule],
})
export class AnalysisModule {}
