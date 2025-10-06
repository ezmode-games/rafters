/**
 * Input masking schemas and presets for Rafters design system
 *
 * @registryType registry:schemas
 * @registryVersion 0.1.0
 * @dependencies zod
 */

import { z } from 'zod';

/**
 * Mask pattern presets using Masky.js syntax
 *
 * Pattern tokens:
 * - 0: Numeric digit (0-9)
 * - A: Alphanumeric character
 * - S: Alphabetic character (a-z, A-Z)
 *
 * @see https://github.com/eduardovillao/masky-js
 */
export const MaskPresets = {
  'phone-us': '(000) 000-0000',
  'ssn-us': '000-00-0000',
  'credit-card': '0000 0000 0000 0000',
  'date-us': '00/00/0000',
  'zip-us': '00000',
} as const;

/**
 * Mask preset identifier type
 */
export type MaskPreset = keyof typeof MaskPresets;

/**
 * Pre-configured Zod schemas with embedded mask hints
 *
 * Each schema includes:
 * - Validation regex
 * - Error message
 * - Mask preset hint via .describe()
 *
 * The mask hint is used by Input components to auto-apply masking
 */
export const InputSchemas = {
  /**
   * US phone number (10 digits)
   * Format: (XXX) XXX-XXXX
   */
  phoneUS: z
    .string()
    .regex(/^\d{10}$/, 'Enter 10-digit phone number')
    .describe('phone-us'),

  /**
   * US Social Security Number (9 digits)
   * Format: XXX-XX-XXXX
   */
  ssn: z
    .string()
    .regex(/^\d{9}$/, 'Enter 9-digit Social Security Number')
    .describe('ssn-us'),

  /**
   * Credit card number (16 digits)
   * Format: XXXX XXXX XXXX XXXX
   */
  creditCard: z
    .string()
    .regex(/^\d{16}$/, 'Enter 16-digit card number')
    .describe('credit-card'),

  /**
   * US date format
   * Format: MM/DD/YYYY
   */
  dateUS: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Enter date as MM/DD/YYYY')
    .describe('date-us'),

  /**
   * US ZIP code (5 digits)
   * Format: XXXXX
   */
  zipCode: z
    .string()
    .regex(/^\d{5}$/, 'Enter 5-digit ZIP code')
    .describe('zip-us'),
} as const;
