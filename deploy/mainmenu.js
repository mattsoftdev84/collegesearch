(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // vendor-global:react-dom/client
  var require_client = __commonJS({
    "vendor-global:react-dom/client"(exports, module) {
      module.exports = window.SapienVendor.ReactDOMClient;
    }
  });

  // vendor-global:react
  var require_react = __commonJS({
    "vendor-global:react"(exports, module) {
      module.exports = window.SapienVendor.React;
    }
  });

  // vendor-global:lucide
  var require_lucide = __commonJS({
    "vendor-global:lucide"(exports, module) {
      module.exports = window.SapienVendor.Lucide;
    }
  });

  // vendor-global:react/jsx-runtime
  var require_jsx_runtime = __commonJS({
    "vendor-global:react/jsx-runtime"(exports, module) {
      module.exports = window.SapienVendor.JSXRuntime;
    }
  });

  // src/main.jsx
  var import_client = __toESM(require_client());

  // src/App.jsx
  var import_react7 = __toESM(require_react());

  // src/hooks.js
  var import_react = __toESM(require_react());
  function useDebounced(value, ms) {
    const [v, setV] = (0, import_react.useState)(value);
    (0, import_react.useEffect)(() => {
      const t = setTimeout(() => setV(value), ms);
      return () => clearTimeout(t);
    }, [value, ms]);
    return v;
  }
  var MODES = ["learners", "courses", "tools"];
  function parseHash(hash = window.location.hash) {
    const raw = hash.replace(/^#\/?/, "");
    const [path, qs = ""] = raw.split("?");
    const parts = path.split("/").filter(Boolean).map(decodeURIComponent);
    const params = new URLSearchParams(qs);
    if (parts[0] === "icons") return { page: "icons" };
    if (parts.length >= 2 && ["learner", "course", "class", "tool"].includes(parts[0])) {
      return { page: parts[0], id: parts.slice(1).join("/") };
    }
    const mode = params.get("mode");
    return {
      page: "search",
      mode: MODES.includes(mode) ? mode : "learners",
      q: params.get("q") || "",
      inactive: params.get("inactive") === "1"
    };
  }
  function searchHash({ mode, q, inactive }) {
    const p = new URLSearchParams();
    if (mode && mode !== "learners") p.set("mode", mode);
    if (q) p.set("q", q);
    if (inactive) p.set("inactive", "1");
    const s = p.toString();
    return "#/" + (s ? "?" + s : "");
  }
  function detailHash(page, id) {
    return `#/${page}/${encodeURIComponent(id)}`;
  }
  function useHashRoute() {
    const [route, setRoute] = (0, import_react.useState)(() => parseHash());
    (0, import_react.useEffect)(() => {
      const on = () => setRoute(parseHash());
      window.addEventListener("hashchange", on);
      return () => window.removeEventListener("hashchange", on);
    }, []);
    return route;
  }
  function load(key, fallback) {
    try {
      const v = window.localStorage.getItem(key);
      return v == null ? fallback : v;
    } catch {
      return fallback;
    }
  }
  function save(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
    }
  }

  // src/SearchPage.jsx
  var import_react6 = __toESM(require_react());

  // src/api.js
  function asRows(data) {
    if (data == null || data === "") return [];
    if (typeof data === "string") data = JSON.parse(data);
    return Array.isArray(data) ? data : [];
  }
  function isTrue(v) {
    return v === true || v === 1 || v === "1" || String(v).toLowerCase() === "true";
  }
  function str(v) {
    return v == null ? "" : String(v).trim();
  }
  var EXPIRED_TEXT = "Your session has expired";
  function toError(err) {
    let msg;
    let status = 0;
    let type = "";
    if (err && typeof err.get_message === "function") {
      msg = err.get_message();
      if (typeof err.get_statusCode === "function") status = err.get_statusCode();
      if (typeof err.get_exceptionType === "function") type = err.get_exceptionType() || "";
    } else {
      msg = err && err.message ? err.message : String(err);
    }
    const e = new Error(msg);
    e.expired = msg.indexOf(EXPIRED_TEXT) !== -1 || status === 401 || status === 403 || /SecurityException/.test(type);
    return e;
  }
  async function callRaw(method, params) {
    if (typeof window.callWebMethod !== "function") {
      throw new Error("callWebMethod is not loaded (library/js/DataMethods.js).");
    }
    try {
      return await window.callWebMethod(method, params);
    } catch (err) {
      throw toError(err);
    }
  }
  async function call(method, search) {
    return asRows(await callRaw(method, { search }));
  }
  async function keepAlive() {
    await callRaw("KeepAlive", {});
  }
  async function searchLearners(search) {
    const rows = await call("GetLearners", search);
    const seen = /* @__PURE__ */ new Set();
    const out = [];
    for (const r of rows) {
      const pcode = str(r.pcode);
      if (!pcode || seen.has(pcode)) continue;
      seen.add(pcode);
      out.push({
        id: pcode,
        pcode,
        active: isTrue(r.active),
        firstname: str(r.firstname),
        lastname: str(r.lastname),
        dob: str(r.dob),
        level: str(r.level),
        classcode: str(r.classcode),
        tutorcode: str(r.tutorcode),
        tutorname: str(r.tutorname),
        endyear: str(r.endyear)
      });
    }
    return out;
  }
  async function searchCourses(search) {
    const rows = await call("GetCourses", search);
    return rows.map((r) => ({
      id: str(r.uicyear) || `${str(r.uic)}-${str(r.acyear)}`,
      uicyear: str(r.uicyear) || `${str(r.uic)}-${str(r.acyear)}`,
      acyear: str(r.acyear),
      uic: str(r.uic),
      title: str(r.title),
      qualification: str(r.qualification),
      active: isTrue(r.iscurrent)
    }));
  }
  async function searchClasses(search) {
    const rows = await call("GetClasses", search);
    return rows.map((r) => ({
      id: str(r.uicyear) || `${str(r.classcode)}-${str(r.acyear)}`,
      uicyear: str(r.uicyear) || `${str(r.classcode)}-${str(r.acyear)}`,
      acyear: str(r.acyear),
      uic: str(r.uic),
      title: str(r.title),
      qualification: str(r.qualification),
      classcode: str(r.classcode),
      staffcode: str(r.staffcode),
      staffname: str(r.staffname),
      active: isTrue(r.iscurrent)
    }));
  }

  // src/ResultTable.jsx
  var import_react3 = __toESM(require_react());

  // src/ui.jsx
  var import_react2 = __toESM(require_react());
  var import_lucide = __toESM(require_lucide());
  var import_jsx_runtime = __toESM(require_jsx_runtime());
  var toKey = (name) => String(name || "").trim().replace(/(^|[-_\s]+)([a-z0-9])/gi, (_, sep, c) => c.toUpperCase());
  var FALLBACK_ICON = "layout-grid";
  var hasIcon = (name) => Object.prototype.hasOwnProperty.call(import_lucide.icons, toKey(name));
  function Icon({ name, size = 18 }) {
    const node = hasIcon(name) ? import_lucide.icons[toKey(name)] : null;
    if (!node) return null;
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", focusable: "false", children: node.map(([tag, attrs], i) => (0, import_react2.createElement)(tag, { key: i, ...attrs })) });
  }
  function StatusPill({ active }) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "sp-status " + (active ? "on" : "off"), children: active ? "Active" : "Inactive" });
  }
  function Switch({ checked, onChange, children }) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { type: "button", role: "switch", "aria-checked": checked, className: "sp-switch" + (checked ? " on" : ""), onClick: () => onChange(!checked), children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "track", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "thumb" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children })
    ] });
  }
  function Spinner({ label = "Loading" }) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "sp-spinner", role: "status", "aria-label": label });
  }

  // src/ResultTable.jsx
  var import_jsx_runtime2 = __toESM(require_jsx_runtime());
  var ROW_LIMIT = 200;
  function ResultTable({ caption, rows, columns, href, defaultSort }) {
    const [sort, setSort] = (0, import_react3.useState)(defaultSort);
    const sorted = (0, import_react3.useMemo)(() => {
      const col = columns.find((c) => c.key === sort.key);
      if (!col) return rows;
      const dir = sort.dir === "desc" ? -1 : 1;
      return [...rows].sort((a, b) => b.active - a.active || dir * String(col.value(a)).localeCompare(String(col.value(b)), void 0, { numeric: true, sensitivity: "base" }));
    }, [rows, columns, sort]);
    const shown = sorted.slice(0, ROW_LIMIT);
    const toggleSort = (key) => setSort((s) => s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" });
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "sp-table-wrap", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("table", { className: "sp-table", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("caption", { className: "sp-sr", children: caption }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("tr", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("th", { scope: "col", children: "Status" }),
          columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("th", { scope: "col", "aria-sort": sort.key === c.key ? sort.dir === "asc" ? "ascending" : "descending" : void 0, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("button", { type: "button", className: "sp-th-btn", onClick: () => toggleSort(c.key), children: [
            c.label,
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "arr", "aria-hidden": "true", children: sort.key === c.key ? sort.dir === "asc" ? "\u25B2" : "\u25BC" : "" })
          ] }) }, c.key))
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("tbody", { children: shown.map((r) => {
          const to = href(r);
          return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
            "tr",
            {
              className: r.active ? "" : "inactive",
              onClick: (e) => {
                if (e.target.closest("a")) return;
                window.location.href = to;
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(StatusPill, { active: r.active }) }),
                columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("td", { className: c.link ? "primary" : void 0, children: c.link ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("a", { href: to, children: c.render ? c.render(r) : c.value(r) }) : c.render ? c.render(r) : c.value(r) }, c.key))
              ]
            },
            r.id
          );
        }) })
      ] }) }),
      sorted.length > ROW_LIMIT && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("p", { className: "sp-table-foot", children: [
        "Showing the first ",
        ROW_LIMIT,
        " of ",
        sorted.length,
        ". Keep typing to narrow the search."
      ] })
    ] });
  }

  // src/session.js
  var import_react4 = __toESM(require_react());
  function intervals() {
    const fast = window.SapienPreview && /[?&]keepalive=(\d+)s\b/.exec(window.location.search);
    if (fast) {
      const ping = Math.max(1, Number(fast[1])) * 1e3;
      return { ping, active: ping * 2.5 };
    }
    return { ping: 4 * 6e4, active: 10 * 6e4 };
  }
  var expired = false;
  var subs = /* @__PURE__ */ new Set();
  function markExpired() {
    if (expired) return;
    expired = true;
    subs.forEach((fn) => fn());
  }
  function subscribe(fn) {
    subs.add(fn);
    return () => subs.delete(fn);
  }
  function useSessionExpired() {
    return (0, import_react4.useSyncExternalStore)(subscribe, () => expired);
  }
  function reloadPage() {
    window.location.reload();
  }
  var ACTIVITY = ["keydown", "pointerdown", "pointermove", "wheel", "scroll", "touchstart"];
  function useKeepAlive() {
    (0, import_react4.useEffect)(() => {
      const { ping, active } = intervals();
      let lastActivity = Date.now();
      let lastPing = Date.now();
      let busy = false;
      const visible = () => document.visibilityState !== "hidden";
      const check = () => {
        const now = Date.now();
        if (expired || busy || !visible()) return;
        if (now - lastActivity > active) return;
        if (now - lastPing < ping) return;
        busy = true;
        lastPing = now;
        keepAlive().then(
          () => busy = false,
          (err) => {
            busy = false;
            if (err && err.expired) markExpired();
          }
        );
      };
      const onActivity = () => lastActivity = Date.now();
      const onVisible = () => {
        if (!visible()) return;
        onActivity();
        check();
      };
      ACTIVITY.forEach((ev) => window.addEventListener(ev, onActivity, { passive: true, capture: true }));
      document.addEventListener("visibilitychange", onVisible);
      const timer = setInterval(check, Math.min(15e3, ping / 4));
      return () => {
        ACTIVITY.forEach((ev) => window.removeEventListener(ev, onActivity, { capture: true }));
        document.removeEventListener("visibilitychange", onVisible);
        clearInterval(timer);
      };
    }, []);
  }

  // src/links.js
  var PAGES = {
    learner: "ViewStudent.aspx?student={0}",
    // {0} = pcode
    course: "ViewCourse.aspx?group={0}",
    //     {0} = uicyear (uic-acyear)
    class: "ViewCourse.aspx?group={0}"
    //      {0} = uicyear (classcode-acyear)
  };
  var isPreview = () => window.SapienPreview === true;
  function link(kind, value) {
    if (isPreview()) return detailHash(kind, value);
    return PAGES[kind].replace("{0}", encodeURIComponent(value));
  }
  var learnerLink = (r) => link("learner", r.pcode);
  var courseLink = (r) => link("course", r.uicyear);
  var classLink = (r) => link("class", r.uicyear);

  // src/tools.js
  var import_react5 = __toESM(require_react());
  var scriptSrc = typeof document !== "undefined" && document.currentScript ? document.currentScript.src : "";
  var TOOLS_FILE = "mainmenu-tools.json";
  var toolsUrl = () => new URL(TOOLS_FILE, scriptSrc || window.location.href).href;
  var str2 = (v) => v == null ? "" : String(v).trim();
  var slug = (s) => s.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "tool";
  function normalise(data) {
    if (!Array.isArray(data)) throw new Error(`${TOOLS_FILE} should contain a list: [ { ... }, { ... } ]`);
    const used = /* @__PURE__ */ new Set();
    const out = [];
    for (const t of data) {
      if (!t || typeof t !== "object") continue;
      const title = str2(t.title);
      if (!title) continue;
      let id = slug(title);
      for (let n = 2; used.has(id); n++) id = `${slug(title)}-${n}`;
      used.add(id);
      out.push({ id, title, description: str2(t.description), icon: str2(t.icon), link: str2(t.link) });
    }
    return out;
  }
  var pending = null;
  function loadTools() {
    if (!pending) {
      pending = fetch(toolsUrl(), { cache: "no-cache", credentials: "same-origin" }).then((res) => {
        if (!res.ok) throw new Error(`${TOOLS_FILE}: ${res.status} ${res.statusText}`);
        return res.text();
      }).then((text) => {
        try {
          return JSON.parse(text.replace(/^﻿/, ""));
        } catch (e) {
          throw new Error(`${TOOLS_FILE} isn't valid JSON (check for a missing or extra comma): ${e.message}`);
        }
      }).then(normalise).catch((err) => {
        pending = null;
        throw err;
      });
    }
    return pending;
  }
  function useTools(enabled = true) {
    const [state, setState] = (0, import_react5.useState)({ status: "loading", tools: [] });
    const [attempt, setAttempt] = (0, import_react5.useState)(0);
    (0, import_react5.useEffect)(() => {
      if (!enabled) return;
      let live = true;
      loadTools().then(
        (tools) => live && setState({ status: "done", tools }),
        (err) => live && setState({ status: "error", tools: [], error: err.message || String(err) })
      );
      return () => {
        live = false;
      };
    }, [enabled, attempt]);
    return { ...state, retry: () => (setState({ status: "loading", tools: [] }), setAttempt((n) => n + 1)) };
  }
  function filterTools(tools, q) {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return tools;
    return tools.filter((t) => {
      const hay = (t.title + " " + t.description).toLowerCase();
      return words.every((w) => hay.includes(w));
    });
  }

  // src/SearchPage.jsx
  var import_jsx_runtime3 = __toESM(require_jsx_runtime());
  var MIN_CHARS = 3;
  var DEBOUNCE_MS = 300;
  var CACHE_MS = 6e4;
  var MODES2 = {
    learners: { label: "Search Learners", icon: "user", placeholder: "Name, learner ID or tutor group\u2026" },
    courses: { label: "Search Courses", icon: "book-open", placeholder: "Course code, title, class code or staff\u2026" },
    tools: { label: "Dashboards & Tools", icon: "layout-grid", placeholder: "Filter dashboards and tools\u2026" }
  };
  var toolHref = (t) => t.link || detailHash("tool", t.id);
  var cache = /* @__PURE__ */ new Map();
  function cached(key, fn) {
    const hit = cache.get(key);
    if (hit && Date.now() - hit.at < CACHE_MS) return hit.promise;
    const promise = fn();
    cache.set(key, { at: Date.now(), promise });
    promise.catch(() => cache.delete(key));
    if (cache.size > 60) cache.delete(cache.keys().next().value);
    return promise;
  }
  function runSearch(mode, term) {
    const key = term.toLowerCase();
    if (mode === "learners") {
      return cached("L:" + key, () => searchLearners(term)).then((learners) => ({ learners }));
    }
    return Promise.all([cached("C:" + key, () => searchCourses(term)), cached("K:" + key, () => searchClasses(term))]).then(
      ([courses, classes]) => ({ courses, classes })
    );
  }
  var known = /* @__PURE__ */ new Map();
  function SearchPage({ route, hidden }) {
    const [mode, setMode] = (0, import_react6.useState)(() => route.page === "search" ? route.mode : "learners");
    const [q, setQ] = (0, import_react6.useState)(() => route.page === "search" ? route.q : "");
    const [showInactive, setShowInactive] = (0, import_react6.useState)(() => route.page === "search" && route.inactive);
    const [state, setState] = (0, import_react6.useState)({ status: "idle" });
    const [retry, setRetry] = (0, import_react6.useState)(0);
    const inputRef = (0, import_react6.useRef)(null);
    const isTools = mode === "tools";
    const term = useDebounced(q.trim(), DEBOUNCE_MS);
    const ready = !isTools && term.length >= MIN_CHARS;
    const toolList = useTools(isTools);
    const tools = (0, import_react6.useMemo)(() => isTools ? filterTools(toolList.tools, q) : [], [isTools, toolList.tools, q]);
    (0, import_react6.useEffect)(() => {
      if (parseHash().page !== "search") return;
      const h = searchHash({ mode, q: q.trim(), inactive: showInactive });
      if (h !== window.location.hash) window.history.replaceState(null, "", h);
    }, [mode, q, showInactive]);
    (0, import_react6.useEffect)(() => {
      if (route.page !== "search") return;
      setMode(route.mode);
      setQ((cur) => cur.trim() === route.q ? cur : route.q);
      setShowInactive(route.inactive);
    }, [route]);
    (0, import_react6.useEffect)(() => {
      if (!ready) {
        setState({ status: "idle" });
        return;
      }
      let stale = false;
      setState((s) => ({ ...s, status: "loading", error: null }));
      runSearch(mode, term).then(
        (data2) => {
          if (stale) return;
          for (const list of Object.values(data2)) for (const item of list) known.set(item.id, item);
          setState({ status: "done", mode, term, data: data2 });
        },
        (err) => {
          if (err && err.expired) markExpired();
          if (!stale) setState({ status: "error", mode, term, error: err.message || String(err), expired: !!(err && err.expired) });
        }
      );
      return () => {
        stale = true;
      };
    }, [mode, term, ready, retry]);
    const data = state.data && state.mode === mode ? state.data : null;
    const loading = state.status === "loading";
    const hasResults = isTools || ready || q.trim().length > 0;
    const onKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (isTools && q.trim() && tools.length) window.location.href = toolHref(tools[0]);
      }
      if (e.key === "Escape") setQ("");
    };
    const hint = isTools ? q.trim() && tools.length ? "Press Enter to open the first match" : "\xA0" : q.trim().length > 0 && q.trim().length < MIN_CHARS ? `Type at least ${MIN_CHARS} characters to search` : !q ? "Results appear as you type" : "\xA0";
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "sp-search", hidden, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "sp-hero" + (hasResults ? " compact" : ""), children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("h1", { className: "sp-title", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "sp-sr", children: "SAPIEN" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "br l", "aria-hidden": "true" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "word-wrap", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "word", children: "SAPIEN".split("").map((ch, i) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { "--i": i }, children: ch }, i)) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "br r", "aria-hidden": "true" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "sp-searchbox", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "sp-seg", role: "group", "aria-label": "What to search", children: Object.entries(MODES2).map(([key, m]) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
            "button",
            {
              type: "button",
              "aria-pressed": mode === key,
              className: mode === key ? "on" : "",
              onClick: () => {
                if (key !== mode) setQ("");
                setMode(key);
                inputRef.current && inputRef.current.focus();
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { name: m.icon, size: 16 }),
                m.label
              ]
            },
            key
          )) }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "sp-input", children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { name: "search" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
              "input",
              {
                ref: inputRef,
                type: "search",
                autoFocus: true,
                autoComplete: "off",
                spellCheck: "false",
                "aria-label": MODES2[mode].label,
                placeholder: MODES2[mode].placeholder,
                value: q,
                onChange: (e) => setQ(e.target.value),
                onKeyDown
              }
            ),
            loading && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Spinner, { label: "Searching" }),
            q && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { type: "button", className: "sp-clear", "aria-label": "Clear search", onClick: () => {
              setQ("");
              inputRef.current.focus();
            }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { name: "x", size: 16 }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: "sp-hint", "aria-live": "polite", children: hint })
        ] })
      ] }),
      isTools && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(ToolList, { status: toolList.status, error: toolList.error, retry: toolList.retry, total: toolList.tools.length, tools, q: q.trim(), clear: () => {
        setQ("");
        inputRef.current.focus();
      } }),
      ready && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "sp-results", "aria-busy": loading, children: state.status === "error" && state.expired ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "sp-error", role: "alert", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: "Can't search: your session has expired." }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { type: "button", className: "sp-btn small", onClick: reloadPage, children: "Reload" })
      ] }) : state.status === "error" ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "sp-error", role: "alert", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { children: [
          "Search failed: ",
          state.error
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { type: "button", className: "sp-btn small", onClick: () => setRetry((n) => n + 1), children: "Try again" })
      ] }) : !data ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("p", { className: "sp-msg", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Spinner, {}),
        " Searching\u2026"
      ] }) : mode === "learners" ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(LearnerResults, { learners: data.learners, term: state.term, showInactive, setShowInactive }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(CourseResults, { courses: data.courses, classes: data.classes, term: state.term, showInactive, setShowInactive }) })
    ] });
  }
  function ToolList({ status, error, retry, total, tools, q, clear }) {
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("section", { className: "sp-results sp-tools-wrap", "aria-label": "Dashboards and tools", children: status === "loading" ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("p", { className: "sp-msg", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Spinner, {}),
      " Loading\u2026"
    ] }) : status === "error" ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "sp-error", role: "alert", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { children: [
        "Couldn't load the dashboards and tools list. ",
        error
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { type: "button", className: "sp-btn small", onClick: retry, children: "Try again" })
    ] }) : total === 0 ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "sp-empty", children: [
      "No dashboards or tools have been added yet (",
      TOOLS_FILE,
      " is empty)."
    ] }) : tools.length ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("ul", { className: "sp-tools", children: tools.map((t) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("a", { className: "sp-tool", href: toolHref(t), children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "sp-tool-icon", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { name: hasIcon(t.icon) ? t.icon : FALLBACK_ICON, size: 20 }) }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "sp-tool-text", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("b", { children: t.title }),
        t.description && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: t.description })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "sp-tool-go", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { name: "arrow-right", size: 16 }) })
    ] }) }, t.id)) }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "sp-empty", children: [
      "No dashboards or tools match \u201C",
      q,
      "\u201D.",
      " ",
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { type: "button", className: "sp-link", onClick: clear, children: "Clear filter" })
    ] }) });
  }
  function split(rows, showInactive) {
    const active = rows.filter((r) => r.active);
    return { rows: showInactive ? rows : active, inactiveCount: rows.length - active.length };
  }
  function Toolbar({ summary, inactiveCount, showInactive, setShowInactive }) {
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "sp-toolbar", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { "aria-live": "polite", children: summary }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(Switch, { checked: showInactive, onChange: setShowInactive, children: [
        "Show inactive",
        inactiveCount ? ` (${inactiveCount})` : ""
      ] })
    ] });
  }
  function Empty({ what, term, inactiveCount, showInactive, setShowInactive }) {
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "sp-empty", children: inactiveCount > 0 && !showInactive ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
      "No active ",
      what,
      " match \u201C",
      term,
      "\u201D.",
      " ",
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("button", { type: "button", className: "sp-link", onClick: () => setShowInactive(true), children: [
        "Show ",
        inactiveCount,
        " inactive"
      ] })
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
      "No ",
      what,
      " match \u201C",
      term,
      "\u201D."
    ] }) });
  }
  var plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
  var LEARNER_COLS = [
    { key: "name", label: "Name", link: true, value: (r) => `${r.lastname}, ${r.firstname}`, render: (r) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("b", { children: r.lastname }),
      ", ",
      r.firstname
    ] }) },
    { key: "pcode", label: "Learner ID", value: (r) => r.pcode },
    { key: "level", label: "Level", value: (r) => r.level },
    { key: "classcode", label: "Tutor group", value: (r) => r.classcode },
    { key: "tutorname", label: "Tutor", value: (r) => r.tutorname },
    { key: "endyear", label: "End year", value: (r) => r.endyear }
  ];
  function LearnerResults({ learners, term, showInactive, setShowInactive }) {
    const { rows, inactiveCount } = (0, import_react6.useMemo)(() => split(learners, showInactive), [learners, showInactive]);
    const activeCount = learners.length - inactiveCount;
    const summary = showInactive ? `${plural(learners.length, "learner", "learners")} (${activeCount} active)` : `${plural(activeCount, "active learner", "active learners")}${inactiveCount ? ` \xB7 ${inactiveCount} inactive hidden` : ""}`;
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("section", { className: "sp-section", "aria-labelledby": "sp-h-learners", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "sp-section-head", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { id: "sp-h-learners", children: "Learners" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Toolbar, { summary, inactiveCount, showInactive, setShowInactive }),
      rows.length ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(ResultTable, { caption: "Learners", rows, columns: LEARNER_COLS, href: learnerLink, defaultSort: { key: "name", dir: "asc" } }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Empty, { what: "learners", term, inactiveCount, showInactive, setShowInactive })
    ] });
  }
  var COURSE_COLS = [
    { key: "title", label: "Course", link: true, value: (r) => r.title, render: (r) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("b", { children: r.title }) },
    { key: "uic", label: "Code", value: (r) => r.uic },
    { key: "qualification", label: "Qualification", value: (r) => r.qualification },
    { key: "acyear", label: "Year", value: (r) => r.acyear }
  ];
  var CLASS_COLS = [
    { key: "classcode", label: "Class", link: true, value: (r) => r.classcode, render: (r) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("b", { children: r.classcode }) },
    { key: "title", label: "Course", value: (r) => r.title },
    { key: "uic", label: "Code", value: (r) => r.uic },
    { key: "staffname", label: "Staff", value: (r) => r.staffname },
    { key: "acyear", label: "Year", value: (r) => r.acyear }
  ];
  function CourseResults({ courses, classes, term, showInactive, setShowInactive }) {
    const c = (0, import_react6.useMemo)(() => split(courses, showInactive), [courses, showInactive]);
    const k = (0, import_react6.useMemo)(() => split(classes, showInactive), [classes, showInactive]);
    const inactiveCount = c.inactiveCount + k.inactiveCount;
    const summary = `${plural(c.rows.length, "course", "courses")} \xB7 ${plural(k.rows.length, "class", "classes")}${!showInactive && inactiveCount ? ` \xB7 ${inactiveCount} inactive hidden` : ""}`;
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Toolbar, { summary, inactiveCount, showInactive, setShowInactive }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("section", { className: "sp-section", "aria-labelledby": "sp-h-courses", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "sp-section-head", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { id: "sp-h-courses", children: "Courses" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "sp-count", children: c.rows.length })
        ] }),
        c.rows.length ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(ResultTable, { caption: "Courses", rows: c.rows, columns: COURSE_COLS, href: courseLink, defaultSort: { key: "acyear", dir: "desc" } }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Empty, { what: "courses", term, inactiveCount: c.inactiveCount, showInactive, setShowInactive })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("section", { className: "sp-section", "aria-labelledby": "sp-h-classes", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "sp-section-head", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { id: "sp-h-classes", children: "Classes" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "sp-count", children: k.rows.length })
        ] }),
        k.rows.length ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(ResultTable, { caption: "Classes", rows: k.rows, columns: CLASS_COLS, href: classLink, defaultSort: { key: "acyear", dir: "desc" } }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Empty, { what: "classes", term, inactiveCount: k.inactiveCount, showInactive, setShowInactive })
      ] })
    ] });
  }

  // src/App.jsx
  var import_jsx_runtime4 = __toESM(require_jsx_runtime());
  var THEME_KEY = "sapien-theme";
  function initialTheme() {
    const saved = load(THEME_KEY, null);
    if (saved === "dark" || saved === "light") return saved;
    return "dark";
  }
  function App({ rootEl }) {
    const route = useHashRoute();
    const [theme, setTheme] = (0, import_react7.useState)(initialTheme);
    const lastSearch = (0, import_react7.useRef)("#/");
    const searchScroll = (0, import_react7.useRef)(0);
    const prevPage = (0, import_react7.useRef)(route.page);
    const expired2 = useSessionExpired();
    useKeepAlive();
    (0, import_react7.useLayoutEffect)(() => {
      rootEl.setAttribute("data-theme", theme);
    }, [theme, rootEl]);
    if (route.page === "search") lastSearch.current = window.location.hash || "#/";
    (0, import_react7.useLayoutEffect)(() => {
      if (prevPage.current === "search" && route.page !== "search") {
        window.scrollTo(0, 0);
      } else if (prevPage.current !== "search" && route.page === "search") {
        window.scrollTo(0, searchScroll.current);
      }
      prevPage.current = route.page;
    }, [route.page]);
    (0, import_react7.useEffect)(() => {
      if (route.page !== "search") return;
      const on = () => searchScroll.current = window.scrollY;
      window.addEventListener("scroll", on, { passive: true });
      return () => window.removeEventListener("scroll", on);
    }, [route.page]);
    const toggleTheme = () => {
      const next = theme === "dark" ? "light" : "dark";
      setTheme(next);
      save(THEME_KEY, next);
    };
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "sp-app", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "sp-top", children: [
        route.page !== "search" && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("a", { className: "sp-btn ghost", href: lastSearch.current, children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Icon, { name: "arrow-left", size: 16 }),
          " Back to search"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "button",
          {
            type: "button",
            className: "sp-icon-btn",
            onClick: toggleTheme,
            "aria-label": theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
            title: theme === "dark" ? "Light mode" : "Dark mode",
            children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Icon, { name: theme === "dark" ? "sun" : "moon" })
          }
        )
      ] }),
      expired2 && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "sp-error sp-expired", role: "alert", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Icon, { name: "clock-exclamation-point", size: 16 }),
          " Your session has expired. Reload the page to carry on; your search will be kept."
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("button", { type: "button", className: "sp-btn small", onClick: reloadPage, children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Icon, { name: "rotate-cw", size: 16 }),
          " Reload"
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(SearchPage, { route, hidden: route.page !== "search" }),
      route.page === "icons" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(IconGallery, {}),
      route.page !== "search" && route.page !== "icons" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Placeholder, { kind: route.page, id: route.id })
    ] });
  }
  var KINDS = {
    learner: { title: "Learner record", area: "learner area" },
    course: { title: "Course", area: "course area" },
    class: { title: "Class", area: "class area" },
    tool: { title: "Dashboards & Tools", area: "tool" }
  };
  function Placeholder({ kind, id }) {
    const item = kind === "tool" ? null : known.get(id);
    const toolList = useTools(kind === "tool");
    const tool = kind === "tool" ? toolList.tools.find((t) => t.id === id) : null;
    const k = KINDS[kind];
    const headRef = (0, import_react7.useRef)(null);
    (0, import_react7.useEffect)(() => {
      headRef.current && headRef.current.focus();
    }, [kind, id]);
    let name = id;
    const facts = [];
    if (kind === "tool") {
      name = tool ? tool.title : toolList.status === "loading" ? "Loading\u2026" : "Unknown tool";
    } else if (item && kind === "learner") {
      name = `${item.firstname} ${item.lastname}`;
      facts.push(["Learner ID", item.pcode], ["Level", item.level], ["Tutor group", item.classcode], ["Tutor", item.tutorname]);
    } else if (item && kind === "course") {
      name = item.title;
      facts.push(["Code", item.uic], ["Year", item.acyear], ["Qualification", item.qualification]);
    } else if (item && kind === "class") {
      name = `${item.classcode}: ${item.title}`;
      facts.push(["Course", item.uic], ["Year", item.acyear], ["Staff", item.staffname]);
    }
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "sp-page", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "sp-eyebrow", children: k.title }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("h1", { className: "sp-page-title", tabIndex: -1, ref: headRef, children: [
        name,
        " ",
        item && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(StatusPill, { active: item.active })
      ] }),
      facts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("dl", { className: "sp-facts", children: facts.map(([label, v]) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("dt", { children: label }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("dd", { children: v || "\u2014" })
      ] }, label)) }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "sp-section sp-placeholder", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h2", { children: "Coming soon" }),
        kind === "tool" ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: toolList.status === "loading" ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Spinner, {}) : tool ? /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
          tool.description && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
            tool.description.replace(/\.$/, ""),
            ". "
          ] }),
          "This page hasn't been built yet."
        ] }) : `There is no tool called \u201C${id}\u201D.` }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("p", { children: [
          "This page belongs to the ",
          k.area,
          ", which hasn't been upgraded yet."
        ] })
      ] })
    ] });
  }
  function IconGallery() {
    const toolList = useTools(true);
    const [name, setName] = (0, import_react7.useState)("");
    const n = name.trim();
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "sp-page", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "sp-eyebrow", children: "Dashboards & Tools" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h1", { className: "sp-page-title", children: "Icons" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("p", { className: "sp-page-intro", children: [
        "Icons come from ",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("a", { href: "https://lucide.dev/icons", target: "_blank", rel: "noopener noreferrer", children: "Lucide" }),
        ". Find one there and use its name as ",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("code", { children: '"icon"' }),
        " in ",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("code", { children: "mainmenu-tools.json" }),
        ", e.g. ",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("code", { children: "layout-dashboard" }),
        ". A name that isn't found shows ",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("code", { children: FALLBACK_ICON }),
        "."
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { className: "sp-icon-try", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { children: "Try a name" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "input",
          {
            type: "text",
            value: name,
            placeholder: "e.g. calendar-days",
            spellCheck: "false",
            onChange: (e) => setName(e.target.value),
            onKeyDown: (e) => e.key === "Enter" && e.preventDefault()
          }
        ),
        n && (hasIcon(n) ? /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { className: "sp-icon-ok", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Icon, { name: n, size: 22 }),
          " Found"
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "sp-icon-bad", children: "Not a Lucide icon" }))
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h2", { className: "sp-icon-h", children: "In mainmenu-tools.json" }),
      toolList.status === "loading" ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Spinner, {}) : toolList.status === "error" ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "sp-icon-bad", children: toolList.error }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("ul", { className: "sp-icon-grid", children: toolList.tools.map((t) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("li", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "sp-tool-icon", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Icon, { name: hasIcon(t.icon) ? t.icon : FALLBACK_ICON, size: 20 }) }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("b", { children: t.title }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("br", {}),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("code", { children: t.icon || "(none)" }),
          !hasIcon(t.icon) && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "sp-icon-bad", children: " not found" })
        ] })
      ] }, t.id)) })
    ] });
  }

  // src/main.jsx
  var import_jsx_runtime5 = __toESM(require_jsx_runtime());
  function mount() {
    const el = document.getElementById("sapien-root");
    if (!el) {
      console.error('SAPIEN: no <div id="sapien-root"> on the page.');
      return;
    }
    (0, import_client.createRoot)(el).render(/* @__PURE__ */ (0, import_jsx_runtime5.jsx)(App, { rootEl: el }));
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
