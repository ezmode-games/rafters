/**
 * First Run Orchestrator
 *
 * State machine for the first-run experience:
 * snowstorm -> picking -> reasoning -> painting -> semantics -> complete
 *
 * Each transition is a GSAP timeline.
 */

import { useCallback, useRef } from 'react';
import { useStudioDispatch, useStudioState } from '../../context/StudioContext';
import { useGSAP } from '../../lib/animation';
import { useTokenMutation } from '../../lib/query';
import type { OKLCH } from '../../utils/color-conversion';
import { OKLCHPicker } from '../shared/OKLCHPicker';
import { WhyGate } from '../shared/WhyGate';
import { BouncingBox } from './BouncingBox';
import { ScalePaint } from './ScalePaint';
import { SemanticChoices } from './SemanticChoices';
import { Snowstorm } from './Snowstorm';

export function FirstRun() {
  const { firstRunPhase } = useStudioState();
  const dispatch = useStudioDispatch();
  const { containerRef } = useGSAP();
  const pickedColor = useRef<OKLCH | null>(null);
  const tokenMutation = useTokenMutation();

  const handleBoxClick = useCallback(() => {
    dispatch({ type: 'SET_FIRST_RUN_PHASE', phase: 'picking' });
  }, [dispatch]);

  const handleColorPick = useCallback(
    (color: OKLCH) => {
      pickedColor.current = color;
      dispatch({ type: 'SET_FIRST_RUN_PHASE', phase: 'reasoning' });
    },
    [dispatch],
  );

  const handleWhyCommit = useCallback(
    (reason: string) => {
      if (!pickedColor.current) return;
      const color = pickedColor.current;
      dispatch({ type: 'SET_PRIMARY', color });
      tokenMutation.mutate({
        namespace: 'color',
        name: 'color-primary-500',
        value: `oklch(${color.l} ${color.c} ${color.h})`,
        reason,
      });
    },
    [dispatch, tokenMutation],
  );

  const handlePaintComplete = useCallback(() => {
    dispatch({ type: 'SET_FIRST_RUN_PHASE', phase: 'semantics' });
  }, [dispatch]);

  const handleSemanticsComplete = useCallback(() => {
    dispatch({ type: 'COMPLETE_FIRST_RUN' });
  }, [dispatch]);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      {/* Snowstorm visible during early phases */}
      {(firstRunPhase === 'snowstorm' ||
        firstRunPhase === 'picking' ||
        firstRunPhase === 'reasoning') && <Snowstorm fading={firstRunPhase === 'reasoning'} />}

      {/* Logo top-left during first run */}
      <div className="pointer-events-none absolute top-4 left-4 z-10 text-lg font-semibold text-neutral-800">
        Rafters
      </div>

      {/* Bouncing box */}
      {firstRunPhase === 'snowstorm' && <BouncingBox onClick={handleBoxClick} />}

      {/* OKLCH Color Picker */}
      {firstRunPhase === 'picking' && (
        <div className="flex h-full items-center justify-center">
          <OKLCHPicker onSelect={handleColorPick} />
        </div>
      )}

      {/* Why Gate */}
      {firstRunPhase === 'reasoning' && (
        <div className="flex h-full items-center justify-center">
          <WhyGate onCommit={handleWhyCommit} context="primary" />
        </div>
      )}

      {/* Scale Paint Animation */}
      {firstRunPhase === 'painting' && (
        <ScalePaint color={pickedColor.current} onComplete={handlePaintComplete} />
      )}

      {/* Semantic Choices */}
      {firstRunPhase === 'semantics' && <SemanticChoices onComplete={handleSemanticsComplete} />}
    </div>
  );
}
