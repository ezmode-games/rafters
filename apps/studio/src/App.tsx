import clsx from 'clsx';
import { gsap } from 'gsap';
import { useCallback, useEffect, useRef, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { type OKLCH, formatOKLCH, generateSimpleScale, hexToOKLCH } from './utils/color';

export default function App() {
  const [color, setColor] = useState('#3b82f6'); // Default blue
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [oklchColor, setOklchColor] = useState<OKLCH | null>(null);
  const [showScale, setShowScale] = useState(false);
  const [colorScale, setColorScale] = useState<string[]>([]);

  // Refs for GSAP animations
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const colorBoxRef = useRef<HTMLButtonElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const scaleItemsRef = useRef<HTMLDivElement[]>([]);

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    // Instant client-side preview (simplified)
    const oklch = hexToOKLCH(newColor);
    setOklchColor(oklch);

    // Generate color scale but don't trigger animation yet
    const scale = generateSimpleScale(newColor);
    setColorScale(scale);
  };

  const handleColorPickerDone = useCallback(() => {
    setShowColorPicker(false);

    // Create GSAP timeline for the transition
    const tl = gsap.timeline();

    // First, fade out the color picker if visible
    if (colorPickerRef.current) {
      tl.to(colorPickerRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: 'power2.out',
      });
    }

    // Set state and animate to settings view
    tl.call(() => {
      setShowScale(true);
    })

      // Animate settings panel in
      .fromTo(
        settingsRef.current,
        {
          opacity: 0,
          y: 50,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: 'power2.out',
        }
      )

      // Animate each scale item in with stagger
      .fromTo(
        scaleItemsRef.current,
        {
          opacity: 0,
          scale: 0.8,
          y: 20,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.4,
          ease: 'back.out(1.7)',
          stagger: 0.1,
        },
        '-=0.3' // Start slightly before settings panel finishes
      );
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target as Node) &&
        showColorPicker &&
        oklchColor
      ) {
        handleColorPickerDone();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColorPicker, oklchColor, handleColorPickerDone]);

  // Add refs to scale items array
  const addScaleItemRef = (el: HTMLDivElement | null, index: number) => {
    if (el) {
      scaleItemsRef.current[index] = el;
    }
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Save design system:', { color, oklch: oklchColor });
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        {/* Wordmark */}
        <div className="flex items-center">
          <h1 className="text-xl font-medium tracking-tight text-gray-900">Rafters Studio</h1>
        </div>

        {/* Save Button */}
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
        >
          Save
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        {!showScale ? (
          /* Initial State - Large Color Box */
          <div className="text-center">
            <div className="relative">
              <button
                type="button"
                ref={colorBoxRef}
                onClick={() => setShowColorPicker(!showColorPicker)}
                className={clsx(
                  'w-2/3 aspect-square rounded-lg border-2 border-gray-300 hover:scale-105 hover:border-gray-400 cursor-pointer flex items-center justify-center transition-all duration-300',
                  showColorPicker && 'scale-105 border-gray-400',
                  !oklchColor && 'bg-transparent'
                )}
                style={{
                  backgroundColor: oklchColor ? color : 'transparent',
                  minWidth: '300px',
                  minHeight: '300px',
                }}
              >
                {!oklchColor && (
                  <span className="text-gray-500 text-lg font-medium">Primary Color?</span>
                )}
              </button>

              {/* Color Picker */}
              {showColorPicker && (
                <div
                  ref={colorPickerRef}
                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                >
                  <HexColorPicker color={color} onChange={handleColorChange} />
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="#000000"
                    />
                  </div>
                  {oklchColor && (
                    <div className="mt-2 text-xs text-gray-500 font-mono">
                      {formatOKLCH(oklchColor)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Settings State - Scale Display */
          <div ref={settingsRef} className="w-full max-w-2xl">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Design System Settings</h2>

              {/* Color Scale Row */}
              <div className="mb-6">
                <div className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color Scale
                </div>
                <div className="flex items-center gap-2 justify-center">
                  {colorScale.map((scaleColor, index) => (
                    <div
                      key={`scale-${index}-${scaleColor}`}
                      className="flex flex-col items-center"
                    >
                      <div
                        ref={(el) => addScaleItemRef(el, index)}
                        className={clsx(
                          'w-12 h-12 rounded-md border border-gray-200',
                          index === 2 && 'ring-2 ring-blue-500 ring-offset-2'
                        )}
                        style={{
                          backgroundColor: scaleColor,
                        }}
                      />
                      <span className="text-xs text-gray-500 mt-1 font-mono">
                        {index === 0
                          ? '100'
                          : index === 1
                            ? '300'
                            : index === 2
                              ? '500'
                              : index === 3
                                ? '700'
                                : '900'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* OKLCH Values */}
              {oklchColor && (
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Base Color (500):</span>
                  <span className="ml-2 font-mono text-gray-600">{formatOKLCH(oklchColor)}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
