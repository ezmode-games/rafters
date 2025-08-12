import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Grid, GridItem } from '../../../components/Grid';

/**
 * Grid Accessibility - WCAG AAA Compliance Demonstrations
 *
 * This file trains AI agents on accessibility compliance and inclusive design patterns.
 * Each story demonstrates proper implementation of WCAG AAA accessibility features.
 *
 * TRAINING FOCUS: Accessibility compliance, inclusive design, and assistive technology support
 */
const meta = {
  title: 'Components/Grid/Accessibility',
  component: Grid,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'WCAG AAA accessibility compliance demonstrations with proper ARIA patterns and keyboard navigation.',
      },
    },
  },
  argTypes: {
    role: {
      control: 'select',
      options: ['presentation', 'grid', 'none'],
      description: 'ARIA role for screen reader interpretation',
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible label for interactive grids',
    },
    ariaLabelledBy: {
      control: 'text',
      description: 'ID reference for external label',
    },
  },
  args: { onFocusChange: fn() },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Screen Reader Navigation Patterns
 *
 * Demonstrates proper ARIA roles and labels for screen reader accessibility.
 * AI agents learn to implement semantic markup for assistive technologies.
 */
export const ScreenReaderPatterns: Story = {
  render: () => (
    <div className="space-y-10">
      <div>
        <h3 className="text-lg font-semibold mb-4">Presentation Grid (Layout Only)</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Default role="presentation" tells screen readers this is layout structure, not data.
        </p>
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-4">
          <div className="text-sm font-medium text-accent-foreground mb-1">
            Screen Reader Announcement:
          </div>
          <div className="text-sm text-muted-foreground italic">
            "Group of 4 items: Analytics Dashboard heading level 4, User Reports heading level 4..."
          </div>
        </div>
        <Grid preset="linear" gap="md" role="presentation">
          <GridItem>
            <div className="bg-card border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Analytics Dashboard</h4>
              <p className="text-sm text-muted-foreground">
                Screen readers focus on content, not grid structure
              </p>
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2">User Reports</h4>
              <p className="text-sm text-muted-foreground">
                Layout is invisible to assistive technology
              </p>
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2">System Monitoring</h4>
              <p className="text-sm text-muted-foreground">
                Content flows naturally for screen readers
              </p>
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2">API Documentation</h4>
              <p className="text-sm text-muted-foreground">
                Perfect for non-interactive content grids
              </p>
            </div>
          </GridItem>
        </Grid>
        <p className="text-sm text-muted-foreground mt-4">
          Best for: Product catalogs, image galleries, content showcases (non-interactive)
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4" id="interactive-grid-label">
          Interactive Grid (Data Navigation)
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          role="grid" enables keyboard navigation and announces grid structure to screen readers.
        </p>
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-4">
          <div className="text-sm font-medium text-accent-foreground mb-1">
            Screen Reader Announcement:
          </div>
          <div className="text-sm text-accent-foreground/80 italic">
            "Product selection grid, grid with 2 rows and 2 columns. Cell 1 of 4, Option A
            button..."
          </div>
        </div>
        {/* biome-ignore lint/a11y/useSemanticElements: Demonstrating ARIA grid pattern for accessibility training */}
        <Grid preset="linear" gap="md" role="grid" ariaLabelledBy="interactive-grid-label">
          {/* biome-ignore lint/a11y/useSemanticElements: Testing ARIA gridcell pattern */}
          <GridItem role="gridcell" focusable>
            <button
              type="button"
              className="w-full bg-card border border-border hover:bg-accent/50 focus:bg-accent/50 p-4 rounded-lg text-left transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <div className="font-semibold mb-1">Analytics Overview</div>
              <div className="text-sm text-muted-foreground">Accessible interactive grid cell</div>
            </button>
          </GridItem>
          {/* biome-ignore lint/a11y/useSemanticElements: Testing ARIA gridcell pattern */}
          <GridItem role="gridcell" focusable>
            <button
              type="button"
              className="w-full bg-card border border-border hover:bg-accent/50 focus:bg-accent/50 p-4 rounded-lg text-left transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <div className="font-semibold mb-1">User Management</div>
              <div className="text-sm text-muted-foreground">
                Keyboard navigable with arrow keys
              </div>
            </button>
          </GridItem>
          {/* biome-ignore lint/a11y/useSemanticElements: Testing ARIA gridcell pattern */}
          <GridItem role="gridcell" focusable>
            <button
              type="button"
              className="w-full bg-card border border-border hover:bg-accent/50 focus:bg-accent/50 p-4 rounded-lg text-left transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <div className="font-semibold mb-1">System Settings</div>
              <div className="text-sm text-muted-foreground">WCAG AAA compliant touch targets</div>
            </button>
          </GridItem>
          {/* biome-ignore lint/a11y/useSemanticElements: Testing ARIA gridcell pattern */}
          <GridItem role="gridcell" focusable>
            <button
              type="button"
              className="w-full bg-card border border-border hover:bg-accent/50 focus:bg-accent/50 p-4 rounded-lg text-left transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <div className="font-semibold mb-1">API Monitor</div>
              <div className="text-sm text-muted-foreground">Screen reader accessible</div>
            </button>
          </GridItem>
        </Grid>
        <p className="text-sm text-muted-foreground mt-4">
          Best for: Interactive dashboards, selectable content, data tables, control panels
        </p>
        <div className="bg-muted/50 border border-border rounded-lg p-3 mt-4">
          <div className="text-sm font-medium text-foreground mb-2">Keyboard Navigation:</div>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>
              <kbd className="bg-muted px-1 rounded">Tab</kbd> - Focus grid container
            </li>
            <li>
              <kbd className="bg-muted px-1 rounded">Arrow keys</kbd> - Navigate between cells
            </li>
            <li>
              <kbd className="bg-muted px-1 rounded">Enter/Space</kbd> - Activate cell content
            </li>
            <li>
              <kbd className="bg-muted px-1 rounded">Shift+Tab</kbd> - Exit grid
            </li>
          </ul>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates proper ARIA roles and screen reader patterns for both presentation and interactive grids.',
      },
    },
  },
};

