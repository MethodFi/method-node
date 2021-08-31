import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import flow from 'rollup-plugin-flow';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';


export default {
  input: 'src/index.js',
  plugins: [
    flow(),
    peerDepsExternal(),
    resolve(),
    babel({
      babelHelpers: 'runtime',
      exclude: 'node_modules/**',
    }),
    terser(),
    commonjs(),
    json(),
  ],
  output: [
    { file: pkg.main, format: 'cjs', sourcemap: true },
    { file: pkg.module, format: 'es', sourcemap: true },
  ],
};
