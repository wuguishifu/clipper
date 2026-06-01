import { GenericActionCtx } from 'convex/server';
import { z } from 'zod';

import { httpAction } from '../../_generated/server';

// This is the required type for handlers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyActionCtx = GenericActionCtx<any>;

export function ensureAuthorized(
  request: Request,
): { authorized: false; reason: string } | { authorized: true } {
  const headers = request.headers;
  const authorization = headers.get('Authorization');
  if (!authorization) {
    return { authorized: false, reason: 'no authorization header found' };
  }

  const token = authorization.split('Bearer ')[1];
  if (!token) {
    return { authorized: false, reason: 'no token found' };
  }

  if (token !== process.env.CONVEX_ADMIN_TOKEN) {
    return { authorized: false, reason: 'invalid token' };
  }

  return { authorized: true };
}

export function httpPostAction<T extends z.ZodType = z.ZodType>({
  handler,
  bodySchema,
  requiresAuthorization = true,
}: {
  handler: (args: {
    ctx: AnyActionCtx;
    request: Request;
    body: z.infer<T>;
  }) => Promise<Response>;
  bodySchema: T;
  requiresAuthorization?: boolean;
}) {
  return httpAction(async (ctx, request) => {
    if (requiresAuthorization) {
      const authResult = ensureAuthorized(request);
      if (!authResult.authorized) {
        return new Response(authResult.reason, { status: 403 });
      }
    }

    const parsed = bodySchema.safeParse(await request.json());
    if (!parsed.success) {
      return new Response(parsed.error.toString(), { status: 400 });
    }

    return handler({ ctx, request, body: parsed.data });
  });
}
