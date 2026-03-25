import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: "hybrid",
  adapter: cloudflare({
    platformProxy: {
      enabled: true
    }
  }),
  integrations: [tailwind()],
  vite: {
    ssr: {
      external: ['node:stream', 'node:crypto', 'node:fs', 'node:path']
    }
  }
});