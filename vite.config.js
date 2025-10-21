import { defineConfig } from 'vite';
import path from 'path'; 

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@tokens': path.resolve(__dirname, './src/tokens'),
    },
  },
  build: {
    lib: {
      entry: 'src/index.js',
      formats: ['es'],
    },
  },
});