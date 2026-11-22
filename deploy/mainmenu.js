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
