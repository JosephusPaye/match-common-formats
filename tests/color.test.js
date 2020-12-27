// @ts-check

import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { matchColor } from '../';

function filterTestCases(cases) {
  let filtered = cases.filter((c) => c.only);

  if (filtered.length === 0) {
    filtered = cases;
  }

  return filtered;
}

test('matchColor() returns null for empty and whitespace-only input', () => {
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
      matchColor(testCase.input),
      testCase.expected,
      `matches ${testCase.input} correctly`
    );
  }
});

/*
 * =============================================================================
 * RGB Hex
 * =============================================================================
 */

test('matchColor() matches 8-character RGB hex colors', () => {
  const cases = [
    {
      input: 'BADA55FF', // no # prefix
      expected: null,
    },
    {
      input: '#BADA55F', // 1 character short
      expected: null,
    },
    {
      input: '#BADA55FFF', // 1 character long
      expected: null,
    },
    {
      input: '#ZADA55FF', // non-hex or numeric character
      expected: null,
    },
    {
      input: '#BADA55FF',
      expected: {
        type: 'color',
        label: 'Hexadecimal Color Code',
        format: 'hex',
        color: '#bada55ff',
        input: '#BADA55FF',
      },
    },
  ];

  for (const testCase of filterTestCases(cases)) {
    assert.equal(
      matchColor(testCase.input),
      testCase.expected,
      `matches ${testCase.input} correctly`
    );
  }
});

test('matchColor() matches 6-character RGB hex colors', () => {
  const cases = [
    {
      input: 'BADA55', // no # prefix
      expected: null,
    },
    {
      input: '#BADA5', // 1 character short
      expected: null,
    },
    {
      input: '#BADA55F', // 1 character long
      expected: null,
    },
    {
      input: '#ZADA55', // non-hex or numeric character
      expected: null,
    },
    {
      input: '#BADA55',
      expected: {
        type: 'color',
        label: 'Hexadecimal Color Code',
        format: 'hex',
        color: '#bada55',
        input: '#BADA55',
      },
    },
  ];

  for (const testCase of filterTestCases(cases)) {
    assert.equal(
      matchColor(testCase.input),
      testCase.expected,
      `matches ${testCase.input} correctly`
    );
  }
});

test('matchColor() matches 4-character RGB hex colors', () => {
  const cases = [
    {
      input: 'BADF', // no # prefix
      expected: null,
    },
    {
      input: '#BADA5', // 1 character long
      expected: null,
    },
    {
      input: '#ZADF', // non-hex or numeric character
      expected: null,
    },
    {
      input: '#BADF',
      expected: {
        type: 'color',
        label: 'Hexadecimal Color Code',
        format: 'hex',
        color: '#badf',
        input: '#BADF',
      },
    },
  ];

  for (const testCase of filterTestCases(cases)) {
    assert.equal(
      matchColor(testCase.input),
      testCase.expected,
      `matches ${testCase.input} correctly`
    );
  }
});

test('matchColor() matches 3-character RGB hex colors', () => {
  const cases = [
    {
      input: 'BAD', // no # prefix
      expected: null,
    },
    {
      input: '#BA', // 1 character short
      expected: null,
    },
    {
      input: '#ZAD', // non-hex or numeric character
      expected: null,
    },
    {
      input: '#BAD',
      expected: {
        type: 'color',
        label: 'Hexadecimal Color Code',
        format: 'hex',
        color: '#bad',
        input: '#BAD',
      },
    },
  ];

  for (const testCase of filterTestCases(cases)) {
    assert.equal(
      matchColor(testCase.input),
      testCase.expected,
      `matches ${testCase.input} correctly`
    );
  }
});

/*
 * =============================================================================
 * RGB and RGBA
 * =============================================================================
 */

