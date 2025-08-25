import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: resolve(__dirname, '..'),
  
  server: {
    port: 3000,
    open: '/demo.html'
  },

  build: {
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, '../src/index.js'),
      name: 'TamylaUI',
      fileName: (format) => `tamyla-ui.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          'react': 'React',
          'react-dom': 'ReactDOM'
        }
      }
    },
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },

  css: {
    postcss: {
      plugins: [
        require('autoprefixer'),
        require('cssnano')({
          preset: 'default'
        })
      ]
    }
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, '../src'),
      '@atoms': resolve(__dirname, '../atoms'),
      '@molecules': resolve(__dirname, '../molecules'),
      '@organisms': resolve(__dirname, '../organisms'),
      '@applications': resolve(__dirname, '../applications'),
      '@core': resolve(__dirname, '../core')
    }
  },

  optimizeDeps: {
    include: []
  }
});
