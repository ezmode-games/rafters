/**
 * Runtime validation utilities for primitive registry
 *
 * @registryType registry:validation
 * @registryVersion 0.1.0
 */

import type { AccessibilityMetadata, Rationale, UsageContext } from './types';
import {
  PrimitiveRegistryEntrySchema,
  validateWCAGAAAContrast,
  validateWCAGAAATouchTarget,
} from './types';

/**
 * Validation error detail
 */
export interface ValidationError {
  primitive: string;
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

/**
 * Comprehensive validation result
 */
export interface ComprehensiveValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  summary: {
    totalChecks: number;
    passed: number;
    failed: number;
    warnings: number;
  };
}

/**
 * Validate primitive registry entry with comprehensive checks
 */
export function validatePrimitive(entry: unknown): ComprehensiveValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Schema validation
  const schemaResult = PrimitiveRegistryEntrySchema.safeParse(entry);

  if (!schemaResult.success) {
    for (const err of schemaResult.error.issues) {
      errors.push({
        primitive: 'unknown',
        field: String(err.path.join('.')),
        message: err.message,
        severity: 'error',
      });
    }

    return {
      valid: false,
      errors,
      warnings,
      summary: {
        totalChecks: 1,
        passed: 0,
        failed: errors.length,
        warnings: warnings.length,
      },
    };
  }

  const primitive = schemaResult.data;
  let totalChecks = 0;
  let passed = 0;

  // Validate WCAG AAA compliance
  if (primitive.accessibility.wcagLevel === 'AAA') {
    totalChecks++;
    if (!validateWCAGAAAContrast(primitive.accessibility.contrastRequirement)) {
      errors.push({
        primitive: primitive.name,
        field: 'accessibility.contrastRequirement',
        message: 'WCAG AAA requires 7:1 for normal text and 4.5:1 for large text',
        severity: 'error',
      });
    } else {
      passed++;
    }

    totalChecks++;
    if (!validateWCAGAAATouchTarget(primitive.accessibility.minimumTouchTarget)) {
      errors.push({
        primitive: primitive.name,
        field: 'accessibility.minimumTouchTarget',
        message: 'WCAG AAA requires minimum 44px touch targets',
        severity: 'error',
      });
    } else {
      passed++;
    }
  }

  // Validate cognitive load reasoning
  totalChecks++;
  if (primitive.rationale.cognitiveLoadReasoning.length < 20) {
    warnings.push({
      primitive: primitive.name,
      field: 'rationale.cognitiveLoadReasoning',
      message: 'Cognitive load reasoning should be more detailed (minimum 20 characters)',
      severity: 'warning',
    });
  } else {
    passed++;
  }

  // Validate usage context completeness
  totalChecks++;
  if (primitive.usageContext.dos.length === 0) {
    warnings.push({
      primitive: primitive.name,
      field: 'usageContext.dos',
      message: 'Usage context should include at least one DO guideline',
      severity: 'warning',
    });
  } else {
    passed++;
  }

  totalChecks++;
  if (primitive.usageContext.donts.length === 0) {
    warnings.push({
      primitive: primitive.name,
      field: 'usageContext.donts',
      message: 'Usage context should include at least one DONT guideline',
      severity: 'warning',
    });
  } else {
    passed++;
  }

  // Validate keyboard navigation
  totalChecks++;
  if (primitive.accessibility.keyboardNavigation.length === 0) {
    errors.push({
      primitive: primitive.name,
      field: 'accessibility.keyboardNavigation',
      message: 'Keyboard navigation array cannot be empty',
      severity: 'error',
    });
  } else {
    passed++;
  }

  // Validate sources completeness
  totalChecks++;
  const hasLitSource = primitive.sources.some((s) => s.framework === 'lit');
  if (!hasLitSource) {
    errors.push({
      primitive: primitive.name,
      field: 'sources',
      message: 'Every primitive must have a Lit implementation',
      severity: 'error',
    });
  } else {
    passed++;
  }

  // Validate design principles
  totalChecks++;
  if (primitive.rationale.designPrinciples.length === 0) {
    warnings.push({
      primitive: primitive.name,
      field: 'rationale.designPrinciples',
      message: 'Design principles array should not be empty',
      severity: 'warning',
    });
  } else {
    passed++;
  }

  // Validate tradeoffs
  totalChecks++;
  if (primitive.rationale.tradeoffs.length === 0) {
    warnings.push({
      primitive: primitive.name,
      field: 'rationale.tradeoffs',
      message: 'Every design decision has tradeoffs - document at least one',
      severity: 'warning',
    });
  } else {
    passed++;
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    summary: {
      totalChecks,
      passed,
      failed: errors.length,
      warnings: warnings.length,
    },
  };
}

/**
 * Validate accessibility metadata
 */
