/**
 * Cascade Preview
 *
 * When a color change would affect dependent tokens, shows a preview
 * of affected tokens before committing. Tokens with userOverride
 * are shown with a lock icon and their override reason.
 *
 * Actions: Update all, Skip overrides, Cancel.
 */

import { useEffect, useState } from 'react';
import { type DependentInfo, fetchTokenDependents } from '../../lib/query';

interface CascadePreviewProps {
  tokenName: string;
  onUpdateAll: () => void;
  onCancel: () => void;
}

export function CascadePreview({ tokenName, onUpdateAll, onCancel }: CascadePreviewProps) {
  const [dependents, setDependents] = useState<DependentInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const result = await fetchTokenDependents(tokenName);
        if (!cancelled) {
          setDependents(result);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load dependents');
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [tokenName]);

  if (loading) {
    return (
      <div className="px-3 py-2">
        <span className="text-xs text-neutral-400">Checking affected tokens...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-3 py-2">
        <span className="text-xs text-red-500">{error}</span>
      </div>
    );
  }

  if (dependents.length === 0) {
    return (
      <div className="flex flex-col gap-2 px-3 py-2">
        <p className="text-xs text-neutral-600">No dependent tokens. Safe to apply.</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded bg-neutral-900 px-2 py-1 text-xs font-medium text-white hover:bg-neutral-800"
            onClick={onUpdateAll}
          >
            Continue
          </button>
          <button
            type="button"
            className="px-2 py-1 text-xs text-neutral-500 hover:text-neutral-700"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  const overrideCount = dependents.filter((d) => d.hasUserOverride).length;

  return (
    <div className="flex flex-col gap-1 px-3 py-2">
      {/* Summary */}
      <div className="mb-1">
        <p className="text-xs font-medium text-neutral-900">
          {dependents.length} token{dependents.length === 1 ? '' : 's'} affected
        </p>
        {overrideCount > 0 && (
          <p className="text-xs text-neutral-500">
            {overrideCount} with manual override{overrideCount === 1 ? '' : 's'}
          </p>
        )}
      </div>

      {/* Dependent list */}
      <ul className="flex max-h-40 flex-col gap-0.5 overflow-y-auto">
        {dependents.map((dep) => (
          <li key={dep.name} className="flex items-center gap-1.5 rounded px-1 py-0.5 text-xs">
            {dep.hasUserOverride ? (
              <span className="text-amber-500" title={dep.overrideReason ?? 'Manual override'}>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="currentColor"
                  role="img"
                  aria-label="Locked token"
                >
                  <path d="M3.5 5V3.5a2.5 2.5 0 015 0V5H9a1 1 0 011 1v4a1 1 0 01-1 1H3a1 1 0 01-1-1V6a1 1 0 011-1h.5zm1 0h3V3.5a1.5 1.5 0 00-3 0V5z" />
                </svg>
              </span>
            ) : (
              <span className="text-neutral-300">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="currentColor"
                  role="img"
                  aria-label="Auto-derived token"
                >
                  <circle cx="6" cy="6" r="3" />
                </svg>
              </span>
            )}
            <span className="truncate font-mono text-neutral-700">{dep.name}</span>
          </li>
        ))}
      </ul>

      {/* Actions */}
      <div className="mt-1 flex gap-1">
        <button
          type="button"
          className="flex-1 rounded bg-neutral-900 px-2 py-1 text-xs font-medium text-white hover:bg-neutral-800"
          onClick={onUpdateAll}
        >
          Update all ({dependents.length})
        </button>
        <button
          type="button"
          className="rounded px-2 py-1 text-xs text-neutral-500 hover:text-neutral-700"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
