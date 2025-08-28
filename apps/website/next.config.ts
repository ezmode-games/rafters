import createMDX from '@next/mdx';
import type { NextConfig } from 'next';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';

const nextConfig: NextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      remarkGfm, // GitHub Flavored Markdown (tables, strikethrough, etc.)
      remarkFrontmatter, // YAML frontmatter support
    ],
    rehypePlugins: [
      rehypeHighlight, // Syntax highlighting for code blocks
      rehypeSlug, // Add IDs to headings for linking
    ],
  },
});

// Wrap MDX and Next.js config with each other
export default withMDX(nextConfig);

// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
initOpenNextCloudflareForDev();
