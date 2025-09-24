import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: ['./src/index'],
  declaration: true,
  rollup: {
    emitCJS: true,
    esbuild: {
      target: 'node22',
    },
  },
  transformer: 'swc',
});
