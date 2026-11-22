// Small shared UI pieces. Every <button> is type="button": the page sits inside
// the WebForms <form runat="server">, and a default (submit) button would post back.

// Icons come from Lucide (https://lucide.dev/icons), bundled in mainmenu-vendor.js.
// Use the name shown on that site, e.g. "layout-dashboard" or "calendar-days".
// PascalCase ("LayoutDashboard") works too.
import { createElement } from 'react';
import { icons } from 'lucide';

// "layout-dashboard" / "layout_dashboard" / "LayoutDashboard" -> "LayoutDashboard"
const toKey = (name) => String(name || '').trim().replace(/(^|[-_\s]+)([a-z0-9])/gi, (_, sep, c) => c.toUpperCase());

// Shown when a name in mainmenu-tools.json isn't a Lucide icon.
export const FALLBACK_ICON = 'layout-grid';

export const hasIcon = (name) => Object.prototype.hasOwnProperty.call(icons, toKey(name));

export function Icon({ name, size = 18 }) {
  const node = hasIcon(name) ? icons[toKey(name)] : null; // [[tag, attrs], ...]
  if (!node) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {node.map(([tag, attrs], i) => createElement(tag, { key: i, ...attrs }))}
    </svg>
  );
}

export function StatusPill({ active }) {
  return <span className={'sp-status ' + (active ? 'on' : 'off')}>{active ? 'Active' : 'Inactive'}</span>;
}

export function Switch({ checked, onChange, children }) {
  return (
    <button type="button" role="switch" aria-checked={checked} className={'sp-switch' + (checked ? ' on' : '')} onClick={() => onChange(!checked)}>
      <span className="track" aria-hidden="true"><span className="thumb" /></span>
      <span>{children}</span>
    </button>
  );
}

export function Spinner({ label = 'Loading' }) {
  return <span className="sp-spinner" role="status" aria-label={label} />;
}
