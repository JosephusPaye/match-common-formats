import { matchColor, Color } from './color';
import { matchUri, Uri, Url, Urn } from './uri';
import { matchIpAddress, IpAddress } from './ip-address';
import { matchEmailAddress, EmailAddress } from './email-address';
import { matchSocialToken, SocialToken } from './social-token';
import { matchCurrency, Currency } from './currency';

export { matchColor, Color };
export { matchUri, Uri, Url, Urn };
export { matchIpAddress, IpAddress };
export { matchEmailAddress, EmailAddress };
export { matchSocialToken, SocialToken };
export { matchCurrency, Currency };

export interface MatchCommon {
  type: string;
  label: string;
  input: string;
}

export type Match =
  | Uri
  | Url
  | Urn
  | IpAddress
  | Color
  | EmailAddress
  | SocialToken
  | Currency;

export type Matcher = (string: string) => Match | null;

export interface MatchOptions {
  /**
   * A list of matchers to apply, defaults to all matchers
   */
  matchers?: Matcher[];

  /**
   * Stop matching after the first match
   * @default false
   */
  matchOne?: boolean;
}

/**
 * The default matchers
 */
export const defaultMatchers: Matcher[] = [
  matchEmailAddress,
  matchUri,
  matchIpAddress,
  matchColor,
  matchSocialToken,
  matchCurrency,
];

/**
 * Compare the given string to known formats, optionally only those
 * matched by the given matchers, and get the matches
 */
export function match(string: string, options: MatchOptions = {}): Match[] {
  if (!string || string.trim().length === 0) {
    return [];
  }

  const { matchers, matchOne } = Object.assign(
    {
      matchers: defaultMatchers,
      matchOne: false,
    },
    options
  );

  const allMatches: Match[] = [];

  for (const matcher of matchers) {
    const match = matcher(string);

    if (match) {
      allMatches.push(match);

      if (matchOne) {
        break;
      }
    }
  }

  return allMatches;
}
