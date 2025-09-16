declare module 'apca-w3' {
  export function APCAcontrast(foreground: number, background: number): number;
  export function sRGBtoY(rgb: [number, number, number]): number;
}