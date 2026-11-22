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

  // vendor-global:react/jsx-runtime
  var require_jsx_runtime = __commonJS({
    "vendor-global:react/jsx-runtime"(exports, module) {
      module.exports = window.SapienVendor.JSXRuntime;
    }
  });

  // src/main.jsx
  var import_client = __toESM(require_client());

  // src/App.jsx
  var import_react4 = __toESM(require_react());

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
  var import_react3 = __toESM(require_react());

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
  async function call(method, search) {
    if (typeof window.callWebMethod !== "function") {
      throw new Error("callWebMethod is not loaded (library/js/DataMethods.js).");
    }
    try {
      return asRows(await window.callWebMethod(method, { search }));
    } catch (err) {
      const msg = err && typeof err.get_message === "function" ? err.get_message() : err && err.message ? err.message : String(err);
      throw new Error(msg);
    }
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
      id: `${str(r.uicyear) || `${str(r.uic)}-${str(r.acyear)}`}|${str(r.classcode)}`,
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
  var import_react2 = __toESM(require_react());

  // src/ui.jsx
  var import_jsx_runtime = __toESM(require_jsx_runtime());
  function Icon({ name, size = 18 }) {
    const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, focusable: "false" };
    switch (name) {
      case "search":
        return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { ...p, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "11", cy: "11", r: "7" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m20 20-3.5-3.5" })
        ] });
      case "x":
        return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { ...p, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M18 6 6 18M6 6l12 12" }) });
      case "sun":
        return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { ...p, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "12", cy: "12", r: "4" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" })
        ] });
      case "moon":
        return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { ...p, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" }) });
      case "back":
        return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { ...p, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M19 12H5M12 19l-7-7 7-7" }) });
      case "user":
        return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { ...p, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "12", cy: "8", r: "4" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M4 21a8 8 0 0 1 16 0" })
        ] });
      case "book":
        return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { ...p, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M4 19.5V21h16" })
        ] });
      case "grid":
        return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { ...p, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "3", y: "3", width: "7", height: "7", rx: "1.5" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "14", y: "3", width: "7", height: "7", rx: "1.5" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "3", y: "14", width: "7", height: "7", rx: "1.5" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "14", y: "14", width: "7", height: "7", rx: "1.5" })
        ] });
      case "gauge":
        return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { ...p, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3.5 17a9 9 0 1 1 17 0" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m12 13 4-5" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "12", cy: "13", r: "1.2" })
        ] });
      case "users":
        return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { ...p, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "9", cy: "8", r: "3.5" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M2.5 20a6.5 6.5 0 0 1 13 0" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14a6.5 6.5 0 0 1 3.5 6" })
        ] });
      case "clipboard":
        return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { ...p, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "5", y: "4", width: "14", height: "17", rx: "2" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M9 4V3h6v1M9 11h6M9 15h4" })
        ] });
      case "check":
        return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { ...p, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "3", y: "3", width: "18", height: "18", rx: "3" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m8 12 3 3 5-6" })
        ] });
      case "calendar":
        return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { ...p, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "3", y: "5", width: "18", height: "16", rx: "2" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3 10h18M8 3v4M16 3v4" })
        ] });
      case "shield":
        return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { ...p, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 3 4 6v6c0 4.5 3.4 8.2 8 9 4.6-.8 8-4.5 8-9V6z" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m9 12 2 2 4-4" })
        ] });
      case "home":
        return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { ...p, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3 11 12 4l9 7" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5 10v10h14V10" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M10 20v-5h4v5" })
        ] });
      case "layers":
        return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { ...p, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m12 3 9 5-9 5-9-5z" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m3 13 9 5 9-5" })
        ] });
      case "arrow":
        return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { ...p, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5 12h14M13 6l6 6-6 6" }) });
      default:
        return null;
    }
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
    const [sort, setSort] = (0, import_react2.useState)(defaultSort);
    const sorted = (0, import_react2.useMemo)(() => {
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
                window.location.hash = to;
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

  // src/tools.js
  var TOOLS = [
    { id: "staff-dashboard", title: "Staff Dashboard", icon: "gauge", blurb: "Your classes, tasks and alerts at a glance", href: null },
    { id: "tutor-dashboard", title: "Tutor Dashboard", icon: "users", blurb: "Tutor group overview, attendance and concerns", href: null },
    { id: "enrolment", title: "Enrolment System", icon: "clipboard", blurb: "Applications, enrolments and transfers", href: null },
    { id: "attendance", title: "Attendance Tracker", icon: "check", blurb: "Registers, absences and attendance trends", href: null },
    { id: "staff-timetables", title: "Staff Timetables", icon: "calendar", blurb: "Look up any staff member\u2019s timetable", href: null },
    { id: "access-arrangements", title: "Access Arrangements Dashboard", icon: "shield", blurb: "Exam access arrangements and support needs", href: null },
    { id: "parent-portal", title: "Parent Portal Accounts", icon: "home", blurb: "Manage parent and carer portal access", href: null },
    { id: "custom-cohorts", title: "Manage Custom Cohorts", icon: "layers", blurb: "Build and maintain custom groups of learners", href: null }
  ];
  var toolById = (id) => TOOLS.find((t) => t.id === id);
  function filterTools(q) {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return TOOLS;
    return TOOLS.filter((t) => {
      const hay = (t.title + " " + t.blurb).toLowerCase();
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
    courses: { label: "Search Courses", icon: "book", placeholder: "Course code, title, class code or staff\u2026" },
    tools: { label: "Dashboards & Tools", icon: "grid", placeholder: "Filter dashboards and tools\u2026" }
  };
  var toolHref = (t) => t.href || detailHash("tool", t.id);
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
    const [mode, setMode] = (0, import_react3.useState)(() => route.page === "search" ? route.mode : "learners");
    const [q, setQ] = (0, import_react3.useState)(() => route.page === "search" ? route.q : "");
    const [showInactive, setShowInactive] = (0, import_react3.useState)(() => route.page === "search" && route.inactive);
    const [state, setState] = (0, import_react3.useState)({ status: "idle" });
    const [retry, setRetry] = (0, import_react3.useState)(0);
    const inputRef = (0, import_react3.useRef)(null);
    const isTools = mode === "tools";
    const term = useDebounced(q.trim(), DEBOUNCE_MS);
    const ready = !isTools && term.length >= MIN_CHARS;
    const tools = (0, import_react3.useMemo)(() => isTools ? filterTools(q) : [], [isTools, q]);
    (0, import_react3.useEffect)(() => {
      if (parseHash().page !== "search") return;
      const h = searchHash({ mode, q: q.trim(), inactive: showInactive });
      if (h !== window.location.hash) window.history.replaceState(null, "", h);
    }, [mode, q, showInactive]);
    (0, import_react3.useEffect)(() => {
      if (route.page !== "search") return;
      setMode(route.mode);
      setQ((cur) => cur.trim() === route.q ? cur : route.q);
      setShowInactive(route.inactive);
    }, [route]);
    (0, import_react3.useEffect)(() => {
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
          if (!stale) setState({ status: "error", mode, term, error: err.message || String(err) });
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
      isTools && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(ToolList, { tools, q: q.trim(), clear: () => {
        setQ("");
        inputRef.current.focus();
      } }),
      ready && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "sp-results", "aria-busy": loading, children: state.status === "error" ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "sp-error", role: "alert", children: [
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
  function ToolList({ tools, q, clear }) {
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("section", { className: "sp-results sp-tools-wrap", "aria-label": "Dashboards and tools", children: tools.length ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("ul", { className: "sp-tools", children: tools.map((t) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("a", { className: "sp-tool", href: toolHref(t), children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "sp-tool-icon", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { name: t.icon, size: 20 }) }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "sp-tool-text", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("b", { children: t.title }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: t.blurb })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "sp-tool-go", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { name: "arrow", size: 16 }) })
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
    const { rows, inactiveCount } = (0, import_react3.useMemo)(() => split(learners, showInactive), [learners, showInactive]);
    const activeCount = learners.length - inactiveCount;
    const summary = showInactive ? `${plural(learners.length, "learner", "learners")} (${activeCount} active)` : `${plural(activeCount, "active learner", "active learners")}${inactiveCount ? ` \xB7 ${inactiveCount} inactive hidden` : ""}`;
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("section", { className: "sp-section", "aria-labelledby": "sp-h-learners", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "sp-section-head", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { id: "sp-h-learners", children: "Learners" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Toolbar, { summary, inactiveCount, showInactive, setShowInactive }),
      rows.length ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(ResultTable, { caption: "Learners", rows, columns: LEARNER_COLS, href: (r) => detailHash("learner", r.pcode), defaultSort: { key: "name", dir: "asc" } }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Empty, { what: "learners", term, inactiveCount, showInactive, setShowInactive })
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
    const c = (0, import_react3.useMemo)(() => split(courses, showInactive), [courses, showInactive]);
    const k = (0, import_react3.useMemo)(() => split(classes, showInactive), [classes, showInactive]);
    const inactiveCount = c.inactiveCount + k.inactiveCount;
    const summary = `${plural(c.rows.length, "course", "courses")} \xB7 ${plural(k.rows.length, "class", "classes")}${!showInactive && inactiveCount ? ` \xB7 ${inactiveCount} inactive hidden` : ""}`;
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Toolbar, { summary, inactiveCount, showInactive, setShowInactive }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("section", { className: "sp-section", "aria-labelledby": "sp-h-courses", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "sp-section-head", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { id: "sp-h-courses", children: "Courses" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "sp-count", children: c.rows.length })
        ] }),
        c.rows.length ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(ResultTable, { caption: "Courses", rows: c.rows, columns: COURSE_COLS, href: (r) => detailHash("course", r.id), defaultSort: { key: "acyear", dir: "desc" } }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Empty, { what: "courses", term, inactiveCount: c.inactiveCount, showInactive, setShowInactive })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("section", { className: "sp-section", "aria-labelledby": "sp-h-classes", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "sp-section-head", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { id: "sp-h-classes", children: "Classes" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "sp-count", children: k.rows.length })
        ] }),
        k.rows.length ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(ResultTable, { caption: "Classes", rows: k.rows, columns: CLASS_COLS, href: (r) => detailHash("class", r.id), defaultSort: { key: "acyear", dir: "desc" } }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Empty, { what: "classes", term, inactiveCount: k.inactiveCount, showInactive, setShowInactive })
      ] })
    ] });
  }

  // src/App.jsx
  var import_jsx_runtime4 = __toESM(require_jsx_runtime());
  var THEME_KEY = "sapien-theme";
  function initialTheme() {
    const saved = load(THEME_KEY, null);
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function App({ rootEl }) {
    const route = useHashRoute();
    const [theme, setTheme] = (0, import_react4.useState)(initialTheme);
    const lastSearch = (0, import_react4.useRef)("#/");
    const searchScroll = (0, import_react4.useRef)(0);
    const prevPage = (0, import_react4.useRef)(route.page);
    (0, import_react4.useLayoutEffect)(() => {
      rootEl.setAttribute("data-theme", theme);
    }, [theme, rootEl]);
    if (route.page === "search") lastSearch.current = window.location.hash || "#/";
    (0, import_react4.useLayoutEffect)(() => {
      if (prevPage.current === "search" && route.page !== "search") {
        window.scrollTo(0, 0);
      } else if (prevPage.current !== "search" && route.page === "search") {
        window.scrollTo(0, searchScroll.current);
      }
      prevPage.current = route.page;
    }, [route.page]);
    (0, import_react4.useEffect)(() => {
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
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Icon, { name: "back", size: 16 }),
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
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(SearchPage, { route, hidden: route.page !== "search" }),
      route.page !== "search" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Placeholder, { kind: route.page, id: route.id })
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
    const tool = kind === "tool" ? toolById(id) : null;
    const k = KINDS[kind];
    const headRef = (0, import_react4.useRef)(null);
    (0, import_react4.useEffect)(() => {
      headRef.current && headRef.current.focus();
    }, [kind, id]);
    let name = id;
    const facts = [];
    if (kind === "tool") {
      name = tool ? tool.title : "Unknown tool";
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
        kind === "tool" ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: tool ? `${tool.blurb}. This page hasn't been built yet.` : `There is no tool called \u201C${id}\u201D.` }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("p", { children: [
          "This page belongs to the ",
          k.area,
          ", which hasn't been upgraded yet."
        ] })
      ] })
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidmVuZG9yLWdsb2JhbDpyZWFjdC1kb20vY2xpZW50IiwgInZlbmRvci1nbG9iYWw6cmVhY3QiLCAidmVuZG9yLWdsb2JhbDpyZWFjdC9qc3gtcnVudGltZSIsICIuLi9zcmMvbWFpbi5qc3giLCAiLi4vc3JjL0FwcC5qc3giLCAiLi4vc3JjL2hvb2tzLmpzIiwgIi4uL3NyYy9TZWFyY2hQYWdlLmpzeCIsICIuLi9zcmMvYXBpLmpzIiwgIi4uL3NyYy9SZXN1bHRUYWJsZS5qc3giLCAiLi4vc3JjL3VpLmpzeCIsICIuLi9zcmMvdG9vbHMuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIm1vZHVsZS5leHBvcnRzID0gd2luZG93LlNhcGllblZlbmRvci5SZWFjdERPTUNsaWVudDsiLCAibW9kdWxlLmV4cG9ydHMgPSB3aW5kb3cuU2FwaWVuVmVuZG9yLlJlYWN0OyIsICJtb2R1bGUuZXhwb3J0cyA9IHdpbmRvdy5TYXBpZW5WZW5kb3IuSlNYUnVudGltZTsiLCAiLy8gQXBwIGJ1bmRsZSAtPiBkZXBsb3kvc2FwaWVuLmpzLiBOZWVkcywgaW4gb3JkZXI6IERhdGFNZXRob2RzLmpzLCBzYXBpZW4tdmVuZG9yLmpzLlxuLy8gTW91bnRzIGludG8gPGRpdiBpZD1cInNhcGllbi1yb290XCI+PC9kaXY+LlxuaW1wb3J0IHsgY3JlYXRlUm9vdCB9IGZyb20gJ3JlYWN0LWRvbS9jbGllbnQnO1xuaW1wb3J0IEFwcCBmcm9tICcuL0FwcC5qc3gnO1xuXG5mdW5jdGlvbiBtb3VudCgpIHtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2FwaWVuLXJvb3QnKTtcbiAgaWYgKCFlbCkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ1NBUElFTjogbm8gPGRpdiBpZD1cInNhcGllbi1yb290XCI+IG9uIHRoZSBwYWdlLicpO1xuICAgIHJldHVybjtcbiAgfVxuICBjcmVhdGVSb290KGVsKS5yZW5kZXIoPEFwcCByb290RWw9e2VsfSAvPik7XG59XG5cbmlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnbG9hZGluZycpIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBtb3VudCk7XG5lbHNlIG1vdW50KCk7XG4iLCAiaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VMYXlvdXRFZmZlY3QsIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBsb2FkLCBzYXZlLCB1c2VIYXNoUm91dGUgfSBmcm9tICcuL2hvb2tzLmpzJztcbmltcG9ydCBTZWFyY2hQYWdlLCB7IGtub3duIH0gZnJvbSAnLi9TZWFyY2hQYWdlLmpzeCc7XG5pbXBvcnQgeyB0b29sQnlJZCB9IGZyb20gJy4vdG9vbHMuanMnO1xuaW1wb3J0IHsgSWNvbiwgU3RhdHVzUGlsbCB9IGZyb20gJy4vdWkuanN4JztcblxuY29uc3QgVEhFTUVfS0VZID0gJ3NhcGllbi10aGVtZSc7XG5cbmZ1bmN0aW9uIGluaXRpYWxUaGVtZSgpIHtcbiAgY29uc3Qgc2F2ZWQgPSBsb2FkKFRIRU1FX0tFWSwgbnVsbCk7XG4gIGlmIChzYXZlZCA9PT0gJ2RhcmsnIHx8IHNhdmVkID09PSAnbGlnaHQnKSByZXR1cm4gc2F2ZWQ7XG4gIHJldHVybiB3aW5kb3cubWF0Y2hNZWRpYSAmJiB3aW5kb3cubWF0Y2hNZWRpYSgnKHByZWZlcnMtY29sb3Itc2NoZW1lOiBkYXJrKScpLm1hdGNoZXMgPyAnZGFyaycgOiAnbGlnaHQnO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBcHAoeyByb290RWwgfSkge1xuICBjb25zdCByb3V0ZSA9IHVzZUhhc2hSb3V0ZSgpO1xuICBjb25zdCBbdGhlbWUsIHNldFRoZW1lXSA9IHVzZVN0YXRlKGluaXRpYWxUaGVtZSk7XG4gIGNvbnN0IGxhc3RTZWFyY2ggPSB1c2VSZWYoJyMvJyk7XG4gIGNvbnN0IHNlYXJjaFNjcm9sbCA9IHVzZVJlZigwKTtcbiAgY29uc3QgcHJldlBhZ2UgPSB1c2VSZWYocm91dGUucGFnZSk7XG5cbiAgdXNlTGF5b3V0RWZmZWN0KCgpID0+IHtcbiAgICByb290RWwuc2V0QXR0cmlidXRlKCdkYXRhLXRoZW1lJywgdGhlbWUpO1xuICB9LCBbdGhlbWUsIHJvb3RFbF0pO1xuXG4gIC8vIFJlbWVtYmVyIHdoZXJlIHRoZSBzZWFyY2ggcGFnZSB3YXMgc28gXCJCYWNrIHRvIHNlYXJjaFwiIHJlc3RvcmVzIGl0IGV4YWN0bHkuXG4gIGlmIChyb3V0ZS5wYWdlID09PSAnc2VhcmNoJykgbGFzdFNlYXJjaC5jdXJyZW50ID0gd2luZG93LmxvY2F0aW9uLmhhc2ggfHwgJyMvJztcblxuICB1c2VMYXlvdXRFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChwcmV2UGFnZS5jdXJyZW50ID09PSAnc2VhcmNoJyAmJiByb3V0ZS5wYWdlICE9PSAnc2VhcmNoJykge1xuICAgICAgd2luZG93LnNjcm9sbFRvKDAsIDApO1xuICAgIH0gZWxzZSBpZiAocHJldlBhZ2UuY3VycmVudCAhPT0gJ3NlYXJjaCcgJiYgcm91dGUucGFnZSA9PT0gJ3NlYXJjaCcpIHtcbiAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCBzZWFyY2hTY3JvbGwuY3VycmVudCk7XG4gICAgfVxuICAgIHByZXZQYWdlLmN1cnJlbnQgPSByb3V0ZS5wYWdlO1xuICB9LCBbcm91dGUucGFnZV0pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHJvdXRlLnBhZ2UgIT09ICdzZWFyY2gnKSByZXR1cm47XG4gICAgY29uc3Qgb24gPSAoKSA9PiAoc2VhcmNoU2Nyb2xsLmN1cnJlbnQgPSB3aW5kb3cuc2Nyb2xsWSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIG9uLCB7IHBhc3NpdmU6IHRydWUgfSk7XG4gICAgcmV0dXJuICgpID0+IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBvbik7XG4gIH0sIFtyb3V0ZS5wYWdlXSk7XG5cbiAgY29uc3QgdG9nZ2xlVGhlbWUgPSAoKSA9PiB7XG4gICAgY29uc3QgbmV4dCA9IHRoZW1lID09PSAnZGFyaycgPyAnbGlnaHQnIDogJ2RhcmsnO1xuICAgIHNldFRoZW1lKG5leHQpO1xuICAgIHNhdmUoVEhFTUVfS0VZLCBuZXh0KTtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwic3AtYXBwXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwLXRvcFwiPlxuICAgICAgICB7cm91dGUucGFnZSAhPT0gJ3NlYXJjaCcgJiYgKFxuICAgICAgICAgIDxhIGNsYXNzTmFtZT1cInNwLWJ0biBnaG9zdFwiIGhyZWY9e2xhc3RTZWFyY2guY3VycmVudH0+XG4gICAgICAgICAgICA8SWNvbiBuYW1lPVwiYmFja1wiIHNpemU9ezE2fSAvPiBCYWNrIHRvIHNlYXJjaFxuICAgICAgICAgIDwvYT5cbiAgICAgICAgKX1cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgIGNsYXNzTmFtZT1cInNwLWljb24tYnRuXCJcbiAgICAgICAgICBvbkNsaWNrPXt0b2dnbGVUaGVtZX1cbiAgICAgICAgICBhcmlhLWxhYmVsPXt0aGVtZSA9PT0gJ2RhcmsnID8gJ1N3aXRjaCB0byBsaWdodCBtb2RlJyA6ICdTd2l0Y2ggdG8gZGFyayBtb2RlJ31cbiAgICAgICAgICB0aXRsZT17dGhlbWUgPT09ICdkYXJrJyA/ICdMaWdodCBtb2RlJyA6ICdEYXJrIG1vZGUnfVxuICAgICAgICA+XG4gICAgICAgICAgPEljb24gbmFtZT17dGhlbWUgPT09ICdkYXJrJyA/ICdzdW4nIDogJ21vb24nfSAvPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8U2VhcmNoUGFnZSByb3V0ZT17cm91dGV9IGhpZGRlbj17cm91dGUucGFnZSAhPT0gJ3NlYXJjaCd9IC8+XG4gICAgICB7cm91dGUucGFnZSAhPT0gJ3NlYXJjaCcgJiYgPFBsYWNlaG9sZGVyIGtpbmQ9e3JvdXRlLnBhZ2V9IGlkPXtyb3V0ZS5pZH0gLz59XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbmNvbnN0IEtJTkRTID0ge1xuICBsZWFybmVyOiB7IHRpdGxlOiAnTGVhcm5lciByZWNvcmQnLCBhcmVhOiAnbGVhcm5lciBhcmVhJyB9LFxuICBjb3Vyc2U6IHsgdGl0bGU6ICdDb3Vyc2UnLCBhcmVhOiAnY291cnNlIGFyZWEnIH0sXG4gIGNsYXNzOiB7IHRpdGxlOiAnQ2xhc3MnLCBhcmVhOiAnY2xhc3MgYXJlYScgfSxcbiAgdG9vbDogeyB0aXRsZTogJ0Rhc2hib2FyZHMgJiBUb29scycsIGFyZWE6ICd0b29sJyB9LFxufTtcblxuZnVuY3Rpb24gUGxhY2Vob2xkZXIoeyBraW5kLCBpZCB9KSB7XG4gIGNvbnN0IGl0ZW0gPSBraW5kID09PSAndG9vbCcgPyBudWxsIDoga25vd24uZ2V0KGlkKTtcbiAgY29uc3QgdG9vbCA9IGtpbmQgPT09ICd0b29sJyA/IHRvb2xCeUlkKGlkKSA6IG51bGw7XG4gIGNvbnN0IGsgPSBLSU5EU1traW5kXTtcbiAgY29uc3QgaGVhZFJlZiA9IHVzZVJlZihudWxsKTtcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBoZWFkUmVmLmN1cnJlbnQgJiYgaGVhZFJlZi5jdXJyZW50LmZvY3VzKCk7XG4gIH0sIFtraW5kLCBpZF0pO1xuXG4gIGxldCBuYW1lID0gaWQ7XG4gIGNvbnN0IGZhY3RzID0gW107XG4gIGlmIChraW5kID09PSAndG9vbCcpIHtcbiAgICBuYW1lID0gdG9vbCA/IHRvb2wudGl0bGUgOiAnVW5rbm93biB0b29sJztcbiAgfSBlbHNlIGlmIChpdGVtICYmIGtpbmQgPT09ICdsZWFybmVyJykge1xuICAgIG5hbWUgPSBgJHtpdGVtLmZpcnN0bmFtZX0gJHtpdGVtLmxhc3RuYW1lfWA7XG4gICAgZmFjdHMucHVzaChbJ0xlYXJuZXIgSUQnLCBpdGVtLnBjb2RlXSwgWydMZXZlbCcsIGl0ZW0ubGV2ZWxdLCBbJ1R1dG9yIGdyb3VwJywgaXRlbS5jbGFzc2NvZGVdLCBbJ1R1dG9yJywgaXRlbS50dXRvcm5hbWVdKTtcbiAgfSBlbHNlIGlmIChpdGVtICYmIGtpbmQgPT09ICdjb3Vyc2UnKSB7XG4gICAgbmFtZSA9IGl0ZW0udGl0bGU7XG4gICAgZmFjdHMucHVzaChbJ0NvZGUnLCBpdGVtLnVpY10sIFsnWWVhcicsIGl0ZW0uYWN5ZWFyXSwgWydRdWFsaWZpY2F0aW9uJywgaXRlbS5xdWFsaWZpY2F0aW9uXSk7XG4gIH0gZWxzZSBpZiAoaXRlbSAmJiBraW5kID09PSAnY2xhc3MnKSB7XG4gICAgbmFtZSA9IGAke2l0ZW0uY2xhc3Njb2RlfTogJHtpdGVtLnRpdGxlfWA7XG4gICAgZmFjdHMucHVzaChbJ0NvdXJzZScsIGl0ZW0udWljXSwgWydZZWFyJywgaXRlbS5hY3llYXJdLCBbJ1N0YWZmJywgaXRlbS5zdGFmZm5hbWVdKTtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJzcC1wYWdlXCI+XG4gICAgICA8cCBjbGFzc05hbWU9XCJzcC1leWVicm93XCI+e2sudGl0bGV9PC9wPlxuICAgICAgPGgxIGNsYXNzTmFtZT1cInNwLXBhZ2UtdGl0bGVcIiB0YWJJbmRleD17LTF9IHJlZj17aGVhZFJlZn0+XG4gICAgICAgIHtuYW1lfSB7aXRlbSAmJiA8U3RhdHVzUGlsbCBhY3RpdmU9e2l0ZW0uYWN0aXZlfSAvPn1cbiAgICAgIDwvaDE+XG4gICAgICB7ZmFjdHMubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgIDxkbCBjbGFzc05hbWU9XCJzcC1mYWN0c1wiPlxuICAgICAgICAgIHtmYWN0cy5tYXAoKFtsYWJlbCwgdl0pID0+IChcbiAgICAgICAgICAgIDxkaXYga2V5PXtsYWJlbH0+XG4gICAgICAgICAgICAgIDxkdD57bGFiZWx9PC9kdD5cbiAgICAgICAgICAgICAgPGRkPnt2IHx8ICdcdTIwMTQnfTwvZGQ+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9kbD5cbiAgICAgICl9XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwLXNlY3Rpb24gc3AtcGxhY2Vob2xkZXJcIj5cbiAgICAgICAgPGgyPkNvbWluZyBzb29uPC9oMj5cbiAgICAgICAge2tpbmQgPT09ICd0b29sJyA/IChcbiAgICAgICAgICA8cD57dG9vbCA/IGAke3Rvb2wuYmx1cmJ9LiBUaGlzIHBhZ2UgaGFzbid0IGJlZW4gYnVpbHQgeWV0LmAgOiBgVGhlcmUgaXMgbm8gdG9vbCBjYWxsZWQgXHUyMDFDJHtpZH1cdTIwMUQuYH08L3A+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgPHA+VGhpcyBwYWdlIGJlbG9uZ3MgdG8gdGhlIHtrLmFyZWF9LCB3aGljaCBoYXNuJ3QgYmVlbiB1cGdyYWRlZCB5ZXQuPC9wPlxuICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCAiaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZURlYm91bmNlZCh2YWx1ZSwgbXMpIHtcbiAgY29uc3QgW3YsIHNldFZdID0gdXNlU3RhdGUodmFsdWUpO1xuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHQgPSBzZXRUaW1lb3V0KCgpID0+IHNldFYodmFsdWUpLCBtcyk7XG4gICAgcmV0dXJuICgpID0+IGNsZWFyVGltZW91dCh0KTtcbiAgfSwgW3ZhbHVlLCBtc10pO1xuICByZXR1cm4gdjtcbn1cblxuLy8gLS0tLSBIYXNoIHJvdXRpbmcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBSb3V0ZXMgbGl2ZSBpbiB0aGUgVVJMIGhhc2ggc28gbm90aGluZyBjbGFzaGVzIHdpdGggV2ViRm9ybXMvSUlTIHJvdXRpbmc6XG4vLyAgICMvP21vZGU9bGVhcm5lcnMmcT1zbWl0aCZpbmFjdGl2ZT0xICAgc2VhcmNoIHBhZ2UgKHN0YXRlIGtlcHQgaW4gdGhlIFVSTCBzb1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEJhY2sgZnJvbSBhbm90aGVyIHBhZ2UgcmVzdG9yZXMgaXQpXG4vLyAgICMvP21vZGU9dG9vbHMmcT1kYXNoICAgICAgICAgICAgICAgICAgRGFzaGJvYXJkcyAmIFRvb2xzIGxpc3QgKHEgZmlsdGVycyBpdClcbi8vICAgIy9sZWFybmVyLzxwY29kZT4gICMvY291cnNlLzxpZD4gICMvY2xhc3MvPGlkPiAgIy90b29sLzxpZD4gICBwbGFjZWhvbGRlciBwYWdlc1xuXG5jb25zdCBNT0RFUyA9IFsnbGVhcm5lcnMnLCAnY291cnNlcycsICd0b29scyddO1xuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VIYXNoKGhhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaCkge1xuICBjb25zdCByYXcgPSBoYXNoLnJlcGxhY2UoL14jXFwvPy8sICcnKTtcbiAgY29uc3QgW3BhdGgsIHFzID0gJyddID0gcmF3LnNwbGl0KCc/Jyk7XG4gIGNvbnN0IHBhcnRzID0gcGF0aC5zcGxpdCgnLycpLmZpbHRlcihCb29sZWFuKS5tYXAoZGVjb2RlVVJJQ29tcG9uZW50KTtcbiAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhxcyk7XG4gIGlmIChwYXJ0cy5sZW5ndGggPj0gMiAmJiBbJ2xlYXJuZXInLCAnY291cnNlJywgJ2NsYXNzJywgJ3Rvb2wnXS5pbmNsdWRlcyhwYXJ0c1swXSkpIHtcbiAgICByZXR1cm4geyBwYWdlOiBwYXJ0c1swXSwgaWQ6IHBhcnRzLnNsaWNlKDEpLmpvaW4oJy8nKSB9O1xuICB9XG4gIGNvbnN0IG1vZGUgPSBwYXJhbXMuZ2V0KCdtb2RlJyk7XG4gIHJldHVybiB7XG4gICAgcGFnZTogJ3NlYXJjaCcsXG4gICAgbW9kZTogTU9ERVMuaW5jbHVkZXMobW9kZSkgPyBtb2RlIDogJ2xlYXJuZXJzJyxcbiAgICBxOiBwYXJhbXMuZ2V0KCdxJykgfHwgJycsXG4gICAgaW5hY3RpdmU6IHBhcmFtcy5nZXQoJ2luYWN0aXZlJykgPT09ICcxJyxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNlYXJjaEhhc2goeyBtb2RlLCBxLCBpbmFjdGl2ZSB9KSB7XG4gIGNvbnN0IHAgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKCk7XG4gIGlmIChtb2RlICYmIG1vZGUgIT09ICdsZWFybmVycycpIHAuc2V0KCdtb2RlJywgbW9kZSk7XG4gIGlmIChxKSBwLnNldCgncScsIHEpO1xuICBpZiAoaW5hY3RpdmUpIHAuc2V0KCdpbmFjdGl2ZScsICcxJyk7XG4gIGNvbnN0IHMgPSBwLnRvU3RyaW5nKCk7XG4gIHJldHVybiAnIy8nICsgKHMgPyAnPycgKyBzIDogJycpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGV0YWlsSGFzaChwYWdlLCBpZCkge1xuICByZXR1cm4gYCMvJHtwYWdlfS8ke2VuY29kZVVSSUNvbXBvbmVudChpZCl9YDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUhhc2hSb3V0ZSgpIHtcbiAgY29uc3QgW3JvdXRlLCBzZXRSb3V0ZV0gPSB1c2VTdGF0ZSgoKSA9PiBwYXJzZUhhc2goKSk7XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgb24gPSAoKSA9PiBzZXRSb3V0ZShwYXJzZUhhc2goKSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCBvbik7XG4gICAgcmV0dXJuICgpID0+IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdoYXNoY2hhbmdlJywgb24pO1xuICB9LCBbXSk7XG4gIHJldHVybiByb3V0ZTtcbn1cblxuLy8gLS0tLSBTYWZlIHN0b3JhZ2UgKHBlci12aWV3ZXIgY29udmVuaWVuY2VzIG9ubHkpIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZXhwb3J0IGZ1bmN0aW9uIGxvYWQoa2V5LCBmYWxsYmFjaykge1xuICB0cnkge1xuICAgIGNvbnN0IHYgPSB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KTtcbiAgICByZXR1cm4gdiA9PSBudWxsID8gZmFsbGJhY2sgOiB2O1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gZmFsbGJhY2s7XG4gIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBzYXZlKGtleSwgdmFsdWUpIHtcbiAgdHJ5IHtcbiAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCB2YWx1ZSk7XG4gIH0gY2F0Y2gge1xuICAgIC8qIGlnbm9yZSAqL1xuICB9XG59XG4iLCAiaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgc2VhcmNoQ2xhc3Nlcywgc2VhcmNoQ291cnNlcywgc2VhcmNoTGVhcm5lcnMgfSBmcm9tICcuL2FwaS5qcyc7XG5pbXBvcnQgeyBkZXRhaWxIYXNoLCBwYXJzZUhhc2gsIHNlYXJjaEhhc2gsIHVzZURlYm91bmNlZCB9IGZyb20gJy4vaG9va3MuanMnO1xuaW1wb3J0IFJlc3VsdFRhYmxlIGZyb20gJy4vUmVzdWx0VGFibGUuanN4JztcbmltcG9ydCB7IGZpbHRlclRvb2xzIH0gZnJvbSAnLi90b29scy5qcyc7XG5pbXBvcnQgeyBJY29uLCBTcGlubmVyLCBTd2l0Y2ggfSBmcm9tICcuL3VpLmpzeCc7XG5cbmV4cG9ydCBjb25zdCBNSU5fQ0hBUlMgPSAzO1xuY29uc3QgREVCT1VOQ0VfTVMgPSAzMDA7XG5jb25zdCBDQUNIRV9NUyA9IDYwXzAwMDtcblxuY29uc3QgTU9ERVMgPSB7XG4gIGxlYXJuZXJzOiB7IGxhYmVsOiAnU2VhcmNoIExlYXJuZXJzJywgaWNvbjogJ3VzZXInLCBwbGFjZWhvbGRlcjogJ05hbWUsIGxlYXJuZXIgSUQgb3IgdHV0b3IgZ3JvdXBcdTIwMjYnIH0sXG4gIGNvdXJzZXM6IHsgbGFiZWw6ICdTZWFyY2ggQ291cnNlcycsIGljb246ICdib29rJywgcGxhY2Vob2xkZXI6ICdDb3Vyc2UgY29kZSwgdGl0bGUsIGNsYXNzIGNvZGUgb3Igc3RhZmZcdTIwMjYnIH0sXG4gIHRvb2xzOiB7IGxhYmVsOiAnRGFzaGJvYXJkcyAmIFRvb2xzJywgaWNvbjogJ2dyaWQnLCBwbGFjZWhvbGRlcjogJ0ZpbHRlciBkYXNoYm9hcmRzIGFuZCB0b29sc1x1MjAyNicgfSxcbn07XG5cbmV4cG9ydCBjb25zdCB0b29sSHJlZiA9ICh0KSA9PiB0LmhyZWYgfHwgZGV0YWlsSGFzaCgndG9vbCcsIHQuaWQpO1xuXG4vLyBTaG9ydC1saXZlZCBjYWNoZSBzbyBiYWNrc3BhY2luZyAvIHN3aXRjaGluZyBtb2RlcyBkb2Vzbid0IHJlLWhpdCB0aGUgc2VydmVyLlxuY29uc3QgY2FjaGUgPSBuZXcgTWFwKCk7XG5mdW5jdGlvbiBjYWNoZWQoa2V5LCBmbikge1xuICBjb25zdCBoaXQgPSBjYWNoZS5nZXQoa2V5KTtcbiAgaWYgKGhpdCAmJiBEYXRlLm5vdygpIC0gaGl0LmF0IDwgQ0FDSEVfTVMpIHJldHVybiBoaXQucHJvbWlzZTtcbiAgY29uc3QgcHJvbWlzZSA9IGZuKCk7XG4gIGNhY2hlLnNldChrZXksIHsgYXQ6IERhdGUubm93KCksIHByb21pc2UgfSk7XG4gIHByb21pc2UuY2F0Y2goKCkgPT4gY2FjaGUuZGVsZXRlKGtleSkpO1xuICBpZiAoY2FjaGUuc2l6ZSA+IDYwKSBjYWNoZS5kZWxldGUoY2FjaGUua2V5cygpLm5leHQoKS52YWx1ZSk7XG4gIHJldHVybiBwcm9taXNlO1xufVxuXG5mdW5jdGlvbiBydW5TZWFyY2gobW9kZSwgdGVybSkge1xuICBjb25zdCBrZXkgPSB0ZXJtLnRvTG93ZXJDYXNlKCk7XG4gIGlmIChtb2RlID09PSAnbGVhcm5lcnMnKSB7XG4gICAgcmV0dXJuIGNhY2hlZCgnTDonICsga2V5LCAoKSA9PiBzZWFyY2hMZWFybmVycyh0ZXJtKSkudGhlbigobGVhcm5lcnMpID0+ICh7IGxlYXJuZXJzIH0pKTtcbiAgfVxuICByZXR1cm4gUHJvbWlzZS5hbGwoW2NhY2hlZCgnQzonICsga2V5LCAoKSA9PiBzZWFyY2hDb3Vyc2VzKHRlcm0pKSwgY2FjaGVkKCdLOicgKyBrZXksICgpID0+IHNlYXJjaENsYXNzZXModGVybSkpXSkudGhlbihcbiAgICAoW2NvdXJzZXMsIGNsYXNzZXNdKSA9PiAoeyBjb3Vyc2VzLCBjbGFzc2VzIH0pXG4gICk7XG59XG5cbi8vIExldHMgdGhlIHBsYWNlaG9sZGVyIHBhZ2VzIHNob3cgYSBuYW1lIGZvciBzb21ldGhpbmcgcGlja2VkIGZyb20gdGhlIHJlc3VsdHMuXG5leHBvcnQgY29uc3Qga25vd24gPSBuZXcgTWFwKCk7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFNlYXJjaFBhZ2UoeyByb3V0ZSwgaGlkZGVuIH0pIHtcbiAgY29uc3QgW21vZGUsIHNldE1vZGVdID0gdXNlU3RhdGUoKCkgPT4gKHJvdXRlLnBhZ2UgPT09ICdzZWFyY2gnID8gcm91dGUubW9kZSA6ICdsZWFybmVycycpKTtcbiAgY29uc3QgW3EsIHNldFFdID0gdXNlU3RhdGUoKCkgPT4gKHJvdXRlLnBhZ2UgPT09ICdzZWFyY2gnID8gcm91dGUucSA6ICcnKSk7XG4gIGNvbnN0IFtzaG93SW5hY3RpdmUsIHNldFNob3dJbmFjdGl2ZV0gPSB1c2VTdGF0ZSgoKSA9PiByb3V0ZS5wYWdlID09PSAnc2VhcmNoJyAmJiByb3V0ZS5pbmFjdGl2ZSk7XG4gIGNvbnN0IFtzdGF0ZSwgc2V0U3RhdGVdID0gdXNlU3RhdGUoeyBzdGF0dXM6ICdpZGxlJyB9KTsgLy8gaWRsZSB8IGxvYWRpbmcgfCBkb25lIHwgZXJyb3JcbiAgY29uc3QgW3JldHJ5LCBzZXRSZXRyeV0gPSB1c2VTdGF0ZSgwKTtcbiAgY29uc3QgaW5wdXRSZWYgPSB1c2VSZWYobnVsbCk7XG5cbiAgY29uc3QgaXNUb29scyA9IG1vZGUgPT09ICd0b29scyc7XG4gIGNvbnN0IHRlcm0gPSB1c2VEZWJvdW5jZWQocS50cmltKCksIERFQk9VTkNFX01TKTtcbiAgY29uc3QgcmVhZHkgPSAhaXNUb29scyAmJiB0ZXJtLmxlbmd0aCA+PSBNSU5fQ0hBUlM7IC8vIHRvb2xzIGZpbHRlciBsb2NhbGx5LCBubyBzZXJ2ZXIgY2FsbFxuICBjb25zdCB0b29scyA9IHVzZU1lbW8oKCkgPT4gKGlzVG9vbHMgPyBmaWx0ZXJUb29scyhxKSA6IFtdKSwgW2lzVG9vbHMsIHFdKTtcblxuICAvLyBLZWVwIHRoZSBVUkwgaW4gc3RlcCB3aXRoIHRoZSBzZWFyY2ggKHJlcGxhY2VTdGF0ZTogbm8gaGlzdG9yeSBzcGFtLCBubyBoYXNoY2hhbmdlKS5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAocGFyc2VIYXNoKCkucGFnZSAhPT0gJ3NlYXJjaCcpIHJldHVybjtcbiAgICBjb25zdCBoID0gc2VhcmNoSGFzaCh7IG1vZGUsIHE6IHEudHJpbSgpLCBpbmFjdGl2ZTogc2hvd0luYWN0aXZlIH0pO1xuICAgIGlmIChoICE9PSB3aW5kb3cubG9jYXRpb24uaGFzaCkgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKG51bGwsICcnLCBoKTtcbiAgfSwgW21vZGUsIHEsIHNob3dJbmFjdGl2ZV0pO1xuXG4gIC8vIEFycml2aW5nIGJhY2sgb24gdGhlIHNlYXJjaCBVUkwgKEJhY2sgYnV0dG9uLCBkZWVwIGxpbmspIHJlc3RvcmVzIGl0cyBzdGF0ZS5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAocm91dGUucGFnZSAhPT0gJ3NlYXJjaCcpIHJldHVybjtcbiAgICBzZXRNb2RlKHJvdXRlLm1vZGUpO1xuICAgIHNldFEoKGN1cikgPT4gKGN1ci50cmltKCkgPT09IHJvdXRlLnEgPyBjdXIgOiByb3V0ZS5xKSk7XG4gICAgc2V0U2hvd0luYWN0aXZlKHJvdXRlLmluYWN0aXZlKTtcbiAgfSwgW3JvdXRlXSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIXJlYWR5KSB7XG4gICAgICBzZXRTdGF0ZSh7IHN0YXR1czogJ2lkbGUnIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgc3RhbGUgPSBmYWxzZTsgLy8gaWdub3JlIHJlc3BvbnNlcyB0aGF0IGFycml2ZSBhZnRlciBhIG5ld2VyIHNlYXJjaCBzdGFydGVkXG4gICAgc2V0U3RhdGUoKHMpID0+ICh7IC4uLnMsIHN0YXR1czogJ2xvYWRpbmcnLCBlcnJvcjogbnVsbCB9KSk7XG4gICAgcnVuU2VhcmNoKG1vZGUsIHRlcm0pLnRoZW4oXG4gICAgICAoZGF0YSkgPT4ge1xuICAgICAgICBpZiAoc3RhbGUpIHJldHVybjtcbiAgICAgICAgZm9yIChjb25zdCBsaXN0IG9mIE9iamVjdC52YWx1ZXMoZGF0YSkpIGZvciAoY29uc3QgaXRlbSBvZiBsaXN0KSBrbm93bi5zZXQoaXRlbS5pZCwgaXRlbSk7XG4gICAgICAgIHNldFN0YXRlKHsgc3RhdHVzOiAnZG9uZScsIG1vZGUsIHRlcm0sIGRhdGEgfSk7XG4gICAgICB9LFxuICAgICAgKGVycikgPT4ge1xuICAgICAgICBpZiAoIXN0YWxlKSBzZXRTdGF0ZSh7IHN0YXR1czogJ2Vycm9yJywgbW9kZSwgdGVybSwgZXJyb3I6IGVyci5tZXNzYWdlIHx8IFN0cmluZyhlcnIpIH0pO1xuICAgICAgfVxuICAgICk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHN0YWxlID0gdHJ1ZTtcbiAgICB9O1xuICB9LCBbbW9kZSwgdGVybSwgcmVhZHksIHJldHJ5XSk7XG5cbiAgLy8gUmVzdWx0cyBmb3IgdGhlIGN1cnJlbnQgbW9kZSAoa2VlcCBzaG93aW5nIHRoZSBwcmV2aW91cyBvbmVzIHdoaWxlIGEgbmV3IHNlYXJjaCBsb2FkcykuXG4gIGNvbnN0IGRhdGEgPSBzdGF0ZS5kYXRhICYmIHN0YXRlLm1vZGUgPT09IG1vZGUgPyBzdGF0ZS5kYXRhIDogbnVsbDtcbiAgY29uc3QgbG9hZGluZyA9IHN0YXRlLnN0YXR1cyA9PT0gJ2xvYWRpbmcnO1xuICBjb25zdCBoYXNSZXN1bHRzID0gaXNUb29scyB8fCByZWFkeSB8fCBxLnRyaW0oKS5sZW5ndGggPiAwO1xuXG4gIGNvbnN0IG9uS2V5RG93biA9IChlKSA9PiB7XG4gICAgaWYgKGUua2V5ID09PSAnRW50ZXInKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7IC8vIHdvdWxkIHN1Ym1pdCB0aGUgV2ViRm9ybXMgZm9ybVxuICAgICAgLy8gSW4gdG9vbHMgbW9kZSBFbnRlciBvcGVucyB0aGUgdG9wIG1hdGNoLlxuICAgICAgaWYgKGlzVG9vbHMgJiYgcS50cmltKCkgJiYgdG9vbHMubGVuZ3RoKSB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHRvb2xIcmVmKHRvb2xzWzBdKTtcbiAgICB9XG4gICAgaWYgKGUua2V5ID09PSAnRXNjYXBlJykgc2V0USgnJyk7XG4gIH07XG5cbiAgY29uc3QgaGludCA9IGlzVG9vbHNcbiAgICA/IHEudHJpbSgpICYmIHRvb2xzLmxlbmd0aFxuICAgICAgPyAnUHJlc3MgRW50ZXIgdG8gb3BlbiB0aGUgZmlyc3QgbWF0Y2gnXG4gICAgICA6ICdcXHUwMGEwJ1xuICAgIDogcS50cmltKCkubGVuZ3RoID4gMCAmJiBxLnRyaW0oKS5sZW5ndGggPCBNSU5fQ0hBUlNcbiAgICA/IGBUeXBlIGF0IGxlYXN0ICR7TUlOX0NIQVJTfSBjaGFyYWN0ZXJzIHRvIHNlYXJjaGBcbiAgICA6ICFxXG4gICAgPyAnUmVzdWx0cyBhcHBlYXIgYXMgeW91IHR5cGUnXG4gICAgOiAnXFx1MDBhMCc7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInNwLXNlYXJjaFwiIGhpZGRlbj17aGlkZGVufT5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPXsnc3AtaGVybycgKyAoaGFzUmVzdWx0cyA/ICcgY29tcGFjdCcgOiAnJyl9PlxuICAgICAgICA8aDEgY2xhc3NOYW1lPVwic3AtdGl0bGVcIj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzcC1zclwiPlNBUElFTjwvc3Bhbj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJiciBsXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIgLz5cbiAgICAgICAgICB7Lyogd29yZC13cmFwIGdyb3dzIGZyb20gMCB3aWR0aCBzbyB0aGUgYnJhY2tldHMgXCJvcGVuXCIgYXJvdW5kIHRoZSB3b3JkICovfVxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIndvcmQtd3JhcFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwid29yZFwiPlxuICAgICAgICAgICAgICB7J1NBUElFTicuc3BsaXQoJycpLm1hcCgoY2gsIGkpID0+IChcbiAgICAgICAgICAgICAgICA8c3BhbiBrZXk9e2l9IHN0eWxlPXt7ICctLWknOiBpIH19PntjaH08L3NwYW4+XG4gICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJiciByXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIgLz5cbiAgICAgICAgPC9oMT5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwLXNlYXJjaGJveFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3Atc2VnXCIgcm9sZT1cImdyb3VwXCIgYXJpYS1sYWJlbD1cIldoYXQgdG8gc2VhcmNoXCI+XG4gICAgICAgICAgICB7T2JqZWN0LmVudHJpZXMoTU9ERVMpLm1hcCgoW2tleSwgbV0pID0+IChcbiAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgIGtleT17a2V5fVxuICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgIGFyaWEtcHJlc3NlZD17bW9kZSA9PT0ga2V5fVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17bW9kZSA9PT0ga2V5ID8gJ29uJyA6ICcnfVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgIHNldE1vZGUoa2V5KTtcbiAgICAgICAgICAgICAgICAgIGlucHV0UmVmLmN1cnJlbnQgJiYgaW5wdXRSZWYuY3VycmVudC5mb2N1cygpO1xuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8SWNvbiBuYW1lPXttLmljb259IHNpemU9ezE2fSAvPlxuICAgICAgICAgICAgICAgIHttLmxhYmVsfVxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICkpfVxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcC1pbnB1dFwiPlxuICAgICAgICAgICAgPEljb24gbmFtZT1cInNlYXJjaFwiIC8+XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgcmVmPXtpbnB1dFJlZn1cbiAgICAgICAgICAgICAgdHlwZT1cInNlYXJjaFwiXG4gICAgICAgICAgICAgIGF1dG9Gb2N1c1xuICAgICAgICAgICAgICBhdXRvQ29tcGxldGU9XCJvZmZcIlxuICAgICAgICAgICAgICBzcGVsbENoZWNrPVwiZmFsc2VcIlxuICAgICAgICAgICAgICBhcmlhLWxhYmVsPXtNT0RFU1ttb2RlXS5sYWJlbH1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9e01PREVTW21vZGVdLnBsYWNlaG9sZGVyfVxuICAgICAgICAgICAgICB2YWx1ZT17cX1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRRKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgb25LZXlEb3duPXtvbktleURvd259XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAge2xvYWRpbmcgJiYgPFNwaW5uZXIgbGFiZWw9XCJTZWFyY2hpbmdcIiAvPn1cbiAgICAgICAgICAgIHtxICYmIChcbiAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwic3AtY2xlYXJcIiBhcmlhLWxhYmVsPVwiQ2xlYXIgc2VhcmNoXCIgb25DbGljaz17KCkgPT4geyBzZXRRKCcnKTsgaW5wdXRSZWYuY3VycmVudC5mb2N1cygpOyB9fT5cbiAgICAgICAgICAgICAgICA8SWNvbiBuYW1lPVwieFwiIHNpemU9ezE2fSAvPlxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPHAgY2xhc3NOYW1lPVwic3AtaGludFwiIGFyaWEtbGl2ZT1cInBvbGl0ZVwiPntoaW50fTwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cblxuICAgICAge2lzVG9vbHMgJiYgPFRvb2xMaXN0IHRvb2xzPXt0b29sc30gcT17cS50cmltKCl9IGNsZWFyPXsoKSA9PiB7IHNldFEoJycpOyBpbnB1dFJlZi5jdXJyZW50LmZvY3VzKCk7IH19IC8+fVxuXG4gICAgICB7cmVhZHkgJiYgKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwLXJlc3VsdHNcIiBhcmlhLWJ1c3k9e2xvYWRpbmd9PlxuICAgICAgICAgIHtzdGF0ZS5zdGF0dXMgPT09ICdlcnJvcicgPyAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwLWVycm9yXCIgcm9sZT1cImFsZXJ0XCI+XG4gICAgICAgICAgICAgIDxzcGFuPlNlYXJjaCBmYWlsZWQ6IHtzdGF0ZS5lcnJvcn08L3NwYW4+XG4gICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cInNwLWJ0biBzbWFsbFwiIG9uQ2xpY2s9eygpID0+IHNldFJldHJ5KChuKSA9PiBuICsgMSl9PlRyeSBhZ2FpbjwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKSA6ICFkYXRhID8gKFxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwic3AtbXNnXCI+PFNwaW5uZXIgLz4gU2VhcmNoaW5nXHUyMDI2PC9wPlxuICAgICAgICAgICkgOiBtb2RlID09PSAnbGVhcm5lcnMnID8gKFxuICAgICAgICAgICAgPExlYXJuZXJSZXN1bHRzIGxlYXJuZXJzPXtkYXRhLmxlYXJuZXJzfSB0ZXJtPXtzdGF0ZS50ZXJtfSBzaG93SW5hY3RpdmU9e3Nob3dJbmFjdGl2ZX0gc2V0U2hvd0luYWN0aXZlPXtzZXRTaG93SW5hY3RpdmV9IC8+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxDb3Vyc2VSZXN1bHRzIGNvdXJzZXM9e2RhdGEuY291cnNlc30gY2xhc3Nlcz17ZGF0YS5jbGFzc2VzfSB0ZXJtPXtzdGF0ZS50ZXJtfSBzaG93SW5hY3RpdmU9e3Nob3dJbmFjdGl2ZX0gc2V0U2hvd0luYWN0aXZlPXtzZXRTaG93SW5hY3RpdmV9IC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgIDwvZGl2PlxuICApO1xufVxuXG5mdW5jdGlvbiBUb29sTGlzdCh7IHRvb2xzLCBxLCBjbGVhciB9KSB7XG4gIHJldHVybiAoXG4gICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwic3AtcmVzdWx0cyBzcC10b29scy13cmFwXCIgYXJpYS1sYWJlbD1cIkRhc2hib2FyZHMgYW5kIHRvb2xzXCI+XG4gICAgICB7dG9vbHMubGVuZ3RoID8gKFxuICAgICAgICA8dWwgY2xhc3NOYW1lPVwic3AtdG9vbHNcIj5cbiAgICAgICAgICB7dG9vbHMubWFwKCh0KSA9PiAoXG4gICAgICAgICAgICA8bGkga2V5PXt0LmlkfT5cbiAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwic3AtdG9vbFwiIGhyZWY9e3Rvb2xIcmVmKHQpfT5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzcC10b29sLWljb25cIj48SWNvbiBuYW1lPXt0Lmljb259IHNpemU9ezIwfSAvPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzcC10b29sLXRleHRcIj5cbiAgICAgICAgICAgICAgICAgIDxiPnt0LnRpdGxlfTwvYj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuPnt0LmJsdXJifTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic3AtdG9vbC1nb1wiPjxJY29uIG5hbWU9XCJhcnJvd1wiIHNpemU9ezE2fSAvPjwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC91bD5cbiAgICAgICkgOiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3AtZW1wdHlcIj5cbiAgICAgICAgICBObyBkYXNoYm9hcmRzIG9yIHRvb2xzIG1hdGNoIFx1MjAxQ3txfVx1MjAxRC57JyAnfVxuICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cInNwLWxpbmtcIiBvbkNsaWNrPXtjbGVhcn0+Q2xlYXIgZmlsdGVyPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICA8L3NlY3Rpb24+XG4gICk7XG59XG5cbmZ1bmN0aW9uIHNwbGl0KHJvd3MsIHNob3dJbmFjdGl2ZSkge1xuICBjb25zdCBhY3RpdmUgPSByb3dzLmZpbHRlcigocikgPT4gci5hY3RpdmUpO1xuICByZXR1cm4geyByb3dzOiBzaG93SW5hY3RpdmUgPyByb3dzIDogYWN0aXZlLCBpbmFjdGl2ZUNvdW50OiByb3dzLmxlbmd0aCAtIGFjdGl2ZS5sZW5ndGggfTtcbn1cblxuZnVuY3Rpb24gVG9vbGJhcih7IHN1bW1hcnksIGluYWN0aXZlQ291bnQsIHNob3dJbmFjdGl2ZSwgc2V0U2hvd0luYWN0aXZlIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInNwLXRvb2xiYXJcIj5cbiAgICAgIDxwIGFyaWEtbGl2ZT1cInBvbGl0ZVwiPntzdW1tYXJ5fTwvcD5cbiAgICAgIDxTd2l0Y2ggY2hlY2tlZD17c2hvd0luYWN0aXZlfSBvbkNoYW5nZT17c2V0U2hvd0luYWN0aXZlfT5cbiAgICAgICAgU2hvdyBpbmFjdGl2ZXtpbmFjdGl2ZUNvdW50ID8gYCAoJHtpbmFjdGl2ZUNvdW50fSlgIDogJyd9XG4gICAgICA8L1N3aXRjaD5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuZnVuY3Rpb24gRW1wdHkoeyB3aGF0LCB0ZXJtLCBpbmFjdGl2ZUNvdW50LCBzaG93SW5hY3RpdmUsIHNldFNob3dJbmFjdGl2ZSB9KSB7XG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJzcC1lbXB0eVwiPlxuICAgICAge2luYWN0aXZlQ291bnQgPiAwICYmICFzaG93SW5hY3RpdmUgPyAoXG4gICAgICAgIDw+XG4gICAgICAgICAgTm8gYWN0aXZlIHt3aGF0fSBtYXRjaCBcdTIwMUN7dGVybX1cdTIwMUQueycgJ31cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJzcC1saW5rXCIgb25DbGljaz17KCkgPT4gc2V0U2hvd0luYWN0aXZlKHRydWUpfT5cbiAgICAgICAgICAgIFNob3cge2luYWN0aXZlQ291bnR9IGluYWN0aXZlXG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvPlxuICAgICAgKSA6IChcbiAgICAgICAgPD5ObyB7d2hhdH0gbWF0Y2ggXHUyMDFDe3Rlcm19XHUyMDFELjwvPlxuICAgICAgKX1cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuY29uc3QgcGx1cmFsID0gKG4sIG9uZSwgbWFueSkgPT4gYCR7bn0gJHtuID09PSAxID8gb25lIDogbWFueX1gO1xuXG5jb25zdCBMRUFSTkVSX0NPTFMgPSBbXG4gIHsga2V5OiAnbmFtZScsIGxhYmVsOiAnTmFtZScsIGxpbms6IHRydWUsIHZhbHVlOiAocikgPT4gYCR7ci5sYXN0bmFtZX0sICR7ci5maXJzdG5hbWV9YCwgcmVuZGVyOiAocikgPT4gPD48Yj57ci5sYXN0bmFtZX08L2I+LCB7ci5maXJzdG5hbWV9PC8+IH0sXG4gIHsga2V5OiAncGNvZGUnLCBsYWJlbDogJ0xlYXJuZXIgSUQnLCB2YWx1ZTogKHIpID0+IHIucGNvZGUgfSxcbiAgeyBrZXk6ICdsZXZlbCcsIGxhYmVsOiAnTGV2ZWwnLCB2YWx1ZTogKHIpID0+IHIubGV2ZWwgfSxcbiAgeyBrZXk6ICdjbGFzc2NvZGUnLCBsYWJlbDogJ1R1dG9yIGdyb3VwJywgdmFsdWU6IChyKSA9PiByLmNsYXNzY29kZSB9LFxuICB7IGtleTogJ3R1dG9ybmFtZScsIGxhYmVsOiAnVHV0b3InLCB2YWx1ZTogKHIpID0+IHIudHV0b3JuYW1lIH0sXG4gIHsga2V5OiAnZW5keWVhcicsIGxhYmVsOiAnRW5kIHllYXInLCB2YWx1ZTogKHIpID0+IHIuZW5keWVhciB9LFxuXTtcblxuZnVuY3Rpb24gTGVhcm5lclJlc3VsdHMoeyBsZWFybmVycywgdGVybSwgc2hvd0luYWN0aXZlLCBzZXRTaG93SW5hY3RpdmUgfSkge1xuICBjb25zdCB7IHJvd3MsIGluYWN0aXZlQ291bnQgfSA9IHVzZU1lbW8oKCkgPT4gc3BsaXQobGVhcm5lcnMsIHNob3dJbmFjdGl2ZSksIFtsZWFybmVycywgc2hvd0luYWN0aXZlXSk7XG4gIGNvbnN0IGFjdGl2ZUNvdW50ID0gbGVhcm5lcnMubGVuZ3RoIC0gaW5hY3RpdmVDb3VudDtcbiAgY29uc3Qgc3VtbWFyeSA9IHNob3dJbmFjdGl2ZVxuICAgID8gYCR7cGx1cmFsKGxlYXJuZXJzLmxlbmd0aCwgJ2xlYXJuZXInLCAnbGVhcm5lcnMnKX0gKCR7YWN0aXZlQ291bnR9IGFjdGl2ZSlgXG4gICAgOiBgJHtwbHVyYWwoYWN0aXZlQ291bnQsICdhY3RpdmUgbGVhcm5lcicsICdhY3RpdmUgbGVhcm5lcnMnKX0ke2luYWN0aXZlQ291bnQgPyBgIFx1MDBCNyAke2luYWN0aXZlQ291bnR9IGluYWN0aXZlIGhpZGRlbmAgOiAnJ31gO1xuXG4gIHJldHVybiAoXG4gICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwic3Atc2VjdGlvblwiIGFyaWEtbGFiZWxsZWRieT1cInNwLWgtbGVhcm5lcnNcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3Atc2VjdGlvbi1oZWFkXCI+XG4gICAgICAgIDxoMiBpZD1cInNwLWgtbGVhcm5lcnNcIj5MZWFybmVyczwvaDI+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxUb29sYmFyIHN1bW1hcnk9e3N1bW1hcnl9IGluYWN0aXZlQ291bnQ9e2luYWN0aXZlQ291bnR9IHNob3dJbmFjdGl2ZT17c2hvd0luYWN0aXZlfSBzZXRTaG93SW5hY3RpdmU9e3NldFNob3dJbmFjdGl2ZX0gLz5cbiAgICAgIHtyb3dzLmxlbmd0aCA/IChcbiAgICAgICAgPFJlc3VsdFRhYmxlIGNhcHRpb249XCJMZWFybmVyc1wiIHJvd3M9e3Jvd3N9IGNvbHVtbnM9e0xFQVJORVJfQ09MU30gaHJlZj17KHIpID0+IGRldGFpbEhhc2goJ2xlYXJuZXInLCByLnBjb2RlKX0gZGVmYXVsdFNvcnQ9e3sga2V5OiAnbmFtZScsIGRpcjogJ2FzYycgfX0gLz5cbiAgICAgICkgOiAoXG4gICAgICAgIDxFbXB0eSB3aGF0PVwibGVhcm5lcnNcIiB0ZXJtPXt0ZXJtfSBpbmFjdGl2ZUNvdW50PXtpbmFjdGl2ZUNvdW50fSBzaG93SW5hY3RpdmU9e3Nob3dJbmFjdGl2ZX0gc2V0U2hvd0luYWN0aXZlPXtzZXRTaG93SW5hY3RpdmV9IC8+XG4gICAgICApfVxuICAgIDwvc2VjdGlvbj5cbiAgKTtcbn1cblxuY29uc3QgQ09VUlNFX0NPTFMgPSBbXG4gIHsga2V5OiAndGl0bGUnLCBsYWJlbDogJ0NvdXJzZScsIGxpbms6IHRydWUsIHZhbHVlOiAocikgPT4gci50aXRsZSwgcmVuZGVyOiAocikgPT4gPGI+e3IudGl0bGV9PC9iPiB9LFxuICB7IGtleTogJ3VpYycsIGxhYmVsOiAnQ29kZScsIHZhbHVlOiAocikgPT4gci51aWMgfSxcbiAgeyBrZXk6ICdxdWFsaWZpY2F0aW9uJywgbGFiZWw6ICdRdWFsaWZpY2F0aW9uJywgdmFsdWU6IChyKSA9PiByLnF1YWxpZmljYXRpb24gfSxcbiAgeyBrZXk6ICdhY3llYXInLCBsYWJlbDogJ1llYXInLCB2YWx1ZTogKHIpID0+IHIuYWN5ZWFyIH0sXG5dO1xuXG5jb25zdCBDTEFTU19DT0xTID0gW1xuICB7IGtleTogJ2NsYXNzY29kZScsIGxhYmVsOiAnQ2xhc3MnLCBsaW5rOiB0cnVlLCB2YWx1ZTogKHIpID0+IHIuY2xhc3Njb2RlLCByZW5kZXI6IChyKSA9PiA8Yj57ci5jbGFzc2NvZGV9PC9iPiB9LFxuICB7IGtleTogJ3RpdGxlJywgbGFiZWw6ICdDb3Vyc2UnLCB2YWx1ZTogKHIpID0+IHIudGl0bGUgfSxcbiAgeyBrZXk6ICd1aWMnLCBsYWJlbDogJ0NvZGUnLCB2YWx1ZTogKHIpID0+IHIudWljIH0sXG4gIHsga2V5OiAnc3RhZmZuYW1lJywgbGFiZWw6ICdTdGFmZicsIHZhbHVlOiAocikgPT4gci5zdGFmZm5hbWUgfSxcbiAgeyBrZXk6ICdhY3llYXInLCBsYWJlbDogJ1llYXInLCB2YWx1ZTogKHIpID0+IHIuYWN5ZWFyIH0sXG5dO1xuXG5mdW5jdGlvbiBDb3Vyc2VSZXN1bHRzKHsgY291cnNlcywgY2xhc3NlcywgdGVybSwgc2hvd0luYWN0aXZlLCBzZXRTaG93SW5hY3RpdmUgfSkge1xuICBjb25zdCBjID0gdXNlTWVtbygoKSA9PiBzcGxpdChjb3Vyc2VzLCBzaG93SW5hY3RpdmUpLCBbY291cnNlcywgc2hvd0luYWN0aXZlXSk7XG4gIGNvbnN0IGsgPSB1c2VNZW1vKCgpID0+IHNwbGl0KGNsYXNzZXMsIHNob3dJbmFjdGl2ZSksIFtjbGFzc2VzLCBzaG93SW5hY3RpdmVdKTtcbiAgY29uc3QgaW5hY3RpdmVDb3VudCA9IGMuaW5hY3RpdmVDb3VudCArIGsuaW5hY3RpdmVDb3VudDtcbiAgY29uc3Qgc3VtbWFyeSA9IGAke3BsdXJhbChjLnJvd3MubGVuZ3RoLCAnY291cnNlJywgJ2NvdXJzZXMnKX0gXHUwMEI3ICR7cGx1cmFsKGsucm93cy5sZW5ndGgsICdjbGFzcycsICdjbGFzc2VzJyl9JHtcbiAgICAhc2hvd0luYWN0aXZlICYmIGluYWN0aXZlQ291bnQgPyBgIFx1MDBCNyAke2luYWN0aXZlQ291bnR9IGluYWN0aXZlIGhpZGRlbmAgOiAnJ1xuICB9YDtcblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8VG9vbGJhciBzdW1tYXJ5PXtzdW1tYXJ5fSBpbmFjdGl2ZUNvdW50PXtpbmFjdGl2ZUNvdW50fSBzaG93SW5hY3RpdmU9e3Nob3dJbmFjdGl2ZX0gc2V0U2hvd0luYWN0aXZlPXtzZXRTaG93SW5hY3RpdmV9IC8+XG4gICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJzcC1zZWN0aW9uXCIgYXJpYS1sYWJlbGxlZGJ5PVwic3AtaC1jb3Vyc2VzXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3Atc2VjdGlvbi1oZWFkXCI+XG4gICAgICAgICAgPGgyIGlkPVwic3AtaC1jb3Vyc2VzXCI+Q291cnNlczwvaDI+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic3AtY291bnRcIj57Yy5yb3dzLmxlbmd0aH08L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7Yy5yb3dzLmxlbmd0aCA/IChcbiAgICAgICAgICA8UmVzdWx0VGFibGUgY2FwdGlvbj1cIkNvdXJzZXNcIiByb3dzPXtjLnJvd3N9IGNvbHVtbnM9e0NPVVJTRV9DT0xTfSBocmVmPXsocikgPT4gZGV0YWlsSGFzaCgnY291cnNlJywgci5pZCl9IGRlZmF1bHRTb3J0PXt7IGtleTogJ2FjeWVhcicsIGRpcjogJ2Rlc2MnIH19IC8+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgPEVtcHR5IHdoYXQ9XCJjb3Vyc2VzXCIgdGVybT17dGVybX0gaW5hY3RpdmVDb3VudD17Yy5pbmFjdGl2ZUNvdW50fSBzaG93SW5hY3RpdmU9e3Nob3dJbmFjdGl2ZX0gc2V0U2hvd0luYWN0aXZlPXtzZXRTaG93SW5hY3RpdmV9IC8+XG4gICAgICAgICl9XG4gICAgICA8L3NlY3Rpb24+XG4gICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJzcC1zZWN0aW9uXCIgYXJpYS1sYWJlbGxlZGJ5PVwic3AtaC1jbGFzc2VzXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3Atc2VjdGlvbi1oZWFkXCI+XG4gICAgICAgICAgPGgyIGlkPVwic3AtaC1jbGFzc2VzXCI+Q2xhc3NlczwvaDI+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic3AtY291bnRcIj57ay5yb3dzLmxlbmd0aH08L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7ay5yb3dzLmxlbmd0aCA/IChcbiAgICAgICAgICA8UmVzdWx0VGFibGUgY2FwdGlvbj1cIkNsYXNzZXNcIiByb3dzPXtrLnJvd3N9IGNvbHVtbnM9e0NMQVNTX0NPTFN9IGhyZWY9eyhyKSA9PiBkZXRhaWxIYXNoKCdjbGFzcycsIHIuaWQpfSBkZWZhdWx0U29ydD17eyBrZXk6ICdhY3llYXInLCBkaXI6ICdkZXNjJyB9fSAvPlxuICAgICAgICApIDogKFxuICAgICAgICAgIDxFbXB0eSB3aGF0PVwiY2xhc3Nlc1wiIHRlcm09e3Rlcm19IGluYWN0aXZlQ291bnQ9e2suaW5hY3RpdmVDb3VudH0gc2hvd0luYWN0aXZlPXtzaG93SW5hY3RpdmV9IHNldFNob3dJbmFjdGl2ZT17c2V0U2hvd0luYWN0aXZlfSAvPlxuICAgICAgICApfVxuICAgICAgPC9zZWN0aW9uPlxuICAgIDwvPlxuICApO1xufVxuIiwgIi8vIFRoaW4gd3JhcHBlcnMgYXJvdW5kIHdpbmRvdy5jYWxsV2ViTWV0aG9kIChsaWJyYXJ5L2pzL0RhdGFNZXRob2RzLmpzKS5cbi8vIEVhY2ggb25lIG5vcm1hbGlzZXMgdGhlIHJvd3Mgc28gdGhlIFVJIGRvZXNuJ3QgY2FyZSB3aGV0aGVyIHRoZSBzZXJ2ZXIgc2VuZHNcbi8vIDEvXCIxXCIvdHJ1ZSBvciBhIEpTT04gc3RyaW5nIHZzLiBhbiBhbHJlYWR5LXBhcnNlZCBhcnJheS5cblxuZnVuY3Rpb24gYXNSb3dzKGRhdGEpIHtcbiAgaWYgKGRhdGEgPT0gbnVsbCB8fCBkYXRhID09PSAnJykgcmV0dXJuIFtdO1xuICBpZiAodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSBkYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoZGF0YSkgPyBkYXRhIDogW107XG59XG5cbmZ1bmN0aW9uIGlzVHJ1ZSh2KSB7XG4gIHJldHVybiB2ID09PSB0cnVlIHx8IHYgPT09IDEgfHwgdiA9PT0gJzEnIHx8IFN0cmluZyh2KS50b0xvd2VyQ2FzZSgpID09PSAndHJ1ZSc7XG59XG5cbmZ1bmN0aW9uIHN0cih2KSB7XG4gIHJldHVybiB2ID09IG51bGwgPyAnJyA6IFN0cmluZyh2KS50cmltKCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNhbGwobWV0aG9kLCBzZWFyY2gpIHtcbiAgaWYgKHR5cGVvZiB3aW5kb3cuY2FsbFdlYk1ldGhvZCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBFcnJvcignY2FsbFdlYk1ldGhvZCBpcyBub3QgbG9hZGVkIChsaWJyYXJ5L2pzL0RhdGFNZXRob2RzLmpzKS4nKTtcbiAgfVxuICB0cnkge1xuICAgIHJldHVybiBhc1Jvd3MoYXdhaXQgd2luZG93LmNhbGxXZWJNZXRob2QobWV0aG9kLCB7IHNlYXJjaCB9KSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIC8vIFBhZ2VNZXRob2RzIGVycm9ycyBhcmUgb2JqZWN0cyB3aXRoIGdldF9tZXNzYWdlKCk7IHJlamVjdGlvbnMgbWF5IGJlIHN0cmluZ3MuXG4gICAgY29uc3QgbXNnID0gZXJyICYmIHR5cGVvZiBlcnIuZ2V0X21lc3NhZ2UgPT09ICdmdW5jdGlvbicgPyBlcnIuZ2V0X21lc3NhZ2UoKSA6IGVyciAmJiBlcnIubWVzc2FnZSA/IGVyci5tZXNzYWdlIDogU3RyaW5nKGVycik7XG4gICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNlYXJjaExlYXJuZXJzKHNlYXJjaCkge1xuICBjb25zdCByb3dzID0gYXdhaXQgY2FsbCgnR2V0TGVhcm5lcnMnLCBzZWFyY2gpO1xuICBjb25zdCBzZWVuID0gbmV3IFNldCgpO1xuICBjb25zdCBvdXQgPSBbXTtcbiAgZm9yIChjb25zdCByIG9mIHJvd3MpIHtcbiAgICBjb25zdCBwY29kZSA9IHN0cihyLnBjb2RlKTtcbiAgICBpZiAoIXBjb2RlIHx8IHNlZW4uaGFzKHBjb2RlKSkgY29udGludWU7IC8vIG9uZSByb3cgcGVyIGxlYXJuZXJcbiAgICBzZWVuLmFkZChwY29kZSk7XG4gICAgb3V0LnB1c2goe1xuICAgICAgaWQ6IHBjb2RlLFxuICAgICAgcGNvZGUsXG4gICAgICBhY3RpdmU6IGlzVHJ1ZShyLmFjdGl2ZSksXG4gICAgICBmaXJzdG5hbWU6IHN0cihyLmZpcnN0bmFtZSksXG4gICAgICBsYXN0bmFtZTogc3RyKHIubGFzdG5hbWUpLFxuICAgICAgZG9iOiBzdHIoci5kb2IpLFxuICAgICAgbGV2ZWw6IHN0cihyLmxldmVsKSxcbiAgICAgIGNsYXNzY29kZTogc3RyKHIuY2xhc3Njb2RlKSxcbiAgICAgIHR1dG9yY29kZTogc3RyKHIudHV0b3Jjb2RlKSxcbiAgICAgIHR1dG9ybmFtZTogc3RyKHIudHV0b3JuYW1lKSxcbiAgICAgIGVuZHllYXI6IHN0cihyLmVuZHllYXIpLFxuICAgIH0pO1xuICB9XG4gIHJldHVybiBvdXQ7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZWFyY2hDb3Vyc2VzKHNlYXJjaCkge1xuICBjb25zdCByb3dzID0gYXdhaXQgY2FsbCgnR2V0Q291cnNlcycsIHNlYXJjaCk7XG4gIHJldHVybiByb3dzLm1hcCgocikgPT4gKHtcbiAgICBpZDogc3RyKHIudWljeWVhcikgfHwgYCR7c3RyKHIudWljKX0tJHtzdHIoci5hY3llYXIpfWAsXG4gICAgYWN5ZWFyOiBzdHIoci5hY3llYXIpLFxuICAgIHVpYzogc3RyKHIudWljKSxcbiAgICB0aXRsZTogc3RyKHIudGl0bGUpLFxuICAgIHF1YWxpZmljYXRpb246IHN0cihyLnF1YWxpZmljYXRpb24pLFxuICAgIGFjdGl2ZTogaXNUcnVlKHIuaXNjdXJyZW50KSxcbiAgfSkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2VhcmNoQ2xhc3NlcyhzZWFyY2gpIHtcbiAgY29uc3Qgcm93cyA9IGF3YWl0IGNhbGwoJ0dldENsYXNzZXMnLCBzZWFyY2gpO1xuICByZXR1cm4gcm93cy5tYXAoKHIpID0+ICh7XG4gICAgaWQ6IGAke3N0cihyLnVpY3llYXIpIHx8IGAke3N0cihyLnVpYyl9LSR7c3RyKHIuYWN5ZWFyKX1gfXwke3N0cihyLmNsYXNzY29kZSl9YCxcbiAgICBhY3llYXI6IHN0cihyLmFjeWVhciksXG4gICAgdWljOiBzdHIoci51aWMpLFxuICAgIHRpdGxlOiBzdHIoci50aXRsZSksXG4gICAgcXVhbGlmaWNhdGlvbjogc3RyKHIucXVhbGlmaWNhdGlvbiksXG4gICAgY2xhc3Njb2RlOiBzdHIoci5jbGFzc2NvZGUpLFxuICAgIHN0YWZmY29kZTogc3RyKHIuc3RhZmZjb2RlKSxcbiAgICBzdGFmZm5hbWU6IHN0cihyLnN0YWZmbmFtZSksXG4gICAgYWN0aXZlOiBpc1RydWUoci5pc2N1cnJlbnQpLFxuICB9KSk7XG59XG4iLCAiaW1wb3J0IHsgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBTdGF0dXNQaWxsIH0gZnJvbSAnLi91aS5qc3gnO1xuXG4vLyBUaGUgc2VydmVyIGlzIGV4cGVjdGVkIHRvIGNhcCByZXN1bHRzLCBidXQgZ3VhcmQgdGhlIERPTSBhbnl3YXkuXG5leHBvcnQgY29uc3QgUk9XX0xJTUlUID0gMjAwO1xuXG4vKipcbiAqIGNvbHVtbnM6IFt7IGtleSwgbGFiZWwsIHZhbHVlKHJvdykgLT4gc29ydGFibGUgc3RyaW5nLCByZW5kZXI/KHJvdyksIGxpbms/OiB0cnVlIH1dXG4gKiBUaGUgY29sdW1uIG1hcmtlZCBgbGlua2AgcmVuZGVycyBhcyBhbiA8YT4gdG8gaHJlZihyb3cpOyB0aGUgd2hvbGUgcm93IGlzIGNsaWNrYWJsZSB0b28uXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFJlc3VsdFRhYmxlKHsgY2FwdGlvbiwgcm93cywgY29sdW1ucywgaHJlZiwgZGVmYXVsdFNvcnQgfSkge1xuICBjb25zdCBbc29ydCwgc2V0U29ydF0gPSB1c2VTdGF0ZShkZWZhdWx0U29ydCk7XG5cbiAgY29uc3Qgc29ydGVkID0gdXNlTWVtbygoKSA9PiB7XG4gICAgY29uc3QgY29sID0gY29sdW1ucy5maW5kKChjKSA9PiBjLmtleSA9PT0gc29ydC5rZXkpO1xuICAgIGlmICghY29sKSByZXR1cm4gcm93cztcbiAgICBjb25zdCBkaXIgPSBzb3J0LmRpciA9PT0gJ2Rlc2MnID8gLTEgOiAxO1xuICAgIC8vIEFjdGl2ZSByb3dzIGFsd2F5cyBjb21lIGZpcnN0OyB0aGUgY2hvc2VuIGNvbHVtbiBvcmRlcnMgd2l0aGluIGVhY2ggZ3JvdXAuXG4gICAgcmV0dXJuIFsuLi5yb3dzXS5zb3J0KChhLCBiKSA9PiAoYi5hY3RpdmUgLSBhLmFjdGl2ZSkgfHwgZGlyICogU3RyaW5nKGNvbC52YWx1ZShhKSkubG9jYWxlQ29tcGFyZShTdHJpbmcoY29sLnZhbHVlKGIpKSwgdW5kZWZpbmVkLCB7IG51bWVyaWM6IHRydWUsIHNlbnNpdGl2aXR5OiAnYmFzZScgfSkpO1xuICB9LCBbcm93cywgY29sdW1ucywgc29ydF0pO1xuXG4gIGNvbnN0IHNob3duID0gc29ydGVkLnNsaWNlKDAsIFJPV19MSU1JVCk7XG5cbiAgY29uc3QgdG9nZ2xlU29ydCA9IChrZXkpID0+XG4gICAgc2V0U29ydCgocykgPT4gKHMua2V5ID09PSBrZXkgPyB7IGtleSwgZGlyOiBzLmRpciA9PT0gJ2FzYycgPyAnZGVzYycgOiAnYXNjJyB9IDogeyBrZXksIGRpcjogJ2FzYycgfSkpO1xuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3AtdGFibGUtd3JhcFwiPlxuICAgICAgICA8dGFibGUgY2xhc3NOYW1lPVwic3AtdGFibGVcIj5cbiAgICAgICAgICA8Y2FwdGlvbiBjbGFzc05hbWU9XCJzcC1zclwiPntjYXB0aW9ufTwvY2FwdGlvbj5cbiAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgIDx0aCBzY29wZT1cImNvbFwiPlN0YXR1czwvdGg+XG4gICAgICAgICAgICAgIHtjb2x1bW5zLm1hcCgoYykgPT4gKFxuICAgICAgICAgICAgICAgIDx0aCBrZXk9e2Mua2V5fSBzY29wZT1cImNvbFwiIGFyaWEtc29ydD17c29ydC5rZXkgPT09IGMua2V5ID8gKHNvcnQuZGlyID09PSAnYXNjJyA/ICdhc2NlbmRpbmcnIDogJ2Rlc2NlbmRpbmcnKSA6IHVuZGVmaW5lZH0+XG4gICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJzcC10aC1idG5cIiBvbkNsaWNrPXsoKSA9PiB0b2dnbGVTb3J0KGMua2V5KX0+XG4gICAgICAgICAgICAgICAgICAgIHtjLmxhYmVsfVxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJhcnJcIiBhcmlhLWhpZGRlbj1cInRydWVcIj57c29ydC5rZXkgPT09IGMua2V5ID8gKHNvcnQuZGlyID09PSAnYXNjJyA/ICdcdTI1QjInIDogJ1x1MjVCQycpIDogJyd9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC90aD5cbiAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICA8L3RyPlxuICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAge3Nob3duLm1hcCgocikgPT4ge1xuICAgICAgICAgICAgICBjb25zdCB0byA9IGhyZWYocik7XG4gICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPHRyXG4gICAgICAgICAgICAgICAgICBrZXk9e3IuaWR9XG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e3IuYWN0aXZlID8gJycgOiAnaW5hY3RpdmUnfVxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUudGFyZ2V0LmNsb3Nlc3QoJ2EnKSkgcmV0dXJuOyAvLyBsZXQgdGhlIGxpbmsgaGFuZGxlIGl0c2VsZlxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IHRvO1xuICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICA8dGQ+PFN0YXR1c1BpbGwgYWN0aXZlPXtyLmFjdGl2ZX0gLz48L3RkPlxuICAgICAgICAgICAgICAgICAge2NvbHVtbnMubWFwKChjKSA9PiAoXG4gICAgICAgICAgICAgICAgICAgIDx0ZCBrZXk9e2Mua2V5fSBjbGFzc05hbWU9e2MubGluayA/ICdwcmltYXJ5JyA6IHVuZGVmaW5lZH0+XG4gICAgICAgICAgICAgICAgICAgICAge2MubGluayA/IDxhIGhyZWY9e3RvfT57Yy5yZW5kZXIgPyBjLnJlbmRlcihyKSA6IGMudmFsdWUocil9PC9hPiA6IGMucmVuZGVyID8gYy5yZW5kZXIocikgOiBjLnZhbHVlKHIpfVxuICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pfVxuICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgIDwvdGFibGU+XG4gICAgICA8L2Rpdj5cbiAgICAgIHtzb3J0ZWQubGVuZ3RoID4gUk9XX0xJTUlUICYmIChcbiAgICAgICAgPHAgY2xhc3NOYW1lPVwic3AtdGFibGUtZm9vdFwiPlxuICAgICAgICAgIFNob3dpbmcgdGhlIGZpcnN0IHtST1dfTElNSVR9IG9mIHtzb3J0ZWQubGVuZ3RofS4gS2VlcCB0eXBpbmcgdG8gbmFycm93IHRoZSBzZWFyY2guXG4gICAgICAgIDwvcD5cbiAgICAgICl9XG4gICAgPC8+XG4gICk7XG59XG4iLCAiLy8gU21hbGwgc2hhcmVkIFVJIHBpZWNlcy4gRXZlcnkgPGJ1dHRvbj4gaXMgdHlwZT1cImJ1dHRvblwiOiB0aGUgcGFnZSBzaXRzIGluc2lkZVxuLy8gdGhlIFdlYkZvcm1zIDxmb3JtIHJ1bmF0PVwic2VydmVyXCI+LCBhbmQgYSBkZWZhdWx0IChzdWJtaXQpIGJ1dHRvbiB3b3VsZCBwb3N0IGJhY2suXG5cbmV4cG9ydCBmdW5jdGlvbiBJY29uKHsgbmFtZSwgc2l6ZSA9IDE4IH0pIHtcbiAgY29uc3QgcCA9IHsgd2lkdGg6IHNpemUsIGhlaWdodDogc2l6ZSwgdmlld0JveDogJzAgMCAyNCAyNCcsIGZpbGw6ICdub25lJywgc3Ryb2tlOiAnY3VycmVudENvbG9yJywgc3Ryb2tlV2lkdGg6IDIsIHN0cm9rZUxpbmVjYXA6ICdyb3VuZCcsIHN0cm9rZUxpbmVqb2luOiAncm91bmQnLCAnYXJpYS1oaWRkZW4nOiB0cnVlLCBmb2N1c2FibGU6ICdmYWxzZScgfTtcbiAgc3dpdGNoIChuYW1lKSB7XG4gICAgY2FzZSAnc2VhcmNoJzpcbiAgICAgIHJldHVybiA8c3ZnIHsuLi5wfT48Y2lyY2xlIGN4PVwiMTFcIiBjeT1cIjExXCIgcj1cIjdcIiAvPjxwYXRoIGQ9XCJtMjAgMjAtMy41LTMuNVwiIC8+PC9zdmc+O1xuICAgIGNhc2UgJ3gnOlxuICAgICAgcmV0dXJuIDxzdmcgey4uLnB9PjxwYXRoIGQ9XCJNMTggNiA2IDE4TTYgNmwxMiAxMlwiIC8+PC9zdmc+O1xuICAgIGNhc2UgJ3N1bic6XG4gICAgICByZXR1cm4gPHN2ZyB7Li4ucH0+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCI0XCIgLz48cGF0aCBkPVwiTTEyIDJ2Mk0xMiAyMHYyTTQuOSA0LjlsMS40IDEuNE0xNy43IDE3LjdsMS40IDEuNE0yIDEyaDJNMjAgMTJoMk00LjkgMTkuMWwxLjQtMS40TTE3LjcgNi4zbDEuNC0xLjRcIiAvPjwvc3ZnPjtcbiAgICBjYXNlICdtb29uJzpcbiAgICAgIHJldHVybiA8c3ZnIHsuLi5wfT48cGF0aCBkPVwiTTIxIDEyLjhBOSA5IDAgMSAxIDExLjIgM2E3IDcgMCAwIDAgOS44IDkuOHpcIiAvPjwvc3ZnPjtcbiAgICBjYXNlICdiYWNrJzpcbiAgICAgIHJldHVybiA8c3ZnIHsuLi5wfT48cGF0aCBkPVwiTTE5IDEySDVNMTIgMTlsLTctNyA3LTdcIiAvPjwvc3ZnPjtcbiAgICBjYXNlICd1c2VyJzpcbiAgICAgIHJldHVybiA8c3ZnIHsuLi5wfT48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjhcIiByPVwiNFwiIC8+PHBhdGggZD1cIk00IDIxYTggOCAwIDAgMSAxNiAwXCIgLz48L3N2Zz47XG4gICAgY2FzZSAnYm9vayc6XG4gICAgICByZXR1cm4gPHN2ZyB7Li4ucH0+PHBhdGggZD1cIk00IDE5LjVBMi41IDIuNSAwIDAgMSA2LjUgMTdIMjBWM0g2LjVBMi41IDIuNSAwIDAgMCA0IDUuNXpcIiAvPjxwYXRoIGQ9XCJNNCAxOS41VjIxaDE2XCIgLz48L3N2Zz47XG4gICAgY2FzZSAnZ3JpZCc6XG4gICAgICByZXR1cm4gPHN2ZyB7Li4ucH0+PHJlY3QgeD1cIjNcIiB5PVwiM1wiIHdpZHRoPVwiN1wiIGhlaWdodD1cIjdcIiByeD1cIjEuNVwiIC8+PHJlY3QgeD1cIjE0XCIgeT1cIjNcIiB3aWR0aD1cIjdcIiBoZWlnaHQ9XCI3XCIgcng9XCIxLjVcIiAvPjxyZWN0IHg9XCIzXCIgeT1cIjE0XCIgd2lkdGg9XCI3XCIgaGVpZ2h0PVwiN1wiIHJ4PVwiMS41XCIgLz48cmVjdCB4PVwiMTRcIiB5PVwiMTRcIiB3aWR0aD1cIjdcIiBoZWlnaHQ9XCI3XCIgcng9XCIxLjVcIiAvPjwvc3ZnPjtcbiAgICBjYXNlICdnYXVnZSc6XG4gICAgICByZXR1cm4gPHN2ZyB7Li4ucH0+PHBhdGggZD1cIk0zLjUgMTdhOSA5IDAgMSAxIDE3IDBcIiAvPjxwYXRoIGQ9XCJtMTIgMTMgNC01XCIgLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEzXCIgcj1cIjEuMlwiIC8+PC9zdmc+O1xuICAgIGNhc2UgJ3VzZXJzJzpcbiAgICAgIHJldHVybiA8c3ZnIHsuLi5wfT48Y2lyY2xlIGN4PVwiOVwiIGN5PVwiOFwiIHI9XCIzLjVcIiAvPjxwYXRoIGQ9XCJNMi41IDIwYTYuNSA2LjUgMCAwIDEgMTMgMFwiIC8+PHBhdGggZD1cIk0xNiA0LjZhMy41IDMuNSAwIDAgMSAwIDYuOE0xOCAxNGE2LjUgNi41IDAgMCAxIDMuNSA2XCIgLz48L3N2Zz47XG4gICAgY2FzZSAnY2xpcGJvYXJkJzpcbiAgICAgIHJldHVybiA8c3ZnIHsuLi5wfT48cmVjdCB4PVwiNVwiIHk9XCI0XCIgd2lkdGg9XCIxNFwiIGhlaWdodD1cIjE3XCIgcng9XCIyXCIgLz48cGF0aCBkPVwiTTkgNFYzaDZ2MU05IDExaDZNOSAxNWg0XCIgLz48L3N2Zz47XG4gICAgY2FzZSAnY2hlY2snOlxuICAgICAgcmV0dXJuIDxzdmcgey4uLnB9PjxyZWN0IHg9XCIzXCIgeT1cIjNcIiB3aWR0aD1cIjE4XCIgaGVpZ2h0PVwiMThcIiByeD1cIjNcIiAvPjxwYXRoIGQ9XCJtOCAxMiAzIDMgNS02XCIgLz48L3N2Zz47XG4gICAgY2FzZSAnY2FsZW5kYXInOlxuICAgICAgcmV0dXJuIDxzdmcgey4uLnB9PjxyZWN0IHg9XCIzXCIgeT1cIjVcIiB3aWR0aD1cIjE4XCIgaGVpZ2h0PVwiMTZcIiByeD1cIjJcIiAvPjxwYXRoIGQ9XCJNMyAxMGgxOE04IDN2NE0xNiAzdjRcIiAvPjwvc3ZnPjtcbiAgICBjYXNlICdzaGllbGQnOlxuICAgICAgcmV0dXJuIDxzdmcgey4uLnB9PjxwYXRoIGQ9XCJNMTIgMyA0IDZ2NmMwIDQuNSAzLjQgOC4yIDggOSA0LjYtLjggOC00LjUgOC05VjZ6XCIgLz48cGF0aCBkPVwibTkgMTIgMiAyIDQtNFwiIC8+PC9zdmc+O1xuICAgIGNhc2UgJ2hvbWUnOlxuICAgICAgcmV0dXJuIDxzdmcgey4uLnB9PjxwYXRoIGQ9XCJNMyAxMSAxMiA0bDkgN1wiIC8+PHBhdGggZD1cIk01IDEwdjEwaDE0VjEwXCIgLz48cGF0aCBkPVwiTTEwIDIwdi01aDR2NVwiIC8+PC9zdmc+O1xuICAgIGNhc2UgJ2xheWVycyc6XG4gICAgICByZXR1cm4gPHN2ZyB7Li4ucH0+PHBhdGggZD1cIm0xMiAzIDkgNS05IDUtOS01elwiIC8+PHBhdGggZD1cIm0zIDEzIDkgNSA5LTVcIiAvPjwvc3ZnPjtcbiAgICBjYXNlICdhcnJvdyc6XG4gICAgICByZXR1cm4gPHN2ZyB7Li4ucH0+PHBhdGggZD1cIk01IDEyaDE0TTEzIDZsNiA2LTYgNlwiIC8+PC9zdmc+O1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gU3RhdHVzUGlsbCh7IGFjdGl2ZSB9KSB7XG4gIHJldHVybiA8c3BhbiBjbGFzc05hbWU9eydzcC1zdGF0dXMgJyArIChhY3RpdmUgPyAnb24nIDogJ29mZicpfT57YWN0aXZlID8gJ0FjdGl2ZScgOiAnSW5hY3RpdmUnfTwvc3Bhbj47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBTd2l0Y2goeyBjaGVja2VkLCBvbkNoYW5nZSwgY2hpbGRyZW4gfSkge1xuICByZXR1cm4gKFxuICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIHJvbGU9XCJzd2l0Y2hcIiBhcmlhLWNoZWNrZWQ9e2NoZWNrZWR9IGNsYXNzTmFtZT17J3NwLXN3aXRjaCcgKyAoY2hlY2tlZCA/ICcgb24nIDogJycpfSBvbkNsaWNrPXsoKSA9PiBvbkNoYW5nZSghY2hlY2tlZCl9PlxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidHJhY2tcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48c3BhbiBjbGFzc05hbWU9XCJ0aHVtYlwiIC8+PC9zcGFuPlxuICAgICAgPHNwYW4+e2NoaWxkcmVufTwvc3Bhbj5cbiAgICA8L2J1dHRvbj5cbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFNwaW5uZXIoeyBsYWJlbCA9ICdMb2FkaW5nJyB9KSB7XG4gIHJldHVybiA8c3BhbiBjbGFzc05hbWU9XCJzcC1zcGlubmVyXCIgcm9sZT1cInN0YXR1c1wiIGFyaWEtbGFiZWw9e2xhYmVsfSAvPjtcbn1cbiIsICIvLyBcIkRhc2hib2FyZHMgJiBUb29sc1wiOiBxdWljayBsaW5rcyB0byBvdGhlciBwYXJ0cyBvZiB0aGUgc2l0ZS5cbi8vIGBocmVmYCBpcyBudWxsIHdoaWxlIGEgcGFnZSBpcyBhIHBsYWNlaG9sZGVyOyBzZXQgaXQgdG8gdGhlIHJlYWwgVVJMIG9uY2UgdGhlXG4vLyBwYWdlIGV4aXN0cyBhbmQgdGhlIGNhcmQgd2lsbCBsaW5rIHRoZXJlIGluc3RlYWQgb2YgIy90b29sLzxpZD4uXG5cbmV4cG9ydCBjb25zdCBUT09MUyA9IFtcbiAgeyBpZDogJ3N0YWZmLWRhc2hib2FyZCcsIHRpdGxlOiAnU3RhZmYgRGFzaGJvYXJkJywgaWNvbjogJ2dhdWdlJywgYmx1cmI6ICdZb3VyIGNsYXNzZXMsIHRhc2tzIGFuZCBhbGVydHMgYXQgYSBnbGFuY2UnLCBocmVmOiBudWxsIH0sXG4gIHsgaWQ6ICd0dXRvci1kYXNoYm9hcmQnLCB0aXRsZTogJ1R1dG9yIERhc2hib2FyZCcsIGljb246ICd1c2VycycsIGJsdXJiOiAnVHV0b3IgZ3JvdXAgb3ZlcnZpZXcsIGF0dGVuZGFuY2UgYW5kIGNvbmNlcm5zJywgaHJlZjogbnVsbCB9LFxuICB7IGlkOiAnZW5yb2xtZW50JywgdGl0bGU6ICdFbnJvbG1lbnQgU3lzdGVtJywgaWNvbjogJ2NsaXBib2FyZCcsIGJsdXJiOiAnQXBwbGljYXRpb25zLCBlbnJvbG1lbnRzIGFuZCB0cmFuc2ZlcnMnLCBocmVmOiBudWxsIH0sXG4gIHsgaWQ6ICdhdHRlbmRhbmNlJywgdGl0bGU6ICdBdHRlbmRhbmNlIFRyYWNrZXInLCBpY29uOiAnY2hlY2snLCBibHVyYjogJ1JlZ2lzdGVycywgYWJzZW5jZXMgYW5kIGF0dGVuZGFuY2UgdHJlbmRzJywgaHJlZjogbnVsbCB9LFxuICB7IGlkOiAnc3RhZmYtdGltZXRhYmxlcycsIHRpdGxlOiAnU3RhZmYgVGltZXRhYmxlcycsIGljb246ICdjYWxlbmRhcicsIGJsdXJiOiAnTG9vayB1cCBhbnkgc3RhZmYgbWVtYmVyXHUyMDE5cyB0aW1ldGFibGUnLCBocmVmOiBudWxsIH0sXG4gIHsgaWQ6ICdhY2Nlc3MtYXJyYW5nZW1lbnRzJywgdGl0bGU6ICdBY2Nlc3MgQXJyYW5nZW1lbnRzIERhc2hib2FyZCcsIGljb246ICdzaGllbGQnLCBibHVyYjogJ0V4YW0gYWNjZXNzIGFycmFuZ2VtZW50cyBhbmQgc3VwcG9ydCBuZWVkcycsIGhyZWY6IG51bGwgfSxcbiAgeyBpZDogJ3BhcmVudC1wb3J0YWwnLCB0aXRsZTogJ1BhcmVudCBQb3J0YWwgQWNjb3VudHMnLCBpY29uOiAnaG9tZScsIGJsdXJiOiAnTWFuYWdlIHBhcmVudCBhbmQgY2FyZXIgcG9ydGFsIGFjY2VzcycsIGhyZWY6IG51bGwgfSxcbiAgeyBpZDogJ2N1c3RvbS1jb2hvcnRzJywgdGl0bGU6ICdNYW5hZ2UgQ3VzdG9tIENvaG9ydHMnLCBpY29uOiAnbGF5ZXJzJywgYmx1cmI6ICdCdWlsZCBhbmQgbWFpbnRhaW4gY3VzdG9tIGdyb3VwcyBvZiBsZWFybmVycycsIGhyZWY6IG51bGwgfSxcbl07XG5cbmV4cG9ydCBjb25zdCB0b29sQnlJZCA9IChpZCkgPT4gVE9PTFMuZmluZCgodCkgPT4gdC5pZCA9PT0gaWQpO1xuXG4vLyBFdmVyeSB0eXBlZCB3b3JkIG11c3QgYXBwZWFyIGluIHRoZSB0aXRsZSBvciBibHVyYiAoc2FtZSBydWxlIGFzIHRoZSBzZXJ2ZXIgc2VhcmNoKS5cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJUb29scyhxKSB7XG4gIGNvbnN0IHdvcmRzID0gcS50b0xvd2VyQ2FzZSgpLnNwbGl0KC9cXHMrLykuZmlsdGVyKEJvb2xlYW4pO1xuICBpZiAoIXdvcmRzLmxlbmd0aCkgcmV0dXJuIFRPT0xTO1xuICByZXR1cm4gVE9PTFMuZmlsdGVyKCh0KSA9PiB7XG4gICAgY29uc3QgaGF5ID0gKHQudGl0bGUgKyAnICcgKyB0LmJsdXJiKS50b0xvd2VyQ2FzZSgpO1xuICAgIHJldHVybiB3b3Jkcy5ldmVyeSgodykgPT4gaGF5LmluY2x1ZGVzKHcpKTtcbiAgfSk7XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQSxhQUFPLFVBQVUsT0FBTyxhQUFhO0FBQUE7QUFBQTs7O0FDQXJDO0FBQUE7QUFBQSxhQUFPLFVBQVUsT0FBTyxhQUFhO0FB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QUFHLEtBQUssU0FBUyxLQUFLLEtBQUssS0FBSztBQUN2QyxZQUFNLEtBQUssQ0FBQyxVQUFVLEtBQUssR0FBRyxHQUFHLENBQUMsUUFBUSxLQUFLLE1BQU0sR0FBRyxDQUFDLFNBQVMsS0FBSyxTQUFTLENBQUM7QUFBQSxJQUNuRjtBQUVBLFdBQ0UsOENBQUMsU0FBSSxXQUFVLFdBQ2I7QUFBQSxtREFBQyxPQUFFLFdBQVUsY0FBYyxZQUFFLE9BQU07QUFBQSxNQUNuQyw4Q0FBQyxRQUFHLFdBQVUsaUJBQWdCLFVBQVUsSUFBSSxLQUFLLFNBQzlDO0FBQUE7QUFBQSxRQUFLO0FBQUEsUUFBRSxRQUFRLDZDQUFDLGNBQVcsUUFBUSxLQUFLLFFBQVE7QUFBQSxTQUNuRDtBQUFBLE1BQ0MsTUFBTSxTQUFTLEtBQ2QsNkNBQUMsUUFBRyxXQUFVLFlBQ1gsZ0JBQU0sSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQ25CLDhDQUFDLFNBQ0M7QUFBQSxxREFBQyxRQUFJLGlCQUFNO0FBQUEsUUFDWCw2Q0FBQyxRQUFJLGVBQUssVUFBSTtBQUFBLFdBRk4sS0FHVixDQUNELEdBQ0g7QUFBQSxNQUVGLDhDQUFDLFNBQUksV0FBVSw2QkFDYjtBQUFBLHFEQUFDLFFBQUcseUJBQVc7QUFBQSxRQUNkLFNBQVMsU0FDUiw2Q0FBQyxPQUFHLGlCQUFPLEdBQUcsS0FBSyxLQUFLLHVDQUF1QyxpQ0FBNEIsRUFBRSxXQUFLLElBRWxHLDhDQUFDLE9BQUU7QUFBQTtBQUFBLFVBQTBCLEVBQUU7QUFBQSxVQUFLO0FBQUEsV0FBaUM7QUFBQSxTQUV6RTtBQUFBLE9BQ0Y7QUFBQSxFQUVKOzs7QUR6SHdCLE1BQUFDLHNCQUFBO0FBTnhCLFdBQVMsUUFBUTtBQUNmLFVBQU0sS0FBSyxTQUFTLGVBQWUsYUFBYTtBQUNoRCxRQUFJLENBQUMsSUFBSTtBQUNQLGNBQVEsTUFBTSxnREFBZ0Q7QUFDOUQ7QUFBQSxJQUNGO0FBQ0Esa0NBQVcsRUFBRSxFQUFFLE9BQU8sNkNBQUMsT0FBSSxRQUFRLElBQUksQ0FBRTtBQUFBLEVBQzNDO0FBRUEsTUFBSSxTQUFTLGVBQWUsVUFBVyxVQUFTLGlCQUFpQixvQkFBb0IsS0FBSztBQUFBLE1BQ3JGLE9BQU07IiwKICAibmFtZXMiOiBbImltcG9ydF9yZWFjdCIsICJpbXBvcnRfcmVhY3QiLCAiaW1wb3J0X3JlYWN0IiwgImltcG9ydF9qc3hfcnVudGltZSIsICJpbXBvcnRfanN4X3J1bnRpbWUiLCAiTU9ERVMiLCAiZGF0YSIsICJpbXBvcnRfanN4X3J1bnRpbWUiLCAiaW1wb3J0X2pzeF9ydW50aW1lIl0KfQo=
