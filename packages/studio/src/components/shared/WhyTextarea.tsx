/**
 * Why Textarea
 *
 * Textarea with cycling placeholder text.
 * Rotates every ~3 seconds between general prompts and color intelligence.
 */

import { useEffect, useRef, useState } from 'react';

const GENERAL_PROMPTS = [
  'What does this color mean to your brand?',
  'What feeling should someone get?',
  'Is this color from your logo? Your history?',
  'What is the emotional weight of this choice?',
  'Where will people see this color most?',
  'Does this color have a cultural meaning for your audience?',
  'What memory does this color trigger?',
  'Is this a loud color or a quiet one?',
  'Would your grandmother recognize your brand by this color?',
  'What would be lost if this were slightly different?',
  'Is this color aspirational or grounded?',
  'Does this color work in a hospital? A nightclub? Both?',
  'What is this color afraid of?',
  'If your brand had a temperature, would this color match?',
  'What season does this color belong to?',
  'Is this a color of authority or approachability?',
  'Would this color survive a decade?',
  'What does this color sound like?',
  'Is this the color of the problem or the solution?',
  'Would you paint a wall this color? A car?',
  'What would your competitor think of this choice?',
  'Is this color for the brand you are or the brand you want to be?',
  'Does this color need the others, or does it stand alone?',
  'Why not the color right next to it?',
];

interface WhyTextareaProps {
  value: string;
  onChange: (value: string) => void;
  intelligenceHints?: string[];
  context?: string;
}

export function WhyTextarea({
  value,
  onChange,
  intelligenceHints = [],
  context,
}: WhyTextareaProps) {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Combine general prompts with intelligence hints
  const allPrompts = [...GENERAL_PROMPTS];
  if (intelligenceHints.length > 0) {
    // Intersperse: every 3rd prompt is an intelligence hint
    for (let i = 0; i < intelligenceHints.length; i++) {
      const insertAt = (i + 1) * 3;
      if (insertAt < allPrompts.length) {
        allPrompts.splice(insertAt, 0, intelligenceHints[i]);
      } else {
        allPrompts.push(intelligenceHints[i]);
      }
    }
  }

  // Cycle placeholder every 3 seconds
  useEffect(() => {
    if (value.length > 0) return; // Don't cycle when user is typing

    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % allPrompts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [value, allPrompts.length]);

  return (
    <div className="w-full">
      {context && (
        <label htmlFor="why-textarea" className="mb-2 block text-sm text-neutral-400">
          Why this color{context !== 'primary' ? ` for ${context}` : ''}?
        </label>
      )}
      <textarea
        id="why-textarea"
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={allPrompts[placeholderIndex % allPrompts.length]}
        rows={3}
        className={[
          'w-full resize-none rounded-lg p-4',
          'border border-neutral-200 bg-white',
          'text-neutral-900 text-sm',
          'placeholder:text-neutral-300',
          'focus:border-neutral-400 focus:outline-none',
          'transition-colors',
        ].join(' ')}
      />
    </div>
  );
}
