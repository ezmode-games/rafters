/**
 * Type declarations for apca-w3 library
 * apca-w3 is a vanilla JS library with no official TypeScript types
 */
declare module 'apca-w3' {
  export function APCAcontrast(txtY: number, bgY: number, places?: number): number;

  export function sRGBtoY(rgb: [number, number, number, number?]): number;

  export function displayP3toY(rgb: [number, number, number, number?]): number;

  export function adobeRGBtoY(rgb: [number, number, number, number?]): number;

  export function alphaBlend(
    rgbaFG: [number, number, number, number?],
    rgbBG: [number, number, number],
    round?: boolean,
  ): [number, number, number];

  export function fontLookupAPCA(contrast: number, places?: number): number[];

  export function calcAPCA(
    textColor: [number, number, number, number?],
    bgColor: [number, number, number, number?],
    places?: number,
    round?: boolean,
  ): number;
}
