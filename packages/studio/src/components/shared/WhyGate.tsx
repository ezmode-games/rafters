/**
 * Why Gate
 *
 * Enforces reasoning for every design decision.
 * If the designer tries to skip, explains why reasoning matters.
 */

import { useCallback, useState } from 'react';
import { WhyTextarea } from './WhyTextarea';

interface WhyGateProps {
  onCommit: (reason: string) => void;
  context?: string;
  intelligenceHints?: string[];
}

export function WhyGate({ onCommit, context = 'primary', intelligenceHints }: WhyGateProps) {
  const [reason, setReason] = useState('');
  const [showEnforcement, setShowEnforcement] = useState(false);

  const handleSubmit = useCallback(() => {
    const trimmed = reason.trim();
    if (trimmed.length < 3) {
      setShowEnforcement(true);
      return;
    }
    setShowEnforcement(false);
    onCommit(trimmed);
  }, [reason, onCommit]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  return (
    <form
      className="flex w-full max-w-md flex-col gap-4"
      onKeyDown={handleKeyDown}
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <WhyTextarea
        value={reason}
        onChange={(v) => {
          setReason(v);
          if (showEnforcement && v.trim().length >= 3) {
            setShowEnforcement(false);
          }
        }}
        context={context}
        intelligenceHints={intelligenceHints}
      />

      {showEnforcement && (
        <p className="text-sm text-neutral-500">
          Rafters is not a token editor. It is a Design Intelligence System. Your reasoning is the
          product.
        </p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        className={[
          'rounded-lg px-6 py-2',
          'text-sm font-medium',
          'bg-neutral-900 text-white',
          'hover:bg-neutral-800',
          'transition-colors',
        ].join(' ')}
      >
        Commit
      </button>
    </form>
  );
}
