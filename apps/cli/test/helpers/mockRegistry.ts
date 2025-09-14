/**
 * Mock Registry Server for Integration Tests
 *
 * Provides a simple HTTP server that serves component data for testing
 * the add command without relying on the live registry endpoints.
 */

import type { IncomingMessage, ServerResponse } from 'node:http';
import { createServer, type Server } from 'node:http';
import type { ComponentManifest } from '@rafters/shared';

// Mock button component for testing
const MOCK_BUTTON_COMPONENT: ComponentManifest = {
  name: 'button',
  type: 'registry:component',
  description: 'A versatile button component with design intelligence',
  dependencies: ['class-variance-authority', 'clsx', 'tailwind-merge'],
  registryDependencies: ['utils'],
  files: [
    {
      path: 'src/components/ui/button.tsx',
      content: `/**
 * Button Intelligence: cognitiveLoad=3, trustLevel=medium
 * Use for: Primary actions, form submissions, confirmations
 * Requires: Clear labeling, appropriate sizing for touch targets
 * NEVER use for: Destructive actions without confirmation patterns
 */
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  ref?: React.Ref<HTMLButtonElement>
}

function Button({ className, variant, size, asChild = false, ref, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
}

export { Button, buttonVariants }
`,
      type: 'registry:component',
      target: 'components/ui/button.tsx',
    },
  ],
  meta: {
    rafters: {
      version: '0.1.0',
      intelligence: {
        cognitiveLoad: 3,
        attentionEconomics: 'Primary attention element - use sparingly for main actions',
        accessibility: 'WCAG AAA compliant with proper focus indicators and touch targets',
        trustBuilding: 'Medium trust - appropriate for confirmations and form submissions',
        semanticMeaning: 'Action trigger with clear intent communication through variants',
      },
    },
  },
};

// Mock card component for multiple component tests
const MOCK_CARD_COMPONENT: ComponentManifest = {
  name: 'card',
  type: 'registry:component',
  description: 'A flexible card component for content grouping',
  dependencies: [],
  registryDependencies: ['utils'],
  files: [
    {
      path: 'src/components/ui/card.tsx',
      content: `/**
 * Card Intelligence: cognitiveLoad=4, trustLevel=low
 * Use for: Content grouping, information organization
 * Requires: Proper spacing, semantic structure
 */
import * as React from "react"

import { cn } from "@/lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>
}

function Card({ className, ref, ...props }: CardProps) {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  )
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>
}

function CardHeader({ className, ref, ...props }: CardHeaderProps) {
  return <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  ref?: React.Ref<HTMLParagraphElement>
}

function CardTitle({ className, ref, ...props }: CardTitleProps) {
  return (
    <h3
      ref={ref}
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  )
}

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  ref?: React.Ref<HTMLParagraphElement>
}

function CardDescription({ className, ref, ...props }: CardDescriptionProps) {
  return <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>
}

function CardContent({ className, ref, ...props }: CardContentProps) {
  return <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>
}

function CardFooter({ className, ref, ...props }: CardFooterProps) {
  return <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
`,
      type: 'registry:component',
      target: 'components/ui/card.tsx',
    },
  ],
  meta: {
    rafters: {
      version: '0.1.0',
      intelligence: {
        cognitiveLoad: 4,
        attentionEconomics: 'Content organization - neutral attention weight',
        accessibility: 'Semantic HTML structure with proper headings',
        trustBuilding: 'Low trust - informational display component',
        semanticMeaning: 'Content container with hierarchical organization',
      },
    },
  },
};

// Registry data structure
const MOCK_REGISTRY = {
  components: [MOCK_BUTTON_COMPONENT, MOCK_CARD_COMPONENT],
};

export class MockRegistryServer {
  private server: Server;
  private port: number;

  constructor(port = 0) {
    this.port = port;
    this.server = createServer(this.handleRequest.bind(this));
  }

  private handleRequest(req: IncomingMessage, res: ServerResponse) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    if (req.method !== 'GET') {
      res.writeHead(405);
      res.end(JSON.stringify({ error: 'Method not allowed' }));
      return;
    }

    const url = new URL(req.url!, `http://localhost:${this.port}`);

    // Handle /components endpoint - return list of components
    if (url.pathname === '/components') {
      res.writeHead(200);
      res.end(JSON.stringify(MOCK_REGISTRY));
      return;
    }

    // Handle /components/:name endpoint - return specific component
    const componentMatch = url.pathname.match(/^\/components\/(.+)$/);
    if (componentMatch) {
      const componentName = decodeURIComponent(componentMatch[1]);
      const component = MOCK_REGISTRY.components.find((c) => c.name === componentName);

      if (component) {
        res.writeHead(200);
        res.end(JSON.stringify(component));
      } else {
        res.writeHead(404);
        res.end(
          JSON.stringify({
            error: 'Component not found',
            message: `Component "${componentName}" does not exist in the registry`,
          })
        );
      }
      return;
    }

    // 404 for other paths
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }

  async start(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.server.listen(this.port, () => {
        const address = this.server.address();
        if (address && typeof address === 'object') {
          this.port = address.port;
          const baseUrl = `http://localhost:${this.port}`;
          resolve(baseUrl);
        } else {
          reject(new Error('Failed to start server'));
        }
      });

      this.server.on('error', reject);
    });
  }

  async stop(): Promise<void> {
    return new Promise((resolve) => {
      this.server.close(() => resolve());
    });
  }

  getUrl(): string {
    return `http://localhost:${this.port}`;
  }
}
