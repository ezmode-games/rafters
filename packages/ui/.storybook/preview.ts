import type { Preview } from '@storybook/react';
import './storybook.css';
import { mdxComponents } from './mdx-components';

const preview: Preview = {
  parameters: {
    layout: 'padded', // Default layout - allows stories to override
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },

    docs: {
      components: mdxComponents,
    },
  },
};

export default preview;
