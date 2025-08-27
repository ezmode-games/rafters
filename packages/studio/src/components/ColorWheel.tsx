/**
 * Large, impactful color wheel component
 * Integrates react-colorful with OKLCH workflow
 */

import { hexToOKLCH, oklchToCSS, oklchToHex } from '@rafters/color-utils';
import type { OKLCH } from '@rafters/shared';
import { useCallback, useEffect, useState } from 'react';
import { HexColorPicker } from 'react-colorful';

interface ColorWheelProps {
  color: OKLCH;
  onChange: (color: OKLCH) => void;
  className?: string;
}

export function ColorWheel({ color, onChange, className = '' }: ColorWheelProps) {
  // Convert OKLCH to hex for react-colorful
  const [hexColor, setHexColor] = useState(() => {
    try {
      return oklchToHex(color);
    } catch {
      return '#3b82f6'; // Fallback blue
    }
  });

  // Update hex when OKLCH color prop changes
  useEffect(() => {
    try {
      const newHex = oklchToHex(color);
      setHexColor(newHex);
    } catch (error) {
      console.warn('Failed to convert OKLCH to hex:', error);
    }
  }, [color]);

  const handleColorChange = useCallback(
    (newHex: string) => {
      setHexColor(newHex);

      try {
        const oklchColor = hexToOKLCH(newHex);
        onChange(oklchColor);
      } catch (error) {
        console.warn('Failed to convert hex to OKLCH:', error);
      }
    },
    [onChange]
  );

  return (
    <div className={`color-wheel ${className}`}>
      {/* Large, impactful color picker */}
      <div className="color-wheel__container">
        <HexColorPicker
          color={hexColor}
          onChange={handleColorChange}
          className="color-wheel__picker"
        />

        {/* Current color display */}
        <div className="color-wheel__current">
          <div
            className="color-wheel__swatch"
            style={{
              backgroundColor: oklchToCSS(color),
              borderColor: color.l > 0.5 ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
            }}
          />

          {/* OKLCH values display */}
          <div className="color-wheel__values">
            <div className="color-wheel__value">
              <span className="label">L:</span>
              <span className="value">{color.l.toFixed(3)}</span>
            </div>
            <div className="color-wheel__value">
              <span className="label">C:</span>
              <span className="value">{color.c.toFixed(3)}</span>
            </div>
            <div className="color-wheel__value">
              <span className="label">H:</span>
              <span className="value">{color.h.toFixed(1)}°</span>
            </div>
          </div>

          {/* CSS output */}
          <div className="color-wheel__css">
            <code>{oklchToCSS(color)}</code>
          </div>
        </div>
      </div>
    </div>
  );
}
