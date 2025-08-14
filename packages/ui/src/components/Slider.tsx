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
 * @dependencies @radix-ui/react-slider, @rafters/design-tokens/motion
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
import { contextEasing, contextTiming } from '@rafters/design-tokens/motion';
import { cn } from '../lib/utils';

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

export function Slider({
  className,
  thumbSize = 'default',
  showValue = false,
  showSteps = false,
  unit = '',
  trackSize = 'default',
  value,
  step,
  min = 0,
  max = 100,
  ref,
  ...props
}: SliderProps) {
  const currentValue = Array.isArray(value) ? value[0] : value;
  const displayValue = currentValue !== undefined ? `${currentValue}${unit}` : '';

  return (
    <div className="relative w-full">
      {showValue && currentValue !== undefined && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Value</span>
          <span className="text-sm text-muted-foreground font-mono">{displayValue}</span>
        </div>
      )}

      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          'relative flex w-full touch-none select-none items-center',
          'data-[disabled]:pointer-events-none data-[disabled]:opacity-disabled',
          // Motor accessibility: Enhanced interaction area
          trackSize === 'default' && 'py-2',
          trackSize === 'large' && 'py-4',
          className
        )}
        value={value}
        step={step}
        min={min}
        max={max}
        {...props}
      >
        <SliderPrimitive.Track
          className={cn(
            'relative w-full grow overflow-hidden rounded-full bg-secondary',
            // Motor accessibility: Enhanced track size for easier targeting
            trackSize === 'default' && 'h-2',
            trackSize === 'large' && 'h-3'
          )}
        >
          <SliderPrimitive.Range
            className={cn(
              'absolute h-full bg-primary transition-all',
              contextTiming.hover,
              contextEasing.hover
            )}
          />
        </SliderPrimitive.Track>

        <SliderPrimitive.Thumb
          className={cn(
            'block rounded-full border-2 border-primary bg-background ring-offset-background',
            'transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            contextTiming.hover,
            contextEasing.hover,
            'hover:scale-110 active:scale-95 disabled:pointer-events-none disabled:opacity-disabled',
            // Motor accessibility: Enhanced thumb sizes for easier manipulation
            thumbSize === 'default' && 'h-5 w-5',
            thumbSize === 'large' && 'h-6 w-6',
            // Enhanced touch targets for mobile
            'min-h-[44px] min-w-[44px] sm:min-h-[20px] sm:min-w-[20px]'
          )}
          aria-label={`Slider value ${displayValue}`}
        />
      </SliderPrimitive.Root>

      {showSteps && step && (
        <div className="flex justify-between mt-2 px-1">
          {Array.from({ length: Math.floor((max - min) / step) + 1 }, (_, i) => {
            const stepValue = min + i * step;
            return (
              <div key={stepValue} className="flex flex-col items-center">
                <div className="w-px h-2 bg-muted" />
                <span className="text-xs text-muted-foreground mt-1">
                  {stepValue}
                  {unit}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
