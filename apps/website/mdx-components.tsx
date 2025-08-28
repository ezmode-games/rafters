import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Grid, GridItem } from '@/components/ui/grid';
import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Rafters components
    Container,
    Grid,
    GridItem,
    Button,
    // Custom heading with better styling
    h1: ({ children, ...props }) => (
      <h1 className="text-4xl font-bold tracking-tight text-foreground mb-6" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-4 mt-8" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className="text-2xl font-semibold tracking-tight text-foreground mb-3 mt-6" {...props}>
        {children}
      </h3>
    ),
    p: ({ children, ...props }) => (
      <p className="text-base leading-relaxed text-muted-foreground mb-4" {...props}>
        {children}
      </p>
    ),
    code: ({ children, ...props }) => (
      <code className="bg-muted px-2 py-1 rounded text-sm font-mono text-foreground" {...props}>
        {children}
      </code>
    ),
    pre: ({ children, ...props }) => (
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono mb-4" {...props}>
        {children}
      </pre>
    ),
    ul: ({ children, ...props }) => (
      <ul className="list-disc pl-6 mb-4 space-y-2" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="list-decimal pl-6 mb-4 space-y-2" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="text-muted-foreground" {...props}>
        {children}
      </li>
    ),
    blockquote: ({ children, ...props }) => (
      <blockquote
        className="border-l-4 border-accent pl-4 italic text-muted-foreground mb-4"
        {...props}
      >
        {children}
      </blockquote>
    ),
    ...components,
  };
}
