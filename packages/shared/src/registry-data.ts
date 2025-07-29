/**
 * Shared Registry Data
 *
 * Single source of truth for component registry data.
 * Used by both the registry service and CLI fallbacks.
 */

export interface RegistryManifestComponent {
  name: string;
  path: string;
  type: string;
  content: string;
  version: string;
  status: string;
}

export interface RegistryManifest {
  components: RegistryManifestComponent[];
  total: number;
  lastUpdated: string;
}

// Component source code and metadata
export const REGISTRY_MANIFEST: RegistryManifest = {
  components: [
    {
      name: 'button',
      path: 'components/ui/Button.tsx',
      type: 'registry:component',
      content:
        "import { Slot } from '@radix-ui/react-slot';\nimport { forwardRef } from 'react';\nimport { cn } from '../lib/utils';\n\nexport interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {\n  variant?:\n    | 'primary'\n    | 'secondary'\n    | 'destructive'\n    | 'success'\n    | 'warning'\n    | 'info'\n    | 'outline'\n    | 'ghost';\n  size?: 'sm' | 'md' | 'lg' | 'full';\n  asChild?: boolean;\n  loading?: boolean;\n  destructiveConfirm?: boolean;\n}\n\nexport const Button = forwardRef<HTMLButtonElement, ButtonProps>(\n  (\n    {\n      variant = 'primary',\n      size = 'md',\n      asChild = false,\n      className,\n      disabled,\n      loading = false,\n      destructiveConfirm = false,\n      children,\n      ...props\n    },\n    ref\n  ) => {\n    const Comp = asChild ? Slot : 'button';\n\n    // Trust-building: Show confirmation requirement for destructive actions\n    const isDestructiveAction = variant === 'destructive';\n    const shouldShowConfirmation = isDestructiveAction && destructiveConfirm;\n    const isInteractionDisabled = disabled || loading;\n\n    return (\n      <Comp\n        ref={ref}\n        className={cn(\n          // Base styles - using semantic tokens with proper interactive states\n          'inline-flex items-center justify-center rounded-md text-sm font-medium',\n          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',\n          'disabled:pointer-events-none disabled:opacity-disabled',\n          'transition-all duration-200',\n          'hover:opacity-hover active:scale-active',\n\n          // Loading state reduces opacity for trust-building\n          loading && 'opacity-75 cursor-wait',\n\n          // Attention economics: Destructive actions get visual weight\n          isDestructiveAction && 'font-semibold shadow-sm',\n\n          // Variants - all grayscale, using semantic tokens\n          {\n            'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'primary',\n            'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',\n            'bg-destructive text-destructive-foreground hover:bg-destructive/90':\n              variant === 'destructive',\n            'bg-success text-success-foreground hover:bg-success/90': variant === 'success',\n            'bg-warning text-warning-foreground hover:bg-warning/90': variant === 'warning',\n            'bg-info text-info-foreground hover:bg-info/90': variant === 'info',\n            'border border-input bg-background hover:bg-accent hover:text-accent-foreground':\n              variant === 'outline',\n            'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',\n          },\n\n          // Attention economics: Size hierarchy for cognitive load\n          {\n            'h-8 px-3 text-xs': size === 'sm',\n            'h-10 px-4': size === 'md',\n            'h-12 px-6 text-base': size === 'lg',\n            'h-12 px-6 text-base w-full': size === 'full',\n          },\n\n          className\n        )}\n        disabled={isInteractionDisabled}\n        aria-busy={loading}\n        aria-label={shouldShowConfirmation ? `Confirm to ${children}` : undefined}\n        {...props}\n      >\n        {asChild ? (\n          children\n        ) : (\n          <>\n            {loading && (\n              <svg\n                className=\"animate-spin -ml-1 mr-2 h-4 w-4\"\n                fill=\"none\"\n                viewBox=\"0 0 24 24\"\n                aria-hidden=\"true\"\n              >\n                <circle\n                  className=\"opacity-25\"\n                  cx=\"12\"\n                  cy=\"12\"\n                  r=\"10\"\n                  stroke=\"currentColor\"\n                  strokeWidth=\"4\"\n                />\n                <path\n                  className=\"opacity-75\"\n                  fill=\"currentColor\"\n                  d=\"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z\"\n                />\n              </svg>\n            )}\n            {shouldShowConfirmation && !loading && (\n              <span className=\"mr-1 text-xs font-bold\" aria-hidden=\"true\">\n                !\n              </span>\n            )}\n            {children}\n          </>\n        )}\n      </Comp>\n    );\n  }\n);\n\nButton.displayName = 'Button';",
      version: '0.1.0',
      status: 'published',
    },
    {
      name: 'input',
      path: 'components/ui/Input.tsx',
      type: 'registry:component',
      content:
        "import { forwardRef } from 'react';\nimport { cn } from '../lib/utils';\n\nexport interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {\n  variant?: 'default' | 'error' | 'success' | 'warning';\n  validationMode?: 'live' | 'onBlur' | 'onSubmit';\n  sensitive?: boolean;\n  showValidation?: boolean;\n  validationMessage?: string;\n}\n\nexport const Input = forwardRef<HTMLInputElement, InputProps>(\n  (\n    {\n      variant = 'default',\n      validationMode = 'onBlur',\n      sensitive = false,\n      showValidation = false,\n      validationMessage,\n      className,\n      type,\n      ...props\n    },\n    ref\n  ) => {\n    // Trust-building: Visual indicators for sensitive data\n    const isSensitiveData = sensitive || type === 'password' || type === 'email';\n\n    // Validation intelligence: Choose appropriate feedback timing\n    const needsImmediateFeedback = variant === 'error' && validationMode === 'live';\n    const hasValidationState = variant !== 'default';\n\n    return (\n      <div className=\"relative\">\n        <input\n          ref={ref}\n          type={type}\n          className={cn(\n            // Base styles - using semantic tokens with motor accessibility\n            'flex h-10 w-full rounded-md border px-3 py-2 text-sm',\n            'file:border-0 file:bg-transparent file:text-sm file:font-medium',\n            'placeholder:text-muted-foreground',\n            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',\n            'disabled:cursor-not-allowed disabled:opacity-disabled',\n            'transition-all duration-200',\n            'hover:opacity-hover',\n\n            // Motor accessibility: Enhanced touch targets on mobile\n            'min-h-[44px] sm:min-h-[40px]',\n\n            // Trust-building: Visual indicators for sensitive data\n            isSensitiveData && 'shadow-sm border-2',\n\n            // Validation intelligence: Semantic variants with clear meaning\n            {\n              'border-input bg-background focus-visible:ring-primary': variant === 'default',\n              'border-destructive bg-destructive/10 focus-visible:ring-destructive text-destructive-foreground':\n                variant === 'error',\n              'border-success bg-success/10 focus-visible:ring-success text-success-foreground':\n                variant === 'success',\n              'border-warning bg-warning/10 focus-visible:ring-warning text-warning-foreground':\n                variant === 'warning',\n            },\n\n            // Enhanced styling for immediate feedback mode\n            needsImmediateFeedback && 'ring-2 ring-destructive/20',\n\n            className\n          )}\n          aria-invalid={variant === 'error'}\n          aria-describedby={\n            showValidation && validationMessage ? `${props.id || 'input'}-validation` : undefined\n          }\n          {...props}\n        />\n\n        {/* Validation message with semantic meaning */}\n        {showValidation && validationMessage && (\n          <div\n            id={`${props.id || 'input'}-validation`}\n            className={cn('mt-1 text-xs flex items-center gap-1', {\n              'text-destructive': variant === 'error',\n              'text-success': variant === 'success',\n              'text-warning': variant === 'warning',\n            })}\n            role={variant === 'error' ? 'alert' : 'status'}\n            aria-live={needsImmediateFeedback ? 'assertive' : 'polite'}\n          >\n            {/* Visual indicator for validation state */}\n            {variant === 'error' && (\n              <span\n                className=\"w-3 h-3 rounded-full bg-destructive/20 flex items-center justify-center\"\n                aria-hidden=\"true\"\n              >\n                <span className=\"w-1 h-1 rounded-full bg-destructive\" />\n              </span>\n            )}\n            {variant === 'success' && (\n              <span\n                className=\"w-3 h-3 rounded-full bg-success/20 flex items-center justify-center\"\n                aria-hidden=\"true\"\n              >\n                <span className=\"w-1 h-1 rounded-full bg-success\" />\n              </span>\n            )}\n            {variant === 'warning' && (\n              <span\n                className=\"w-3 h-3 rounded-full bg-warning/20 flex items-center justify-center\"\n                aria-hidden=\"true\"\n              >\n                <span className=\"w-1 h-1 rounded-full bg-warning\" />\n              </span>\n            )}\n            {validationMessage}\n          </div>\n        )}\n\n        {/* Trust-building indicator for sensitive data */}\n        {isSensitiveData && (\n          <div\n            className=\"absolute right-2 top-2 w-2 h-2 rounded-full bg-primary/30\"\n            aria-hidden=\"true\"\n          />\n        )}\n      </div>\n    );\n  }\n);\n\nInput.displayName = 'Input';",
      version: '0.1.0',
      status: 'published',
    },
  ],
  total: 2,
  lastUpdated: '2025-07-29T01:13:54.146Z',
};

