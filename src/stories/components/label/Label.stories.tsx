import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';

// Note: This assumes a Label component exists. If not, we'll use a simple implementation
const Label = ({ 
  children, 
  htmlFor, 
  variant = 'default',
  className = '',
  ...props 
}: {
  children: React.ReactNode;
  htmlFor?: string;
  variant?: 'field' | 'hint' | 'error' | 'success' | 'meta' | 'status';
  className?: string;
  [key: string]: any;
}) => {
  const baseClasses = "text-sm";
  const variantClasses = {
    field: "font-medium",
    hint: "text-muted-foreground",
    error: "text-destructive",
    success: "text-green-600",
    meta: "text-xs text-muted-foreground",
    status: "text-xs font-medium"
  };
  
  return (
    <label 
      htmlFor={htmlFor}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};

const meta = {
  title: '03 Components/Forms/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Label Pattern Evolution
 *
 * Labels progress from simple identification to comprehensive information systems
 * that guide users through successful interface interactions.
 */
export const Common: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <h3 className="text-lg font-medium mb-6">Label Information Patterns</h3>
      <div className="space-y-8">
        
        {/* Simple Identification */}
        <div className="space-y-4">
          <h4 className="text-base font-medium">Simple Identification</h4>
          <div className="space-y-2">
            <Label htmlFor="simple-email" variant="field">
              Email Address
            </Label>
            <Input
              id="simple-email"
              type="email"
              placeholder="user@example.com"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Basic field identification - clear, direct, no ambiguity.
          </p>
        </div>

        {/* Helpful Context */}
        <div className="space-y-4">
          <h4 className="text-base font-medium">Helpful Context</h4>
          <div className="space-y-2">
            <Label htmlFor="context-email" variant="field">
              Recovery Email Address
            </Label>
            <Label variant="hint">
              We'll use this to help you recover your account if needed
            </Label>
            <Input
              id="context-email"
              type="email"
              placeholder="user@example.com"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Additional context helps users understand purpose and importance.
          </p>
        </div>

        {/* State Communication */}
        <div className="space-y-4">
          <h4 className="text-base font-medium">State Communication</h4>
          <div className="space-y-2">
            <Label htmlFor="state-email" variant="field">
              Email Address
            </Label>
            <Label variant="hint">
              Must be associated with your organization
            </Label>
            <Input
              id="state-email"
              type="email"
              defaultValue="user@gmail.com"
              variant="error"
            />
            <Label variant="error">
              Please use your work email address (user@company.com)
            </Label>
          </div>
          <p className="text-xs text-muted-foreground">
            State-aware messaging that guides users toward successful completion.
          </p>
        </div>

        {/* Meta Information */}
        <div className="space-y-4">
          <h4 className="text-base font-medium">Meta Information</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label variant="field">Profile Photo</Label>
              <Label variant="meta">Optional • Max 5MB</Label>
            </div>
            <div className="border-2 border-dashed border-muted rounded-md p-6 text-center">
              <Button variant="outline" size="sm">
                Choose File
              </Button>
              <Label variant="hint" className="block mt-2">
                JPG, PNG, or GIF format
              </Label>
            </div>
            <Label variant="meta">
              Last updated: March 15, 2024
            </Label>
          </div>
          <p className="text-xs text-muted-foreground">
            Meta information provides context without cluttering the main interface.
          </p>
        </div>
      </div>

      <div className="mt-8 p-4 bg-muted/50 rounded-md">
        <h4 className="font-medium text-sm mb-2">Information Evolution</h4>
        <p className="text-xs text-muted-foreground">
          <strong>Identify</strong> → <strong>Contextualize</strong> → <strong>Guide</strong> → <strong>Inform</strong>
          <br />
          Labels progress from basic identification to comprehensive information systems that build user confidence through helpful, consistent communication.
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The evolution of label patterns from simple identification to comprehensive information delivery that guides users toward success.',
      },
    },
  },
};