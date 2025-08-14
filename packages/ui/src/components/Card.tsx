/**
 * Flexible container component for grouping related content with semantic structure
 *
 * @registry-name card
 * @registry-version 0.1.0
 * @registry-status published
 * @registry-path components/ui/Card.tsx
 * @registry-type registry:component
 *
 * @cognitive-load 2/10 - Simple container with clear boundaries and minimal cognitive overhead
 * @attention-economics Neutral container: Content drives attention, elevation hierarchy for interactive states
 * @trust-building Consistent spacing, predictable interaction patterns, clear content boundaries
 * @accessibility Proper heading structure, landmark roles, keyboard navigation for interactive cards
 * @semantic-meaning Structural roles: article=standalone content, section=grouped content, aside=supplementary information
 *
 * @usage-patterns
 * DO: Group related information with clear visual boundaries
 * DO: Create interactive cards with hover states and focus management
 * DO: Establish information hierarchy with header, content, actions
 * DO: Implement responsive scaling with consistent proportions
 * NEVER: Use decorative containers without semantic purpose
 *
 * @design-guides
 * - Content Grouping: https://rafters.realhandy.tech/docs/llm/content-grouping
 * - Attention Economics: https://rafters.realhandy.tech/docs/llm/attention-economics
 * - Spatial Relationships: https://rafters.realhandy.tech/docs/llm/spatial-relationships
 *
 * @dependencies @rafters/design-tokens/motion
 *
 * @example
 * ```tsx
 * // Basic card with content structure
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Card Title</CardTitle>
 *     <CardDescription>Supporting description</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     Main card content
 *   </CardContent>
 *   <CardFooter>
 *     <Button>Action</Button>
 *   </CardFooter>
 * </Card>
 * ```
 */
import { contextEasing, contextTiming } from '@rafters/design-tokens/motion';
import { cn } from '../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Cognitive load: Card density for information hierarchy */
  density?: 'compact' | 'comfortable' | 'spacious';
  /** Cognitive load: Interaction affordance */
  interactive?: boolean;
  /** Scanability: Visual prominence for important cards */
  prominence?: 'subtle' | 'default' | 'elevated';
  ref?: React.Ref<HTMLDivElement>;
}

export function Card({
  className,
  density = 'comfortable',
  interactive = false,
  prominence = 'default',
  ref,
  ...props
}: CardProps) {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border bg-card text-card-foreground transition-all',
        contextTiming.hover,
        contextEasing.hover,
        // Cognitive load: Information density controls
        {
          'border-border shadow-sm': prominence === 'subtle',
          'border-border shadow-md': prominence === 'default',
          'border-border shadow-lg': prominence === 'elevated',
        },
        // Interaction affordance: Clear hover states for interactive cards
        interactive &&
          'cursor-pointer hover:shadow-md hover:border-accent-foreground/20 hover:scale-[1.02] active:scale-[0.98]',
        // Motor accessibility: Ensure adequate touch targets for interactive cards
        interactive && 'min-h-[44px]',
        className
      )}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      {...props}
    />
  );
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Cognitive load: Header density for information hierarchy */
  density?: 'compact' | 'comfortable' | 'spacious';
  ref?: React.Ref<HTMLDivElement>;
}

export function CardHeader({ className, density = 'comfortable', ref, ...props }: CardHeaderProps) {
  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col space-y-1.5',
        // Cognitive load: Adaptive spacing based on information density
        {
          'p-4': density === 'compact',
          'p-6': density === 'comfortable',
          'p-8': density === 'spacious',
        },
        className
      )}
      {...props}
    />
  );
}

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Information hierarchy: Semantic heading level */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Scanability: Visual weight for content hierarchy */
  weight?: 'normal' | 'medium' | 'semibold';
  ref?: React.Ref<HTMLHeadingElement>;
}

export function CardTitle({
  className,
  level = 3,
  weight = 'semibold',
  ref,
  ...props
}: CardTitleProps) {
  const HeadingTag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  return (
    <HeadingTag
      ref={ref}
      className={cn(
        'leading-none tracking-tight',
        // Information hierarchy: Semantic sizing based on heading level
        {
          'text-3xl': level === 1,
          'text-2xl': level === 2,
          'text-xl': level === 3,
          'text-lg': level === 4,
          'text-base': level === 5,
          'text-sm': level === 6,
        },
        // Scanability: Visual weight options
        {
          'font-normal': weight === 'normal',
          'font-medium': weight === 'medium',
          'font-semibold': weight === 'semibold',
        },
        className
      )}
      {...props}
    />
  );
}

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** Cognitive load: Text length awareness for readability */
  truncate?: boolean;
  /** Information hierarchy: Subtle vs prominent descriptions */
  prominence?: 'subtle' | 'default';
  ref?: React.Ref<HTMLParagraphElement>;
}

export function CardDescription({
  className,
  truncate = false,
  prominence = 'default',
  ref,
  ...props
}: CardDescriptionProps) {
  return (
    <p
      ref={ref}
      className={cn(
        'text-sm leading-relaxed',
        // Cognitive load: Truncation for long descriptions
        truncate && 'line-clamp-2',
        // Information hierarchy: Prominence levels
        {
          'text-muted-foreground/70': prominence === 'subtle',
          'text-muted-foreground': prominence === 'default',
        },
        className
      )}
      {...props}
    />
  );
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Cognitive load: Content density for information hierarchy */
  density?: 'compact' | 'comfortable' | 'spacious';
  /** Scanability: Content organization patterns */
  layout?: 'default' | 'grid' | 'list';
  ref?: React.Ref<HTMLDivElement>;
}

export function CardContent({
  className,
  density = 'comfortable',
  layout = 'default',
  ref,
  ...props
}: CardContentProps) {
  return (
    <div
      ref={ref}
      className={cn(
        'pt-0',
        // Cognitive load: Adaptive spacing
        {
          'p-4': density === 'compact',
          'p-6': density === 'comfortable',
          'p-8': density === 'spacious',
        },
        // Scanability: Layout patterns
        {
          '': layout === 'default',
          'grid grid-cols-1 gap-4': layout === 'grid',
          'space-y-3': layout === 'list',
        },
        className
      )}
      {...props}
    />
  );
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Cognitive load: Footer density and action clarity */
  density?: 'compact' | 'comfortable' | 'spacious';
  /** Scanability: Action hierarchy in footer */
  justify?: 'start' | 'center' | 'end' | 'between';
  ref?: React.Ref<HTMLDivElement>;
}

export function CardFooter({
  className,
  density = 'comfortable',
  justify = 'start',
  ref,
  ...props
}: CardFooterProps) {
  return (
    <div
      ref={ref}
      className={cn(
        'flex items-center pt-0',
        // Cognitive load: Adaptive spacing
        {
          'p-4': density === 'compact',
          'p-6': density === 'comfortable',
          'p-8': density === 'spacious',
        },
        // Scanability: Action layout
        {
          'justify-start': justify === 'start',
          'justify-center': justify === 'center',
          'justify-end': justify === 'end',
          'justify-between': justify === 'between',
        },
        className
      )}
      {...props}
    />
  );
}
