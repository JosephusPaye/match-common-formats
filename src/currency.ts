import { MatchCommon } from './main';
import currenciesList from './currencies.json';
import symbolsToCode from './currency-symbols-to-code.json';

export interface KnownCurrency {
  code: string;
  name: string;
  symbol: string;
  otherSymbols?: string[];
}

export interface Currency extends MatchCommon {
  type: 'currency';
  currency: KnownCurrency;
  amount: number;
}

export interface CodeToCurrency {
  [key: string]: KnownCurrency;
}

export interface SymbolToCodes {
  [key: string]: string[];
}

const currencies: CodeToCurrency = {};

for (const currency of currenciesList) {
  currencies[currency.code] = currency;
}

export { currencies };

const currencyCodes = Object.keys(currencies);
export { currencyCodes };

const currencySymbolsToCode = (symbolsToCode as unknown) as SymbolToCodes;
export { currencySymbolsToCode };

const currencySymbols = Object.keys(currencySymbolsToCode);
export { currencySymbols };

/**
 * Create the regular expressions for matching a currency input
 */
function createCurrencyRegexes() {
  // Digit part must start with \d, end with \d, and may have space, commas, or
  // periods as long as they're followed by \d (e.g. non-digit characters are non-consecutive)
  const digitsPart = '\\d(?:(?:\\d|\\.\\d|,\\d| \\d)+)?';

  // Currency symbols
  const symbolPart = '[^\\d\\s]{1,6}';

  // Currency code
  const codePart = '[a-zA-z]{3}';

  return {
    currencyWithCodeRegex: new RegExp(
      `((${codePart})(${digitsPart}))|((${digitsPart})(${codePart}))`
    ),
    currencyWithSymbolRegex: new RegExp(
      `((${symbolPart})(${digitsPart}))|((${digitsPart})(${symbolPart}))`
    ),
  };
}

const { currencyWithCodeRegex } = createCurrencyRegexes();

/**
 * Match the given string to a currency value
 */
export function matchCurrency(
  string: string,
  options: {
    matchSymbol?: boolean;
    decimalSymbol?: ',' | '.';
    thousandSeparator?: ',' | '.' | ' ';
  } = {}
): Currency | null {
  const input = string.trim();

  if (input.length === 0) {
    return null;
  }

  const { matchSymbol, decimalSymbol, thousandSeparator } = Object.assign(
    {
      matchSymbol: false,
      decimalSymbol: '.',
      thousandSeparator: ',',
    },
    options
  );

  const match = currencyWithCodeRegex.exec(input);

  if (!match) {
    return null;
  }

  if (match[1]) {
    const code = match[2];
    const digits = match[3];

    const parsed = parseCurrencyFromCodeAndDigits(
      code,
      digits,
      decimalSymbol,
      thousandSeparator
    );

    if (parsed) {
      return {
        type: 'currency',
        label: `${parsed.currency.code} Currency`,
        amount: parsed.amount,
        currency: parsed.currency,
        input,
      };
    }
  } else if (match[4]) {
    const code = match[6];
    const digits = match[5];

    const parsed = parseCurrencyFromCodeAndDigits(
      code,
      digits,
      decimalSymbol,
      thousandSeparator
    );

    if (parsed) {
      return {
        type: 'currency',
        label: `${parsed.currency.code} Currency`,
        amount: parsed.amount,
        currency: parsed.currency,
        input,
      };
    }
  }

  if (!matchSymbol) {
    return null;
  }

  // TODO: Match by symbol and digit (same way code and digit are matched above)

  return null;
}

/**
 * Parse the given digits into a number and match the code to a known currency code
 */
function parseCurrencyFromCodeAndDigits(
  code: string,
  digits: string,
  decimalSymbol: string,
  thousandSeparator: string
) {
  const currency = currencies[code.toUpperCase()];

  if (currency) {
    const amount = parseNumber(digits, decimalSymbol, thousandSeparator);

    if (amount !== null) {
      return {
        currency,
        amount,
      };
    }
  }

  return null;
}

/**
 * Parse the given digits as a number given the decimal symbol and the thousand separtor
 */
function parseNumber(
  digits: string,
  decimalSymbol: string,
  thousandSeparator: string
) {
  digits = digits.replace(createRegex(thousandSeparator, 'g'), '');

  if (decimalSymbol !== '.') {
    digits = digits.replace(createRegex(decimalSymbol, 'g'), '.');
  }

  const value = new Number(digits).valueOf();

  return Number.isNaN(value) ? null : value.valueOf();
}

/**
 * Create a regular expression from the given text with the given flags
 */
function createRegex(text: string, flags: string) {
  const escaped = text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  return new RegExp(escaped, flags);
}
