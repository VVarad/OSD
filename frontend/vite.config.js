import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

function multiPageRewritePlugin() {
  return {
    name: 'multi-page-rewrite',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url === '/register' || req.url === '/register/') {
          req.url = '/register.html';
        }
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url === '/register' || req.url === '/register/') {
          req.url = '/register.html';
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [multiPageRewritePlugin()],
  server: { port: 5173, open: true },
  build: {
    target: 'es2020',
    outDir: 'dist',
    // Keep images as separate cacheable files instead of inlining them into CSS/JS.
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        register: resolve(__dirname, 'register.html'),
      },
    },
  },
});
