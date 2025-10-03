import currency from "currency.js";

export interface CurrencyOptions {
  symbol?: string;
  precision?: number;
  separator?: string;
  decimal?: string;
  formatWithSymbol?: boolean;
}

const DEFAULT_CURRENCY_OPTIONS: CurrencyOptions = {
  symbol: "$",
  precision: 2,
  separator: ",",
  decimal: ".",
  formatWithSymbol: true,
};

export class CurrencyUtils {
  static format(
    amount: number,
    code = "USD",
    options: CurrencyOptions = {},
  ): string {
    const opts = { ...DEFAULT_CURRENCY_OPTIONS, ...options };

    const currencyInstance = currency(amount, {
      symbol: opts.symbol,
      precision: opts.precision,
      separator: opts.separator,
      decimal: opts.decimal,
      formatWithSymbol: opts.formatWithSymbol,
    });

    return currencyInstance.format();
  }

  static parse(value: string): number {
    return currency(value).value;
  }

  static add(amount1: number, amount2: number): number {
    return currency(amount1).add(amount2).value;
  }

  static subtract(amount1: number, amount2: number): number {
    return currency(amount1).subtract(amount2).value;
  }

  static multiply(amount: number, multiplier: number): number {
    return currency(amount).multiply(multiplier).value;
  }

  static divide(amount: number, divisor: number): number {
    return currency(amount).divide(divisor).value;
  }

  static isEqual(amount1: number, amount2: number): boolean {
    return currency(amount1).value === currency(amount2).value;
  }

  static isGreaterThan(amount1: number, amount2: number): boolean {
    return currency(amount1).value > currency(amount2).value;
  }

  static isLessThan(amount1: number, amount2: number): boolean {
    return currency(amount1).value < currency(amount2).value;
  }

  static getCurrencySymbol(code: string): string {
    const symbols: Record<string, string> = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      JPY: "¥",
      CAD: "C$",
      AUD: "A$",
      CHF: "CHF",
      CNY: "¥",
      INR: "₹",
    };
    return symbols[code] || code;
  }
}
