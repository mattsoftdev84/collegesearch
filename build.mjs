// Builds the files that get copied into the WebForms project:
//   deploy/sapien-vendor.js  – React + ReactDOM (changes only when libraries are upgraded)
//   deploy/sapien.js         – the SAPIEN app code
//   deploy/sapien.css        – styles (all scoped under #sapien-root)
//
//   node build.mjs           one-off production build
//   node build.mjs --watch   rebuild on change
//   node build.mjs --serve   watch + serve the repo root; open /preview/
import * as esbuild from 'esbuild';

const args = new Set(process.argv.slice(2));
const serve = args.has('--serve');
const watch = serve || args.has('--watch');

// The vendor bundle puts React on window.SapienVendor. The app bundle maps its
// react imports onto that global instead of bundling a second copy.
const vendorGlobals = {
  'react': 'React',
  'react-dom/client': 'ReactDOMClient',
  'react/jsx-runtime': 'JSXRuntime',
};
const useVendorGlobals = {
  name: 'use-vendor-globals',
  setup(build) {
    const filter = new RegExp('^(' + Object.keys(vendorGlobals).map((k) => k.replace('/', '\\/')).join('|') + ')$');
    build.onResolve({ filter }, (a) => ({ path: a.path, namespace: 'vendor-global' }));
    build.onLoad({ filter: /.*/, namespace: 'vendor-global' }, (a) => ({
      contents: `module.exports = window.SapienVendor.${vendorGlobals[a.path]};`,
      loader: 'js',
    }));
  },
};

const common = {
  bundle: true,
  minify: !watch,
  sourcemap: watch ? 'inline' : false,
  target: 'es2020',
  define: { 'process.env.NODE_ENV': JSON.stringify(watch ? 'development' : 'production') },
  logLevel: 'info',
};

const configs = [
  { ...common, entryPoints: ['src/vendor.js'], outfile: 'deploy/sapien-vendor.js', format: 'iife' },
  {
    ...common,
    entryPoints: ['src/main.jsx'],
    outfile: 'deploy/sapien.js',
    format: 'iife',
    jsx: 'automatic',
    plugins: [useVendorGlobals],
  },
  { ...common, entryPoints: ['src/app.css'], outfile: 'deploy/sapien.css' },
];

if (!watch) {
  await Promise.all(configs.map((c) => esbuild.build(c)));
} else {
  const ctxs = await Promise.all(configs.map((c) => esbuild.context(c)));
  await Promise.all(ctxs.map((c) => c.watch()));
  if (serve) {
    const { port } = await ctxs[1].serve({ servedir: '.', port: 8000 });
    console.log(`\n  Preview: http://localhost:${port}/preview/\n`);
  }
}
