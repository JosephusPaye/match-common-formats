import { tlds } from './tlds';
import { MatchCommon } from './main';

export interface Url extends MatchCommon {
  type: 'url';
  url: string;
  scheme: string;
}

export interface Uri extends MatchCommon {
  type: 'uri';
  uri: string;
  scheme: string;
}

export interface Urn extends MatchCommon {
  type: 'urn';
  urn: string;
  namespaceId: string;
  namespaceString: string;
}

// https://regexr.com/5it0q (excludes `scheme://user:pass` part of the URL)
const extractTldRegex = /^(?:[^:\s]:[^:\s])?(?:[^\.\s/:]+\.)+([^\.\s:/]+)(?::\d+)?(?:\/.*)?$/;

/**
 * Check if the given URL segment has a domain with a known TLD.
 * The segment is a partial URL, with everything after `scheme://user:pass`,
 * so it could be (authority + path + ...) or (path + ...).
 */
export function hasKnownTld(segment: string): boolean {
  const match = extractTldRegex.exec(segment);

  if (!match) {
    return false;
  }

  const tld = match[1];

  if (!tld) {
    return false;
  }

  return tlds.includes(tld.toUpperCase());
}

// https://regexr.com/5it7i (excludes `scheme://user:pass` part of the URL)
const localhostRegex = /^(?:[^:\s]+:[^:\s]+)?(?:[^\.\s/:]+\.)*(localhost)(?::\d+)?(?:\/.*)?$/;

/**
 * Check if the given URL segment has the domain `localhost`.
 * The segment is a partial URL, with everything after `scheme://user:pass`,
 * so it could be (authority + path + ...) or (path + ...).
 */
export function hasLocalhost(segment: string) {
  return localhostRegex.test(segment);
}

// https://regexr.com/5it54 (excludes the `urn:` prefix)
const urnRegex = /^([a-zA-Z0-9]+):(.+)$/i;

/**
 * Extract the namespace id and namespace string from the given URN string
 *
 * @param string A URN string, without the `urn:` prefix
 */
function extractUrnAttributes(
  string: string
): { namespaceId: string; namespaceString: string } {
  const attrs = {
    namespaceId: '',
    namespaceString: '',
  };

  const match = urnRegex.exec(string);

  if (match) {
    attrs.namespaceId = match[1].toLowerCase();
    attrs.namespaceString = match[2];
  }

  return attrs;
}

// https://regexr.com/5irtf
const uriRegex = /^(([^:/?#\s\.]+):)?(\/\/([^/?#\s]*))?([^?#\r\n]*)(\?([^#\r\n]*))?(#(.*))?$/;

/**
 * Match the given string to a URN, URL, or URI
 */
export function matchUri(string: string): Url | Uri | Urn | null {
  const input = string.trim();

  if (input.length === 0) {
    return null;
  }

  const match = uriRegex.exec(input);

  if (!match) {
    return null;
  }

  const scheme = match[2];
  const schemeNormalised = (scheme ?? '').toLowerCase();
  const authority = match[4];
  const path = match[5];
  const query = match[7];

  // If the scheme is urn, and path is not empty, then we've got a URN
  if (scheme && schemeNormalised === 'urn' && path) {
    const { namespaceId, namespaceString } = extractUrnAttributes(path);
    return {
      type: 'urn',
      label: namespaceId ? namespaceId + ' URN' : 'URN',
      input: match[0],
      urn: match[0],
      namespaceId,
      namespaceString,
    };
  }
  // If we have a scheme and authority then it's a URL
  else if (scheme && authority) {
    // If the scheme is http or https, we consider it a Web URL
    if (schemeNormalised === 'http' || schemeNormalised === 'https') {
      return {
        type: 'url',
        label: 'Web URL',
        input: match[0],
        url: match[0],
        scheme: schemeNormalised,
      };
    }
    // Otherwise it's a non-web URL, like ftp, ldap, telnet, etc
    // We consider these URLs (and not the more general URL) since
    // they start with `scheme://` (// is present due to authority)
    else {
      return {
        type: 'url',
        label: schemeNormalised + ' URL',
        input: match[0],
        url: match[0],
        scheme: schemeNormalised,
      };
    }
  }
  // If there's a scheme and a path, it's a URI or a localhost URL.
  // This covers URIs like `tel:0123456789` that have no authority
  // segment (`//...`), as well as `localhost:...` URLs.
  else if (scheme && path) {
    // Special handling of `localhost:...`
    if (schemeNormalised === 'localhost') {
      return {
        type: 'url',
        label: 'Web URL',
        input: match[0],
        url: `http://${match[0]}`,
        scheme: 'http',
      };
    } else {
      return {
        type: 'uri',
        label: schemeNormalised + ' URI',
        input: match[0],
        uri: match[0],
        scheme: schemeNormalised,
      };
    }
  }
  // If there's a scheme and a query, it's a URI. This covers URIs like
  // `magnet:?xt=urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a` that
  // have no authority segment (`//...`) and no path segment (`/...`)
  else if (scheme && query) {
    return {
      type: 'uri',
      label: schemeNormalised + ' URI',
      input: match[0],
      uri: match[0],
      scheme: schemeNormalised,
    };
  }
  // If there's no (scheme + authority) or (scheme + path) or (scheme + query),
  // then the path might have a URL without the scheme, like `example.com` or
  // `localhost`. Below we attempt to match those, while excluding paths
  // like `/example.com` or `example.unknowntld`
  else if (path && !path.startsWith('/')) {
    if (hasKnownTld(path) || hasLocalhost(path)) {
      return {
        type: 'url',
        label: 'Web URL',
        input: match[0],
        url: `http://${match[0]}`,
        scheme: 'http',
      };
    }
  }

  return null;
}
