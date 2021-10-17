import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@/common': resolve('./src/common'),
      '@/components': resolve('./src/components'),
      '@/services': resolve('./src/services'),
      '@/styles': resolve('./src/styles'),
      '@/utils': resolve('./src/utils'),
      '@/assets': resolve('./src/assets'),
    },
  },
  plugins: [react()],
});
