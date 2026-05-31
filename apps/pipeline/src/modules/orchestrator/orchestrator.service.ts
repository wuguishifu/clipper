import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

import { FFmpegService } from '../ffmpeg/ffmpeg.service';
import { WhisperService } from '../whisper/whisper.service';

const testDir = path.join(__dirname, '..', '..', '..', '..', '..', 'test');

type WhisperSegment = {
  timestamps: { from: string; to: string };
  offsets: { from: number; to: number };
  text: string;
};

type WhisperOutput = {
  transcription: WhisperSegment[];
};

type TranscriptSegment = {
  speaker: string;
  start: number;
  end: number;
  text: string;
};

function parseWhisperJson(raw: string, speaker: string): TranscriptSegment[] {
  const parsed = JSON.parse(raw) as WhisperOutput;
  return parsed.transcription
    .map((segment) => ({
      speaker,
      start: segment.offsets.from / 1000,
      end: segment.offsets.to / 1000,
      text: segment.text.trim(),
    }))
    .filter((segment) => segment.text.length > 0);
}

@Injectable()
export class OrchestratorService implements OnModuleInit {
  private readonly logger = new Logger(OrchestratorService.name);

  constructor(
    private readonly ffmpegService: FFmpegService,
    private readonly whisperService: WhisperService,
  ) {}

  public async onModuleInit() {
    const inputPath = path.join(testDir, 'input.mp4');

    const hostAudioPath = path.join(testDir, 'host.wav');
    const othersAudioPath = path.join(testDir, 'others.wav');

    this.logger.log('Extracting audio streams...');
    const [hostExtract, othersExtract] = await Promise.all([
      this.ffmpegService.extractAudio({
        inputPath,
        outputPath: hostAudioPath,
        streamIndex: 3,
      }),
      this.ffmpegService.extractAudio({
        inputPath,
        outputPath: othersAudioPath,
        streamIndex: 2,
      }),
    ]);

    if (!hostExtract.success)
      throw new Error(`Host audio extraction failed: ${hostExtract.reason}`);
    if (!othersExtract.success)
      throw new Error(
        `Others audio extraction failed: ${othersExtract.reason}`,
      );

    this.logger.log('Transcribing audio streams...');
    const [hostTranscript, othersTranscript] = await Promise.all([
      this.whisperService.transcribeAudio({ inputPath: hostAudioPath }),
      this.whisperService.transcribeAudio({ inputPath: othersAudioPath }),
    ]);

    if (!hostTranscript.success)
      throw new Error(`Host transcription failed: ${hostTranscript.reason}`);
    if (!othersTranscript.success)
      throw new Error(
        `Others transcription failed: ${othersTranscript.reason}`,
      );

    this.logger.log('Combining transcripts...');
    const [hostRaw, othersRaw] = await Promise.all([
      readFile(hostTranscript.outputPath, 'utf-8'),
      readFile(othersTranscript.outputPath, 'utf-8'),
    ]);

    const segments: TranscriptSegment[] = [
      ...parseWhisperJson(hostRaw, 'host'),
      ...parseWhisperJson(othersRaw, 'others'),
    ].sort((a, b) => a.start - b.start);

    const outputPath = path.join(testDir, 'transcript.json');
    await writeFile(outputPath, JSON.stringify(segments, null, 2), 'utf-8');
    this.logger.log(`Transcript written to ${outputPath}`);
  }
}
