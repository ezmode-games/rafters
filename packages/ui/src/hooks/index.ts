/**
 * React hooks for editor primitives
 * @module hooks
 */

// R-302: useClipboard
export { useClipboard } from './use-clipboard';
export type { UseClipboardOptions, UseClipboardReturn, ClipboardData } from './use-clipboard';

// R-304: useCommandPalette
export { useCommandPalette } from './use-command-palette';
export type { UseCommandPaletteOptions, UseCommandPaletteReturn } from './use-command-palette';

// R-303: useDragDrop
export { useDraggable, useDropZone } from './use-drag-drop';
export type {
  UseDraggableOptions,
  UseDraggableReturn,
  UseDropZoneOptions,
  UseDropZoneReturn,
} from './use-drag-drop';

// R-300: useBlockSelection
export { useBlockSelection } from './use-block-selection';
export type { UseBlockSelectionOptions, UseBlockSelectionReturn } from './use-block-selection';

// R-301: useHistory
export { useHistory } from './use-history';
export type { UseHistoryOptions, UseHistoryReturn } from './use-history';
