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
    },
    build: {
      rollupOptions: {
        external: ['jspdf-autotable'],
        output: {
          globals: {
            'jspdf-autotable': 'jspdf-autotable'
          }
        }
      }
    },
    define: {
      'process.env': env
    }
  };
});
