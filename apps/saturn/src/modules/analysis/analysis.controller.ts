import { Controller, UseGuards } from '@nestjs/common';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';

import { saturnRootRouter } from '@clipper/contracts-saturn';

import { ConvexAuthGuard, ConvexUser } from '../../auth/convex';

import { AnalysisService } from './analysis.service';

@UseGuards(ConvexAuthGuard)
@Controller()
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @TsRestHandler(saturnRootRouter.v1.analysis.analyzeTranscript)
  public analyzeTranscript(@ConvexUser() user: ConvexUser) {
    return tsRestHandler(
      saturnRootRouter.v1.analysis.analyzeTranscript,
      async ({ body: { transcript } }) => {
        return {
          status: 200,
          body: await this.analysisService.analyzeTranscript({
            transcript,
            user,
          }),
        };
      },
    );
  }
}
