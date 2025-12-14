/**
 * Shared primitive types
 */
export type CleanupFunction = () => void;

export type OutsideClickHandler = (event: MouseEvent | TouchEvent | PointerEvent) => void;

export type EscapeKeyHandler = (event: KeyboardEvent) => void;
