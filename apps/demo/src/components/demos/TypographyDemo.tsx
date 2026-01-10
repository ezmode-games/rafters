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
} from '@rafters/ui/components/ui/typography';

export function TypographyDemo() {
  return (
    <div className="flex flex-col gap-4 max-w-prose">
      <H2>Typography Example</H2>
      <Lead>This is a lead paragraph for introductions.</Lead>
      <P>
        This is a standard paragraph with some <Code>inline code</Code> for technical terms.
      </P>
      <Muted>Last updated: January 2025</Muted>
    </div>
  );
}

export function TypographyVariants() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <H1>Heading 1</H1>
        <Muted>H1 - Primary page heading (use once per page)</Muted>
      </div>
      <div className="flex flex-col gap-2">
        <H2>Heading 2</H2>
        <Muted>H2 - Section heading</Muted>
      </div>
      <div className="flex flex-col gap-2">
        <H3>Heading 3</H3>
        <Muted>H3 - Subsection heading</Muted>
      </div>
      <div className="flex flex-col gap-2">
        <H4>Heading 4</H4>
        <Muted>H4 - Minor heading</Muted>
      </div>
      <div className="flex flex-col gap-2">
        <P>Standard paragraph text with proper line height for readability.</P>
        <Muted>P - Body paragraph</Muted>
      </div>
      <div className="flex flex-col gap-2">
        <Lead>Larger, muted text for page introductions.</Lead>
        <Muted>Lead - Introductory paragraph</Muted>
      </div>
      <div className="flex flex-col gap-2">
        <Large>Emphasized text</Large>
        <Muted>Large - Larger, semibold text</Muted>
      </div>
      <div className="flex flex-col gap-2">
        <Small>Fine print or caption</Small>
        <Muted>Small - Smaller text</Muted>
      </div>
      <div className="flex flex-col gap-2">
        <Code>npm install @rafters/ui</Code>
        <Muted>Code - Inline code</Muted>
      </div>
      <div className="flex flex-col gap-2">
        <Blockquote>"Design is not just what it looks like. Design is how it works."</Blockquote>
        <Muted>Blockquote - Block quotation</Muted>
      </div>
    </div>
  );
}
