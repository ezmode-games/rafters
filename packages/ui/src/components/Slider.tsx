/**
 * Slider Component - AI Intelligence
 *
 * COGNITIVE LOAD: 5/10 (requires understanding current value and precision)
 * TRUST BUILDING: Immediate visual feedback builds user confidence
 * ACCESSIBILITY PRIORITY: Motor accessibility with enhanced touch targets
 *
 * DESIGN INTELLIGENCE GUIDES:
 * - Trust Building Patterns: rafters.realhandy.tech/llm/patterns/trust-building
 * - Progressive Enhancement: rafters.realhandy.tech/llm/patterns/progressive-enhancement
 * - Cognitive Load Management: rafters.realhandy.tech/llm/patterns/cognitive-load
 *
 * USAGE PATTERNS:
 * ✅ Precise Values: Show current value and units for clarity
 * ✅ Touch Targets: Large thumb size for mobile and accessibility
 * ✅ Step Indicators: Visual markers for discrete value ranges
 * ✅ Immediate Feedback: Real-time updates as user drags
 * ❌ Never: Invisible ranges, unclear min/max values, tiny touch targets
 *
 * Token knowledge: .rafters/tokens/registry.json
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
