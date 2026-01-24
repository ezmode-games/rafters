/**
 * Media components for images and embeds
 * @module components/media
 */

// R-201: Image component with upload, editing, and responsive display
export { Image, type ImageAlignment, type ImageProps } from './Image';

// R-201: Embed component for external content (YouTube, Vimeo, Twitch, Twitter)
export { Embed, type AspectRatio, type EmbedProps } from './Embed';

// R-201: Embed detection utilities
export {
  detectEmbedProvider,
  getAspectRatioValue,
  isAllowedEmbedDomain,
  type EmbedDetectionResult,
  type EmbedProvider,
} from './utils';
