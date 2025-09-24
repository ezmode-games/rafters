import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: ['./src/index'],
  declaration: true,
  rollup: {
    emitCJS: true,
    esbuild: {
      target: 'node22', // Match your engine requirement
      minify: process.env.NODE_ENV === 'production',
    },
  },
  externals: ['react', 'react-dom', 'zod'], // Peer and catalog deps
  transformer: 'swc', // 10x faster than tsc
});
