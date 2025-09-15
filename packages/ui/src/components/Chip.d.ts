export type ChipVariant = 'urgent' | 'new' | 'live' | 'beta' | 'premium' | 'count';
export type ChipPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
export type ChipSize = 'sm' | 'md' | 'lg';
export interface ChipProps extends React.HTMLAttributes<HTMLOutputElement> {
    variant: ChipVariant;
    position?: ChipPosition;
    value?: string | number;
    size?: ChipSize;
    'aria-label'?: string;
}
export declare const Chip: import("react").ForwardRefExoticComponent<ChipProps & import("react").RefAttributes<HTMLOutputElement>>;
//# sourceMappingURL=Chip.d.ts.map