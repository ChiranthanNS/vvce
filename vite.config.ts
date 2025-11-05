import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/vvce/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
