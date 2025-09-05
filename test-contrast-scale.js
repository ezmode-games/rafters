import { generateOKLCHScale } from './packages/color-utils/src/harmony.js';

// Test the new contrast-based scale generation
const testColor = { l: 0.6, c: 0.2, h: 220, alpha: 1 }; // Blue color
const scale = generateOKLCHScale(testColor);

console.log('=== CONTRAST-BASED COLOR SCALE TEST ===\n');

const white = { l: 1, c: 0, h: 0, alpha: 1 };
const black = { l: 0, c: 0, h: 0, alpha: 1 };

console.log('Base color:', testColor);
console.log('Generated scale:\n');

for (const [step, color] of Object.entries(scale)) {
  const contrastOnWhite = calculateWCAGContrast(color, white);
  const contrastOnBlack = calculateWCAGContrast(color, black);

  console.log(
    `${step.padEnd(3)} | L:${color.l.toFixed(3)} C:${color.c.toFixed(3)} H:${color.h.toFixed(0)} | White:${contrastOnWhite.toFixed(2)} | Black:${contrastOnBlack.toFixed(2)}`
  );
}

console.log('\n=== ACCESSIBILITY ANALYSIS ===');

// Check which steps meet specific standards
const steps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
const targets = {
  'Dark Mode UI (1.45)': 1.45,
  'Large Text AA (3.0)': 3.0,
  'Normal Text AA (4.5)': 4.5,
  'Normal Text AAA (7.0)': 7.0,
  'High Contrast (10+)': 10.0,
};

for (const [name, targetRatio] of Object.entries(targets)) {
  console.log(`\n${name}:`);

  // Check against white background
  const whiteSteps = steps.filter((step) => {
    const contrast = calculateWCAGContrast(scale[step], white);
    return contrast >= targetRatio;
  });

  // Check against black background
  const blackSteps = steps.filter((step) => {
    const contrast = calculateWCAGContrast(scale[step], black);
    return contrast >= targetRatio;
  });

  console.log(`  On white: ${whiteSteps.join(', ') || 'none'}`);
  console.log(`  On black: ${blackSteps.join(', ') || 'none'}`);
}
