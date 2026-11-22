# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project overview

**SAPIEN**: a new React search page for an existing ASP.NET **WebForms** site (a college system). Users can search learners, or courses and classes, and results update as they type. A third tab, **Dashboards & Tools**, lists links to other parts of the site.

- Solo developer. **The user builds the database tables and the WebMethod endpoints in the separate WebForms project.** This repo only builds the frontend.
- This repo produces the static files in `deploy/`, which get **copied into the WebForms project by hand**.
- A preview (`preview/`) runs the app against demo data with a mock `PageMethods`.

## Commands

| Task                         | Command           |
| ---------------------------- | ----------------- |
| Install deps                 | `npm install`     |
| Preview (watch + serve)      | `npm run preview` → http://localhost:8000/preview/ |
| Production build → `deploy/` | `npm run build`   |
| Watch only                   | `npm run watch`   |

Always run `npm run build` (production React) before handing `deploy/` over or committing. Watch/preview builds use development React with inline sourcemaps, so they must not be committed.

`mainmenu.js` and `mainmenu.css` are deliberately **not minified**, so they stay readable in the main project. `mainmenu.css` is a straight copy of `src/app.css`, comments included. esbuild strips JS comments, so `mainmenu.js` is readable but has no comments (keeping them would need a bundler such as Rollup). Only `mainmenu-vendor.js` (React) is minified.

Preview notes:
- In Codespaces, port 8000 is auto-forwarded. The bare URL redirects to `/preview/` via the root `index.html`, which is dev-only and not deployed.
- Mock latency is random (150–650 ms). Typing `error` in the search box shows the failure state.
- Demo learners with inactive rows: try `smi`. Courses: try `french`.

## Architecture

```
src/
  vendor.js        → deploy/mainmenu-vendor.js  React + ReactDOM + all Lucide icons, exposed as window.SapienVendor (~740 KB min, ~180 KB gzipped)
  main.jsx         → deploy/mainmenu.js         App; imports of react/* and lucide resolve to window.SapienVendor (esbuild plugin in build.mjs)
  app.css          → deploy/mainmenu.css        Copied as-is (not via esbuild). All selectors scoped under #sapien-root
  App.jsx          Hash router, theme toggle, placeholder detail pages
  SearchPage.jsx   Title, mode switch, search box, debounced search, result lists, tool cards
  links.js         Where results link to: ViewStudent.aspx / ViewCourse.aspx (deployed) or #/ placeholders (preview)
  tools.js         Loads mainmenu-tools.json at runtime (next to mainmenu.js), plus the local filter
  mainmenu-tools.json → deploy/mainmenu-tools.json  Dashboards & Tools list (copied as-is)
  ui.jsx           Icon (Lucide lookup by name), StatusPill, Switch, Spinner
  ResultTable.jsx  Sortable results table (active rows first, max 200 rendered)
  api.js           Wrappers over window.callWebMethod plus row normalisation
  hooks.js         useDebounced, hash routing helpers, safe localStorage
docs/MainMenuB.aspx.txt     Full markup for the main project's page
library/js/DataMethods.js   Mirror of the main project's file (used only by the preview)
preview/                    index.html, demo-data.js, mock-pagemethods.js
.devcontainer/              Dev container (Codespaces + local Docker): Node 24, Claude Code, port 8000, npm install on create. Don't delete: without it the Codespace rebuilds with no Node.
.vscode/extensions.json     Recommends Dev Containers so local VS Code offers "Reopen in Container"
build.mjs                   esbuild config (3 bundles + 2 copied files)
```

### Backend contract

Calls go through `window.callWebMethod(name, { search })` from `library/js/DataMethods.js`. It resolves `response.Data` when `Status === 'success'`. `api.js` accepts `Data` as either an array or a JSON string.

| WebMethod                   | Row fields                                                                              | "Active" field |
| --------------------------- | --------------------------------------------------------------------------------------- | -------------- |
| `GetLearners(string search)` | pcode, active, firstname, lastname, dob, level, classcode, tutorcode, tutorname, endyear | `active`       |
| `GetCourses(string search)`  | acyear, uic, title, qualification, iscurrent, uicyear, searchstring                     | `iscurrent`    |
| `GetClasses(string search)`  | courses fields + classcode, staffcode, staffname                                        | `iscurrent`    |

