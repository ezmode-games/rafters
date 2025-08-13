import { z } from 'zod';
/**
 * Sidebar State Machine with Zustand
 *
 * COGNITIVE LOAD: 4/10 (centralized state management reduces component complexity)
 * TRUST BUILDING: Persistent state builds user confidence in navigation consistency
 * PROGRESSIVE ENHANCEMENT: State machine ensures graceful behavior in all scenarios
 *
 * States: idle -> navigating -> settled
 * Events: TOGGLE, NAVIGATE, SET_PREFERENCES, INITIALIZE, PERSIST
 */
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Zod validation schemas for state (CLAUDE.md requirement)
const NavigationPathSchema = z
  .string()
  .min(1, 'Path cannot be empty')
  .startsWith('/', 'Path must start with /');

const UserPreferencesSchema = z.object({
  persistCollapsed: z.boolean().default(true),
  position: z.enum(['left', 'right']).default('left'),
  size: z.enum(['compact', 'comfortable', 'spacious']).default('comfortable'),
  variant: z.enum(['default', 'floating', 'overlay']).default('default'),
  reduceMotion: z.boolean().default(false),
});

const SidebarStateSchema = z.object({
  // Core navigation state
  collapsed: z.boolean().default(false),
  currentPath: z.string().optional(),
  activeItem: z.string().optional(),

  // UI configuration
  collapsible: z.boolean().default(true),
  userPreferences: UserPreferencesSchema,

  // State machine status
  status: z.enum(['idle', 'navigating', 'settled']).default('idle'),
  lastAction: z.string().optional(),
  timestamp: z.number().default(() => Date.now()),
});

// Types derived from schemas
type UserPreferences = z.infer<typeof UserPreferencesSchema>;
type SidebarState = z.infer<typeof SidebarStateSchema>;

// Store interface with actions
interface SidebarStore extends SidebarState {
  // Navigation actions
  navigate: (path: string, onNavigate?: (path: string) => void) => void;
  setCurrentPath: (path: string) => void;
  setActiveItem: (item: string) => void;

  // UI state actions
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
  setCollapsible: (collapsible: boolean) => void;

  // Preferences management
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  resetPreferences: () => void;

  // State machine actions
  initialize: (initialState?: Partial<SidebarState>) => void;
  reset: () => void;

  // Validation helpers
  validatePath: (path: string) => boolean;
  getValidatedState: () => SidebarState;
}

// Default state
const defaultState: SidebarState = {
  collapsed: false,
  currentPath: undefined,
  activeItem: undefined,
  collapsible: true,
  userPreferences: {
    persistCollapsed: true,
    position: 'left',
    size: 'comfortable',
    variant: 'default',
    reduceMotion: false,
  },
  status: 'idle',
  lastAction: undefined,
  timestamp: Date.now(),
};

