/**
 * Select Component - AI Intelligence
 *
 * COGNITIVE LOAD: 4/10 (requires understanding options and making choice)
 * ATTENTION ECONOMICS: Dropdown state must be clearly indicated
 * PROGRESSIVE ENHANCEMENT: Works with keyboard, enhances with mouse interaction
 *
 * DESIGN INTELLIGENCE GUIDES:
 * - Cognitive Load Management: rafters.realhandy.tech/llm/patterns/cognitive-load
 * - Attention Economics: rafters.realhandy.tech/llm/patterns/attention-economics
 * - Progressive Enhancement: rafters.realhandy.tech/llm/patterns/progressive-enhancement
 *
 * USAGE PATTERNS:
 * ✅ Limited Options: 3-12 choices work best, use radio buttons for fewer
 * ✅ Clear Labels: Descriptive option text, avoid technical jargon
 * ✅ Default Selection: Pre-select most common/safe option when appropriate
 * ✅ Search Support: Enable search for 8+ options to reduce cognitive load
 * ❌ Never: Too many options without grouping, unclear option descriptions
 *
 * Token knowledge: .rafters/tokens/registry.json
 */
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
} from '@radix-ui/react-icons';
import * as SelectPrimitive from '@radix-ui/react-select';
import { contextEasing, contextTiming } from '@rafters/design-tokens/motion';
import { useState } from 'react';
import { cn } from '../lib/utils';

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {
  /** Choice architecture: Show count of items for cognitive load awareness */
  showCount?: boolean;
  /** Total number of items for choice architecture */
  itemCount?: number;
  /** Motor accessibility: Enhanced touch targets */
  size?: 'default' | 'large';
  ref?: React.Ref<React.ElementRef<typeof SelectPrimitive.Trigger>>;
}

function SelectTrigger({
  className,
  children,
  showCount,
  itemCount,
  size = 'default',
  ref,
  ...props
}: SelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm',
        'placeholder:text-muted-foreground',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-disabled',
        'transition-all hover:opacity-hover',
        contextTiming.hover,
        contextEasing.hover,
        '[&>span]:line-clamp-1',
        // Motor accessibility: Enhanced touch targets
        size === 'default' && 'h-10 py-2 min-h-[40px] sm:min-h-[40px]',
        size === 'large' && 'h-12 py-3 min-h-[44px] text-base',
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between w-full">
        {children}
        {showCount && itemCount && (
          <span
            className="text-xs text-muted-foreground ml-2"
            aria-label={`${itemCount} options available`}
          >
            ({itemCount})
          </span>
        )}
      </div>
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="h-4 w-4 opacity-50 ml-2 flex-shrink-0" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

interface SelectScrollUpButtonProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton> {
  ref?: React.Ref<React.ElementRef<typeof SelectPrimitive.ScrollUpButton>>;
}

function SelectScrollUpButton({ className, ref, ...props }: SelectScrollUpButtonProps) {
  return (
    <SelectPrimitive.ScrollUpButton
      ref={ref}
      className={cn('flex cursor-default items-center justify-center py-1', className)}
      {...props}
    >
      <ChevronUpIcon className="h-4 w-4" />
    </SelectPrimitive.ScrollUpButton>
  );
}

interface SelectScrollDownButtonProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton> {
  ref?: React.Ref<React.ElementRef<typeof SelectPrimitive.ScrollDownButton>>;
}

function SelectScrollDownButton({ className, ref, ...props }: SelectScrollDownButtonProps) {
  return (
    <SelectPrimitive.ScrollDownButton
      ref={ref}
      className={cn('flex cursor-default items-center justify-center py-1', className)}
      {...props}
    >
      <ChevronDownIcon className="h-4 w-4" />
    </SelectPrimitive.ScrollDownButton>
  );
}

interface SelectContentProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> {
  /** Progressive disclosure: Enable search for large lists */
  searchable?: boolean;
  /** Search placeholder text */
  searchPlaceholder?: string;
  ref?: React.Ref<React.ElementRef<typeof SelectPrimitive.Content>>;
}

function SelectContent({
  className,
  children,
  position = 'popper',
  searchable,
  searchPlaceholder = 'Search options...',
  ref,
  ...props
}: SelectContentProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={cn(
          'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md',
          'transition-all',
          contextTiming.modal,
          contextEasing.modalEnter,
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
          className
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        {searchable && (
          <div className="flex items-center px-3 py-2 border-b">
            <MagnifyingGlassIcon className="h-4 w-4 text-muted-foreground mr-2" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>
        )}
        <SelectPrimitive.Viewport
          className={cn(
            'p-1',
            position === 'popper' &&
              'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

interface SelectLabelProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label> {
  ref?: React.Ref<React.ElementRef<typeof SelectPrimitive.Label>>;
}

function SelectLabel({ className, ref, ...props }: SelectLabelProps) {
  return (
    <SelectPrimitive.Label
      ref={ref}
      className={cn('py-1.5 pl-8 pr-2 text-sm font-semibold', className)}
      {...props}
    />
  );
}

interface SelectItemProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {
  /** Choice architecture: Show additional context */
  description?: string;
  /** Interaction intelligence: Show keyboard shortcut */
  shortcut?: string;
  ref?: React.Ref<React.ElementRef<typeof SelectPrimitive.Item>>;
}

function SelectItem({
  className,
  children,
  description,
  shortcut,
  ref,
  ...props
}: SelectItemProps) {
  return (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none',
        'focus:bg-accent focus:text-accent-foreground',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-disabled',
        'transition-colors duration-200',
        // Enhanced touch targets for motor accessibility
        'min-h-[40px] sm:min-h-[36px]',
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="h-4 w-4" />
        </SelectPrimitive.ItemIndicator>
      </span>

      <div className="flex-1 flex flex-col">
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        {description && (
          <span
            className="text-xs text-muted-foreground mt-0.5"
            aria-label={`Description: ${description}`}
          >
            {description}
          </span>
        )}
      </div>

      {shortcut && (
        <span
          className="text-xs text-muted-foreground ml-2 font-mono"
          aria-label={`Keyboard shortcut: ${shortcut}`}
        >
          {shortcut}
        </span>
      )}
    </SelectPrimitive.Item>
  );
}

interface SelectSeparatorProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator> {
  ref?: React.Ref<React.ElementRef<typeof SelectPrimitive.Separator>>;
}

function SelectSeparator({ className, ref, ...props }: SelectSeparatorProps) {
  return (
    <SelectPrimitive.Separator
      ref={ref}
      className={cn('-mx-1 my-1 h-px bg-muted', className)}
      {...props}
    />
  );
}

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
