import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const root = fileURLToPath(new URL('.', import.meta.url));

/**
 * Build estático (SPA) para o GitHub Pages.
 * Reaproveita a mesma página do App Router; só o host muda.
 * `PAGES_BASE` vem do workflow (ex.: /logiflow-3d/).
 */
export default defineConfig({
  root: `${root}static`,
  base: process.env.PAGES_BASE ?? '/',
  publicDir: `${root}public`,
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^next\/link$/, replacement: `${root}static/next-link-shim.tsx` },
      { find: /^@\//, replacement: `${root}` },
    ],
  },
  build: {
    outDir: `${root}out-pages`,
    emptyOutDir: true,
    chunkSizeWarningLimit: 1200,
  },
});
