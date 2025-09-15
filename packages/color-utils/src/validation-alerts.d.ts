/**
 * Semantic Mapping Validation System
 *
 * Pure mathematical validation of user semantic assignments
 * No AI needed - uses WCAG standards, color theory, and UX principles
 */
import type { OKLCH } from '@rafters/shared';
/**
 * Accessibility alert severity and types
 */
export interface AccessibilityAlert {
    severity: 'error' | 'warning' | 'caution';
    type: 'contrast' | 'cognitive-load' | 'color-vision' | 'cultural' | 'usability';
    message: string;
    suggestion: string;
    affectedTokens: string[];
    autoFix?: {
        token: string;
        newValue: string;
        reason: string;
    };
}
/**
 * User's semantic assignments from Studio right-click
 */
export interface SemanticMapping {
    [semanticToken: string]: {
        colorFamily: string;
        scalePosition: number;
        fullReference: string;
        oklch: OKLCH;
    };
}
/**
 * Validate semantic mappings with mathematical precision
 * Returns array of accessibility alerts and suggestions
 */
export declare function validateSemanticMappings(mappings: SemanticMapping, _colorFamilies: Record<string, OKLCH[]>): AccessibilityAlert[];
//# sourceMappingURL=validation-alerts.d.ts.map