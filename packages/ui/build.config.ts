import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: ['./src/index'],
  declaration: true,
  externals: ['react', 'react-dom', 'class-variance-authority', 'clsx'],
  rollup: {
    emitCJS: true,
    esbuild: {
      target: 'es2022',
      jsx: 'transform',
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment',
    },
  },
});
