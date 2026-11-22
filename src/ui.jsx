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
