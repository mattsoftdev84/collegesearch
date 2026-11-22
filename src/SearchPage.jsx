import { useEffect, useMemo, useRef, useState } from 'react';
import { searchClasses, searchCourses, searchLearners } from './api.js';
import { detailHash, parseHash, searchHash, useDebounced } from './hooks.js';
import ResultTable from './ResultTable.jsx';
import { filterTools } from './tools.js';
import { Icon, Spinner, Switch } from './ui.jsx';

export const MIN_CHARS = 3;
const DEBOUNCE_MS = 300;
const CACHE_MS = 60_000;

const MODES = {
  learners: { label: 'Search Learners', icon: 'user', placeholder: 'Name, learner ID or tutor group…' },
  courses: { label: 'Search Courses', icon: 'book', placeholder: 'Course code, title, class code or staff…' },
  tools: { label: 'Dashboards & Tools', icon: 'grid', placeholder: 'Filter dashboards and tools…' },
};

export const toolHref = (t) => t.href || detailHash('tool', t.id);

// Short-lived cache so backspacing / switching modes doesn't re-hit the server.
const cache = new Map();
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
  if (mode === 'learners') {
    return cached('L:' + key, () => searchLearners(term)).then((learners) => ({ learners }));
  }
  return Promise.all([cached('C:' + key, () => searchCourses(term)), cached('K:' + key, () => searchClasses(term))]).then(
    ([courses, classes]) => ({ courses, classes })
  );
}

// Lets the placeholder pages show a name for something picked from the results.
export const known = new Map();

export default function SearchPage({ route, hidden }) {
  const [mode, setMode] = useState(() => (route.page === 'search' ? route.mode : 'learners'));
  const [q, setQ] = useState(() => (route.page === 'search' ? route.q : ''));
  const [showInactive, setShowInactive] = useState(() => route.page === 'search' && route.inactive);
  const [state, setState] = useState({ status: 'idle' }); // idle | loading | done | error
  const [retry, setRetry] = useState(0);
  const inputRef = useRef(null);

  const isTools = mode === 'tools';
  const term = useDebounced(q.trim(), DEBOUNCE_MS);
  const ready = !isTools && term.length >= MIN_CHARS; // tools filter locally, no server call
  const tools = useMemo(() => (isTools ? filterTools(q) : []), [isTools, q]);

  // Keep the URL in step with the search (replaceState: no history spam, no hashchange).
  useEffect(() => {
    if (parseHash().page !== 'search') return;
    const h = searchHash({ mode, q: q.trim(), inactive: showInactive });
    if (h !== window.location.hash) window.history.replaceState(null, '', h);
  }, [mode, q, showInactive]);

  // Arriving back on the search URL (Back button, deep link) restores its state.
  useEffect(() => {
    if (route.page !== 'search') return;
    setMode(route.mode);
    setQ((cur) => (cur.trim() === route.q ? cur : route.q));
    setShowInactive(route.inactive);
  }, [route]);

  useEffect(() => {
    if (!ready) {
      setState({ status: 'idle' });
      return;
    }
    let stale = false; // ignore responses that arrive after a newer search started
    setState((s) => ({ ...s, status: 'loading', error: null }));
    runSearch(mode, term).then(
      (data) => {
        if (stale) return;
        for (const list of Object.values(data)) for (const item of list) known.set(item.id, item);
        setState({ status: 'done', mode, term, data });
      },
      (err) => {
        if (!stale) setState({ status: 'error', mode, term, error: err.message || String(err) });
      }
    );
    return () => {
      stale = true;
    };
  }, [mode, term, ready, retry]);

  // Results for the current mode (keep showing the previous ones while a new search loads).
  const data = state.data && state.mode === mode ? state.data : null;
  const loading = state.status === 'loading';
  const hasResults = isTools || ready || q.trim().length > 0;

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // would submit the WebForms form
      // In tools mode Enter opens the top match.
      if (isTools && q.trim() && tools.length) window.location.href = toolHref(tools[0]);
    }
    if (e.key === 'Escape') setQ('');
  };

  const hint = isTools
    ? q.trim() && tools.length
      ? 'Press Enter to open the first match'
      : '\u00a0'
    : q.trim().length > 0 && q.trim().length < MIN_CHARS
    ? `Type at least ${MIN_CHARS} characters to search`
    : !q
    ? 'Results appear as you type'
    : '\u00a0';

  return (
    <div className="sp-search" hidden={hidden}>
      <div className={'sp-hero' + (hasResults ? ' compact' : '')}>
        <h1 className="sp-title">
          <span className="sp-sr">SAPIEN</span>
          <span className="br l" aria-hidden="true" />
          {/* word-wrap grows from 0 width so the brackets "open" around the word */}
          <span className="word-wrap" aria-hidden="true">
            <span className="word">
              {'SAPIEN'.split('').map((ch, i) => (
                <span key={i} style={{ '--i': i }}>{ch}</span>
              ))}
            </span>
          </span>
          <span className="br r" aria-hidden="true" />
        </h1>

        <div className="sp-searchbox">
          <div className="sp-seg" role="group" aria-label="What to search">
            {Object.entries(MODES).map(([key, m]) => (
              <button
                key={key}
                type="button"
                aria-pressed={mode === key}
                className={mode === key ? 'on' : ''}
                onClick={() => {
                  setMode(key);
                  inputRef.current && inputRef.current.focus();
                }}
              >
                <Icon name={m.icon} size={16} />
                {m.label}
              </button>
            ))}
          </div>

          <div className="sp-input">
            <Icon name="search" />
            <input
              ref={inputRef}
              type="search"
              autoFocus
              autoComplete="off"
              spellCheck="false"
              aria-label={MODES[mode].label}
              placeholder={MODES[mode].placeholder}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={onKeyDown}
            />
            {loading && <Spinner label="Searching" />}
            {q && (
              <button type="button" className="sp-clear" aria-label="Clear search" onClick={() => { setQ(''); inputRef.current.focus(); }}>
                <Icon name="x" size={16} />
              </button>
            )}
          </div>
          <p className="sp-hint" aria-live="polite">{hint}</p>
        </div>
      </div>

      {isTools && <ToolList tools={tools} q={q.trim()} clear={() => { setQ(''); inputRef.current.focus(); }} />}

      {ready && (
        <div className="sp-results" aria-busy={loading}>
          {state.status === 'error' ? (
            <div className="sp-error" role="alert">
              <span>Search failed: {state.error}</span>
              <button type="button" className="sp-btn small" onClick={() => setRetry((n) => n + 1)}>Try again</button>
            </div>
          ) : !data ? (
            <p className="sp-msg"><Spinner /> Searching…</p>
          ) : mode === 'learners' ? (
            <LearnerResults learners={data.learners} term={state.term} showInactive={showInactive} setShowInactive={setShowInactive} />
          ) : (
            <CourseResults courses={data.courses} classes={data.classes} term={state.term} showInactive={showInactive} setShowInactive={setShowInactive} />
          )}
        </div>
      )}
    </div>
  );
}

