/**
 * SemanticChoices - First Run Semantic Color Selection
 *
 * Presents all 11 semantic colors with computed options.
 * Designer picks or customizes each, provides reasoning.
 * Once complete, first-run ends and workspace unlocks.
 */

import {
  generateRaftersHarmony,
  generateSemanticColorSuggestions,
  oklchToHex,
} from '@rafters/color-utils';
import type { OKLCH } from '@rafters/shared';
import { Button } from '@rafters/ui/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@rafters/ui/components/ui/card';
import { Container } from '@rafters/ui/components/ui/container';
import { Grid } from '@rafters/ui/components/ui/grid';
import { Muted, P } from '@rafters/ui/components/ui/typography';
import classy from '@rafters/ui/primitives/classy';
import { useCallback, useMemo, useState } from 'react';
import { ColorPicker } from './ColorPicker';
import { SemanticChoice } from './SemanticChoice';

export interface SemanticChoicesProps {
  /** Primary color selected in Snowstorm */
  primaryColor: OKLCH;
  /** Called when all semantics are chosen */
  onComplete: (choices: SemanticColorChoices) => void;
}

export interface SemanticColorChoices {
  [key: string]: { color: OKLCH; reason: string };
}

interface SemanticDefinition {
  name: string;
  label: string;
  options: OKLCH[];
  placeholders: string[];
}

/** Generate all semantic color definitions from primary */
function generateSemanticDefinitions(primaryColor: OKLCH): SemanticDefinition[] {
  const harmony = generateRaftersHarmony(primaryColor);
  const suggestions = generateSemanticColorSuggestions(primaryColor);

  return [
    // Harmony colors (5)
    {
      name: 'secondary',
      label: 'Secondary',
      options: [
        harmony.secondary,
        { ...harmony.secondary, l: harmony.secondary.l + 0.1, c: harmony.secondary.c * 0.9 },
        { ...harmony.secondary, l: harmony.secondary.l - 0.1, c: harmony.secondary.c * 1.1 },
      ],
      placeholders: [
        'complements the primary beautifully',
        'provides visual variety without clash',
        'works well for secondary actions',
      ],
    },
    {
      name: 'tertiary',
      label: 'Tertiary',
      options: [
        harmony.tertiary,
        { ...harmony.tertiary, l: harmony.tertiary.l + 0.1, c: harmony.tertiary.c * 0.9 },
        { ...harmony.tertiary, l: harmony.tertiary.l - 0.1, c: harmony.tertiary.c * 1.1 },
      ],
      placeholders: [
        'adds depth to the palette',
        'useful for accents and highlights',
        'creates visual interest',
      ],
    },
    {
      name: 'accent',
      label: 'Accent',
      options: [
        harmony.accent,
        { ...harmony.accent, l: harmony.accent.l + 0.1, c: harmony.accent.c * 0.9 },
        { ...harmony.accent, l: harmony.accent.l - 0.1, c: harmony.accent.c * 1.1 },
      ],
      placeholders: [
        'draws attention when needed',
        'maximum contrast for emphasis',
        'stands out from surrounding colors',
      ],
    },
    {
      name: 'highlight',
      label: 'Highlight',
      options: [
        harmony.highlight,
        { ...harmony.highlight, l: harmony.highlight.l + 0.1, c: harmony.highlight.c * 0.9 },
        { ...harmony.highlight, l: harmony.highlight.l - 0.1, c: harmony.highlight.c * 1.1 },
      ],
      placeholders: [
        'subtle emphasis without distraction',
        'cohesive with the overall palette',
        'good for hover states',
      ],
    },
    {
      name: 'surface',
      label: 'Surface',
      options: [
        harmony.surface,
        { ...harmony.surface, l: harmony.surface.l + 0.05, c: harmony.surface.c * 0.8 },
        { ...harmony.surface, l: harmony.surface.l - 0.05, c: harmony.surface.c * 1.2 },
      ],
      placeholders: [
        'perfect for card backgrounds',
        'subtle enough for large areas',
        'maintains readability',
      ],
    },
    {
      name: 'neutral',
      label: 'Neutral',
      options: [
        harmony.neutral,
        { ...harmony.neutral, l: harmony.neutral.l + 0.1 },
        { ...harmony.neutral, l: harmony.neutral.l - 0.1 },
      ],
      placeholders: [
        'clean and unobtrusive',
        'works for borders and dividers',
        'balances the palette',
      ],
    },
    // Semantic state colors (4)
    {
      name: 'danger',
      label: 'Danger',
      options: suggestions.danger,
      placeholders: [
        'clearly communicates error state',
        'visible but not alarming',
        'accessible contrast ratio',
      ],
    },
    {
      name: 'success',
      label: 'Success',
      options: suggestions.success,
      placeholders: [
        'conveys positive outcome',
        'calming and reassuring',
        'distinct from other states',
      ],
    },
    {
      name: 'warning',
      label: 'Warning',
      options: suggestions.warning,
      placeholders: [
        'catches attention appropriately',
        'signals caution without alarm',
        'visible on light and dark backgrounds',
      ],
    },
    {
      name: 'info',
      label: 'Info',
      options: suggestions.info,
      placeholders: [
        'neutral information indicator',
        'not too attention-grabbing',
        'clearly distinct from success',
      ],
    },
  ];
}

