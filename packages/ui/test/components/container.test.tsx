import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Container } from '../../src/components/ui/container';

describe('Container', () => {
  describe('gap prop', () => {
    it('applies flex flex-col and gap class when gap is set', () => {
      const { container } = render(<Container gap="6">content</Container>);
      const el = container.firstElementChild!;
      expect(el.className).toContain('flex');
      expect(el.className).toContain('flex-col');
      expect(el.className).toContain('gap-6');
    });

    it('does not apply flex or gap classes when gap is not set', () => {
      const { container } = render(<Container>content</Container>);
      const el = container.firstElementChild!;
      expect(el.className).not.toContain('flex-col');
      expect(el.className).not.toContain('gap-');
    });

    it('works with gap="0"', () => {
      const { container } = render(<Container gap="0">content</Container>);
      const el = container.firstElementChild!;
      expect(el.className).toContain('flex');
      expect(el.className).toContain('flex-col');
      expect(el.className).toContain('gap-0');
    });

    it('combines with padding', () => {
      const { container } = render(
        <Container padding="4" gap="6">
          content
        </Container>,
      );
      const el = container.firstElementChild!;
      expect(el.className).toContain('p-4');
      expect(el.className).toContain('gap-6');
    });

    it('combines with size', () => {
      const { container } = render(
        <Container size="sm" gap="8">
          content
        </Container>,
      );
      const el = container.firstElementChild!;
      expect(el.className).toContain('max-w-sm');
      expect(el.className).toContain('gap-8');
    });

    it('combines with className', () => {
      const { container } = render(
        <Container gap="4" className="custom-class">
          content
        </Container>,
      );
      const el = container.firstElementChild!;
      expect(el.className).toContain('gap-4');
      expect(el.className).toContain('custom-class');
    });
  });
});
