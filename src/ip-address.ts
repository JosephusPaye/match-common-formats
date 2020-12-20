// Regular expressions adapted from ip-regex@v4.2.0
// https://github.com/sindresorhus/ip-regex/blob/v4.2.0/index.js

import { MatchCommon } from './main';

export interface IpAddress extends MatchCommon {
  type: 'ip-address';
  version: 'ipv4' | 'ipv6';
  address: string;
}

const v4 =
  '(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}';
const v4regex = new RegExp(`^${v4}$`);

/**
 * Check if the given input matches an IPv4 address
 */
function matchesIpv4(input: string) {
  return v4regex.test(input);
}

const v6segment = '[a-fA-F\\d]{1,4}';
const v6 = `
(
(?:${v6segment}:){7}(?:${v6segment}|:)|                                         // 1:2:3:4:5:6:7::  1:2:3:4:5:6:7:8
(?:${v6segment}:){6}(?:${v4}|:${v6segment}|:)|                                  // 1:2:3:4:5:6::    1:2:3:4:5:6::8   1:2:3:4:5:6::8  1:2:3:4:5:6::1.2.3.4
(?:${v6segment}:){5}(?::${v4}|(:${v6segment}){1,2}|:)|                          // 1:2:3:4:5::      1:2:3:4:5::7:8   1:2:3:4:5::8    1:2:3:4:5::7:1.2.3.4
(?:${v6segment}:){4}(?:(:${v6segment}){0,1}:${v4}|(:${v6segment}){1,3}|:)|      // 1:2:3:4::        1:2:3:4::6:7:8   1:2:3:4::8      1:2:3:4::6:7:1.2.3.4
(?:${v6segment}:){3}(?:(:${v6segment}){0,2}:${v4}|(:${v6segment}){1,4}|:)|      // 1:2:3::          1:2:3::5:6:7:8   1:2:3::8        1:2:3::5:6:7:1.2.3.4
(?:${v6segment}:){2}(?:(:${v6segment}){0,3}:${v4}|(:${v6segment}){1,5}|:)|      // 1:2::            1:2::4:5:6:7:8   1:2::8          1:2::4:5:6:7:1.2.3.4
(?:${v6segment}:){1}(?:(:${v6segment}){0,4}:${v4}|(:${v6segment}){1,6}|:)|      // 1::              1::3:4:5:6:7:8   1::8            1::3:4:5:6:7:1.2.3.4
(?::((?::${v6segment}){0,5}:${v4}|(?::${v6segment}){1,7}|:))                    // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8  ::8             ::1.2.3.4
)(%[0-9a-zA-Z]{1,})?                                                            // %eth0            %1
`
  .replace(/\s*\/\/.*$/gm, '')
  .replace(/\n/g, '')
  .trim();
const v6regex = new RegExp(`^${v6}$`);

/**
 * Check if the given input matches an IPv6 address
 */
function matchesIpv6(input: string) {
  return v6regex.test(input);
}

/**
 * Match the given string to an IPv4 or IPv6 address
 */
export function matchIpAddress(string: string): IpAddress | null {
  const input = string.trim();

  if (input.length === 0) {
    return null;
  }

  if (matchesIpv4(input)) {
    return {
      type: 'ip-address',
      label: 'IPv4 Address',
      input: input,
      version: 'ipv4',
      address: input,
    };
  }

  if (matchesIpv6(input)) {
    return {
      type: 'ip-address',
      label: 'IPv6 Address',
      input: input,
      version: 'ipv6',
      address: input,
    };
  }

  return null;
}
