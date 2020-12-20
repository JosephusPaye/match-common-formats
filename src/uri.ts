import { tlds } from './tlds';
import { Matched } from './main';

export interface Url extends Matched {
  type: 'url';
  url: string;
  scheme: string;
}

export interface Uri extends Matched {
  type: 'uri';
  uri: string;
  scheme: string;
}

export interface Urn extends Matched {
  type: 'urn';
  urn: string;
  namespaceId: string;
  namespaceString: string;
}

// https://regexr.com/5it0q
const extractTldRegex = /^(?:.+@)?(?:.*\.)?[^.\s]+\.([^:\.\s]+)(?::\d+)?(?:\/.*)?$/;

/**
 * Check if the given authority segment has a domain with a known TLD
 */
function hasKnownTld(authority: string): boolean {
  const match = extractTldRegex.exec(authority);

  if (!match) {
    return false;
  }

  const tld = match[1];

  if (!tld) {
    return false;
  }

  return tlds.includes(tld.toUpperCase());
}

// https://regexr.com/5it54 (excludes the initial `urn:`)
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
    attrs.namespaceId = (match[1] ?? '').toLowerCase();
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
      matched: match[0],
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
        matched: match[0],
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
        matched: match[0],
        url: match[0],
        scheme: schemeNormalised,
      };
    }
  }
  // If there's a scheme and a path, it's a URI. This covers URIs like
  // `tel:0123456789` that have no authority segment (`//...`)
  else if (scheme && path) {
    return {
      type: 'uri',
      label: schemeNormalised + ' URI',
      matched: match[0],
      uri: match[0],
      scheme: schemeNormalised,
    };
  }
  // If there's a scheme and a query, it's a URI. This covers URIs like
  //` magnet:?xt=urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a` that
  // have no authority segment (`//...`) and no path segment (`/...`)
  else if (scheme && query) {
    return {
      type: 'uri',
      label: schemeNormalised + ' URI',
      matched: match[0],
      uri: match[0],
      scheme: schemeNormalised,
    };
  }
  // If there's no scheme + authority or scheme + path or scheme + query,
  // then the path might have a URL without the scheme, like `example.com`.
  // Below we attempt to match those, while excluding paths like
  // `/example.com` or `example.unknowntldr`
  else if (path && !path.startsWith('/') && hasKnownTld(path)) {
    return {
      type: 'url',
      label: 'Web URL',
      matched: match[0],
      url: `http://${match[0]}`,
      scheme: 'http',
    };
  }

  return null;
}
