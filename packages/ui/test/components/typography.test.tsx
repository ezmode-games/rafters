import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  Blockquote,
  Code,
  H1,
  H2,
  H3,
  H4,
  htmlToInlineContent,
  inlineContentToHtml,
  Large,
  Lead,
  Muted,
  P,
  Small,
  typographyClasses,
} from '../../src/components/ui/typography';
import type { InlineContent } from '../../src/primitives/types';

describe('H1', () => {
  it('renders as h1 by default', () => {
    render(<H1 data-testid="h1">Heading 1</H1>);
    const heading = screen.getByTestId('h1');
    expect(heading.tagName).toBe('H1');
  });

  it('applies correct styles', () => {
    const { container } = render(<H1>Heading</H1>);
    const h1 = container.firstChild;
    expect(h1).toHaveClass('text-4xl');
    expect(h1).toHaveClass('font-bold');
    expect(h1).toHaveClass('tracking-tight');
    expect(h1).toHaveClass('scroll-m-20');
    expect(h1).toHaveClass('lg:text-5xl');
    expect(h1).toHaveClass('text-foreground');
  });

  it('renders as custom element via as prop', () => {
    render(
      <H1 as="span" data-testid="h1">
        Styled as H1
      </H1>,
    );
    const element = screen.getByTestId('h1');
    expect(element.tagName).toBe('SPAN');
  });

  it('merges custom className', () => {
    const { container } = render(<H1 className="custom-class">Heading</H1>);
    expect(container.firstChild).toHaveClass('custom-class');
    expect(container.firstChild).toHaveClass('text-4xl');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLHeadingElement>();
    render(<H1 ref={ref}>Heading</H1>);
    expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
  });

  it('passes through HTML attributes', () => {
    render(
      <H1 data-testid="h1" id="main-title">
        Title
      </H1>,
    );
    expect(screen.getByTestId('h1')).toHaveAttribute('id', 'main-title');
  });
});

describe('H2', () => {
  it('renders as h2 by default', () => {
    render(<H2 data-testid="h2">Heading 2</H2>);
    const heading = screen.getByTestId('h2');
    expect(heading.tagName).toBe('H2');
  });

  it('applies correct styles', () => {
    const { container } = render(<H2>Heading</H2>);
    const h2 = container.firstChild;
    expect(h2).toHaveClass('text-3xl');
    expect(h2).toHaveClass('font-semibold');
    expect(h2).toHaveClass('tracking-tight');
    expect(h2).toHaveClass('scroll-m-20');
    expect(h2).toHaveClass('text-foreground');
  });

  it('renders as custom element via as prop', () => {
    render(
      <H2 as="div" data-testid="h2">
        Styled as H2
      </H2>,
    );
    const element = screen.getByTestId('h2');
    expect(element.tagName).toBe('DIV');
  });

  it('merges custom className', () => {
    const { container } = render(<H2 className="custom-class">Heading</H2>);
    expect(container.firstChild).toHaveClass('custom-class');
    expect(container.firstChild).toHaveClass('text-3xl');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLHeadingElement>();
    render(<H2 ref={ref}>Heading</H2>);
    expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
  });
});

describe('H3', () => {
  it('renders as h3 by default', () => {
    render(<H3 data-testid="h3">Heading 3</H3>);
    const heading = screen.getByTestId('h3');
    expect(heading.tagName).toBe('H3');
  });

  it('applies correct styles', () => {
    const { container } = render(<H3>Heading</H3>);
    const h3 = container.firstChild;
    expect(h3).toHaveClass('text-2xl');
    expect(h3).toHaveClass('font-semibold');
    expect(h3).toHaveClass('tracking-tight');
    expect(h3).toHaveClass('scroll-m-20');
    expect(h3).toHaveClass('text-foreground');
  });

  it('renders as custom element via as prop', () => {
    render(
      <H3 as="span" data-testid="h3">
        Styled as H3
      </H3>,
    );
    const element = screen.getByTestId('h3');
    expect(element.tagName).toBe('SPAN');
  });

  it('merges custom className', () => {
    const { container } = render(<H3 className="custom-class">Heading</H3>);
    expect(container.firstChild).toHaveClass('custom-class');
    expect(container.firstChild).toHaveClass('text-2xl');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLHeadingElement>();
    render(<H3 ref={ref}>Heading</H3>);
    expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
  });
});

