import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { ADMIN_SESSION } from './convex-auth.tokens';
import { ConvexJwtPayload } from './convex-auth.types';

export type ConvexUser = {
  id: string;
  isAdmin: boolean;
};

export const ConvexUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): ConvexUser => {
    const request = context.switchToHttp().getRequest<{
      user?: unknown;
    }>();

    const maybeUser = ConvexJwtPayload.safeParse(request.user);
    if (maybeUser.success) {
      const [userId, _sessionId] = maybeUser.data.sub.split('|');
      if (userId) {
        return {
          id: userId,
          isAdmin: _sessionId === ADMIN_SESSION,
        };
      }
    }

    throw new HttpException(
      {
        message: 'user data validation failed',
        errors: maybeUser.error,
      },
      HttpStatus.BAD_REQUEST,
    );
  },
);
