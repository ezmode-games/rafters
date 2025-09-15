import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from 'react';
const AnnouncementContext = createContext(null);
/**
 * AnnouncementProvider Stub - Replace with React 19 patterns
 */
export function AnnouncementProvider({ children }) {
    // Minimal stub implementation
    function announce(_message, _priority) {
        // No-op - TODO: Implement screen reader announcements
    }
    function clearAnnouncements() {
        // No-op
    }
    const value = {
        announce,
        clearAnnouncements,
    };
    return _jsx(AnnouncementContext.Provider, { value: value, children: children });
}
/**
 * Hook to access announcement context
 */
export function useAnnouncements() {
    const context = useContext(AnnouncementContext);
    if (!context) {
        throw new Error('useAnnouncements must be used within AnnouncementProvider');
    }
    return context;
}
//# sourceMappingURL=AnnouncementProvider.js.map