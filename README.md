# match-common-formats

> Match a piece of text to common formats like URLs, email addresses, colors, and more.

Due to the large number of formats to match, this project is completed in parts:

- Part 1: _URIs (URIs + URNs + URLs)_ and _IP Addresses (IPv4 + IPv6)_: Published in [v0.1.0](https://github.com/JosephusPaye/match-common-formats/releases/tag/v0.1.0).
- Part 2: _Colors - RGB hexadecimal (8, 6, 4, and 3-character codes); `rgb()`, `rgba()`, `hsl()`, and `hsla()` (with comma and space separators)_: Published in [v0.2.0](https://github.com/JosephusPaye/match-common-formats/releases/tag/v0.2.0).
- Part 3: _Email addresses_ and _social tokens (@mentions and #hashtags)_: Published in [v0.3.0](https://github.com/JosephusPaye/match-common-formats/releases/tag/v0.3.0).

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

const first = match('example.com'); // matches a URL
const second = match('192.168.0.1'); // matches an IP address
const third = match('hello@example.com'); // matches an email address and a URL

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

### Stop matching after first match

The following example shows how to match a piece of text with all matchers, stopping after the first match:

```js
import { match } from '@josephuspaye/match-common-formats';

// Would normally match a hex color code and a hashtag, but specifying `matchOne`
// stops after the first match, returning only the color match
const matches = match('#bad', { matchOne: true });

console.log({ matches });
```

<details>
<summary>View output</summary>

```json
{
  "matches": [
    {
      "input": "#bad",
      "expected": [
        {
          "type": "color",
          "label": "Hexadecimal Color Code",
          "input": "#bad",
          "format": "hex",
          "color": "#bad"
        }
      ]
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

const first = match('example.com', { matchers: [matchUri] });
const second = match('example.com', { matchers: [matchIpAddress] }); // matches will be empty

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

### Match with a specific matcher

The following example shows how to match a piece of text with a specific matcher:

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

## Available formats

| Format                      | Type                  | Input example                           |
| :-------------------------- | :-------------------- | :-------------------------------------- |
| [URI][1]                    | `uri` (`data`)        | `data:image/png;base64,...`             |
| [URN][2]                    | `urn` (`isbn`)        | `urn:isbn:0451450523`                   |
| [URL][3]                    | `url` (`http`)        | `get.pizza`                             |
| URL                         | `url` (`https`)       | `https://example.com`                   |
| URL                         | `url` (`http`)        | `localhost:3000`                        |
| [IP Address][4]             | `ip-address` (`ipv4`) | `127.0.0.1`                             |
| IP Address                  | `ip-address` (`ipv6`) | `::1`                                   |
| [RGB Color (Hex)][5]        | `color` (`hex`)       | `#bad`, `#bada55`, `#abcd`, `#aabbccdd` |
| [RGB Color][5]              | `color` (`rgb`)       | `rgb(22, 22, 22)`                       |
| RGB Alpha Color             | `color` (`rgba`)      | `rgba(22, 22, 22, 0.5)`                 |
| [HSL Color][6]              | `color` (`hsl`)       | `hsl(22deg, 50%, 20%)`                  |
| HSL Alpha Color             | `color` (`hsla`)      | `hsla(22deg, 50%, 20%, 80%)`            |
| Email address\*             | `email-address`       | `john.doe+newsletters@example.com`      |
| [Social token (mention)][7] | `mention`             | `@JosephusPaye`                         |
| [Social token (hashtag)][8] | `hashtag`             | `#CreateWeekly`                         |

[1]: https://en.wikipedia.org/wiki/Uniform_Resource_Identifier
[2]: https://en.wikipedia.org/wiki/Uniform_Resource_Name
[3]: https://en.wikipedia.org/wiki/URL
[4]: https://en.wikipedia.org/wiki/IP_address
[5]: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#RGB_colors
[6]: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#HSL_colors
[7]: https://en.wikipedia.org/wiki/Mention_(blogging)
[8]: https://en.wikipedia.org/wiki/Hashtag

### Notes

- The email address matcher is not technically "complete", as it doesn't match addresses with unknown TLDs, IP addresses, or special characters in the local part that are not `+`, `-`, `_`, or `.`. It is designed to match only a subset of technically valid email address, ones that are more "common".

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
  type: 'mention' | 'hashtag';

  /**
   * The mention or hashtag, with the @ or # prefix
   */
  token: string;
}

type Match = Uri | Url | Urn | IpAddress | Color | EmailAddress | SocialToken;

type Matcher = (string: string) => Match | null;

interface MatchOptions {
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
 * Match the given string to a social token (@mention or #hashtag)
 */
function matchSocialToken(string: string): SocialToken | null;

/**
 * Compare the given string to known formats, optionally only those
 * matched by the given matchers, and get the matches
 */
function match(string: string, options?: MatchOptions): Match[];
```

## Licence

[MIT](LICENCE)