export function SemanticChoices({ primaryColor, onComplete }: SemanticChoicesProps) {
  const [choices, setChoices] = useState<SemanticColorChoices>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [customPickerFor, setCustomPickerFor] = useState<string | null>(null);
  const [customPickerAnchor, setCustomPickerAnchor] = useState({ x: 0, y: 0 });

  const definitions = useMemo(() => generateSemanticDefinitions(primaryColor), [primaryColor]);
  const totalCount = definitions.length;
  const completedCount = Object.keys(choices).length;
  const isComplete = completedCount === totalCount;

  const handleSelect = useCallback(
    (name: string, color: OKLCH, reason: string) => {
      setChoices((prev) => ({
        ...prev,
        [name]: { color, reason },
      }));
      // Auto-advance to next uncompleted
      if (currentIndex < totalCount - 1) {
        setCurrentIndex((prev) => prev + 1);
      }
    },
    [currentIndex, totalCount],
  );

  const handleCustom = useCallback((name: string, event: React.MouseEvent) => {
    setCustomPickerFor(name);
    setCustomPickerAnchor({ x: event.clientX, y: event.clientY });
  }, []);

  const handleCustomConfirm = useCallback(
    (color: { h: number; s: number; l: number }, reason: string) => {
      if (customPickerFor) {
        const oklch: OKLCH = { l: color.l, c: color.s, h: color.h, alpha: 1 };
        handleSelect(customPickerFor, oklch, reason);
      }
      setCustomPickerFor(null);
    },
    [customPickerFor, handleSelect],
  );

  const handleCustomCancel = useCallback(() => {
    setCustomPickerFor(null);
  }, []);

  const handleComplete = useCallback(() => {
    if (isComplete) {
      onComplete(choices);
    }
  }, [isComplete, choices, onComplete]);

  // Show custom color picker
  if (customPickerFor) {
    const def = definitions.find((d) => d.name === customPickerFor);
    const defaultColor = def?.options[0] ?? { l: 0.5, c: 0.15, h: 180, alpha: 1 };
    return (
      <ColorPicker
        color={{ h: defaultColor.h, s: defaultColor.c, l: defaultColor.l }}
        anchorPosition={customPickerAnchor}
        onConfirm={handleCustomConfirm}
        onCancel={handleCustomCancel}
      />
    );
  }

  const currentDef = definitions[currentIndex];

  return (
    <Container
      as="main"
      size="full"
      padding="6"
      className={classy(
        'min-h-screen',
        'bg-background',
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
      )}
    >
      {/* Progress indicator */}
      <div className={classy('mb-8', 'text-center')}>
        <P className={classy('text-lg', 'font-medium', 'text-foreground')}>
          Choose Your Semantic Colors
        </P>
        <Muted>
          {completedCount} of {totalCount} complete
        </Muted>
        {/* Progress bar */}
        <div
          className={classy('mt-3', 'w-64', 'h-2', 'bg-muted', 'rounded-full', 'overflow-hidden')}
        >
          <div
            className={classy('h-full', 'bg-primary', 'transition-all', 'duration-300')}
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Primary color reference */}
      <div className={classy('mb-6', 'flex', 'items-center', 'gap-3')}>
        <div
          className={classy('h-8', 'w-8', 'rounded-md', 'shadow-sm', 'border', 'border-border')}
          style={{ backgroundColor: oklchToHex(primaryColor) }}
          role="img"
          aria-label={`Primary color: ${oklchToHex(primaryColor)}`}
        />
        <Muted className={classy('text-sm')}>Your primary color</Muted>
      </div>

      {/* Color choice navigation */}
      <div className={classy('mb-4', 'flex', 'flex-wrap', 'justify-center', 'gap-2')}>
        {definitions.map((def, index) => {
          const isCompleted = choices[def.name] !== undefined;
          const isCurrent = index === currentIndex;
          return (
            <button
              key={def.name}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={classy(
                'px-3',
                'py-1',
                'text-sm',
                'rounded-full',
                'transition-all',
                isCurrent ? 'bg-primary' : isCompleted ? 'bg-muted' : 'bg-background',
                isCurrent ? 'text-primary-foreground' : 'text-muted-foreground',
                'border',
                isCurrent ? 'border-primary' : 'border-border',
                'hover:border-primary',
              )}
            >
              {def.label}
              {isCompleted && ' \u2713'}
            </button>
          );
        })}
      </div>

      {/* Current semantic choice */}
      <div className={classy('w-full', 'max-w-sm')}>
        <SemanticChoice
          key={currentDef.name}
          name={currentDef.name}
          label={currentDef.label}
          options={currentDef.options}
          onSelect={(color, reason) => handleSelect(currentDef.name, color, reason)}
          onCustom={(e) => handleCustom(currentDef.name, e)}
          placeholders={currentDef.placeholders}
        />
      </div>

      {/* Completion button */}
      {isComplete && (
        <div className={classy('mt-8')}>
          <Button size="lg" onClick={handleComplete}>
            Complete First Run
          </Button>
        </div>
      )}

      {/* Completed choices summary */}
      {completedCount > 0 && (
        <Card className={classy('mt-8', 'w-full', 'max-w-md')}>
          <CardHeader className={classy('pb-2')}>
            <CardTitle className={classy('text-sm')}>Your Choices</CardTitle>
          </CardHeader>
          <CardContent>
            <Grid preset="linear" columns={5} gap="2">
              {Object.entries(choices).map(([name, { color }]) => (
                <Grid.Item key={name}>
                  <div
                    className={classy(
                      'h-8',
                      'w-8',
                      'rounded-md',
                      'shadow-sm',
                      'border',
                      'border-border',
                    )}
                    style={{ backgroundColor: oklchToHex(color) }}
                    title={name}
                    role="img"
                    aria-label={`${name}: ${oklchToHex(color)}`}
                  />
                </Grid.Item>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
