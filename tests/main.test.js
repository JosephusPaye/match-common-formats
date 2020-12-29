// @ts-check

import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { match, matchUri, matchIpAddress, matchEmailAddress } from '../';

function filterTestCases(cases) {
  let filtered = cases.filter((c) => c.only);

  if (filtered.length === 0) {
    filtered = cases;
  }

  return filtered;
}

test('match() returns an empty list for empty or whitespace-only input', () => {
  const cases = [
    {
      input: '',
      expected: [],
    },
    {
      input: '  ',
      expected: [],
    },
    {
      input: ' \r\n ',
      expected: [],
    },
  ];

  for (const testCase of filterTestCases(cases)) {
    assert.equal(
      match(testCase.input),
      testCase.expected,
      `matches ${testCase.input} correctly`
    );
  }
});

test('match() matches with the defualt list of matchers', () => {
  const cases = [
    {
      input: 'example.com',
      expected: [
        {
          type: 'url',
          label: 'Web URL',
          input: 'example.com',
          url: 'http://example.com',
          scheme: 'http',
        },
      ],
    },
    {
      input: '127.0.0.1',
      expected: [
        {
          type: 'ip-address',
          label: 'IPv4 Address',
          input: '127.0.0.1',
          version: 'ipv4',
          address: '127.0.0.1',
        },
      ],
    },
    {
      input: '#AAA',
      expected: [
        {
          type: 'color',
          label: 'Hexadecimal Color Code',
          input: '#AAA',
          format: 'hex',
          color: '#aaa',
        },
      ],
    },
    {
      input: 'come+and@get.some.pizza',
      expected: [
        {
          type: 'email-address',
          label: 'Email Address',
          input: 'come+and@get.some.pizza',
          address: 'come+and@get.some.pizza',
        },
        {
          type: 'url',
          label: 'Web URL',
          input: 'come+and@get.some.pizza',
          url: 'http://come+and@get.some.pizza',
          scheme: 'http',
        },
      ],
    },
  ];

  for (const testCase of filterTestCases(cases)) {
    assert.equal(
      match(testCase.input),
      testCase.expected,
      `matches ${testCase.input} correctly`
    );
  }
});

test('match() matches with a custom list of matchers', () => {
  assert.equal(match('example.com', [matchIpAddress]), []);
  assert.equal(match('example.com', [matchUri]), [
    {
      type: 'url',
      label: 'Web URL',
      input: 'example.com',
      url: 'http://example.com',
      scheme: 'http',
    },
  ]);

  assert.equal(match('127.0.0.1', [matchUri]), []);
  assert.equal(match('127.0.0.1', [matchIpAddress]), [
    {
      type: 'ip-address',
      label: 'IPv4 Address',
      input: '127.0.0.1',
      version: 'ipv4',
      address: '127.0.0.1',
    },
  ]);

  assert.equal(match('come+and@get.some.pizza', [matchEmailAddress]), [
    {
      type: 'email-address',
      label: 'Email Address',
      input: 'come+and@get.some.pizza',
      address: 'come+and@get.some.pizza',
    },
  ]);
});

test.run();
