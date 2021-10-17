import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@/common': resolve(__dirname, '..', 'src/common'),
      '@/components': resolve(__dirname, '..', 'src/components'),
      '@/services': resolve(__dirname, '..', 'src/services'),
      '@/styles': resolve(__dirname, '..', 'src/styles'),
      '@/assets': resolve(__dirname, '..', 'src/assets'),
    },
  },
  plugins: [react()],
});
