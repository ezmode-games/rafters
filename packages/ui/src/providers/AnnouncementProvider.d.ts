/**
 * Announcement Provider Stub - AI Intelligence
 *
 * COGNITIVE LOAD: 1/10 (minimal stub)
 * TRUST BUILDING: Consistent announcements build user confidence
 * ACCESSIBILITY: WCAG AAA screen reader announcement management
 *
 * TODO: Implement proper React 19 patterns before menu development
 * See: https://github.com/real-handy/rafters/issues/83
 */
import type React from 'react';
interface AnnouncementContextValue {
    announce: (message: string, priority?: 'polite' | 'assertive') => void;
    clearAnnouncements: () => void;
}
export interface AnnouncementProviderProps {
    children: React.ReactNode;
    debounceDelay?: number;
}
/**
 * AnnouncementProvider Stub - Replace with React 19 patterns
 */
export declare function AnnouncementProvider({ children }: AnnouncementProviderProps): import("react/jsx-runtime").JSX.Element;
/**
 * Hook to access announcement context
 */
export declare function useAnnouncements(): AnnouncementContextValue;
export {};
//# sourceMappingURL=AnnouncementProvider.d.ts.map