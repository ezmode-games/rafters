/**
 * Registry API client for fetching components from rafters.realhandy.tech
 */
import { type ComponentManifest, type RegistryResponse } from '@rafters/shared';
export type { ComponentManifest } from '@rafters/shared';
export type Registry = RegistryResponse;
/**
 * Fetch complete component registry from the hosted API
 */
export declare function fetchComponentRegistry(): Promise<Registry>;
/**
 * Fetch a specific component by name from the hosted API
 */
export declare function fetchComponent(componentName: string): Promise<ComponentManifest | null>;
