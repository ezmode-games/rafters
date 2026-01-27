/**
 * Context Menu
 *
 * Vanilla context menu (no Radix). Uses browser contextmenu event.
 * Renders a positioned overlay on right-click.
 * Closes on outside click, Escape, or second right-click.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

export interface ContextMenuPosition {
  x: number;
  y: number;
}

interface ContextMenuProps {
  position: ContextMenuPosition | null;
  onClose: () => void;
  children: React.ReactNode;
}

export function ContextMenu({ position, onClose, children }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [adjusted, setAdjusted] = useState<ContextMenuPosition | null>(null);

  // Adjust position to keep menu in viewport
  useEffect(() => {
    if (!position || !menuRef.current) {
      setAdjusted(null);
      return;
    }
    const rect = menuRef.current.getBoundingClientRect();
    const x = Math.min(position.x, window.innerWidth - rect.width - 8);
    const y = Math.min(position.y, window.innerHeight - rect.height - 8);
    setAdjusted({ x: Math.max(8, x), y: Math.max(8, y) });
  }, [position]);

  // Close on outside click
  useEffect(() => {
    if (!position) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    // Use timeout to avoid closing on the same right-click that opened it
    const id = setTimeout(() => {
      document.addEventListener('mousedown', handler);
    }, 0);
    return () => {
      clearTimeout(id);
      document.removeEventListener('mousedown', handler);
    };
  }, [position, onClose]);

  // Close on Escape
  useEffect(() => {
    if (!position) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [position, onClose]);

  if (!position) return null;

  const pos = adjusted ?? position;

  return (
    <div
      ref={menuRef}
      className="fixed z-50 min-w-[200px] rounded-lg border border-neutral-200 bg-white py-1 shadow-xl"
      style={{ left: pos.x, top: pos.y }}
      role="menu"
    >
      {children}
    </div>
  );
}

interface ContextMenuItemProps {
  label: string;
  onClick: () => void;
  shortcut?: string;
  disabled?: boolean;
}

export function ContextMenuItem({ label, onClick, shortcut, disabled }: ContextMenuItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 disabled:text-neutral-300 disabled:hover:bg-transparent"
      onClick={onClick}
    >
      <span>{label}</span>
      {shortcut && <span className="ml-4 text-xs text-neutral-400">{shortcut}</span>}
    </button>
  );
}

export function ContextMenuDivider() {
  return <hr className="my-1 border-neutral-100" />;
}

/**
 * Hook to manage context menu state.
 * Returns position (null when closed) and handlers to open/close.
 */
export function useContextMenu() {
  const [position, setPosition] = useState<ContextMenuPosition | null>(null);

  const onContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
  }, []);

  const onClose = useCallback(() => {
    setPosition(null);
  }, []);

  return { position, onContextMenu, onClose };
}
