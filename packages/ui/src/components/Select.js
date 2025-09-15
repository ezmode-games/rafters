import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
/**
 * Dropdown selection component with search and accessibility features
 *
 * @registry-name select
 * @registry-version 0.1.0
 * @registry-status published
 * @registry-path components/ui/Select.tsx
 * @registry-type registry:component
 *
 * @cognitive-load 5/10 - Option selection with search functionality requires cognitive processing
 * @attention-economics State management: closed=compact display, open=full options, searching=filtered results
 * @trust-building Search functionality, clear selection indication, undo patterns for accidental selections
 * @accessibility Keyboard navigation, screen reader announcements, focus management, option grouping
 * @semantic-meaning Option structure: value=data, label=display, group=categorization, disabled=unavailable choices
 *
 * @usage-patterns
 * DO: Use 3-12 choices for optimal cognitive load
 * DO: Provide clear, descriptive option text
 * DO: Pre-select most common/safe option when appropriate
 * DO: Enable search for 8+ options to reduce cognitive load
 * NEVER: Too many options without grouping, unclear option descriptions
 *
 * @design-guides
 * - Cognitive Load: https://rafters.realhandy.tech/docs/llm/cognitive-load
 * - Attention Economics: https://rafters.realhandy.tech/docs/llm/attention-economics
 * - Progressive Enhancement: https://rafters.realhandy.tech/docs/llm/progressive-enhancement
 *
 * @dependencies @radix-ui/react-select, @radix-ui/react-icons
 *
 * @example
 * ```tsx
 * // Basic select with options
 * <Select>
 *   <SelectTrigger>
 *     <SelectValue placeholder="Choose option..." />
 *   </SelectTrigger>
 *   <SelectContent>
 *     <SelectItem value="option1">Option 1</SelectItem>
 *     <SelectItem value="option2">Option 2</SelectItem>
 *   </SelectContent>
 * </Select>
 * ```
 */
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, MagnifyingGlassIcon, } from '@radix-ui/react-icons';
import * as SelectPrimitive from '@radix-ui/react-select';
import { useState } from 'react';
import { cn } from '../lib/utils';
const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;
export function SelectTrigger({ className, children, showCount, itemCount, size = 'default', ref, ...props }) {
    return (_jsxs(SelectPrimitive.Trigger, { ref: ref, className: cn('flex w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm', 'placeholder:text-muted-foreground', 'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2', 'disabled:cursor-not-allowed disabled:opacity-disabled', 'transition-all hover:opacity-hover', 'motion-hover', '[&>span]:line-clamp-1', 
        // Motor accessibility: Enhanced touch targets
        size === 'default' && 'h-10 py-2 min-h-[40px] sm:min-h-[40px]', size === 'large' && 'h-12 py-3 min-h-[44px] text-base', className), ...props, children: [_jsxs("div", { className: "flex items-center justify-between w-full", children: [children, showCount && itemCount && (_jsxs("span", { className: "text-xs text-muted-foreground ml-2", children: ["(", itemCount, ")"] }))] }), _jsx(SelectPrimitive.Icon, { asChild: true, children: _jsx(ChevronDownIcon, { className: "h-4 w-4 opacity-50 ml-2 flex-shrink-0" }) })] }));
}
export function SelectScrollUpButton({ className, ref, ...props }) {
    return (_jsx(SelectPrimitive.ScrollUpButton, { ref: ref, className: cn('flex cursor-default items-center justify-center py-1', className), ...props, children: _jsx(ChevronUpIcon, { className: "h-4 w-4" }) }));
}
export function SelectScrollDownButton({ className, ref, ...props }) {
    return (_jsx(SelectPrimitive.ScrollDownButton, { ref: ref, className: cn('flex cursor-default items-center justify-center py-1', className), ...props, children: _jsx(ChevronDownIcon, { className: "h-4 w-4" }) }));
}
export function SelectContent({ className, children, position = 'popper', searchable, searchPlaceholder = 'Search options...', ref, ...props }) {
    const [searchQuery, setSearchQuery] = useState('');
    return (_jsx(SelectPrimitive.Portal, { children: _jsxs(SelectPrimitive.Content, { ref: ref, className: cn('relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md', 'transition-all', 'motion-modal', 'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95', 'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2', position === 'popper' &&
                'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1', className), position: position, ...props, children: [_jsx(SelectScrollUpButton, {}), searchable && (_jsxs("div", { className: "flex items-center px-3 py-2 border-b", children: [_jsx(MagnifyingGlassIcon, { className: "h-4 w-4 text-muted-foreground mr-2" }), _jsx("input", { type: "text", placeholder: searchPlaceholder, value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground", onClick: (e) => e.stopPropagation(), onKeyDown: (e) => e.stopPropagation() })] })), _jsx(SelectPrimitive.Viewport, { className: cn('p-1', position === 'popper' &&
                        'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'), children: children }), _jsx(SelectScrollDownButton, {})] }) }));
}
export function SelectLabel({ className, ref, ...props }) {
    return (_jsx(SelectPrimitive.Label, { ref: ref, className: cn('py-1.5 pl-8 pr-2 text-sm font-semibold', className), ...props }));
}
export function SelectItem({ className, children, description, shortcut, ref, ...props }) {
    return (_jsxs(SelectPrimitive.Item, { ref: ref, className: cn('relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none', 'focus:bg-accent focus:text-accent-foreground', 'data-[disabled]:pointer-events-none data-[disabled]:opacity-disabled', 'transition-colors duration-200', 
        // Enhanced touch targets for motor accessibility
        'min-h-[40px] sm:min-h-[36px]', className), ...props, children: [_jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: _jsx(SelectPrimitive.ItemIndicator, { children: _jsx(CheckIcon, { className: "h-4 w-4" }) }) }), _jsxs("div", { className: "flex-1 flex flex-col", children: [_jsx(SelectPrimitive.ItemText, { children: children }), description && _jsx("span", { className: "text-xs text-muted-foreground mt-0.5", children: description })] }), shortcut && _jsx("span", { className: "text-xs text-muted-foreground ml-2 font-mono", children: shortcut })] }));
}
export function SelectSeparator({ className, ref, ...props }) {
    return (_jsx(SelectPrimitive.Separator, { ref: ref, className: cn('-mx-1 my-1 h-px bg-muted', className), ...props }));
}
export { Select, SelectGroup, SelectValue };
//# sourceMappingURL=Select.js.map