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
});