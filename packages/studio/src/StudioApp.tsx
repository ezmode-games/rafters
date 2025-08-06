/**
 * Main Studio App - Testing ColorWheel component
 */

import type { OKLCH } from '@rafters/shared';
import { useState } from 'react';
import { ColorWheel } from './components/ColorWheel';

// Default blue color in OKLCH
const defaultColor: OKLCH = {
  l: 0.6,
  c: 0.15,
  h: 250,
  alpha: 1,
};

export function StudioApp() {
  const [currentColor, setCurrentColor] = useState<OKLCH>(defaultColor);

  return (
    <div className="studio-app">
      <header className="studio-header">
        <h1>Rafters Studio</h1>
        <p>Design Intelligence System</p>
      </header>

      <main className="studio-main">
        <ColorWheel
          color={currentColor}
          onChange={setCurrentColor}
          className="studio-color-wheel"
        />
      </main>
    </div>
  );
}