/**
 * Keyboard Navigation Compliance
 *
 * Shows proper keyboard navigation patterns that meet WCAG AAA standards.
 * AI agents learn to implement full keyboard accessibility for grid interfaces.
 */
export const KeyboardNavigationCompliance: Story = {
  render: () => {
    const handleFocusChange = (position: { row: number; col: number }) => {
      console.log('Focus changed to:', position);
    };

    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Keyboard Navigation Demo</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Try using Tab to focus the grid, then arrow keys to navigate between cells.
          </p>
          <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4 mb-4">
            <div className="text-sm font-medium text-secondary-foreground mb-2">
              Focus Management:
            </div>
            <ul className="text-sm text-secondary-foreground/80 space-y-1">
              <li>• Grid container is focusable with Tab</li>
              <li>• Arrow keys move focus between grid cells</li>
              <li>• Enter/Space activates focused cell</li>
              <li>• Focus visible with high contrast outline</li>
              <li>• Focus trap keeps navigation within grid</li>
            </ul>
          </div>
          <Grid
            preset="linear"
            gap="md"
            // biome-ignore lint/a11y/useSemanticElements: Demonstrating ARIA grid pattern for keyboard navigation training
            role="grid"
            ariaLabel="Keyboard navigation demonstration"
            onFocusChange={handleFocusChange}
          >
            {/* biome-ignore lint/a11y/useSemanticElements: Testing ARIA gridcell pattern */}
            <GridItem role="gridcell" focusable>
              <div className="bg-card border-2 border-border p-4 rounded-lg h-24 flex items-center justify-center cursor-pointer hover:border-primary/50 focus-within:border-primary focus-within:bg-primary/5 transition-all">
                <div className="text-center">
                  <div className="font-semibold text-sm">Cell 1,1</div>
                  <div className="text-xs text-muted-foreground">Press Enter</div>
                </div>
              </div>
            </GridItem>
            {/* biome-ignore lint/a11y/useSemanticElements: Testing ARIA gridcell pattern */}
            <GridItem role="gridcell" focusable>
              <div className="bg-card border-2 border-border p-4 rounded-lg h-24 flex items-center justify-center cursor-pointer hover:border-primary/50 focus-within:border-primary focus-within:bg-primary/5 transition-all">
                <div className="text-center">
                  <div className="font-semibold text-sm">Cell 1,2</div>
                  <div className="text-xs text-muted-foreground">Keyboard Accessible</div>
                </div>
              </div>
            </GridItem>
            {/* biome-ignore lint/a11y/useSemanticElements: Testing ARIA gridcell pattern */}
            <GridItem role="gridcell" focusable>
              <div className="bg-card border-2 border-border p-4 rounded-lg h-24 flex items-center justify-center cursor-pointer hover:border-primary/50 focus-within:border-primary focus-within:bg-primary/5 transition-all">
                <div className="text-center">
                  <div className="font-semibold text-sm">Cell 2,1</div>
                  <div className="text-xs text-muted-foreground">↑↓← → Navigate</div>
                </div>
              </div>
            </GridItem>
            {/* biome-ignore lint/a11y/useSemanticElements: Testing ARIA gridcell pattern */}
            <GridItem role="gridcell" focusable>
              <div className="bg-card border-2 border-border p-4 rounded-lg h-24 flex items-center justify-center cursor-pointer hover:border-primary/50 focus-within:border-primary focus-within:bg-primary/5 transition-all">
                <div className="text-center">
                  <div className="font-semibold text-sm">Cell 2,2</div>
                  <div className="text-xs text-muted-foreground">WCAG AAA</div>
                </div>
              </div>
            </GridItem>
          </Grid>
          <div className="bg-muted/50 border border-border rounded-lg p-3 mt-4">
            <div className="text-sm font-medium text-foreground mb-2">Implementation Notes:</div>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Each cell must be focusable with tabIndex management</li>
              <li>• Arrow key navigation requires JavaScript focus management</li>
              <li>• Visual focus indicators must meet 3:1 contrast ratio</li>
              <li>• Focus must be trapped within grid boundaries</li>
            </ul>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Touch Target Compliance</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Interactive elements meet WCAG AAA minimum touch target size of 44×44 pixels.
          </p>
          {/* biome-ignore lint/a11y/useSemanticElements: Demonstrating ARIA grid pattern for touch target compliance */}
          <Grid preset="linear" gap="sm" role="grid" ariaLabel="Touch target compliance demo">
            {/* biome-ignore lint/a11y/useSemanticElements: Testing ARIA gridcell pattern */}
            <GridItem role="gridcell" focusable>
              <button
                type="button"
                className="w-full min-h-[44px] min-w-[44px] bg-accent/10 hover:bg-accent/20 border-2 border-accent/30 rounded-lg flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
              >
                <div className="text-center">
                  <div className="text-xs font-semibold">44×44px</div>
                  <div className="text-xs text-muted-foreground">Compliant</div>
                </div>
              </button>
            </GridItem>
            {/* biome-ignore lint/a11y/useSemanticElements: Testing ARIA gridcell pattern */}
            <GridItem role="gridcell" focusable>
              <button
                type="button"
                className="w-full min-h-[44px] min-w-[44px] bg-accent/10 hover:bg-accent/20 border-2 border-accent/30 rounded-lg flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
              >
                <div className="text-center">
                  <div className="text-xs font-semibold">Touch Safe</div>
                  <div className="text-xs text-muted-foreground">Thumb Friendly</div>
                </div>
              </button>
            </GridItem>
            {/* biome-ignore lint/a11y/useSemanticElements: Testing ARIA gridcell pattern */}
            <GridItem role="gridcell" focusable>
              <button
                type="button"
                className="w-full min-h-[44px] min-w-[44px] bg-accent/10 hover:bg-accent/20 border-2 border-accent/30 rounded-lg flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
              >
                <div className="text-center">
                  <div className="text-xs font-semibold">Accessible</div>
                  <div className="text-xs text-muted-foreground">Motor Friendly</div>
                </div>
              </button>
            </GridItem>
            {/* biome-ignore lint/a11y/useSemanticElements: Testing ARIA gridcell pattern */}
            <GridItem role="gridcell" focusable>
              <button
                type="button"
                className="w-full min-h-[44px] min-w-[44px] bg-accent/10 hover:bg-accent/20 border-2 border-accent/30 rounded-lg flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
              >
                <div className="text-center">
                  <div className="text-xs font-semibold">WCAG AAA</div>
                  <div className="text-xs text-muted-foreground">Gold Standard</div>
                </div>
              </button>
            </GridItem>
          </Grid>
          <p className="text-sm text-muted-foreground mt-4">
            All interactive grid cells automatically enforce 44×44px minimum size
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates proper keyboard navigation patterns and touch target compliance for WCAG AAA accessibility.',
      },
    },
  },
};