describe('H4', () => {
  it('renders as h4 by default', () => {
    render(<H4 data-testid="h4">Heading 4</H4>);
    const heading = screen.getByTestId('h4');
    expect(heading.tagName).toBe('H4');
  });

  it('applies correct styles', () => {
    const { container } = render(<H4>Heading</H4>);
    const h4 = container.firstChild;
    expect(h4).toHaveClass('text-xl');
    expect(h4).toHaveClass('font-semibold');
    expect(h4).toHaveClass('tracking-tight');
    expect(h4).toHaveClass('scroll-m-20');
    expect(h4).toHaveClass('text-foreground');
  });

  it('renders as custom element via as prop', () => {
    render(
      <H4 as="div" data-testid="h4">
        Styled as H4
      </H4>,
    );
    const element = screen.getByTestId('h4');
    expect(element.tagName).toBe('DIV');
  });

  it('merges custom className', () => {
    const { container } = render(<H4 className="custom-class">Heading</H4>);
    expect(container.firstChild).toHaveClass('custom-class');
    expect(container.firstChild).toHaveClass('text-xl');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLHeadingElement>();
    render(<H4 ref={ref}>Heading</H4>);
    expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
  });
});

describe('P', () => {
  it('renders as p by default', () => {
    render(<P data-testid="p">Paragraph text</P>);
    const para = screen.getByTestId('p');
    expect(para.tagName).toBe('P');
  });

  it('applies correct styles', () => {
    const { container } = render(<P>Paragraph</P>);
    const p = container.firstChild;
    expect(p).toHaveClass('leading-7');
    expect(p).toHaveClass('text-foreground');
  });

  it('renders as custom element via as prop', () => {
    render(
      <P as="span" data-testid="p">
        Styled as P
      </P>,
    );
    const element = screen.getByTestId('p');
    expect(element.tagName).toBe('SPAN');
  });

  it('merges custom className', () => {
    const { container } = render(<P className="custom-class">Paragraph</P>);
    expect(container.firstChild).toHaveClass('custom-class');
    expect(container.firstChild).toHaveClass('leading-7');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLParagraphElement>();
    render(<P ref={ref}>Paragraph</P>);
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
  });
});

describe('Lead', () => {
  it('renders as p by default', () => {
    render(<Lead data-testid="lead">Lead paragraph</Lead>);
    const lead = screen.getByTestId('lead');
    expect(lead.tagName).toBe('P');
  });

  it('applies correct styles', () => {
    const { container } = render(<Lead>Lead</Lead>);
    const lead = container.firstChild;
    expect(lead).toHaveClass('text-xl');
    expect(lead).toHaveClass('text-muted-foreground');
  });

  it('renders as custom element via as prop', () => {
    render(
      <Lead as="div" data-testid="lead">
        Styled as Lead
      </Lead>,
    );
    const element = screen.getByTestId('lead');
    expect(element.tagName).toBe('DIV');
  });

  it('merges custom className', () => {
    const { container } = render(<Lead className="custom-class">Lead</Lead>);
    expect(container.firstChild).toHaveClass('custom-class');
    expect(container.firstChild).toHaveClass('text-xl');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLParagraphElement>();
    render(<Lead ref={ref}>Lead</Lead>);
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
  });
});

