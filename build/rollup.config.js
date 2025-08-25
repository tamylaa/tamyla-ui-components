import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import filesize from 'rollup-plugin-filesize';

const production = !process.env.ROLLUP_WATCH;

const baseConfig = {
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: false, // Handled separately
      declarationMap: false
    }),
    css({ output: 'tamyla-ui.css' }),
    production && terser({
      format: {
        comments: false
      },
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }),
    filesize()
  ].filter(Boolean),
  external: ['react', 'react-dom']
};

export default [
  // Main bundle - ESM
  {
    ...baseConfig,
    input: 'src/index.js',
    output: {
      file: 'dist/tamyla-ui.esm.js',
      format: 'esm',
      sourcemap: production ? false : true
    }
  },
  
  // Main bundle - UMD
  {
    ...baseConfig,
    input: 'src/index.js',
    output: {
      file: 'dist/tamyla-ui.umd.js',
      format: 'umd',
      name: 'TamylaUI',
      sourcemap: production ? false : true,
      globals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
      }
    }
  },

  // Core utilities - ESM
  {
    ...baseConfig,
    input: 'core/index.js',
    output: {
      file: 'dist/core/index.esm.js',
      format: 'esm',
      sourcemap: false
    }
  },

  // Atoms bundle - ESM
  {
    ...baseConfig,
    input: 'atoms/index.js',
    output: {
      file: 'dist/atoms/index.esm.js',
      format: 'esm',
      sourcemap: false
    }
  },

  // Molecules bundle - ESM
  {
    ...baseConfig,
    input: 'molecules/index.js',
    output: {
      file: 'dist/molecules/index.esm.js',
      format: 'esm',
      sourcemap: false
    }
  },

  // Applications bundle - ESM
  {
    ...baseConfig,
    input: 'applications/index.js',
    output: {
      file: 'dist/applications/index.esm.js',
      format: 'esm',
      sourcemap: false
    }
  },

  // Individual component bundles
  ...['button', 'input', 'card'].map(component => ({
    ...baseConfig,
    input: `atoms/${component}/${component}-system.js`,
    output: {
      file: `dist/components/${component}.esm.js`,
      format: 'esm',
      sourcemap: false
    }
  })),

  // Application bundles
  ...['enhanced-search', 'campaign-selector', 'content-manager'].map(app => ({
    ...baseConfig,
    input: `applications/${app}/${app.replace('-', '_')}_system.js`,
    output: {
      file: `dist/applications/${app}.esm.js`,
      format: 'esm',
      sourcemap: false
    }
  }))
];
