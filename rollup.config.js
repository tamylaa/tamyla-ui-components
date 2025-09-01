import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import postcssImport from 'postcss-import';
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
      postcss({
        extract: 'tamyla-ui.css',
        minimize: true,
        sourceMap: true,
        plugins: [
          postcssImport()
        ]
      }),
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
      postcss({
        extract: false, // Inline CSS for UMD
        minimize: true,
        plugins: [
          postcssImport()
        ]
      }),
    ],
    external: ['react', 'react-dom'],
  },
];
