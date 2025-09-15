/**
 * Focus Manager Stub - AI Intelligence
 *
 * COGNITIVE LOAD: 1/10 (minimal stub)
 * TRUST BUILDING: Predictable focus behavior builds user confidence
 * ACCESSIBILITY: WCAG AAA focus trap and restoration management
 *
 * TODO: Implement proper React 19 patterns before menu development
 * See: https://github.com/real-handy/rafters/issues/83
 */
import type React from 'react';
interface FocusManagerContextValue {
    registerFocusElement: (element: HTMLElement, menuId: string) => () => void;
    unregisterFocusElement: (menuId: string) => void;
    createFocusTrap: (boundary: HTMLElement, menuId: string) => void;
    releaseFocusTrap: (menuId: string) => void;
}
export interface FocusManagerProps {
    children: React.ReactNode;
    onFocusChange?: (menuId: string | null, element: HTMLElement | null) => void;
    announceChanges?: boolean;
}
/**
 * FocusManager Stub - Replace with React 19 patterns
 */
export declare function FocusManager({ children }: FocusManagerProps): import("react/jsx-runtime").JSX.Element;
/**
 * Hook to access focus management context
 */
export declare function useFocusManager(): FocusManagerContextValue;
/**
 * Menu focus hook stub
 */
export declare function useMenuFocus(_menuId: string, _containerRef: React.RefObject<HTMLElement>): {
    focusFirst: () => boolean;
    focusLast: () => boolean;
    focusNext: () => boolean;
    focusPrevious: () => boolean;
    registerFocusElement: (element: HTMLElement, menuId: string) => () => void;
    unregisterFocusElement: (menuId: string) => void;
    createFocusTrap: (boundary: HTMLElement, menuId: string) => void;
    releaseFocusTrap: (menuId: string) => void;
};
export {};
//# sourceMappingURL=FocusManager.d.ts.map