test('matchColor() matches RGB decimal colors with comma separators', () => {
  const cases = [
    {
      input: 'rgb 20, 20, 20)', // no ( ) delimiter
      expected: null,
    },
    {
      input: 'rgb(20, 20, 20', // no ) delimiter
      expected: null,
    },
    {
      input: 'rgb(20, 20)', // missing a color
      expected: null,
    },
    {
      input: 'rgb(20, 20, 2x2)', // non-numeric value
      expected: null,
    },
    {
      input: 'rgb(256, 20, 20)', // value out of range
      expected: null,
    },
    {
      input: 'rgb(20, 20, 20)',
      expected: {
        type: 'color',
        label: 'RGB Color Code',
        format: 'rgb',
        color: 'rgb(20, 20, 20)',
        input: 'rgb(20, 20, 20)',
      },
    },
    {
      input: 'RGB(20,20,20)',
      expected: {
        type: 'color',
        label: 'RGB Color Code',
        format: 'rgb',
        color: 'rgb(20, 20, 20)',
        input: 'RGB(20,20,20)',
      },
    },
  ];

  for (const testCase of filterTestCases(cases)) {
    assert.equal(
      matchColor(testCase.input),
      testCase.expected,
      `matches ${testCase.input} correctly`
    );
  }
});

test('matchColor() matches RGB decimal colors with space separators', () => {
  const cases = [
    {
      input: 'rgb 20 20 20)', // no ( ) delimiter
      expected: null,
    },
    {
      input: 'rgb(20 20 20', // no ) delimiter
      expected: null,
    },
    {
      input: 'rgb(20 20)', // missing a color
      expected: null,
    },
    {
      input: 'rgb(20 20 2x2)', // non-numeric value
      expected: null,
    },
    {
      input: 'rgb(256 20 20)', // value out of range
      expected: null,
    },
    {
      input: 'rgb(20  20  20)',
      expected: {
        type: 'color',
        label: 'RGB Color Code',
        format: 'rgb',
        color: 'rgb(20, 20, 20)',
        input: 'rgb(20  20  20)',
      },
    },
    {
      input: 'RGB(20 20 20)',
      expected: {
        type: 'color',
        label: 'RGB Color Code',
        format: 'rgb',
        color: 'rgb(20, 20, 20)',
        input: 'RGB(20 20 20)',
      },
    },
  ];

  for (const testCase of filterTestCases(cases)) {
    assert.equal(
      matchColor(testCase.input),
      testCase.expected,
      `matches ${testCase.input} correctly`
    );
  }
});

test('matchColor() matches RGBA decimal colors with comma separators', () => {
  const cases = [
    {
      input: 'rgba 20, 20, 20, 0.5)', // no ( ) delimiter
      expected: null,
    },
    {
      input: 'rgba(20, 20, 20, 20%', // no ) delimiter
      expected: null,
    },
    {
      input: 'rgba(20, 20, 20)', // missing alpha
      expected: null,
    },
    {
      input: 'rgba(20, 20, 2x2, 20%)', // non-numeric value
      expected: null,
    },
    {
      input: 'rgba(256, 20, 20, 20%)', // value out of range
      expected: null,
    },
    {
      input: 'rgba(20, 20, 20, 0.5)', // missing alpha
      expected: {
        type: 'color',
        label: 'RGBA Color Code',
        format: 'rgba',
        color: 'rgba(20, 20, 20, 0.5)',
        input: 'rgba(20, 20, 20, 0.5)',
      },
    },
    {
      input: 'RGBA(20,20,20,100%)',
      expected: {
        type: 'color',
        label: 'RGBA Color Code',
        format: 'rgba',
        color: 'rgba(20, 20, 20, 100%)',
        input: 'RGBA(20,20,20,100%)',
      },
    },
  ];

  for (const testCase of filterTestCases(cases)) {
    assert.equal(
      matchColor(testCase.input),
      testCase.expected,
      `matches ${testCase.input} correctly`
    );
  }
});

test('matchColor() matches RGBA decimal colors with space separators', () => {
  const cases = [
    {
      input: 'rgba 20 20 20 0.5)', // no ( ) delimiter
      expected: null,
    },
    {
      input: 'rgba(20 20 20 20%', // no ) delimiter
      expected: null,
    },
    {
      input: 'rgba(20 20 20)', // missing alpha
      expected: null,
    },
    {
      input: 'rgba(20 20 2x2 20%)', // non-numeric value
      expected: null,
    },
    {
      input: 'rgba(256 20 20 20%)', // value out of range
      expected: null,
    },
    {
      input: 'rgba(20 20 20 0.5)', // missing alpha
      expected: {
        type: 'color',
        label: 'RGBA Color Code',
        format: 'rgba',
        color: 'rgba(20, 20, 20, 0.5)',
        input: 'rgba(20 20 20 0.5)',
      },
    },
    {
      input: 'RGBA(20   20   20   100%)',
      expected: {
        type: 'color',
        label: 'RGBA Color Code',
        format: 'rgba',
        color: 'rgba(20, 20, 20, 100%)',
        input: 'RGBA(20   20   20   100%)',
      },
    },
  ];

  for (const testCase of filterTestCases(cases)) {
    assert.equal(
      matchColor(testCase.input),
      testCase.expected,
      `matches ${testCase.input} correctly`
    );
  }
});

