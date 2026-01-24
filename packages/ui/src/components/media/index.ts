/**
 * Media components for images and embeds
 * @module components/media
 */

// R-201: Embed component for external content (YouTube, Vimeo, Twitch, Twitter)
export { type AspectRatio, Embed, type EmbedProps } from './Embed';
// R-201: Image component with upload, editing, and responsive display
export { Image, type ImageAlignment, type ImageProps } from './Image';

// R-201: Embed detection utilities
export {
  detectEmbedProvider,
  type EmbedDetectionResult,
  type EmbedProvider,
  getAspectRatioValue,
  isAllowedEmbedDomain,
} from './utils';
