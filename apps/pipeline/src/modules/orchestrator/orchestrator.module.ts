import { Module } from '@nestjs/common';

import { OrchestratorService } from './orchestrator.service';
import { FFmpegModule } from '../ffmpeg/ffmpeg.module';
import { WhisperModule } from '../whisper/whisper.module';

@Module({
  imports: [FFmpegModule, WhisperModule],
  providers: [OrchestratorService],
})
export class OrchestratorModule {}
