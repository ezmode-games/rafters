/**
 * ARIA primitives for accessible dialog implementation
 * Pure functions, no React dependency, SSR-safe
 */

export interface DialogAriaOptions {
  open: boolean;
  labelId?: string;
  descriptionId?: string;
  modal?: boolean;
}

export interface OverlayAriaOptions {
  open: boolean;
}

export interface TriggerAriaOptions {
  open: boolean;
  controlsId: string;
}

/**
 * Get ARIA attributes for dialog content element
 * SSR-safe: pure function returning static attributes
 */
export function getDialogAriaProps(options: DialogAriaOptions) {
  return {
    role: 'dialog',
    'aria-modal': options.modal !== false ? 'true' : undefined,
    'aria-labelledby': options.labelId,
    'aria-describedby': options.descriptionId,
    'data-state': options.open ? 'open' : 'closed',
  } as const;
}

/**
 * Get ARIA attributes for overlay element
 */
export function getOverlayAriaProps(options: OverlayAriaOptions) {
  return {
    'data-state': options.open ? 'open' : 'closed',
    'aria-hidden': 'true',
  } as const;
}

/**
 * Get ARIA attributes for trigger button
 */
export function getTriggerAriaProps(options: TriggerAriaOptions) {
  return {
    'aria-expanded': options.open,
    'aria-controls': options.controlsId,
    'aria-haspopup': 'dialog' as const,
    'data-state': options.open ? 'open' : 'closed',
  } as const;
}
