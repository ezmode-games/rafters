import { render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Chrome } from '../../src/index';
import { resetPanelRevealState } from '../../src/primitives/panel-reveal';

afterEach(() => {
  resetPanelRevealState();
});

describe('Chrome a11y', () => {
  it('has no accessibility violations with rail items', async () => {
    const { container } = render(
      <Chrome
        rail={[
          {
            id: 'nav',
            icon: <span>N</span>,
            label: 'Navigation',
            panel: <div>Nav panel</div>,
          },
          {
            id: 'layers',
            icon: <span>L</span>,
            label: 'Layers',
            panel: <div>Layers panel</div>,
          },
        ]}
      >
        <div>Canvas content</div>
      </Chrome>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations with empty rail', async () => {
    const { container } = render(
      <Chrome rail={[]}>
        <div>Canvas content</div>
      </Chrome>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations with settings panel', async () => {
    const { container } = render(
      <Chrome
        rail={[
          {
            id: 'nav',
            icon: <span>N</span>,
            label: 'Navigation',
            panel: <div>Nav panel</div>,
          },
        ]}
        settings={<div>Settings content</div>}
      >
        <div>Canvas content</div>
      </Chrome>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations in collapsed state', async () => {
    const { container } = render(
      <Chrome
        rail={[
          {
            id: 'nav',
            icon: <span>N</span>,
            label: 'Navigation',
            panel: <div>Nav panel</div>,
          },
        ]}
        defaultCollapsed
      >
        <div>Canvas content</div>
      </Chrome>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations in RTL mode', async () => {
    const { container } = render(
      <Chrome
        rail={[
          {
            id: 'nav',
            icon: <span>N</span>,
            label: 'Navigation',
            panel: <div>Nav panel</div>,
          },
        ]}
        dir="rtl"
      >
        <div>Canvas content</div>
      </Chrome>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
