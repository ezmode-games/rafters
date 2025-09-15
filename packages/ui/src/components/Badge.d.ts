import type { ChipPosition, ChipVariant } from './Chip';
export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';
export type BadgeSize = 'sm' | 'md' | 'lg';
export type BadgeEmphasis = 'subtle' | 'default' | 'prominent';
export type BadgeChipVariant = ChipVariant;
export type BadgeChipPosition = ChipPosition;
export interface BadgeProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onClick'> {
    variant?: BadgeVariant;
    size?: BadgeSize;
    emphasis?: BadgeEmphasis;
    interactive?: boolean;
    removable?: boolean;
    onRemove?: () => void;
    onClick?: React.MouseEventHandler<HTMLElement>;
    icon?: React.ComponentType<{
        className?: string;
    }>;
    iconPosition?: 'left' | 'right';
    'aria-live'?: 'polite' | 'assertive';
    animate?: boolean;
    loading?: boolean;
    chip?: ChipVariant;
    chipPosition?: ChipPosition;
    chipValue?: string | number;
    ref?: React.Ref<HTMLElement>;
}
export declare function Badge({ variant, size, emphasis, interactive, removable, onRemove, icon: CustomIcon, iconPosition, animate, loading, chip, chipPosition, chipValue, children, className, onClick, onKeyDown, ref, ...props }: BadgeProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=Badge.d.ts.map