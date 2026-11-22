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

Always run `npm run build` (minified, production React) before handing `deploy/` over or committing. Watch/preview builds are unminified with inline sourcemaps, so they must not be committed.

Preview notes:
- In Codespaces, port 8000 is auto-forwarded. The bare URL redirects to `/preview/` via the root `index.html`, which is dev-only and not deployed.
- Mock latency is random (150–650 ms). Typing `error` in the search box shows the failure state.
- Demo learners with inactive rows: try `smi`. Courses: try `french`.

## Architecture

```
src/
  vendor.js        → deploy/mainmenu-vendor.js  React + ReactDOM, exposed as window.SapienVendor
  main.jsx         → deploy/mainmenu.js         App; imports of react/* resolve to window.SapienVendor (esbuild plugin in build.mjs)
  app.css          → deploy/mainmenu.css        All selectors scoped under #sapien-root
  App.jsx          Hash router, theme toggle, placeholder detail pages
  SearchPage.jsx   Title, mode switch, search box, debounced search, result lists, tool cards
  tools.js         Dashboards & Tools list (id, title, icon, blurb, href) + local filter
  ResultTable.jsx  Sortable results table (active rows first, max 200 rendered)
  api.js           Wrappers over window.callWebMethod plus row normalisation
  hooks.js         useDebounced, hash routing helpers, safe localStorage
docs/MainMenuB.aspx.txt     Full markup for the main project's page
library/js/DataMethods.js   Mirror of the main project's file (used only by the preview)
preview/                    index.html, demo-data.js, mock-pagemethods.js
.devcontainer/              Dev container (Codespaces + local Docker): Node 24, Claude Code, port 8000, npm install on create. Don't delete: without it the Codespace rebuilds with no Node.
.vscode/extensions.json     Recommends Dev Containers so local VS Code offers "Reopen in Container"
build.mjs                   esbuild config (3 outputs)
```

### Backend contract

Calls go through `window.callWebMethod(name, { search })` from `library/js/DataMethods.js`. It resolves `response.Data` when `Status === 'success'`. `api.js` accepts `Data` as either an array or a JSON string.

| WebMethod                   | Row fields                                                                              | "Active" field |
| --------------------------- | --------------------------------------------------------------------------------------- | -------------- |
| `GetLearners(string search)` | pcode, active, firstname, lastname, dob, level, classcode, tutorcode, tutorname, endyear | `active`       |
| `GetCourses(string search)`  | acyear, uic, title, qualification, iscurrent, uicyear, searchstring                     | `iscurrent`    |
| `GetClasses(string search)`  | courses fields + classcode, staffcode, staffname                                        | `iscurrent`    |

- Active flags may arrive as `1`/`"1"`/`true`/`"True"`, and `api.js` normalises them all. Learners are deduplicated by `pcode`.
- Search behaviour: no request until **3+ characters**, 300 ms debounce, stale responses ignored, and a 60 s in-memory cache. Course mode calls `GetCourses` and `GetClasses` in parallel.
- Agreed server-side behaviour: filter on the server, match case-insensitively with every typed word required, cap results (TOP ~200), and return active rows first. Do **not** ship all ~6,000 learners to the browser.

### Routing

Routes live in the hash so they never clash with WebForms/IIS:
- `#/?mode=courses&q=fre&inactive=1` is the search page. Its state is kept in the URL with `replaceState`, so Back restores it.
- `#/?mode=tools&q=dash` is the Dashboards & Tools list. The box filters it locally (no server call, no 3-char minimum), and Enter opens the top match.
- `#/learner/<pcode>`, `#/course/<uicyear>`, `#/class/<uicyear>|<classcode>` and `#/tool/<id>` are placeholder pages. When a tool's real page exists, set its `href` in `src/tools.js` and the card links there instead. The real pages will be built later in other parts of the site.

## WebForms integration (in the main project)

The page is `MainMenuB.aspx`. Copy the 3 files from `deploy/` into `library/js/mainmenu/` in the main project. The full page markup is in `docs/MainMenuB.aspx.txt`. In short:

```html
<link rel="stylesheet" href="library/js/mainmenu/mainmenu.css?v=0.1.0" />
<form runat="server">
  <asp:ScriptManager runat="server" EnablePageMethods="true" />
  <div id="sapien-root"></div>
</form>
<script src="library/js/DataMethods.js"></script>
<script src="library/js/mainmenu/mainmenu-vendor.js?v=0.1.0"></script>   <!-- must load before mainmenu.js -->
<script src="library/js/mainmenu/mainmenu.js?v=0.1.0"></script>
```

- The WebMethods (`GetLearners`, `GetCourses`, `GetClasses`) must be `public static` `[WebMethod]`s in `MainMenuB.aspx.cs`, because `PageMethods` calls the page it's on.
- Bump `?v=` on the three file links (keep it in step with `package.json` `version`) each time new files are copied over, so browsers don't serve stale cached copies.

## Conventions / gotchas

- **The page is inside `<form runat="server">`.** Every `<button>` must have `type="button"`, and Enter in inputs must `preventDefault()`, or the page posts back. The preview wraps the app in a `<form>` that alerts on submit to catch regressions.
- Scope all CSS under `#sapien-root` and use the `sp-` class prefix. Don't add global styles, because the master page owns the page.
- Visual style follows the user's "work-tracker" app: same colour tokens, Segoe UI, light and dark themes. Theme is stored in `data-theme` on `#sapien-root`, with the user's choice saved in localStorage (`sapien-theme`).
- `deploy/` is committed, because it is the deliverable. `node_modules/` is not.
- Commit on a feature branch, not directly on `main`. Never commit secrets.
- Update this file when the contract, structure or commands change.

## Open questions

- `dob` in the sample CSV is `00:00.0`, which looks mangled by Excel. What is the real format? It isn't displayed yet.
- Do learners ever come back as multiple rows (for example, one per class)? The frontend currently keeps the first row per `pcode`.
- What are the real URLs for learner, course and class pages, and for each dashboard/tool, once they exist? They will replace the placeholders.

## Roadmap / status

- [x] Dev container, build pipeline, preview with demo data
- [x] Search page: learners / courses+classes, live search, active toggle, dark mode
- [x] Placeholder detail pages
- [x] Dashboards & Tools tab with placeholder pages
- [ ] Backend WebMethods wired up in the main project (user)
- [ ] Real learner, course and class pages

## Decisions log

- 2026-11-22: React 19 + esbuild. Output split into a vendor bundle and an app bundle so app deploys don't re-ship React.
- 2026-11-22: Search on the server for each debounced keystroke (3+ chars) instead of loading all learners up front. Smaller payloads, and personal data stays on the server unless it matches a search.
- 2026-11-22: Hash routing, so the app needs no server route configuration.
- 2026-11-22: Dashboards & Tools is a third tab with a fixed list in `src/tools.js`, filtered in the browser. It needs no WebMethod.
- 2026-11-22: Deployed as the "mainmenu" feature. The output files are `mainmenu-vendor.js`, `mainmenu.js` and `mainmenu.css`, copied to `library/js/mainmenu/` and loaded by `MainMenuB.aspx`. The UI name (SAPIEN), `#sapien-root` and `window.SapienVendor` are unchanged.
- 2026-11-22: Logo brackets are white in dark mode and stay blue in light mode, because white would vanish on the off-white background. Letters fade in without sliding.
