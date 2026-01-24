import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { PropertyEditor } from '../../../src/components/editor/PropertyEditor';

describe('PropertyEditor', () => {
  it('generates text field for z.string()', () => {
    const schema = z.object({
      title: z.string(),
    });

    render(<PropertyEditor schema={schema} values={{ title: 'Hello' }} onChange={() => {}} />);

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('Hello');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('generates number field for z.number()', () => {
    const schema = z.object({
      count: z.number(),
    });

    render(<PropertyEditor schema={schema} values={{ count: 42 }} onChange={() => {}} />);

    const input = screen.getByRole('spinbutton');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(42);
    expect(input).toHaveAttribute('type', 'number');
  });

  it('generates checkbox for z.boolean()', () => {
    const schema = z.object({
      enabled: z.boolean(),
    });

    render(<PropertyEditor schema={schema} values={{ enabled: true }} onChange={() => {}} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
  });

  it('generates select for z.enum()', () => {
    const schema = z.object({
      variant: z.enum(['primary', 'secondary', 'destructive']),
    });

    render(<PropertyEditor schema={schema} values={{ variant: 'primary' }} onChange={() => {}} />);

    const combobox = screen.getByRole('combobox');
    expect(combobox).toBeInTheDocument();
  });

  it('shows required indicator for non-optional fields', () => {
    const schema = z.object({
      requiredField: z.string(),
      optionalField: z.string().optional(),
    });

    render(
      <PropertyEditor
        schema={schema}
        values={{ requiredField: 'test', optionalField: undefined }}
        onChange={() => {}}
      />,
    );

    // Required field should have asterisk
    expect(screen.getByText('Required Field')).toBeInTheDocument();
    const asterisks = screen.getAllByText('*');
    expect(asterisks.length).toBe(1);

    // Check the asterisk is near the required field label
    const asterisk = asterisks[0];
    expect(asterisk).toHaveClass('text-destructive');
    expect(asterisk).toHaveAttribute('aria-hidden', 'true');
  });

  it('validates on blur', async () => {
    const user = userEvent.setup();
    const schema = z.object({
      email: z.string().email('Invalid email format'),
    });

    render(<PropertyEditor schema={schema} values={{ email: 'invalid' }} onChange={() => {}} />);

    const input = screen.getByRole('textbox');
    await user.click(input);
    await user.tab(); // Blur the input

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid email format');
    });
  });

  it('shows validation errors inline', async () => {
    const user = userEvent.setup();
    const schema = z.object({
      name: z.string().min(3, 'Name must be at least 3 characters'),
    });

    render(<PropertyEditor schema={schema} values={{ name: 'ab' }} onChange={() => {}} />);

    const input = screen.getByRole('textbox');
    await user.click(input);
    await user.tab();

    await waitFor(() => {
      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toHaveTextContent('Name must be at least 3 characters');
      expect(errorMessage).toHaveClass('text-destructive');
    });
  });

  it('calls onChange with updated values', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const schema = z.object({
      title: z.string(),
    });

    // Use a wrapper that updates state to simulate real usage
    function ControlledEditor() {
      const [values, setValues] = React.useState({ title: '' });
      return (
        <PropertyEditor
          schema={schema}
          values={values}
          onChange={(newValues) => {
            setValues(newValues as { title: string });
            handleChange(newValues);
          }}
        />
      );
    }

    render(<ControlledEditor />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'World');

    // onChange should be called for each character
    expect(handleChange).toHaveBeenCalled();
    // The last call should have the final value
    const lastCall = handleChange.mock.calls.at(-1);
    expect(lastCall).toEqual([{ title: 'World' }]);
  });
});

