/**
 * Mobile-friendly drawer component with touch gestures and drag-to-dismiss
 *
 * @cognitive-load 4/10 - Lower cognitive load than dialogs; familiar mobile pattern
 * @attention-economics Partial attention capture: content slides up from edge, main context preserved
 * @trust-building Easy dismissal via drag gesture, overlay tap, or escape; natural mobile interaction
 * @accessibility Focus trap within drawer, escape key closes, proper ARIA dialog role, touch-friendly targets
 * @semantic-meaning Supplementary content: action sheets, bottom menus, quick selections on mobile
 *
 * @usage-patterns
 * DO: Use for mobile action sheets, quick selections, confirmations
 * DO: Use bottom side for mobile-first experiences
 * DO: Keep content minimal and action-focused
 * DO: Provide visible drag handle for touch affordance
 * DO: Support both touch drag and click dismissal
 * NEVER: Complex multi-step forms (use full page or Dialog)
 * NEVER: Primary navigation (use Sheet with side="left")
 * NEVER: Content requiring sustained attention
 *
 * @example
 * ```tsx
 * <Drawer>
 *   <Drawer.Trigger asChild>
 *     <Button>Open Drawer</Button>
 *   </Drawer.Trigger>
 *   <Drawer.Portal>
 *     <Drawer.Overlay />
 *     <Drawer.Content>
 *       <Drawer.Header>
 *         <Drawer.Title>Actions</Drawer.Title>
 *         <Drawer.Description>Select an action</Drawer.Description>
 *       </Drawer.Header>
 *       <div>Drawer content here</div>
 *       <Drawer.Footer>
 *         <Drawer.Close asChild>
 *           <Button variant="outline">Cancel</Button>
 *         </Drawer.Close>
 *       </Drawer.Footer>
 *     </Drawer.Content>
 *   </Drawer.Portal>
 * </Drawer>
 * ```
 */

import * as React from 'react';
import { createPortal } from 'react-dom';
import classy from '../../primitives/classy';
import {
  getDialogAriaProps,
  getOverlayAriaProps,
  getTriggerAriaProps,
} from '../../primitives/dialog-aria';
import { onEscapeKeyDown } from '../../primitives/escape-keydown';
import { createFocusTrap, preventBodyScroll } from '../../primitives/focus-trap';
import { onPointerDownOutside } from '../../primitives/outside-click';
import { getPortalContainer } from '../../primitives/portal';
import { mergeProps } from '../../primitives/slot';

// Context for sharing drawer state
interface DrawerContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentId: string;
  titleId: string;
  descriptionId: string;
  modal: boolean;
  side: DrawerSide;
}

type DrawerSide = 'top' | 'right' | 'bottom' | 'left';

const DrawerContext = React.createContext<DrawerContextValue | null>(null);

function useDrawerContext() {
  const context = React.useContext(DrawerContext);
  if (!context) {
    throw new Error('Drawer components must be used within Drawer.Root');
  }
  return context;
}

// ==================== Drawer.Root ====================

export interface DrawerProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
  /** The edge from which the drawer slides in. Defaults to "bottom" for mobile-first UX */
  side?: DrawerSide;
}

export function Drawer({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  modal = true,
  side = 'bottom',
}: DrawerProps) {
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

  // Generate stable IDs for ARIA relationships using React 19 useId
  const id = React.useId();
  const contentId = `drawer-content-${id}`;
  const titleId = `drawer-title-${id}`;
  const descriptionId = `drawer-description-${id}`;

  const contextValue = React.useMemo(
    () => ({
      open,
      onOpenChange: handleOpenChange,
      contentId,
      titleId,
      descriptionId,
      modal,
      side,
    }),
    [open, handleOpenChange, contentId, titleId, descriptionId, modal, side],
  );

  return <DrawerContext.Provider value={contextValue}>{children}</DrawerContext.Provider>;
}

// ==================== Drawer.Trigger ====================

export interface DrawerTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export function DrawerTrigger({ asChild, onClick, children, ...props }: DrawerTriggerProps) {
  const { open, onOpenChange, contentId } = useDrawerContext();

