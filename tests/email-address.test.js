// @ts-check

import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { matchEmailAddress } from '../';

function filterTestCases(cases) {
  let filtered = cases.filter((c) => c.only);

  if (filtered.length === 0) {
    filtered = cases;
  }

  return filtered;
}

test('matchEmailAddress() returns null for empty and whitespace-only input', () => {
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
      matchEmailAddress(testCase.input),
      testCase.expected,
      `matches ${testCase.input} correctly`
    );
  }
});

test('matchEmailAddress() does not match invalid email addresses', () => {
  const cases = [
    {
      input: 'Abc.example.com', // missing @
      expected: null,
    },
    {
      input: '@example.com', // missing local part
      expected: null,
    },
    {
      input: 'a.b@', // missing domain part
      expected: null,
    },
    {
      input: 'A@b@c@example.com', // more than one @
      expected: null,
    },
    {
      input: 'a"b(c)d,e:f;g<h>i[j\\k]l@example.com', // unknown special chars in local part
      expected: null,
    },
    {
      input: 'just"not"right@example.com', // unknown special chars in local part
      expected: null,
    },
    {
      input: 'this is"notallowed@example.com', // unknown special chars in local part
      expected: null,
    },
    {
      input: 'this still"not\\allowed@example.com', // unknown special chars in local part
      expected: null,
    },
    {
      input:
        '1234567890123456789012345678901234567890123456789012345678901234+x@example.com', // local part longer than 64 chars
      expected: null,
    },
    // {
    //   input: 'i_like_underscore@but_its_not_allow_in_this_part.example.com', // technically valid: https://stackoverflow.com/a/2183140
    //   expected: null,
    // },
    {
      input: 'i_like_underscore@x.unknown-tld', // unknown tld
      expected: null,
    },
    {
      input: 'i_like_underscore@com.', // invalid domain part
      expected: null,
    },
    {
      input: 'i_like_underscore@.com', // invalid domain part
      expected: null,
    },
  ];

  for (const testCase of filterTestCases(cases)) {
    assert.equal(
      matchEmailAddress(testCase.input),
      testCase.expected,
      `matches ${testCase.input} correctly`
    );
  }
});

test('matchEmailAddress() matches valid email addresses', () => {
  const cases = [
    {
      input: 'simple@example.com',
      expected: {
        type: 'email-address',
        label: 'Email Address',
        address: 'simple@example.com',
        input: 'simple@example.com',
      },
    },
    {
      input: 'very.common@example.com',
      expected: {
        type: 'email-address',
        label: 'Email Address',
        address: 'very.common@example.com',
        input: 'very.common@example.com',
      },
    },
    {
      input: 'fully-qualified-domain@example.com',
      expected: {
        type: 'email-address',
        label: 'Email Address',
        address: 'fully-qualified-domain@example.com',
        input: 'fully-qualified-domain@example.com',
      },
    },
    {
      input: 'Disposable.style.email.with+symbol@example.com',
      expected: {
        type: 'email-address',
        label: 'Email Address',
        address: 'Disposable.style.email.with+symbol@example.com',
        input: 'Disposable.style.email.with+symbol@example.com',
      },
    },
    {
      input: 'other.email-with-hyphen@example.com',
      expected: {
        type: 'email-address',
        label: 'Email Address',
        address: 'other.email-with-hyphen@example.com',
        input: 'other.email-with-hyphen@example.com',
      },
    },
    {
      input: 'user.name+tag+sorting@example.com',
      expected: {
        type: 'email-address',
        label: 'Email Address',
        address: 'user.name+tag+sorting@example.com',
        input: 'user.name+tag+sorting@example.com',
      },
    },
    {
      input: 'x@example.com',
      expected: {
        type: 'email-address',
        label: 'Email Address',
        address: 'x@example.com',
        input: 'x@example.com',
      },
    },
    {
      input: 'example@s.example',
      expected: {
        type: 'email-address',
        label: 'Email Address',
        address: 'example@s.example',
        input: 'example@s.example',
      },
    },
    {
      input: 'example@get.pizza',
      expected: {
        type: 'email-address',
        label: 'Email Address',
        address: 'example@get.pizza',
        input: 'example@get.pizza',
      },
    },
  ];

  for (const testCase of filterTestCases(cases)) {
    assert.equal(
      matchEmailAddress(testCase.input),
      testCase.expected,
      `matches ${testCase.input} correctly`
    );
  }
});

test.run();
