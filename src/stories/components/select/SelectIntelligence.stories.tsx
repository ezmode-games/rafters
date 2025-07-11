import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '../../../components/Select';

const meta = {
  title: '03 Components/Forms/Select/Intelligence',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

// Choice Architecture Story
export const ChoiceArchitecture: Story = {
  render: () => {
    const [value, setValue] = useState('');

    const countries = [
      'United States',
      'Canada',
      'United Kingdom',
      'Australia',
      'Germany',
      'France',
      'Japan',
      'Brazil',
      'India',
      'China',
      'Mexico',
      'Spain',
    ];

    return (
      <div className="space-y-6 p-6 max-w-md">
        <div>
          <h3 className="text-lg font-semibold mb-4">Choice Architecture Optimization</h3>
          <p className="text-sm text-gray-600 mb-6">
            Cognitive load awareness through item counting and progressive disclosure
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="country" className="block text-sm font-medium mb-2">
              Country
            </label>
            <Select value={value} onValueChange={setValue}>
              <SelectTrigger
                id="country"
                showCount={true}
                itemCount={countries.length}
                className="w-full"
              >
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent searchable={countries.length > 8}>
                {countries.map((country) => (
                  <SelectItem key={country} value={country.toLowerCase()}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              Shows item count to set expectations and enables search for large lists
            </p>
          </div>
        </div>
      </div>
    );
  },
};

// Progressive Disclosure Story
export const ProgressiveDisclosure: Story = {
  render: () => {
    const [category, setCategory] = useState('');
    const [product, setProduct] = useState('');

    const categories = {
      electronics: {
        label: 'Electronics',
        items: ['Laptop', 'Phone', 'Tablet', 'Headphones', 'Camera', 'Smart Watch'],
      },
      clothing: {
        label: 'Clothing',
        items: ['T-Shirt', 'Jeans', 'Dress', 'Jacket', 'Shoes', 'Hat'],
      },
      books: {
        label: 'Books',
        items: ['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Children'],
      },
    };

    return (
      <div className="space-y-6 p-6 max-w-md">
        <div>
          <h3 className="text-lg font-semibold mb-4">Progressive Disclosure</h3>
          <p className="text-sm text-gray-600 mb-6">
            Search functionality for large option sets reduces cognitive overhead
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-2">
              Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Choose category" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(categories).map(([key, cat]) => (
                  <SelectItem key={key} value={key}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {category && (
            <div>
              <label htmlFor="product" className="block text-sm font-medium mb-2">
                Product
              </label>
              <Select value={product} onValueChange={setProduct}>
                <SelectTrigger
                  id="product"
                  className="w-full"
                  showCount={true}
                  itemCount={categories[category as keyof typeof categories]?.items.length}
                >
                  <SelectValue placeholder="Choose product" />
                </SelectTrigger>
                <SelectContent searchable={true} searchPlaceholder="Search products...">
                  {categories[category as keyof typeof categories]?.items.map((item) => (
                    <SelectItem key={item} value={item.toLowerCase()}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>
    );
  },
};

// Interaction Intelligence Story
export const InteractionIntelligence: Story = {
  render: () => {
    const [action, setAction] = useState('');

    return (
      <div className="space-y-6 p-6 max-w-md">
        <div>
          <h3 className="text-lg font-semibold mb-4">Enhanced Item Context</h3>
          <p className="text-sm text-gray-600 mb-6">
            Descriptions and shortcuts provide additional context for complex choices
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="action" className="block text-sm font-medium mb-2">
              Choose Action
            </label>
            <Select value={action} onValueChange={setAction}>
              <SelectTrigger id="action" size="large" className="w-full">
                <SelectValue placeholder="Select an action" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>File Operations</SelectLabel>
                  <SelectItem
                    value="save"
                    description="Save current document to disk"
                    shortcut="⌘S"
                  >
                    Save File
                  </SelectItem>
                  <SelectItem value="open" description="Open existing document" shortcut="⌘O">
                    Open File
                  </SelectItem>
                  <SelectItem value="export" description="Export in various formats" shortcut="⌘E">
                    Export
                  </SelectItem>
                </SelectGroup>

                <SelectSeparator />

                <SelectGroup>
                  <SelectLabel>Edit Operations</SelectLabel>
                  <SelectItem value="copy" description="Copy selection to clipboard" shortcut="⌘C">
                    Copy
                  </SelectItem>
                  <SelectItem value="paste" description="Paste from clipboard" shortcut="⌘V">
                    Paste
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              Enhanced touch targets and contextual information for better decision making
            </p>
          </div>
        </div>
      </div>
    );
  },
};
