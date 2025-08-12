import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/Select';

/**
 * Properties shape behavior and interaction patterns.
 * Each property serves the interface's functional requirements.
 */
const meta = {
  title: 'Components/Select/Properties',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Properties that control size, behavior, and interaction characteristics of selects within interface contexts.',
      },
    },
  },
  args: { onValueChange: fn() },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Standard Size
 *
 * Default size provides balanced presence in most interface contexts.
 * Optimal for forms and standard selection scenarios.
 */
export const Default: Story = {
  render: () => (
    <div className="w-64">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option One</SelectItem>
          <SelectItem value="option2">Option Two</SelectItem>
          <SelectItem value="option3">Option Three</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Standard size select with balanced proportions for general form usage and interface contexts.',
      },
    },
  },
};

/**
 * Enhanced Touch Targets
 *
 * Large size improves motor accessibility with enhanced touch targets.
 * Better usability for touch interfaces and users with motor difficulties.
 */
export const Large: Story = {
  render: () => (
    <div className="w-64">
      <Select>
        <SelectTrigger size="large">
          <SelectValue placeholder="Enhanced touch target" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="large1">Large Option One</SelectItem>
          <SelectItem value="large2">Large Option Two</SelectItem>
          <SelectItem value="large3">Large Option Three</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Large size select with 44px minimum touch targets for improved motor accessibility and touch interface usability.',
      },
    },
  },
};

/**
 * Choice Architecture
 *
 * Item count display helps users understand the scope of available choices.
 * Reduces cognitive load by setting clear expectations.
 */
export const WithItemCount: Story = {
  render: () => (
    <div className="w-64">
      <Select>
        <SelectTrigger showCount itemCount={6}>
          <SelectValue placeholder="Choose from available options" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="cherry">Cherry</SelectItem>
          <SelectItem value="date">Date</SelectItem>
          <SelectItem value="elderberry">Elderberry</SelectItem>
          <SelectItem value="fig">Fig</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Item count display provides cognitive load reduction by showing the total number of available choices upfront.',
      },
    },
  },
};

/**
 * Progressive Disclosure
 *
 * Search functionality for large option sets reduces cognitive burden.
 * Automatic search threshold helps manage complex choices.
 */
export const WithSearch: Story = {
  render: () => (
    <div className="w-64">
      <Select>
        <SelectTrigger showCount itemCount={15}>
          <SelectValue placeholder="Search large option set" />
        </SelectTrigger>
        <SelectContent searchable searchPlaceholder="Search countries...">
          <SelectItem value="us">United States</SelectItem>
          <SelectItem value="uk">United Kingdom</SelectItem>
          <SelectItem value="ca">Canada</SelectItem>
          <SelectItem value="au">Australia</SelectItem>
          <SelectItem value="de">Germany</SelectItem>
          <SelectItem value="fr">France</SelectItem>
          <SelectItem value="it">Italy</SelectItem>
          <SelectItem value="es">Spain</SelectItem>
          <SelectItem value="nl">Netherlands</SelectItem>
          <SelectItem value="se">Sweden</SelectItem>
          <SelectItem value="no">Norway</SelectItem>
          <SelectItem value="dk">Denmark</SelectItem>
          <SelectItem value="fi">Finland</SelectItem>
          <SelectItem value="ie">Ireland</SelectItem>
          <SelectItem value="ch">Switzerland</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Search functionality enables progressive disclosure for large option sets, reducing cognitive load and improving findability.',
      },
    },
  },
};

/**
 * Disabled State
 *
 * Disabled selects communicate unavailability while maintaining layout structure.
 * Clear visual indication prevents interaction attempts.
 */
export const Disabled: Story = {
  render: () => (
    <div className="w-64">
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Not available" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="disabled1">Disabled Option 1</SelectItem>
          <SelectItem value="disabled2">Disabled Option 2</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Disabled state communicates unavailability while maintaining visual consistency in form layouts.',
      },
    },
  },
};

/**
 * Required Field
 *
 * Required state communicates necessity for form completion.
 * Clear indication helps users understand mandatory selections.
 */
export const Required: Story = {
  render: () => (
    <div className="w-64 space-y-2">
      <label htmlFor="required-select" className="text-sm font-medium">
        Required Selection <span className="text-destructive">*</span>
      </label>
      <Select required>
        <SelectTrigger id="required-select" aria-required="true">
          <SelectValue placeholder="Must select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="required1">Required Option 1</SelectItem>
          <SelectItem value="required2">Required Option 2</SelectItem>
          <SelectItem value="required3">Required Option 3</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Required state with proper ARIA attributes and visual indication for mandatory form fields.',
      },
    },
  },
};
