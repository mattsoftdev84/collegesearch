// Builds the files that get copied into the WebForms project:
//   deploy/mainmenu-vendor.js  – React + ReactDOM (changes only when libraries are upgraded)
//   deploy/mainmenu.js         – the SAPIEN app code
//   deploy/mainmenu.css        – styles (all scoped under #sapien-root)
//
// mainmenu.js and mainmenu.css are NOT minified, so they stay readable in the
// WebForms project. mainmenu.css is a straight copy of src/app.css (comments
// included). Only the React vendor bundle is minified.
//
//   node build.mjs           one-off production build
//   node build.mjs --watch   rebuild on change
//   node build.mjs --serve   watch + serve the repo root; open /preview/
import * as esbuild from 'esbuild';
import { copyFileSync, watch as watchFile } from 'node:fs';

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
  { ...common, entryPoints: ['src/vendor.js'], outfile: 'deploy/mainmenu-vendor.js', format: 'iife' },
  {
    ...common,
    entryPoints: ['src/main.jsx'],
    outfile: 'deploy/mainmenu.js',
    format: 'iife',
    minify: false, // keep the app code readable
    sourcemap: false,
    jsx: 'automatic',
    plugins: [useVendorGlobals],
  },
];

// CSS is copied as-is: it's one self-contained file, and esbuild would strip the comments.
const CSS_SRC = 'src/app.css';
const CSS_OUT = 'deploy/mainmenu.css';
const copyCss = () => {
  copyFileSync(CSS_SRC, CSS_OUT);
  console.log(`  ${CSS_OUT} (copied from ${CSS_SRC})`);
};
copyCss();

if (!watch) {
  await Promise.all(configs.map((c) => esbuild.build(c)));
} else {
  const ctxs = await Promise.all(configs.map((c) => esbuild.context(c)));
  await Promise.all(ctxs.map((c) => c.watch()));
  let t;
  watchFile(CSS_SRC, () => {
    clearTimeout(t);
    t = setTimeout(copyCss, 50); // editors fire several events per save
  });
  if (serve) {
    const { port } = await ctxs[1].serve({ servedir: '.', port: 8000 });
    console.log(`\n  Preview: http://localhost:${port}/preview/\n`);
  }
}
