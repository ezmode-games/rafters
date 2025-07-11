import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/Select';

const meta = {
  title: '03 Components/Form/Select/Visual Variants',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { onValueChange: fn() },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Standard Selection
 *
 * The default select provides balanced visual weight for most interface contexts.
 * Clean presentation focuses attention on available choices.
 */
export const Default: Story = {
  render: () => (
    <div className="w-64">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Choose an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Standard Option 1</SelectItem>
          <SelectItem value="option2">Standard Option 2</SelectItem>
          <SelectItem value="option3">Standard Option 3</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The default select variant provides clean, balanced presentation suitable for most form contexts and interface layouts.',
      },
    },
  },
};

/**
 * Enhanced Touch Interface
 *
 * Large variant improves motor accessibility with enhanced touch targets.
 * Better usability for mobile interfaces and users with motor difficulties.
 */
export const Large: Story = {
  render: () => (
    <div className="w-64">
      <Select>
        <SelectTrigger size="large">
          <SelectValue placeholder="Enhanced for touch" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="large1">Large Interface Option 1</SelectItem>
          <SelectItem value="large2">Large Interface Option 2</SelectItem>
          <SelectItem value="large3">Large Interface Option 3</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Large variant with enhanced touch targets (44px minimum) for improved motor accessibility and mobile interface usability.',
      },
    },
  },
};

/**
 * Choice Architecture
 *
 * Item count display helps users understand the scope of available options.
 * Cognitive load reduction through clear expectation setting.
 */
export const WithCount: Story = {
  render: () => (
    <div className="w-64">
      <Select>
        <SelectTrigger showCount itemCount={8}>
          <SelectValue placeholder="Options with count" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="count1">Counted Option 1</SelectItem>
          <SelectItem value="count2">Counted Option 2</SelectItem>
          <SelectItem value="count3">Counted Option 3</SelectItem>
          <SelectItem value="count4">Counted Option 4</SelectItem>
          <SelectItem value="count5">Counted Option 5</SelectItem>
          <SelectItem value="count6">Counted Option 6</SelectItem>
          <SelectItem value="count7">Counted Option 7</SelectItem>
          <SelectItem value="count8">Counted Option 8</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Choice architecture variant showing item count to reduce cognitive load by setting clear expectations about available options.',
      },
    },
  },
};

/**
 * Progressive Disclosure
 *
 * Search capability for managing large option sets effectively.
 * Reduces cognitive burden when dealing with numerous choices.
 */
export const Searchable: Story = {
  render: () => (
    <div className="w-64">
      <Select>
        <SelectTrigger showCount itemCount={12}>
          <SelectValue placeholder="Search through options" />
        </SelectTrigger>
        <SelectContent searchable searchPlaceholder="Filter options...">
          <SelectItem value="search1">Searchable Option Alpha</SelectItem>
          <SelectItem value="search2">Searchable Option Beta</SelectItem>
          <SelectItem value="search3">Searchable Option Gamma</SelectItem>
          <SelectItem value="search4">Searchable Option Delta</SelectItem>
          <SelectItem value="search5">Searchable Option Epsilon</SelectItem>
          <SelectItem value="search6">Searchable Option Zeta</SelectItem>
          <SelectItem value="search7">Searchable Option Eta</SelectItem>
          <SelectItem value="search8">Searchable Option Theta</SelectItem>
          <SelectItem value="search9">Searchable Option Iota</SelectItem>
          <SelectItem value="search10">Searchable Option Kappa</SelectItem>
          <SelectItem value="search11">Searchable Option Lambda</SelectItem>
          <SelectItem value="search12">Searchable Option Mu</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Searchable variant with progressive disclosure for large option sets, reducing cognitive load through filtering capabilities.',
      },
    },
  },
};

/**
 * Validation States
 *
 * Visual feedback for different validation states and user input scenarios.
 * Clear communication through semantic styling.
 */
export const ValidationStates: Story = {
  render: () => (
    <div className="space-y-6 p-4">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Validation States</h3>
        <p className="text-sm text-muted-foreground">
          Different visual states communicate validation status and guide user interaction.
        </p>
      </div>

      <div className="grid gap-6 max-w-sm">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Default State</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Default appearance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default1">Default Option 1</SelectItem>
              <SelectItem value="default2">Default Option 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-destructive">Error State</label>
          <Select>
            <SelectTrigger
              className="border-destructive focus:ring-destructive"
              aria-invalid="true"
            >
              <SelectValue placeholder="Error appearance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="error1">Error Option 1</SelectItem>
              <SelectItem value="error2">Error Option 2</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-destructive">Please select a valid option</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium opacity-disabled">Disabled State</label>
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder="Disabled appearance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="disabled1">Disabled Option 1</SelectItem>
              <SelectItem value="disabled2">Disabled Option 2</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">This selection is currently unavailable</p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Visual variants showing different validation states including default, error, and disabled appearances with appropriate semantic styling.',
      },
    },
  },
};
