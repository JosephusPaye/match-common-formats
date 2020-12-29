// @ts-check

import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { matchSocialToken } from '../';

function filterTestCases(cases) {
  let filtered = cases.filter((c) => c.only);

  if (filtered.length === 0) {
    filtered = cases;
  }

  return filtered;
}

test('matchSocialToken() returns null for empty and whitespace-only input', () => {
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
      matchSocialToken(testCase.input),
      testCase.expected,
      `matches ${testCase.input} correctly`
    );
  }
});

test('matchSocialToken() does not match invalid usernames and hashtags', () => {
  const cases = [
    {
      input: 'ok', // missing @ or #
      expected: null,
    },
    {
      input: '@ ok', // invalid whitespace
      expected: null,
    },
    {
      input: '@ok then', // invalid whitespace
      expected: null,
    },
    {
      input: '# ok', // invalid whitespace
      expected: null,
    },
    {
      input: '#ok then', // invalid whitespace
      expected: null,
    },
    {
      input: '@ok!then', // invalid character
      expected: null,
    },
    {
      input: '#ok!then', // invalid character
      expected: null,
    },
    {
      input: 'ok@', // misplaced @
      expected: null,
    },
    {
      input: 'ok#', // misplaced #
      expected: null,
    },
    {
      input: '#_ok', // hashtag must start with a letter
      expected: null,
    },
    {
      input: '#42ok', // hashtag must start with a letter
      expected: null,
    },
    {
      input: '#ok-then', // no dashes allowed in hashtag
      expected: null,
    },
  ];

  for (const testCase of filterTestCases(cases)) {
    assert.equal(
      matchSocialToken(testCase.input),
      testCase.expected,
      `matches ${testCase.input} correctly`
    );
  }
});

test('matchSocialToken() matches valid usernames', () => {
  const cases = [
    {
      input: '@_',
      expected: {
        type: 'username',
        label: 'Social Media Username',
        token: '@_',
        input: '@_',
      },
    },
    {
      input: '@oK',
      expected: {
        type: 'username',
        label: 'Social Media Username',
        token: '@oK',
        input: '@oK',
      },
    },
    {
      input: '@_ok',
      expected: {
        type: 'username',
        label: 'Social Media Username',
        token: '@_ok',
        input: '@_ok',
      },
    },
    {
      input: '@_ok_',
      expected: {
        type: 'username',
        label: 'Social Media Username',
        token: '@_ok_',
        input: '@_ok_',
      },
    },
    {
      input: '@o_k',
      expected: {
        type: 'username',
        label: 'Social Media Username',
        token: '@o_k',
        input: '@o_k',
      },
    },
    {
      input: '@101',
      expected: {
        type: 'username',
        label: 'Social Media Username',
        token: '@101',
        input: '@101',
      },
    },
    {
      input: '@o22',
      expected: {
        type: 'username',
        label: 'Social Media Username',
        token: '@o22',
        input: '@o22',
      },
    },
    {
      input: '@o_22_',
      expected: {
        type: 'username',
        label: 'Social Media Username',
        token: '@o_22_',
        input: '@o_22_',
      },
    },
    {
      input: '@o_22_40',
      expected: {
        type: 'username',
        label: 'Social Media Username',
        token: '@o_22_40',
        input: '@o_22_40',
      },
    },
    {
      input: '@ok-boomer', // Services like GitHub allow hyphens
      expected: {
        type: 'username',
        label: 'Social Media Username',
        token: '@ok-boomer',
        input: '@ok-boomer',
      },
    },
    {
      input: '@AVeryLongUserName-With-All-the_things_22_20a22whyYouMad',
      expected: {
        type: 'username',
        label: 'Social Media Username',
        token: '@AVeryLongUserName-With-All-the_things_22_20a22whyYouMad',
        input: '@AVeryLongUserName-With-All-the_things_22_20a22whyYouMad',
      },
    },
  ];

  for (const testCase of filterTestCases(cases)) {
    assert.equal(
      matchSocialToken(testCase.input),
      testCase.expected,
      `matches ${testCase.input} correctly`
    );
  }
});

test('matchSocialToken() matches valid hashtags', () => {
  const cases = [
    {
      input: '#z',
      expected: {
        type: 'hashtag',
        label: 'Social Media Hashtag',
        token: '#z',
        input: '#z',
      },
    },
    {
      input: '#ok',
      expected: {
        type: 'hashtag',
        label: 'Social Media Hashtag',
        token: '#ok',
        input: '#ok',
      },
    },
    {
      input: '#ok_',
      expected: {
        type: 'hashtag',
        label: 'Social Media Hashtag',
        token: '#ok_',
        input: '#ok_',
      },
    },
    {
      input: '#ok_boomer',
      expected: {
        type: 'hashtag',
        label: 'Social Media Hashtag',
        token: '#ok_boomer',
        input: '#ok_boomer',
      },
    },
    {
      input: '#ok49',
      expected: {
        type: 'hashtag',
        label: 'Social Media Hashtag',
        token: '#ok49',
        input: '#ok49',
      },
    },
    {
      input: '#ok_boomer_49_',
      expected: {
        type: 'hashtag',
        label: 'Social Media Hashtag',
        token: '#ok_boomer_49_',
        input: '#ok_boomer_49_',
      },
    },
    {
      input: '#a_pretty_long_hash_tag_with_ALL_the_things_420_0',
      expected: {
        type: 'hashtag',
        label: 'Social Media Hashtag',
        token: '#a_pretty_long_hash_tag_with_ALL_the_things_420_0',
        input: '#a_pretty_long_hash_tag_with_ALL_the_things_420_0',
      },
    },
  ];

  for (const testCase of filterTestCases(cases)) {
    assert.equal(
      matchSocialToken(testCase.input),
      testCase.expected,
      `matches ${testCase.input} correctly`
    );
  }
});

test.run();
