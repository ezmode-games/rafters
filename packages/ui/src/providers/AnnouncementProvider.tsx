/**
 * Announcement Provider - AI Intelligence
 *
 * COGNITIVE LOAD: 1/10 (transparent accessibility layer)
 * TRUST BUILDING: Reliable screen reader announcements build user confidence
 * ACCESSIBILITY: WCAG AAA compliance with coordinated ARIA live regions
 *
 * Coordinates screen reader announcements across all menu types
 * Prevents announcement conflicts and manages announcement priority
 *
 * Token knowledge: .rafters/tokens/registry.json
 */

import type React from 'react';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { useMenuCoordination } from './MenuProvider';

// Zod schemas for validation
const AnnouncementPrioritySchema = z.enum(['polite', 'assertive', 'off']);
const AnnouncementTypeSchema = z.enum([
  'navigation',
  'state-change',
  'error',
  'success',
  'information',
  'warning',
  'status',
  'progress',
]);

const AnnouncementSchema = z.object({
  id: z.string(),
  message: z.string().min(1),
  priority: AnnouncementPrioritySchema,
  type: AnnouncementTypeSchema,
  menuId: z.string().optional(),
  timestamp: z.number(),
  duration: z.number().min(0).default(0), // 0 = no timeout
  persistent: z.boolean().default(false),
});

const AnnouncementConfigSchema = z.object({
  maxConcurrentAnnouncements: z.number().min(1).max(5).default(2),
  debounceDelay: z.number().min(0).max(1000).default(100),
  enableSpatialAnnouncements: z.boolean().default(true),
  enableProgressAnnouncements: z.boolean().default(true),
  verbosityLevel: z.enum(['minimal', 'standard', 'verbose']).default('standard'),
});

type AnnouncementPriority = z.infer<typeof AnnouncementPrioritySchema>;
type AnnouncementType = z.infer<typeof AnnouncementTypeSchema>;
type Announcement = z.infer<typeof AnnouncementSchema>;
type AnnouncementConfig = z.infer<typeof AnnouncementConfigSchema>;

interface AnnouncementProviderState {
  announcements: Map<string, Announcement>;
  activeRegions: Map<AnnouncementPriority, HTMLElement>;
  queue: Announcement[];
  config: AnnouncementConfig;
  lastAnnouncementTime: number;
}

interface AnnouncementProviderContextValue {
  // Core announcement methods
  announce: (
    message: string,
    options?: Partial<Omit<Announcement, 'id' | 'message' | 'timestamp'>>
  ) => string;
  announceForMenu: (
    menuId: string,
    message: string,
    options?: Partial<Omit<Announcement, 'id' | 'message' | 'timestamp' | 'menuId'>>
  ) => string;

  // Specialized announcement types
  announceNavigation: (message: string, menuId?: string) => string;
  announceStateChange: (message: string, menuId?: string) => string;
  announceError: (message: string, menuId?: string) => string;
  announceSuccess: (message: string, menuId?: string) => string;
  announceProgress: (message: string, menuId?: string) => string;

  // Queue management
  clearAnnouncements: (menuId?: string) => void;
  clearAnnouncementById: (id: string) => void;
  pauseAnnouncements: () => void;
  resumeAnnouncements: () => void;

  // Configuration
  updateConfig: (config: Partial<AnnouncementConfig>) => void;
  getConfig: () => AnnouncementConfig;

  // State queries
  getActiveAnnouncements: (menuId?: string) => Announcement[];
  getQueueLength: () => number;
  isAnnouncementActive: (id: string) => boolean;
}

const AnnouncementProviderContext = createContext<AnnouncementProviderContextValue | null>(null);

// Default messages for different menu types and actions
const MENU_MESSAGES = {
  context: {
    opened: 'Context menu opened',
    closed: 'Context menu closed',
    itemSelected: 'Menu item activated',
    navigationStart: 'Navigating context menu',
  },
  navigation: {
    opened: 'Navigation menu expanded',
    closed: 'Navigation menu collapsed',
    itemSelected: 'Navigation item selected',
    submenuOpened: 'Submenu opened',
    submenuClosed: 'Submenu closed',
  },
  dropdown: {
    opened: 'Dropdown menu opened',
    closed: 'Dropdown menu closed',
    itemSelected: 'Option selected',
    searchModeEnabled: 'Type to search options',
  },
  breadcrumb: {
    navigationChange: 'Page location changed',
    pathExpanded: 'Full navigation path shown',
    pathCollapsed: 'Navigation path collapsed',
  },
  tree: {
    nodeExpanded: 'Tree node expanded',
    nodeCollapsed: 'Tree node collapsed',
    nodeSelected: 'Tree item selected',
    levelChanged: (level: number) => `Tree level ${level}`,
  },
  sidebar: {
    expanded: 'Sidebar expanded',
    collapsed: 'Sidebar collapsed',
    navigationChanged: 'Sidebar navigation changed',
  },
} as const;

