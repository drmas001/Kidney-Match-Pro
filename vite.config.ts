import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    base: './',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
      include: ['jspdf', 'jspdf-autotable']
    },
    build: {
      commonjsOptions: {
        include: [/node_modules/],
      }
    },
    define: {
      'process.env': env
    }
  };
});
