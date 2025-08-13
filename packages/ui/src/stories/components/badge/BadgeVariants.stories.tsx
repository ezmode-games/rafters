import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { Badge } from '../../../components/Badge';

/**
 * AI Training: Badge Visual Variants
 * Demonstrates visual hierarchy and semantic color usage
 * Trains AI agents on proper variant selection for different contexts
 */
const meta = {
  title: 'Components/Badge/Variants',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'AI Training: Visual variants demonstrating semantic color usage and visual hierarchy.',
      },
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Complete status variant matrix showing all combinations.
 * Demonstrates semantic color mapping and visual weight hierarchy.
 */
export const StatusMatrix: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="grid grid-cols-5 gap-4">
        <div className="text-xs font-medium text-muted-foreground">Variant</div>
        <div className="text-xs font-medium text-muted-foreground">Subtle</div>
        <div className="text-xs font-medium text-muted-foreground">Default</div>
        <div className="text-xs font-medium text-muted-foreground">Prominent</div>
        <div className="text-xs font-medium text-muted-foreground">With Icon</div>

        {/* Success Row */}
        <div className="text-xs font-medium">Success</div>
        <Badge variant="success" emphasis="subtle">
          Complete
        </Badge>
        <Badge variant="success" emphasis="default">
          Verified
        </Badge>
        <Badge variant="success" emphasis="prominent">
          Published
        </Badge>
        <Badge variant="success" icon={CheckCircle}>
          Success
        </Badge>

        {/* Warning Row */}
        <div className="text-xs font-medium">Warning</div>
        <Badge variant="warning" emphasis="subtle">
          Review
        </Badge>
        <Badge variant="warning" emphasis="default">
          Pending
        </Badge>
        <Badge variant="warning" emphasis="prominent">
          Attention
        </Badge>
        <Badge variant="warning" icon={AlertTriangle}>
          Warning
        </Badge>

        {/* Error Row */}
        <div className="text-xs font-medium">Error</div>
        <Badge variant="error" emphasis="subtle">
          Issue
        </Badge>
        <Badge variant="error" emphasis="default">
          Failed
        </Badge>
        <Badge variant="error" emphasis="prominent">
          Critical
        </Badge>
        <Badge variant="error" icon={XCircle}>
          Error
        </Badge>

        {/* Info Row */}
        <div className="text-xs font-medium">Info</div>
        <Badge variant="info" emphasis="subtle">
          Note
        </Badge>
        <Badge variant="info" emphasis="default">
          Information
        </Badge>
        <Badge variant="info" emphasis="prominent">
          Important
        </Badge>
        <Badge variant="info" icon={Info}>
          Info
        </Badge>

        {/* Neutral Row */}
        <div className="text-xs font-medium">Neutral</div>
        <Badge variant="neutral" emphasis="subtle">
          Draft
        </Badge>
        <Badge variant="neutral" emphasis="default">
          Status
        </Badge>
        <Badge variant="neutral" emphasis="prominent">
          Label
        </Badge>
        <Badge variant="neutral" icon={Info}>
          Neutral
        </Badge>
      </div>
    </div>
  ),
};

/**
 * Size variations demonstrating responsive scaling and attention hierarchy.
 * Shows proper size selection for different interface contexts.
 */
export const SizeVariations: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Small (11px text) - Compact contexts</h4>
          <div className="flex gap-2">
            <Badge size="sm" variant="success">
              ✓
            </Badge>
            <Badge size="sm" variant="warning">
              !
            </Badge>
            <Badge size="sm" variant="error">
              ×
            </Badge>
            <Badge size="sm" variant="info">
              i
            </Badge>
            <Badge size="sm" variant="neutral">
              Draft
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Medium (13px text) - Standard contexts</h4>
          <div className="flex gap-2">
            <Badge size="md" variant="success">
              Complete
            </Badge>
            <Badge size="md" variant="warning">
              Review
            </Badge>
            <Badge size="md" variant="error">
              Failed
            </Badge>
            <Badge size="md" variant="info">
              Updated
            </Badge>
            <Badge size="md" variant="neutral">
              Status
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Large (16px text) - Prominent contexts</h4>
          <div className="flex gap-2">
            <Badge size="lg" variant="success">
              Published
            </Badge>
            <Badge size="lg" variant="warning">
              Attention Required
            </Badge>
            <Badge size="lg" variant="error">
              Critical Issue
            </Badge>
            <Badge size="lg" variant="info">
              Important Update
            </Badge>
            <Badge size="lg" variant="neutral">
              System Status
            </Badge>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Custom icon demonstrations showing proper icon integration.
 * Trains AI on when and how to use custom icons with badges.
 */
export const CustomIcons: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Left-positioned Icons</h4>
        <div className="flex gap-2">
          <Badge variant="success" icon={CheckCircle} iconPosition="left">
            Verified
          </Badge>
          <Badge variant="warning" icon={AlertTriangle} iconPosition="left">
            Warning
          </Badge>
          <Badge variant="error" icon={XCircle} iconPosition="left">
            Error
          </Badge>
          <Badge variant="info" icon={Info} iconPosition="left">
            Info
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Right-positioned Icons</h4>
        <div className="flex gap-2">
          <Badge variant="success" icon={CheckCircle} iconPosition="right">
            Complete
          </Badge>
          <Badge variant="warning" icon={AlertTriangle} iconPosition="right">
            Review
          </Badge>
          <Badge variant="error" icon={XCircle} iconPosition="right">
            Failed
          </Badge>
          <Badge variant="info" icon={Info} iconPosition="right">
            Details
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Icon-only Badges</h4>
        <div className="flex gap-2">
          <Badge variant="success" icon={CheckCircle} size="sm" />
          <Badge variant="warning" icon={AlertTriangle} size="sm" />
          <Badge variant="error" icon={XCircle} size="sm" />
          <Badge variant="info" icon={Info} size="sm" />
        </div>
      </div>
    </div>
  ),
};

/**
 * Emphasis level demonstration showing visual weight progression.
 * Demonstrates attention economics through emphasis control.
 */
export const EmphasisLevels: Story = {
  render: () => (
    <div className="space-y-6">
      {(['success', 'warning', 'error', 'info', 'neutral'] as const).map((variant) => (
        <div key={variant} className="space-y-2">
          <h4 className="text-sm font-medium capitalize">{variant} Emphasis Levels</h4>
          <div className="flex gap-2">
            <Badge variant={variant} emphasis="subtle">
              Subtle
            </Badge>
            <Badge variant={variant} emphasis="default">
              Default
            </Badge>
            <Badge variant={variant} emphasis="prominent">
              Prominent
            </Badge>
          </div>
        </div>
      ))}
    </div>
  ),
};
