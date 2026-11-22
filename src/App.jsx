import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { load, save, useHashRoute } from './hooks.js';
import SearchPage, { known } from './SearchPage.jsx';
import { toolById } from './tools.js';
import { Icon, StatusPill } from './ui.jsx';

const THEME_KEY = 'sapien-theme';

function initialTheme() {
  const saved = load(THEME_KEY, null);
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function App({ rootEl }) {
  const route = useHashRoute();
  const [theme, setTheme] = useState(initialTheme);
  const lastSearch = useRef('#/');
  const searchScroll = useRef(0);
  const prevPage = useRef(route.page);

  useLayoutEffect(() => {
    rootEl.setAttribute('data-theme', theme);
  }, [theme, rootEl]);

  // Remember where the search page was so "Back to search" restores it exactly.
  if (route.page === 'search') lastSearch.current = window.location.hash || '#/';

  useLayoutEffect(() => {
    if (prevPage.current === 'search' && route.page !== 'search') {
      window.scrollTo(0, 0);
    } else if (prevPage.current !== 'search' && route.page === 'search') {
      window.scrollTo(0, searchScroll.current);
    }
    prevPage.current = route.page;
  }, [route.page]);

  useEffect(() => {
    if (route.page !== 'search') return;
    const on = () => (searchScroll.current = window.scrollY);
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, [route.page]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    save(THEME_KEY, next);
  };

  return (
    <div className="sp-app">
      <div className="sp-top">
        {route.page !== 'search' && (
          <a className="sp-btn ghost" href={lastSearch.current}>
            <Icon name="back" size={16} /> Back to search
          </a>
        )}
        <button
          type="button"
          className="sp-icon-btn"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
        </button>
      </div>

      <SearchPage route={route} hidden={route.page !== 'search'} />
      {route.page !== 'search' && <Placeholder kind={route.page} id={route.id} />}
    </div>
  );
}

const KINDS = {
  learner: { title: 'Learner record', area: 'learner area' },
  course: { title: 'Course', area: 'course area' },
  class: { title: 'Class', area: 'class area' },
  tool: { title: 'Dashboards & Tools', area: 'tool' },
};

function Placeholder({ kind, id }) {
  const item = kind === 'tool' ? null : known.get(id);
  const tool = kind === 'tool' ? toolById(id) : null;
  const k = KINDS[kind];
  const headRef = useRef(null);
  useEffect(() => {
    headRef.current && headRef.current.focus();
  }, [kind, id]);

  let name = id;
  const facts = [];
  if (kind === 'tool') {
    name = tool ? tool.title : 'Unknown tool';
  } else if (item && kind === 'learner') {
    name = `${item.firstname} ${item.lastname}`;
    facts.push(['Learner ID', item.pcode], ['Level', item.level], ['Tutor group', item.classcode], ['Tutor', item.tutorname]);
  } else if (item && kind === 'course') {
    name = item.title;
    facts.push(['Code', item.uic], ['Year', item.acyear], ['Qualification', item.qualification]);
  } else if (item && kind === 'class') {
    name = `${item.classcode}: ${item.title}`;
    facts.push(['Course', item.uic], ['Year', item.acyear], ['Staff', item.staffname]);
  }

  return (
    <div className="sp-page">
      <p className="sp-eyebrow">{k.title}</p>
      <h1 className="sp-page-title" tabIndex={-1} ref={headRef}>
        {name} {item && <StatusPill active={item.active} />}
      </h1>
      {facts.length > 0 && (
        <dl className="sp-facts">
          {facts.map(([label, v]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{v || '—'}</dd>
            </div>
          ))}
        </dl>
      )}
      <div className="sp-section sp-placeholder">
        <h2>Coming soon</h2>
        {kind === 'tool' ? (
          <p>{tool ? `${tool.blurb}. This page hasn't been built yet.` : `There is no tool called “${id}”.`}</p>
        ) : (
          <p>This page belongs to the {k.area}, which hasn't been upgraded yet.</p>
        )}
      </div>
    </div>
  );
}
