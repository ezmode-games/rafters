// Test the color intelligence API with new contrast-aware scales
const testColors = [
  { l: 0.6, c: 0.2, h: 220, alpha: 1, name: 'Blue' },
  { l: 0.7, c: 0.15, h: 15, alpha: 1, name: 'Red' },
  { l: 0.5, c: 0.25, h: 135, alpha: 1, name: 'Green' },
];

async function testColorIntelligence() {
  console.log('=== TESTING API WITH NEW CONTRAST-AWARE SCALES ===\n');

  for (const color of testColors) {
    console.log(`\n--- Testing ${color.name} (L:${color.l} C:${color.c} H:${color.h}) ---`);

    try {
      const response = await fetch('http://localhost:8787/api/color-intel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oklch: color,
          token: 'primary',
          name: color.name.toLowerCase(),
        }),
      });

      if (!response.ok) {
        console.log(`❌ API Error: ${response.status} ${response.statusText}`);
        const errorText = await response.text();
        console.log('Error details:', errorText);
        continue;
      }

      const data = await response.json();

      // Test the new scale generation
      if (data.scale && Array.isArray(data.scale)) {
        console.log('✅ Scale generated with', data.scale.length, 'steps');

        // Check for contrast-aware distribution
        const lightSteps = data.scale.slice(0, 5); // 50-400
        const darkSteps = data.scale.slice(6, 11); // 600-950

        const avgLightL = lightSteps.reduce((sum, c) => sum + c.l, 0) / lightSteps.length;
        const avgDarkL = darkSteps.reduce((sum, c) => sum + c.l, 0) / darkSteps.length;

        console.log(`   Light steps (50-400) avg lightness: ${avgLightL.toFixed(3)}`);
        console.log(`   Dark steps (600-950) avg lightness: ${avgDarkL.toFixed(3)}`);

        if (avgLightL > 0.7 && avgDarkL < 0.3) {
          console.log('   ✅ Proper contrast distribution detected');
        } else {
          console.log('   ⚠️  Unexpected lightness distribution');
        }
      } else {
        console.log('❌ No scale data found');
      }

      // Test accessibility data
      if (data.accessibility) {
        console.log('✅ Accessibility data present');

        // Check for dark mode support
        const onBlack = data.accessibility.onBlack;
        if (onBlack && (onBlack.wcagAA || onBlack.contrastRatio)) {
          console.log('   ✅ Dark mode accessibility included');
        }
      } else {
        console.log('❌ Missing accessibility data');
      }

      // Test intelligence
      if (data.intelligence) {
        console.log('✅ AI intelligence present');
        console.log(`   Suggested name: "${data.intelligence.suggestedName}"`);
      } else {
        console.log('❌ Missing AI intelligence');
      }
    } catch (error) {
      console.log(`❌ Request failed: ${error.message}`);
    }
  }
}

// Check if API is running
async function checkAPI() {
  try {
    // Test with a simple POST request
    const response = await fetch('http://localhost:8787/api/color-intel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        oklch: { l: 0.5, c: 0.1, h: 200, alpha: 1 },
      }),
    });
    console.log('API Status:', response.status, response.ok ? '✅' : '❌');
    return response.ok;
  } catch (error) {
    console.log("❌ API not available. Make sure it's running with: npx wrangler dev --port 8787");
    console.log('Error:', error.message);
    return false;
  }
}

if (await checkAPI()) {
  await testColorIntelligence();
}
