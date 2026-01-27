/**
 * Sidebar
 *
 * Six circles along the left edge. 44px default, 64px on hover.
 * Connected by negative space. Retreats when workspace has focus.
 * Grayed out until semantics complete.
 */

import gsap from 'gsap';
import { Circle, Layers, type LucideIcon, MoveHorizontal, Palette, Type, Zap } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useStudioDispatch, useStudioState } from '../../context/StudioContext';
import { isReducedMotion } from '../../lib/motion';
import { SIDEBAR_NAMESPACES, type VisualNamespace } from '../../types';

const ICON_MAP: Record<string, LucideIcon> = {
  Palette,
  Space: MoveHorizontal,
  Type,
  Circle,
  Layers,
  Zap,
};

const CIRCLE_SIZE = 44;
const CIRCLE_HOVER_SIZE = 64;

export function Sidebar() {
  const { activeNamespace, semanticsComplete } = useStudioState();
  const dispatch = useStudioDispatch();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [retreated, setRetreated] = useState(false);
  const [hoveredNs, setHoveredNs] = useState<VisualNamespace | null>(null);

  // Retreat on workspace focus (mouse leaves sidebar area)
  const retreatTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseLeave = useCallback(() => {
    retreatTimeout.current = setTimeout(() => setRetreated(true), 300);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (retreatTimeout.current) clearTimeout(retreatTimeout.current);
    setRetreated(false);
  }, []);

  // Restore sidebar when mouse approaches left edge
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientX < 60 && retreated) {
        setRetreated(false);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [retreated]);

  // Animate retreat
  useEffect(() => {
    if (!sidebarRef.current) return;
    gsap.to(sidebarRef.current, {
      x: retreated ? -30 : 0,
      duration: isReducedMotion() ? 0 : 0.3,
      ease: 'power2.inOut',
    });
  }, [retreated]);

  const handleSelect = useCallback(
    (ns: VisualNamespace) => {
      if (!semanticsComplete && ns !== 'color') return;
      if (ns === 'motion') return; // Coming soon
      dispatch({ type: 'SET_NAMESPACE', namespace: ns });
    },
    [dispatch, semanticsComplete],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const currentIndex = SIDEBAR_NAMESPACES.findIndex((n) => n.id === activeNamespace);
      let newIndex = currentIndex;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        newIndex = Math.min(currentIndex + 1, SIDEBAR_NAMESPACES.length - 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        newIndex = Math.max(currentIndex - 1, 0);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (activeNamespace) handleSelect(activeNamespace);
        return;
      }

      if (newIndex !== currentIndex) {
        const ns = SIDEBAR_NAMESPACES[newIndex];
        dispatch({ type: 'SET_NAMESPACE', namespace: ns.id });
      }
    },
    [activeNamespace, dispatch, handleSelect],
  );

  return (
    <div
      ref={sidebarRef}
      className="flex h-full flex-col items-center justify-center gap-4 py-8 pl-3 pr-4"
      role="tablist"
      aria-label="Design namespaces"
      aria-hidden={retreated}
      tabIndex={retreated ? -1 : 0}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
    >
      {SIDEBAR_NAMESPACES.map((ns) => {
        const Icon = ICON_MAP[ns.icon];
        const isActive = activeNamespace === ns.id;
        const isDisabled = (!semanticsComplete && ns.id !== 'color') || ns.id === 'motion';

        return (
          <button
            key={ns.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-disabled={isDisabled}
            tabIndex={isActive ? 0 : -1}
            onClick={() => handleSelect(ns.id)}
            onMouseEnter={() => setHoveredNs(ns.id)}
            onMouseLeave={() => setHoveredNs(null)}
            className={[
              'flex items-center justify-center rounded-full transition-all',
              isActive
                ? 'bg-neutral-900 text-white'
                : isDisabled
                  ? 'cursor-not-allowed bg-neutral-100 text-neutral-300'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200',
              'focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none',
            ].join(' ')}
            style={{
              width: hoveredNs === ns.id ? CIRCLE_HOVER_SIZE : CIRCLE_SIZE,
              height: hoveredNs === ns.id ? CIRCLE_HOVER_SIZE : CIRCLE_SIZE,
              transition: isReducedMotion() ? 'none' : 'width 0.2s, height 0.2s',
            }}
          >
            {Icon && <Icon size={hoveredNs === ns.id ? 24 : 18} />}
          </button>
        );
      })}
    </div>
  );
}