// Create the zustand store with persistence
export const useSidebarStore = create<SidebarStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...defaultState,

        // Navigation Actions
        navigate: (path: string, onNavigate?: (path: string) => void) => {
          try {
            const validatedPath = NavigationPathSchema.parse(path);

            set(
              (state) => ({
                ...state,
                currentPath: validatedPath,
                activeItem: validatedPath,
                status: 'navigating',
                lastAction: 'NAVIGATE',
                timestamp: Date.now(),
              }),
              false,
              'sidebar/navigate'
            );

            // Call external navigation handler
            onNavigate?.(validatedPath);

            // Settle the state after navigation
            setTimeout(() => {
              set(
                (state) => ({
                  ...state,
                  status: 'settled',
                  lastAction: 'SETTLE',
                  timestamp: Date.now(),
                }),
                false,
                'sidebar/settle'
              );
            }, 100);
          } catch (error) {
            console.warn('Navigation validation failed:', error);
            // Fallback navigation without validation
            set(
              (state) => ({
                ...state,
                currentPath: path,
                activeItem: path,
                status: 'settled',
                lastAction: 'NAVIGATE_FALLBACK',
                timestamp: Date.now(),
              }),
              false,
              'sidebar/navigate-fallback'
            );

            onNavigate?.(path);
          }
        },

        setCurrentPath: (path: string) => {
          set(
            (state) => ({
              ...state,
              currentPath: path,
              lastAction: 'SET_CURRENT_PATH',
              timestamp: Date.now(),
            }),
            false,
            'sidebar/setCurrentPath'
          );
        },

        setActiveItem: (item: string) => {
          set(
            (state) => ({
              ...state,
              activeItem: item,
              lastAction: 'SET_ACTIVE_ITEM',
              timestamp: Date.now(),
            }),
            false,
            'sidebar/setActiveItem'
          );
        },

        // UI State Actions
        toggleCollapsed: () => {
          set(
            (state) => ({
              ...state,
              collapsed: !state.collapsed,
              status: 'idle',
              lastAction: 'TOGGLE_COLLAPSED',
              timestamp: Date.now(),
            }),
            false,
            'sidebar/toggleCollapsed'
          );
        },

        setCollapsed: (collapsed: boolean) => {
          set(
            (state) => ({
              ...state,
              collapsed,
              status: 'idle',
              lastAction: 'SET_COLLAPSED',
              timestamp: Date.now(),
            }),
            false,
            'sidebar/setCollapsed'
          );
        },

        setCollapsible: (collapsible: boolean) => {
          set(
            (state) => ({
              ...state,
              collapsible,
              lastAction: 'SET_COLLAPSIBLE',
              timestamp: Date.now(),
            }),
            false,
            'sidebar/setCollapsible'
          );
        },

        // Preferences Management
        updatePreferences: (preferences: Partial<UserPreferences>) => {
          try {
            const currentPrefs = get().userPreferences;
            const newPreferences = { ...currentPrefs, ...preferences };
            const validatedPreferences = UserPreferencesSchema.parse(newPreferences);

            set(
              (state) => ({
                ...state,
                userPreferences: validatedPreferences,
                lastAction: 'UPDATE_PREFERENCES',
                timestamp: Date.now(),
              }),
              false,
              'sidebar/updatePreferences'
            );
          } catch (error) {
            console.warn('Preferences validation failed:', error);
          }
        },

        resetPreferences: () => {
          set(
            (state) => ({
              ...state,
              userPreferences: defaultState.userPreferences,
              lastAction: 'RESET_PREFERENCES',
              timestamp: Date.now(),
            }),
            false,
            'sidebar/resetPreferences'
          );
        },

        // State Machine Actions
        initialize: (initialState?: Partial<SidebarState>) => {
          try {
            const newState = { ...defaultState, ...initialState };
            const validatedState = SidebarStateSchema.parse(newState);

            set(
              () => ({
                ...validatedState,
                status: 'idle',
                lastAction: 'INITIALIZE',
                timestamp: Date.now(),
              }),
              false,
              'sidebar/initialize'
            );
          } catch (error) {
            console.warn('State initialization validation failed:', error);
            set(
              () => ({
                ...defaultState,
                lastAction: 'INITIALIZE_FALLBACK',
                timestamp: Date.now(),
              }),
              false,
              'sidebar/initialize-fallback'
            );
          }
        },

        reset: () => {
          set(
            () => ({
              ...defaultState,
              lastAction: 'RESET',
              timestamp: Date.now(),
            }),
            false,
            'sidebar/reset'
          );
        },

        // Validation Helpers
        validatePath: (path: string): boolean => {
          try {
            NavigationPathSchema.parse(path);
            return true;
          } catch {
            return false;
          }
        },

        getValidatedState: (): SidebarState => {
          const currentState = get();
          try {
            return SidebarStateSchema.parse(currentState);
          } catch (error) {
            console.warn('State validation failed, returning default:', error);
            return defaultState;
          }
        },
      }),
      {
        name: 'sidebar-store',
        // Only persist essential user preferences and state
        partialize: (state) => ({
          collapsed: state.collapsed,
          currentPath: state.currentPath,
          userPreferences: state.userPreferences,
        }),
        // Restore state on hydration
        onRehydrateStorage: () => (state) => {
          if (state) {
            state.status = 'idle';
            state.lastAction = 'REHYDRATE';
            state.timestamp = Date.now();
          }
        },
      }
    ),
    {
      name: 'sidebar-store',
    }
  )
);

// Selector hooks for optimized re-renders
export const useSidebarCollapsed = () => useSidebarStore((state) => state.collapsed);
export const useSidebarCurrentPath = () => useSidebarStore((state) => state.currentPath);
export const useSidebarActiveItem = () => useSidebarStore((state) => state.activeItem);
export const useSidebarPreferences = () => useSidebarStore((state) => state.userPreferences);
export const useSidebarStatus = () => useSidebarStore((state) => state.status);

// Action hooks
export const useSidebarActions = () => {
  const navigate = useSidebarStore((state) => state.navigate);
  const toggleCollapsed = useSidebarStore((state) => state.toggleCollapsed);
  const setCollapsed = useSidebarStore((state) => state.setCollapsed);
  const setCollapsible = useSidebarStore((state) => state.setCollapsible);
  const setCurrentPath = useSidebarStore((state) => state.setCurrentPath);
  const setActiveItem = useSidebarStore((state) => state.setActiveItem);
  const updatePreferences = useSidebarStore((state) => state.updatePreferences);
  const initialize = useSidebarStore((state) => state.initialize);

  return {
    navigate,
    toggleCollapsed,
    setCollapsed,
    setCollapsible,
    setCurrentPath,
    setActiveItem,
    updatePreferences,
    initialize,
  };
};

// Type exports
export type { SidebarStore, UserPreferences, SidebarState };
