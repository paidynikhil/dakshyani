import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      // proxy all /api requests to backend
      '/v1': {
        target: 'https://dakshyani.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      // proxy static uploads
      '/uploads': {
        target: 'https://dakshyani.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
