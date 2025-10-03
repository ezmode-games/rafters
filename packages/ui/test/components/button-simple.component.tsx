/**
 * Single simple Button test to get Playwright component testing working
 */

import { expect, test } from '@playwright/experimental-ct-react';
import { Button } from '../../src/components/Button';

test('should render Button component', async ({ mount }) => {
  const component = await mount(<Button>Click me</Button>);
  await expect(component).toBeVisible();
  await expect(component).toHaveText('Click me');
});
