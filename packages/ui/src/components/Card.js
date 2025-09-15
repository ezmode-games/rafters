import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '../lib/utils';
export function Card({ className, density = 'comfortable', interactive = false, prominence = 'default', ref, ...props }) {
    return (_jsx("div", { ref: ref, className: cn('rounded-lg border bg-card text-card-foreground transition-all', 'motion-hover', 
        // Cognitive load: Information density controls
        {
            'border-border shadow-sm': prominence === 'subtle',
            'border-border shadow-md': prominence === 'default',
            'border-border shadow-lg': prominence === 'elevated',
        }, 
        // Interaction affordance: Clear hover states for interactive cards
        interactive &&
            'cursor-pointer hover:shadow-md hover:border-accent-foreground/20 hover:scale-[1.02] active:scale-[0.98]', 
        // Motor accessibility: Ensure adequate touch targets for interactive cards
        interactive && 'min-h-[44px]', className), role: interactive ? 'button' : undefined, tabIndex: interactive ? 0 : undefined, ...props }));
}
export function CardHeader({ className, density = 'comfortable', ref, ...props }) {
    return (_jsx("div", { ref: ref, className: cn('flex flex-col space-y-1.5', 
        // Cognitive load: Adaptive spacing based on information density
        {
            'p-4': density === 'compact',
            'p-6': density === 'comfortable',
            'p-8': density === 'spacious',
        }, className), ...props }));
}
export function CardTitle({ className, level = 3, weight = 'semibold', ref, ...props }) {
    const HeadingTag = `h${level}`;
    return (_jsx(HeadingTag, { ref: ref, className: cn('leading-none tracking-tight', 
        // Information hierarchy: Semantic sizing based on heading level
        {
            'text-3xl': level === 1,
            'text-2xl': level === 2,
            'text-xl': level === 3,
            'text-lg': level === 4,
            'text-base': level === 5,
            'text-sm': level === 6,
        }, 
        // Scanability: Visual weight options
        {
            'font-normal': weight === 'normal',
            'font-medium': weight === 'medium',
            'font-semibold': weight === 'semibold',
        }, className), ...props }));
}
export function CardDescription({ className, truncate = false, prominence = 'default', ref, ...props }) {
    return (_jsx("p", { ref: ref, className: cn('text-sm leading-relaxed', 
        // Cognitive load: Truncation for long descriptions
        truncate && 'line-clamp-2', 
        // Information hierarchy: Prominence levels
        {
            'text-muted-foreground/70': prominence === 'subtle',
            'text-muted-foreground': prominence === 'default',
        }, className), ...props }));
}
export function CardContent({ className, density = 'comfortable', layout = 'default', ref, ...props }) {
    return (_jsx("div", { ref: ref, className: cn('pt-0', 
        // Cognitive load: Adaptive spacing
        {
            'p-4': density === 'compact',
            'p-6': density === 'comfortable',
            'p-8': density === 'spacious',
        }, 
        // Scanability: Layout patterns
        {
            '': layout === 'default',
            'grid grid-cols-1 gap-4': layout === 'grid',
            'space-y-3': layout === 'list',
        }, className), ...props }));
}
export function CardFooter({ className, density = 'comfortable', justify = 'start', ref, ...props }) {
    return (_jsx("div", { ref: ref, className: cn('flex items-center pt-0', 
        // Cognitive load: Adaptive spacing
        {
            'p-4': density === 'compact',
            'p-6': density === 'comfortable',
            'p-8': density === 'spacious',
        }, 
        // Scanability: Action layout
        {
            'justify-start': justify === 'start',
            'justify-center': justify === 'center',
            'justify-end': justify === 'end',
            'justify-between': justify === 'between',
        }, className), ...props }));
}
//# sourceMappingURL=Card.js.map