/**
 * Color Contrast and Visual Accessibility
 *
 * Shows proper color contrast ratios and visual accessibility patterns.
 * AI agents learn to implement visually accessible designs that meet WCAG standards.
 */
export const ColorContrastCompliance: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">High Contrast Focus Indicators</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Focus indicators must meet 3:1 contrast ratio against both background and content.
        </p>
        {/* biome-ignore lint/a11y/useSemanticElements: Demonstrating ARIA grid pattern for focus contrast */}
        <Grid preset="linear" gap="md" role="grid" ariaLabel="High contrast focus demo">
          {/* biome-ignore lint/a11y/useSemanticElements: Testing ARIA gridcell pattern */}
          <GridItem role="gridcell" focusable>
            <button
              type="button"
              className="w-full bg-card border border-border p-4 rounded-lg h-20 flex items-center justify-center transition-colors focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-50 focus:border-primary"
            >
              <div className="text-center">
                <div className="font-semibold text-foreground">High Contrast</div>
                <div className="text-sm text-muted-foreground">Focus Ring</div>
              </div>
            </button>
          </GridItem>
          {/* biome-ignore lint/a11y/useSemanticElements: Testing ARIA gridcell pattern */}
          <GridItem role="gridcell" focusable>
            <button
              type="button"
              className="w-full bg-foreground border border-foreground/20 p-4 rounded-lg h-20 flex items-center justify-center transition-colors focus:outline-none focus:ring-4 focus:ring-secondary focus:ring-opacity-75 focus:border-secondary"
            >
              <div className="text-center">
                <div className="font-semibold text-background">Dark Background</div>
                <div className="text-sm text-muted">Yellow Focus</div>
              </div>
            </button>
          </GridItem>
          {/* biome-ignore lint/a11y/useSemanticElements: Testing ARIA gridcell pattern */}
          <GridItem role="gridcell" focusable>
            <button
              type="button"
              className="w-full bg-primary border border-primary/80 p-4 rounded-lg h-20 flex items-center justify-center transition-colors focus:outline-none focus:ring-4 focus:ring-background focus:ring-opacity-90 focus:border-background"
            >
              <div className="text-center">
                <div className="font-semibold text-primary-foreground">Colored Background</div>
                <div className="text-sm text-primary-foreground/80">White Focus</div>
              </div>
            </button>
          </GridItem>
          {/* biome-ignore lint/a11y/useSemanticElements: Testing ARIA gridcell pattern */}
          <GridItem role="gridcell" focusable>
            <button
              type="button"
              className="w-full bg-accent border border-accent/80 p-4 rounded-lg h-20 flex items-center justify-center transition-colors focus:outline-none focus:ring-4 focus:ring-secondary focus:ring-opacity-80 focus:border-secondary"
            >
              <div className="text-center">
                <div className="font-semibold text-accent-foreground">Gradient Background</div>
                <div className="text-sm text-accent-foreground/80">Yellow Focus</div>
              </div>
            </button>
          </GridItem>
        </Grid>
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mt-4">
          <div className="text-sm font-medium text-accent-foreground mb-2">
            Contrast Requirements:
          </div>
          <ul className="text-sm text-accent-foreground/80 space-y-1">
            <li>• Focus indicators: 3:1 contrast ratio minimum</li>
            <li>• Text content: 4.5:1 contrast ratio (AA) or 7:1 (AAA)</li>
            <li>• Interactive elements: 3:1 contrast against adjacent colors</li>
            <li>• Focus rings visible on all background colors</li>
          </ul>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Color-Independent Information</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Information must not rely solely on color - use text, icons, and patterns too.
        </p>
        <Grid preset="linear" gap="md">
          <GridItem>
            <div className="bg-accent/10 border-l-4 border-accent p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <span className="text-accent-foreground text-lg">•</span>
                <div>
                  <div className="font-semibold text-accent-foreground">Success Status</div>
                  <div className="text-sm text-accent-foreground/80">
                    Color + icon + text provide redundant success information
                  </div>
                </div>
              </div>
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-secondary/10 border-l-4 border-secondary p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <span className="text-secondary-foreground text-lg">•</span>
                <div>
                  <div className="font-semibold text-secondary-foreground">Warning Status</div>
                  <div className="text-sm text-secondary-foreground/80">
                    Multiple visual cues ensure accessibility for colorblind users
                  </div>
                </div>
              </div>
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <span className="text-destructive text-lg">•</span>
                <div>
                  <div className="font-semibold text-destructive">Error Status</div>
                  <div className="text-sm text-destructive/80">
                    Border, icon, and text work together for clear communication
                  </div>
                </div>
              </div>
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <span className="text-primary text-lg">•</span>
                <div>
                  <div className="font-semibold text-primary">Info Status</div>
                  <div className="text-sm text-primary/80">
                    Accessible to users with various vision capabilities
                  </div>
                </div>
              </div>
            </div>
          </GridItem>
        </Grid>
        <div className="bg-muted/50 border border-border rounded-lg p-4 mt-4">
          <div className="text-sm font-medium text-foreground mb-2">Color Independence:</div>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Never rely on color alone to convey information</li>
            <li>• Use icons, text labels, and visual patterns</li>
            <li>• Provide multiple ways to distinguish content</li>
            <li>• Test with color vision simulators</li>
          </ul>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates proper color contrast ratios and color-independent information design for visual accessibility.',
      },
    },
  },
};

