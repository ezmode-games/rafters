import type { ColorValue } from '@rafters/shared';
import type { Metadata } from 'next';

// All Tailwind 600-level colors that we stored
const tailwindColors = [
  { name: 'Tailwind Slate', oklch: { l: 0.446, c: 0.043, h: 257.281 } },
  { name: 'Tailwind Gray', oklch: { l: 0.446, c: 0.03, h: 256.802 } },
  { name: 'Tailwind Zinc', oklch: { l: 0.442, c: 0.017, h: 285.786 } },
  { name: 'Tailwind Neutral', oklch: { l: 0.439, c: 0, h: 0 } },
  { name: 'Tailwind Stone', oklch: { l: 0.444, c: 0.011, h: 73.639 } },
  { name: 'Tailwind Red', oklch: { l: 0.577, c: 0.245, h: 27.325 } },
  { name: 'Tailwind Orange', oklch: { l: 0.646, c: 0.222, h: 41.116 } },
  { name: 'Tailwind Amber', oklch: { l: 0.666, c: 0.179, h: 58.318 } },
  { name: 'Tailwind Yellow', oklch: { l: 0.681, c: 0.162, h: 75.834 } },
  { name: 'Tailwind Lime', oklch: { l: 0.648, c: 0.2, h: 131.684 } },
  { name: 'Tailwind Green', oklch: { l: 0.627, c: 0.194, h: 149.214 } },
  { name: 'Tailwind Emerald', oklch: { l: 0.596, c: 0.145, h: 163.225 } },
  { name: 'Tailwind Teal', oklch: { l: 0.6, c: 0.118, h: 184.704 } },
  { name: 'Tailwind Cyan', oklch: { l: 0.609, c: 0.126, h: 221.723 } },
  { name: 'Tailwind Sky', oklch: { l: 0.588, c: 0.158, h: 241.966 } },
  { name: 'Tailwind Blue', oklch: { l: 0.546, c: 0.245, h: 262.881 } },
  { name: 'Tailwind Indigo', oklch: { l: 0.511, c: 0.262, h: 276.966 } },
  { name: 'Tailwind Violet', oklch: { l: 0.541, c: 0.281, h: 293.009 } },
  { name: 'Tailwind Purple', oklch: { l: 0.558, c: 0.288, h: 302.321 } },
  { name: 'Tailwind Fuchsia', oklch: { l: 0.591, c: 0.293, h: 322.896 } },
  { name: 'Tailwind Pink', oklch: { l: 0.592, c: 0.249, h: 0.584 } },
  { name: 'Tailwind Rose', oklch: { l: 0.586, c: 0.253, h: 17.585 } },
];

async function getColorData(): Promise<ColorValue[]> {
  const colors: ColorValue[] = [];

  for (const color of tailwindColors) {
    try {
      const response = await fetch('https://rafters.realhandy.tech/api/color-intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oklch: color.oklch,
          name: color.name,
        }),
      });

      if (response.ok) {
        const data = (await response.json()) as ColorValue;
        colors.push(data);
      }
    } catch (error) {
      console.error(`Failed to fetch color data for ${color.name}:`, error);
    }
  }

  return colors;
}

function oklchToCSS(color: { l: number; c: number; h: number }): string {
  return `oklch(${color.l.toFixed(3)} ${color.c.toFixed(3)} ${color.h.toFixed(1)})`;
}

function ColorSwatch({ color }: { color: { l: number; c: number; h: number } }) {
  return (
    <div
      className="w-12 h-12 rounded border border-gray-200"
      style={{ backgroundColor: oklchToCSS(color) }}
      title={oklchToCSS(color)}
    />
  );
}

