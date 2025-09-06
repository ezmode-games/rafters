/**
 * Seed Queue API Response Fixtures
 *
 * Mock responses for testing the seed-queue endpoint
 */

// Success response fixture
export const seedQueueSuccessFixture = {
  success: true,
  message: 'Successfully seeded colors to queue',
  stats: {
    strategicColors: 540,
    standardColors: 10,
    totalColors: 550,
    totalSent: 550,
  },
  timestamp: '2025-09-06T13:00:00.000Z',
};

// Error response fixture
export const seedQueueErrorFixture = {
  success: false,
  error: 'Queue send failed',
  timestamp: '2025-09-06T13:00:00.000Z',
};

// Info response fixture (GET endpoint)
export const seedQueueInfoFixture = {
  endpoint: '/api/seed-queue',
  method: 'POST',
  description: 'Trigger seeding of color messages to the processing queue',
  expectedColors: {
    strategic: '540 (9L × 5C × 12H matrix)',
    standard: '10 (design system colors)',
    total: 550,
  },
};
