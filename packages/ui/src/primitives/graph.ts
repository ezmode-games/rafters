/**
 * Graph core primitive
 * Base rendering engine for the rafters chart system.
 *
 * Provides SVG/Canvas container creation, scale helpers, coordinate transforms,
 * and path builders that chart-type primitives (gauge, bar, line, etc.) build on.
 *
 * Leaf primitive: zero external deps, framework-agnostic, SSR-safe.
 */

export interface GraphConfig {
  container: HTMLElement;
  width?: number;
  height?: number;
  renderer?: 'svg' | 'canvas';
}

export interface GraphTheme {
  foreground: string;
  muted: string;
  background: string;
}

export interface GraphControls {
  resize: (width: number, height: number) => void;
  setTheme: (theme: Partial<GraphTheme>) => void;
  destroy: () => void;
  readonly element: SVGSVGElement | HTMLCanvasElement | null;
}

const DEFAULT_WIDTH = 300;
const DEFAULT_HEIGHT = 200;

/**
 * Create a graph rendering context.
 * Appends an SVG or Canvas element to the container.
 */
export function createGraph(config: GraphConfig): GraphControls {
  if (!config.container) {
    throw new Error('Graph container is required');
  }

  const { container, renderer = 'svg' } = config;
  let width = config.width ?? DEFAULT_WIDTH;
  let height = config.height ?? DEFAULT_HEIGHT;
  let element: SVGSVGElement | HTMLCanvasElement | null = null;

  if (renderer === 'svg') {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.display = 'block';
    svg.setAttribute('role', 'img');
    container.appendChild(svg);
    element = svg;
  } else {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);
    element = canvas;
  }

  return {
    get element() {
      return element;
    },

    resize(newWidth: number, newHeight: number) {
      width = newWidth;
      height = newHeight;

      if (!element) return;

      if (element instanceof SVGSVGElement) {
        element.setAttribute('viewBox', `0 0 ${width} ${height}`);
      } else {
        element.width = width;
        element.height = height;
      }
    },

    setTheme(theme: Partial<GraphTheme>) {
      if (!element) return;

      if (theme.foreground) {
        element.style.color = theme.foreground;
      }
      if (theme.background && element instanceof SVGSVGElement) {
        element.style.backgroundColor = theme.background;
      }
    },

    destroy() {
      if (element) {
        element.remove();
        element = null;
      }
    },
  };
}

/**
 * Create a linear scale that maps values from domain to range.
 * Handles inverted domains (domain[0] > domain[1]).
 */
export function linearScale(
  domain: [number, number],
  range: [number, number],
): (value: number) => number {
  const domainSpan = domain[1] - domain[0];
  const rangeSpan = range[1] - range[0];

  if (domainSpan === 0) {
    return () => range[0];
  }

  return (value: number) => {
    const normalized = (value - domain[0]) / domainSpan;
    return range[0] + normalized * rangeSpan;
  };
}

/**
 * Convert polar coordinates to cartesian.
 * Angle in degrees, 0 = right (3 o'clock), counterclockwise.
 */
export function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleDeg: number,
): { x: number; y: number } {
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy - radius * Math.sin(angleRad),
  };
}

/**
 * Build a straight-line SVG path from a series of points.
 */
export function linePath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';

  const segments = points.map((p, i) => {
    const cmd = i === 0 ? 'M' : 'L';
    return `${cmd} ${p.x} ${p.y}`;
  });

  return segments.join(' ');
}

/**
 * Build a smooth cubic bezier SVG path from a series of points.
 * Uses Catmull-Rom to cubic bezier conversion for smooth interpolation.
 */
export function smoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  if (points.length < 3) return linePath(points);

  const first = points[0] as { x: number; y: number };
  let d = `M ${first.x} ${first.y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)] as { x: number; y: number };
    const p1 = points[i] as { x: number; y: number };
    const p2 = points[i + 1] as { x: number; y: number };
    const p3 = points[Math.min(points.length - 1, i + 2)] as { x: number; y: number };

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  return d;
}

/**
 * Build an SVG arc path between two angles.
 * Angles in degrees, 0 = right (3 o'clock), counterclockwise.
 */
export function arcPath(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
): string {
  const start = polarToCartesian(cx, cy, radius, startAngle);
  const end = polarToCartesian(cx, cy, radius, endAngle);

  let sweep = endAngle - startAngle;
  if (sweep < 0) sweep += 360;
  const largeArc = sweep > 180 ? 1 : 0;

  return [
    `M ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y}`,
  ].join(' ');
}