function ColorScale({
  scale,
  name,
}: { scale: Array<{ l: number; c: number; h: number }>; name: string }) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700">{name} Scale</h4>
      <div className="flex space-x-1">
        {scale.map((color, index) => (
          <div key={`${color.l}-${color.c}-${color.h}`} className="flex flex-col items-center">
            <ColorSwatch color={color} />
            <span className="text-xs text-gray-500 mt-1">
              {index === 0
                ? '50'
                : index === 1
                  ? '100'
                  : index === 2
                    ? '200'
                    : index === 3
                      ? '300'
                      : index === 4
                        ? '400'
                        : index === 5
                          ? '500'
                          : index === 6
                            ? '600'
                            : index === 7
                              ? '700'
                              : index === 8
                                ? '800'
                                : index === 9
                                  ? '900'
                                  : '950'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function getScalePositionLabel(index: number): string {
  const positions = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
  return positions[index] || `${index}`;
}

function AccessibilityPair({
  color1,
  color2,
  level,
  scale1Index,
  scale2Index,
}: {
  color1: { l: number; c: number; h: number };
  color2: { l: number; c: number; h: number };
  level: 'AA' | 'AAA';
  scale1Index: number;
  scale2Index: number;
}) {
  return (
    <div className="flex items-center gap-2">
      {/* Connected swatches */}
      <div className="flex items-center">
        <div
          className="w-6 h-6 rounded-l-md border border-gray-300"
          style={{ backgroundColor: oklchToCSS(color1) }}
        />
        <div
          className="w-6 h-6 rounded-r-md border border-gray-300"
          style={{ backgroundColor: oklchToCSS(color2) }}
        />
      </div>

      {/* Connection indicator */}
      <div className="w-3 h-0.5 bg-gray-400" />

      {/* Compliance badge */}
      <span
        className={`px-1.5 py-0.5 rounded text-xs font-medium ${
          level === 'AAA' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
        }`}
      >
        {level}
      </span>

      {/* Scale positions */}
      <span className="text-xs text-gray-500 font-mono">
        {getScalePositionLabel(scale1Index)} + {getScalePositionLabel(scale2Index)}
      </span>
    </div>
  );
}

function AccessibilityMatrix({ colorValue }: { colorValue: ColorValue }) {
  // Access pre-computed matrices from updated ColorValue (gracefully handle missing data)
  const pairs = colorValue.accessibility?.wcagAA?.normal || [];
  const aaaPairs = colorValue.accessibility?.wcagAAA?.normal || [];

  // Ensure we have valid scale data before proceeding
  if (!colorValue.scale || colorValue.scale.length === 0) {
    return (
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">Accessibility Pairs</h4>
        <p className="text-xs text-gray-500 italic">
          Accessibility data not available for this color.
        </p>
      </div>
    );
  }

  // Limit displayed pairs to avoid overwhelming UI
  const maxPairs = 8;
  const limitedPairs = pairs.slice(0, maxPairs);
  const limitedAAAPairs = aaaPairs.slice(0, maxPairs);

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-700">Accessibility Pairs</h4>

      {/* AA Pairs */}
      {limitedPairs.length > 0 && (
        <div>
          <h5 className="text-xs font-medium text-blue-700 mb-2">
            WCAG AA Normal Text (4.5:1) • {pairs.length} pairs
          </h5>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {limitedPairs
              .filter(([i, j]) => colorValue.scale[i] && colorValue.scale[j])
              .map(([i, j]) => (
                <AccessibilityPair
                  key={`aa-${i}-${j}`}
                  color1={colorValue.scale[i]}
                  color2={colorValue.scale[j]}
                  level="AA"
                  scale1Index={i}
                  scale2Index={j}
                />
              ))}
          </div>
          {pairs.length > maxPairs && (
            <p className="text-xs text-gray-500 mt-2">
              Showing {maxPairs} of {pairs.length} AA-compliant pairs
            </p>
          )}
        </div>
      )}

      {/* AAA Pairs */}
      {limitedAAAPairs.length > 0 && (
        <div>
          <h5 className="text-xs font-medium text-green-700 mb-2">
            WCAG AAA Normal Text (7:1) • {aaaPairs.length} pairs
          </h5>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {limitedAAAPairs
              .filter(([i, j]) => colorValue.scale[i] && colorValue.scale[j])
              .map(([i, j]) => (
                <AccessibilityPair
                  key={`aaa-${i}-${j}`}
                  color1={colorValue.scale[i]}
                  color2={colorValue.scale[j]}
                  level="AAA"
                  scale1Index={i}
                  scale2Index={j}
                />
              ))}
          </div>
          {aaaPairs.length > maxPairs && (
            <p className="text-xs text-gray-500 mt-2">
              Showing {maxPairs} of {aaaPairs.length} AAA-compliant pairs
            </p>
          )}
        </div>
      )}

      {/* Background compatibility summary */}
      {(colorValue.accessibility?.onWhite?.aa?.length ||
        colorValue.accessibility?.onBlack?.aa?.length) && (
        <div className="pt-3 border-t border-gray-200">
          <h5 className="text-xs font-medium text-gray-700 mb-2">Background Compatibility</h5>
          <div className="flex gap-4 text-xs">
            {colorValue.accessibility?.onWhite?.aa?.length && (
              <div>
                <span className="text-gray-600">White background:</span>
                <span className="ml-1 font-mono text-gray-900">
                  {colorValue.accessibility.onWhite.aa.length} AA shades
                </span>
              </div>
            )}
            {colorValue.accessibility?.onBlack?.aa?.length && (
              <div>
                <span className="text-gray-600">Black background:</span>
                <span className="ml-1 font-mono text-gray-900">
                  {colorValue.accessibility.onBlack.aa.length} AA shades
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {limitedPairs.length === 0 && limitedAAAPairs.length === 0 && (
        <p className="text-xs text-gray-500 italic">
          No accessible pairs found in this color scale. Consider using colors with greater
          lightness variation.
        </p>
      )}
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Rafters Color Intelligence | All Tailwind Colors',
  description:
    'Complete color intelligence for all Tailwind CSS colors with AI-generated insights, OKLCH scales, and accessibility guidance.',
};

export default async function ColorsPage() {
  const colors = await getColorData();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Tailwind Color Intelligence</h1>
        <div className="text-gray-600 text-lg space-y-4 max-w-4xl">
          <p>
            All {colors.length} Tailwind 600-level colors with complete AI intelligence, OKLCH
            scales, and accessibility analysis. Generated once, cached in Vectorize.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 text-left space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Contrast-Aware Scale Mathematics
            </h2>
            <p>
              Instead of traditional linear lightness progressions, Rafters generates color scales
              based on <strong>target contrast ratios</strong> optimized for modern app interfaces.
              Our algorithm targets specific WCAG contrast values: 1.01, 1.45, 2.05, 3.0, 4.54, 7.0,
              and up to 13.86 for maximum accessibility.
            </p>
            <p>
              Light steps (50-400) provide the crucial 1.45-3.0 contrast range needed for dark mode
              UI chrome—subtle borders, disabled text, and secondary elements that traditional
              scales miss. Dark steps (600-950) deliver 4.5+ contrast ratios for accessible text on
              light backgrounds. This dual-optimization approach ensures your color system works
              seamlessly across both light and dark themes, eliminating the common problem of "dead
              zones" where colors don't meet accessibility standards on either background.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:gap-12">
        {colors.map((colorData) => (
          <div
            key={colorData.name}
            className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm"
          >
            {/* Header with main color */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <ColorSwatch color={colorData.scale[5]} />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {colorData.intelligence?.suggestedName ?? colorData.name}
                  </h2>
                  <p className="text-gray-600">{oklchToCSS(colorData.scale[5])}</p>
                </div>
              </div>

              {/* Analysis badges */}
              <div className="flex gap-2">
                {colorData.analysis?.temperature && (
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      colorData.analysis.temperature === 'warm'
                        ? 'bg-orange-100 text-orange-800'
                        : colorData.analysis.temperature === 'cool'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {colorData.analysis.temperature}
                  </span>
                )}
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    colorData.analysis?.isLight
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {colorData.analysis?.isLight ? 'light' : 'dark'}
                </span>
              </div>
            </div>

            {/* OKLCH Scale */}
            <div className="mb-6">
              <ColorScale scale={colorData.scale} name={colorData.name} />
            </div>

            {/* Color Harmonies */}
            {colorData.harmonies && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Color Harmonies</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h5 className="text-xs font-medium text-gray-600 mb-2">Complementary</h5>
                    <div className="flex items-center gap-2">
                      <ColorSwatch color={colorData.harmonies.complementary} />
                      <span className="text-xs text-gray-500">
                        {oklchToCSS(colorData.harmonies.complementary)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-xs font-medium text-gray-600 mb-2">Triadic</h5>
                    <div className="flex items-center gap-1">
                      {colorData.harmonies.triadic?.slice(0, 3).map((color) => (
                        <ColorSwatch
                          key={`triadic-${color.l}-${color.c}-${color.h}`}
                          color={color}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-xs font-medium text-gray-600 mb-2">Analogous</h5>
                    <div className="flex items-center gap-1">
                      {colorData.harmonies.analogous?.slice(0, 3).map((color) => (
                        <ColorSwatch
                          key={`analogous-${color.l}-${color.c}-${color.h}`}
                          color={color}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* OKLCH Technical Details */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-3">OKLCH Technical Analysis</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Lightness:</span>
                  <div className="font-mono text-gray-900">
                    {(colorData.scale[5].l * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Chroma:</span>
                  <div className="font-mono text-gray-900">{colorData.scale[5].c.toFixed(3)}</div>
                </div>
                <div>
                  <span className="text-gray-600">Hue:</span>
                  <div className="font-mono text-gray-900">{colorData.scale[5].h.toFixed(1)}°</div>
                </div>
              </div>
              {colorData.analysis && (
                <div className="mt-3 text-xs text-gray-600">
                  <strong>Analysis:</strong> {colorData.analysis.name} •
                  {colorData.analysis.temperature} temperature •
                  {colorData.analysis.isLight ? 'light' : 'dark'} tone
                </div>
              )}
            </div>

            {/* WCAG Accessibility Matrix with Visual Pairs */}
            {colorData.accessibility && (
              <div className="mb-6 p-4 bg-green-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  WCAG Accessibility Matrix
                </h4>
                <AccessibilityMatrix colorValue={colorData} />
              </div>
            )}

            {/* Semantic Intelligence */}
            {(colorData.atmosphericWeight || colorData.perceptualWeight) && (
              <div className="mb-6 p-4 bg-purple-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Leonardo-Inspired Semantic Intelligence
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-xs font-medium text-purple-700 mb-2">Atmospheric Weight</h5>
                    <div className="space-y-1 text-xs">
                      <div>
                        <span className="text-gray-600">Distance weight:</span>
                        <span className="ml-2 font-mono">
                          {colorData.atmosphericWeight?.distanceWeight?.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Role:</span>
                        <span className="ml-2 capitalize">
                          {colorData.atmosphericWeight?.atmosphericRole ?? 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Temperature:</span>
                        <span className="ml-2 capitalize">
                          {colorData.atmosphericWeight?.temperature ?? 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-xs font-medium text-purple-700 mb-2">Perceptual Weight</h5>
                    <div className="space-y-1 text-xs">
                      <div>
                        <span className="text-gray-600">Visual weight:</span>
                        <span className="ml-2 font-mono">
                          {colorData.perceptualWeight?.weight?.toFixed(2) ?? 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Density:</span>
                        <span className="ml-2 capitalize">
                          {colorData.perceptualWeight?.density ?? 'N/A'}
                        </span>
                      </div>
                      {false && ( // harmonicTension not available in new schema
                        <div>
                          <span className="text-gray-600">Harmonic tension:</span>
                          <span className="ml-2 font-mono">{'N/A'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {false && ( // contextualRecommendations not available in new schema
                  <div className="mt-3">
                    <h6 className="text-xs font-medium text-purple-700 mb-1">
                      Contextual Recommendations
                    </h6>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {[].map((rec: string) => (
                        <li key={rec}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {colorData.perceptualWeight?.balancingRecommendation && (
                  <div className="mt-3">
                    <h6 className="text-xs font-medium text-purple-700 mb-1">
                      Balancing Recommendation
                    </h6>
                    <p className="text-xs text-gray-600">
                      {colorData.perceptualWeight?.balancingRecommendation}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Semantic Color Suggestions */}
            {colorData.semanticSuggestions && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-4">
                  Semantic Color Suggestions
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <h5 className="text-xs font-medium text-red-700 mb-2">Danger</h5>
                    <div className="flex gap-1">
                      {colorData.semanticSuggestions.danger?.slice(0, 3).map((color) => (
                        <ColorSwatch
                          key={`danger-${color.l}-${color.c}-${color.h}`}
                          color={color}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-xs font-medium text-green-700 mb-2">Success</h5>
                    <div className="flex gap-1">
                      {colorData.semanticSuggestions.success?.slice(0, 3).map((color) => (
                        <ColorSwatch
                          key={`success-${color.l}-${color.c}-${color.h}`}
                          color={color}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-xs font-medium text-yellow-700 mb-2">Warning</h5>
                    <div className="flex gap-1">
                      {colorData.semanticSuggestions.warning?.slice(0, 3).map((color) => (
                        <ColorSwatch
                          key={`warning-${color.l}-${color.c}-${color.h}`}
                          color={color}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-xs font-medium text-blue-700 mb-2">Info</h5>
                    <div className="flex gap-1">
                      {colorData.semanticSuggestions.info?.slice(0, 3).map((color) => (
                        <ColorSwatch key={`info-${color.l}-${color.c}-${color.h}`} color={color} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI Intelligence */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Color Reasoning</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {colorData.intelligence?.reasoning ?? 'No reasoning available'}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Emotional Impact</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {colorData.intelligence?.emotionalImpact ?? 'No emotional impact available'}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Cultural Context</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {colorData.intelligence?.culturalContext ?? 'No cultural context available'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Accessibility Notes</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {colorData.intelligence?.accessibilityNotes ??
                      'No accessibility notes available'}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Usage Guidance</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {colorData.intelligence?.usageGuidance ?? 'No usage guidance available'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">About This Data</h3>
        <p className="text-gray-700 text-sm">
          All colors generated using Claude AI for intelligence analysis and stored in Cloudflare
          Vectorize for semantic search. Each color includes complete OKLCH scales, accessibility
          analysis, and cultural context. This page is statically generated at build time for
          optimal performance.
        </p>
      </div>
    </div>
  );
}
