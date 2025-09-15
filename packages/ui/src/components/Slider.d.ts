/**
 * Range slider component with precise value selection and accessibility features
 *
 * @registry-name slider
 * @registry-version 0.1.0
 * @registry-status published
 * @registry-path components/ui/Slider.tsx
 * @registry-type registry:component
 *
 * @cognitive-load 3/10 - Value selection with immediate visual feedback
 * @attention-economics Value communication: visual track, precise labels, immediate feedback
 * @trust-building Immediate visual feedback, undo capability, clear value indication
 * @accessibility Keyboard increment/decrement, screen reader value announcements, touch-friendly handles
 * @semantic-meaning Range contexts: settings=configuration, filters=data selection, controls=media/volume
 *
 * @usage-patterns
 * DO: Show current value and units for clarity
 * DO: Use large thumb size for mobile and accessibility
 * DO: Provide visual markers for discrete value ranges
 * DO: Give immediate feedback with real-time updates
 * NEVER: Invisible ranges, unclear min/max values, tiny touch targets
 *
 * @design-guides
 * - Trust Building: https://rafters.realhandy.tech/docs/llm/trust-building
 * - Progressive Enhancement: https://rafters.realhandy.tech/docs/llm/progressive-enhancement
 * - Cognitive Load: https://rafters.realhandy.tech/docs/llm/cognitive-load
 *
 * @dependencies @radix-ui/react-slider
 *
 * @example
 * ```tsx
 * // Basic slider with value display
 * <Slider
 *   defaultValue={[50]}
 *   max={100}
 *   step={1}
 *   className="w-full"
 * />
 *
 * // Range slider with multiple handles
 * <Slider
 *   defaultValue={[25, 75]}
 *   max={100}
 *   step={5}
 *   className="w-full"
 * />
 * ```
 */
import * as SliderPrimitive from '@radix-ui/react-slider';
export interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
    /** Motor accessibility: Enhanced thumb size for easier manipulation */
    thumbSize?: 'default' | 'large';
    /** Motor accessibility: Show value labels for precision */
    showValue?: boolean;
    /** Motor accessibility: Custom step indicators */
    showSteps?: boolean;
    /** Cognitive load: Display unit for context */
    unit?: string;
    /** Motor accessibility: Enhanced track height */
    trackSize?: 'default' | 'large';
    ref?: React.Ref<React.ElementRef<typeof SliderPrimitive.Root>>;
}
export declare function Slider({ className, thumbSize, showValue, showSteps, unit, trackSize, value, step, min, max, ref, ...props }: SliderProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=Slider.d.ts.map