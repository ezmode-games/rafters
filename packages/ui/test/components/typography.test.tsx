import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import {
  Blockquote,
  Code,
  H1,
  H2,
  H3,
  H4,
  Large,
  Lead,
  Muted,
  P,
  Small,
  typographyClasses,
} from '../../src/components/ui/typography';

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
