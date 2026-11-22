import { useMemo, useState } from 'react';
import { StatusPill } from './ui.jsx';

// The server is expected to cap results, but guard the DOM anyway.
export const ROW_LIMIT = 200;

/**
 * columns: [{ key, label, value(row) -> sortable string, render?(row), link?: true }]
 * The column marked `link` renders as an <a> to href(row); the whole row is clickable too.
 */
export default function ResultTable({ caption, rows, columns, href, defaultSort }) {
  const [sort, setSort] = useState(defaultSort);

  const sorted = useMemo(() => {
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return rows;
    const dir = sort.dir === 'desc' ? -1 : 1;
    // Active rows always come first; the chosen column orders within each group.
    return [...rows].sort((a, b) => (b.active - a.active) || dir * String(col.value(a)).localeCompare(String(col.value(b)), undefined, { numeric: true, sensitivity: 'base' }));
  }, [rows, columns, sort]);

  const shown = sorted.slice(0, ROW_LIMIT);

  const toggleSort = (key) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));

  return (
    <>
      <div className="sp-table-wrap">
        <table className="sp-table">
          <caption className="sp-sr">{caption}</caption>
          <thead>
            <tr>
              <th scope="col">Status</th>
              {columns.map((c) => (
                <th key={c.key} scope="col" aria-sort={sort.key === c.key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}>
                  <button type="button" className="sp-th-btn" onClick={() => toggleSort(c.key)}>
                    {c.label}
                    <span className="arr" aria-hidden="true">{sort.key === c.key ? (sort.dir === 'asc' ? '▲' : '▼') : ''}</span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => {
              const to = href(r);
              return (
                <tr
                  key={r.id}
                  className={r.active ? '' : 'inactive'}
                  onClick={(e) => {
                    if (e.target.closest('a')) return; // let the link handle itself
                    window.location.hash = to;
                  }}
                >
                  <td><StatusPill active={r.active} /></td>
                  {columns.map((c) => (
                    <td key={c.key} className={c.link ? 'primary' : undefined}>
                      {c.link ? <a href={to}>{c.render ? c.render(r) : c.value(r)}</a> : c.render ? c.render(r) : c.value(r)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {sorted.length > ROW_LIMIT && (
        <p className="sp-table-foot">
          Showing the first {ROW_LIMIT} of {sorted.length}. Keep typing to narrow the search.
        </p>
      )}
    </>
  );
}