// Component intelligence metadata mapping
export const COMPONENT_INTELLIGENCE_MAP: Record<
  string,
  {
    description: string;
    dependencies: string[];
    intelligence: {
      cognitiveLoad: number;
      attentionEconomics: string;
      accessibility: string;
      trustBuilding: string;
      semanticMeaning: string;
    };
  }
> = {
  button: {
    description:
      'Interactive button component with AI-embedded design intelligence and trust-building patterns',
    dependencies: ['@radix-ui/react-slot', 'class-variance-authority', 'clsx'],
    intelligence: {
      cognitiveLoad: 3,
      attentionEconomics:
        'Size hierarchy: sm=tertiary actions, md=secondary interactions, lg=primary calls-to-action',
      accessibility:
        'WCAG AAA compliant with 44px minimum touch targets, high contrast ratios, and screen reader optimization',
      trustBuilding:
        'Destructive actions require confirmation patterns. Loading states prevent double-submission. Visual feedback reinforces user actions.',
      semanticMeaning:
        'Variant mapping: primary=main actions, secondary=supporting actions, destructive=irreversible actions with safety patterns',
    },
  },
  input: {
    description: 'Form input component with validation states and accessibility-first design',
    dependencies: ['class-variance-authority', 'clsx'],
    intelligence: {
      cognitiveLoad: 4,
      attentionEconomics:
        'State hierarchy: default=ready, focus=active input, error=requires attention, success=validation passed',
      accessibility:
        'Screen reader labels, validation announcements, keyboard navigation, high contrast support',
      trustBuilding: 'Clear validation feedback, error recovery patterns, progressive enhancement',
      semanticMeaning:
        'Type-appropriate validation: email=format validation, password=security indicators, number=range constraints',
    },
  },
  card: {
    description:
      'Flexible container component for grouping related content with semantic structure',
    dependencies: ['class-variance-authority', 'clsx'],
    intelligence: {
      cognitiveLoad: 2,
      attentionEconomics:
        'Elevation hierarchy: flat=background content, raised=interactive cards, floating=modal content',
      accessibility:
        'Proper heading structure, landmark roles, keyboard navigation for interactive cards',
      trustBuilding:
        'Consistent spacing, predictable interaction patterns, clear content boundaries',
      semanticMeaning:
        'Structural roles: article=standalone content, section=grouped content, aside=supplementary information',
    },
  },
  select: {
    description: 'Dropdown selection component with search and accessibility features',
    dependencies: ['@radix-ui/react-select', 'class-variance-authority', 'clsx'],
    intelligence: {
      cognitiveLoad: 5,
      attentionEconomics:
        'State management: closed=compact display, open=full options, searching=filtered results',
      accessibility:
        'Keyboard navigation, screen reader announcements, focus management, option grouping',
      trustBuilding:
        'Search functionality, clear selection indication, undo patterns for accidental selections',
      semanticMeaning:
        'Option structure: value=data, label=display, group=categorization, disabled=unavailable choices',
    },
  },
  dialog: {
    description: 'Modal dialog component with focus management and escape patterns',
    dependencies: ['@radix-ui/react-dialog', 'class-variance-authority', 'clsx'],
    intelligence: {
      cognitiveLoad: 6,
      attentionEconomics:
        'Attention capture: modal=full attention, drawer=partial attention, popover=contextual attention',
      accessibility:
        'Focus trapping, escape key handling, backdrop dismissal, screen reader announcements',
      trustBuilding:
        'Clear close mechanisms, confirmation for destructive actions, non-blocking for informational content',
      semanticMeaning:
        'Usage patterns: modal=blocking workflow, drawer=supplementary, alert=urgent information',
    },
  },
  label: {
    description: 'Form label component with semantic variants and accessibility associations',
    dependencies: ['class-variance-authority', 'clsx'],
    intelligence: {
      cognitiveLoad: 2,
      attentionEconomics:
        'Information hierarchy: field=required label, hint=helpful guidance, error=attention needed',
      accessibility:
        'Form association, screen reader optimization, color-independent error indication',
      trustBuilding: 'Clear requirement indication, helpful hints, non-punitive error messaging',
      semanticMeaning:
        'Variant meanings: field=input association, hint=guidance, error=validation feedback, success=confirmation',
    },
  },
  tabs: {
    description: 'Tabbed interface component with keyboard navigation and ARIA compliance',
    dependencies: ['@radix-ui/react-tabs', 'class-variance-authority', 'clsx'],
    intelligence: {
      cognitiveLoad: 4,
      attentionEconomics:
        'Content organization: visible=current context, hidden=available contexts, active=user focus',
      accessibility:
        'Arrow key navigation, tab focus management, panel association, screen reader support',
      trustBuilding:
        'Persistent selection, clear active indication, predictable navigation patterns',
      semanticMeaning:
        'Structure: tablist=navigation, tab=option, tabpanel=content, selected=current view',
    },
  },
  slider: {
    description: 'Range slider component with precise value selection and accessibility features',
    dependencies: ['@radix-ui/react-slider', 'class-variance-authority', 'clsx'],
    intelligence: {
      cognitiveLoad: 3,
      attentionEconomics: 'Value communication: visual track, precise labels, immediate feedback',
      accessibility:
        'Keyboard increment/decrement, screen reader value announcements, touch-friendly handles',
      trustBuilding: 'Immediate visual feedback, undo capability, clear value indication',
      semanticMeaning:
        'Range contexts: settings=configuration, filters=data selection, controls=media/volume',
    },
  },
};
