const typescript = require('@rollup/plugin-typescript');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');

module.exports = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    nodeResolve({
      preferBuiltins: false,
      browser: true,
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
    }),
  ],
  external: [], // Bundle all dependencies
};
