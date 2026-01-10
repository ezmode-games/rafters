import { Container } from '@rafters/ui/components/ui/container';

export function ContainerDemo() {
  return (
    <Container
      as="section"
      size="md"
      padding="6"
      className="bg-muted/30 border border-border rounded-md"
    >
      <p className="text-sm text-muted-foreground">
        This is a centered container with md max-width and padding. Containers provide semantic
        structure and consistent spacing.
      </p>
    </Container>
  );
}

export function ContainerVariants() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs text-muted-foreground font-mono">as="main" size="full"</p>
        <Container
          as="main"
          size="full"
          padding="4"
          className="bg-primary/10 border border-primary/20 rounded-md"
        >
          <p className="text-sm">Main content container (full width)</p>
        </Container>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs text-muted-foreground font-mono">as="section" size="lg"</p>
        <Container
          as="section"
          size="lg"
          padding="4"
          className="bg-secondary/30 border border-border rounded-md"
        >
          <p className="text-sm">Section container (lg max-width, centered)</p>
        </Container>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs text-muted-foreground font-mono">as="article"</p>
        <Container
          as="article"
          padding="4"
          className="bg-accent/30 border border-border rounded-md"
        >
          <h3>Article Container</h3>
          <p>
            Article containers get automatic typography styling for readable content. Headings,
            paragraphs, lists, and links are styled automatically.
          </p>
        </Container>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs text-muted-foreground font-mono">as="aside"</p>
        <Container as="aside" padding="4" className="bg-muted border border-border rounded-md">
          <p className="text-sm">Aside container for supplementary content</p>
        </Container>
      </div>
    </div>
  );
}
