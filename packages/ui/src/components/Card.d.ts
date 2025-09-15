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
 * @dependencies none
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
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Cognitive load: Card density for information hierarchy */
    density?: 'compact' | 'comfortable' | 'spacious';
    /** Cognitive load: Interaction affordance */
    interactive?: boolean;
    /** Scanability: Visual prominence for important cards */
    prominence?: 'subtle' | 'default' | 'elevated';
    ref?: React.Ref<HTMLDivElement>;
}
export declare function Card({ className, density, interactive, prominence, ref, ...props }: CardProps): import("react/jsx-runtime").JSX.Element;
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Cognitive load: Header density for information hierarchy */
    density?: 'compact' | 'comfortable' | 'spacious';
    ref?: React.Ref<HTMLDivElement>;
}
export declare function CardHeader({ className, density, ref, ...props }: CardHeaderProps): import("react/jsx-runtime").JSX.Element;
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    /** Information hierarchy: Semantic heading level */
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    /** Scanability: Visual weight for content hierarchy */
    weight?: 'normal' | 'medium' | 'semibold';
    ref?: React.Ref<HTMLHeadingElement>;
}
export declare function CardTitle({ className, level, weight, ref, ...props }: CardTitleProps): import("react/jsx-runtime").JSX.Element;
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
    /** Cognitive load: Text length awareness for readability */
    truncate?: boolean;
    /** Information hierarchy: Subtle vs prominent descriptions */
    prominence?: 'subtle' | 'default';
    ref?: React.Ref<HTMLParagraphElement>;
}
export declare function CardDescription({ className, truncate, prominence, ref, ...props }: CardDescriptionProps): import("react/jsx-runtime").JSX.Element;
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Cognitive load: Content density for information hierarchy */
    density?: 'compact' | 'comfortable' | 'spacious';
    /** Scanability: Content organization patterns */
    layout?: 'default' | 'grid' | 'list';
    ref?: React.Ref<HTMLDivElement>;
}
export declare function CardContent({ className, density, layout, ref, ...props }: CardContentProps): import("react/jsx-runtime").JSX.Element;
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Cognitive load: Footer density and action clarity */
    density?: 'compact' | 'comfortable' | 'spacious';
    /** Scanability: Action hierarchy in footer */
    justify?: 'start' | 'center' | 'end' | 'between';
    ref?: React.Ref<HTMLDivElement>;
}
export declare function CardFooter({ className, density, justify, ref, ...props }: CardFooterProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=Card.d.ts.map