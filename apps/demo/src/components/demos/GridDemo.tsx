import { Grid } from '@rafters/ui/components/ui/grid';

function GridItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-muted/50 border border-border rounded-md p-4 text-sm text-center">
      {children}
    </div>
  );
}

export function GridDemo() {
  return (
    <Grid preset="linear" columns={3} gap="4">
      <Grid.Item>
        <GridItem>Item 1</GridItem>
      </Grid.Item>
      <Grid.Item>
        <GridItem>Item 2</GridItem>
      </Grid.Item>
      <Grid.Item>
        <GridItem>Item 3</GridItem>
      </Grid.Item>
    </Grid>
  );
}

export function GridVariants() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-xs text-muted-foreground font-mono">preset="linear" columns={3}</p>
        <Grid preset="linear" columns={3} gap="4">
          <Grid.Item>
            <GridItem>1</GridItem>
          </Grid.Item>
          <Grid.Item>
            <GridItem>2</GridItem>
          </Grid.Item>
          <Grid.Item>
            <GridItem>3</GridItem>
          </Grid.Item>
        </Grid>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs text-muted-foreground font-mono">preset="golden" (2:1 ratio)</p>
        <Grid preset="golden" gap="4">
          <Grid.Item>
            <div className="bg-primary/20 border border-primary/30 rounded-md p-4 text-sm">
              Primary (2/3)
            </div>
          </Grid.Item>
          <Grid.Item>
            <div className="bg-muted/50 border border-border rounded-md p-4 text-sm">
              Secondary (1/3)
            </div>
          </Grid.Item>
        </Grid>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs text-muted-foreground font-mono">
          preset="bento" pattern="editorial"
        </p>
        <Grid preset="bento" pattern="editorial" gap="4">
          <Grid.Item priority="primary">
            <div className="bg-primary/20 border border-primary/30 rounded-md p-4 text-sm h-full flex items-center justify-center">
              Hero (2x2)
            </div>
          </Grid.Item>
          <Grid.Item>
            <GridItem>Side 1</GridItem>
          </Grid.Item>
          <Grid.Item>
            <GridItem>Side 2</GridItem>
          </Grid.Item>
        </Grid>
      </div>
    </div>
  );
}
