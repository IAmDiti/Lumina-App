/** Ensures a URL string has a protocol, defaulting to https:// if it's missing one. */
export function ensureProtocol(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}
