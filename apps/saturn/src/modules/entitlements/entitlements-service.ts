import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EntitlementsService {
  private readonly logger = new Logger(EntitlementsService.name);

  public async resolveEntitlements({ userId }: { userId: string }) {
    this.logger.debug(`Entitlements resolved for ${userId}`);
    return await Promise.resolve(true);
  }
}
