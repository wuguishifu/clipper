import { Module } from '@nestjs/common';

import { AuthModule } from '../../auth/auth.module';
import { ClaudeModule } from '../claude/claude.module';
import { EntitlementsService } from '../entitlements/entitlements-service';

import { AnalysisController } from './analysis.controller';
import { AnalysisService } from './analysis.service';

@Module({
  imports: [ClaudeModule],
  controllers: [AnalysisController],
  providers: [AnalysisService, EntitlementsService],
})
export class AnalysisModule {}