describe('Large', () => {
  it('renders as div by default', () => {
    render(<Large data-testid="large">Large text</Large>);
    const large = screen.getByTestId('large');
    expect(large.tagName).toBe('DIV');
  });

  it('applies correct styles', () => {
    const { container } = render(<Large>Large</Large>);
    const large = container.firstChild;
    expect(large).toHaveClass('text-lg');
    expect(large).toHaveClass('font-semibold');
    expect(large).toHaveClass('text-foreground');
  });

  it('renders as custom element via as prop', () => {
    render(
      <Large as="span" data-testid="large">
        Styled as Large
      </Large>,
    );
    const element = screen.getByTestId('large');
    expect(element.tagName).toBe('SPAN');
  });

  it('merges custom className', () => {
    const { container } = render(<Large className="custom-class">Large</Large>);
    expect(container.firstChild).toHaveClass('custom-class');
    expect(container.firstChild).toHaveClass('text-lg');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Large ref={ref}>Large</Large>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('Small', () => {
  it('renders as small by default', () => {
    render(<Small data-testid="small">Small text</Small>);
    const small = screen.getByTestId('small');
    expect(small.tagName).toBe('SMALL');
  });

  it('applies correct styles', () => {
    const { container } = render(<Small>Small</Small>);
    const small = container.firstChild;
    expect(small).toHaveClass('text-sm');
    expect(small).toHaveClass('font-medium');
    expect(small).toHaveClass('leading-none');
    expect(small).toHaveClass('text-foreground');
  });

  it('renders as custom element via as prop', () => {
    render(
      <Small as="span" data-testid="small">
        Styled as Small
      </Small>,
    );
    const element = screen.getByTestId('small');
    expect(element.tagName).toBe('SPAN');
  });

  it('merges custom className', () => {
    const { container } = render(<Small className="custom-class">Small</Small>);
    expect(container.firstChild).toHaveClass('custom-class');
    expect(container.firstChild).toHaveClass('text-sm');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLElement>();
    render(<Small ref={ref}>Small</Small>);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});

describe('Muted', () => {
  it('renders as p by default', () => {
    render(<Muted data-testid="muted">Muted text</Muted>);
    const muted = screen.getByTestId('muted');
    expect(muted.tagName).toBe('P');
  });

  it('applies correct styles', () => {
    const { container } = render(<Muted>Muted</Muted>);
    const muted = container.firstChild;
    expect(muted).toHaveClass('text-sm');
    expect(muted).toHaveClass('text-muted-foreground');
  });

  it('renders as custom element via as prop', () => {
    render(
      <Muted as="span" data-testid="muted">
        Styled as Muted
      </Muted>,
    );
    const element = screen.getByTestId('muted');
    expect(element.tagName).toBe('SPAN');
  });

  it('merges custom className', () => {
    const { container } = render(<Muted className="custom-class">Muted</Muted>);
    expect(container.firstChild).toHaveClass('custom-class');
    expect(container.firstChild).toHaveClass('text-sm');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLParagraphElement>();
    render(<Muted ref={ref}>Muted</Muted>);
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
  });
});

describe('Code', () => {
  it('renders as code by default', () => {
    render(<Code data-testid="code">const x = 1</Code>);
    const code = screen.getByTestId('code');
    expect(code.tagName).toBe('CODE');
  });

  it('applies correct styles', () => {
    const { container } = render(<Code>code</Code>);
    const code = container.firstChild;
    expect(code).toHaveClass('rounded');
    expect(code).toHaveClass('bg-muted');
    expect(code).toHaveClass('px-1');
    expect(code).toHaveClass('py-0.5');
    expect(code).toHaveClass('font-mono');
    expect(code).toHaveClass('text-sm');
    expect(code).toHaveClass('text-foreground');
  });

  it('renders as custom element via as prop', () => {
    render(
      <Code as="span" data-testid="code">
        Styled as Code
      </Code>,
    );
    const element = screen.getByTestId('code');
    expect(element.tagName).toBe('SPAN');
  });

  it('merges custom className', () => {
    const { container } = render(<Code className="custom-class">code</Code>);
    expect(container.firstChild).toHaveClass('custom-class');
    expect(container.firstChild).toHaveClass('font-mono');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLElement>();
    render(<Code ref={ref}>code</Code>);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});

describe('Blockquote', () => {
  it('renders as blockquote by default', () => {
    render(<Blockquote data-testid="quote">Quote text</Blockquote>);
    const quote = screen.getByTestId('quote');
    expect(quote.tagName).toBe('BLOCKQUOTE');
  });

  it('applies correct styles', () => {
    const { container } = render(<Blockquote>Quote</Blockquote>);
    const quote = container.firstChild;
    expect(quote).toHaveClass('mt-6');
    expect(quote).toHaveClass('border-l-2');
    expect(quote).toHaveClass('border-border');
    expect(quote).toHaveClass('pl-6');
    expect(quote).toHaveClass('italic');
    expect(quote).toHaveClass('text-foreground');
  });

  it('renders as custom element via as prop', () => {
    render(
      <Blockquote as="div" data-testid="quote">
        Styled as Blockquote
      </Blockquote>,
    );
    const element = screen.getByTestId('quote');
    expect(element.tagName).toBe('DIV');
  });

  it('merges custom className', () => {
    const { container } = render(<Blockquote className="custom-class">Quote</Blockquote>);
    expect(container.firstChild).toHaveClass('custom-class');
    expect(container.firstChild).toHaveClass('italic');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLQuoteElement>();
    render(<Blockquote ref={ref}>Quote</Blockquote>);
    expect(ref.current).toBeInstanceOf(HTMLQuoteElement);
  });
});

describe('typographyClasses', () => {
  it('exports all typography class strings', () => {
    expect(typographyClasses).toHaveProperty('h1');
    expect(typographyClasses).toHaveProperty('h2');
    expect(typographyClasses).toHaveProperty('h3');
    expect(typographyClasses).toHaveProperty('h4');
    expect(typographyClasses).toHaveProperty('p');
    expect(typographyClasses).toHaveProperty('lead');
    expect(typographyClasses).toHaveProperty('large');
    expect(typographyClasses).toHaveProperty('small');
    expect(typographyClasses).toHaveProperty('muted');
    expect(typographyClasses).toHaveProperty('code');
    expect(typographyClasses).toHaveProperty('blockquote');
  });

  it('h1 class includes expected values', () => {
    expect(typographyClasses.h1).toContain('text-4xl');
    expect(typographyClasses.h1).toContain('font-bold');
  });

  it('code class includes font-mono', () => {
    expect(typographyClasses.code).toContain('font-mono');
  });
});

describe('Typography composition', () => {
  it('renders a complete page structure', () => {
    render(
      <article>
        <H1 data-testid="h1">Page Title</H1>
        <Lead data-testid="lead">Introduction paragraph.</Lead>
        <H2 data-testid="h2">Section Title</H2>
        <P data-testid="p">Body paragraph with standard styling.</P>
        <H3 data-testid="h3">Subsection</H3>
        <P>
          Use the <Code data-testid="code">useState</Code> hook.
        </P>
        <Blockquote data-testid="quote">Design is how it works.</Blockquote>
        <Muted data-testid="muted">Last updated: Jan 2025</Muted>
      </article>,
    );

    expect(screen.getByTestId('h1')).toHaveTextContent('Page Title');
    expect(screen.getByTestId('lead')).toHaveTextContent('Introduction paragraph.');
    expect(screen.getByTestId('h2')).toHaveTextContent('Section Title');
    expect(screen.getByTestId('p')).toHaveTextContent('Body paragraph with standard styling.');
    expect(screen.getByTestId('h3')).toHaveTextContent('Subsection');
    expect(screen.getByTestId('code')).toHaveTextContent('useState');
    expect(screen.getByTestId('quote')).toHaveTextContent('Design is how it works.');
    expect(screen.getByTestId('muted')).toHaveTextContent('Last updated: Jan 2025');
  });
});

// ============================================================================
// R-200a: Editable Heading Tests
// ============================================================================

describe('Editable Heading (R-200a)', () => {
  describe('H1 editable mode', () => {
    it('should enable contenteditable when editable is true', () => {
      render(
        <H1 editable data-testid="h1">
          Editable Title
        </H1>,
      );
      const heading = screen.getByTestId('h1');
      expect(heading).toHaveAttribute('contenteditable', 'true');
    });

    it('should not be contenteditable when editable is false', () => {
      render(<H1 data-testid="h1">Static Title</H1>);
      const heading = screen.getByTestId('h1');
      expect(heading).not.toHaveAttribute('contenteditable');
    });

    it('should call onChange on content change', () => {
      const onChange = vi.fn();
      render(
        <H1 editable onChange={onChange} data-testid="h1">
          Title
        </H1>,
      );
      const heading = screen.getByTestId('h1');

      // Simulate typing
      heading.textContent = 'New Title';
      fireEvent.input(heading);

      expect(onChange).toHaveBeenCalledWith('New Title');
    });

    it('should show placeholder via data attribute when empty', () => {
      render(
        <H1 editable placeholder="Enter title..." data-testid="h1">
          {''}
        </H1>,
      );
      const heading = screen.getByTestId('h1');
      expect(heading).toHaveAttribute('data-placeholder', 'Enter title...');
      expect(heading).toHaveAttribute('aria-placeholder', 'Enter title...');
    });

    it('should call onEnter when Enter key is pressed', () => {
      const onEnter = vi.fn();
      render(
        <H1 editable onEnter={onEnter} data-testid="h1">
          Title
        </H1>,
      );
      const heading = screen.getByTestId('h1');

      fireEvent.keyDown(heading, { key: 'Enter' });

      expect(onEnter).toHaveBeenCalled();
    });

    it('should prevent default on Enter key', () => {
      const onEnter = vi.fn();
      render(
        <H1 editable onEnter={onEnter} data-testid="h1">
          Title
        </H1>,
      );
      const heading = screen.getByTestId('h1');

      const event = fireEvent.keyDown(heading, { key: 'Enter' });

      // The event should be prevented
      expect(event).toBe(false);
    });

    it('should call onFocus when focused', () => {
      const onFocus = vi.fn();
      render(
        <H1 editable onFocus={onFocus} data-testid="h1">
          Title
        </H1>,
      );
      const heading = screen.getByTestId('h1');

      fireEvent.focus(heading);

      expect(onFocus).toHaveBeenCalled();
    });

    it('should call onBlur when blurred', () => {
      const onBlur = vi.fn();
      render(
        <H1 editable onBlur={onBlur} data-testid="h1">
          Title
        </H1>,
      );
      const heading = screen.getByTestId('h1');

      fireEvent.blur(heading);

      expect(onBlur).toHaveBeenCalled();
    });

    it('should add editable styling classes when editable', () => {
      render(
        <H1 editable data-testid="h1">
          Title
        </H1>,
      );
      const heading = screen.getByTestId('h1');
      expect(heading).toHaveClass('outline-none');
    });

    it('should set data-editable attribute when editable', () => {
      render(
        <H1 editable data-testid="h1">
          Title
        </H1>,
      );
      const heading = screen.getByTestId('h1');
      expect(heading).toHaveAttribute('data-editable', 'true');
    });

    it('should forward ref correctly in editable mode', () => {
      const ref = createRef<HTMLHeadingElement>();
      render(
        <H1 ref={ref} editable>
          Title
        </H1>,
      );
      expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
      expect(ref.current).toHaveAttribute('contenteditable', 'true');
    });
  });

  describe('H2 editable mode', () => {
    it('should enable contenteditable when editable is true', () => {
      render(
        <H2 editable data-testid="h2">
          Editable Section
        </H2>,
      );
      const heading = screen.getByTestId('h2');
      expect(heading).toHaveAttribute('contenteditable', 'true');
    });

    it('should call onChange on content change', () => {
      const onChange = vi.fn();
      render(
        <H2 editable onChange={onChange} data-testid="h2">
          Section
        </H2>,
      );
      const heading = screen.getByTestId('h2');

      heading.textContent = 'New Section';
      fireEvent.input(heading);

      expect(onChange).toHaveBeenCalledWith('New Section');
    });
  });

  describe('H3 editable mode', () => {
    it('should enable contenteditable when editable is true', () => {
      render(
        <H3 editable data-testid="h3">
          Editable Subsection
        </H3>,
      );
      const heading = screen.getByTestId('h3');
      expect(heading).toHaveAttribute('contenteditable', 'true');
    });

    it('should call onChange on content change', () => {
      const onChange = vi.fn();
      render(
        <H3 editable onChange={onChange} data-testid="h3">
          Subsection
        </H3>,
      );
      const heading = screen.getByTestId('h3');

      heading.textContent = 'New Subsection';
      fireEvent.input(heading);

      expect(onChange).toHaveBeenCalledWith('New Subsection');
    });
  });

  describe('H4 editable mode', () => {
    it('should enable contenteditable when editable is true', () => {
      render(
        <H4 editable data-testid="h4">
          Editable Minor Heading
        </H4>,
      );
      const heading = screen.getByTestId('h4');
      expect(heading).toHaveAttribute('contenteditable', 'true');
    });

    it('should call onChange on content change', () => {
      const onChange = vi.fn();
      render(
        <H4 editable onChange={onChange} data-testid="h4">
          Minor Heading
        </H4>,
      );
      const heading = screen.getByTestId('h4');

      heading.textContent = 'New Minor Heading';
      fireEvent.input(heading);

      expect(onChange).toHaveBeenCalledWith('New Minor Heading');
    });
  });

  describe('Backward compatibility', () => {
    it('H1 works without editable props', () => {
      render(<H1 data-testid="h1">Static H1</H1>);
      const heading = screen.getByTestId('h1');
      expect(heading).not.toHaveAttribute('contenteditable');
      expect(heading).not.toHaveAttribute('data-editable');
      expect(heading).toHaveTextContent('Static H1');
    });

    it('H2 works without editable props', () => {
      render(<H2 data-testid="h2">Static H2</H2>);
      const heading = screen.getByTestId('h2');
      expect(heading).not.toHaveAttribute('contenteditable');
    });

    it('H3 works without editable props', () => {
      render(<H3 data-testid="h3">Static H3</H3>);
      const heading = screen.getByTestId('h3');
      expect(heading).not.toHaveAttribute('contenteditable');
    });

    it('H4 works without editable props', () => {
      render(<H4 data-testid="h4">Static H4</H4>);
      const heading = screen.getByTestId('h4');
      expect(heading).not.toHaveAttribute('contenteditable');
    });
  });
});

// ============================================================================
// R-200b: Editable Paragraph Tests
// ============================================================================

describe('Editable Paragraph (R-200b)', () => {
  describe('P editable mode', () => {
    it('should enable contenteditable when editable is true', () => {
      render(
        <P editable data-testid="p">
          Editable paragraph content
        </P>,
      );
      const paragraph = screen.getByTestId('p');
      expect(paragraph).toHaveAttribute('contenteditable', 'true');
    });

    it('should not enable contenteditable when editable is false', () => {
      render(<P data-testid="p">Static paragraph content</P>);
      const paragraph = screen.getByTestId('p');
      expect(paragraph).not.toHaveAttribute('contenteditable');
    });

    it('should add data-editable attribute when editable', () => {
      render(
        <P editable data-testid="p">
          Content
        </P>,
      );
      const paragraph = screen.getByTestId('p');
      expect(paragraph).toHaveAttribute('data-editable', 'true');
    });

    it('should add focus styling classes when editable', () => {
      render(
        <P editable data-testid="p">
          Content
        </P>,
      );
      const paragraph = screen.getByTestId('p');
      expect(paragraph.className).toContain('focus:ring-2');
    });

    it('should call onChange with InlineContent[] on content change', () => {
      const onChange = vi.fn();
      render(
        <P editable onChange={onChange} data-testid="p">
          Initial content
        </P>,
      );
      const paragraph = screen.getByTestId('p');

      // Simulate typing by setting textContent and triggering input
      paragraph.textContent = 'New content';
      fireEvent.input(paragraph);

      expect(onChange).toHaveBeenCalled();
      const content = onChange.mock.calls[0][0] as InlineContent[];
      expect(content).toHaveLength(1);
      expect(content[0].text).toBe('New content');
    });

    it('should call onFocus when paragraph receives focus', () => {
      const onFocus = vi.fn();
      render(
        <P editable onFocus={onFocus} data-testid="p">
          Content
        </P>,
      );
      const paragraph = screen.getByTestId('p');

      fireEvent.focus(paragraph);

      expect(onFocus).toHaveBeenCalledTimes(1);
    });

    it('should call onBlur when paragraph loses focus', () => {
      const onBlur = vi.fn();
      render(
        <P editable onBlur={onBlur} data-testid="p">
          Content
        </P>,
      );
      const paragraph = screen.getByTestId('p');

      fireEvent.blur(paragraph);

      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('should set placeholder attributes when provided', () => {
      render(
        <P editable placeholder="Type something..." data-testid="p">
          {null}
        </P>,
      );
      const paragraph = screen.getByTestId('p');
      expect(paragraph).toHaveAttribute('data-placeholder', 'Type something...');
      expect(paragraph).toHaveAttribute('aria-placeholder', 'Type something...');
    });

    it('should call onEnter when Enter is pressed', () => {
      const onEnter = vi.fn();
      render(
        <P editable onEnter={onEnter} data-testid="p">
          Content
        </P>,
      );
      const paragraph = screen.getByTestId('p');

      fireEvent.keyDown(paragraph, { key: 'Enter' });

      expect(onEnter).toHaveBeenCalledTimes(1);
    });

    it('should not call onEnter when Shift+Enter is pressed', () => {
      const onEnter = vi.fn();
      render(
        <P editable onEnter={onEnter} data-testid="p">
          Content
        </P>,
      );
      const paragraph = screen.getByTestId('p');

      fireEvent.keyDown(paragraph, { key: 'Enter', shiftKey: true });

      expect(onEnter).not.toHaveBeenCalled();
    });

    it('should forward ref correctly', () => {
      const ref = createRef<HTMLParagraphElement>();
      render(
        <P editable ref={ref} data-testid="p">
          Content
        </P>,
      );
      expect(ref.current).toBeTruthy();
      expect(ref.current?.tagName).toBe('P');
    });

    it('should merge custom className with editable styles', () => {
      render(
        <P editable className="custom-class" data-testid="p">
          Content
        </P>,
      );
      const paragraph = screen.getByTestId('p');
      expect(paragraph.className).toContain('custom-class');
      expect(paragraph.className).toContain('focus:ring-2');
    });
  });

  describe('P backward compatibility', () => {
    it('works without editable props', () => {
      render(<P data-testid="p">Static paragraph</P>);
      const paragraph = screen.getByTestId('p');
      expect(paragraph).not.toHaveAttribute('contenteditable');
      expect(paragraph).not.toHaveAttribute('data-editable');
      expect(paragraph).toHaveTextContent('Static paragraph');
    });

    it('renders as p by default', () => {
      render(<P data-testid="p">Content</P>);
      const paragraph = screen.getByTestId('p');
      expect(paragraph.tagName).toBe('P');
    });

    it('can render as a different element', () => {
      render(
        <P as="div" data-testid="p">
          Content
        </P>,
      );
      const element = screen.getByTestId('p');
      expect(element.tagName).toBe('DIV');
    });
  });
});

// ============================================================================
// R-200b: InlineContent Conversion Tests
// ============================================================================

describe('InlineContent Conversion (R-200b)', () => {
  describe('inlineContentToHtml', () => {
    it('should convert plain text', () => {
      const content: InlineContent[] = [{ text: 'Hello world' }];
      const html = inlineContentToHtml(content);
      expect(html).toBe('Hello world');
    });

    it('should convert bold text', () => {
      const content: InlineContent[] = [{ text: 'Bold text', marks: ['bold'] }];
      const html = inlineContentToHtml(content);
      expect(html).toBe('<strong>Bold text</strong>');
    });

    it('should convert italic text', () => {
      const content: InlineContent[] = [{ text: 'Italic text', marks: ['italic'] }];
      const html = inlineContentToHtml(content);
      expect(html).toBe('<em>Italic text</em>');
    });

    it('should convert code text', () => {
      const content: InlineContent[] = [{ text: 'code snippet', marks: ['code'] }];
      const html = inlineContentToHtml(content);
      expect(html).toBe('<code>code snippet</code>');
    });

    it('should convert strikethrough text', () => {
      const content: InlineContent[] = [{ text: 'deleted', marks: ['strikethrough'] }];
      const html = inlineContentToHtml(content);
      expect(html).toBe('<s>deleted</s>');
    });

    it('should convert link text', () => {
      const content: InlineContent[] = [
        { text: 'Click here', marks: ['link'], href: 'https://example.com' },
      ];
      const html = inlineContentToHtml(content);
      expect(html).toBe('<a href="https://example.com">Click here</a>');
    });

    it('should convert multiple marks', () => {
      const content: InlineContent[] = [{ text: 'Bold and italic', marks: ['bold', 'italic'] }];
      const html = inlineContentToHtml(content);
      expect(html).toBe('<em><strong>Bold and italic</strong></em>');
    });

    it('should convert multiple segments', () => {
      const content: InlineContent[] = [
        { text: 'Normal ' },
        { text: 'bold', marks: ['bold'] },
        { text: ' text' },
      ];
      const html = inlineContentToHtml(content);
      expect(html).toBe('Normal <strong>bold</strong> text');
    });

    it('should escape HTML special characters', () => {
      const content: InlineContent[] = [{ text: '<script>alert("xss")</script>' }];
      const html = inlineContentToHtml(content);
      expect(html).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
    });
  });

  describe('htmlToInlineContent', () => {
    it('should convert plain text', () => {
      const content = htmlToInlineContent('Hello world');
      expect(content).toHaveLength(1);
      expect(content[0].text).toBe('Hello world');
      expect(content[0].marks).toBeUndefined();
    });

    it('should convert strong tag to bold mark', () => {
      const content = htmlToInlineContent('<strong>Bold text</strong>');
      expect(content).toHaveLength(1);
      expect(content[0].text).toBe('Bold text');
      expect(content[0].marks).toContain('bold');
    });

    it('should convert b tag to bold mark', () => {
      const content = htmlToInlineContent('<b>Bold text</b>');
      expect(content).toHaveLength(1);
      expect(content[0].marks).toContain('bold');
    });

    it('should convert em tag to italic mark', () => {
      const content = htmlToInlineContent('<em>Italic text</em>');
      expect(content).toHaveLength(1);
      expect(content[0].marks).toContain('italic');
    });

    it('should convert i tag to italic mark', () => {
      const content = htmlToInlineContent('<i>Italic text</i>');
      expect(content).toHaveLength(1);
      expect(content[0].marks).toContain('italic');
    });

    it('should convert code tag to code mark', () => {
      const content = htmlToInlineContent('<code>code</code>');
      expect(content).toHaveLength(1);
      expect(content[0].marks).toContain('code');
    });

    it('should convert s tag to strikethrough mark', () => {
      const content = htmlToInlineContent('<s>deleted</s>');
      expect(content).toHaveLength(1);
      expect(content[0].marks).toContain('strikethrough');
    });

    it('should convert del tag to strikethrough mark', () => {
      const content = htmlToInlineContent('<del>deleted</del>');
      expect(content).toHaveLength(1);
      expect(content[0].marks).toContain('strikethrough');
    });

    it('should convert a tag to link mark with href', () => {
      const content = htmlToInlineContent('<a href="https://example.com">Link</a>');
      expect(content).toHaveLength(1);
      expect(content[0].text).toBe('Link');
      expect(content[0].marks).toContain('link');
      expect(content[0].href).toBe('https://example.com');
    });

    it('should convert nested marks', () => {
      const content = htmlToInlineContent('<strong><em>Bold and italic</em></strong>');
      expect(content).toHaveLength(1);
      expect(content[0].marks).toContain('bold');
      expect(content[0].marks).toContain('italic');
    });

    it('should convert mixed content', () => {
      const content = htmlToInlineContent('Normal <strong>bold</strong> text');
      expect(content).toHaveLength(3);
      expect(content[0].text).toBe('Normal ');
      expect(content[0].marks).toBeUndefined();
      expect(content[1].text).toBe('bold');
      expect(content[1].marks).toContain('bold');
      expect(content[2].text).toBe(' text');
      expect(content[2].marks).toBeUndefined();
    });
  });
});

// ============================================================================
// R-200d: Editable Quote Tests
// ============================================================================

describe('Editable Quote (R-200d)', () => {
  describe('Blockquote editable mode', () => {
    it('should enable contenteditable when editable is true', () => {
      render(
        <Blockquote editable data-testid="quote">
          Editable quote content
        </Blockquote>,
      );
      const quote = screen.getByTestId('quote');
      expect(quote).toHaveAttribute('contenteditable', 'true');
    });

    it('should not enable contenteditable when editable is false', () => {
      render(<Blockquote data-testid="quote">Static quote</Blockquote>);
      const quote = screen.getByTestId('quote');
      expect(quote).not.toHaveAttribute('contenteditable');
    });

    it('should add data-editable attribute when editable', () => {
      render(
        <Blockquote editable data-testid="quote">
          Content
        </Blockquote>,
      );
      const quote = screen.getByTestId('quote');
      expect(quote).toHaveAttribute('data-editable', 'true');
    });

    it('should add focus styling classes when editable', () => {
      render(
        <Blockquote editable data-testid="quote">
          Content
        </Blockquote>,
      );
      const quote = screen.getByTestId('quote');
      expect(quote.className).toContain('focus:ring-2');
    });

    it('should call onChange with InlineContent[] on content change', () => {
      const onChange = vi.fn();
      render(
        <Blockquote editable onChange={onChange} data-testid="quote">
          Initial quote
        </Blockquote>,
      );
      const quote = screen.getByTestId('quote');

      quote.textContent = 'New quote content';
      fireEvent.input(quote);

      expect(onChange).toHaveBeenCalled();
      const content = onChange.mock.calls[0][0] as InlineContent[];
      expect(content).toHaveLength(1);
      expect(content[0].text).toBe('New quote content');
    });

    it('should call onFocus when quote receives focus', () => {
      const onFocus = vi.fn();
      render(
        <Blockquote editable onFocus={onFocus} data-testid="quote">
          Content
        </Blockquote>,
      );
      const quote = screen.getByTestId('quote');

      fireEvent.focus(quote);

      expect(onFocus).toHaveBeenCalledTimes(1);
    });

    it('should call onBlur when quote loses focus', () => {
      const onBlur = vi.fn();
      render(
        <Blockquote editable onBlur={onBlur} data-testid="quote">
          Content
        </Blockquote>,
      );
      const quote = screen.getByTestId('quote');

      fireEvent.blur(quote);

      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('should set placeholder attributes when provided', () => {
      render(
        <Blockquote editable placeholder="Enter quote..." data-testid="quote">
          {null}
        </Blockquote>,
      );
      const quote = screen.getByTestId('quote');
      expect(quote).toHaveAttribute('data-placeholder', 'Enter quote...');
      expect(quote).toHaveAttribute('aria-placeholder', 'Enter quote...');
    });

    it('should call onEnter when Enter is pressed', () => {
      const onEnter = vi.fn();
      render(
        <Blockquote editable onEnter={onEnter} data-testid="quote">
          Content
        </Blockquote>,
      );
      const quote = screen.getByTestId('quote');

      fireEvent.keyDown(quote, { key: 'Enter' });

      expect(onEnter).toHaveBeenCalledTimes(1);
    });

    it('should forward ref correctly', () => {
      const ref = createRef<HTMLQuoteElement>();
      render(
        <Blockquote editable ref={ref} data-testid="quote">
          Content
        </Blockquote>,
      );
      expect(ref.current).toBeTruthy();
      expect(ref.current?.tagName).toBe('BLOCKQUOTE');
    });
  });

  describe('Blockquote citation', () => {
    it('should render citation when provided', () => {
      render(
        <Blockquote citation="John Doe" data-testid="quote">
          A great quote
        </Blockquote>,
      );
      const citation = screen.getByText('John Doe');
      expect(citation).toBeInTheDocument();
      expect(citation.tagName).toBe('CITE');
    });

    it('should render editable citation when editable with onCitationChange', () => {
      render(
        <Blockquote editable citation="Author" onCitationChange={vi.fn()} data-testid="quote">
          Content
        </Blockquote>,
      );
      const citation = screen.getByText('Author');
      expect(citation).toHaveAttribute('contenteditable', 'true');
    });

    it('should call onCitationChange when citation is edited', () => {
      const onCitationChange = vi.fn();
      render(
        <Blockquote
          editable
          citation="Original Author"
          onCitationChange={onCitationChange}
          data-testid="quote"
        >
          Content
        </Blockquote>,
      );
      const citation = screen.getByText('Original Author');

      citation.textContent = 'New Author';
      fireEvent.input(citation);

      expect(onCitationChange).toHaveBeenCalledWith('New Author');
    });
  });

  describe('Blockquote backward compatibility', () => {
    it('works without editable props', () => {
      render(<Blockquote data-testid="quote">Static quote</Blockquote>);
      const quote = screen.getByTestId('quote');
      expect(quote).not.toHaveAttribute('contenteditable');
      expect(quote).not.toHaveAttribute('data-editable');
      expect(quote).toHaveTextContent('Static quote');
    });

    it('renders as blockquote by default', () => {
      render(<Blockquote data-testid="quote">Content</Blockquote>);
      const quote = screen.getByTestId('quote');
      expect(quote.tagName).toBe('BLOCKQUOTE');
    });

    it('applies blockquote styling', () => {
      render(<Blockquote data-testid="quote">Content</Blockquote>);
      const quote = screen.getByTestId('quote');
      expect(quote.className).toContain('border-l-2');
      expect(quote.className).toContain('italic');
    });
  });
});
