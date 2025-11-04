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
  test: {
    environment: 'jsdom', 
    globals: true,     
    include: ['**/*.test.js', '**/*.spec.js'], 
    setupFiles: [path.resolve(__dirname, './src/test/setup.js')],
    alias: {
      '@components': path.resolve(__dirname, 'src/components'), 
      '@tokens': path.resolve(__dirname, 'src/tokens'),
    },    
  },
});