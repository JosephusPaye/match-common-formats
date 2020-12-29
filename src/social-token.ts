import { MatchCommon } from './main';

export interface SocialToken extends MatchCommon {
  type: 'username' | 'hashtag';

  /**
   * The token with the '#' or '@' prefix
   */
  token: string;
}

// https://regexr.com/5jb3f
const tokenRegex = /(?:^@([a-zA-Z0-9\-_]+)$)|(?:^#([a-zA-Z][a-zA-Z0-9_]*)$)/;

/**
 * Match the given string to a social token (@username or #hashtag)
 */
export function matchSocialToken(string: string): SocialToken | null {
  const input = string.trim();

  if (input.length === 0) {
    return null;
  }

  const match = tokenRegex.exec(input);

  if (!match) {
    return null;
  }

  if (match[1]) {
    return {
      type: 'username',
      label: 'Social Media Username',
      token: `@${match[1]}`,
      input,
    };
  } else {
    return {
      type: 'hashtag',
      label: 'Social Media Hashtag',
      token: `#${match[2]}`,
      input,
    };
  }
}
