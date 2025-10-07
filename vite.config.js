import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import json from '@rollup/plugin-json';

export default defineConfig({
  plugins: [react(), json()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          vendor: ['lodash', 'date-fns', 'framer-motion', 'lucide-react', 'recharts'],
        },
      },
    },
  },
});