import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: ['./src/index', './src/bin'],
  declaration: true,
  failOnWarn: false,
  rollup: {
    emitCJS: true,
    esbuild: {
      target: 'node22',
      minify: process.env.NODE_ENV === 'production',
    },
  },
  externals: [
    '@modelcontextprotocol/sdk',
    'chalk',
    'commander',
    'execa',
    'fs-extra',
    'inquirer',
    'ora',
  ],
});
