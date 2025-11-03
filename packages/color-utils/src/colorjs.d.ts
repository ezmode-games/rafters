/**
 * Type declarations for colorjs.io library
 * Minimal subset of the API that we use
 */
declare module 'colorjs.io' {
  interface ToStringOptions {
    format?: string;
    collapse?: boolean;
  }

  export default class Color {
    // Constructor can take various forms
    constructor(space: string, coords: [number, number, number], alpha?: number);
    constructor(cssString: string);

    // Color space properties
    coords: [number | undefined, number | undefined, number | undefined];
    alpha: number;
    r: number;
    g: number;
    b: number;
    srgb: { r: number; g: number; b: number };

    // Conversion methods
    to(space: string): Color;
    toGamut(options?: { space?: string; method?: string }): Color;
    toString(options?: ToStringOptions): string;

    // Static methods
    static get(color: unknown, prop: string): number;
    static set(color: unknown, prop: string, value: number): void;
  }
}
