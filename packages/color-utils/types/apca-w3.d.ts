declare module 'apca-w3' {
  export function APCAcontrast(textY: number, bgY: number, places?: number): number;
  export function sRGBtoY(r: number, g: number, b: number): number;
  export function displayP3toY(r: number, g: number, b: number): number;
  export function adobeRGBtoY(r: number, g: number, b: number): number;
  export function alphaBlend(rgbaFG: number[], rgbaBG: number[]): number[];
  export function colorParsley(colorString: string): number[];
  export function reverseAPCA(contrast: number, knownY: number, knownParity?: boolean): number;
  export function fontLookupAPCA(contrast: number): string;
}