/*
 * =============================================================================
 * HSL and HSLA
 * =============================================================================
 */

test('matchColor() matches HSL colors with comma separators', () => {
  const cases = [
    {
      input: 'hsl 180, 20%, 20%)', // no ( ) delimiter
      expected: null,
    },
    {
      input: 'hsl(180, 20%, 20%', // no ) delimiter
      expected: null,
    },
    {
      input: 'hsl(180, 20%)', // missing a value
      expected: null,
    },
    {
      input: 'hsl(180, 20%, 2x2)', // non-numeric value
      expected: null,
    },
    {
      input: 'hsl(180px, 20%, 20%)', // invalid unit for H (should be an angle)
      expected: null,
    },
    {
      input: 'hsl(180, 0.1, 0.1)', // non-percentage for S or L
      expected: null,
    },
    {
      input: 'hsl(180, 20, 20)', // missing % on S and L
      expected: null,
    },
    {
      input: 'hsl(180, 101%, -1%)', // S and L out of range
      expected: null,
    },
    {
      input: 'hsl(180,  20%,  20%)',
      expected: {
        type: 'color',
        label: 'HSL Color Code',
        format: 'hsl',
        color: 'hsl(180, 20%, 20%)',
        input: 'hsl(180,  20%,  20%)',
      },
    },
    {
      input: 'HSL(180,20%,20%)',
      expected: {
        type: 'color',
        label: 'HSL Color Code',
        format: 'hsl',
        color: 'hsl(180, 20%, 20%)',
        input: 'HSL(180,20%,20%)',
      },
    },
    {
      input: 'hsl(180deg,20.5%,100%)',
      expected: {
        type: 'color',
        label: 'HSL Color Code',
        format: 'hsl',
        color: 'hsl(180deg, 20.5%, 100%)',
        input: 'hsl(180deg,20.5%,100%)',
      },
    },
    {
      input: 'hsl(180rad,20.5%,0%)',
      expected: {
        type: 'color',
        label: 'HSL Color Code',
        format: 'hsl',
        color: 'hsl(180rad, 20.5%, 0%)',
        input: 'hsl(180rad,20.5%,0%)',
      },
    },
    {
      input: 'hsl(180grad,20.5%,0%)',
      expected: {
        type: 'color',
        label: 'HSL Color Code',
        format: 'hsl',
        color: 'hsl(180grad, 20.5%, 0%)',
        input: 'hsl(180grad,20.5%,0%)',
      },
    },
    {
      input: 'hsl(180turn,20.5%,0%)',
      expected: {
        type: 'color',
        label: 'HSL Color Code',
        format: 'hsl',
        color: 'hsl(180turn, 20.5%, 0%)',
        input: 'hsl(180turn,20.5%,0%)',
      },
    },
  ];

  for (const testCase of filterTestCases(cases)) {
    assert.equal(
      matchColor(testCase.input),
      testCase.expected,
      `matches ${testCase.input} correctly`
    );
  }
});

