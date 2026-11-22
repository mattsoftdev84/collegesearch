import { useEffect, useState } from 'react';

export function useDebounced(value, ms) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

// ---- Hash routing ---------------------------------------------------------
// Routes live in the URL hash so nothing clashes with WebForms/IIS routing:
//   #/?mode=learners&q=smith&inactive=1   search page (state kept in the URL so
//                                         Back from another page restores it)
//   #/?mode=tools&q=dash                  Dashboards & Tools list (q filters it)
//   #/learner/<pcode>  #/course/<id>  #/class/<id>  #/tool/<id>   placeholder pages

const MODES = ['learners', 'courses', 'tools'];

export function parseHash(hash = window.location.hash) {
  const raw = hash.replace(/^#\/?/, '');
  const [path, qs = ''] = raw.split('?');
  const parts = path.split('/').filter(Boolean).map(decodeURIComponent);
  const params = new URLSearchParams(qs);
  if (parts.length >= 2 && ['learner', 'course', 'class', 'tool'].includes(parts[0])) {
    return { page: parts[0], id: parts.slice(1).join('/') };
  }
  const mode = params.get('mode');
  return {
    page: 'search',
    mode: MODES.includes(mode) ? mode : 'learners',
    q: params.get('q') || '',
    inactive: params.get('inactive') === '1',
  };
}

export function searchHash({ mode, q, inactive }) {
  const p = new URLSearchParams();
  if (mode && mode !== 'learners') p.set('mode', mode);
  if (q) p.set('q', q);
  if (inactive) p.set('inactive', '1');
  const s = p.toString();
  return '#/' + (s ? '?' + s : '');
}

export function detailHash(page, id) {
  return `#/${page}/${encodeURIComponent(id)}`;
}

export function useHashRoute() {
  const [route, setRoute] = useState(() => parseHash());
  useEffect(() => {
    const on = () => setRoute(parseHash());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

// ---- Safe storage (per-viewer conveniences only) ---------------------------
export function load(key, fallback) {
  try {
    const v = window.localStorage.getItem(key);
    return v == null ? fallback : v;
  } catch {
    return fallback;
  }
}
export function save(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}
