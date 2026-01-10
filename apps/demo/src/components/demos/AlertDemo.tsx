import { Alert, AlertDescription, AlertTitle } from '@rafters/ui/components/ui/alert';

const SEMANTIC_VARIANTS = [
  'primary',
  'secondary',
  'destructive',
  'success',
  'warning',
  'info',
  'muted',
  'accent',
] as const;

export function AlertDemo() {
  return (
    <Alert variant="info">
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>This is an informational alert message.</AlertDescription>
    </Alert>
  );
}

export function AlertVariants() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl">
      {/* All Semantic Variants */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
          Semantic Variants
        </h3>
        <div className="flex flex-col gap-4">
          {SEMANTIC_VARIANTS.map((variant) => (
            <Alert key={variant} variant={variant}>
              <AlertTitle className="capitalize">{variant}</AlertTitle>
              <AlertDescription>
                This is a {variant} alert. Use it for{' '}
                {variant === 'destructive'
                  ? 'errors and critical warnings'
                  : variant === 'success'
                    ? 'confirmations and completions'
                    : variant === 'warning'
                      ? 'caution and potential issues'
                      : variant === 'info'
                        ? 'helpful information and tips'
                        : variant === 'primary'
                          ? 'primary messages'
                          : variant === 'secondary'
                            ? 'secondary messages'
                            : variant === 'muted'
                              ? 'subtle, low-priority messages'
                              : 'accent messages'}
                .
              </AlertDescription>
            </Alert>
          ))}
        </div>
      </section>
    </div>
  );
}
