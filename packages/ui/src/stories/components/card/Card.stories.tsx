// @componentStatus published
// @version 0.1.0
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from '../../../components/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../../components/Card';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Card Evolution Showcase
 *
 * Progressive complexity showing how cards adapt from simple containers
 * to intelligent, interactive content organizers.
 */
export const Common: Story = {
  render: () => (
    <div className="w-full max-w-4xl">
      <h3 className="text-lg font-medium mb-6">Card Pattern Evolution</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Simple Information Display */}
        <Card>
          <CardHeader density="comfortable">
            <CardTitle level={4} weight="medium">
              Simple Display
            </CardTitle>
            <CardDescription prominence="default">
              Basic information container with clear hierarchy
            </CardDescription>
          </CardHeader>
          <CardContent density="comfortable">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-medium text-green-600">Active</span>
              </div>
              <div className="flex justify-between">
                <span>Updated:</span>
                <span>2 hours ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content with Actions */}
        <Card prominence="default">
          <CardHeader density="comfortable">
            <CardTitle level={4} weight="medium">
              With Actions
            </CardTitle>
            <CardDescription prominence="default">
              Content plus appropriate actions for user tasks
            </CardDescription>
          </CardHeader>
          <CardContent density="comfortable">
            <p className="text-sm text-muted-foreground">
              Cards can include actions that relate to their content, providing clear paths for user
              interaction.
            </p>
          </CardContent>
          <CardFooter justify="end">
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </CardFooter>
        </Card>

        {/* Interactive Container */}
        <Card interactive prominence="elevated" onClick={() => alert('Card clicked!')}>
          <CardHeader density="comfortable">
            <CardTitle level={4} weight="medium">
              Interactive
            </CardTitle>
            <CardDescription prominence="default">
              Entire card becomes clickable with clear affordances
            </CardDescription>
          </CardHeader>
          <CardContent density="comfortable">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Items:</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span>Progress:</span>
                <span className="font-medium text-blue-600">75%</span>
              </div>
            </div>
          </CardContent>
          <CardFooter justify="end">
            <span className="text-xs text-muted-foreground">Click to view details →</span>
          </CardFooter>
        </Card>

        {/* Adaptive Intelligence */}
        <Card prominence="elevated">
          <CardHeader density="spacious">
            <CardTitle level={3} weight="semibold">
              Adaptive
            </CardTitle>
            <CardDescription prominence="default">
              Intelligent density and prominence based on content importance
            </CardDescription>
          </CardHeader>
          <CardContent density="spacious">
            <div className="space-y-3 text-sm">
              <div className="bg-primary/10 p-3 rounded-md">
                <div className="font-medium text-primary">Featured Content</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Elevated prominence for important information
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter density="spacious" justify="center">
            <Button variant="primary" size="md">
              Take Action
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-8 p-4 bg-muted/50 rounded-md">
        <h4 className="font-medium text-sm mb-2">Evolution Pattern</h4>
        <p className="text-xs text-muted-foreground">
          <strong>Simple</strong> → <strong>Actionable</strong> → <strong>Interactive</strong> →{' '}
          <strong>Adaptive</strong>
          <br />
          Cards progressively enhance from basic containers to intelligent content organizers that
          adapt their presentation based on context and importance.
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The evolution of card patterns from simple information display to adaptive, intelligent containers that optimize cognitive load and interaction patterns.',
      },
    },
  },
};
