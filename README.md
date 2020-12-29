# match-common-formats

> Match a piece of text to common formats like URLs, email addresses, colors, and more.

Due to the large number of formats to match, this project is completed in parts:

- Part 1: _URIs (URIs + URNs + URLs)_ and _IP Addresses (IPv4 + IPv6)_: Published in [v0.1.0](https://github.com/JosephusPaye/match-common-formats/releases/tag/v0.1.0).
- Part 2: _Colors - RGB hexadecimal (8, 6, 4, and 3-character codes); `rgb()`, `rgba()`, `hsl()`, and `hsla()` (with comma and space separators)_: Published in [v0.2.0](https://github.com/JosephusPaye/match-common-formats/releases/tag/v0.2.0).
- Part 3: _Email addresses and social tokens (@usernames and #hashtags)_: Published in [v0.3.0](https://github.com/JosephusPaye/match-common-formats/releases/tag/v0.3.0).

This project is part of [#CreateWeekly](https://twitter.com/JosephusPaye/status/1214853295023411200), my attempt to create something new publicly every week in 2020.

## Installation

```bash
npm install -g @josephuspaye/match-common-formats
```

## Usage

### Match with all matchers

The following example shows how to match a piece of text with all matchers:

```js
import { match } from '@josephuspaye/match-common-formats';

const first = match('example.com');
const second = match('192.168.0.1');
const third = match('hello@example.com');

console.log({ first, second, third });
```

<details>
<summary>View output</summary>

```json
{
  "first": [
    {
      "type": "url",
      "label": "Web URL",
      "input": "example.com",
      "url": "http://example.com",
      "scheme": "http"
    }
  ],
  "second": [
    {
      "type": "ip-address",
      "label": "IPv4 Address",
      "input": "192.168.0.1",
      "version": "ipv4",
      "address": "192.168.0.1"
    }
  ],
  "third": [
    {
      "type": "email-address",
      "label": "Email Address",
      "input": "hello@example.com",
      "address": "hello@example.com"
    },
    {
      "type": "url",
      "label": "Web URL",
      "input": "hello@example.com",
      "url": "http://hello@example.com",
      "scheme": "http"
    }
  ]
}
```

</details>

### Match with select matchers

The following example shows how to match a piece of text with select matchers:

```js
import {
  match,
  matchUri,
  matchIpAddress,
} from '@josephuspaye/match-common-formats';

const first = match('example.com', [matchUri]);
const second = match('example.com', [matchIpAddress]); // matches will be empty

console.log({ first, second });
```

<details>
<summary>View output</summary>

```json
{
  "first": [
    {
      "type": "url",
      "label": "Web URL",
      "input": "example.com",
      "url": "http://example.com",
      "scheme": "http"
    }
  ],
  "second": []
}
```

</details>

### Match with a single matcher

The following example shows how to match a piece of text with a single matcher:

```js
import { match, matchIpAddress } from '@josephuspaye/match-common-formats';

const first = matchIpAddress('10.0.0.1');
const second = matchIpAddress('example.com'); // no match

console.log({ first, second });
```

<details>
<summary>View output</summary>

```json
{
  "first": {
    "type": "ip-address",
    "label": "IPv4 Address",
    "input": "10.0.0.1",
    "version": "ipv4",
    "address": "10.0.0.1"
  },
  "second": null
}
```

</details>

## API

```ts
interface MatchCommon {
  type: string;
  label: string;
  input: string;
}

interface Url extends MatchCommon {
  type: 'url';
  url: string;
  scheme: string;
}

interface Uri extends MatchCommon {
  type: 'uri';
  uri: string;
  scheme: string;
}

interface Urn extends MatchCommon {
  type: 'urn';
  urn: string;
  namespaceId: string;
  namespaceString: string;
}

interface IpAddress extends MatchCommon {
  type: 'ip-address';
  version: 'ipv4' | 'ipv6';
  address: string;
}

interface Color extends MatchCommon {
  type: 'color';
  format: 'hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla';
  color: string;
}

interface EmailAddress extends MatchCommon {
  type: 'email-address';
  address: string;
}

interface SocialToken extends MatchCommon {
  type: 'username' | 'hashtag';

  /**
   * The username or hashtag, with the # or @ prefix
   */
  token: string;
}

type Match = Uri | Url | Urn | IpAddress | Color | EmailAddress | SocialToken;

type Matcher = (string: string) => Match | null;

/**
 * The default matchers
 */
const defaultMatchers: Matcher[];

/**
 * Match the given string to a URN, URL, or URI
 */
function matchUri(string: string): Url | Uri | Urn | null;

/**
 * Match the given string to an IPv4 or IPv6 address
 */
function matchIpAddress(string: string): IpAddress | null;

/**
 * Match the given string to a hex (RGB), rgb(), rgba(), hsl(), or hsla() color code
 */
function matchColor(string: string): Color | null;

/**
 * Match the given string to an email address
 */
function matchEmailAddress(string: string): EmailAddress | null;

/**
 * Match the given string to a social token (@username or #hashtag)
 */
function matchSocialToken(string: string): SocialToken | null;

/**
 * Compare the given string to formats matched by the given matchers,
 * and get all matches.
 *
 * @param string   The string to match
 * @param matchers A list of matchers to apply, defaults to all matchers
 */
function match(string: string, matchers?: Matcher[]): Match[];
```

## Licence

[MIT](LICENCE)