test('matchColor() matches HSL colors with space separators', () => {
  const cases = [
    {
      input: 'hsl 180 20% 20%)', // no ( ) delimiter
      expected: null,
    },
    {
      input: 'hsl(180 20% 20%', // no ) delimiter
      expected: null,
    },
    {
      input: 'hsl(180 20%)', // missing a value
      expected: null,
    },
    {
      input: 'hsl(180 20% 2x2)', // non-numeric value
      expected: null,
    },
    {
      input: 'hsl(180px 20% 20%)', // invalid unit for H (should be an angle)
      expected: null,
    },
    {
      input: 'hsl(180 0.1 0.1)', // non-percentage for S or L
      expected: null,
    },
    {
      input: 'hsl(180 20 20)', // missing % on S and L
      expected: null,
    },
    {
      input: 'hsl(180 101% -1%)', // S and L out of range
      expected: null,
    },
    {
      input: 'hsl(180   20%   20%)',
      expected: {
        type: 'color',
        label: 'HSL Color Code',
        format: 'hsl',
        color: 'hsl(180, 20%, 20%)',
        input: 'hsl(180   20%   20%)',
      },
    },
    {
      input: 'HSL(180 20% 20%)',
      expected: {
        type: 'color',
        label: 'HSL Color Code',
        format: 'hsl',
        color: 'hsl(180, 20%, 20%)',
        input: 'HSL(180 20% 20%)',
      },
    },
    {
      input: 'hsl(180deg 20.5% 100%)',
      expected: {
        type: 'color',
        label: 'HSL Color Code',
        format: 'hsl',
        color: 'hsl(180deg, 20.5%, 100%)',
        input: 'hsl(180deg 20.5% 100%)',
      },
    },
    {
      input: 'hsl(180rad 20.5% 0%)',
      expected: {
        type: 'color',
        label: 'HSL Color Code',
        format: 'hsl',
        color: 'hsl(180rad, 20.5%, 0%)',
        input: 'hsl(180rad 20.5% 0%)',
      },
    },
    {
      input: 'hsl(180grad 20.5% 0%)',
      expected: {
        type: 'color',
        label: 'HSL Color Code',
        format: 'hsl',
        color: 'hsl(180grad, 20.5%, 0%)',
        input: 'hsl(180grad 20.5% 0%)',
      },
    },
    {
      input: 'hsl(180turn 20.5% 0%)',
      expected: {
        type: 'color',
        label: 'HSL Color Code',
        format: 'hsl',
        color: 'hsl(180turn, 20.5%, 0%)',
        input: 'hsl(180turn 20.5% 0%)',
      },
    },
  ];

  for (const testCase of filterTestCases(cases)) {
    assert.equal(
      matchColor(testCase.input),
      testCase.expected,
      `matches ${testCase.input} correctly`
    );
  }
});

test('matchColor() matches HSLA colors with comma separators', () => {
  const cases = [
    {
      input: 'hsla 180, 20%, 20%, 0.5)', // no ( ) delimiter
      expected: null,
    },
    {
      input: 'hsla(180, 20%, 20%, 0.5', // no ) delimiter
      expected: null,
    },
    {
      input: 'hsla(180, 20%, 20%)', // missing a value
      expected: null,
    },
    {
      input: 'hsla(180, 20%, 2x2, 0.5)', // non-numeric value
      expected: null,
    },
    {
      input: 'hsla(180px, 20%, 20%, 0.5)', // invalid unit for H (should be an angle)
      expected: null,
    },
    {
      input: 'hsla(180, 0.1, 0.1, 0.5)', // non-percentage for S or L
      expected: null,
    },
    {
      input: 'hsla(180, 20, 20, 0.5)', // missing % on S and L
      expected: null,
    },
    {
      input: 'hsla(180, 101%, -1%, 0.5)', // S and L out of range
      expected: null,
    },
    {
      input: 'hsla(180, 101%, -1%, 200)', // A out of range
      expected: null,
    },
    {
      input: 'hsla(180,  20%,  20%, 0.5)',
      expected: {
        type: 'color',
        label: 'HSLA Color Code',
        format: 'hsla',
        color: 'hsla(180, 20%, 20%, 0.5)',
        input: 'hsla(180,  20%,  20%, 0.5)',
      },
    },
    {
      input: 'HSLA(180,20%,20%,50%)',
      expected: {
        type: 'color',
        label: 'HSLA Color Code',
        format: 'hsla',
        color: 'hsla(180, 20%, 20%, 50%)',
        input: 'HSLA(180,20%,20%,50%)',
      },
    },
    {
      input: 'hsla(180deg,20.5%,100%,0.5)',
      expected: {
        type: 'color',
        label: 'HSLA Color Code',
        format: 'hsla',
        color: 'hsla(180deg, 20.5%, 100%, 0.5)',
        input: 'hsla(180deg,20.5%,100%,0.5)',
      },
    },
    {
      input: 'hsla(180rad,20.5%,0%,0.5)',
      expected: {
        type: 'color',
        label: 'HSLA Color Code',
        format: 'hsla',
        color: 'hsla(180rad, 20.5%, 0%, 0.5)',
        input: 'hsla(180rad,20.5%,0%,0.5)',
      },
    },
    {
      input: 'hsla(180grad,20.5%,0%,0.5)',
      expected: {
        type: 'color',
        label: 'HSLA Color Code',
        format: 'hsla',
        color: 'hsla(180grad, 20.5%, 0%, 0.5)',
        input: 'hsla(180grad,20.5%,0%,0.5)',
      },
    },
    {
      input: 'hsla(180turn,20.5%,0%,0.5)',
      expected: {
        type: 'color',
        label: 'HSLA Color Code',
        format: 'hsla',
        color: 'hsla(180turn, 20.5%, 0%, 0.5)',
        input: 'hsla(180turn,20.5%,0%,0.5)',
      },
    },
  ];

  for (const testCase of filterTestCases(cases)) {
    assert.equal(
      matchColor(testCase.input),
      testCase.expected,
      `matches ${testCase.input} correctly`
    );
  }
});

