import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  assetsInclude: ['**/*.onnx', '**/*.json', '**/*.model'], // Add model files as assets
  optimizeDeps: {
    include: ['onnxruntime-web'],
    exclude: ['gliner', 'onnxruntime-node']
  },
  server: {
    headers: {
      // Required for SharedArrayBuffer used by ONNX Runtime
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin'
    },
  },
  publicDir: resolve(__dirname, 'public'), // Explicitly set public directory
  build: {
    target: 'esnext',
    assetsDir: '', // Keep assets in root of dist
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  }
});