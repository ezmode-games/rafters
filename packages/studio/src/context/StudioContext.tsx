/**
 * Studio Context
 *
 * Global UI state managed with React Context + useReducer.
 * Tracks phase (first-run vs workspace), active namespace,
 * dismissed education sections, and semantic completion.
 */

import { createContext, type Dispatch, type ReactNode, useContext, useReducer } from 'react';
import type { FirstRunPhase, SemanticIntent, StudioPhase, VisualNamespace } from '../types';

export interface StudioState {
  /** Current application phase */
  phase: StudioPhase;
  /** First-run sub-phase (only relevant when phase === 'first-run') */
  firstRunPhase: FirstRunPhase;
  /** Currently active namespace workspace */
  activeNamespace: VisualNamespace | null;
  /** Whether all semantic colors have been picked */
  semanticsComplete: boolean;
  /** Which semantic intents have been completed */
  completedSemantics: Set<SemanticIntent>;
  /** Education headers dismissed per namespace (persisted to localStorage) */
  educationDismissed: Partial<Record<VisualNamespace, boolean>>;
  /** Whether primary color has been set */
  primarySet: boolean;
  /** The primary OKLCH color (once picked) */
  primaryColor: { l: number; c: number; h: number } | null;
}

export type StudioAction =
  | { type: 'SET_PHASE'; phase: StudioPhase }
  | { type: 'SET_FIRST_RUN_PHASE'; phase: FirstRunPhase }
  | { type: 'SET_PRIMARY'; color: { l: number; c: number; h: number } }
  | { type: 'COMPLETE_SEMANTIC'; intent: SemanticIntent }
  | { type: 'COMPLETE_ALL_SEMANTICS' }
  | { type: 'SET_NAMESPACE'; namespace: VisualNamespace }
  | { type: 'DISMISS_EDUCATION'; namespace: VisualNamespace }
  | { type: 'COMPLETE_FIRST_RUN' };

const EDUCATION_STORAGE_KEY = 'rafters-studio-education-dismissed';

function loadEducationDismissed(): Partial<Record<VisualNamespace, boolean>> {
  try {
    const stored = localStorage.getItem(EDUCATION_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveEducationDismissed(dismissed: Partial<Record<VisualNamespace, boolean>>): void {
  try {
    localStorage.setItem(EDUCATION_STORAGE_KEY, JSON.stringify(dismissed));
  } catch {
    // localStorage unavailable, ignore
  }
}

function createInitialState(): StudioState {
  return {
    phase: 'loading',
    firstRunPhase: 'snowstorm',
    activeNamespace: null,
    semanticsComplete: false,
    completedSemantics: new Set(),
    educationDismissed: loadEducationDismissed(),
    primarySet: false,
    primaryColor: null,
  };
}

function studioReducer(state: StudioState, action: StudioAction): StudioState {
  switch (action.type) {
    case 'SET_PHASE':
      return { ...state, phase: action.phase };

    case 'SET_FIRST_RUN_PHASE':
      return { ...state, firstRunPhase: action.phase };

    case 'SET_PRIMARY':
      return {
        ...state,
        primarySet: true,
        primaryColor: action.color,
        firstRunPhase: 'painting',
      };

    case 'COMPLETE_SEMANTIC': {
      const completed = new Set(state.completedSemantics);
      completed.add(action.intent);
      const allDone = completed.size >= 9;
      return {
        ...state,
        completedSemantics: completed,
        semanticsComplete: allDone,
      };
    }

    case 'COMPLETE_ALL_SEMANTICS':
      return { ...state, semanticsComplete: true };

    case 'SET_NAMESPACE':
      return { ...state, activeNamespace: action.namespace };

    case 'DISMISS_EDUCATION': {
      const dismissed = { ...state.educationDismissed, [action.namespace]: true };
      saveEducationDismissed(dismissed);
      return { ...state, educationDismissed: dismissed };
    }

    case 'COMPLETE_FIRST_RUN':
      return {
        ...state,
        phase: 'workspace',
        firstRunPhase: 'complete',
        activeNamespace: 'color',
        semanticsComplete: true,
      };

    default:
      return state;
  }
}

const StudioStateContext = createContext<StudioState | null>(null);
const StudioDispatchContext = createContext<Dispatch<StudioAction> | null>(null);

export function StudioProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(studioReducer, undefined, createInitialState);

  return (
    <StudioStateContext.Provider value={state}>
      <StudioDispatchContext.Provider value={dispatch}>{children}</StudioDispatchContext.Provider>
    </StudioStateContext.Provider>
  );
}

export function useStudioState(): StudioState {
  const state = useContext(StudioStateContext);
  if (!state) throw new Error('useStudioState must be used within StudioProvider');
  return state;
}

export function useStudioDispatch(): Dispatch<StudioAction> {
  const dispatch = useContext(StudioDispatchContext);
  if (!dispatch) throw new Error('useStudioDispatch must be used within StudioProvider');
  return dispatch;
}
