import fs from 'node:fs';
import path from 'node:path';
import * as url from 'node:url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
// const __dirname = new URL('.', import.meta.url).pathname;
const { node } = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../electron-vendors.autogen.json'),
    'utf-8'
  )
);

const nativeNodeModulesPlugin = {
  name: 'native-node-modules',
  setup(build) {
    // Mark native Node.js modules as external
    build.onResolve({ filter: /\.node$/, namespace: 'file' }, args => {
      return { path: args.path, external: true };
    });
  },
};

/** @type {import('esbuild').BuildOptions} */
export const mainConfig = {
  entryPoints: ['layers/main/src/index.ts'],
  outdir: 'dist/layers/main',
  bundle: true,
  target: `node${node}`,
  platform: 'node',
  external: ['electron'],
  plugins: [nativeNodeModulesPlugin],
};

export const preloadConfig = {
  entryPoints: ['layers/preload/src/index.ts'],
  outdir: 'dist/layers/preload',
  bundle: true,
  target: `node${node}`,
  platform: 'node',
  external: ['electron'],
};
