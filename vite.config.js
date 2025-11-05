import { defineConfig } from 'vite';
import path from 'path'; 
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'; 

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@tokens': path.resolve(__dirname, './src/tokens'),
    },
  },
  plugins: [
    cssInjectedByJsPlugin(),
  ],
  build: {
    minify: true, 
    outDir: 'dist',
    assetsDir: 'assets', 
    lib: {
      entry: 'src/main.js',
      name: 'UASLP-UI-Kit',
      fileName: 'main', 
      formats: ['es'],
    },
    rollupOptions: {
      external: [/^lit/], 
      output: {
        globals: {
          'lit': 'Lit'
        }
      }
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