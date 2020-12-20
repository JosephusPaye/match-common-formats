// @ts-check

// These tests are not exhaustive, they're only meant to test the wrapping code
// around the IP address regular expressions adapted from ip-regex@v4.2.0.
// The regular expressions are tested comprehensively in that package.
// See https://github.com/sindresorhus/ip-regex/blob/v4.2.0/test.js

import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { matchIpAddress } from '../';

function filterTestCases(cases) {
  let filtered = cases.filter((c) => c.only);

  if (filtered.length === 0) {
    filtered = cases;
  }

  return filtered;
}

test('matchIpAddress() returns null for empty and whitespace-only input', () => {
  const cases = [
    {
      input: '',
      expected: null,
    },
    {
      input: '  ',
      expected: null,
    },
    {
      input: ' \r\n ',
      expected: null,
    },
  ];

  for (const testCase of filterTestCases(cases)) {
    assert.equal(
      matchIpAddress(testCase.input),
      testCase.expected,
      `matches ${testCase.input} correctly`
    );
  }
});

test('matchIpAddress() matches IPv4 addresses', () => {
  const cases = [
    '0.0.0.0',
    '8.8.8.8',
    '127.0.0.1',
    '100.100.100.100',
    '192.168.0.1',
  ].map((ip) => {
    return {
      input: ip,
      expected: {
        type: 'ip-address',
        label: 'IPv4 Address',
        matched: ip,
        version: 'ipv4',
        address: ip,
      },
    };
  });

  for (const testCase of filterTestCases(cases)) {
    assert.equal(
      matchIpAddress(testCase.input),
      testCase.expected,
      `matches ${testCase.input} correctly`
    );
  }
});

test("matchIpAddress() doesn't match non-IPv4 addresses", () => {
  const cases = [
    '.100.100.100.100',
    '100..100.100.100.',
    '100.100.100.100.',
    '999.999.999.999',
    '256.256.256.256',
  ].map((ip) => {
    return {
      input: ip,
      expected: null,
    };
  });

  for (const testCase of filterTestCases(cases)) {
    assert.equal(
      matchIpAddress(testCase.input),
      testCase.expected,
      `matches ${testCase.input} correctly`
    );
  }
});

test('matchIpAddress() matches IPv6 addresses', () => {
  const cases = ['::', '1::', '::1', '1::8', '1::7:8'].map((ip) => {
    return {
      input: ip,
      expected: {
        type: 'ip-address',
        label: 'IPv6 Address',
        matched: ip,
        version: 'ipv6',
        address: ip,
      },
    };
  });

  for (const testCase of filterTestCases(cases)) {
    assert.equal(
      matchIpAddress(testCase.input),
      testCase.expected,
      `matches ${testCase.input} correctly`
    );
  }
});

test("matchIpAddress() doesn't match non-IPv4 addresses", () => {
  const cases = [
    '1:',
    ':1',
    '11:36:12',
    '02001:0000:1234:0000:0000:C1C0:ABCD:0876',
    '2001:0000:1234:0000:00001:C1C0:ABCD:0876',
  ].map((ip) => {
    return {
      input: ip,
      expected: null,
    };
  });

  for (const testCase of filterTestCases(cases)) {
    assert.equal(
      matchIpAddress(testCase.input),
      testCase.expected,
      `matches ${testCase.input} correctly`
    );
  }
});

test.run();
