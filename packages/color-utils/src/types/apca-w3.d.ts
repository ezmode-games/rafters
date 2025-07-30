/**
 * Type declarations for apca-w3 library
 * https://www.npmjs.com/package/apca-w3
 */

declare module 'apca-w3' {
  /**
   * Convert sRGB values to Y (luminance)
   * @param rgbArray - Array of RGB values [r, g, b] in 0-255 range
   * @returns Y (luminance) value
   */
  export function sRGBtoY(rgbArray: number[]): number;

  /**
   * Calculate APCA contrast between two Y (luminance) values
   * @param textY - Text luminance value
   * @param backgroundY - Background luminance value
   * @returns APCA contrast value
   */
  export function APCAcontrast(textY: number, backgroundY: number): number;
}
