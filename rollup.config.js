import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import { readFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

export default [
  // ESM build
  {
    input: 'src/index.js',
    output: {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      resolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs(),
    ],
    external: ['react', 'react-dom'],
  },
  // UMD build
  {
    input: 'src/index.js',
    output: {
      file: 'dist/tamyla-ui.umd.js',
      format: 'umd',
      name: 'TamylaUI',
      sourcemap: true,
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
    },
    plugins: [
      resolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs(),
      terser(),
    ],
    external: ['react', 'react-dom'],
  },
];