  const ariaProps = getTriggerAriaProps({ open, controlsId: contentId });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    onOpenChange(!open);
  };

  if (asChild && React.isValidElement(children)) {
    const childProps = children.props as Record<string, unknown>;
    const mergedProps = mergeProps({ ...ariaProps, onClick: handleClick }, childProps);
    return React.cloneElement(children, mergedProps as React.Attributes);
  }

  return (
    <button type="button" onClick={handleClick} {...ariaProps} {...props}>
      {children}
    </button>
  );
}

// ==================== Drawer.Portal ====================

export interface DrawerPortalProps {
  children: React.ReactNode;
  container?: HTMLElement | null;
  forceMount?: boolean;
}

export function DrawerPortal({ children, container, forceMount }: DrawerPortalProps) {
  const { open } = useDrawerContext();
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

// ==================== Drawer.Overlay ====================

export interface DrawerOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  forceMount?: boolean;
}

export function DrawerOverlay({ asChild, forceMount, className, ...props }: DrawerOverlayProps) {
  const { open } = useDrawerContext();

  const ariaProps = getOverlayAriaProps({ open });

  const shouldRender = forceMount || open;

  if (!shouldRender) {
    return null;
  }

  const overlayProps = {
    ...ariaProps,
    className: classy(
      'fixed inset-0 z-depth-overlay bg-black/80',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className,
    ),
    ...props,
  };

  if (asChild && React.isValidElement(props.children)) {
    return React.cloneElement(props.children, overlayProps as Partial<unknown>);
  }

  return <div {...overlayProps} />;
}

// ==================== Drawer.Content ====================

export interface DrawerContentProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  forceMount?: boolean;
  onOpenAutoFocus?: (event: Event) => void;
  onCloseAutoFocus?: (event: Event) => void;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: PointerEvent | TouchEvent) => void;
  onInteractOutside?: (event: Event) => void;
  /** Threshold in pixels for drag-to-dismiss. Defaults to 100. */
  dismissThreshold?: number;
  /** Enable drag-to-dismiss gesture. Defaults to true. */
  draggable?: boolean;
}

const sideVariants = {
  top: 'inset-x-0 top-0 border-b rounded-b-lg data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
  bottom:
    'inset-x-0 bottom-0 border-t rounded-t-lg data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
  left: 'inset-y-0 left-0 h-full w-3/4 max-w-sm border-r rounded-r-lg data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
  right:
    'inset-y-0 right-0 h-full w-3/4 max-w-sm border-l rounded-l-lg data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
} as const;

// Drag handle indicator based on side
const handleVariants = {
  top: 'mx-auto mt-auto mb-4 h-1.5 w-24 rounded-full bg-muted',
  bottom: 'mx-auto mb-auto mt-4 h-1.5 w-24 rounded-full bg-muted',
  left: 'my-auto ml-auto mr-4 w-1.5 h-24 rounded-full bg-muted',
  right: 'my-auto mr-auto ml-4 w-1.5 h-24 rounded-full bg-muted',
} as const;

