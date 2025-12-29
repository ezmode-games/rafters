/**
 * Dialog component - drop-in replacement for shadcn/ui Dialog
 * Built with framework-agnostic primitives
 * Matches shadcn/Radix API exactly
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

// Context for sharing dialog state
interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentId: string;
  titleId: string;
  descriptionId: string;
  modal: boolean;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialogContext() {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error('Dialog components must be used within Dialog.Root');
  }
  return context;
}

// ==================== Dialog.Root ====================

export interface DialogProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
}

export function Dialog({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  modal = true,
}: DialogProps) {
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
  const contentId = `dialog-content-${id}`;
  const titleId = `dialog-title-${id}`;
  const descriptionId = `dialog-description-${id}`;

  const contextValue = React.useMemo(
    () => ({
      open,
      onOpenChange: handleOpenChange,
      contentId,
      titleId,
      descriptionId,
      modal,
    }),
    [open, handleOpenChange, contentId, titleId, descriptionId, modal],
  );

  return <DialogContext.Provider value={contextValue}>{children}</DialogContext.Provider>;
}

// ==================== Dialog.Trigger ====================

export interface DialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export function DialogTrigger({ asChild, onClick, ...props }: DialogTriggerProps) {
  const { open, onOpenChange, contentId } = useDialogContext();

  const ariaProps = getTriggerAriaProps({ open, controlsId: contentId });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    onOpenChange(!open);
  };

  if (asChild && React.isValidElement(props.children)) {
    return React.cloneElement(props.children, {
      ...ariaProps,
      onClick: handleClick,
    } as Partial<unknown>);
  }

  return <button type="button" onClick={handleClick} {...ariaProps} {...props} />;
}

// ==================== Dialog.Portal ====================

export interface DialogPortalProps {
  children: React.ReactNode;
  container?: HTMLElement | null;
  forceMount?: boolean;
}

export function DialogPortal({ children, container, forceMount }: DialogPortalProps) {
  const { open } = useDialogContext();
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

// ==================== Dialog.Overlay ====================

export interface DialogOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  forceMount?: boolean;
}

export function DialogOverlay({ asChild, forceMount, className, ...props }: DialogOverlayProps) {
  const { open } = useDialogContext();

  const ariaProps = getOverlayAriaProps({ open });

  const shouldRender = forceMount || open;

  if (!shouldRender) {
    return null;
  }

  const overlayProps = {
    ...ariaProps,
    className: classy('fixed inset-0 z-50 bg-black/80', className),
    ...props,
  };

  if (asChild && React.isValidElement(props.children)) {
    return React.cloneElement(props.children, overlayProps as Partial<unknown>);
  }

  return <div {...overlayProps} />;
}

// ==================== Dialog.Content ====================

export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  forceMount?: boolean;
  onOpenAutoFocus?: (event: Event) => void;
  onCloseAutoFocus?: (event: Event) => void;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: PointerEvent | TouchEvent) => void;
  onInteractOutside?: (event: Event) => void;
}

export function DialogContent({
  asChild,
  forceMount,
  onOpenAutoFocus,
  onCloseAutoFocus,
  onEscapeKeyDown: onEscapeKeyDownProp,
  onPointerDownOutside: onPointerDownOutsideProp,
  onInteractOutside,
  className,
  ...props
}: DialogContentProps) {
  const { open, onOpenChange, contentId, titleId, descriptionId, modal } = useDialogContext();
  const contentRef = React.useRef<HTMLDivElement>(null);

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
  // Render using a centered container (avoid Tailwind arbitrary bracket classes)
  const containerClass = classy(
    'fixed inset-0 z-50 flex items-center justify-center p-4',
    modal ? '' : '',
  );

  const innerClass = classy(className);

  const innerProps = {
    ref: contentRef,
    id: contentId,
    ...ariaProps,
    className: innerClass,
    ...props,
  } as React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> };

  // If asChild, clone the child with inner props
  if (asChild && React.isValidElement(props.children)) {
    const child = React.cloneElement(props.children, innerProps as Partial<unknown>);
    return <div className={containerClass}>{child}</div>;
  }

  return (
    <div className={containerClass}>
      <div {...innerProps} />
    </div>
  );
}

// ==================== Dialog.Title ====================

export interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  asChild?: boolean;
}

export function DialogTitle({ asChild, ...props }: DialogTitleProps) {
  const { titleId } = useDialogContext();

  const titleProps = {
    id: titleId,
    ...props,
  };

  if (asChild && React.isValidElement(props.children)) {
    return React.cloneElement(props.children, titleProps as Partial<unknown>);
  }

  return <h2 {...titleProps} />;
}

// ==================== Dialog.Description ====================

export interface DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  asChild?: boolean;
}

export function DialogDescription({ asChild, ...props }: DialogDescriptionProps) {
  const { descriptionId } = useDialogContext();

  const descriptionProps = {
    id: descriptionId,
    ...props,
  };

  if (asChild && React.isValidElement(props.children)) {
    return React.cloneElement(props.children, descriptionProps as Partial<unknown>);
  }

  return <p {...descriptionProps} />;
}

// ==================== Dialog.Close ====================

export interface DialogCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export function DialogClose({ asChild, onClick, ...props }: DialogCloseProps) {
  const { onOpenChange } = useDialogContext();

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

Dialog.Trigger = DialogTrigger;
Dialog.Portal = DialogPortal;
Dialog.Overlay = DialogOverlay;
Dialog.Content = DialogContent;
Dialog.Title = DialogTitle;
Dialog.Description = DialogDescription;
Dialog.Close = DialogClose;

// Re-export root as DialogRoot alias for shadcn compatibility
export { Dialog as DialogRoot };
