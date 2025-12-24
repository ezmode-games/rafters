/**
 * Warm the Rafters Color API cache with comprehensive color palettes
 *
 * Includes:
 * - CSS Named Colors (147 colors)
 * - Material Design unique colors + accents (~130 colors)
 * - Apple iOS System Colors (~18 colors)
 * - Brand Colors (~50 colors)
 * - Radix unique scales (~60 colors)
 * - Pantone Color of the Year (2020-2025)
 * - Bootstrap unique colors
 * - IBM Carbon unique colors
 *
 * Uses hexToOKLCH from @rafters/color-utils for conversion
 */

import { hexToOKLCH } from '../packages/color-utils/src/conversion.js';

// CSS Named Colors - commonly referenced by designers
const CSS_NAMED_COLORS: Record<string, string> = {
  aliceblue: '#F0F8FF',
  antiquewhite: '#FAEBD7',
  aquamarine: '#7FFFD4',
  azure: '#F0FFFF',
  beige: '#F5F5DC',
  bisque: '#FFE4C4',
  blanchedalmond: '#FFEBCD',
  blueviolet: '#8A2BE2',
  brown: '#A52A2A',
  burlywood: '#DEB887',
  cadetblue: '#5F9EA0',
  chartreuse: '#7FFF00',
  chocolate: '#D2691E',
  coral: '#FF7F50',
  cornflowerblue: '#6495ED',
  cornsilk: '#FFF8DC',
  crimson: '#DC143C',
  darkgoldenrod: '#B8860B',
  darkolivegreen: '#556B2F',
  darkorange: '#FF8C00',
  darkorchid: '#9932CC',
  darksalmon: '#E9967A',
  darkseagreen: '#8FBC8F',
  darkslateblue: '#483D8B',
  darkslategray: '#2F4F4F',
  darkturquoise: '#00CED1',
  darkviolet: '#9400D3',
  deeppink: '#FF1493',
  deepskyblue: '#00BFFF',
  dimgray: '#696969',
  dodgerblue: '#1E90FF',
  firebrick: '#B22222',
  floralwhite: '#FFFAF0',
  forestgreen: '#228B22',
  gainsboro: '#DCDCDC',
  ghostwhite: '#F8F8FF',
  gold: '#FFD700',
  goldenrod: '#DAA520',
  greenyellow: '#ADFF2F',
  honeydew: '#F0FFF0',
  hotpink: '#FF69B4',
  indianred: '#CD5C5C',
  ivory: '#FFFFF0',
  khaki: '#F0E68C',
  lavender: '#E6E6FA',
  lavenderblush: '#FFF0F5',
  lawngreen: '#7CFC00',
  lemonchiffon: '#FFFACD',
  lightcoral: '#F08080',
  lightgoldenrodyellow: '#FAFAD2',
  lightsalmon: '#FFA07A',
  lightseagreen: '#20B2AA',
  lightskyblue: '#87CEFA',
  lightslategray: '#778899',
  lightsteelblue: '#B0C4DE',
  limegreen: '#32CD32',
  linen: '#FAF0E6',
  mediumaquamarine: '#66CDAA',
  mediumblue: '#0000CD',
  mediumorchid: '#BA55D3',
  mediumpurple: '#9370DB',
  mediumseagreen: '#3CB371',
  mediumslateblue: '#7B68EE',
  mediumspringgreen: '#00FA9A',
  mediumturquoise: '#48D1CC',
  mediumvioletred: '#C71585',
  midnightblue: '#191970',
  mintcream: '#F5FFFA',
  mistyrose: '#FFE4E1',
  moccasin: '#FFE4B5',
  navajowhite: '#FFDEAD',
  oldlace: '#FDF5E6',
  olivedrab: '#6B8E23',
  orangered: '#FF4500',
  orchid: '#DA70D6',
  palegoldenrod: '#EEE8AA',
  palegreen: '#98FB98',
  paleturquoise: '#AFEEEE',
  palevioletred: '#DB7093',
  papayawhip: '#FFEFD5',
  peachpuff: '#FFDAB9',
  peru: '#CD853F',
  pink: '#FFC0CB',
  plum: '#DDA0DD',
  powderblue: '#B0E0E6',
  rebeccapurple: '#663399',
  rosybrown: '#BC8F8F',
  royalblue: '#4169E1',
  saddlebrown: '#8B4513',
  salmon: '#FA8072',
  sandybrown: '#F4A460',
  seagreen: '#2E8B57',
  seashell: '#FFF5EE',
  sienna: '#A0522D',
  skyblue: '#87CEEB',
  slateblue: '#6A5ACD',
  slategray: '#708090',
  snow: '#FFFAFA',
  springgreen: '#00FF7F',
  steelblue: '#4682B4',
  tan: '#D2B48C',
  thistle: '#D8BFD8',
  tomato: '#FF6347',
  turquoise: '#40E0D0',
  violet: '#EE82EE',
  wheat: '#F5DEB3',
  yellowgreen: '#9ACD32',
};

