/**
 * Component Factory using Zod Schemas
 * Generates test component manifests using @anatine/zod-mock
 */

import { generateMock } from '@anatine/zod-mock';
import { type ComponentManifest, ComponentManifestSchema } from '@rafters/shared';

// biome-ignore lint/complexity/noStaticOnlyClass: Factory pattern for test data generation
export class ComponentFactory {
  /**
   * Generate a mock component manifest
   */
  static create(overrides?: Partial<ComponentManifest>): ComponentManifest {
    const mock = generateMock(ComponentManifestSchema, {
      seed: Date.now(), // Randomize
    });

    return {
      ...mock,
      ...overrides,
    };
  }

  /**
   * Create a button component manifest
   */
  static createButton(): ComponentManifest {
    return {
      name: 'button',
      type: 'registry:component',
      description: 'A button component with variants',
      files: [
        {
          path: 'components/ui/button.tsx',
          content: `import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
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
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
`,
          type: 'registry:component',
        },
      ],
      dependencies: ['@radix-ui/react-slot', 'class-variance-authority'],
      devDependencies: [],
      registryDependencies: [],
      meta: {
        rafters: {
          version: '1.0.0',
          intelligence: {
            cognitiveLoad: 2,
            attentionEconomics: 'minimal cognitive load',
            accessibility: 'WCAG AAA compliant',
            trustBuilding: 'consistent patterns',
            semanticMeaning: 'clear action intent',
          },
        },
      },
    };
  }

  /**
   * Create a card component manifest
   */
  static createCard(): ComponentManifest {
    return {
      name: 'card',
      type: 'registry:component',
      description: 'A card component for displaying content',
      files: [
        {
          path: 'components/ui/card.tsx',
          content: `import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
`,
          type: 'registry:component',
        },
      ],
      dependencies: [],
      devDependencies: [],
      registryDependencies: [],
      meta: {
        rafters: {
          version: '1.0.0',
          intelligence: {
            cognitiveLoad: 1,
            attentionEconomics: 'minimal cognitive load',
            accessibility: 'semantic HTML structure',
            trustBuilding: 'clear content hierarchy',
            semanticMeaning: 'content container',
          },
        },
      },
    };
  }

  /**
   * Create an input component manifest
   */
  static createInput(): ComponentManifest {
    return {
      name: 'input',
      type: 'registry:component',
      description: 'An input component for forms',
      files: [
        {
          path: 'components/ui/input.tsx',
          content: `import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
`,
          type: 'registry:component',
        },
      ],
      dependencies: [],
      devDependencies: [],
      registryDependencies: [],
      meta: {
        rafters: {
          version: '1.0.0',
          intelligence: {
            cognitiveLoad: 1,
            attentionEconomics: 'focused input',
            accessibility: 'WCAG AAA form input',
            trustBuilding: 'clear validation states',
            semanticMeaning: 'user input field',
          },
        },
      },
    };
  }

  /**
   * Create a primitive component manifest (r-button)
   */
  static createPrimitive(): ComponentManifest {
    return {
      name: 'r-button',
      type: 'registry:primitive',
      description: 'Headless button primitive with ARIA support',
      files: [
        {
          path: 'primitives/button/r-button.ts',
          content: `import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('r-button')
export class RButton extends LitElement {
  @property({ type: Boolean })
  disabled = false;

  @property({ type: String })
  type: 'button' | 'submit' | 'reset' = 'button';

  render() {
    return html\`
      <button
        type="\${this.type}"
        ?disabled="\${this.disabled}"
        role="button"
        tabindex="0"
      >
        <slot></slot>
      </button>
    \`;
  }
}
`,
          type: 'registry:primitive',
        },
      ],
      dependencies: ['lit'],
      devDependencies: [],
      registryDependencies: [],
      meta: {
        rafters: {
          version: '1.0.0',
          intelligence: {
            cognitiveLoad: 1,
            attentionEconomics: 'headless primitive',
            accessibility: 'WCAG AAA button',
            trustBuilding: 'reliable interaction',
            semanticMeaning: 'button primitive',
          },
        },
      },
    };
  }

  /**
   * Create a registry response with multiple components
   */
  static createRegistry(components: ComponentManifest[]) {
    return {
      components,
      version: '1.0.0',
    };
  }
}
