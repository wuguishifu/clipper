import { Injectable, Logger } from '@nestjs/common';

import { ClipResult, clipResultSchema } from '@clipper/contracts-saturn';

import { ClaudeService } from '../claude/claude.service';

import {
  exampleResponse,
  exampleTranscript,
  systemPrompt,
  userPrompt,
} from './prompts';

@Injectable()
export class AnalysisService {
  private readonly logger = new Logger(AnalysisService.name);

  constructor(private readonly claudeService: ClaudeService) {}

  public async analyzeTranscript(transcript: string): Promise<ClipResult> {
    this.logger.debug('analysis_service-analyze_transcript-start');
    const response = await this.claudeService.createMessage({
      model: 'claude-sonnet-4-6',
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: exampleTranscript,
        },
        {
          role: 'assistant',
          content: [
            {
              type: 'text',
              text: exampleResponse,
              cache_control: {
                type: 'ephemeral',
              },
            },
          ],
        },
        {
          role: 'user',
          content: userPrompt(transcript),
        },
      ],
    });

    if (!response.ok) throw new Error(response.reason);

    this.logger.debug('analysis_service-analyze_transcript-completed');

    const message = response.response.content[0];
    if (message?.type !== 'text') throw new Error('invalid model response');
    const text = message.text;
    return clipResultSchema.parse(JSON.parse(text));
  }
}