export function validateAccessibility(accessibility: AccessibilityMetadata): ValidationError[] {
  const errors: ValidationError[] = [];

  // WCAG AAA specific checks
  if (accessibility.wcagLevel === 'AAA') {
    if (!validateWCAGAAAContrast(accessibility.contrastRequirement)) {
      errors.push({
        primitive: 'unknown',
        field: 'accessibility.contrastRequirement',
        message: 'WCAG AAA contrast requirements not met',
        severity: 'error',
      });
    }

    if (!validateWCAGAAATouchTarget(accessibility.minimumTouchTarget)) {
      errors.push({
        primitive: 'unknown',
        field: 'accessibility.minimumTouchTarget',
        message: 'WCAG AAA touch target requirements not met (minimum 44px)',
        severity: 'error',
      });
    }
  }

  // Validate ARIA role is not empty
  if (!accessibility.ariaRole || accessibility.ariaRole.trim().length === 0) {
    errors.push({
      primitive: 'unknown',
      field: 'accessibility.ariaRole',
      message: 'ARIA role cannot be empty',
      severity: 'error',
    });
  }

  // Validate keyboard navigation
  if (accessibility.keyboardNavigation.length === 0) {
    errors.push({
      primitive: 'unknown',
      field: 'accessibility.keyboardNavigation',
      message: 'Keyboard navigation must specify at least one key',
      severity: 'error',
    });
  }

  return errors;
}

/**
 * Validate rationale completeness
 */
export function validateRationale(rationale: Rationale): ValidationError[] {
  const warnings: ValidationError[] = [];

  if (rationale.purpose.length < 20) {
    warnings.push({
      primitive: 'unknown',
      field: 'rationale.purpose',
      message: 'Purpose should be more detailed (minimum 20 characters)',
      severity: 'warning',
    });
  }

  if (rationale.cognitiveLoadReasoning.length < 20) {
    warnings.push({
      primitive: 'unknown',
      field: 'rationale.cognitiveLoadReasoning',
      message: 'Cognitive load reasoning should be more detailed (minimum 20 characters)',
      severity: 'warning',
    });
  }

  if (rationale.designPrinciples.length === 0) {
    warnings.push({
      primitive: 'unknown',
      field: 'rationale.designPrinciples',
      message: 'Design principles should not be empty',
      severity: 'warning',
    });
  }

  if (rationale.tradeoffs.length === 0) {
    warnings.push({
      primitive: 'unknown',
      field: 'rationale.tradeoffs',
      message: 'Document at least one design tradeoff',
      severity: 'warning',
    });
  }

  return warnings;
}

/**
 * Validate usage context
 */
export function validateUsageContext(context: UsageContext): ValidationError[] {
  const warnings: ValidationError[] = [];

  if (context.dos.length === 0) {
    warnings.push({
      primitive: 'unknown',
      field: 'usageContext.dos',
      message: 'Include at least one DO guideline',
      severity: 'warning',
    });
  }

  if (context.donts.length === 0) {
    warnings.push({
      primitive: 'unknown',
      field: 'usageContext.donts',
      message: 'Include at least one DONT guideline',
      severity: 'warning',
    });
  }

  if (context.examples.length === 0) {
    warnings.push({
      primitive: 'unknown',
      field: 'usageContext.examples',
      message: 'Include at least one usage example',
      severity: 'warning',
    });
  }

  return warnings;
}

/**
 * Validate multiple primitives
 */
export function validatePrimitives(primitives: unknown[]): ComprehensiveValidationResult {
  const allErrors: ValidationError[] = [];
  const allWarnings: ValidationError[] = [];
  let totalChecks = 0;
  let totalPassed = 0;

  for (const primitive of primitives) {
    const result = validatePrimitive(primitive);
    allErrors.push(...result.errors);
    allWarnings.push(...result.warnings);
    totalChecks += result.summary.totalChecks;
    totalPassed += result.summary.passed;
  }

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
    summary: {
      totalChecks,
      passed: totalPassed,
      failed: allErrors.length,
      warnings: allWarnings.length,
    },
  };
}

/**
 * Generate validation report
 */
export function generateValidationReport(result: ComprehensiveValidationResult): string {
  const lines: string[] = [];

  lines.push('='.repeat(60));
  lines.push('Primitive Registry Validation Report');
  lines.push('='.repeat(60));
  lines.push('');

  lines.push(`Total Checks: ${result.summary.totalChecks}`);
  lines.push(`Passed: ${result.summary.passed}`);
  lines.push(`Failed: ${result.summary.failed}`);
  lines.push(`Warnings: ${result.summary.warnings}`);
  lines.push('');

  const successRate = ((result.summary.passed / result.summary.totalChecks) * 100).toFixed(1);
  lines.push(`Success Rate: ${successRate}%`);
  lines.push('');

  if (result.errors.length > 0) {
    lines.push('ERRORS:');
    lines.push('-'.repeat(60));
    for (const error of result.errors) {
      lines.push(`[${error.primitive}] ${error.field}`);
      lines.push(`  ${error.message}`);
      lines.push('');
    }
  }

  if (result.warnings.length > 0) {
    lines.push('WARNINGS:');
    lines.push('-'.repeat(60));
    for (const warning of result.warnings) {
      lines.push(`[${warning.primitive}] ${warning.field}`);
      lines.push(`  ${warning.message}`);
      lines.push('');
    }
  }

  if (result.valid) {
    lines.push('='.repeat(60));
    lines.push('VALIDATION PASSED');
    lines.push('='.repeat(60));
  } else {
    lines.push('='.repeat(60));
    lines.push('VALIDATION FAILED');
    lines.push('='.repeat(60));
  }

  return lines.join('\n');
}
