import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, expect } from 'vitest';
import * as matchers from 'vitest-axe/matchers';

// Extend vitest with axe matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});
