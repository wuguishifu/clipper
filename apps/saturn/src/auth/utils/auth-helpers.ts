import type { IncomingHttpHeaders } from 'http';

export const extractAuthTokenFromHeader = (
  headers: IncomingHttpHeaders,
): string | undefined => {
  const [type, token] = headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
};

export const getHeaderValue = (
  headers: IncomingHttpHeaders,
  name: string,
): string | undefined => {
  const value = headers[name.toLowerCase()];
  return typeof value === 'string' ? value : undefined;
};