export function DrawerContent({
  asChild,
  forceMount,
  onOpenAutoFocus,
  onCloseAutoFocus,
  onEscapeKeyDown: onEscapeKeyDownProp,
  onPointerDownOutside: onPointerDownOutsideProp,
  onInteractOutside,
  dismissThreshold = 100,
  draggable = true,
  className,
  children,
  ...props
}: DrawerContentProps) {
  const { open, onOpenChange, contentId, titleId, descriptionId, modal, side } = useDrawerContext();
  const contentRef = React.useRef<HTMLDivElement>(null);

  // Drag state for touch gestures
  const [dragOffset, setDragOffset] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const dragStartRef = React.useRef<{ x: number; y: number } | null>(null);

  // Focus trap
  React.useEffect(() => {
    if (!open || !modal || !contentRef.current) return;

    const cleanup = createFocusTrap(contentRef.current);
    return cleanup;
  }, [open, modal]);

  // Body scroll lock
  React.useEffect(() => {
    if (!open || !modal) return;

    const cleanup = preventBodyScroll();
    return cleanup;
  }, [open, modal]);

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
    if (!open || !modal || !contentRef.current) return;

    const cleanup = onPointerDownOutside(contentRef.current, (event) => {
      onPointerDownOutsideProp?.(event);
      onInteractOutside?.(event as unknown as Event);

      if (!event.defaultPrevented) {
        onOpenChange(false);
      }
    });

    return cleanup;
  }, [open, modal, onOpenChange, onPointerDownOutsideProp, onInteractOutside]);

  // Touch gesture handlers for drag-to-dismiss
  const handleTouchStart = React.useCallback(
    (event: React.TouchEvent) => {
      if (!draggable) return;
      const touch = event.touches[0];
      if (!touch) return;
      dragStartRef.current = { x: touch.clientX, y: touch.clientY };
      setIsDragging(true);
    },
    [draggable],
  );

  const handleTouchMove = React.useCallback(
    (event: React.TouchEvent) => {
      if (!draggable || !dragStartRef.current) return;
      const touch = event.touches[0];
      if (!touch) return;

      let offset = 0;
      if (side === 'bottom') {
        offset = Math.max(0, touch.clientY - dragStartRef.current.y);
      } else if (side === 'top') {
        offset = Math.max(0, dragStartRef.current.y - touch.clientY);
      } else if (side === 'right') {
        offset = Math.max(0, touch.clientX - dragStartRef.current.x);
      } else if (side === 'left') {
        offset = Math.max(0, dragStartRef.current.x - touch.clientX);
      }

      setDragOffset(offset);
    },
    [draggable, side],
  );

  const handleTouchEnd = React.useCallback(() => {
    if (!draggable) return;
    setIsDragging(false);

    if (dragOffset >= dismissThreshold) {
      onOpenChange(false);
    }

    setDragOffset(0);
    dragStartRef.current = null;
  }, [draggable, dragOffset, dismissThreshold, onOpenChange]);

  // Mouse drag handlers for desktop testing
  const handleMouseDown = React.useCallback(
    (event: React.MouseEvent) => {
      if (!draggable) return;
      // Only start drag from handle area
      const target = event.target as HTMLElement;
      if (!target.closest('[data-drawer-handle]')) return;

      dragStartRef.current = { x: event.clientX, y: event.clientY };
      setIsDragging(true);
    },
    [draggable],
  );

  React.useEffect(() => {
    if (!isDragging || !draggable) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (!dragStartRef.current) return;

      let offset = 0;
      if (side === 'bottom') {
        offset = Math.max(0, event.clientY - dragStartRef.current.y);
      } else if (side === 'top') {
        offset = Math.max(0, dragStartRef.current.y - event.clientY);
      } else if (side === 'right') {
        offset = Math.max(0, event.clientX - dragStartRef.current.x);
      } else if (side === 'left') {
        offset = Math.max(0, dragStartRef.current.x - event.clientX);
      }

      setDragOffset(offset);
    };

    const handleMouseUp = () => {
      setIsDragging(false);

      if (dragOffset >= dismissThreshold) {
        onOpenChange(false);
      }

      setDragOffset(0);
      dragStartRef.current = null;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, draggable, side, dragOffset, dismissThreshold, onOpenChange]);

  const ariaProps = getDialogAriaProps({
    open,
    labelId: titleId,
    descriptionId,
    modal,
  });

  const shouldRender = forceMount || open;

  if (!shouldRender) {
    return null;
  }

  // Calculate transform based on drag offset
  const getTransformStyle = (): React.CSSProperties => {
    if (!isDragging && dragOffset === 0) return {};

    const transforms: Record<DrawerSide, string> = {
      bottom: `translateY(${dragOffset}px)`,
      top: `translateY(-${dragOffset}px)`,
      right: `translateX(${dragOffset}px)`,
      left: `translateX(-${dragOffset}px)`,
    };

    return {
      transform: transforms[side],
      transition: isDragging ? 'none' : undefined,
    };
  };

  const contentClassName = classy(
    'fixed z-depth-modal flex flex-col bg-background shadow-lg',
    'data-[state=open]:animate-in data-[state=closed]:animate-out',
    'data-[state=open]:duration-300 data-[state=closed]:duration-200',
    sideVariants[side],
    className,
  );

  const contentProps = {
    ref: contentRef,
    id: contentId,
    ...ariaProps,
    className: contentClassName,
    style: getTransformStyle(),
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    onMouseDown: handleMouseDown,
    ...props,
  } as React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> };

  // Render handle at appropriate position
  const renderHandle = () => {
    if (!draggable) return null;
    const isVertical = side === 'top' || side === 'bottom';
    return (
      <div
        data-drawer-handle=""
        className={classy(
          'shrink-0 cursor-grab touch-none active:cursor-grabbing',
          isVertical ? 'flex justify-center py-2' : 'flex items-center px-2',
        )}
        aria-hidden="true"
      >
        <div className={handleVariants[side]} />
      </div>
    );
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, contentProps as Partial<unknown>);
  }

  return (
    <div {...contentProps}>
      {(side === 'bottom' || side === 'right') && renderHandle()}
      <div className="flex-1 overflow-auto p-6">{children}</div>
      {(side === 'top' || side === 'left') && renderHandle()}
    </div>
  );
}

