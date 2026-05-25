import { describe, expect, it } from 'vitest';
import {
  calculateDuration,
  formatCareerYear,
  formatDuration,
  getTotalCareerDuration,
  getCompanyDuration,
} from './duration';

describe('duration utilities', () => {
  it('calculates months including the start month', () => {
    const result = calculateDuration('2024.01', '2024.03');

    expect(result).toEqual({
      years: 0,
      months: 3,
      totalMonths: 3,
    });
  });

  it('formats localized duration strings', () => {
    expect(formatDuration({ years: 2, months: 5, totalMonths: 29 }, 'ko')).toBe(
      '2년 5개월'
    );
    expect(formatDuration({ years: 1, months: 1, totalMonths: 13 }, 'en')).toBe(
      '1 year 1 month'
    );
  });

  it('handles branch cases for ko and en duration formatting', () => {
    expect(formatDuration({ years: 0, months: 5, totalMonths: 5 }, 'ko')).toBe(
      '5개월'
    );
    expect(formatDuration({ years: 2, months: 0, totalMonths: 24 }, 'ko')).toBe(
      '2년'
    );
    expect(formatDuration({ years: 0, months: 1, totalMonths: 1 }, 'en')).toBe(
      '1 month'
    );
    expect(formatDuration({ years: 1, months: 0, totalMonths: 12 }, 'en')).toBe(
      '1 year'
    );
  });

  it('returns 0 duration for unknown company key', () => {
    expect(getCompanyDuration('unknown')).toEqual({
      years: 0,
      months: 0,
      totalMonths: 0,
    });
  });

  it('formats career year with ordinal suffix in english', () => {
    expect(
      formatCareerYear({ years: 3, months: 0, totalMonths: 36 }, 'en')
    ).toBe('3rd Year');
  });

  it('returns deterministic company duration for known company key', () => {
    // nexthub: May 2022 - Feb 2023 = 10 months
    expect(getCompanyDuration('nexthub')).toEqual({
      years: 0,
      months: 10,
      totalMonths: 10,
    });
  });

  it('formats career year in korean locale', () => {
    expect(
      formatCareerYear({ years: 3, months: 1, totalMonths: 37 }, 'ko')
    ).toBe('4년차');
  });

  it('returns positive total career duration', () => {
    const total = getTotalCareerDuration();

    expect(total.totalMonths).toBeGreaterThan(0);
    expect(total.years).toBeGreaterThanOrEqual(0);
    expect(total.months).toBeGreaterThanOrEqual(0);
  });
});
