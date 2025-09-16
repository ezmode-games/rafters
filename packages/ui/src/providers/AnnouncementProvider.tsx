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
import { createContext, useContext } from 'react';

interface AnnouncementContextValue {
  // Minimal stub interface
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
  clearAnnouncements: () => void;
}

const AnnouncementContext = createContext<AnnouncementContextValue | null>(null);

export interface AnnouncementProviderProps {
  children: React.ReactNode;
  debounceDelay?: number;
  onAnnouncement?: (announcement: {
    menuId?: string;
    type: string;
    priority: 'polite' | 'assertive';
  }) => void;
}

/**
 * AnnouncementProvider Stub - Replace with React 19 patterns
 */
export function AnnouncementProvider({ children }: AnnouncementProviderProps) {
  // Minimal stub implementation
  function announce(_message: string, _priority?: 'polite' | 'assertive') {
    // No-op - TODO: Implement screen reader announcements
  }

  function clearAnnouncements() {
    // No-op
  }

  const value: AnnouncementContextValue = {
    announce,
    clearAnnouncements,
  };

  return <AnnouncementContext.Provider value={value}>{children}</AnnouncementContext.Provider>;
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

// Stub exports for MenuCoordinationSystem compatibility
export const MENU_MESSAGES = {
  OPENED: 'Menu opened',
  CLOSED: 'Menu closed',
  ITEM_SELECTED: 'Item selected',
  ITEM_FOCUSED: 'Item focused',
} as const;

// Alias for backwards compatibility
export const useMenuAnnouncements = useAnnouncements;
