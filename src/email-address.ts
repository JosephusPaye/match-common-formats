import { MatchCommon } from './main';
import { hasKnownTld, hasLocalhost } from './uri';

export interface EmailAddress extends MatchCommon {
  type: 'email-address';
  address: string;
}

// https://regexr.com/5jb1j (technically incomplete, but matches most "common" addresses)
// Also, intended to be used with an additional validation of the domain against known TLDs
const emailAddressRegex = /^((?:[a-zA-Z0-9\-_\+]|\.(?!\.)){1,64})@([^@\s]{2,})$/;

/**
 * Match the given string to an email address
 */
export function matchEmailAddress(string: string): EmailAddress | null {
  const input = string.trim();

  if (input.length === 0) {
    return null;
  }

  const match = emailAddressRegex.exec(input);

  if (!match) {
    return null;
  }

  const domain = match[2];

  if (hasKnownTld(domain) || hasLocalhost(domain)) {
    return {
      type: 'email-address',
      label: 'Email Address',
      address: input,
      input,
    };
  }

  return null;
}
