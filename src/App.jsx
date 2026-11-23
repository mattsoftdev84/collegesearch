import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { load, save, useHashRoute } from './hooks.js';
import SearchPage, { known } from './SearchPage.jsx';
import { reloadPage, useKeepAlive, useSessionExpired } from './session.js';
import { useTools } from './tools.js';
import { FALLBACK_ICON, hasIcon, Icon, Spinner, StatusPill } from './ui.jsx';

const THEME_KEY = 'sapien-theme';

function initialTheme() {
  const saved = load(THEME_KEY, null);
  if (saved === 'dark' || saved === 'light') return saved;
  return 'dark'; // dark by default; the toggle remembers a choice of light
}

export default function App({ rootEl }) {
  const route = useHashRoute();
  const [theme, setTheme] = useState(initialTheme);
  const lastSearch = useRef('#/');
  const searchScroll = useRef(0);
  const prevPage = useRef(route.page);
  const expired = useSessionExpired();
  useKeepAlive();

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
            <Icon name="arrow-left" size={16} /> Back to search
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

      {expired && (
        <div className="sp-error sp-expired" role="alert">
          <span>
            <Icon name="clock-exclamation-point" size={16} /> Your session has expired. Reload the page to carry on; your search will be kept.
          </span>
          <button type="button" className="sp-btn small" onClick={reloadPage}>
            <Icon name="rotate-cw" size={16} /> Reload
          </button>
        </div>
      )}

      <SearchPage route={route} hidden={route.page !== 'search'} />
      {route.page === 'icons' && <IconGallery />}
      {route.page !== 'search' && route.page !== 'icons' && <Placeholder kind={route.page} id={route.id} />}
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
  const toolList = useTools(kind === 'tool');
  const tool = kind === 'tool' ? toolList.tools.find((t) => t.id === id) : null;
  const k = KINDS[kind];
  const headRef = useRef(null);
  useEffect(() => {
    headRef.current && headRef.current.focus();
  }, [kind, id]);

  let name = id;
  const facts = [];
  if (kind === 'tool') {
    name = tool ? tool.title : toolList.status === 'loading' ? 'Loading…' : 'Unknown tool';
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
          <p>
            {toolList.status === 'loading' ? (
              <Spinner />
            ) : tool ? (
              <>{tool.description && <>{tool.description.replace(/\.$/, '')}. </>}This page hasn't been built yet.</>
            ) : (
              `There is no tool called “${id}”.`
            )}
          </p>
        ) : (
          <p>This page belongs to the {k.area}, which hasn't been upgraded yet.</p>
        )}
      </div>
    </div>
  );
}

// #/icons: checks the icon names in mainmenu-tools.json, and lets you try others.
function IconGallery() {
  const toolList = useTools(true);
  const [name, setName] = useState('');
  const n = name.trim();
  return (
    <div className="sp-page">
      <p className="sp-eyebrow">Dashboards &amp; Tools</p>
      <h1 className="sp-page-title">Icons</h1>
      <p className="sp-page-intro">
        Icons come from <a href="https://lucide.dev/icons" target="_blank" rel="noopener noreferrer">Lucide</a>. Find one there and use its
        name as <code>"icon"</code> in <code>mainmenu-tools.json</code>, e.g. <code>layout-dashboard</code>. A name that isn't found
        shows <code>{FALLBACK_ICON}</code>.
      </p>

      <label className="sp-icon-try">
        <span>Try a name</span>
        <input
          type="text"
          value={name}
          placeholder="e.g. calendar-days"
          spellCheck="false"
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
        />
        {n && (hasIcon(n) ? (
          <span className="sp-icon-ok"><Icon name={n} size={22} /> Found</span>
        ) : (
          <span className="sp-icon-bad">Not a Lucide icon</span>
        ))}
      </label>

      <h2 className="sp-icon-h">In mainmenu-tools.json</h2>
      {toolList.status === 'loading' ? (
        <Spinner />
      ) : toolList.status === 'error' ? (
        <p className="sp-icon-bad">{toolList.error}</p>
      ) : (
        <ul className="sp-icon-grid">
          {toolList.tools.map((t) => (
            <li key={t.id}>
              <span className="sp-tool-icon"><Icon name={hasIcon(t.icon) ? t.icon : FALLBACK_ICON} size={20} /></span>
              <span>
                <b>{t.title}</b>
                <br />
                <code>{t.icon || '(none)'}</code>
                {!hasIcon(t.icon) && <span className="sp-icon-bad"> not found</span>}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
