import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
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
} from '../../src/components/ui/typography';

describe('H1 - Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<H1>Page Title</H1>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no violations with custom as prop', async () => {
    const { container } = render(<H1 as="div">Styled as Heading</H1>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('H2 - Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<H2>Section Title</H2>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('H3 - Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<H3>Subsection Title</H3>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('H4 - Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<H4>Minor Heading</H4>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('P - Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<P>This is a paragraph of text.</P>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no violations with links inside', async () => {
    const { container } = render(
      <P>
        Read more at <a href="#docs">documentation</a>.
      </P>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('Lead - Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Lead>Introduction to the page content.</Lead>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('Large - Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Large>Emphasized text</Large>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('Small - Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Small>Fine print text</Small>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('Muted - Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Muted>Secondary information</Muted>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('Code - Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Code>const x = 1</Code>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no violations inside paragraph', async () => {
    const { container } = render(
      <P>
        Use the <Code>useState</Code> hook for local state.
      </P>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('Blockquote - Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(
      <Blockquote>
        Design is not just what it looks like. Design is how it works.
      </Blockquote>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no violations with citation', async () => {
    const { container } = render(
      <figure>
        <Blockquote>
          Design is not just what it looks like. Design is how it works.
        </Blockquote>
        <figcaption>
          <cite>Steve Jobs</cite>
        </figcaption>
      </figure>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('Typography - Heading hierarchy', () => {
  it('has no violations with proper heading hierarchy', async () => {
    const { container } = render(
      <article>
        <H1>Page Title</H1>
        <Lead>Introduction paragraph.</Lead>
        <H2>Section 1</H2>
        <P>Content for section 1.</P>
        <H3>Subsection 1.1</H3>
        <P>Content for subsection 1.1.</P>
        <H2>Section 2</H2>
        <P>Content for section 2.</P>
      </article>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no violations with all heading levels', async () => {
    const { container } = render(
      <main>
        <H1>Main Title</H1>
        <H2>Section</H2>
        <H3>Subsection</H3>
        <H4>Minor Heading</H4>
        <P>Paragraph content.</P>
      </main>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('Typography - Complete page structure', () => {
  it('has no violations in a complete page structure', async () => {
    const { container } = render(
      <main>
        <article>
          <header>
            <H1>Article Title</H1>
            <Lead>This is an introduction to the article content.</Lead>
            <Muted>Published: January 2025</Muted>
          </header>

          <section>
            <H2>First Section</H2>
            <P>
              This is a body paragraph with standard styling. It includes{' '}
              <Code>inline code</Code> for technical terms.
            </P>

            <H3>Subsection</H3>
            <P>More content here with detailed information.</P>

            <Blockquote>
              A quote that emphasizes an important point from the article.
            </Blockquote>
          </section>

          <section>
            <H2>Second Section</H2>
            <Large>An emphasized statement</Large>
            <P>Regular paragraph following the emphasis.</P>
            <Small>A note in smaller text.</Small>
          </section>

          <footer>
            <Muted>Last updated: January 2025</Muted>
          </footer>
        </article>
      </main>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('Typography - With interactive elements', () => {
  it('has no violations with links and buttons', async () => {
    const { container } = render(
      <article>
        <H1>Interactive Content</H1>
        <P>
          Visit our <a href="#docs">documentation</a> for more information.
        </P>
        <P>
          <button type="button">Click here</button> to learn more.
        </P>
      </article>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('Typography - With ARIA attributes', () => {
  it('has no violations with aria-labelledby', async () => {
    const { container } = render(
      <section aria-labelledby="section-title">
        <H2 id="section-title">Section with ARIA</H2>
        <P>Content describing the section.</P>
      </section>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no violations with aria-describedby', async () => {
    const { container } = render(
      <div>
        <H3 id="feature-title">Feature Name</H3>
        <P id="feature-desc">Description of the feature.</P>
        <button type="button" aria-labelledby="feature-title" aria-describedby="feature-desc">
          Enable Feature
        </button>
      </div>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
