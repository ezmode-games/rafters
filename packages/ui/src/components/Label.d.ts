/**
 * Form label component with semantic variants and accessibility associations
 *
 * @registry-name label
 * @registry-version 0.1.0
 * @registry-status published
 * @registry-path components/ui/Label.tsx
 * @registry-type registry:component
 *
 * @cognitive-load 2/10 - Provides clarity and reduces interpretation effort
 * @attention-economics Information hierarchy: field=required label, hint=helpful guidance, error=attention needed
 * @trust-building Clear requirement indication, helpful hints, non-punitive error messaging
 * @accessibility Form association, screen reader optimization, color-independent error indication
 * @semantic-meaning Variant meanings: field=input association, hint=guidance, error=validation feedback, success=confirmation
 *
 * @usage-patterns
 * DO: Always associate with input using htmlFor/id
 * DO: Use importance levels to guide user attention
 * DO: Provide visual and semantic marking for required fields
 * DO: Adapt styling based on form vs descriptive context
 * NEVER: Orphaned labels, unclear or ambiguous text, missing required indicators
 *
 * @design-guides
 * - Typography Intelligence: https://rafters.realhandy.tech/docs/llm/typography-intelligence
 * - Cognitive Load: https://rafters.realhandy.tech/docs/llm/cognitive-load
 * - Progressive Enhancement: https://rafters.realhandy.tech/docs/llm/progressive-enhancement
 *
 * @dependencies @radix-ui/react-label
 *
 * @example
 * ```tsx
 * // Form label with required indication
 * <Label htmlFor="email" required>
 *   Email Address
 * </Label>
 * <Input id="email" type="email" />
 *
 * // Label with validation state
 * <Label variant="error" htmlFor="password">
 *   Password (required)
 * </Label>
 * ```
 */
import * as LabelPrimitive from '@radix-ui/react-label';
export interface LabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
    required?: boolean;
    importance?: 'critical' | 'standard' | 'optional';
    context?: 'form' | 'descriptive' | 'action';
    validationState?: 'error' | 'warning' | 'success' | 'default';
    helpText?: string;
    semantic?: boolean;
    ref?: React.Ref<React.ElementRef<typeof LabelPrimitive.Root>>;
}
export declare function Label({ className, required, importance, context, validationState, helpText, semantic, children, ref, ...props }: LabelProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=Label.d.ts.map