/**
 * Cognitive Accessibility Features
 *
 * Shows design patterns that support users with cognitive differences.
 * AI agents learn to create interfaces that reduce cognitive load and support comprehension.
 */
export const CognitiveAccessibilityFeatures: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Cognitive Load Management</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Grid automatically limits items based on viewport to prevent cognitive overwhelm.
        </p>
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-4">
          <div className="text-sm font-medium text-accent-foreground mb-2">Cognitive Features:</div>
          <ul className="text-sm text-accent-foreground/80 space-y-1">
            <li>• Miller's Law: Maximum 7±2 items per viewport</li>
            <li>• Clear visual hierarchy reduces decision fatigue</li>
            <li>• Consistent patterns build mental models</li>
            <li>• Generous spacing improves focus and comprehension</li>
          </ul>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-2">Mobile: 2 Items (Optimal for Small Screens)</h4>
            <div className="max-w-xs mx-auto">
              <Grid preset="linear" gap="lg" maxItems={2}>
                <GridItem>
                  <div className="bg-card border border-border p-4 rounded-lg text-center">
                    <div className="text-2xl mb-2 font-bold text-primary">1</div>
                    <div className="font-semibold text-sm">Simple Choice 1</div>
                    <div className="text-xs text-muted-foreground mt-1">Easy to process</div>
                  </div>
                </GridItem>
                <GridItem>
                  <div className="bg-card border border-border p-4 rounded-lg text-center">
                    <div className="text-2xl mb-2 font-bold text-primary">2</div>
                    <div className="font-semibold text-sm">Simple Choice 2</div>
                    <div className="text-xs text-muted-foreground mt-1">Reduced overwhelm</div>
                  </div>
                </GridItem>
              </Grid>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Desktop: 6 Items (Balanced Complexity)</h4>
            <Grid preset="linear" gap="md" maxItems={6}>
              <GridItem>
                <div className="bg-card border border-border p-3 rounded-lg text-center">
                  <div className="text-lg mb-1 font-bold text-primary">1</div>
                  <div className="font-semibold text-sm">Option 1</div>
                  <div className="text-xs text-muted-foreground">Clear purpose</div>
                </div>
              </GridItem>
              <GridItem>
                <div className="bg-card border border-border p-3 rounded-lg text-center">
                  <div className="text-lg mb-1 font-bold text-accent-foreground">2</div>
                  <div className="font-semibold text-sm">Option 2</div>
                  <div className="text-xs text-muted-foreground">Quick action</div>
                </div>
              </GridItem>
              <GridItem>
                <div className="bg-card border border-border p-3 rounded-lg text-center">
                  <div className="text-lg mb-1 font-bold text-secondary-foreground">3</div>
                  <div className="font-semibold text-sm">Option 3</div>
                  <div className="text-xs text-muted-foreground">Easy to find</div>
                </div>
              </GridItem>
              <GridItem>
                <div className="bg-card border border-border p-3 rounded-lg text-center">
                  <div className="text-lg mb-1 font-bold text-muted-foreground">4</div>
                  <div className="font-semibold text-sm">Option 4</div>
                  <div className="text-xs text-muted-foreground">Safe choice</div>
                </div>
              </GridItem>
              <GridItem>
                <div className="bg-card border border-border p-3 rounded-lg text-center">
                  <div className="text-lg mb-1 font-bold text-accent">5</div>
                  <div className="font-semibold text-sm">Option 5</div>
                  <div className="text-xs text-muted-foreground">Creative option</div>
                </div>
              </GridItem>
              <GridItem>
                <div className="bg-card border border-border p-3 rounded-lg text-center">
                  <div className="text-lg mb-1 font-bold text-primary">6</div>
                  <div className="font-semibold text-sm">Option 6</div>
                  <div className="text-xs text-muted-foreground">Data-driven</div>
                </div>
              </GridItem>
            </Grid>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Clear Information Architecture</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Consistent patterns and clear labeling support users with cognitive differences.
        </p>
        <Grid preset="golden" gap="comfortable">
          <GridItem>
            <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-primary mb-1">Clear Step Numbers</h4>
                  <p className="text-sm text-primary/80">
                    Sequential numbering helps users track progress and understand order
                  </p>
                </div>
              </div>
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-accent/10 border border-accent/20 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold text-sm">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-accent-foreground mb-1">Consistent Language</h4>
                  <p className="text-sm text-accent-foreground/80">
                    Using familiar terms and consistent vocabulary throughout interface
                  </p>
                </div>
              </div>
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-secondary/10 border border-secondary/20 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground font-bold text-sm">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-secondary-foreground mb-1">Visual Hierarchy</h4>
                  <p className="text-sm text-secondary-foreground/80">
                    Size, color, and spacing create clear information relationships
                  </p>
                </div>
              </div>
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-muted border border-border p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-muted-foreground rounded-full flex items-center justify-center text-background font-bold text-sm">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-muted-foreground mb-1">Generous Spacing</h4>
                  <p className="text-sm text-muted-foreground/80">
                    White space reduces visual clutter and improves comprehension
                  </p>
                </div>
              </div>
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-destructive rounded-full flex items-center justify-center text-destructive-foreground font-bold text-sm">
                  5
                </div>
                <div>
                  <h4 className="font-semibold text-destructive mb-1">Predictable Patterns</h4>
                  <p className="text-sm text-destructive/80">
                    Consistent interaction patterns reduce cognitive load and build confidence
                  </p>
                </div>
              </div>
            </div>
          </GridItem>
        </Grid>
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-4">
          <div className="text-sm font-medium text-primary mb-2">Cognitive Support Features:</div>
          <ul className="text-sm text-primary/80 space-y-1">
            <li>• Clear visual hierarchy reduces decision complexity</li>
            <li>• Generous spacing improves focus and reduces overwhelm</li>
            <li>• Consistent patterns support mental model building</li>
            <li>• Progressive disclosure manages information density</li>
          </ul>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates cognitive accessibility features that support users with various cognitive differences and processing needs.',
      },
    },
  },
};