describe('PropertyEditor - Field types', () => {
  it('handles multiple field types in one schema', () => {
    const schema = z.object({
      title: z.string(),
      count: z.number(),
      enabled: z.boolean(),
      variant: z.enum(['a', 'b']),
    });

    render(
      <PropertyEditor
        schema={schema}
        values={{ title: 'Test', count: 10, enabled: false, variant: 'a' }}
        onChange={() => {}}
      />,
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('handles z.array(z.string()) as comma-separated input', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const schema = z.object({
      tags: z.array(z.string()),
    });

    render(
      <PropertyEditor schema={schema} values={{ tags: ['one', 'two'] }} onChange={handleChange} />,
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('one, two');

    // Test that onChange is called with parsed array when typing
    // Since this is a controlled component, each keystroke creates a new parsed array
    await user.type(input, 'x');

    // The input value becomes "one, twox" which parses to ['one', 'twox']
    // This verifies the array parsing is working
    expect(handleChange).toHaveBeenCalled();
    const lastCall = handleChange.mock.calls.at(-1);
    expect(lastCall).toEqual([{ tags: ['one', 'twox'] }]);
  });

  it('renders unknown types as disabled text field', () => {
    // Using z.object for a nested object which is not directly supported
    const schema = z.object({
      data: z.object({ nested: z.string() }),
    });

    render(
      <PropertyEditor schema={schema} values={{ data: { nested: 'value' } }} onChange={() => {}} />,
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(screen.getByText('Unsupported type - read only')).toBeInTheDocument();
  });
});

describe('PropertyEditor - Labels', () => {
  it('converts camelCase to Title Case', () => {
    const schema = z.object({
      firstName: z.string(),
      lastName: z.string(),
      emailAddress: z.string(),
    });

    render(
      <PropertyEditor
        schema={schema}
        values={{ firstName: '', lastName: '', emailAddress: '' }}
        onChange={() => {}}
      />,
    );

    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Last Name')).toBeInTheDocument();
    expect(screen.getByText('Email Address')).toBeInTheDocument();
  });

  it('associates labels with inputs via htmlFor', () => {
    const schema = z.object({
      username: z.string(),
    });

    render(<PropertyEditor schema={schema} values={{ username: '' }} onChange={() => {}} />);

    const label = screen.getByText('Username');
    const input = screen.getByRole('textbox');

    expect(label).toHaveAttribute('for', 'property-username');
    expect(input).toHaveAttribute('id', 'property-username');
  });
});

describe('PropertyEditor - Optional fields', () => {
  it('does not show required indicator for optional fields', () => {
    const schema = z.object({
      optional: z.string().optional(),
    });

    render(<PropertyEditor schema={schema} values={{ optional: '' }} onChange={() => {}} />);

    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('does not show required indicator for fields with defaults', () => {
    const schema = z.object({
      withDefault: z.string().default('default value'),
    });

    render(
      <PropertyEditor
        schema={schema}
        values={{ withDefault: 'default value' }}
        onChange={() => {}}
      />,
    );

    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('does not show required indicator for nullable fields', () => {
    const schema = z.object({
      nullable: z.string().nullable(),
    });

    render(<PropertyEditor schema={schema} values={{ nullable: null }} onChange={() => {}} />);

    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });
});

describe('PropertyEditor - Title and blockType', () => {
  it('displays title when provided', () => {
    const schema = z.object({
      field: z.string(),
    });

    render(
      <PropertyEditor
        schema={schema}
        values={{ field: '' }}
        onChange={() => {}}
        title="Custom Title"
      />,
    );

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  it('displays blockType as title when no title provided', () => {
    const schema = z.object({
      field: z.string(),
    });

    render(
      <PropertyEditor
        schema={schema}
        values={{ field: '' }}
        onChange={() => {}}
        blockType="TextBlock"
      />,
    );

    expect(screen.getByText('TextBlock Properties')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const schema = z.object({
      field: z.string(),
    });

    const { container } = render(
      <PropertyEditor
        schema={schema}
        values={{ field: '' }}
        onChange={() => {}}
        className="custom-editor-class"
      />,
    );

    expect(container.firstChild).toHaveClass('custom-editor-class');
  });
});

describe('PropertyEditor - Checkbox interactions', () => {
  it('toggles checkbox on click', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const schema = z.object({
      active: z.boolean(),
    });

    render(<PropertyEditor schema={schema} values={{ active: false }} onChange={handleChange} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'false');

    await user.click(checkbox);

    expect(handleChange).toHaveBeenCalledWith({ active: true });
  });

  it('displays label next to checkbox', () => {
    const schema = z.object({
      isPublished: z.boolean(),
    });

    render(<PropertyEditor schema={schema} values={{ isPublished: true }} onChange={() => {}} />);

    // For boolean fields, label is rendered inline
    const label = screen.getByText('Is Published');
    expect(label).toBeInTheDocument();
  });
});

describe('PropertyEditor - Select interactions', () => {
  it('opens select and shows options', async () => {
    const user = userEvent.setup();
    const schema = z.object({
      size: z.enum(['small', 'medium', 'large']),
    });

    render(<PropertyEditor schema={schema} values={{ size: 'medium' }} onChange={() => {}} />);

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    // Check options are displayed with Title Case
    expect(screen.getByRole('option', { name: 'Small' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Medium' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Large' })).toBeInTheDocument();
  });

  it('calls onChange when option selected', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const schema = z.object({
      color: z.enum(['red', 'blue', 'green']),
    });

    render(<PropertyEditor schema={schema} values={{ color: 'red' }} onChange={handleChange} />);

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    const blueOption = screen.getByRole('option', { name: 'Blue' });
    await user.click(blueOption);

    expect(handleChange).toHaveBeenCalledWith({ color: 'blue' });
  });
});

describe('PropertyEditor - Number field interactions', () => {
  it('updates value when typing', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const schema = z.object({
      amount: z.number(),
    });

    // Use a wrapper that updates state to simulate real usage
    function ControlledEditor() {
      const [values, setValues] = React.useState<{ amount: number | undefined }>({
        amount: undefined,
      });
      return (
        <PropertyEditor
          schema={schema}
          values={values}
          onChange={(newValues) => {
            setValues(newValues as { amount: number | undefined });
            handleChange(newValues);
          }}
        />
      );
    }

    render(<ControlledEditor />);

    const input = screen.getByRole('spinbutton');
    await user.type(input, '123');

    const lastCall = handleChange.mock.calls.at(-1);
    expect(lastCall).toEqual([{ amount: 123 }]);
  });

  it('handles empty value as undefined', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const schema = z.object({
      amount: z.number().optional(),
    });

    render(<PropertyEditor schema={schema} values={{ amount: 42 }} onChange={handleChange} />);

    const input = screen.getByRole('spinbutton');
    await user.clear(input);

    const lastCall = handleChange.mock.calls.at(-1);
    expect(lastCall).toEqual([{ amount: undefined }]);
  });
});

describe('PropertyEditor - Validation', () => {
  it('clears error when value changes', async () => {
    const user = userEvent.setup();
    const schema = z.object({
      email: z.string().email('Invalid email'),
    });

    const { rerender } = render(
      <PropertyEditor schema={schema} values={{ email: 'invalid' }} onChange={() => {}} />,
    );

    const input = screen.getByRole('textbox');
    await user.click(input);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    // Simulate a value change that would come from parent
    rerender(
      <PropertyEditor schema={schema} values={{ email: 'valid@email.com' }} onChange={() => {}} />,
    );

    // Blur again to trigger validation
    await user.click(input);
    await user.tab();

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  it('shows error state styling on input', async () => {
    const user = userEvent.setup();
    const schema = z.object({
      name: z.string().min(5, 'Too short'),
    });

    render(<PropertyEditor schema={schema} values={{ name: 'ab' }} onChange={() => {}} />);

    const input = screen.getByRole('textbox');
    await user.click(input);
    await user.tab();

    await waitFor(() => {
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });
  });
});

describe('PropertyEditor - Accessibility', () => {
  it('has form role and aria-label', () => {
    const schema = z.object({
      field: z.string(),
    });

    render(
      <PropertyEditor
        schema={schema}
        values={{ field: '' }}
        onChange={() => {}}
        title="Settings"
      />,
    );

    const form = screen.getByRole('form');
    expect(form).toHaveAttribute('aria-label', 'Settings');
  });

  it('uses default aria-label when no title', () => {
    const schema = z.object({
      field: z.string(),
    });

    render(<PropertyEditor schema={schema} values={{ field: '' }} onChange={() => {}} />);

    const form = screen.getByRole('form');
    expect(form).toHaveAttribute('aria-label', 'Property editor');
  });

  it('connects error messages via aria-describedby', async () => {
    const user = userEvent.setup();
    const schema = z.object({
      field: z.string().min(1, 'Required'),
    });

    render(<PropertyEditor schema={schema} values={{ field: '' }} onChange={() => {}} />);

    const input = screen.getByRole('textbox');
    await user.click(input);
    await user.tab();

    await waitFor(() => {
      expect(input).toHaveAttribute('aria-describedby', 'property-field-error');
      expect(screen.getByRole('alert')).toHaveAttribute('id', 'property-field-error');
    });
  });
});
