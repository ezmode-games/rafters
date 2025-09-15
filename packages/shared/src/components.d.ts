/**
 * @rafters/shared/components
 *
 * Shared React components for brand assets and utilities that aren't part
 * of the main UI library. These are foundational components used across
 * different parts of the Rafters ecosystem.
 */
import type React from 'react';
export interface LogoProps extends React.SVGProps<SVGSVGElement> {
    /** Color for the wordmark text */
    wordmarkColor?: string;
    /** Color for the geometric mark */
    markColor?: string;
}
/**
 * Rafters brand logo component
 * SVG-based scalable logo with customizable colors
 */
export declare function Logo({ wordmarkColor, markColor, ...props }: LogoProps): import("react/jsx-runtime").JSX.Element;
