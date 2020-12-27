import { MatchCommon } from './main';

export interface Color extends MatchCommon {
  type: 'color';
  format: 'hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla';
  color: string;
}

// https://regexr.com/5j8am
const hexRgbColorRegex = /^#(?:(?:[0-9a-fA-F]{8})|(?:[0-9a-fA-F]{6})|(?:[0-9a-fA-F]{4})|(?:[0-9a-fA-F]{3}))$/;

/**
 * Check if the given string is an 8-character (#RRGGBBAA), 6-character (#RRGGBB),
 * or 3-character (#RGB) hexadecimal color code
 */
function isRgbHexColor(string: string) {
  return hexRgbColorRegex.test(string);
}

/*
 * Create regular expressions to match rgb() and rgba() color codes.
 * Based on https://regexr.com/5j8bk, which matches rgb(R, G, B),
 * rgba(R, G, B, A), rgb(R G B), and rgba(R G B A).
 */
function createRgbRegexes() {
  const whitespace = ' *';
  const separator = `${whitespace}(?:,| )${whitespace}`;
  const value = '[01]?\\d\\d?|2[0-4]\\d|25[0-5]';
  const alpha = '(?:100|[0-9]{1,2})(?:\\.\\d+)?%?';

  const rgbRegex = new RegExp(
    `^rgb\\(${whitespace}(${value})${separator}(${value})${separator}(${value})${whitespace}\\)$`
  );

  const rgbaRegex = new RegExp(
    `^rgba\\(${whitespace}(${value})${separator}(${value})${separator}(${value})${separator}(${alpha})\\)$`
  );

  return { rgbRegex, rgbaRegex };
}

const { rgbRegex, rgbaRegex } = createRgbRegexes();

/**
 * Match the given string to an RGB or RGBA color
 */
function matchRgbDecColor(
  string: string
): { type: 'rgb' | 'rgba'; color: string } | null {
  const rgbMatches = rgbRegex.exec(string.toLowerCase());

  if (rgbMatches) {
    return {
      type: 'rgb',
      color: `rgb(${rgbMatches[1]}, ${rgbMatches[2]}, ${rgbMatches[3]})`,
    };
  }

  const rgbaMatches = rgbaRegex.exec(string.toLowerCase());

  if (rgbaMatches) {
    return {
      type: 'rgba',
      color: `rgba(${rgbaMatches[1]}, ${rgbaMatches[2]}, ${rgbaMatches[3]}, ${rgbaMatches[4]})`,
    };
  }

  return null;
}

/*
 * Create regular expressions to match hsl() and hsla() color codes.
 * Matches hsl(H, S, L), hsla(H, S, L, A), hsl(H S L), hsla(H S L A).
 */
function createHslRegexes() {
  const whitespace = ' *';
  const separator = `${whitespace}(?:,| )${whitespace}`;
  const hue = '-?\\d+(?:\\.\\d+)?(?:deg|grad|rad|turn)?';
  const percentage = '(?:100|[0-9]{1,2})(?:\\.\\d+)?%';
  const alpha = `${percentage}?`;

  const hslRegex = new RegExp(
    `^hsl\\(${whitespace}(${hue})${separator}(${percentage})${separator}(${percentage})${whitespace}\\)$`
  );

  const hslaRegex = new RegExp(
    `^hsla\\(${whitespace}(${hue})${separator}(${percentage})${separator}(${percentage})${separator}(${alpha})\\)$`
  );

  return { hslRegex, hslaRegex };
}

const { hslRegex, hslaRegex } = createHslRegexes();

/**
 * Match the given string to an HSL or HSLA color
 */
function matchHslColor(
  string: string
): { type: 'hsl' | 'hsla'; color: string } | null {
  const hslMatches = hslRegex.exec(string.toLowerCase());

  if (hslMatches) {
    return {
      type: 'hsl',
      color: `hsl(${hslMatches[1]}, ${hslMatches[2]}, ${hslMatches[3]})`,
    };
  }

  const hslaMatches = hslaRegex.exec(string.toLowerCase());

  if (hslaMatches) {
    return {
      type: 'hsla',
      color: `hsla(${hslaMatches[1]}, ${hslaMatches[2]}, ${hslaMatches[3]}, ${hslaMatches[4]})`,
    };
  }

  return null;
}

/**
 * Match the given string to a hex (RGB), rgb(), rgba(), hsl(), or hsla() color code
 */
export function matchColor(string: string): Color | null {
  const input = string.trim();

  if (input.length === 0) {
    return null;
  }

  if (isRgbHexColor(input)) {
    return {
      type: 'color',
      label: 'Hexadecimal Color Code',
      format: 'hex',
      color: input.toLowerCase(),
      input,
    };
  }

  const rgbDecColor = matchRgbDecColor(input);

  if (rgbDecColor) {
    return {
      type: 'color',
      label: `${rgbDecColor.type.toUpperCase()} Color Code`,
      format: rgbDecColor.type,
      color: rgbDecColor.color,
      input,
    };
  }

  const hslColor = matchHslColor(input);

  if (hslColor) {
    return {
      type: 'color',
      label: `${hslColor.type.toUpperCase()} Color Code`,
      format: hslColor.type,
      color: hslColor.color,
      input,
    };
  }

  return null;
}
