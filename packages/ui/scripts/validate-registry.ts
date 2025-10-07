/**
 * Build-time registry validation script
 * Validates all primitive registry entries before deployment
 *
 * @registryType registry:build-script
 * @registryVersion 0.1.0
 */

import type { PrimitiveRegistryEntry } from '../src/registry/types';
import { generateValidationReport, validatePrimitives } from '../src/registry/validation';

/**
 * Import all registry entries dynamically
 */
async function loadRegistryEntries(): Promise<PrimitiveRegistryEntry[]> {
  const entries: PrimitiveRegistryEntry[] = [];

  try {
    // Import r-button registry
    const rButton = await import('../src/registry/entries/r-button.registry');
    entries.push(rButton.rButtonRegistryEntry);
  } catch (error) {
    console.warn('Could not load r-button registry:', error);
  }

  try {
    // Import r-datepicker registry
    const rDatepicker = await import('../src/registry/entries/r-datepicker.registry');
    entries.push(rDatepicker.rDatepickerRegistryEntry);
  } catch (error) {
    console.warn('Could not load r-datepicker registry:', error);
  }

  try {
    // Import r-input registry
    const rInput = await import('../src/registry/entries/r-input.registry');
    entries.push(rInput.rInputRegistryEntry);
  } catch (error) {
    console.warn('Could not load r-input registry:', error);
  }

  try {
    // Import r-select registry
    const rSelect = await import('../src/registry/entries/r-select.registry');
    entries.push(rSelect.rSelectRegistryEntry);
  } catch (error) {
    console.warn('Could not load r-select registry:', error);
  }

  return entries;
}

/**
 * Main validation function
 */
async function validateRegistry(): Promise<void> {
  console.log('Starting primitive registry validation...\n');

  const entries = await loadRegistryEntries();

  if (entries.length === 0) {
    console.error('No registry entries found to validate');
    process.exit(1);
  }

  console.log(`Found ${entries.length} primitive(s) to validate\n`);

  const result = validatePrimitives(entries);

  const report = generateValidationReport(result);
  console.log(report);

  if (!result.valid) {
    console.error('\nRegistry validation failed');
    process.exit(1);
  }

  if (result.warnings.length > 0) {
    console.warn(`\nValidation passed with ${result.warnings.length} warning(s)`);
  }

  console.log('\nRegistry validation completed successfully');
  process.exit(0);
}

// Run validation
validateRegistry().catch((error) => {
  console.error('Fatal error during validation:', error);
  process.exit(1);
});
