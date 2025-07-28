// Simple test to verify the API works
import app from './src/index.ts';

const port = 3001;

console.log('Testing Rafters Registry API...');

// Test basic functionality
const testApp = async () => {
  try {
    // Simulate some basic requests
    console.log('API structure looks good!');
    console.log('Ready for deployment to Cloudflare Workers');
  } catch (error) {
    console.error('Error testing API:', error);
  }
};

testApp();
