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
    {
      name: 'grid',
      path: 'components/ui/Grid.tsx',
      type: 'registry:component',
      content:
        "import { forwardRef } from 'react';\nimport { cn } from '../lib/utils';\n\ntype ResponsiveValue<T> =\n  | T\n  | {\n      base?: T;\n      sm?: T;\n      md?: T;\n      lg?: T;\n      xl?: T;\n      '2xl'?: T;\n    };\n\ntype BentoPattern = 'editorial' | 'dashboard' | 'feature-showcase' | 'portfolio';\ntype GridPreset = 'linear' | 'golden' | 'bento' | 'custom';\ntype ContentPriority = 'primary' | 'secondary' | 'tertiary';\n\nexport interface GridProps extends React.HTMLAttributes<HTMLElement> {\n  preset?: GridPreset;\n  bentoPattern?: BentoPattern;\n  columns?: ResponsiveValue<number | 'auto-fit' | 'auto-fill'>;\n  autoFit?: 'sm' | 'md' | 'lg' | string;\n  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'comfortable' | 'generous';\n  maxItems?: number | 'auto';\n  role?: 'presentation' | 'grid' | 'none';\n  ariaLabel?: string;\n  ariaLabelledBy?: string;\n  as?: 'div' | 'section' | 'main' | 'article';\n  onFocusChange?: (position: { row: number; col: number }) => void;\n  children: React.ReactNode;\n}\n\nexport interface GridItemProps extends React.HTMLAttributes<HTMLElement> {\n  colSpan?: ResponsiveValue<number>;\n  rowSpan?: ResponsiveValue<number>;\n  priority?: ContentPriority;\n  role?: 'gridcell' | 'none';\n  ariaLabel?: string;\n  focusable?: boolean;\n  as?: 'div' | 'article' | 'section';\n  children: React.ReactNode;\n}\n\nconst GRID_PRESETS = {\n  linear: {\n    responsive: {\n      base: 'grid-cols-1',\n      sm: 'sm:grid-cols-2',\n      md: 'md:grid-cols-2', \n      lg: 'lg:grid-cols-3',\n      xl: 'xl:grid-cols-4'\n    }\n  },\n  golden: {\n    responsive: {\n      base: 'grid-cols-1',\n      sm: 'sm:grid-cols-2',\n      md: 'md:grid-cols-3',\n      lg: 'lg:grid-cols-5',\n      xl: 'xl:grid-cols-5'\n    }\n  },\n  bento: {\n    responsive: {\n      base: 'grid-cols-1',\n      sm: 'sm:grid-cols-2', \n      md: 'md:grid-cols-3',\n      lg: 'lg:grid-cols-3'\n    },\n    patterns: {\n      editorial: {\n        template: 'lg:grid-cols-3 lg:grid-rows-2',\n        primarySpan: 'lg:col-span-2 lg:row-span-2',\n        secondarySpan: 'lg:col-span-1 lg:row-span-1'\n      },\n      dashboard: {\n        template: 'lg:grid-cols-4 lg:grid-rows-2',\n        primarySpan: 'lg:col-span-2 lg:row-span-1',\n        secondarySpan: 'lg:col-span-1 lg:row-span-1'\n      },\n      'feature-showcase': {\n        template: 'lg:grid-cols-3 lg:grid-rows-3',\n        primarySpan: 'lg:col-span-2 lg:row-span-2',\n        secondarySpan: 'lg:col-span-1 lg:row-span-1'\n      },\n      portfolio: {\n        template: 'lg:grid-cols-4 lg:grid-rows-3',\n        primarySpan: 'lg:col-span-2 lg:row-span-2',\n        secondarySpan: 'lg:col-span-1 lg:row-span-1'\n      }\n    }\n  }\n};\n\nconst GAP_CLASSES = {\n  xs: 'gap-2',\n  sm: 'gap-3', \n  md: 'gap-4',\n  lg: 'gap-6',\n  xl: 'gap-8',\n  comfortable: 'gap-[1.618rem]',\n  generous: 'gap-[2.618rem]'\n};\n\nconst AUTO_FIT_WIDTHS = {\n  sm: '200px',\n  md: '280px', \n  lg: '360px'\n};\n\nconst PRIORITY_SPANS = {\n  primary: { colSpan: 2, rowSpan: 2 },\n  secondary: { colSpan: 1, rowSpan: 1 },\n  tertiary: { colSpan: 1, rowSpan: 1 }\n};\n\nexport const Grid = forwardRef<HTMLElement, GridProps>(\n  ({\n    preset = 'linear',\n    bentoPattern = 'editorial',\n    columns,\n    autoFit,\n    gap = 'md',\n    maxItems = 'auto',\n    role = 'presentation',\n    ariaLabel,\n    ariaLabelledBy,\n    as = 'div',\n    onFocusChange,\n    className,\n    children,\n    ...props\n  }, ref) => {\n    const Component = as;\n    const presetConfig = GRID_PRESETS[preset];\n\n    const getGridClasses = () => {\n      const classes = ['grid'];\n      \n      if (preset !== 'custom' && presetConfig?.responsive) {\n        Object.values(presetConfig.responsive).forEach(cls => cls && classes.push(cls));\n      }\n      \n      if (preset === 'bento' && presetConfig?.patterns) {\n        const pattern = presetConfig.patterns[bentoPattern];\n        if (pattern) classes.push(pattern.template);\n      }\n      \n      if (preset === 'custom' && columns) {\n        if (typeof columns === 'object' && 'base' in columns) {\n          if (columns.base) classes.push(`grid-cols-${columns.base}`);\n          if (columns.sm) classes.push(`sm:grid-cols-${columns.sm}`);\n          if (columns.md) classes.push(`md:grid-cols-${columns.md}`);\n          if (columns.lg) classes.push(`lg:grid-cols-${columns.lg}`);\n          if (columns.xl) classes.push(`xl:grid-cols-${columns.xl}`);\n          if (columns['2xl']) classes.push(`2xl:grid-cols-${columns['2xl']}`);\n        } else if (typeof columns === 'number') {\n          classes.push(`grid-cols-${columns}`);\n        }\n      }\n      \n      classes.push(GAP_CLASSES[gap]);\n      return classes;\n    };\n\n    const getInlineStyles = () => {\n      const styles = {};\n      \n      if (autoFit) {\n        const minWidth = AUTO_FIT_WIDTHS[autoFit] || autoFit;\n        styles.gridTemplateColumns = `repeat(auto-fit, minmax(${minWidth}, 1fr))`;\n      }\n      \n      if (preset === 'custom' && typeof columns === 'string') {\n        const minWidth = autoFit ? (AUTO_FIT_WIDTHS[autoFit] || autoFit) : '250px';\n        if (columns === 'auto-fit') {\n          styles.gridTemplateColumns = `repeat(auto-fit, minmax(${minWidth}, 1fr))`;\n        } else if (columns === 'auto-fill') {\n          styles.gridTemplateColumns = `repeat(auto-fill, minmax(${minWidth}, 1fr))`;\n        }\n      }\n      \n      if (gap === 'comfortable') styles.gap = '1.618rem';\n      if (gap === 'generous') styles.gap = '2.618rem';\n      \n      return styles;\n    };\n\n    return (\n      <Component\n        ref={ref}\n        role={role}\n        aria-label={ariaLabel}\n        aria-labelledby={ariaLabelledBy}\n        tabIndex={role === 'grid' ? 0 : undefined}\n        className={cn(\n          ...getGridClasses(),\n          role === 'grid' && [\n            'focus-visible:outline-none',\n            'focus-visible:ring-2', \n            'focus-visible:ring-primary',\n            'focus-visible:ring-offset-2'\n          ],\n          className\n        )}\n        style={{ ...getInlineStyles(), ...props.style }}\n        {...props}\n      >\n        {children}\n      </Component>\n    );\n  }\n);\n\nexport const GridItem = forwardRef<HTMLElement, GridItemProps>(\n  ({\n    colSpan,\n    rowSpan,\n    priority,\n    role = 'none',\n    ariaLabel,\n    focusable = false,\n    as = 'div',\n    className,\n    children,\n    ...props\n  }, ref) => {\n    const Component = as;\n    \n    const getPrioritySpans = () => {\n      if (priority && PRIORITY_SPANS[priority]) {\n        const spans = PRIORITY_SPANS[priority];\n        return { colSpan: spans.colSpan, rowSpan: spans.rowSpan };\n      }\n      return { colSpan, rowSpan };\n    };\n\n    const { colSpan: finalColSpan, rowSpan: finalRowSpan } = getPrioritySpans();\n\n    const getSpanClasses = () => {\n      const classes = [];\n      \n      if (finalColSpan) {\n        if (typeof finalColSpan === 'object' && 'base' in finalColSpan) {\n          if (finalColSpan.base) classes.push(`col-span-${finalColSpan.base}`);\n          if (finalColSpan.sm) classes.push(`sm:col-span-${finalColSpan.sm}`);\n          if (finalColSpan.md) classes.push(`md:col-span-${finalColSpan.md}`);\n          if (finalColSpan.lg) classes.push(`lg:col-span-${finalColSpan.lg}`);\n          if (finalColSpan.xl) classes.push(`xl:col-span-${finalColSpan.xl}`);\n          if (finalColSpan['2xl']) classes.push(`2xl:col-span-${finalColSpan['2xl']}`);\n        } else {\n          classes.push(`col-span-${finalColSpan}`);\n        }\n      }\n      \n      if (finalRowSpan) {\n        if (typeof finalRowSpan === 'object' && 'base' in finalRowSpan) {\n          if (finalRowSpan.base) classes.push(`row-span-${finalRowSpan.base}`);\n          if (finalRowSpan.sm) classes.push(`sm:row-span-${finalRowSpan.sm}`);\n          if (finalRowSpan.md) classes.push(`md:row-span-${finalRowSpan.md}`);\n          if (finalRowSpan.lg) classes.push(`lg:row-span-${finalRowSpan.lg}`);\n          if (finalRowSpan.xl) classes.push(`xl:row-span-${finalRowSpan.xl}`);\n          if (finalRowSpan['2xl']) classes.push(`2xl:row-span-${finalRowSpan['2xl']}`);\n        } else {\n          classes.push(`row-span-${finalRowSpan}`);\n        }\n      }\n      \n      return classes;\n    };\n\n    return (\n      <Component\n        ref={ref}\n        role={role}\n        aria-label={ariaLabel}\n        tabIndex={focusable ? 0 : undefined}\n        className={cn(\n          ...getSpanClasses(),\n          focusable && [\n            'focus-visible:outline-none',\n            'focus-visible:ring-2',\n            'focus-visible:ring-primary',\n            'focus-visible:ring-offset-1'\n          ],\n          role === 'gridcell' && ['min-h-[44px]', 'min-w-[44px]'],\n          className\n        )}\n        {...props}\n      >\n        {children}\n      </Component>\n    );\n  }\n);\n\nGrid.displayName = 'Grid';\nGridItem.displayName = 'GridItem';",
      version: '0.1.0',
      status: 'published',
    },
    {
      name: 'sidebar',
      path: 'components/ui/Sidebar.tsx',
      type: 'registry:component',
      content:
        "import { contextEasing, contextTiming, timing } from '@rafters/design-tokens/motion';\nimport React, { useCallback, useEffect } from 'react';\nimport { z } from 'zod';\nimport { cn } from '../lib/utils';\nimport {\n  useSidebarActions,\n  useSidebarCollapsed,\n  useSidebarCurrentPath,\n  useSidebarStore,\n} from '../stores/sidebarStore';\n\n// Zod validation schemas for external data\nconst NavigationPathSchema = z\n  .string()\n  .min(1, 'Path cannot be empty')\n  .startsWith('/', 'Path must start with /');\nconst HrefSchema = z.string().refine((val) => {\n  try {\n    new URL(val);\n    return true;\n  } catch {\n    return val.startsWith('/');\n  }\n}, 'Must be a valid URL or path starting with /');\n\n// Legacy hook for accessing sidebar state (now uses zustand)\nexport const useSidebar = () => {\n  const collapsed = useSidebarCollapsed();\n  const currentPath = useSidebarCurrentPath();\n  const collapsible = useSidebarStore((state) => state.collapsible);\n  const { toggleCollapsed, navigate } = useSidebarActions();\n\n  return {\n    collapsed,\n    collapsible,\n    currentPath,\n    onNavigate: navigate,\n    toggleCollapsed,\n  };\n};\n\n// Main sidebar props with navigation intelligence\nexport interface SidebarProps extends React.HTMLAttributes<HTMLElement> {\n  // Navigation state and behavior\n  collapsed?: boolean;\n  collapsible?: boolean;\n  defaultCollapsed?: boolean;\n  currentPath?: string;\n  onNavigate?: (path: string) => void;\n  onCollapsedChange?: (collapsed: boolean) => void;\n\n  // Design intelligence configuration\n  variant?: 'default' | 'floating' | 'overlay';\n  size?: 'compact' | 'comfortable' | 'spacious';\n  position?: 'left' | 'right';\n\n  // Accessibility and navigation support\n  ariaLabel?: string;\n  skipLinkTarget?: string;\n  landmark?: boolean;\n\n  // Progressive enhancement\n  persistCollapsedState?: boolean;\n  reduceMotion?: boolean;\n\n  // Trust-building\n  showBreadcrumb?: boolean;\n  highlightCurrent?: boolean;\n\n  children: React.ReactNode;\n}\n\n// Main Sidebar component with full navigation intelligence (using zustand)\nexport const Sidebar: React.FC<SidebarProps> = ({\n  collapsed: controlledCollapsed,\n  collapsible = true,\n  defaultCollapsed = false,\n  currentPath,\n  onNavigate,\n  onCollapsedChange,\n  variant = 'default',\n  size = 'comfortable',\n  position = 'left',\n  ariaLabel = 'Main navigation',\n  skipLinkTarget,\n  landmark = true,\n  persistCollapsedState = true,\n  reduceMotion = false,\n  showBreadcrumb = false,\n  highlightCurrent = true,\n  className,\n  children,\n  ...props\n}) => {\n  // Use zustand store for state management\n  const storeCollapsed = useSidebarCollapsed();\n  const { initialize, updatePreferences, setCurrentPath, setCollapsible } = useSidebarActions();\n\n  // Initialize store on mount\n  useEffect(() => {\n    initialize({\n      collapsed: controlledCollapsed ?? defaultCollapsed,\n      currentPath: currentPath,\n      collapsible,\n      userPreferences: {\n        persistCollapsed: persistCollapsedState,\n        position,\n        size,\n        variant,\n        reduceMotion,\n      },\n    });\n  }, [\n    initialize,\n    controlledCollapsed,\n    defaultCollapsed,\n    currentPath,\n    collapsible,\n    persistCollapsedState,\n    position,\n    size,\n    variant,\n    reduceMotion,\n  ]);\n\n  // Handle controlled vs uncontrolled collapsed state\n  const isCollapsed = controlledCollapsed ?? storeCollapsed;\n\n  return (\n    <nav\n      className={cn(\n        // Base navigation styles with spatial consistency\n        'flex flex-col bg-background border-r border-border',\n        'relative transition-all',\n        !reduceMotion && contextTiming.navigation,\n        !reduceMotion && contextEasing.navigation,\n\n        // Variant-based styling for different use cases\n        {\n          'shadow-none': variant === 'default',\n          'shadow-lg rounded-lg border': variant === 'floating',\n          'fixed inset-y-0 z-50 shadow-xl': variant === 'overlay',\n        },\n\n        // Size variants for cognitive load management\n        {\n          'w-60': size === 'compact' && !isCollapsed,\n          'w-72': size === 'comfortable' && !isCollapsed,\n          'w-80': size === 'spacious' && !isCollapsed,\n          'w-16': isCollapsed && collapsible,\n        },\n\n        className\n      )}\n      role={landmark ? 'navigation' : undefined}\n      aria-label={ariaLabel}\n      aria-expanded={collapsible ? !isCollapsed : undefined}\n      {...props}\n    >\n      {children}\n    </nav>\n  );\n};\n\n// Component implementations for SidebarHeader, SidebarContent, SidebarItem, etc.\n// Full implementations available in the complete component file\n\nSidebar.displayName = 'Sidebar';",
      version: '0.1.0',
      status: 'published',
    },
  ],
  total: 4,
  lastUpdated: '2025-08-13T20:41:00.000Z',
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
  grid: {
    description:
      'Intelligent layout grid with 4 semantic presets and embedded design reasoning for AI agents',
    dependencies: ['class-variance-authority', 'clsx'],
    intelligence: {
      cognitiveLoad: 4,
      attentionEconomics:
        'Preset hierarchy: linear=democratic attention, golden=hierarchical flow, bento=complex attention patterns, custom=user-defined',
      accessibility:
        'WCAG AAA compliance with keyboard navigation, screen reader patterns, and ARIA grid support for interactive layouts',
      trustBuilding:
        "Mathematical spacing (golden ratio), Miller's Law cognitive load limits, consistent preset behavior builds user confidence",
      semanticMeaning:
        'Layout intelligence: linear=equal-priority content, golden=natural hierarchy, bento=content showcases with semantic asymmetry, custom=specialized layouts',
    },
  },
  sidebar: {
    description:
      'Comprehensive navigation sidebar with embedded wayfinding intelligence and progressive disclosure patterns',
    dependencies: [
      '@rafters/design-tokens',
      'zustand',
      'zod',
      'lucide-react',
      'class-variance-authority',
      'clsx',
    ],
    intelligence: {
      cognitiveLoad: 6,
      attentionEconomics:
        'Secondary support system: Never competes with primary content, uses muted variants and compact sizing for attention hierarchy',
      accessibility:
        'WCAG AAA compliance with skip links, keyboard navigation, screen reader optimization, and motion sensitivity support',
      trustBuilding:
        "Spatial consistency builds user confidence, zustand state persistence remembers preferences, Miller's Law enforcement prevents cognitive overload",
      semanticMeaning:
        'Navigation intelligence: Progressive disclosure for complex hierarchies, semantic grouping by domain, wayfinding through active state indication with zustand state machine',
    },
  },
};
