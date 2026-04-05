import { Injectable, OnModuleInit } from '@nestjs/common';
import path from 'path';

import { FFmpegService } from '../ffmpeg/ffmpeg.service';
import { WhisperService } from '../whisper/whisper.service';

const testDir = path.join(__dirname, '..', '..', '..', '..', '..', 'test');

@Injectable()
export class OrchestratorService implements OnModuleInit {
  constructor(
    private readonly ffmpegService: FFmpegService,
    private readonly whisperService: WhisperService,
  ) {}

  public async onModuleInit() {
    const inputPath = path.join(testDir, 'input.mp4');
    const outputPath = path.join(testDir, 'output.wav');

    await this.ffmpegService.extractAudio({ inputPath, outputPath });
    await this.whisperService.transcribeAudio({ inputPath: outputPath });
  }
}
