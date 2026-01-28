/**
 * Semantic Choices
 *
 * After primary scale paint, designer picks 9 semantic colors.
 * Each semantic shows 3 computed choices + custom option.
 * No labels - name appears centered on hover.
 */

import { useCallback, useMemo, useState } from 'react';
import { useStudioDispatch, useStudioState } from '../../context/StudioContext';
import { generateColorScale } from '../../lib/color-scale';
import { useTokenMutation } from '../../lib/query';
import { generateSemanticSuggestions } from '../../lib/semantic-suggestions';
import { SEMANTIC_INTENTS, type SemanticIntent } from '../../types';
import { type OKLCH, oklchToHex } from '../../utils/color-conversion';
import { ColorScale } from '../shared/ColorScale';
import { WhyGate } from '../shared/WhyGate';

interface SemanticChoicesProps {
  onComplete: () => void;
}

/** Done state: shows chosen color prominently with its generated scale */
function SemanticDone({ intent, color }: { intent: SemanticIntent; color: OKLCH }) {
  const scale = useMemo(() => generateColorScale(color), [color]);

  let hex: string;
  try {
    hex = oklchToHex(color);
  } catch {
    hex = '#808080';
  }

  return (
    <div className="flex items-center gap-3">
      {/* Chosen color box */}
      <div
        className="shrink-0 rounded-xl"
        style={{ width: 48, height: 48, backgroundColor: hex }}
        title={intent}
      />
      {/* Generated scale */}
      <ColorScale scale={scale} size={24} />
      {/* Done indicator */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        className="shrink-0 text-green-600"
        role="img"
        aria-label={`${intent} complete`}
      >
        <path
          d="M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 111.4-1.4L8 12.6l7.3-7.3a1 1 0 011.4 0z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

function SemanticRow({
  intent,
  suggestions,
  onPick,
  chosenColor,
}: {
  intent: SemanticIntent;
  suggestions: OKLCH[];
  onPick: (intent: SemanticIntent, color: OKLCH) => void;
  chosenColor: OKLCH | null;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (chosenColor) {
    return <SemanticDone intent={intent} color={chosenColor} />;
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
  const { completedSemantics, primaryColor } = useStudioState();
  const tokenMutation = useTokenMutation();

  // Track chosen colors for displaying done state
  const [chosenColors, setChosenColors] = useState<Partial<Record<SemanticIntent, OKLCH>>>({});

  // Compute suggestions for all intents based on primary color
  const suggestionsByIntent = useMemo(() => {
    const primary: OKLCH = primaryColor ?? { l: 0.55, c: 0.15, h: 260 };
    const result: Record<string, OKLCH[]> = {};
    for (const intent of SEMANTIC_INTENTS) {
      result[intent] = generateSemanticSuggestions(intent, primary);
    }
    return result;
  }, [primaryColor]);

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

      // Store chosen color for done state display
      setChosenColors((prev) => ({ ...prev, [intent]: color }));

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
          suggestions={suggestionsByIntent[intent] ?? []}
          onPick={handlePick}
          chosenColor={chosenColors[intent] ?? null}
        />
      ))}
    </div>
  );
}
