import { Button } from '@rafters/ui/components/ui/button';
import { Container } from '@rafters/ui/components/ui/container';
import { P, Small } from '@rafters/ui/components/ui/typography';
import { useEffect, useState } from 'react';
import { onCssUpdated, setToken } from './api';

const ACCENT_VARIANTS = [
  'accent',
  'accent-foreground',
  'accent-hover',
  'accent-hover-foreground',
  'accent-active',
  'accent-active-foreground',
  'accent-border',
  'accent-ring',
] as const;

const HIGHLIGHT_VARIANTS = [
  'highlight',
  'highlight-foreground',
  'highlight-hover',
  'highlight-hover-foreground',
  'highlight-active',
  'highlight-active-foreground',
] as const;

const REFERENCE_TOKENS = ['background', 'foreground', 'primary', 'primary-foreground'] as const;

type Status =
  | { kind: 'idle' }
  | { kind: 'pending' }
  | { kind: 'ok'; at: number }
  | { kind: 'error'; message: string };

function Swatch({ name, version }: { name: string; version: number }) {
  const [resolved, setResolved] = useState('');

  useEffect(() => {
    const root = document.documentElement;
    const value = getComputedStyle(root).getPropertyValue(`--rafters-${name}`).trim();
    setResolved(value);
  }, [name, version]);

  return (
    <div className="flex flex-col gap-1">
      <div
        role="img"
        aria-label={`${name} swatch`}
        className="h-12 w-full rounded border border-border"
        style={{ background: `var(--rafters-${name})` }}
      />
      <Small className="font-mono">{name}</Small>
      <Small color="muted" className="font-mono text-[10px]">
        {resolved || '(unresolved)'}
      </Small>
    </div>
  );
}

export default function App() {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    return onCssUpdated(() => setVersion((v) => v + 1));
  }, []);

  async function applyEaster() {
    setStatus({ kind: 'pending' });
    const accent = await setToken({
      name: 'accent',
      value: { family: 'silver-true-honey', position: '500' },
    });
    if (!accent.ok) {
      setStatus({ kind: 'error', message: `accent: ${accent.error}` });
      return;
    }
    const highlight = await setToken({
      name: 'highlight',
      value: { family: 'silver-true-sky', position: '200' },
    });
    if (!highlight.ok) {
      setStatus({ kind: 'error', message: `highlight: ${highlight.error}` });
      return;
    }
    setStatus({ kind: 'ok', at: Date.now() });
  }

  return (
    <Container as="main" className="flex min-h-svh flex-col gap-6" padding="6">
      <header className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <P className="font-medium">Cascade verification</P>
          <Small color="muted">
            One setToken per family. The full -hover/-active/-foreground/-border/-ring variant
            fan-out should update in place.
          </Small>
        </div>
        <div className="flex items-center gap-3">
          <StatusPill status={status} />
          <Button onClick={applyEaster} disabled={status.kind === 'pending'}>
            Apply Easter palette
          </Button>
        </div>
      </header>

      <Section title="Accent (-> silver-true-honey)" tokens={ACCENT_VARIANTS} version={version} />
      <Section
        title="Highlight (-> silver-true-sky)"
        tokens={HIGHLIGHT_VARIANTS}
        version={version}
      />
      <Section title="Reference (should not change)" tokens={REFERENCE_TOKENS} version={version} />
    </Container>
  );
}

function Section({
  title,
  tokens,
  version,
}: {
  title: string;
  tokens: readonly string[];
  version: number;
}) {
  return (
    <section className="flex flex-col gap-3">
      <Small className="font-medium">{title}</Small>
      <div className="grid grid-cols-4 gap-3 md:grid-cols-6 lg:grid-cols-8">
        {tokens.map((name) => (
          <Swatch key={name} name={name} version={version} />
        ))}
      </div>
    </section>
  );
}

function StatusPill({ status }: { status: Status }) {
  if (status.kind === 'idle') return null;
  if (status.kind === 'pending') return <Small color="muted">applying...</Small>;
  if (status.kind === 'ok') {
    return <Small color="muted">applied at {new Date(status.at).toLocaleTimeString()}</Small>;
  }
  return <Small className="text-destructive">{status.message}</Small>;
}
