// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { visit } from 'unist-util-visit';
import { transformImageUrl } from './src/utils/imageUrl.ts';

import tailwindcss from '@tailwindcss/vite';

function remarkImageReplace() {
  return (/** @type {any} */ tree) => {
    visit(tree, 'image', (node) => {
      if (!node.url) return;
      node.url = transformImageUrl(node.url);
    });
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://www.p1gd0g.cc',
  integrations: [mdx(), sitemap()],
  markdown: {
    remarkPlugins: [remarkImageReplace],
  },

  vite: {
    plugins: [tailwindcss()],
  },
});