import { describe, expect, it } from 'vitest';
import {
  checkPayoutCountry,
  RESTRICTED_PAYOUT_COUNTRIES,
  ALLOWED_PERSONAL_PAYOUT_COUNTRIES,
} from './transpact-countries';

describe('transpact-countries', () => {
  describe('constants', () => {
    it('restricts PK, ZA, CN per the partner note', () => {
      expect(RESTRICTED_PAYOUT_COUNTRIES.has('PK')).toBe(true);
      expect(RESTRICTED_PAYOUT_COUNTRIES.has('ZA')).toBe(true);
      expect(RESTRICTED_PAYOUT_COUNTRIES.has('CN')).toBe(true);
    });

    it('allows IN, SG, HK per the partner note', () => {
      expect(ALLOWED_PERSONAL_PAYOUT_COUNTRIES.has('IN')).toBe(true);
      expect(ALLOWED_PERSONAL_PAYOUT_COUNTRIES.has('SG')).toBe(true);
      expect(ALLOWED_PERSONAL_PAYOUT_COUNTRIES.has('HK')).toBe(true);
    });
  });

  describe('checkPayoutCountry', () => {
    it('blocks Pakistan personal-name accounts', () => {
      const r = checkPayoutCountry('PK');
      expect(r.decision).toBe('blocked');
      expect(r.reason).toMatch(/PK|Pakistan/i);
    });

    it('blocks South Africa personal-name accounts', () => {
      const r = checkPayoutCountry('ZA');
      expect(r.decision).toBe('blocked');
      expect(r.reason).toMatch(/ZA|South Africa/i);
    });

    it('blocks China personal-name accounts', () => {
      const r = checkPayoutCountry('CN');
      expect(r.decision).toBe('blocked');
      expect(r.reason).toMatch(/CN|China/i);
    });

    it('allows India', () => {
      expect(checkPayoutCountry('IN').decision).toBe('allowed');
    });

    it('allows Singapore', () => {
      expect(checkPayoutCountry('SG').decision).toBe('allowed');
    });

    it('allows Hong Kong', () => {
      expect(checkPayoutCountry('HK').decision).toBe('allowed');
    });

    it('allows UK', () => {
      expect(checkPayoutCountry('GB').decision).toBe('allowed');
    });

    it('allows US', () => {
      expect(checkPayoutCountry('US').decision).toBe('allowed');
    });

    it('accepts lowercase iso codes and normalises', () => {
      expect(checkPayoutCountry('pk').decision).toBe('blocked');
      expect(checkPayoutCountry('in').decision).toBe('allowed');
    });

    it('returns "unknown" for empty / null / undefined', () => {
      expect(checkPayoutCountry('').decision).toBe('unknown');
      expect(checkPayoutCountry(null).decision).toBe('unknown');
      expect(checkPayoutCountry(undefined).decision).toBe('unknown');
    });

    it('returns "unknown" for invalid code shape', () => {
      expect(checkPayoutCountry('USA').decision).toBe('unknown'); // 3 chars
      expect(checkPayoutCountry('1').decision).toBe('unknown'); // digit
      expect(checkPayoutCountry('XX1').decision).toBe('unknown'); // mixed
    });

    it('trims whitespace around the code', () => {
      expect(checkPayoutCountry('  PK  ').decision).toBe('blocked');
      expect(checkPayoutCountry(' IN ').decision).toBe('allowed');
    });
  });
});
