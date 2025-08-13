import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { fn } from 'storybook/test';
import { Badge } from '../../../components/Badge';

/**
 * AI Training: Badge Accessibility Compliance
 * Demonstrates WCAG AAA compliance and inclusive design patterns
 * Trains AI agents on accessibility-first badge implementation
 */
const meta = {
  title: 'Components/Badge/Accessibility',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'AI Training: Accessibility compliance demonstrating WCAG AAA standards and inclusive design.',
      },
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Multi-sensory status communication preventing single-point failure.
 * Color + Icon + Text ensures accessibility across all abilities.
 */
export const MultiSensoryStatus: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Multi-Sensory Communication (WCAG AAA)</h4>
        <p className="text-xs text-muted-foreground">
          Status communicated through color, icon, and text - never color alone
        </p>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Badge variant="success" icon={CheckCircle}>
              ✓ Success
            </Badge>
            <Badge variant="warning" icon={AlertTriangle}>
              ⚠ Warning
            </Badge>
            <Badge variant="error" icon={XCircle}>
              ✗ Error
            </Badge>
            <Badge variant="info" icon={Info}>
              ℹ Information
            </Badge>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium">Accessibility Features:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Color: Semantic color coding</li>
              <li>• Icon: Universal visual symbols</li>
              <li>• Text: Clear status labels</li>
              <li>• ARIA: Proper screen reader labels</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Enhanced touch targets for motor accessibility.
 * 44px minimum touch targets exceed WCAG AAA requirements.
 */
export const TouchTargets: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Enhanced Touch Targets (44px minimum)</h4>
        <p className="text-xs text-muted-foreground">
          Interactive badges provide enhanced touch areas for motor accessibility
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-medium">Standard Display Badges</p>
            <div className="flex gap-2">
              <Badge variant="success">Non-interactive</Badge>
              <Badge variant="info">Read-only status</Badge>
              <Badge variant="neutral">Label</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium">Interactive Badges (44px touch targets)</p>
            <div className="flex gap-2">
              <Badge variant="warning" interactive onClick={fn()}>
                Click for details
              </Badge>
              <Badge variant="error" removable onRemove={fn()}>
                Removable filter
              </Badge>
              <Badge variant="info" interactive removable onClick={fn()} onRemove={fn()}>
                Interactive + Removable
              </Badge>
            </div>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-medium">Motor Accessibility Features:</p>
            <ul className="space-y-1">
              <li>• Minimum 44x44px touch targets</li>
              <li>• Enhanced click areas beyond visual bounds</li>
              <li>• Clear interactive affordances</li>
              <li>• Generous spacing between targets</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Complete keyboard navigation patterns.
 * Demonstrates full keyboard accessibility and screen reader support.
 */
export const KeyboardNavigation: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Keyboard Navigation Support</h4>
        <p className="text-xs text-muted-foreground">
          Full keyboard support with proper focus management and ARIA labels
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-medium">Interactive Badge Group</p>
            <div className="flex gap-2">
              <Badge variant="info" interactive onClick={fn()}>
                Tab to focus
              </Badge>
              <Badge variant="warning" interactive onClick={fn()}>
                Enter/Space to activate
              </Badge>
              <Badge variant="success" interactive onClick={fn()}>
                Proper focus indicators
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium">Removable Badges</p>
            <div className="flex gap-2">
              <Badge variant="neutral" removable onRemove={fn()}>
                Delete/Backspace to remove
              </Badge>
              <Badge variant="warning" removable onRemove={fn()}>
                X button focusable
              </Badge>
            </div>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-medium">Keyboard Support:</p>
            <ul className="space-y-1">
              <li>
                • <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Tab</kbd> - Navigate to
                badge
              </li>
              <li>
                • <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Enter</kbd> /{' '}
                <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Space</kbd> - Activate
              </li>
              <li>
                • <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Delete</kbd> /{' '}
                <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Backspace</kbd> - Remove
              </li>
              <li>
                • <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Esc</kbd> - Cancel operation
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Screen reader optimization with proper ARIA usage.
 * Demonstrates comprehensive screen reader support.
 */
export const ScreenReaderSupport: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Screen Reader Optimization</h4>
        <p className="text-xs text-muted-foreground">
          Comprehensive ARIA support for screen reader users
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-medium">Status Announcements</p>
            <div className="flex gap-2">
              <Badge variant="success" aria-label="Task completed successfully with no errors">
                Complete
              </Badge>
              <Badge variant="warning" aria-label="3 warnings requiring attention">
                3 Warnings
              </Badge>
              <Badge variant="error" aria-label="Critical error: immediate action required">
                Critical
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium">Live Status Updates</p>
            <div className="flex gap-2">
              <Badge
                variant="info"
                loading
                aria-live="polite"
                aria-label="Status updating, please wait"
              >
                Updating...
              </Badge>
              <Badge
                variant="success"
                aria-live="polite"
                aria-label="Update completed successfully"
              >
                Updated
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium">Interactive Context</p>
            <div className="flex gap-2">
              <Badge
                variant="info"
                interactive
                onClick={fn()}
                aria-label="View detailed information about this item. Activates dialog."
              >
                Details
              </Badge>
              <Badge
                variant="warning"
                removable
                onRemove={fn()}
                aria-label="Active filter: High priority. Press Delete to remove filter."
              >
                High Priority
              </Badge>
            </div>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-medium">Screen Reader Features:</p>
            <ul className="space-y-1">
              <li>• Descriptive aria-label attributes</li>
              <li>• Live region announcements for updates</li>
              <li>• Status role for non-interactive badges</li>
              <li>• Button role for interactive badges</li>
              <li>• Proper focus announcements</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * High contrast and reduced motion support.
 * Demonstrates universal design principles.
 */
export const UniversalDesign: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Universal Design Features</h4>
        <p className="text-xs text-muted-foreground">
          Adapts to user preferences and accessibility needs
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-medium">High Contrast Mode Support</p>
            <div className="flex gap-2">
              <Badge variant="success">Maintains visibility</Badge>
              <Badge variant="warning">Clear boundaries</Badge>
              <Badge variant="error">Enhanced contrast</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Automatically adapts to Windows High Contrast Mode
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium">Reduced Motion Support</p>
            <div className="flex gap-2">
              <Badge variant="info" animate>
                Respects motion preferences
              </Badge>
              <Badge variant="warning" loading>
                Reduced animations
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Respects prefers-reduced-motion user setting
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium">Cognitive Accessibility</p>
            <div className="flex gap-2">
              <Badge variant="success" icon={CheckCircle}>
                Clear meaning
              </Badge>
              <Badge variant="error" icon={XCircle}>
                Simple language
              </Badge>
              <Badge variant="info" icon={Info}>
                Consistent patterns
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Cognitive load: 2/10 - Optimized for instant recognition
            </p>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-medium">Universal Design Principles:</p>
            <ul className="space-y-1">
              <li>• Works across all abilities and preferences</li>
              <li>• Semantic tokens ensure consistent behavior</li>
              <li>• Progressive enhancement from base functionality</li>
              <li>• Respects user system preferences</li>
              <li>• Multi-sensory communication prevents failure</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
};