// Utility functions
const generateAnnouncementId = (): string =>
  `announcement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const createAnnouncementElement = (priority: AnnouncementPriority): HTMLElement => {
  const element = document.createElement('div');
  element.setAttribute('aria-live', priority);
  element.setAttribute('aria-atomic', 'true');
  element.className = 'sr-only absolute -left-[10000px] w-px h-px overflow-hidden';
  element.style.position = 'absolute';
  element.style.left = '-10000px';
  element.style.width = '1px';
  element.style.height = '1px';
  element.style.overflow = 'hidden';
  element.style.clipPath = 'inset(50%)';
  element.style.border = '0';
  element.style.margin = '-1px';
  element.style.padding = '0';

  document.body.appendChild(element);
  return element;
};

const removeAnnouncementElement = (element: HTMLElement): void => {
  if (document.body.contains(element)) {
    document.body.removeChild(element);
  }
};

export interface AnnouncementProviderProps {
  children: React.ReactNode;
  config?: Partial<AnnouncementConfig>;
  onAnnouncement?: (announcement: Announcement) => void;
}

/**
 * AnnouncementProvider - Coordinates screen reader announcements
 * Manages ARIA live regions and prevents announcement conflicts
 */
export const AnnouncementProvider: React.FC<AnnouncementProviderProps> = ({
  children,
  config: initialConfig,
  onAnnouncement,
}) => {
  const coordination = useMenuCoordination();

  const [state, setState] = useState<AnnouncementProviderState>(() => ({
    announcements: new Map(),
    activeRegions: new Map(),
    queue: [],
    config: { ...AnnouncementConfigSchema.parse(initialConfig || {}) },
    lastAnnouncementTime: 0,
  }));

  const debounceRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const pausedRef = useRef(false);

  // Initialize ARIA live regions
  useEffect(() => {
    const regions = new Map<AnnouncementPriority, HTMLElement>();

    // Create live regions for each priority
    for (const priority of ['polite', 'assertive'] as AnnouncementPriority[]) {
      regions.set(priority, createAnnouncementElement(priority));
    }

    setState((prev) => ({ ...prev, activeRegions: regions }));

    // Cleanup on unmount
    return () => {
      for (const element of regions.values()) {
        removeAnnouncementElement(element);
      }
    };
  }, []);

  // Core announcement method
  const announce = useCallback(
    (
      message: string,
      options: Partial<Omit<Announcement, 'id' | 'message' | 'timestamp'>> = {}
    ): string => {
      if (pausedRef.current || !message.trim()) return '';

      const announcement: Announcement = {
        id: generateAnnouncementId(),
        message: message.trim(),
        priority: options.priority || 'polite',
        type: options.type || 'information',
        menuId: options.menuId,
        timestamp: Date.now(),
        duration: options.duration || 0,
        persistent: options.persistent || false,
      };

      try {
        const validated = AnnouncementSchema.parse(announcement);

        // Debounce identical messages
        const debounceKey = `${validated.message}-${validated.menuId || 'global'}`;
        const existingTimeout = debounceRef.current.get(debounceKey);

        if (existingTimeout) {
          clearTimeout(existingTimeout);
        }

        debounceRef.current.set(
          debounceKey,
          setTimeout(() => {
            setState((prev) => {
              // Check if we're at max concurrent announcements
              const activeCount = prev.announcements.size;
              if (activeCount >= prev.config.maxConcurrentAnnouncements) {
                // Queue the announcement
                return {
                  ...prev,
                  queue: [...prev.queue, validated],
                };
              }

              // Add to active announcements
              const newAnnouncements = new Map(prev.announcements);
              newAnnouncements.set(validated.id, validated);

              // Trigger the actual announcement using current regions
              const region = prev.activeRegions.get(validated.priority);
              if (region) {
                // Clear previous content and set new message
                region.textContent = '';
                // Small delay to ensure screen readers detect the change
                setTimeout(() => {
                  region.textContent = validated.message;
                }, 10);
              }

              return {
                ...prev,
                announcements: newAnnouncements,
                lastAnnouncementTime: validated.timestamp,
              };
            });

            // Auto-remove after duration
            if (validated.duration > 0) {
              setTimeout(() => {
                clearAnnouncementById(validated.id);
              }, validated.duration);
            }

            // Notify callback
            onAnnouncement?.(validated);

            debounceRef.current.delete(debounceKey);
          }, state.config.debounceDelay)
        );

        return validated.id;
      } catch (error) {
        console.warn('Announcement validation failed:', error);
        return '';
      }
    },
    [state.config.debounceDelay, onAnnouncement]
  );

  // Announce for specific menu
  const announceForMenu = useCallback(
    (
      menuId: string,
      message: string,
      options: Partial<Omit<Announcement, 'id' | 'message' | 'timestamp' | 'menuId'>> = {}
    ): string => {
      return announce(message, { ...options, menuId });
    },
    [announce]
  );

  // Specialized announcement methods
  const announceNavigation = useCallback(
    (message: string, menuId?: string): string => {
      return announce(message, {
        type: 'navigation',
        priority: 'polite',
        menuId,
      });
    },
    [announce]
  );

  const announceStateChange = useCallback(
    (message: string, menuId?: string): string => {
      return announce(message, {
        type: 'state-change',
        priority: 'polite',
        menuId,
      });
    },
    [announce]
  );

  const announceError = useCallback(
    (message: string, menuId?: string): string => {
      return announce(message, {
        type: 'error',
        priority: 'assertive',
        menuId,
        persistent: true,
      });
    },
    [announce]
  );

  const announceSuccess = useCallback(
    (message: string, menuId?: string): string => {
      return announce(message, {
        type: 'success',
        priority: 'polite',
        menuId,
        duration: 3000,
      });
    },
    [announce]
  );

  const announceProgress = useCallback(
    (message: string, menuId?: string): string => {
      if (!state.config.enableProgressAnnouncements) return '';

      return announce(message, {
        type: 'progress',
        priority: 'polite',
        menuId,
        duration: 1000,
      });
    },
    [announce, state.config.enableProgressAnnouncements]
  );

  // Clear announcements
  const clearAnnouncements = useCallback((menuId?: string) => {
    setState((prev) => {
      const newAnnouncements = new Map();

      if (menuId) {
        // Only clear announcements for specific menu
        for (const [id, announcement] of prev.announcements) {
          if (announcement.menuId !== menuId) {
            newAnnouncements.set(id, announcement);
          }
        }
      }

      // Clear visual regions
      for (const region of prev.activeRegions.values()) {
        region.textContent = '';
      }

      return {
        ...prev,
        announcements: newAnnouncements,
        queue: menuId ? prev.queue.filter((a) => a.menuId !== menuId) : [],
      };
    });
  }, []);

  const clearAnnouncementById = useCallback((id: string) => {
    setState((prev) => {
      const newAnnouncements = new Map(prev.announcements);
      newAnnouncements.delete(id);

      // Process queue if space available
      if (prev.queue.length > 0 && newAnnouncements.size < prev.config.maxConcurrentAnnouncements) {
        const nextAnnouncement = prev.queue[0];
        newAnnouncements.set(nextAnnouncement.id, nextAnnouncement);

        return {
          ...prev,
          announcements: newAnnouncements,
          queue: prev.queue.slice(1),
        };
      }

      return {
        ...prev,
        announcements: newAnnouncements,
      };
    });
  }, []);

  // Pause/resume announcements
  const pauseAnnouncements = useCallback(() => {
    pausedRef.current = true;
  }, []);

  const resumeAnnouncements = useCallback(() => {
    pausedRef.current = false;
  }, []);

  // Configuration management
  const updateConfig = useCallback((newConfig: Partial<AnnouncementConfig>) => {
    try {
      setState((prev) => ({
        ...prev,
        config: AnnouncementConfigSchema.parse({ ...prev.config, ...newConfig }),
      }));
    } catch (error) {
      console.warn('Config update validation failed:', error);
    }
  }, []);

  const getConfig = useCallback(() => state.config, [state.config]);

  // State queries
  const getActiveAnnouncements = useCallback(
    (menuId?: string): Announcement[] => {
      const announcements = Array.from(state.announcements.values());

      if (menuId) {
        return announcements.filter((a) => a.menuId === menuId);
      }

      return announcements;
    },
    [state.announcements]
  );

  const getQueueLength = useCallback(() => state.queue.length, [state.queue.length]);

  const isAnnouncementActive = useCallback(
    (id: string) => {
      return state.announcements.has(id);
    },
    [state.announcements]
  );

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      for (const timeout of debounceRef.current.values()) {
        clearTimeout(timeout);
      }
    };
  }, []);

  const contextValue: AnnouncementProviderContextValue = {
    announce,
    announceForMenu,
    announceNavigation,
    announceStateChange,
    announceError,
    announceSuccess,
    announceProgress,
    clearAnnouncements,
    clearAnnouncementById,
    pauseAnnouncements,
    resumeAnnouncements,
    updateConfig,
    getConfig,
    getActiveAnnouncements,
    getQueueLength,
    isAnnouncementActive,
  };

  return (
    <AnnouncementProviderContext.Provider value={contextValue}>
      {children}
    </AnnouncementProviderContext.Provider>
  );
};

/**
 * Hook to access announcement context
 */
export const useAnnouncements = () => {
  const context = useContext(AnnouncementProviderContext);
  if (!context) {
    throw new Error('useAnnouncements must be used within AnnouncementProvider');
  }
  return context;
};

/**
 * Hook for menu components to manage announcements
 */
export const useMenuAnnouncements = (menuId: string, menuType: keyof typeof MENU_MESSAGES) => {
  const announcements = useAnnouncements();
  const coordination = useMenuCoordination();

  // Get menu-specific messages
  const messages = MENU_MESSAGES[menuType] || {};

  // Extract stable methods
  const {
    announceStateChange,
    announceNavigation,
    announceError,
    announceSuccess,
    announceForMenu,
    getActiveAnnouncements,
  } = announcements;

  // Convenience methods for common menu announcements
  const announceOpened = useCallback(() => {
    if ('opened' in messages) {
      return announceStateChange(messages.opened, menuId);
    }
    return announceStateChange(`${menuType} menu opened`, menuId);
  }, [announceStateChange, menuId, menuType, messages]);

  const announceClosed = useCallback(() => {
    if ('closed' in messages) {
      return announceStateChange(messages.closed, menuId);
    }
    return announceStateChange(`${menuType} menu closed`, menuId);
  }, [announceStateChange, menuId, menuType, messages]);

  const announceItemSelected = useCallback(
    (itemText?: string) => {
      const baseMessage = 'itemSelected' in messages ? messages.itemSelected : 'Item selected';
      const message = itemText ? `${baseMessage}: ${itemText}` : baseMessage;
      return announceNavigation(message, menuId);
    },
    [announceNavigation, menuId, messages]
  );

  const announceNavigationChange = useCallback(
    (direction: 'next' | 'previous' | 'first' | 'last') => {
      const message = `Moved to ${direction} item`;
      return announceNavigation(message, menuId);
    },
    [announceNavigation, menuId]
  );

  // Clear announcements when menu unmounts
  const { isMenuActive } = coordination;
  const { clearAnnouncements } = announcements;

  useEffect(() => {
    return () => {
      if (!isMenuActive(menuId)) {
        clearAnnouncements(menuId);
      }
    };
  }, [clearAnnouncements, menuId, isMenuActive]);

  return {
    announce: (message: string, options?: Parameters<typeof announcements.announceForMenu>[2]) =>
      announceForMenu(menuId, message, options),
    announceOpened,
    announceClosed,
    announceItemSelected,
    announceNavigationChange,
    announceError: (message: string) => announceError(message, menuId),
    announceSuccess: (message: string) => announceSuccess(message, menuId),
    clearAll: () => clearAnnouncements(menuId),
    getActiveCount: () => getActiveAnnouncements(menuId).length,
  };
};

// Export message templates and types
export { MENU_MESSAGES };
export type { Announcement, AnnouncementType, AnnouncementPriority, AnnouncementConfig };

// Display name for debugging
AnnouncementProvider.displayName = 'AnnouncementProvider';