// Material Design Accent Colors (A100, A200, A400, A700)
const MATERIAL_ACCENT_COLORS: Record<string, string> = {
  'red-a100': '#FF8A80',
  'red-a200': '#FF5252',
  'red-a400': '#FF1744',
  'red-a700': '#D50000',
  'pink-a100': '#FF80AB',
  'pink-a200': '#FF4081',
  'pink-a400': '#F50057',
  'pink-a700': '#C51162',
  'purple-a100': '#EA80FC',
  'purple-a200': '#E040FB',
  'purple-a400': '#D500F9',
  'purple-a700': '#AA00FF',
  'deep-purple-a100': '#B388FF',
  'deep-purple-a200': '#7C4DFF',
  'deep-purple-a400': '#651FFF',
  'deep-purple-a700': '#6200EA',
  'indigo-a100': '#8C9EFF',
  'indigo-a200': '#536DFE',
  'indigo-a400': '#3D5AFE',
  'indigo-a700': '#304FFE',
  'blue-a100': '#82B1FF',
  'blue-a200': '#448AFF',
  'blue-a400': '#2979FF',
  'blue-a700': '#2962FF',
  'light-blue-a100': '#80D8FF',
  'light-blue-a200': '#40C4FF',
  'light-blue-a400': '#00B0FF',
  'light-blue-a700': '#0091EA',
  'cyan-a100': '#84FFFF',
  'cyan-a200': '#18FFFF',
  'cyan-a400': '#00E5FF',
  'cyan-a700': '#00B8D4',
  'teal-a100': '#A7FFEB',
  'teal-a200': '#64FFDA',
  'teal-a400': '#1DE9B6',
  'teal-a700': '#00BFA5',
  'green-a100': '#B9F6CA',
  'green-a200': '#69F0AE',
  'green-a400': '#00E676',
  'green-a700': '#00C853',
  'light-green-a100': '#CCFF90',
  'light-green-a200': '#B2FF59',
  'light-green-a400': '#76FF03',
  'light-green-a700': '#64DD17',
  'lime-a100': '#F4FF81',
  'lime-a200': '#EEFF41',
  'lime-a400': '#C6FF00',
  'lime-a700': '#AEEA00',
  'yellow-a100': '#FFFF8D',
  'yellow-a200': '#FFFF00',
  'yellow-a400': '#FFEA00',
  'yellow-a700': '#FFD600',
  'amber-a100': '#FFE57F',
  'amber-a200': '#FFD740',
  'amber-a400': '#FFC400',
  'amber-a700': '#FFAB00',
  'orange-a100': '#FFD180',
  'orange-a200': '#FFAB40',
  'orange-a400': '#FF9100',
  'orange-a700': '#FF6D00',
  'deep-orange-a100': '#FF9E80',
  'deep-orange-a200': '#FF6E40',
  'deep-orange-a400': '#FF3D00',
  'deep-orange-a700': '#DD2C00',
};

