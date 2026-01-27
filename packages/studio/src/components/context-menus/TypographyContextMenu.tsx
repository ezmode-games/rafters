/**
 * Typography Context Menu
 *
 * Right-click on a type sample to change the font family.
 */

import { useCallback, useState } from 'react';
import { WhyGate } from '../shared/WhyGate';
import {
  ContextMenu,
  ContextMenuDivider,
  ContextMenuItem,
  type ContextMenuPosition,
} from './ContextMenu';

const FONT_FAMILIES = [
  { label: 'System sans', value: 'font-sans' },
  { label: 'System serif', value: 'font-serif' },
  { label: 'System mono', value: 'font-mono' },
  { label: 'Display', value: 'font-display' },
];

interface TypographyContextMenuProps {
  position: ContextMenuPosition | null;
  onClose: () => void;
  tokenName: string;
  onCommit: (fontFamily: string, reason: string) => void;
}

export function TypographyContextMenu({
  position,
  onClose,
  tokenName,
  onCommit,
}: TypographyContextMenuProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleCommit = useCallback(
    (reason: string) => {
      if (selected) {
        onCommit(selected, reason);
        onClose();
      }
    },
    [selected, onCommit, onClose],
  );

  return (
    <ContextMenu position={position} onClose={onClose}>
      <div className="px-3 py-2">
        <span className="text-xs font-medium text-neutral-900">{tokenName}</span>
      </div>
      <ContextMenuDivider />

      {FONT_FAMILIES.map((font) => (
        <ContextMenuItem
          key={font.value}
          label={font.label}
          onClick={() => setSelected(font.value)}
        />
      ))}

      {selected && (
        <>
          <ContextMenuDivider />
          <div className="px-3 py-2">
            <WhyGate onCommit={handleCommit} />
          </div>
        </>
      )}
    </ContextMenu>
  );
}
