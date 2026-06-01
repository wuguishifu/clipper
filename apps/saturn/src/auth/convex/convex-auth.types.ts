import { z } from 'zod';

export type ConvexAuthOptions = {
  convexSiteUrl: string;
  issuer: string;
  jwksUri: string;
  cacheMaxAge?: number;
  cooldownDuration?: number;
  timeoutDuration?: number;
};

export const ConvexJwtPayload = z.looseObject({
  sub: z.string().refine((val) => val.includes('|'), {
    // Convex JWT payload contains a sub that is a combination of a user ID and a session ID separated by a pipe character
    message: "sub must contain a '|' character",
  }),
});

export type ConvexJwtPayload = z.infer<typeof ConvexJwtPayload>;