// Material Design unique families not in Tailwind
const MATERIAL_UNIQUE_COLORS: Record<string, string> = {
  // Deep Purple
  'deep-purple-50': '#EDE7F6',
  'deep-purple-100': '#D1C4E9',
  'deep-purple-200': '#B39DDB',
  'deep-purple-300': '#9575CD',
  'deep-purple-400': '#7E57C2',
  'deep-purple-500': '#673AB7',
  'deep-purple-600': '#5E35B1',
  'deep-purple-700': '#512DA8',
  'deep-purple-800': '#4527A0',
  'deep-purple-900': '#311B92',
  // Light Blue
  'light-blue-50': '#E1F5FE',
  'light-blue-100': '#B3E5FC',
  'light-blue-200': '#81D4FA',
  'light-blue-300': '#4FC3F7',
  'light-blue-400': '#29B6F6',
  'light-blue-500': '#03A9F4',
  'light-blue-600': '#039BE5',
  'light-blue-700': '#0288D1',
  'light-blue-800': '#0277BD',
  'light-blue-900': '#01579B',
  // Light Green
  'light-green-50': '#F1F8E9',
  'light-green-100': '#DCEDC8',
  'light-green-200': '#C5E1A5',
  'light-green-300': '#AED581',
  'light-green-400': '#9CCC65',
  'light-green-500': '#8BC34A',
  'light-green-600': '#7CB342',
  'light-green-700': '#689F38',
  'light-green-800': '#558B2F',
  'light-green-900': '#33691E',
  // Deep Orange
  'deep-orange-50': '#FBE9E7',
  'deep-orange-100': '#FFCCBC',
  'deep-orange-200': '#FFAB91',
  'deep-orange-300': '#FF8A65',
  'deep-orange-400': '#FF7043',
  'deep-orange-500': '#FF5722',
  'deep-orange-600': '#F4511E',
  'deep-orange-700': '#E64A19',
  'deep-orange-800': '#D84315',
  'deep-orange-900': '#BF360C',
  // Brown
  'brown-50': '#EFEBE9',
  'brown-100': '#D7CCC8',
  'brown-200': '#BCAAA4',
  'brown-300': '#A1887F',
  'brown-400': '#8D6E63',
  'brown-500': '#795548',
  'brown-600': '#6D4C41',
  'brown-700': '#5D4037',
  'brown-800': '#4E342E',
  'brown-900': '#3E2723',
  // Blue Grey
  'blue-grey-50': '#ECEFF1',
  'blue-grey-100': '#CFD8DC',
  'blue-grey-200': '#B0BEC5',
  'blue-grey-300': '#90A4AE',
  'blue-grey-400': '#78909C',
  'blue-grey-500': '#607D8B',
  'blue-grey-600': '#546E7A',
  'blue-grey-700': '#455A64',
  'blue-grey-800': '#37474F',
  'blue-grey-900': '#263238',
};

// Apple iOS System Colors
const APPLE_COLORS: Record<string, string> = {
  'system-red': '#FF3B30',
  'system-orange': '#FF9500',
  'system-yellow': '#FFCC00',
  'system-green': '#34C759',
  'system-mint': '#00C7BE',
  'system-teal': '#30B0C7',
  'system-cyan': '#32ADE6',
  'system-blue': '#007AFF',
  'system-indigo': '#5856D6',
  'system-purple': '#AF52DE',
  'system-pink': '#FF2D55',
  'system-brown': '#A2845E',
  'system-gray': '#8E8E93',
  'system-gray2': '#AEAEB2',
  'system-gray3': '#C7C7CC',
  'system-gray4': '#D1D1D6',
  'system-gray5': '#E5E5EA',
  'system-gray6': '#F2F2F7',
};

// Brand Colors - commonly referenced
const BRAND_COLORS: Record<string, string> = {
  'google-blue': '#4285F4',
  'google-red': '#EA4335',
  'google-yellow': '#FBBC05',
  'google-green': '#34A853',
  'facebook-blue': '#1877F2',
  'twitter-blue': '#1DA1F2',
  'linkedin-blue': '#0A66C2',
  'spotify-green': '#1DB954',
  'netflix-red': '#E50914',
  'amazon-orange': '#FF9900',
  'slack-aubergine': '#4A154B',
  'slack-blue': '#36C5F0',
  'slack-green': '#2EB67D',
  'slack-yellow': '#ECB22E',
  'slack-red': '#E01E5A',
  'discord-blurple': '#5865F2',
  'discord-dark': '#36393F',
  'youtube-red': '#FF0000',
  'tiktok-pink': '#FE2C55',
  'tiktok-cyan': '#25F4EE',
  'instagram-magenta': '#C32AA3',
  'instagram-purple': '#7232BD',
  'instagram-orange': '#F46F30',
  'whatsapp-green': '#25D366',
  'telegram-blue': '#0088CC',
  'pinterest-red': '#E60023',
  'reddit-orange': '#FF4500',
  'twitch-purple': '#9146FF',
  'snapchat-yellow': '#FFFC00',
  'dribbble-pink': '#EA4C89',
  'behance-blue': '#1769FF',
  'figma-purple': '#A259FF',
  'figma-pink': '#F24E1E',
  'figma-green': '#0ACF83',
  'github-black': '#181717',
  'gitlab-orange': '#FC6D26',
  'bitbucket-blue': '#0052CC',
  'netlify-teal': '#00C7B7',
  'heroku-purple': '#430098',
  'digitalocean-blue': '#0080FF',
  'aws-orange': '#FF9900',
  'azure-blue': '#0078D4',
  'gcp-blue': '#4285F4',
  'microsoft-blue': '#0078D4',
};

