// "Dashboards & Tools": quick links to other parts of the site.
//
// The list lives in mainmenu-tools.json, loaded at runtime from the SAME folder
// as mainmenu.js (library/js/mainmenu/ in the main project, deploy/ in the
// preview), so links can be edited on the server without rebuilding.
//
// Each entry: { "title": "...", "description": "...", "icon": "...", "link": "..." }
//   icon: a name from the built-in set (open #/icons to see them all)
//   link: the page to open, relative to MainMenuB.aspx. Leave "" for a
//         "coming soon" placeholder page.
import { useEffect, useState } from 'react';

// Captured while mainmenu.js is first running: document.currentScript is only
// set during that initial run.
const scriptSrc = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : '';
export const TOOLS_FILE = 'mainmenu-tools.json';
const toolsUrl = () => new URL(TOOLS_FILE, scriptSrc || window.location.href).href;

const str = (v) => (v == null ? '' : String(v).trim());

const slug = (s) =>
  s.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'tool';

// Tidy what came from the file: skip entries without a title, give each a
// unique id for its #/tool/<id> placeholder page.
function normalise(data) {
  if (!Array.isArray(data)) throw new Error(`${TOOLS_FILE} should contain a list: [ { ... }, { ... } ]`);
  const used = new Set();
  const out = [];
  for (const t of data) {
    if (!t || typeof t !== 'object') continue;
    const title = str(t.title);
    if (!title) continue;
    let id = slug(title);
    for (let n = 2; used.has(id); n++) id = `${slug(title)}-${n}`;
    used.add(id);
    out.push({ id, title, description: str(t.description), icon: str(t.icon), link: str(t.link) });
  }
  return out;
}

// Loaded once per page view and shared. 'no-cache' makes the browser check the
// server each time, so edits to the JSON show up on the next page load.
let pending = null;
export function loadTools() {
  if (!pending) {
    pending = fetch(toolsUrl(), { cache: 'no-cache', credentials: 'same-origin' })
      .then((res) => {
        if (!res.ok) throw new Error(`${TOOLS_FILE}: ${res.status} ${res.statusText}`);
        return res.text();
      })
      .then((text) => {
        try {
          return JSON.parse(text.replace(/^﻿/, '')); // tolerate a byte-order mark
        } catch (e) {
          throw new Error(`${TOOLS_FILE} isn't valid JSON (check for a missing or extra comma): ${e.message}`);
        }
      })
      .then(normalise)
      .catch((err) => {
        pending = null; // allow "Try again"
        throw err;
      });
  }
  return pending;
}

// { status: 'loading' | 'done' | 'error', tools, error, retry }
export function useTools(enabled = true) {
  const [state, setState] = useState({ status: 'loading', tools: [] });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    let live = true;
    loadTools().then(
      (tools) => live && setState({ status: 'done', tools }),
      (err) => live && setState({ status: 'error', tools: [], error: err.message || String(err) })
    );
    return () => {
      live = false;
    };
  }, [enabled, attempt]);
  return { ...state, retry: () => (setState({ status: 'loading', tools: [] }), setAttempt((n) => n + 1)) };
}

// Every typed word must appear in the title or description (same rule as the server search).
export function filterTools(tools, q) {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return tools;
  return tools.filter((t) => {
    const hay = (t.title + ' ' + t.description).toLowerCase();
    return words.every((w) => hay.includes(w));
  });
}
