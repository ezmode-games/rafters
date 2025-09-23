/**
 * Event types for the event-driven registry system
 *
 * Supports real-time CSS generation and queue publishing
 * through swappable callback implementations
 */

import type { Token } from '@rafters/shared';

export interface TokenChangeEvent {
  type: 'token-changed';
  tokenName: string;
  oldValue?: Token['value'];
  newValue: Token['value'];
  timestamp: number;
}

export interface TokensBatchChangeEvent {
  type: 'tokens-batch-changed';
  changes: TokenChangeEvent[];
  timestamp: number;
}

export interface RegistryInitializedEvent {
  type: 'registry-initialized';
  tokenCount: number;
  timestamp: number;
}

export type RegistryEvent = TokenChangeEvent | TokensBatchChangeEvent | RegistryInitializedEvent;

export type RegistryChangeCallback = (event: RegistryEvent) => void;
