import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['jspdf-autotable']
  },
  build: {
    commonjsOptions: {
      include: [/jspdf-autotable/, /node_modules/],
    },
    rollupOptions: {
      output: {
        manualChunks: {
          jspdf: ['jspdf', 'jspdf-autotable'],
        },
      },
    },
  },
  define: {
    'process.env': process.env
  }
});
