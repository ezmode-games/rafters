/**
 * Unit tests for input masking schemas and presets
 */
import { describe, expect, it } from 'vitest';
import type { MaskPreset } from './index';
import { InputSchemas, MaskPresets } from './index';

describe('MaskPresets', () => {
  it('should contain all expected mask patterns', () => {
    expect(MaskPresets['phone-us']).toBe('(000) 000-0000');
    expect(MaskPresets['ssn-us']).toBe('000-00-0000');
    expect(MaskPresets['credit-card']).toBe('0000 0000 0000 0000');
    expect(MaskPresets['date-us']).toBe('00/00/0000');
    expect(MaskPresets['zip-us']).toBe('00000');
  });

  it('should have correct number of presets', () => {
    const keys = Object.keys(MaskPresets) as MaskPreset[];
    expect(keys).toHaveLength(5);
  });

  it('should use Masky.js pattern syntax', () => {
    // All patterns should only contain valid Masky tokens: 0 (digit), A (alphanumeric), S (alpha)
    // and separators like spaces, dashes, parentheses, slashes
    const validPattern = /^[0AS\s()\-/]+$/;

    for (const preset of Object.values(MaskPresets)) {
      expect(preset).toMatch(validPattern);
    }
  });
});

describe('InputSchemas', () => {
  describe('phoneUS', () => {
    it('should validate 10-digit phone number', () => {
      const result = InputSchemas.phoneUS.safeParse('1234567890');
      expect(result.success).toBe(true);
    });

    it('should reject non-10-digit input', () => {
      expect(InputSchemas.phoneUS.safeParse('123').success).toBe(false);
      expect(InputSchemas.phoneUS.safeParse('12345678901').success).toBe(false);
    });

    it('should reject formatted phone numbers', () => {
      expect(InputSchemas.phoneUS.safeParse('(123) 456-7890').success).toBe(false);
    });

    it('should have correct description matching preset name', () => {
      expect(InputSchemas.phoneUS.description).toBe('phone-us');
    });
  });

  describe('ssn', () => {
    it('should validate 9-digit SSN', () => {
      const result = InputSchemas.ssn.safeParse('123456789');
      expect(result.success).toBe(true);
    });

    it('should reject non-9-digit input', () => {
      expect(InputSchemas.ssn.safeParse('12345678').success).toBe(false);
      expect(InputSchemas.ssn.safeParse('1234567890').success).toBe(false);
    });

    it('should reject formatted SSN', () => {
      expect(InputSchemas.ssn.safeParse('123-45-6789').success).toBe(false);
    });

    it('should have correct description matching preset name', () => {
      expect(InputSchemas.ssn.description).toBe('ssn-us');
    });
  });

  describe('creditCard', () => {
    it('should validate 16-digit card number', () => {
      const result = InputSchemas.creditCard.safeParse('1234567890123456');
      expect(result.success).toBe(true);
    });

    it('should reject non-16-digit input', () => {
      expect(InputSchemas.creditCard.safeParse('123456789012345').success).toBe(false);
      expect(InputSchemas.creditCard.safeParse('12345678901234567').success).toBe(false);
    });

    it('should reject formatted card number', () => {
      expect(InputSchemas.creditCard.safeParse('1234 5678 9012 3456').success).toBe(false);
    });

    it('should have correct description matching preset name', () => {
      expect(InputSchemas.creditCard.description).toBe('credit-card');
    });
  });

  describe('dateUS', () => {
    it('should validate MM/DD/YYYY format', () => {
      const result = InputSchemas.dateUS.safeParse('12/31/2023');
      expect(result.success).toBe(true);
    });

    it('should reject invalid date formats', () => {
      expect(InputSchemas.dateUS.safeParse('2023-12-31').success).toBe(false);
      expect(InputSchemas.dateUS.safeParse('12/31/23').success).toBe(false);
      expect(InputSchemas.dateUS.safeParse('1/1/2023').success).toBe(false);
    });

    it('should accept dates in MM/DD/YYYY format', () => {
      // Note: Schema validates format, not semantic correctness
      // '31/12/2023' is valid format even if semantically incorrect for US dates
      expect(InputSchemas.dateUS.safeParse('01/01/2023').success).toBe(true);
      expect(InputSchemas.dateUS.safeParse('12/31/2023').success).toBe(true);
    });

    it('should have correct description matching preset name', () => {
      expect(InputSchemas.dateUS.description).toBe('date-us');
    });
  });

  describe('zipCode', () => {
    it('should validate 5-digit ZIP code', () => {
      const result = InputSchemas.zipCode.safeParse('12345');
      expect(result.success).toBe(true);
    });

    it('should reject non-5-digit input', () => {
      expect(InputSchemas.zipCode.safeParse('1234').success).toBe(false);
      expect(InputSchemas.zipCode.safeParse('123456').success).toBe(false);
    });

    it('should reject ZIP+4 format', () => {
      expect(InputSchemas.zipCode.safeParse('12345-6789').success).toBe(false);
    });

    it('should have correct description matching preset name', () => {
      expect(InputSchemas.zipCode.description).toBe('zip-us');
    });
  });

  describe('schema descriptions match preset names', () => {
    it('should have all schema descriptions as valid MaskPreset keys', () => {
      const presetKeys = Object.keys(MaskPresets) as MaskPreset[];

      expect(presetKeys).toContain(InputSchemas.phoneUS.description as MaskPreset);
      expect(presetKeys).toContain(InputSchemas.ssn.description as MaskPreset);
      expect(presetKeys).toContain(InputSchemas.creditCard.description as MaskPreset);
      expect(presetKeys).toContain(InputSchemas.dateUS.description as MaskPreset);
      expect(presetKeys).toContain(InputSchemas.zipCode.description as MaskPreset);
    });
  });
});
