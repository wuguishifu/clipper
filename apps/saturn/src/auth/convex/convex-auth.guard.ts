import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { jwtVerify, type JWTVerifyGetKey } from 'jose';

import type { IncomingHttpHeaders } from 'http';

import { EnvironmentService } from '../../environment/environment-service';
import { extractAuthTokenFromHeader } from '../utils/auth-helpers';

import {
  ADMIN_SESSION,
  CONVEX_AUTH_OPTIONS,
  CONVEX_JWKS,
} from './convex-auth.tokens';
import type { ConvexAuthOptions, ConvexJwtPayload } from './convex-auth.types';

type AuthenticatedRequest = {
  headers: IncomingHttpHeaders;
  user?: ConvexJwtPayload;
};

const normalizeHeaders = (
  headers: AuthenticatedRequest['headers'],
): IncomingHttpHeaders => ({
  ...headers,
  authorization: Array.isArray(headers.authorization)
    ? headers.authorization[0]
    : headers.authorization,
});

@Injectable()
export class ConvexAuthGuard implements CanActivate {
  constructor(
    @Inject(CONVEX_JWKS)
    private readonly jwks: JWTVerifyGetKey,
    @Inject(CONVEX_AUTH_OPTIONS)
    private readonly options: ConvexAuthOptions,
    private readonly environmentService: EnvironmentService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = extractAuthTokenFromHeader(normalizeHeaders(request.headers));

    if (!token) {
      throw new UnauthorizedException('Missing authorization');
    }

    const adminUserIdOverride = request.headers['x-user-id'];
    if (
      token === this.environmentService.environment.adminApiToken &&
      typeof adminUserIdOverride === 'string'
    ) {
      request.user = {
        sub: `${adminUserIdOverride}|${ADMIN_SESSION}`,
      };
      return true;
    }

    try {
      const { payload } = await jwtVerify<ConvexJwtPayload>(token, this.jwks, {
        issuer: this.options.issuer,
      });

      // Payload will look something like this:
      // {
      //   sub: "jx7chp2xw6s4bwjhfc1wqpbh0n85cey8|jh7f2qbh5wv76p6dgp8c4jr8kd85c2ea",
      //   iat: 1776989046,
      //   iss: "https://jupiter-actions.wuguishifu.dev",
      //   aud: "convex",
      //   exp: 1776992646,
      // }
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
