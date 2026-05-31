import { Injectable, Logger } from '@nestjs/common';
import { spawn } from 'child_process';
import { once } from 'events';

const DEFAULT_FFMPEG_TIMEOUT_MS = 5 * 60 * 1000;

type FFmpegResult = { success: true } | { success: false; reason: string };

@Injectable()
export class FFmpegService {
  private readonly logger = new Logger(FFmpegService.name);

  public async extractAudio({
    inputPath,
    outputPath,
    streamIndex,
    overrideTimeoutMs,
  }: {
    inputPath: string;
    outputPath: string;
    streamIndex?: number;
    overrideTimeoutMs?: number;
  }): Promise<FFmpegResult> {
    this.logger.debug(
      `Starting audio extraction for ${inputPath}${streamIndex !== undefined ? ` (stream ${streamIndex})` : ''}`,
    );
    const abortController = new AbortController();

    const ffmpegArgs = [
      '-nostdin',
      '-y',
      '-i',
      inputPath,
      ...(streamIndex !== undefined ? ['-map', `0:${streamIndex}`] : []),
      '-vn',
      '-ar',
      '16000',
      '-ac',
      '1',
      '-c:a',
      'pcm_s16le',
      outputPath,
    ];
    this.logger.debug(`Spawning FFmpeg with args: ${ffmpegArgs.join(' ')}`);

    const ffmpeg = spawn('ffmpeg', ffmpegArgs);
    const timeoutMs = overrideTimeoutMs ?? DEFAULT_FFMPEG_TIMEOUT_MS;
    const timeout = setTimeout(() => abortController.abort(), timeoutMs);

    ffmpeg.stderr.on('data', (data) => this.logger.debug(data.toString()));
    ffmpeg.stdout.on('data', (data) => this.logger.debug(data.toString()));

    await once(ffmpeg, 'close');
    clearTimeout(timeout);
    if (ffmpeg.exitCode !== 0) {
      return {
        success: false,
        reason: `FFmpeg exited with code ${ffmpeg.exitCode}`,
      };
    }

    return { success: true };
  }
}
