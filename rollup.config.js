import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import dts from 'rollup-plugin-dts';
import terser from '@rollup/plugin-terser';

const minifyOptions = {
  compress: {
    drop_console: true,
    drop_debugger: true,
    pure_funcs: ['console.log', 'console.info', 'console.debug']
  },
  mangle: true
};

export default [
  // ESM build - preserve structure
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist',
      format: 'esm',
      entryFileNames: '[name].esm.js',
      chunkFileNames: '[name]-[hash].esm.js',
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
      }),
      terser(minifyOptions),
    ],
    external: [],
  },
  // CJS build - preserve structure with ES5 transpilation
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist',
      format: 'cjs',
      entryFileNames: '[name].js',
      chunkFileNames: '[name]-[hash].js',
      preserveModules: true,
      preserveModulesRoot: 'src',
      exports: 'named',
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
      }),
      babel({
        babelHelpers: 'bundled',
        presets: [
          ['@babel/preset-env', {
            targets: { node: '12' },
            modules: false,
          }]
        ],
        extensions: ['.js', '.ts'],
        exclude: 'node_modules/**',
      }),
      terser(minifyOptions),
    ],
    external: [],
  },
  // Type definitions - preserve structure
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist',
      entryFileNames: '[name].d.ts',
      format: 'esm',
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
    plugins: [dts()],
  },
];
