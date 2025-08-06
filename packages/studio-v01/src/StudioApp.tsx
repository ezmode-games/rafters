import * as colorUtils from '@rafters/color-utils';
const {
  generateFiveColorHarmony,
  generateLightnessScale,
  generateSemanticColors,
  generateSemanticColorSuggestions,
  enhanceSemanticColorsWithLeonardo,
  hexToOKLCH,
  oklchToHex,
} = colorUtils;

console.log('Available color utils:', Object.keys(colorUtils));
console.log('generateSemanticColorSuggestions type:', typeof generateSemanticColorSuggestions);
import type {
  DepthScale,
  PaletteScale,
  SidebarSection,
  SpacingScale,
  TypographyScale,
} from '@/components';
import { ColorScaleDisplay } from '@/components/ColorScaleDisplay';
import { DepthDisplay } from '@/components/DepthDisplay';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PaletteDisplay } from '@/components/PaletteDisplay';
import { ProgressiveSidebar } from '@/components/ProgressiveSidebar';
import { SpacingDisplay } from '@/components/SpacingDisplay';
import { TypographyDisplay } from '@/components/TypographyDisplay';
import {
  validateDepthScale,
  validatePaletteScale,
  validateSpacingScale,
  validateTypographyScale,
} from '@/schemas';
import {
  type Section,
  useCompletedSections,
  useCurrentSection,
  useIsSystemComplete,
  useProgressiveScale,
  useStudioStore,
} from '@/store';
import type { OKLCH } from '@rafters/shared';
import { Logo } from '@rafters/shared';
import { Smartphone } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

// Mock data - replace with real generation logic
const mockColorScales: PaletteScale[] = [
  {
    name: 'Primary',
    scale: {
      50: 'oklch(0.95 0.02 220)',
      100: 'oklch(0.90 0.05 220)',
      200: 'oklch(0.80 0.08 220)',
      300: 'oklch(0.70 0.10 220)',
      400: 'oklch(0.60 0.12 220)',
      500: 'oklch(0.50 0.15 220)', // Primary color
      600: 'oklch(0.45 0.13 220)',
      700: 'oklch(0.35 0.11 220)',
      800: 'oklch(0.25 0.08 220)',
      900: 'oklch(0.15 0.05 220)',
    },
  },
  {
    name: 'Success',
    scale: {
      50: 'oklch(0.95 0.02 142)',
      100: 'oklch(0.90 0.05 142)',
      200: 'oklch(0.80 0.08 142)',
      300: 'oklch(0.70 0.10 142)',
      400: 'oklch(0.60 0.12 142)',
      500: 'oklch(0.50 0.15 142)',
      600: 'oklch(0.45 0.13 142)',
      700: 'oklch(0.35 0.11 142)',
      800: 'oklch(0.25 0.08 142)',
      900: 'oklch(0.15 0.05 142)',
    },
  },
];

const mockTypography: TypographyScale = {
  heading: 'Inter',
  body: 'Source Serif Pro',
  mono: 'Fira Code',
  scale: {
    display: 3.052,
    h1: 2.441,
    h2: 1.953,
    h3: 1.563,
    h4: 1.25,
    body: 1,
    small: 0.8,
  },
};

const mockSpacing: SpacingScale = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.618rem',
  xl: '2.618rem',
  xxl: '4.236rem',
};

const mockDepth: DepthScale = {
  none: '0 0 #0000',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
};

