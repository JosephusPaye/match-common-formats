// @ts-check

import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { matchCurrency } from '../';

function filterTestCases(cases) {
  let filtered = cases.filter((c) => c.only);

  if (filtered.length === 0) {
    filtered = cases;
  }

  return filtered;
}

test('matchCurrency() returns null for empty and whitespace-only input', () => {
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
      matchCurrency(testCase.input),
      testCase.expected,
      `matches ${testCase.input} correctly`
    );
  }
});

test("matchCurrency() doesn't match invalid currency input", () => {
  const cases = [
    '_', // Invalid character _
    '20_', // Invalid character _
    '20', // Missing code
    '20AU', // Incomplete code (not 3-chars)
    'AU20', // Incomplete code (not 3-chars)
    'AUD 20', // Invalid whitespace
    '20 AUD', // Invalid whitespace
    '20.220.00AUD', // Invalid decimal symbols double decimal symbols
    '20ZZZ', // Unknown currency code
  ].map((input) => {
    return {
      input,
      expected: null,
    };
  });

  for (const testCase of filterTestCases(cases)) {
    assert.equal(
      matchCurrency(testCase.input),
      testCase.expected,
      `matches ${testCase.input} correctly`
    );
  }
});

test('matchCurrency() matches input with currency as suffix or prefix', () => {
  const cases = [
    // Code as suffix
    '20LRD',
    '20.50lrd',
    '2,000LRD',
    '2,000.50lrd',
    '2,000,000LRD',
    '2,000,000.50lrd',

    // Code as prefix
    'lrd20',
    'LRD20.50',
    'lrd2,000',
    'LRD2,000.50',
    'lrd2,000,000',
    'LRD2,000,000.50',
  ].map((input) => {
    return {
      input,
      expected: {
        type: 'currency',
        label: 'LRD Currency',
        currency: {
          name: 'Liberian dollar',
          code: 'LRD',
          symbol: '$',
        },
        amount: Number(input.replace(/,|lrd/gi, '')).valueOf(),
        input,
      },
    };
  });

  for (const testCase of filterTestCases(cases)) {
    assert.equal(
      matchCurrency(testCase.input),
      testCase.expected,
      `matches ${testCase.input} correctly`
    );
  }
});

test('matchCurrency() uses different thousand and decimal separators when configured', () => {
  const cases = [
    // Code as suffix
    '20LRD',
    '20,50lrd',
    '2.000LRD',
    '2.000,50lrd',
    '2.000.000LRD',
    '2.000.000,50lrd',

    // Code as prefix
    'lrd20',
    'LRD20,50',
    'lrd2.000',
    'LRD2.000,50',
    'lrd2.000.000',
    'LRD2.000.000,50',
  ].map((input) => {
    return {
      input,
      expected: {
        type: 'currency',
        label: 'LRD Currency',
        currency: {
          name: 'Liberian dollar',
          code: 'LRD',
          symbol: '$',
        },
        amount: Number(
          input.replace(/\.|lrd/gi, '').replace(/,/g, '.')
        ).valueOf(),
        input,
      },
    };
  });

  for (const testCase of filterTestCases(cases)) {
    assert.equal(
      matchCurrency(testCase.input, {
        decimalSymbol: ',',
        thousandSeparator: '.',
      }),
      testCase.expected,
      `matches ${testCase.input} correctly`
    );
  }
});

test('matchCurrency() uses different thousand and decimal separators when configured: space as separator', () => {
  const cases = [
    // Code as suffix
    '20LRD',
    '20.50lrd',
    '2 000LRD',
    '2 000.50lrd',
    '2 000 000LRD',
    '2 000 000.50lrd',

    // Code as prefix
    'lrd20',
    'LRD20.50',
    'lrd2 000',
    'LRD2 000.50',
    'lrd2 000 000',
    'LRD2 000 000.50',
  ].map((input) => {
    return {
      input,
      expected: {
        type: 'currency',
        label: 'LRD Currency',
        currency: {
          name: 'Liberian dollar',
          code: 'LRD',
          symbol: '$',
        },
        amount: Number(
          input.replace(/ |lrd/gi, '').replace(/,/g, '.')
        ).valueOf(),
        input,
      },
    };
  });

  for (const testCase of filterTestCases(cases)) {
    assert.equal(
      matchCurrency(testCase.input, {
        thousandSeparator: ' ',
      }),
      testCase.expected,
      `matches ${testCase.input} correctly`
    );
  }
});

test.run();
