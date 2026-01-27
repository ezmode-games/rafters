/**
 * Educational Header
 *
 * Dismissible educational content for each namespace workspace.
 * Explains the mathematical system, available choices, and current selection.
 * Dismissed permanently via localStorage.
 */

import { type ReactNode, useCallback } from 'react';
import { useStudioDispatch, useStudioState } from '../../context/StudioContext';
import type { VisualNamespace } from '../../types';

interface EducationalHeaderProps {
  namespace: VisualNamespace;
  title: string;
  children: ReactNode;
}

export function EducationalHeader({ namespace, title, children }: EducationalHeaderProps) {
  const { educationDismissed } = useStudioState();
  const dispatch = useStudioDispatch();

  const isDismissed = educationDismissed[namespace];

  const handleDismiss = useCallback(() => {
    dispatch({ type: 'DISMISS_EDUCATION', namespace });
  }, [dispatch, namespace]);

  if (isDismissed) return null;

  return (
    <div className="mx-auto mb-8 max-w-2xl rounded-xl bg-neutral-50 p-6">
      <div className="mb-4 flex items-start justify-between">
        <h2 className="text-lg font-medium text-neutral-800">{title}</h2>
        <button
          type="button"
          onClick={handleDismiss}
          className="text-xs text-neutral-400 hover:text-neutral-600"
        >
          Got it
        </button>
      </div>
      <div className="text-sm leading-relaxed text-neutral-600">{children}</div>
    </div>
  );
}