export function StudioApp() {
  // Local state for color picker
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [generatedScale, setGeneratedScale] = useState<PaletteScale | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [allColors, setAllColors] = useState<{ name: string; color: string }[]>([]);

  // Zustand store hooks
  const currentSection = useCurrentSection();
  const completedSections = useCompletedSections();
  const progressiveScale = useProgressiveScale();
  const isSystemComplete = useIsSystemComplete();

  // Store actions
  const { completeSection, focusSection, moveToNextSection } = useStudioStore();

  // Handle section completion
  const handleSectionComplete = useCallback(
    (section: Section) => {
      completeSection(section);
    },
    [completeSection]
  );

  // Handle section focus change
  const handleSectionFocus = useCallback(
    (section: Section) => {
      focusSection(section);
    },
    [focusSection]
  );

  const sidebarSections: SidebarSection[] = [
    {
      id: 'color',
      name: 'Color',
      completed: completedSections.has('color'),
      collapsed: currentSection !== 'color' && completedSections.has('color'),
      primaryValue: selectedColor || undefined, // Use selected color
    },
    {
      id: 'typography',
      name: 'Type',
      completed: completedSections.has('typography'),
      collapsed: currentSection !== 'typography' && completedSections.has('typography'),
      primaryValue: mockTypography.heading,
    },
    {
      id: 'spacing',
      name: 'Spacing',
      completed: completedSections.has('spacing'),
      collapsed: currentSection !== 'spacing' && completedSections.has('spacing'),
      primaryValue: mockSpacing.md,
    },
    {
      id: 'depth',
      name: 'Depth',
      completed: completedSections.has('depth'),
      collapsed: currentSection !== 'depth' && completedSections.has('depth'),
      primaryValue: 'md',
    },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Screen Size Check - Show message for screens smaller than 1024px */}
      <div className="lg:hidden min-h-screen flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <svg
                viewBox="0 0 374 227"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                className="w-32 h-20 mb-4"
              >
                <title>Rafters Logo</title>
                <g className="wordmark" style={{ fill: '#9ca3af' }}>
                  <path d="M73.76 171.496c-.683-.171-1.493-.256-2.432-.256-5.12 0-8.79 1.451-11.008 4.352-2.133 2.901-3.2 6.741-3.2 11.52V225H43.808v-52.864c0-.427-.043-1.195-.128-2.304 0-1.109-.043-2.261-.128-3.456 0-1.28-.043-2.475-.128-3.584s-.128-1.877-.128-2.304h12.8l.384 8.448c1.877-3.584 4.181-6.101 6.912-7.552 2.816-1.451 5.845-2.176 9.088-2.176h.512c.256 0 .512.043.768.128v12.16ZM110.748 225l-.256-7.808c-1.963 3.072-4.267 5.333-6.912 6.784-2.645 1.451-5.888 2.176-9.728 2.176-2.901 0-5.376-.469-7.424-1.408-2.048-1.024-3.755-2.389-5.12-4.096-1.28-1.792-2.219-3.84-2.816-6.144-.597-2.304-.896-4.779-.896-7.424 0-5.205.896-9.259 2.688-12.16 1.792-2.987 4.139-5.205 7.04-6.656 2.987-1.536 6.4-2.475 10.24-2.816 3.925-.427 7.979-.64 12.16-.64v-3.072a90.5 90.5 0 0 0-.128-4.736c0-1.707-.256-3.243-.768-4.608-.512-1.365-1.323-2.475-2.432-3.328-1.109-.939-2.688-1.408-4.736-1.408-2.816 0-4.992.853-6.528 2.56-1.536 1.707-2.304 3.925-2.304 6.656v.768H79.644v-.896c0-3.413.597-6.272 1.792-8.576 1.28-2.304 2.987-4.139 5.12-5.504 2.133-1.365 4.523-2.304 7.168-2.816 2.73-.597 5.59-.896 8.576-.896 3.925 0 7.211.469 9.856 1.408 2.645.853 4.736 2.176 6.272 3.968 1.621 1.792 2.731 4.053 3.328 6.784.683 2.731 1.024 5.973 1.024 9.728v33.664c0 3.413.213 6.912.64 10.496h-12.672Zm-1.024-31.744h-2.688c-2.304 0-4.437.213-6.4.64-1.963.341-3.67 1.024-5.12 2.048-1.365.939-2.432 2.219-3.2 3.84-.768 1.621-1.152 3.669-1.152 6.144 0 1.365.085 2.731.256 4.096a12.81 12.81 0 0 0 1.28 3.584 7.738 7.738 0 0 0 2.432 2.56c1.024.683 2.347 1.024 3.968 1.024 2.219 0 4.011-.512 5.376-1.536a11.61 11.61 0 0 0 3.2-4.096 19.433 19.433 0 0 0 1.536-5.376c.341-1.963.512-3.797.512-5.504v-7.424ZM165.066 141.544a5.964 5.964 0 0 0-1.152-.128h-1.28c-3.584 0-5.931 1.024-7.04 3.072-1.024 2.048-1.536 4.693-1.536 7.936v8.064h10.624v9.088h-10.624V225h-13.312v-55.424h-8.704v-9.088h8.704v-10.112c0-2.389.171-4.693.512-6.912.341-2.304 1.024-4.309 2.048-6.016 1.109-1.792 2.645-3.2 4.608-4.224 1.963-1.109 4.523-1.664 7.68-1.664 1.536 0 3.2.043 4.992.128 1.792.085 3.285.213 4.48.384v9.472ZM201.825 225.128a65.903 65.903 0 0 1-8.192.512c-3.243 0-5.931-.299-8.064-.896s-3.84-1.536-5.12-2.816c-1.195-1.365-2.048-3.115-2.56-5.248s-.768-4.779-.768-7.936v-39.168h-8.96v-9.088h8.96v-11.392l13.312-5.632v17.024h10.752v9.088h-10.752v37.504c0 3.243.427 5.547 1.28 6.912.853 1.28 2.731 1.92 5.632 1.92 1.451 0 2.944-.128 4.48-.384v9.6ZM222.313 194.408v5.12c0 2.731.128 5.205.384 7.424.256 2.219.725 4.096 1.408 5.632.683 1.536 1.664 2.731 2.944 3.584 1.365.853 3.072 1.28 5.12 1.28s3.669-.384 4.864-1.152c1.28-.768 2.261-1.749 2.944-2.944.683-1.28 1.152-2.688 1.408-4.224.256-1.621.384-3.285.384-4.992h12.672c-.341 7.424-2.176 13.013-5.504 16.768-3.328 3.669-8.917 5.504-16.768 5.504-5.291 0-9.472-.853-12.544-2.56-3.072-1.707-5.419-4.011-7.04-6.912-1.536-2.901-2.517-6.315-2.944-10.24-.427-3.925-.64-8.064-.64-12.416s.213-8.619.64-12.8c.427-4.267 1.451-8.064 3.072-11.392 1.621-3.328 4.011-6.016 7.168-8.064s7.509-3.072 13.056-3.072c4.352 0 7.893.64 10.624 1.92 2.816 1.28 4.992 3.072 6.528 5.376 1.621 2.219 2.731 4.821 3.328 7.808.683 2.987 1.109 6.187 1.28 9.6.085 1.707.128 3.499.128 5.376v5.376h-32.512Zm19.328-8.064v-4.224c0-1.451-.085-2.901-.256-4.352-.341-2.731-1.152-5.035-2.432-6.912-1.195-1.877-3.328-2.816-6.4-2.816-3.243 0-5.589.981-7.04 2.944-1.365 1.877-2.261 4.309-2.688 7.296a68.426 68.426 0 0 0-.384 3.968 61.95 61.95 0 0 0-.128 4.096h19.328ZM297.635 171.496c-.683-.171-1.493-.256-2.432-.256-5.12 0-8.789 1.451-11.008 4.352-2.133 2.901-3.2 6.741-3.2 11.52V225h-13.312v-52.864c0-.427-.043-1.195-.128-2.304a48.76 48.76 0 0 0-.128-3.456c0-1.28-.043-2.475-.128-3.584s-.128-1.877-.128-2.304h12.8l.384 8.448c1.877-3.584 4.181-6.101 6.912-7.552 2.816-1.451 5.845-2.176 9.088-2.176h.512c.256 0 .512.043.768.128v12.16ZM344.479 206.824c0 3.499-.555 6.485-1.664 8.96-1.109 2.389-2.645 4.352-4.608 5.888-1.963 1.536-4.309 2.645-7.04 3.328-2.731.768-5.675 1.152-8.832 1.152-6.656 0-11.819-1.493-15.488-4.48-3.584-2.987-5.376-7.552-5.376-13.696v-3.2h13.312v2.176c0 2.987.555 5.461 1.664 7.424 1.195 1.963 3.371 2.944 6.528 2.944 2.731 0 4.779-.725 6.144-2.176 1.451-1.536 2.176-3.669 2.176-6.4 0-2.475-.597-4.48-1.792-6.016-1.109-1.621-3.371-3.328-6.784-5.12l-8.448-4.48c-3.925-2.048-6.869-4.224-8.832-6.528-1.963-2.389-2.944-5.717-2.944-9.984 0-3.072.555-5.717 1.664-7.936 1.109-2.304 2.603-4.139 4.48-5.504 1.963-1.451 4.224-2.517 6.784-3.2 2.56-.683 5.291-1.024 8.192-1.024 6.144 0 10.795 1.152 13.952 3.456 3.243 2.304 5.248 5.888 6.016 10.752.256 1.707.384 3.499.384 5.376h-13.184v-2.176c0-2.731-.597-4.907-1.792-6.528-1.195-1.707-3.2-2.56-6.016-2.56-2.304 0-4.096.725-5.376 2.176-1.28 1.451-1.92 3.285-1.92 5.504 0 1.963.512 3.627 1.536 4.992 1.109 1.365 2.731 2.645 4.864 3.84l6.912 3.712a178.443 178.443 0 0 1 6.144 3.456c1.963 1.109 3.627 2.389 4.992 3.84 1.365 1.365 2.432 3.029 3.2 4.992.768 1.877 1.152 4.224 1.152 7.04Z" />
                </g>
                <g className="mark" style={{ fill: '#d1d5db', transformOrigin: '50% 50%' }}>
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    values="0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;-3;1;-5;2;-1;4;-2;0"
                    dur="15.7s"
                    repeatCount="indefinite"
                  />
                  <path d="m373.584 101.144-5.244 12.98L209.155 49.81l.07.17-203.98 82.414L0 119.413l190.715-77.055L118 12.981 123.244 0l250.34 101.144Z" />
                </g>
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Would you use Figma on a fucking phone?
          </h2>
          <p className="text-gray-600 mb-8">
            Rafters Studio is a professional design tool that requires a desktop or laptop screen.
            Please use a device with a screen width of at least 1024px.
          </p>
          <div className="text-sm text-gray-500">
            Current screen: {typeof window !== 'undefined' ? window.innerWidth : 'unknown'}px wide
          </div>
        </div>
      </div>

      {/* Main App - Only show on large screens */}
      <div className="hidden lg:block">
        {/* Top Navigation Bar */}
        <div className="fixed top-0 left-0 right-0 z-40 bg-white">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Logo
                  className="w-48 h-12 mr-4"
                  wordmarkColor={selectedColor || '#9ca3af'}
                  markColor={selectedColor || '#d1d5db'}
                />
              </div>
              <div className="flex items-center gap-4">
                {currentSection && (
                  <div className="text-sm text-gray-600 capitalize">Current: {currentSection}</div>
                )}
                <div className="text-sm text-gray-500">
                  Progress: {Math.round((completedSections.size / 4) * 100)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progressive Sidebar */}
        <ProgressiveSidebar sections={sidebarSections} onSectionClick={handleSectionFocus} />

        {/* Main Content Area */}
        <div className="pt-20 pl-20 pr-8 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Welcome/Getting Started State */}
            {!currentSection && (
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Welcome to Rafters Studio
                  </h2>
                  <p className="text-gray-600 mb-8">Create your design system step by step</p>
                  <button
                    type="button"
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    onClick={() => handleSectionFocus('color')}
                  >
                    Start with Colors
                  </button>
                </div>
              </div>
            )}
            {/* Color Section */}
            {currentSection === 'color' && (
              <ErrorBoundary>
                <div className="h-screen relative">
                  {!showAnimation ? (
                    // Initial color picker state
                    <div className="flex items-center justify-center h-screen">
                      <div
                        className={`w-2/3 aspect-square rounded-xl flex items-center justify-center cursor-pointer transition-colors ${
                          selectedColor
                            ? ''
                            : 'border-2 border-dashed border-gray-300 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: selectedColor || 'transparent' }}
                        onClick={() => setShowColorPicker(true)}
                      >
                        <div
                          className={`text-lg font-medium ${selectedColor ? 'text-white drop-shadow' : 'text-gray-400'}`}
                        >
                          {selectedColor ? 'Primary Color' : 'Choose Primary Color'}
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Full color scales
                    <div>
                      {allColors.length > 0 ? (
                        <div className="grid gap-8 grid-cols-1">
                          {allColors.map(({ name, color, oklch }) => (
                            <div key={name} className="relative">
                              <div className="absolute -left-16 top-0 text-lg font-medium text-gray-900 capitalize">
                                {name}
                              </div>
                              <ColorScaleDisplay
                                scale={(() => {
                                  // Use the original OKLCH harmony color directly
                                  const baseOklch = oklch;
                                  // For debugging: log the expected vs actual 500 values
                                  console.log(`${name}:`);
                                  console.log(`  Expected 500 (original hex): ${color}`);
                                  console.log(
                                    `  Expected 500 (oklch): ${JSON.stringify(baseOklch)}`
                                  );
                                  console.log(
                                    `  Actual 500 (converted back): ${oklchToHex(baseOklch)}`
                                  );

                                  // Generate scale - for now just use the original hex color for 500
                                  const scale = {
                                    50: oklchToHex({
                                      l: 0.98,
                                      c: Math.max(0.002, baseOklch.c * 0.1),
                                      h: baseOklch.h,
                                    }),
                                    100: oklchToHex({
                                      l: 0.95,
                                      c: Math.max(0.005, baseOklch.c * 0.2),
                                      h: baseOklch.h,
                                    }),
                                    200: oklchToHex({
                                      l: 0.88,
                                      c: Math.max(0.01, baseOklch.c * 0.4),
                                      h: baseOklch.h,
                                    }),
                                    300: oklchToHex({
                                      l: 0.78,
                                      c: Math.max(0.02, baseOklch.c * 0.6),
                                      h: baseOklch.h,
                                    }),
                                    400: oklchToHex({
                                      l: 0.65,
                                      c: Math.max(0.03, baseOklch.c * 0.8),
                                      h: baseOklch.h,
                                    }),
                                    500: color, // Use the original hex color directly
                                    600: oklchToHex({
                                      l: 0.45,
                                      c: Math.min(0.37, baseOklch.c * 1.1),
                                      h: baseOklch.h,
                                    }),
                                    700: oklchToHex({
                                      l: 0.35,
                                      c: Math.min(0.37, baseOklch.c * 1.2),
                                      h: baseOklch.h,
                                    }),
                                    800: oklchToHex({
                                      l: 0.25,
                                      c: Math.min(0.37, baseOklch.c * 1.3),
                                      h: baseOklch.h,
                                    }),
                                    900: oklchToHex({
                                      l: 0.15,
                                      c: Math.min(0.37, baseOklch.c * 1.4),
                                      h: baseOklch.h,
                                    }),
                                  };

                                  return scale;
                                })()}
                                name={name}
                                collapsed={false}
                                onAnimationComplete={() => {
                                  console.log(`${name} scale animation complete`);
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-gray-500">Select a color to begin</div>
                      )}
                    </div>
                  )}

                  {/* Color Picker Modal */}
                  {showColorPicker && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                      <div className="bg-white rounded-lg p-6 shadow-xl">
                        <h3 className="text-lg font-semibold mb-4">Choose Primary Color</h3>

                        {/* HTML5 Color Input */}
                        <input
                          type="color"
                          value={selectedColor || '#3b82f6'}
                          onChange={(e) => {
                            const newColor = e.target.value;
                            setSelectedColor(newColor);
                            setShowColorPicker(false);

                            // Generate harmony colors
                            const baseOklch = hexToOKLCH(newColor);
                            console.log('Base OKLCH:', baseOklch);
                            const harmony = generateFiveColorHarmony(baseOklch);
                            console.log('Generated harmony:', harmony);

                            // Create color array with both hex and OKLCH
                            const colors = [
                              { name: 'primary', color: newColor, oklch: baseOklch },
                              {
                                name: 'secondary',
                                color: oklchToHex(harmony.secondary),
                                oklch: harmony.secondary,
                              },
                              {
                                name: 'tertiary',
                                color: oklchToHex(harmony.tertiary),
                                oklch: harmony.tertiary,
                              },
                              {
                                name: 'accent',
                                color: oklchToHex(harmony.accent),
                                oklch: harmony.accent,
                              },
                              {
                                name: 'surface',
                                color: oklchToHex(harmony.surface),
                                oklch: harmony.surface,
                              },
                              {
                                name: 'neutral',
                                color: oklchToHex(harmony.neutral),
                                oklch: harmony.neutral,
                              },
                            ];
                            console.log('Final colors array:', colors);

                            setAllColors(colors);
                            setShowAnimation(true);
                          }}
                          className="w-full h-32 border-0 rounded cursor-pointer"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </ErrorBoundary>
            )}

            {/* Typography Section */}
            {currentSection === 'typography' && (
              <div className="mb-8">
                <TypographyDisplay
                  typography={mockTypography}
                  collapsed={false}
                  progressiveScale={currentSection === 'typography' ? 1.0 : progressiveScale}
                  onAnimationComplete={() => handleSectionComplete('typography')}
                />

                {/* Typography Controls */}
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    onClick={() => {
                      handleSectionComplete('typography');
                      moveToNextSection();
                    }}
                  >
                    Complete Typography
                  </button>
                </div>
              </div>
            )}

            {/* Spacing Section */}
            {currentSection === 'spacing' && (
              <div className="mb-8">
                <SpacingDisplay
                  spacing={mockSpacing}
                  collapsed={false}
                  progressiveScale={currentSection === 'spacing' ? 1.0 : progressiveScale}
                  onAnimationComplete={() => handleSectionComplete('spacing')}
                />

                {/* Spacing Controls */}
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                    onClick={() => {
                      handleSectionComplete('spacing');
                      moveToNextSection();
                    }}
                  >
                    Complete Spacing
                  </button>
                </div>
              </div>
            )}

            {/* Depth Section */}
            {currentSection === 'depth' && (
              <div className="mb-8">
                <DepthDisplay
                  depth={mockDepth}
                  collapsed={false}
                  progressiveScale={currentSection === 'depth' ? 1.0 : progressiveScale}
                  onAnimationComplete={() => handleSectionComplete('depth')}
                />

                {/* Depth Controls */}
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    onClick={() => {
                      handleSectionComplete('depth');
                    }}
                  >
                    Complete Design System
                  </button>
                </div>
              </div>
            )}

            {/* Completion State */}
            {isSystemComplete && (
              <div className="text-center py-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Design System Complete! 🎉
                </h2>
                <p className="text-gray-600 mb-8">
                  Your design system is ready to export and use in your projects.
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    type="button"
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Export CSS
                  </button>
                  <button
                    type="button"
                    className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Export Tailwind
                  </button>
                  <button
                    type="button"
                    className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    Save to Cloud
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
