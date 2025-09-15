import * as SelectPrimitive from '@radix-ui/react-select';
declare const Select: import("react").FC<SelectPrimitive.SelectProps>;
declare const SelectGroup: import("react").ForwardRefExoticComponent<SelectPrimitive.SelectGroupProps & import("react").RefAttributes<HTMLDivElement>>;
declare const SelectValue: import("react").ForwardRefExoticComponent<SelectPrimitive.SelectValueProps & import("react").RefAttributes<HTMLSpanElement>>;
export interface SelectTriggerProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {
    /** Choice architecture: Show count of items for cognitive load awareness */
    showCount?: boolean;
    /** Total number of items for choice architecture */
    itemCount?: number;
    /** Motor accessibility: Enhanced touch targets */
    size?: 'default' | 'large';
    ref?: React.Ref<React.ElementRef<typeof SelectPrimitive.Trigger>>;
}
export declare function SelectTrigger({ className, children, showCount, itemCount, size, ref, ...props }: SelectTriggerProps): import("react/jsx-runtime").JSX.Element;
export interface SelectScrollUpButtonProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton> {
    ref?: React.Ref<React.ElementRef<typeof SelectPrimitive.ScrollUpButton>>;
}
export declare function SelectScrollUpButton({ className, ref, ...props }: SelectScrollUpButtonProps): import("react/jsx-runtime").JSX.Element;
export interface SelectScrollDownButtonProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton> {
    ref?: React.Ref<React.ElementRef<typeof SelectPrimitive.ScrollDownButton>>;
}
export declare function SelectScrollDownButton({ className, ref, ...props }: SelectScrollDownButtonProps): import("react/jsx-runtime").JSX.Element;
export interface SelectContentProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> {
    /** Progressive disclosure: Enable search for large lists */
    searchable?: boolean;
    /** Search placeholder text */
    searchPlaceholder?: string;
    ref?: React.Ref<React.ElementRef<typeof SelectPrimitive.Content>>;
}
export declare function SelectContent({ className, children, position, searchable, searchPlaceholder, ref, ...props }: SelectContentProps): import("react/jsx-runtime").JSX.Element;
export interface SelectLabelProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label> {
    ref?: React.Ref<React.ElementRef<typeof SelectPrimitive.Label>>;
}
export declare function SelectLabel({ className, ref, ...props }: SelectLabelProps): import("react/jsx-runtime").JSX.Element;
export interface SelectItemProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {
    /** Choice architecture: Show additional context */
    description?: string;
    /** Interaction intelligence: Show keyboard shortcut */
    shortcut?: string;
    ref?: React.Ref<React.ElementRef<typeof SelectPrimitive.Item>>;
}
export declare function SelectItem({ className, children, description, shortcut, ref, ...props }: SelectItemProps): import("react/jsx-runtime").JSX.Element;
export interface SelectSeparatorProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator> {
    ref?: React.Ref<React.ElementRef<typeof SelectPrimitive.Separator>>;
}
export declare function SelectSeparator({ className, ref, ...props }: SelectSeparatorProps): import("react/jsx-runtime").JSX.Element;
export { Select, SelectGroup, SelectValue };
//# sourceMappingURL=Select.d.ts.map