function ToolList({ tools, q, clear }) {
  return (
    <section className="sp-results sp-tools-wrap" aria-label="Dashboards and tools">
      {tools.length ? (
        <ul className="sp-tools">
          {tools.map((t) => (
            <li key={t.id}>
              <a className="sp-tool" href={toolHref(t)}>
                <span className="sp-tool-icon"><Icon name={t.icon} size={20} /></span>
                <span className="sp-tool-text">
                  <b>{t.title}</b>
                  <span>{t.blurb}</span>
                </span>
                <span className="sp-tool-go"><Icon name="arrow" size={16} /></span>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <div className="sp-empty">
          No dashboards or tools match “{q}”.{' '}
          <button type="button" className="sp-link" onClick={clear}>Clear filter</button>
        </div>
      )}
    </section>
  );
}

function split(rows, showInactive) {
  const active = rows.filter((r) => r.active);
  return { rows: showInactive ? rows : active, inactiveCount: rows.length - active.length };
}

function Toolbar({ summary, inactiveCount, showInactive, setShowInactive }) {
  return (
    <div className="sp-toolbar">
      <p aria-live="polite">{summary}</p>
      <Switch checked={showInactive} onChange={setShowInactive}>
        Show inactive{inactiveCount ? ` (${inactiveCount})` : ''}
      </Switch>
    </div>
  );
}

function Empty({ what, term, inactiveCount, showInactive, setShowInactive }) {
  return (
    <div className="sp-empty">
      {inactiveCount > 0 && !showInactive ? (
        <>
          No active {what} match “{term}”.{' '}
          <button type="button" className="sp-link" onClick={() => setShowInactive(true)}>
            Show {inactiveCount} inactive
          </button>
        </>
      ) : (
        <>No {what} match “{term}”.</>
      )}
    </div>
  );
}

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

const LEARNER_COLS = [
  { key: 'name', label: 'Name', link: true, value: (r) => `${r.lastname}, ${r.firstname}`, render: (r) => <><b>{r.lastname}</b>, {r.firstname}</> },
  { key: 'pcode', label: 'Learner ID', value: (r) => r.pcode },
  { key: 'level', label: 'Level', value: (r) => r.level },
  { key: 'classcode', label: 'Tutor group', value: (r) => r.classcode },
  { key: 'tutorname', label: 'Tutor', value: (r) => r.tutorname },
  { key: 'endyear', label: 'End year', value: (r) => r.endyear },
];

function LearnerResults({ learners, term, showInactive, setShowInactive }) {
  const { rows, inactiveCount } = useMemo(() => split(learners, showInactive), [learners, showInactive]);
  const activeCount = learners.length - inactiveCount;
  const summary = showInactive
    ? `${plural(learners.length, 'learner', 'learners')} (${activeCount} active)`
    : `${plural(activeCount, 'active learner', 'active learners')}${inactiveCount ? ` · ${inactiveCount} inactive hidden` : ''}`;

  return (
    <section className="sp-section" aria-labelledby="sp-h-learners">
      <div className="sp-section-head">
        <h2 id="sp-h-learners">Learners</h2>
      </div>
      <Toolbar summary={summary} inactiveCount={inactiveCount} showInactive={showInactive} setShowInactive={setShowInactive} />
      {rows.length ? (
        <ResultTable caption="Learners" rows={rows} columns={LEARNER_COLS} href={(r) => detailHash('learner', r.pcode)} defaultSort={{ key: 'name', dir: 'asc' }} />
      ) : (
        <Empty what="learners" term={term} inactiveCount={inactiveCount} showInactive={showInactive} setShowInactive={setShowInactive} />
      )}
    </section>
  );
}

const COURSE_COLS = [
  { key: 'title', label: 'Course', link: true, value: (r) => r.title, render: (r) => <b>{r.title}</b> },
  { key: 'uic', label: 'Code', value: (r) => r.uic },
  { key: 'qualification', label: 'Qualification', value: (r) => r.qualification },
  { key: 'acyear', label: 'Year', value: (r) => r.acyear },
];

const CLASS_COLS = [
  { key: 'classcode', label: 'Class', link: true, value: (r) => r.classcode, render: (r) => <b>{r.classcode}</b> },
  { key: 'title', label: 'Course', value: (r) => r.title },
  { key: 'uic', label: 'Code', value: (r) => r.uic },
  { key: 'staffname', label: 'Staff', value: (r) => r.staffname },
  { key: 'acyear', label: 'Year', value: (r) => r.acyear },
];

function CourseResults({ courses, classes, term, showInactive, setShowInactive }) {
  const c = useMemo(() => split(courses, showInactive), [courses, showInactive]);
  const k = useMemo(() => split(classes, showInactive), [classes, showInactive]);
  const inactiveCount = c.inactiveCount + k.inactiveCount;
  const summary = `${plural(c.rows.length, 'course', 'courses')} · ${plural(k.rows.length, 'class', 'classes')}${
    !showInactive && inactiveCount ? ` · ${inactiveCount} inactive hidden` : ''
  }`;

  return (
    <>
      <Toolbar summary={summary} inactiveCount={inactiveCount} showInactive={showInactive} setShowInactive={setShowInactive} />
      <section className="sp-section" aria-labelledby="sp-h-courses">
        <div className="sp-section-head">
          <h2 id="sp-h-courses">Courses</h2>
          <span className="sp-count">{c.rows.length}</span>
        </div>
        {c.rows.length ? (
          <ResultTable caption="Courses" rows={c.rows} columns={COURSE_COLS} href={(r) => detailHash('course', r.id)} defaultSort={{ key: 'acyear', dir: 'desc' }} />
        ) : (
          <Empty what="courses" term={term} inactiveCount={c.inactiveCount} showInactive={showInactive} setShowInactive={setShowInactive} />
        )}
      </section>
      <section className="sp-section" aria-labelledby="sp-h-classes">
        <div className="sp-section-head">
          <h2 id="sp-h-classes">Classes</h2>
          <span className="sp-count">{k.rows.length}</span>
        </div>
        {k.rows.length ? (
          <ResultTable caption="Classes" rows={k.rows} columns={CLASS_COLS} href={(r) => detailHash('class', r.id)} defaultSort={{ key: 'acyear', dir: 'desc' }} />
        ) : (
          <Empty what="classes" term={term} inactiveCount={k.inactiveCount} showInactive={showInactive} setShowInactive={setShowInactive} />
        )}
      </section>
    </>
  );
}
