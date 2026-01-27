/**
 * Semantic Choices
 *
 * After primary scale paint, designer picks 9 semantic colors.
 * Each semantic shows 3 computed choices + custom option.
 * No labels - name appears centered on hover.
 */

import { useCallback, useState } from 'react';
import { useStudioDispatch, useStudioState } from '../../context/StudioContext';
import { useTokenMutation } from '../../lib/query';
import { SEMANTIC_INTENTS, type SemanticIntent } from '../../types';
import { type OKLCH, oklchToHex } from '../../utils/color-conversion';
import { WhyGate } from '../shared/WhyGate';

interface SemanticChoicesProps {
  onComplete: () => void;
}

// Placeholder: generate 3 suggestions for each semantic
// TODO: Use actual computation from color-utils + API
function generateSuggestions(intent: SemanticIntent): OKLCH[] {
  const hueMap: Record<SemanticIntent, number> = {
    destructive: 25,
    success: 145,
    warning: 75,
    info: 220,
    secondary: 280,
    muted: 0,
    accent: 320,
    background: 0,
    foreground: 0,
  };
  const baseH = hueMap[intent];
  const isNeutral = intent === 'muted' || intent === 'background' || intent === 'foreground';

  if (intent === 'background') {
    return [
      { l: 0.98, c: 0.005, h: baseH },
      { l: 0.96, c: 0.01, h: baseH },
      { l: 0.99, c: 0, h: 0 },
    ];
  }

  if (intent === 'foreground') {
    return [
      { l: 0.15, c: 0.01, h: baseH },
      { l: 0.1, c: 0.005, h: baseH },
      { l: 0.05, c: 0, h: 0 },
    ];
  }

  return [
    { l: 0.55, c: isNeutral ? 0.02 : 0.18, h: baseH },
    { l: 0.6, c: isNeutral ? 0.015 : 0.15, h: baseH + 10 },
    { l: 0.5, c: isNeutral ? 0.025 : 0.2, h: baseH - 10 },
  ];
}

function SemanticRow({
  intent,
  onPick,
  completed,
}: {
  intent: SemanticIntent;
  onPick: (intent: SemanticIntent, color: OKLCH) => void;
  completed: boolean;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const suggestions = generateSuggestions(intent);

  if (completed) {
    return null; // Will be replaced by done state
  }

  return (
    <fieldset
      className="flex items-center gap-2 border-none p-0"
      aria-label={`${intent} color options`}
    >
      {suggestions.map((color, i) => {
        let hex: string;
        try {
          hex = oklchToHex(color);
        } catch {
          hex = '#808080';
        }
        return (
          <button
            key={`${intent}-${hex}`}
            type="button"
            onClick={() => onPick(intent, color)}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={[
              'relative rounded-xl transition-transform',
              hoveredIndex === i ? 'scale-110' : '',
            ].join(' ')}
            style={{
              width: 64,
              height: 64,
              backgroundColor: hex,
            }}
          >
            {hoveredIndex === i && (
              <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white/80 mix-blend-difference">
                {intent}
              </span>
            )}
          </button>
        );
      })}
    </fieldset>
  );
}

export function SemanticChoices({ onComplete }: SemanticChoicesProps) {
  const dispatch = useStudioDispatch();
  const { completedSemantics } = useStudioState();
  const tokenMutation = useTokenMutation();
  const [pendingIntent, setPendingIntent] = useState<{
    intent: SemanticIntent;
    color: OKLCH;
  } | null>(null);

  const handlePick = useCallback((intent: SemanticIntent, color: OKLCH) => {
    setPendingIntent({ intent, color });
  }, []);

  const handleWhyCommit = useCallback(
    (reason: string) => {
      if (!pendingIntent) return;
      const { intent, color } = pendingIntent;
      dispatch({ type: 'COMPLETE_SEMANTIC', intent });
      tokenMutation.mutate({
        namespace: 'semantic',
        name: `semantic-${intent}`,
        value: `oklch(${color.l} ${color.c} ${color.h})`,
        reason,
      });
      setPendingIntent(null);

      // Check if all done
      const newCompleted = new Set(completedSemantics);
      newCompleted.add(intent);
      if (newCompleted.size >= SEMANTIC_INTENTS.length) {
        onComplete();
      }
    },
    [dispatch, tokenMutation, pendingIntent, completedSemantics, onComplete],
  );

  if (pendingIntent) {
    return (
      <div className="flex h-full items-center justify-center">
        <WhyGate onCommit={handleWhyCommit} context={pendingIntent.intent} />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
      {SEMANTIC_INTENTS.map((intent) => (
        <SemanticRow
          key={intent}
          intent={intent}
          onPick={handlePick}
          completed={completedSemantics.has(intent)}
        />
      ))}
    </div>
  );
}
