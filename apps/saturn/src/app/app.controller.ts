import { Controller, Get } from '@nestjs/common';

import { EnvironmentService } from '../environment/environment-service';

@Controller()
export class AppController {
  constructor(private readonly environmentService: EnvironmentService) {}

  @Get('api/version')
  getVersion() {
    return {
      status: 200,
      version: 'unknown',
      environment: this.environmentService.environment.environment,
    };
  }

  @Get('api/health')
  getHealth() {
    return {
      status: 200,
    };
  }
}
