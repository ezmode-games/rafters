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
}
declare const Slider: import("react").ForwardRefExoticComponent<SliderProps & import("react").RefAttributes<HTMLSpanElement>>;
export { Slider };
//# sourceMappingURL=Slider.d.ts.map