test('matchColor() matches HSLA colors with comma separators', () => {
  const cases = [
    {
      input: 'hsla 180 20% 20% 0.5)', // no ( ) delimiter
      expected: null,
    },
    {
      input: 'hsla(180 20% 20% 0.5', // no ) delimiter
      expected: null,
    },
    {
      input: 'hsla(180 20% 20%)', // missing a value
      expected: null,
    },
    {
      input: 'hsla(180 20% 2x2 0.5)', // non-numeric value
      expected: null,
    },
    {
      input: 'hsla(180px 20% 20% 0.5)', // invalid unit for H (should be an angle)
      expected: null,
    },
    {
      input: 'hsla(180 0.1 0.1 0.5)', // non-percentage for S or L
      expected: null,
    },
    {
      input: 'hsla(180 20 20 0.5)', // missing % on S and L
      expected: null,
    },
    {
      input: 'hsla(180 101% -1% 0.5)', // S and L out of range
      expected: null,
    },
    {
      input: 'hsla(180 101% -1% 200)', // A out of range
      expected: null,
    },
    {
      input: 'hsla(180   20%   20%   0.5)',
      expected: {
        type: 'color',
        label: 'HSLA Color Code',
        format: 'hsla',
        color: 'hsla(180, 20%, 20%, 0.5)',
        input: 'hsla(180   20%   20%   0.5)',
      },
    },
    {
      input: 'HSLA(180 20% 20% 50%)',
      expected: {
        type: 'color',
        label: 'HSLA Color Code',
        format: 'hsla',
        color: 'hsla(180, 20%, 20%, 50%)',
        input: 'HSLA(180 20% 20% 50%)',
      },
    },
    {
      input: 'hsla(180deg 20.5% 100% 0.5)',
      expected: {
        type: 'color',
        label: 'HSLA Color Code',
        format: 'hsla',
        color: 'hsla(180deg, 20.5%, 100%, 0.5)',
        input: 'hsla(180deg 20.5% 100% 0.5)',
      },
    },
    {
      input: 'hsla(180rad 20.5% 0% 0.5)',
      expected: {
        type: 'color',
        label: 'HSLA Color Code',
        format: 'hsla',
        color: 'hsla(180rad, 20.5%, 0%, 0.5)',
        input: 'hsla(180rad 20.5% 0% 0.5)',
      },
    },
    {
      input: 'hsla(180grad 20.5% 0% 0.5)',
      expected: {
        type: 'color',
        label: 'HSLA Color Code',
        format: 'hsla',
        color: 'hsla(180grad, 20.5%, 0%, 0.5)',
        input: 'hsla(180grad 20.5% 0% 0.5)',
      },
    },
    {
      input: 'hsla(180turn 20.5% 0% 0.5)',
      expected: {
        type: 'color',
        label: 'HSLA Color Code',
        format: 'hsla',
        color: 'hsla(180turn, 20.5%, 0%, 0.5)',
        input: 'hsla(180turn 20.5% 0% 0.5)',
      },
    },
  ];

  for (const testCase of filterTestCases(cases)) {
    assert.equal(
      matchColor(testCase.input),
      testCase.expected,
      `matches ${testCase.input} correctly`
    );
  }
});

test.run();
