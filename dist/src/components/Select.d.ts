import * as SelectPrimitive from "@radix-ui/react-select";
declare const Select: import("react").FC<SelectPrimitive.SelectProps>;
declare const SelectGroup: import("react").ForwardRefExoticComponent<
	SelectPrimitive.SelectGroupProps &
		import("react").RefAttributes<HTMLDivElement>
>;
declare const SelectValue: import("react").ForwardRefExoticComponent<
	SelectPrimitive.SelectValueProps &
		import("react").RefAttributes<HTMLSpanElement>
>;
declare const SelectTrigger: import("react").ForwardRefExoticComponent<
	Omit<
		SelectPrimitive.SelectTriggerProps &
			import("react").RefAttributes<HTMLButtonElement>,
		"ref"
	> & {
		/** Choice architecture: Show count of items for cognitive load awareness */
		showCount?: boolean;
		/** Total number of items for choice architecture */
		itemCount?: number;
		/** Motor accessibility: Enhanced touch targets */
		size?: "default" | "large";
	} & import("react").RefAttributes<HTMLButtonElement>
>;
declare const SelectScrollUpButton: import("react").ForwardRefExoticComponent<
	Omit<
		SelectPrimitive.SelectScrollUpButtonProps &
			import("react").RefAttributes<HTMLDivElement>,
		"ref"
	> &
		import("react").RefAttributes<HTMLDivElement>
>;
declare const SelectScrollDownButton: import("react").ForwardRefExoticComponent<
	Omit<
		SelectPrimitive.SelectScrollDownButtonProps &
			import("react").RefAttributes<HTMLDivElement>,
		"ref"
	> &
		import("react").RefAttributes<HTMLDivElement>
>;
declare const SelectContent: import("react").ForwardRefExoticComponent<
	Omit<
		SelectPrimitive.SelectContentProps &
			import("react").RefAttributes<HTMLDivElement>,
		"ref"
	> & {
		/** Progressive disclosure: Enable search for large lists */
		searchable?: boolean;
		/** Search placeholder text */
		searchPlaceholder?: string;
	} & import("react").RefAttributes<HTMLDivElement>
>;
declare const SelectLabel: import("react").ForwardRefExoticComponent<
	Omit<
		SelectPrimitive.SelectLabelProps &
			import("react").RefAttributes<HTMLDivElement>,
		"ref"
	> &
		import("react").RefAttributes<HTMLDivElement>
>;
declare const SelectItem: import("react").ForwardRefExoticComponent<
	Omit<
		SelectPrimitive.SelectItemProps &
			import("react").RefAttributes<HTMLDivElement>,
		"ref"
	> & {
		/** Choice architecture: Show additional context */
		description?: string;
		/** Interaction intelligence: Show keyboard shortcut */
		shortcut?: string;
	} & import("react").RefAttributes<HTMLDivElement>
>;
declare const SelectSeparator: import("react").ForwardRefExoticComponent<
	Omit<
		SelectPrimitive.SelectSeparatorProps &
			import("react").RefAttributes<HTMLDivElement>,
		"ref"
	> &
		import("react").RefAttributes<HTMLDivElement>
>;
export {
	Select,
	SelectGroup,
	SelectValue,
	SelectTrigger,
	SelectContent,
	SelectLabel,
	SelectItem,
	SelectSeparator,
	SelectScrollUpButton,
	SelectScrollDownButton,
};
//# sourceMappingURL=Select.d.ts.map