- `uicyear` is misnamed. For a **course** it is `uic-acyear`, and for a **class** it is `classcode-acyear`. It's the key `ViewCourse.aspx?group=` takes for both, and the row id in the UI.
- Active flags may arrive as `1`/`"1"`/`true`/`"True"`, and `api.js` normalises them all. Learners are deduplicated by `pcode`.
- Search behaviour: no request until **3+ characters**, 300 ms debounce, stale responses ignored, and a 60 s in-memory cache. Course mode calls `GetCourses` and `GetClasses` in parallel.
- Agreed server-side behaviour: filter on the server, match case-insensitively with every typed word required, cap results (TOP ~200), and return active rows first. Do **not** ship all ~6,000 learners to the browser.

### Routing

Routes live in the hash so they never clash with WebForms/IIS:
- `#/?mode=courses&q=fre&inactive=1` is the search page. Its state is kept in the URL with `replaceState`, so Back restores it.
- Switching between Learners, Courses and Dashboards & Tools clears the search box.
- `#/?mode=tools&q=dash` is the Dashboards & Tools list. The box filters it locally (no server call, no 3-char minimum), and Enter opens the top match.
- Clicking a result goes to a real WebForms page (patterns in `src/links.js`, relative to `MainMenuB.aspx`):
  - learner → `ViewStudent.aspx?student=<pcode>`
  - course → `ViewCourse.aspx?group=<uicyear>` (uic-acyear)
  - class → `ViewCourse.aspx?group=<uicyear>` (classcode-acyear)
- The preview has no .aspx pages, so `preview/index.html` sets `window.SapienPreview = true`, and results open the placeholder pages `#/learner/<pcode>`, `#/course/<uicyear>` and `#/class/<uicyear>` instead.
- A tool with an empty `link` opens the placeholder page `#/tool/<id>`, where `<id>` is made from its title.
- `#/icons` checks the icon names used in `mainmenu-tools.json` and has a box to try any name. It works in the deployed page too.

### Dashboards & Tools list (`mainmenu-tools.json`)

```json
[ { "title": "Staff Dashboard", "description": "…", "icon": "gauge", "link": "StaffDashboard.aspx" } ]
```