// ==================== Drawer.Header ====================

export interface DrawerHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DrawerHeader({ className, ...props }: DrawerHeaderProps) {
  return (
    <div
      className={classy('flex flex-col gap-1.5 text-center sm:text-left', className)}
      {...props}
    />
  );
}

// ==================== Drawer.Footer ====================

export interface DrawerFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DrawerFooter({ className, ...props }: DrawerFooterProps) {
  return <div className={classy('mt-auto flex flex-col gap-2 pt-4', className)} {...props} />;
}

// ==================== Drawer.Title ====================

export interface DrawerTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  asChild?: boolean;
}

export function DrawerTitle({ asChild, className, ...props }: DrawerTitleProps) {
  const { titleId } = useDrawerContext();

  const titleProps = {
    id: titleId,
    className: classy('text-lg font-semibold text-foreground', className),
    ...props,
  };

  if (asChild && React.isValidElement(props.children)) {
    return React.cloneElement(props.children, titleProps as Partial<unknown>);
  }

  return <h2 {...titleProps} />;
}

// ==================== Drawer.Description ====================

export interface DrawerDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  asChild?: boolean;
}

export function DrawerDescription({ asChild, className, ...props }: DrawerDescriptionProps) {
  const { descriptionId } = useDrawerContext();

  const descriptionProps = {
    id: descriptionId,
    className: classy('text-sm text-muted-foreground', className),
    ...props,
  };

  if (asChild && React.isValidElement(props.children)) {
    return React.cloneElement(props.children, descriptionProps as Partial<unknown>);
  }

  return <p {...descriptionProps} />;
}

// ==================== Drawer.Close ====================

export interface DrawerCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export function DrawerClose({ asChild, onClick, children, ...props }: DrawerCloseProps) {
  const { onOpenChange } = useDrawerContext();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    onOpenChange(false);
  };

  if (asChild && React.isValidElement(children)) {
    const childProps = children.props as Record<string, unknown>;
    const mergedProps = mergeProps({ onClick: handleClick }, childProps);
    return React.cloneElement(children, mergedProps as React.Attributes);
  }

  return (
    <button type="button" onClick={handleClick} {...props}>
      {children}
    </button>
  );
}

// ==================== Namespaced Export (shadcn style) ====================

Drawer.Trigger = DrawerTrigger;
Drawer.Portal = DrawerPortal;
Drawer.Overlay = DrawerOverlay;
Drawer.Content = DrawerContent;
Drawer.Header = DrawerHeader;
Drawer.Footer = DrawerFooter;
Drawer.Title = DrawerTitle;
Drawer.Description = DrawerDescription;
Drawer.Close = DrawerClose;

// Re-export root as DrawerRoot alias for shadcn compatibility
export { Drawer as DrawerRoot };
