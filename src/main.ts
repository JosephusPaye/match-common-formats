import { matchUri, Uri, Url, Urn } from './uri';
import { matchIpAddress, IpAddress } from './ip-address';

export { matchUri, Uri, Url, Urn };
export { matchIpAddress, IpAddress };

export interface MatchCommon {
  type: string;
  label: string;
  input: string;
}

export type Match = Uri | Url | Urn | IpAddress;

export type Matcher = (string: string) => Match | null;

/**
 * The default matchers
 */
export const defaultMatchers: Matcher[] = [matchUri, matchIpAddress];

/**
 * Compare the given string to formats matched by the given matchers,
 * and get all matches.
 *
 * @param string   The string to match
 * @param matchers A list of matchers to apply, defaults to all matchers
 */
export function match(string: string, matchers = defaultMatchers): Match[] {
  if (!string || string.trim().length === 0) {
    return [];
  }

  const allMatches: Match[] = [];

  for (const matcher of matchers) {
    const match = matcher(string);

    if (match) {
      allMatches.push(match);
    }
  }

  return allMatches;
}
