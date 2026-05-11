import type { TokenSetManifest } from '../schemas/manifest.js';
import type { Token, TokenId } from '../schemas/token.js';
import { deleteToken, setToken, setTokens } from './mutations.js';

export interface MutationEvent {
  kind: 'set-token' | 'set-tokens' | 'delete-token' | 'replace' | 'undo';
  before: TokenSetManifest;
  after: TokenSetManifest;
}

export type MutationHook = (event: MutationEvent) => void;

/**
 * Holds the current manifest plus exactly one previous version for single-step undo.
 *
 * Every mutation fires the optional onMutation hook with `{ kind, before, after }`.
 * OSS consumers leave the hook unset. The commercial Tauri host overloads the hook
 * to accumulate full history. The store never carries more than one previous state.
 */
export class TokenStore {
  private current_: TokenSetManifest;
  private previous_: TokenSetManifest | null = null;
  private readonly hook: MutationHook | undefined;

  constructor(initial: TokenSetManifest, options: { onMutation?: MutationHook } = {}) {
    this.current_ = initial;
    this.hook = options.onMutation;
  }

  get current(): TokenSetManifest {
    return this.current_;
  }

  get previous(): TokenSetManifest | null {
    return this.previous_;
  }

  setToken(token: Token): MutationEvent {
    return this.apply('set-token', (m) => setToken(m, token));
  }

  setTokens(tokens: readonly Token[]): MutationEvent {
    return this.apply('set-tokens', (m) => setTokens(m, tokens));
  }

  deleteToken(id: TokenId): MutationEvent {
    return this.apply('delete-token', (m) => deleteToken(m, id));
  }

  /** Wholesale replace the manifest (e.g. after a cascade run). */
  replace(next: TokenSetManifest): MutationEvent {
    return this.apply('replace', () => next);
  }

  /** Restore the single previous manifest. No-op if there is none. Returns null if no undo available. */
  undo(): MutationEvent | null {
    if (this.previous_ === null) return null;
    const before = this.current_;
    const after = this.previous_;
    this.current_ = after;
    this.previous_ = null;
    const event: MutationEvent = { kind: 'undo', before, after };
    this.hook?.(event);
    return event;
  }

  private apply(
    kind: MutationEvent['kind'],
    next: (m: TokenSetManifest) => TokenSetManifest,
  ): MutationEvent {
    const before = this.current_;
    const after = next(before);
    this.previous_ = before;
    this.current_ = after;
    const event: MutationEvent = { kind, before, after };
    this.hook?.(event);
    return event;
  }
}