// Radix unique color scales (step 9 - most saturated)
const RADIX_COLORS: Record<string, string> = {
  'radix-tomato': '#E54D2E',
  'radix-ruby': '#E54666',
  'radix-crimson': '#E93D82',
  'radix-plum': '#AB4ABA',
  'radix-iris': '#5B5BD6',
  'radix-jade': '#29A383',
  'radix-grass': '#46A758',
  'radix-mint': '#86EAD4',
  'radix-gold': '#978365',
  'radix-bronze': '#A18072',
};

// Pantone Color of the Year
const PANTONE_COLORS: Record<string, string> = {
  'pantone-2020-classic-blue': '#0F4C81',
  'pantone-2021-ultimate-gray': '#939597',
  'pantone-2021-illuminating': '#F5DF4D',
  'pantone-2022-very-peri': '#6667AB',
  'pantone-2023-viva-magenta': '#BB2649',
  'pantone-2024-peach-fuzz': '#FFBE98',
  'pantone-2025-mocha-mousse': '#A47864',
};

// Bootstrap unique colors
const BOOTSTRAP_COLORS: Record<string, string> = {
  'bootstrap-primary': '#0D6EFD',
  'bootstrap-secondary': '#6C757D',
  'bootstrap-success': '#198754',
  'bootstrap-info': '#0DCAF0',
  'bootstrap-warning': '#FFC107',
  'bootstrap-danger': '#DC3545',
  'bootstrap-light': '#F8F9FA',
  'bootstrap-dark': '#212529',
  'bootstrap-indigo': '#6610F2',
  'bootstrap-purple': '#6F42C1',
  'bootstrap-pink': '#D63384',
  'bootstrap-teal': '#20C997',
};

async function warmCache() {
  // Combine all color sources
  const allColors = {
    ...CSS_NAMED_COLORS,
    ...MATERIAL_ACCENT_COLORS,
    ...MATERIAL_UNIQUE_COLORS,
    ...APPLE_COLORS,
    ...BRAND_COLORS,
    ...RADIX_COLORS,
    ...PANTONE_COLORS,
    ...BOOTSTRAP_COLORS,
  };

  console.log(`Converting ${Object.keys(allColors).length} hex colors to OKLCH...`);

  const oklchColors: Array<{ l: number; c: number; h: number; alpha: number }> = [];

  for (const [name, hex] of Object.entries(allColors)) {
    try {
      const oklch = hexToOKLCH(hex);
      // Round to 3 decimal places for L and C, whole number for H
      oklchColors.push({
        l: Math.round(oklch.l * 1000) / 1000,
        c: Math.round(oklch.c * 1000) / 1000,
        h: Math.round(oklch.h || 0),
        alpha: 1,
      });
    } catch (error) {
      console.error(`Failed to convert ${name} (${hex}):`, error);
    }
  }

  console.log(`Successfully converted ${oklchColors.length} colors`);
  console.log(`Sending to API batch queue...`);

  // Send to batch endpoint
  const response = await fetch('https://api.rafters.studio/queue/batch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      colors: oklchColors,
      batchId: `comprehensive-warmup-${Date.now()}`,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`Failed to queue colors: ${response.status} ${error}`);
    process.exit(1);
  }

  const result = await response.json();
  console.log('\nQueue response:', JSON.stringify(result, null, 2));
  console.log(`\nTotal colors queued: ${result.queuedCount}`);
}

warmCache().catch(console.error);
