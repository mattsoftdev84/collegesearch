// Small shared UI pieces. Every <button> is type="button": the page sits inside
// the WebForms <form runat="server">, and a default (submit) button would post back.

export function Icon({ name, size = 18 }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: 'false' };
  switch (name) {
    case 'search':
      return <svg {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>;
    case 'x':
      return <svg {...p}><path d="M18 6 6 18M6 6l12 12" /></svg>;
    case 'sun':
      return <svg {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>;
    case 'moon':
      return <svg {...p}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>;
    case 'back':
      return <svg {...p}><path d="M19 12H5M12 19l-7-7 7-7" /></svg>;
    case 'user':
      return <svg {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>;
    case 'book':
      return <svg {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z" /><path d="M4 19.5V21h16" /></svg>;
    case 'grid':
      return <svg {...p}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>;
    case 'gauge':
      return <svg {...p}><path d="M3.5 17a9 9 0 1 1 17 0" /><path d="m12 13 4-5" /><circle cx="12" cy="13" r="1.2" /></svg>;
    case 'users':
      return <svg {...p}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14a6.5 6.5 0 0 1 3.5 6" /></svg>;
    case 'clipboard':
      return <svg {...p}><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4V3h6v1M9 11h6M9 15h4" /></svg>;
    case 'check':
      return <svg {...p}><rect x="3" y="3" width="18" height="18" rx="3" /><path d="m8 12 3 3 5-6" /></svg>;
    case 'calendar':
      return <svg {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>;
    case 'shield':
      return <svg {...p}><path d="M12 3 4 6v6c0 4.5 3.4 8.2 8 9 4.6-.8 8-4.5 8-9V6z" /><path d="m9 12 2 2 4-4" /></svg>;
    case 'home':
      return <svg {...p}><path d="M3 11 12 4l9 7" /><path d="M5 10v10h14V10" /><path d="M10 20v-5h4v5" /></svg>;
    case 'layers':
      return <svg {...p}><path d="m12 3 9 5-9 5-9-5z" /><path d="m3 13 9 5 9-5" /></svg>;
    case 'arrow':
      return <svg {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
    default:
      return null;
  }
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