- The app loads it at runtime from the same folder as `mainmenu.js`, using `document.currentScript`, so no path is configured. It uses `cache: 'no-cache'`, so edits show on the next page load.
- `link` is relative to `MainMenuB.aspx`. Leave it as `""` for a placeholder page.
- `icon` is a [Lucide](https://lucide.dev/icons) name such as `layout-dashboard` (PascalCase and Lucide's aliases also work). Unknown names show `layout-grid`. All Lucide icons are bundled because the names are only known at runtime.
- Entries without a title are skipped. A UTF-8 BOM is tolerated. Bad JSON shows an error naming the file, with a Try again button.
- **The user edits the deployed copy on the server.** `src/mainmenu-tools.json` is only the starting point and the preview's copy. Don't copy it over the server's edited file when redeploying.

## WebForms integration (in the main project)

The page is `MainMenuB.aspx`. Copy the files from `deploy/` into `library/js/mainmenu/` in the main project. Copy `mainmenu-tools.json` only the first time, because after that it's edited on the server. The full page markup is in `docs/MainMenuB.aspx.txt`. In short:

```html
<link rel="stylesheet" href="library/js/mainmenu/mainmenu.css?v=0.2.0" />
<form runat="server">
  <asp:ScriptManager runat="server" EnablePageMethods="true" />
  <div id="sapien-root" data-theme="dark"></div>
</form>
<script src="library/js/DataMethods.js"></script>
<script src="library/js/mainmenu/mainmenu-vendor.js?v=0.2.0"></script>   <!-- must load before mainmenu.js -->
<script src="library/js/mainmenu/mainmenu.js?v=0.2.0"></script>
```

- The WebMethods (`GetLearners`, `GetCourses`, `GetClasses`) must be `public static` `[WebMethod]`s in `MainMenuB.aspx.cs`, because `PageMethods` calls the page it's on.
- If IIS returns 404 for `mainmenu-tools.json`, add a `.json` → `application/json` `<mimeMap>` under `<system.webServer><staticContent>` in web.config.
- Bump `?v=` on the three file links (keep it in step with `package.json` `version`) each time new files are copied over, so browsers don't serve stale cached copies.

## Conventions / gotchas

- **The page is inside `<form runat="server">`.** Every `<button>` must have `type="button"`, and Enter in inputs must `preventDefault()`, or the page posts back. The preview wraps the app in a `<form>` that alerts on submit to catch regressions.
- Scope all CSS under `#sapien-root` and use the `sp-` class prefix. Don't add global styles, because the master page owns the page.
- Visual style follows the user's "work-tracker" app: same colour tokens, Segoe UI, light and dark themes. Theme is stored in `data-theme` on `#sapien-root`, with the user's choice saved in localStorage (`sapien-theme`). **Dark is the default.** The markup sets `data-theme="dark"` on the div so there's no light flash before React loads.
- Icons are Lucide everywhere, including the app's own buttons. Use Lucide names with `<Icon name="…" />`.
- `deploy/` is committed, because it is the deliverable. `node_modules/` is not.
- Committing straight to `main` is fine (solo project, the user's choice on 2026-11-22). Never commit secrets.
- Update this file when the contract, structure or commands change.

## Open questions

- `dob` in the sample CSV is `00:00.0`, which looks mangled by Excel. What is the real format? It isn't displayed yet.
- Do learners ever come back as multiple rows (for example, one per class)? The frontend currently keeps the first row per `pcode`.
- What are the real URLs for each dashboard/tool? The user fills them in directly in the deployed `mainmenu-tools.json`.

## Roadmap / status

- [x] Dev container, build pipeline, preview with demo data
- [x] Search page: learners / courses+classes, live search, active toggle, dark mode
- [x] Placeholder detail pages
- [x] Dashboards & Tools tab with placeholder pages
- [ ] Backend WebMethods wired up in the main project (user)
- [x] Results link to ViewStudent.aspx / ViewCourse.aspx when deployed
- [x] Dashboards & Tools list loaded from mainmenu-tools.json
- [ ] Real links filled in on the server's mainmenu-tools.json (user)

## Decisions log

- 2026-11-22: React 19 + esbuild. Output split into a vendor bundle and an app bundle so app deploys don't re-ship React.
- 2026-11-22: Search on the server for each debounced keystroke (3+ chars) instead of loading all learners up front. Smaller payloads, and personal data stays on the server unless it matches a search.
- 2026-11-22: Hash routing, so the app needs no server route configuration.
- 2026-11-22: Dashboards & Tools is a third tab with a fixed list in `src/tools.js`, filtered in the browser. It needs no WebMethod.
- 2026-11-22: Deployed as the "mainmenu" feature. The output files are `mainmenu-vendor.js`, `mainmenu.js` and `mainmenu.css`, copied to `library/js/mainmenu/` and loaded by `MainMenuB.aspx`. The UI name (SAPIEN), `#sapien-root` and `window.SapienVendor` are unchanged.
- 2026-11-22: Logo brackets are white in dark mode and stay blue in light mode, because white would vanish on the off-white background. Letters fade in without sliding.
- 2026-11-22: App JS and CSS are shipped unminified so they're readable in the main project. The vendor bundle stays minified.
- 2026-11-22: Results link to the existing ViewStudent.aspx / ViewCourse.aspx pages. The `#/` detail pages are kept only for the preview, switched on by `window.SapienPreview`.
- 2026-11-22: The Dashboards & Tools list moved to a runtime JSON file (`mainmenu-tools.json`) so links can be edited on the server without a rebuild. 
- 2026-11-22: Switching search mode clears the search box.
- 2026-11-22: Switched icons to Lucide (`lucide@1.70.0`, ISC), with all icons in the vendor bundle so any name works in `mainmenu-tools.json`. This makes the vendor file about 525 KB bigger, but it's cached.
- 2026-11-22: Dark mode is the default. A saved choice of light still wins.
