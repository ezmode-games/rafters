/**
 * Popover component for contextual floating content
 *
 * @cognitive-load 4/10 - Contextual content requiring focus but not blocking workflow
 * @attention-economics Partial attention: appears on trigger, dismisses on outside click or escape
 * @trust-building Predictable positioning, easy dismissal, non-blocking interaction
 * @accessibility Focus management, escape key dismissal, outside click closes, screen reader announcements
 * @semantic-meaning Contextual enhancement: additional info, controls, or options related to trigger
 *
 * @usage-patterns
 * DO: Use for contextual actions or information related to trigger element
 * DO: Position intelligently to avoid viewport edges
 * DO: Allow dismissal via escape key and outside click
 * DO: Keep content focused and relevant to trigger
 * NEVER: Critical information, primary navigation, complex multi-step forms
 *
 * @example
 * ```tsx
 * <Popover>
 *   <Popover.Trigger asChild>
 *     <Button variant="outline">Open</Button>
 *   </Popover.Trigger>
 *   <Popover.Content>
 *     Popover content here
 *   </Popover.Content>
 * </Popover>
 * ```
 */

import * as React from 'react';
import { createPortal } from 'react-dom';
import classy from '../../primitives/classy';
import { computePosition } from '../../primitives/collision-detector';
import { onEscapeKeyDown } from '../../primitives/escape-keydown';
import { onPointerDownOutside } from '../../primitives/outside-click';
import { getPortalContainer } from '../../primitives/portal';
import type { Align, Side } from '../../primitives/types';

// Context for sharing popover state
interface PopoverContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentId: string;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  anchorRef: React.RefObject<HTMLElement | null>;
}

const PopoverContext = React.createContext<PopoverContextValue | null>(null);

function usePopoverContext() {
  const context = React.useContext(PopoverContext);
  if (!context) {
    throw new Error('Popover components must be used within Popover');
  }
  return context;
}

// ==================== Popover (Root) ====================

export interface PopoverProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Popover({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
}: PopoverProps) {
  // Uncontrolled state
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);

  // Determine if controlled
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange],
  );

  // Generate stable IDs for ARIA relationships
  const id = React.useId();
  const contentId = `popover-content-${id}`;

  // Refs for positioning
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const anchorRef = React.useRef<HTMLElement | null>(null);

  const contextValue = React.useMemo(
    () => ({
      open,
      onOpenChange: handleOpenChange,
      contentId,
      triggerRef,
      anchorRef,
    }),
    [open, handleOpenChange, contentId],
  );

  return <PopoverContext.Provider value={contextValue}>{children}</PopoverContext.Provider>;
}

// ==================== PopoverTrigger ====================

export interface PopoverTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export function PopoverTrigger({ asChild, onClick, ...props }: PopoverTriggerProps) {
  const { open, onOpenChange, contentId, triggerRef } = usePopoverContext();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    onOpenChange(!open);
  };

  const ariaProps = {
    'aria-expanded': open,
    'aria-controls': contentId,
    'aria-haspopup': 'dialog' as const,
    'data-state': open ? 'open' : 'closed',
  };

  if (asChild && React.isValidElement(props.children)) {
    return React.cloneElement(props.children, {
      ref: triggerRef,
      ...ariaProps,
      onClick: handleClick,
    } as Partial<unknown>);
  }

  return <button ref={triggerRef} type="button" onClick={handleClick} {...ariaProps} {...props} />;
}

// ==================== PopoverAnchor ====================

export interface PopoverAnchorProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export function PopoverAnchor({ asChild, ...props }: PopoverAnchorProps) {
  const { anchorRef } = usePopoverContext();

  if (asChild && React.isValidElement(props.children)) {
    return React.cloneElement(props.children, {
      ref: anchorRef,
    } as Partial<unknown>);
  }

  return <div ref={anchorRef as React.RefObject<HTMLDivElement>} {...props} />;
}

// ==================== PopoverPortal ====================

export interface PopoverPortalProps {
  children: React.ReactNode;
  container?: HTMLElement | null;
  forceMount?: boolean;
}

export function PopoverPortal({ children, container, forceMount }: PopoverPortalProps) {
  const { open } = usePopoverContext();
  const [mounted, setMounted] = React.useState(false);

  // Wait for client-side hydration
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const portalContainer = getPortalContainer(
    container !== undefined ? { container, enabled: true } : { enabled: true },
  );

  const shouldRender = forceMount || open;

  if (!shouldRender || !mounted || !portalContainer) {
    return null;
  }

  return createPortal(children, portalContainer);
}

// ==================== PopoverContent ====================

export interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  forceMount?: boolean;
  side?: Side;
  align?: Align;
  sideOffset?: number;
  alignOffset?: number;
  onOpenAutoFocus?: (event: Event) => void;
  onCloseAutoFocus?: (event: Event) => void;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: PointerEvent | TouchEvent) => void;
  onInteractOutside?: (event: Event) => void;
}

export function PopoverContent({
  asChild,
  forceMount,
  side = 'bottom',
  align = 'center',
  sideOffset = 4,
  alignOffset = 0,
  onOpenAutoFocus,
  onCloseAutoFocus,
  onEscapeKeyDown: onEscapeKeyDownProp,
  onPointerDownOutside: onPointerDownOutsideProp,
  onInteractOutside,
  className,
  style,
  ...props
}: PopoverContentProps) {
  const { open, onOpenChange, contentId, triggerRef, anchorRef } = usePopoverContext();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState<{
    x: number;
    y: number;
    side: Side;
    align: Align;
  }>({
    x: 0,
    y: 0,
    side,
    align,
  });

  // Position the popover
  React.useEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      const anchorElement = anchorRef.current || triggerRef.current;
      const floatingElement = contentRef.current;

      if (!anchorElement || !floatingElement) return;

      const result = computePosition(anchorElement, floatingElement, {
        side,
        align,
        sideOffset,
        alignOffset,
        avoidCollisions: true,
      });

      setPosition({
        x: result.x,
        y: result.y,
        side: result.side,
        align: result.align,
      });
    };

    // Initial position after render
    const frame = requestAnimationFrame(updatePosition);

    // Update on scroll and resize
    window.addEventListener('scroll', updatePosition, { capture: true, passive: true });
    window.addEventListener('resize', updatePosition, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updatePosition, { capture: true });
      window.removeEventListener('resize', updatePosition);
    };
  }, [open, side, align, sideOffset, alignOffset, anchorRef, triggerRef]);

  // Escape key handler
  React.useEffect(() => {
    if (!open) return;

    const cleanup = onEscapeKeyDown((event) => {
      onEscapeKeyDownProp?.(event);
      if (!event.defaultPrevented) {
        onOpenChange(false);
      }
    });

    return cleanup;
  }, [open, onOpenChange, onEscapeKeyDownProp]);

  // Outside click handler
  React.useEffect(() => {
    if (!open || !contentRef.current) return;

    const cleanup = onPointerDownOutside(contentRef.current, (event) => {
      // Don't close if clicking the trigger
      const target = event.target as Node;
      if (triggerRef.current?.contains(target)) {
        return;
      }

      onPointerDownOutsideProp?.(event);
      onInteractOutside?.(event as unknown as Event);

      if (!event.defaultPrevented) {
        onOpenChange(false);
      }
    });

    return cleanup;
  }, [open, onOpenChange, onPointerDownOutsideProp, onInteractOutside, triggerRef]);

  // Focus first element on open
  React.useEffect(() => {
    if (!open || !contentRef.current) return;

    const focusableElements = contentRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    const firstFocusable = focusableElements[0];
    if (firstFocusable) {
      firstFocusable.focus();
    }
  }, [open]);

  const shouldRender = forceMount || open;

  if (!shouldRender) {
    return null;
  }

  const contentStyle: React.CSSProperties = {
    ...style,
    position: 'absolute',
    left: 0,
    top: 0,
    transform: `translate(${Math.round(position.x)}px, ${Math.round(position.y)}px)`,
  };

  const contentProps = {
    ref: contentRef,
    id: contentId,
    role: 'dialog',
    'data-state': open ? 'open' : 'closed',
    'data-side': position.side,
    'data-align': position.align,
    className: classy(
      'z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
      'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
      'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className,
    ),
    style: contentStyle,
    ...props,
  };

  if (asChild && React.isValidElement(props.children)) {
    return React.cloneElement(props.children, contentProps as Partial<unknown>);
  }

  return <div {...contentProps} />;
}

// ==================== PopoverClose ====================

export interface PopoverCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export function PopoverClose({ asChild, onClick, ...props }: PopoverCloseProps) {
  const { onOpenChange } = usePopoverContext();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    onOpenChange(false);
  };

  if (asChild && React.isValidElement(props.children)) {
    return React.cloneElement(props.children, {
      onClick: handleClick,
    } as Partial<unknown>);
  }

  return <button type="button" onClick={handleClick} {...props} />;
}

// ==================== Namespaced Export (shadcn style) ====================

Popover.Trigger = PopoverTrigger;
Popover.Anchor = PopoverAnchor;
Popover.Portal = PopoverPortal;
Popover.Content = PopoverContent;
Popover.Close = PopoverClose;

// Re-export root as PopoverRoot alias for shadcn compatibility
export { Popover as PopoverRoot };
