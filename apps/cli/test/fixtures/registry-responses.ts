/**
 * Registry API Response Fixtures with Zod Schemas
 * Used for mocking network requests in tests
 */

import { z } from 'zod';

// Schema for agent instructions template response
export const AgentInstructionsSchema = z.string().min(1);

// Schema for utils template response
export const UtilsTemplateSchema = z.string().min(1);

// Schema for component registry response
export const ComponentRegistrySchema = z.object({
  $schema: z.string(),
  name: z.string(),
  components: z.array(z.object({
    name: z.string(),
    description: z.string(),
    meta: z.object({
      rafters: z.object({
        version: z.string(),
        intelligence: z.object({
          cognitiveLoad: z.number(),
        }),
      }),
    }),
  })),
});

// Schema for individual component response
export const ComponentSchema = z.object({
  name: z.string(),
  type: z.literal('registry:component'),
  description: z.string(),
  files: z.array(z.object({
    path: z.string(),
    type: z.literal('registry:component'),
    content: z.string(),
  })),
  dependencies: z.array(z.string()),
  meta: z.object({
    rafters: z.object({
      version: z.string(),
      intelligence: z.object({
        cognitiveLoad: z.number(),
        attentionEconomics: z.string().optional(),
        accessibility: z.string().optional(),
        trustBuilding: z.string().optional(),
        semanticMeaning: z.string().optional(),
      }),
    }),
  }),
});

// Fixture data matching schemas
export const REGISTRY_FIXTURES = {
  agentInstructions: `# Rafters AI Agent Instructions

This project uses Rafters design system components with embedded intelligence.

## Component Usage Guidelines
- Always read component intelligence before using components
- Use semantic tokens instead of arbitrary values
- Follow trust-building patterns for user actions
- Apply accessibility standards systematically

## Key Principles
- Cognitive Load: Choose components appropriate for user mental capacity
- Trust Building: Follow patterns that build user confidence
- Attention Economics: Understand visual hierarchy and component priority
- Progressive Enhancement: Build from core experience outward

## Resources
- Component Registry: https://rafters.realhandy.tech/registry/components
- Design Intelligence: https://rafters.realhandy.tech
`,

  utilsTemplate: `import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Design intelligence utility for component cognitive load assessment
 */
export function assessCognitiveLoad(elements: number, interactions: number): number {
  return Math.min(Math.ceil((elements + interactions) / 3), 5);
}

/**
 * Trust building utility for progressive enhancement
 */
export function buildTrust(hasError: boolean, hasSuccess: boolean): string {
  if (hasError) return 'trust-error';
  if (hasSuccess) return 'trust-success';
  return 'trust-neutral';
}
`,

  componentRegistry: {
    $schema: 'https://ui.shadcn.com/schema/registry.json',
    name: 'Rafters AI Design Intelligence Registry',
    components: [
      {
        name: 'button',
        description: 'A customizable button component with cognitive load intelligence',
        meta: {
          rafters: {
            version: '1.0.0',
            intelligence: {
              cognitiveLoad: 2,
            },
          },
        },
      },
      {
        name: 'card',
        description: 'A card component with attention economics optimization',
        meta: {
          rafters: {
            version: '1.0.0',
            intelligence: {
              cognitiveLoad: 3,
            },
          },
        },
      },
    ],
  },

  buttonComponent: {
    name: 'button',
    type: 'registry:component' as const,
    description: 'A customizable button component with cognitive load intelligence',
    files: [
      {
        path: 'button.tsx',
        type: 'registry:component' as const,
        content: `import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
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
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
`,
      },
    ],
    dependencies: ['@radix-ui/react-slot', 'class-variance-authority'],
    meta: {
      rafters: {
        version: '1.0.0',
        intelligence: {
          cognitiveLoad: 2,
          attentionEconomics: 'primary action component for user goals',
          accessibility: 'requires focus indicators and keyboard navigation',
          trustBuilding: 'consistent styling builds user confidence',
          semanticMeaning: 'actionable interface element for user tasks',
        },
      },
    },
  },
} as const;

// Validation functions using Zod schemas
export function validateAgentInstructions(data: unknown): string {
  return AgentInstructionsSchema.parse(data);
}

export function validateUtilsTemplate(data: unknown): string {
  return UtilsTemplateSchema.parse(data);
}

export function validateComponentRegistry(data: unknown): z.infer<typeof ComponentRegistrySchema> {
  return ComponentRegistrySchema.parse(data);
}

export function validateComponent(data: unknown): z.infer<typeof ComponentSchema> {
  return ComponentSchema.parse(data);
}