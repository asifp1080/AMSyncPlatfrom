import {
  format,
  parseISO,
  isValid,
  addDays,
  addMonths,
  addYears,
  subDays,
  subMonths,
  subYears,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  isAfter,
  isBefore,
  isSameDay,
  formatDistanceToNow,
} from "date-fns";

export class DateUtils {
  // Formatting
  static format(date: Date | string, formatString = "MM/dd/yyyy"): string {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return format(dateObj, formatString);
  }

  static formatTime(date: Date | string, formatString = "HH:mm:ss"): string {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return format(dateObj, formatString);
  }

  static formatDateTime(
    date: Date | string,
    formatString = "MM/dd/yyyy HH:mm:ss",
  ): string {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return format(dateObj, formatString);
  }

  static formatRelative(date: Date | string): string {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
  }

  // Parsing and validation
  static parse(dateString: string): Date {
    return parseISO(dateString);
  }

  static isValid(date: Date | string): boolean {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return isValid(dateObj);
  }

  // Date arithmetic
  static addDays(date: Date | string, days: number): Date {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return addDays(dateObj, days);
  }

  static addMonths(date: Date | string, months: number): Date {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return addMonths(dateObj, months);
  }

  static addYears(date: Date | string, years: number): Date {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return addYears(dateObj, years);
  }

  static subtractDays(date: Date | string, days: number): Date {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return subDays(dateObj, days);
  }

  static subtractMonths(date: Date | string, months: number): Date {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return subMonths(dateObj, months);
  }

  static subtractYears(date: Date | string, years: number): Date {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return subYears(dateObj, years);
  }

  // Date boundaries
  static startOfDay(date: Date | string): Date {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return startOfDay(dateObj);
  }

  static endOfDay(date: Date | string): Date {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return endOfDay(dateObj);
  }

  static startOfMonth(date: Date | string): Date {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return startOfMonth(dateObj);
  }

  static endOfMonth(date: Date | string): Date {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return endOfMonth(dateObj);
  }

  static startOfYear(date: Date | string): Date {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return startOfYear(dateObj);
  }

  static endOfYear(date: Date | string): Date {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return endOfYear(dateObj);
  }

  // Date comparisons
  static isAfter(date1: Date | string, date2: Date | string): boolean {
    const dateObj1 = typeof date1 === "string" ? parseISO(date1) : date1;
    const dateObj2 = typeof date2 === "string" ? parseISO(date2) : date2;
    return isAfter(dateObj1, dateObj2);
  }

  static isBefore(date1: Date | string, date2: Date | string): boolean {
    const dateObj1 = typeof date1 === "string" ? parseISO(date1) : date1;
    const dateObj2 = typeof date2 === "string" ? parseISO(date2) : date2;
    return isBefore(dateObj1, dateObj2);
  }

  static isSameDay(date1: Date | string, date2: Date | string): boolean {
    const dateObj1 = typeof date1 === "string" ? parseISO(date1) : date1;
    const dateObj2 = typeof date2 === "string" ? parseISO(date2) : date2;
    return isSameDay(dateObj1, dateObj2);
  }

  // Date differences
  static daysBetween(date1: Date | string, date2: Date | string): number {
    const dateObj1 = typeof date1 === "string" ? parseISO(date1) : date1;
    const dateObj2 = typeof date2 === "string" ? parseISO(date2) : date2;
    return differenceInDays(dateObj2, dateObj1);
  }

  static monthsBetween(date1: Date | string, date2: Date | string): number {
    const dateObj1 = typeof date1 === "string" ? parseISO(date1) : date1;
    const dateObj2 = typeof date2 === "string" ? parseISO(date2) : date2;
    return differenceInMonths(dateObj2, dateObj1);
  }

  static yearsBetween(date1: Date | string, date2: Date | string): number {
    const dateObj1 = typeof date1 === "string" ? parseISO(date1) : date1;
    const dateObj2 = typeof date2 === "string" ? parseISO(date2) : date2;
    return differenceInYears(dateObj2, dateObj1);
  }

  // Utility methods
  static now(): Date {
    return new Date();
  }

  static today(): Date {
    return startOfDay(new Date());
  }

  static tomorrow(): Date {
    return addDays(startOfDay(new Date()), 1);
  }

  static yesterday(): Date {
    return subDays(startOfDay(new Date()), 1);
  }
}
