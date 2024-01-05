// rollup.config.mjs
import typescript from 'rollup-plugin-typescript2';
import dts from 'rollup-plugin-dts';

export default [
	{
		input: 'main.ts',
		output: {
			file: 'dist/index.js',
			format: 'cjs',
			sourcemap: true
		},
		plugins: [
			typescript(),
		]
	},
	{
		input: `main.ts`,
		plugins: [dts()],
		output: {
			file: `dist/index.d.ts`,
			format: 'es',
		},
	}
];
  