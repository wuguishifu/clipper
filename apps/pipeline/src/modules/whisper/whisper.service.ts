import { Injectable, Logger } from '@nestjs/common';
import { spawn } from 'child_process';
import { once } from 'events';
import path from 'path';

import { binPath } from '../../common/constants';

const DEFAULT_WHISPER_TIMEOUT_MS = 5 * 60 * 1000;

type WhisperResult = { success: true } | { success: false; reason: string };

@Injectable()
export class WhisperService {
  private readonly logger = new Logger(WhisperService.name);

  public async transcribeAudio({
    inputPath,
    overrideTimeoutMs,
  }: {
    inputPath: string;
    overrideTimeoutMs?: number;
  }): Promise<WhisperResult> {
    this.logger.debug(`Starting transcription for ${inputPath}`);
    const abortController = new AbortController();

    const outputBase = path.join(
      path.dirname(inputPath),
      path.parse(inputPath).name,
    );
    const args = [
      '-m',
      path.join(binPath, 'ggml-base.en.bin'),
      '-f',
      inputPath,
      '-oj',
      '-of',
      outputBase,
      '-np',
      '-t',
      '8',
      '--no-gpu',
      // '--vad', this causes a crash currently because it's not built into my testing binary
      '--prompt',
      '"[laughter], [laughing], lol, haha"',
    ];
    this.logger.debug(`Spawning Whisper with args: ${args.join(' ')}`);

    const whisperCli = path.join(binPath, 'whisper-cli');
    const whisper = spawn(whisperCli, args);

    const timeoutMs = overrideTimeoutMs ?? DEFAULT_WHISPER_TIMEOUT_MS;
    const timeout = setTimeout(() => abortController.abort(), timeoutMs);

    whisper.stderr.on('data', (data) => this.logger.debug(data.toString()));
    whisper.stdout.on('data', (data) => this.logger.debug(data.toString()));

    await once(whisper, 'close');
    clearTimeout(timeout);
    if (whisper.exitCode !== 0) {
      return {
        success: false,
        reason: `Whisper exited with code ${whisper.exitCode}`,
      };
    }

    return { success: true };
  }
}
