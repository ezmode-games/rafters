import type { Meta, StoryObj } from '@storybook/react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '../../../components/Card';
import { Button } from '../../../components/Button';

const meta = {
  title: '03 Components/Layout/Card/Intelligence',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// Information Hierarchy Story
export const InformationHierarchy: Story = {
  render: () => (
    <div className="space-y-6 p-6 max-w-2xl">
      <div>
        <h3 className="text-lg font-semibold mb-4">Information Hierarchy Optimization</h3>
        <p className="text-sm text-gray-600 mb-6">
          Semantic heading levels and visual weight create clear content hierarchy
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card prominence="elevated">
          <CardHeader density="comfortable">
            <CardTitle level={2} weight="semibold">
              Primary Feature
            </CardTitle>
            <CardDescription prominence="default">
              Most important content gets highest visual weight and semantic priority
            </CardDescription>
          </CardHeader>
          <CardContent density="comfortable">
            <p className="text-sm">
              This card uses h2 heading with semibold weight and elevated prominence
              to signal primary importance in the content hierarchy.
            </p>
          </CardContent>
          <CardFooter justify="end">
            <Button variant="primary" size="sm">Learn More</Button>
          </CardFooter>
        </Card>

        <Card prominence="default">
          <CardHeader density="comfortable">
            <CardTitle level={3} weight="medium">
              Secondary Feature
            </CardTitle>
            <CardDescription prominence="default">
              Supporting content with appropriate visual weight
            </CardDescription>
          </CardHeader>
          <CardContent density="comfortable">
            <p className="text-sm">
              This card uses h3 heading with medium weight to show it's
              supporting the primary content.
            </p>
          </CardContent>
          <CardFooter justify="end">
            <Button variant="outline" size="sm">Details</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  ),
};

// Cognitive Load Density Story
export const CognitiveLoadDensity: Story = {
  render: () => (
    <div className="space-y-6 p-6 max-w-4xl">
      <div>
        <h3 className="text-lg font-semibold mb-4">Adaptive Information Density</h3>
        <p className="text-sm text-gray-600 mb-6">
          Different density settings optimize cognitive load for various content types
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader density="compact">
            <CardTitle level={4} weight="medium">Compact Density</CardTitle>
            <CardDescription prominence="default" truncate>
              High information density for dashboard widgets and summary views where space is limited
            </CardDescription>
          </CardHeader>
          <CardContent density="compact" layout="list">
            <div className="text-xs space-y-1">
              <div>Status: Active</div>
              <div>Users: 1,234</div>
              <div>Revenue: $45,678</div>
            </div>
          </CardContent>
          <CardFooter density="compact" justify="center">
            <Button variant="ghost" size="sm">View</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader density="comfortable">
            <CardTitle level={4} weight="medium">Comfortable Density</CardTitle>
            <CardDescription prominence="default">
              Balanced spacing for regular content cards and articles
            </CardDescription>
          </CardHeader>
          <CardContent density="comfortable">
            <p className="text-sm">
              This is the default density setting that provides good balance
              between information density and readability.
            </p>
          </CardContent>
          <CardFooter density="comfortable" justify="between">
            <span className="text-xs text-muted-foreground">Updated 2h ago</span>
            <Button variant="outline" size="sm">Edit</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader density="spacious">
            <CardTitle level={4} weight="medium">Spacious Density</CardTitle>
            <CardDescription prominence="default">
              Generous spacing for focus and detailed content
            </CardDescription>
          </CardHeader>
          <CardContent density="spacious">
            <p className="text-sm leading-relaxed">
              Spacious density is ideal for important announcements,
              featured content, or when you want to create a sense
              of calm and focus.
            </p>
          </CardContent>
          <CardFooter density="spacious" justify="end">
            <Button variant="primary" size="md">Get Started</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  ),
};

// Interaction Intelligence Story
export const InteractionIntelligence: Story = {
  render: () => {
    const handleCardClick = (cardName: string) => {
      alert(`Clicked ${cardName} card`);
    };

    return (
      <div className="space-y-6 p-6 max-w-3xl">
        <div>
          <h3 className="text-lg font-semibold mb-4">Interactive Affordances</h3>
          <p className="text-sm text-gray-600 mb-6">
            Clear visual and behavioral cues indicate interactive vs static content
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card prominence="default">
            <CardHeader>
              <CardTitle level={4}>Static Information Card</CardTitle>
              <CardDescription>
                This card displays information without interaction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Temperature:</span>
                  <span>72°F</span>
                </div>
                <div className="flex justify-between">
                  <span>Humidity:</span>
                  <span>45%</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-green-600">Normal</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            interactive 
            prominence="elevated"
            onClick={() => handleCardClick('Dashboard')}
          >
            <CardHeader>
              <CardTitle level={4}>Interactive Dashboard Card</CardTitle>
              <CardDescription>
                Click anywhere on this card to interact
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Active Users:</span>
                  <span className="font-medium">2,547</span>
                </div>
                <div className="flex justify-between">
                  <span>Revenue:</span>
                  <span className="font-medium text-green-600">+12.3%</span>
                </div>
                <div className="flex justify-between">
                  <span>Conversion:</span>
                  <span className="font-medium">3.4%</span>
                </div>
              </div>
            </CardContent>
            <CardFooter justify="end">
              <span className="text-xs text-muted-foreground">Click to view details →</span>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-8">
          <h4 className="text-md font-medium mb-3">Interactive Card Collection</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {['Analytics', 'Settings', 'Reports'].map((item) => (
              <Card 
                key={item}
                interactive 
                prominence="default"
                onClick={() => handleCardClick(item)}
              >
                <CardHeader density="compact">
                  <CardTitle level={5} weight="medium">{item}</CardTitle>
                </CardHeader>
                <CardContent density="compact">
                  <p className="text-xs text-muted-foreground">
                    Access {item.toLowerCase()} dashboard
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  },
};
