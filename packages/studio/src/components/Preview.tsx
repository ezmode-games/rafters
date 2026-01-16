/**
 * Live Preview Component
 *
 * Shows tokens in context using sample UI components.
 * Designers see how colors look on real buttons, cards, and forms.
 */

import type { Token } from '../api/token-loader';
import { getTokenCssValue } from '../utils/token-display';

interface PreviewProps {
  tokens: Record<string, Token[]>;
  highlightedToken: string | null;
}

/**
 * Generate CSS custom properties from tokens
 */
function generateCssVariables(tokens: Record<string, Token[]>): Record<string, string> {
  const vars: Record<string, string> = {};

  for (const [namespace, namespaceTokens] of Object.entries(tokens)) {
    for (const token of namespaceTokens) {
      // Create CSS variable name: color.primary-500 → --color-primary-500
      const varName = `--${namespace}-${token.name}`;
      vars[varName] = getTokenCssValue(token);
    }
  }

  return vars;
}

export function Preview({ tokens, highlightedToken }: PreviewProps) {
  const cssVars = generateCssVariables(tokens);

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-6" style={cssVars}>
      <h3 className="mb-4 text-sm font-medium text-neutral-500">Live Preview</h3>

      <div className="space-y-6">
        {/* Button Preview */}
        <PreviewSection title="Buttons" highlightedToken={highlightedToken}>
          <div className="flex flex-wrap gap-3">
            <PreviewButton
              variant="primary"
              highlightedToken={highlightedToken}
              tokenNames={['primary-500', 'primary-600', 'neutral-50']}
            >
              Primary
            </PreviewButton>
            <PreviewButton
              variant="secondary"
              highlightedToken={highlightedToken}
              tokenNames={['neutral-200', 'neutral-300', 'neutral-900']}
            >
              Secondary
            </PreviewButton>
            <PreviewButton
              variant="destructive"
              highlightedToken={highlightedToken}
              tokenNames={['red-500', 'red-600', 'neutral-50']}
            >
              Destructive
            </PreviewButton>
          </div>
        </PreviewSection>

        {/* Card Preview */}
        <PreviewSection title="Cards" highlightedToken={highlightedToken}>
          <div
            className={`rounded-lg border p-4 ${isHighlighted(['neutral-50', 'neutral-200'], highlightedToken) ? 'ring-2 ring-blue-500' : ''}`}
            style={{
              backgroundColor: 'var(--color-neutral-50, #fafafa)',
              borderColor: 'var(--color-neutral-200, #e5e5e5)',
            }}
          >
            <h4 className="font-medium" style={{ color: 'var(--color-neutral-900, #0a0a0a)' }}>
              Card Title
            </h4>
            <p className="mt-1 text-sm" style={{ color: 'var(--color-neutral-500, #737373)' }}>
              This is a sample card showing how neutral colors work together.
            </p>
          </div>
        </PreviewSection>

        {/* Typography Preview */}
        <PreviewSection title="Typography" highlightedToken={highlightedToken}>
          <div className="space-y-2">
            <h4
              className={`text-lg font-semibold ${isHighlighted(['neutral-900'], highlightedToken) ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
              style={{ color: 'var(--color-neutral-900, #0a0a0a)' }}
            >
              Heading Text
            </h4>
            <p
              className={`${isHighlighted(['neutral-700'], highlightedToken) ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
              style={{ color: 'var(--color-neutral-700, #404040)' }}
            >
              Body text uses a slightly lighter shade for comfortable reading.
            </p>
            <p
              className={`text-sm ${isHighlighted(['neutral-500'], highlightedToken) ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
              style={{ color: 'var(--color-neutral-500, #737373)' }}
            >
              Muted text for secondary information.
            </p>
          </div>
        </PreviewSection>

        {/* Form Preview */}
        <PreviewSection title="Form Elements" highlightedToken={highlightedToken}>
          <div className="space-y-3">
            <div>
              <label
                htmlFor="preview-input"
                className="mb-1 block text-sm font-medium"
                style={{ color: 'var(--color-neutral-700, #404040)' }}
              >
                Input Field
              </label>
              <input
                id="preview-input"
                type="text"
                placeholder="Enter text..."
                className={`w-full rounded-md border px-3 py-2 text-sm ${isHighlighted(['neutral-300', 'neutral-200'], highlightedToken) ? 'ring-2 ring-blue-500' : ''}`}
                style={{
                  borderColor: 'var(--color-neutral-300, #d4d4d4)',
                  backgroundColor: 'var(--color-neutral-50, #fafafa)',
                }}
              />
            </div>
            <div>
              <label
                htmlFor="preview-focus"
                className="mb-1 block text-sm font-medium"
                style={{ color: 'var(--color-neutral-700, #404040)' }}
              >
                Focus State
              </label>
              <input
                id="preview-focus"
                type="text"
                placeholder="Focused input"
                className={`w-full rounded-md border px-3 py-2 text-sm ring-2 ${isHighlighted(['primary-500'], highlightedToken) ? 'ring-blue-500' : ''}`}
                style={{
                  borderColor: 'var(--color-primary-500, #3b82f6)',
                  outlineColor: 'var(--color-primary-500, #3b82f6)',
                }}
              />
            </div>
          </div>
        </PreviewSection>
      </div>
    </div>
  );
}

function PreviewSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
  highlightedToken: string | null;
}) {
  return (
    <div>
      <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-neutral-400">
        {title}
      </h4>
      {children}
    </div>
  );
}

function PreviewButton({
  variant,
  children,
  highlightedToken,
  tokenNames,
}: {
  variant: 'primary' | 'secondary' | 'destructive';
  children: React.ReactNode;
  highlightedToken: string | null;
  tokenNames: string[];
}) {
  const isActive = isHighlighted(tokenNames, highlightedToken);

  const styles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: 'var(--color-primary-500, #3b82f6)',
      color: 'var(--color-neutral-50, #fafafa)',
    },
    secondary: {
      backgroundColor: 'var(--color-neutral-200, #e5e5e5)',
      color: 'var(--color-neutral-900, #0a0a0a)',
    },
    destructive: {
      backgroundColor: 'var(--color-red-500, #ef4444)',
      color: 'var(--color-neutral-50, #fafafa)',
    },
  };

  return (
    <button
      type="button"
      className={`rounded-md px-4 py-2 text-sm font-medium transition-transform ${isActive ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
      style={styles[variant]}
    >
      {children}
    </button>
  );
}

/**
 * Check if any of the token names match the highlighted token
 */
function isHighlighted(tokenNames: string[], highlightedToken: string | null): boolean {
  if (!highlightedToken) return false;
  return tokenNames.some((name) => highlightedToken.includes(name));
}
