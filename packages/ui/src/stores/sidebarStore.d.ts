import { z } from 'zod';
declare const UserPreferencesSchema: z.ZodObject<{
    persistCollapsed: z.ZodDefault<z.ZodBoolean>;
    position: z.ZodDefault<z.ZodEnum<{
        left: "left";
        right: "right";
    }>>;
    size: z.ZodDefault<z.ZodEnum<{
        compact: "compact";
        comfortable: "comfortable";
        spacious: "spacious";
    }>>;
    variant: z.ZodDefault<z.ZodEnum<{
        default: "default";
        overlay: "overlay";
        floating: "floating";
    }>>;
    reduceMotion: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
declare const SidebarStateSchema: z.ZodObject<{
    collapsed: z.ZodDefault<z.ZodBoolean>;
    currentPath: z.ZodOptional<z.ZodString>;
    activeItem: z.ZodOptional<z.ZodString>;
    collapsible: z.ZodDefault<z.ZodBoolean>;
    userPreferences: z.ZodObject<{
        persistCollapsed: z.ZodDefault<z.ZodBoolean>;
        position: z.ZodDefault<z.ZodEnum<{
            left: "left";
            right: "right";
        }>>;
        size: z.ZodDefault<z.ZodEnum<{
            compact: "compact";
            comfortable: "comfortable";
            spacious: "spacious";
        }>>;
        variant: z.ZodDefault<z.ZodEnum<{
            default: "default";
            overlay: "overlay";
            floating: "floating";
        }>>;
        reduceMotion: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>;
    status: z.ZodDefault<z.ZodEnum<{
        idle: "idle";
        navigating: "navigating";
        settled: "settled";
    }>>;
    lastAction: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
type UserPreferences = z.infer<typeof UserPreferencesSchema>;
type SidebarState = z.infer<typeof SidebarStateSchema>;
interface SidebarStore extends SidebarState {
    navigate: (path: string, onNavigate?: (path: string) => void) => void;
    setCurrentPath: (path: string) => void;
    setActiveItem: (item: string) => void;
    toggleCollapsed: () => void;
    setCollapsed: (collapsed: boolean) => void;
    setCollapsible: (collapsible: boolean) => void;
    updatePreferences: (preferences: Partial<UserPreferences>) => void;
    resetPreferences: () => void;
    initialize: (initialState?: Partial<SidebarState>) => void;
    reset: () => void;
    validatePath: (path: string) => boolean;
    getValidatedState: () => SidebarState;
}
export declare const useSidebarStore: import("zustand").UseBoundStore<Omit<Omit<import("zustand").StoreApi<SidebarStore>, "setState" | "devtools"> & {
    setState(partial: SidebarStore | Partial<SidebarStore> | ((state: SidebarStore) => SidebarStore | Partial<SidebarStore>), replace?: false | undefined, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
    setState(state: SidebarStore | ((state: SidebarStore) => SidebarStore), replace: true, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
    devtools: {
        cleanup: () => void;
    };
}, "setState" | "persist"> & {
    setState(partial: SidebarStore | Partial<SidebarStore> | ((state: SidebarStore) => SidebarStore | Partial<SidebarStore>), replace?: false | undefined, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): unknown;
    setState(state: SidebarStore | ((state: SidebarStore) => SidebarStore), replace: true, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): unknown;
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<SidebarStore, {
            collapsed: boolean;
            currentPath: string | undefined;
            activeItem: string | undefined;
            userPreferences: {
                persistCollapsed: boolean;
                position: "left" | "right";
                size: "compact" | "comfortable" | "spacious";
                variant: "default" | "overlay" | "floating";
                reduceMotion: boolean;
            };
        }, unknown>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: SidebarStore) => void) => () => void;
        onFinishHydration: (fn: (state: SidebarStore) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<SidebarStore, {
            collapsed: boolean;
            currentPath: string | undefined;
            activeItem: string | undefined;
            userPreferences: {
                persistCollapsed: boolean;
                position: "left" | "right";
                size: "compact" | "comfortable" | "spacious";
                variant: "default" | "overlay" | "floating";
                reduceMotion: boolean;
            };
        }, unknown>>;
    };
}>;
export declare const useSidebarCollapsed: () => boolean;
export declare const useSidebarCurrentPath: () => string | undefined;
export declare const useSidebarActiveItem: () => string | undefined;
export declare const useSidebarPreferences: () => {
    persistCollapsed: boolean;
    position: "left" | "right";
    size: "compact" | "comfortable" | "spacious";
    variant: "default" | "overlay" | "floating";
    reduceMotion: boolean;
};
export declare const useSidebarStatus: () => "idle" | "navigating" | "settled";
export declare const useSidebarActions: () => {
    navigate: (path: string, onNavigate?: (path: string) => void) => void;
    toggleCollapsed: () => void;
    setCollapsed: (collapsed: boolean) => void;
    setCollapsible: (collapsible: boolean) => void;
    setCurrentPath: (path: string) => void;
    setActiveItem: (item: string) => void;
    updatePreferences: (preferences: Partial<UserPreferences>) => void;
    initialize: (initialState?: Partial<SidebarState>) => void;
};
export type { SidebarStore, UserPreferences, SidebarState };
//# sourceMappingURL=sidebarStore.d.ts.map