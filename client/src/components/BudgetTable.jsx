import { BUDGET_HEADS } from '../constants';

export default function BudgetTable({ budget, onChange }) {
  const numYears = budget.numYears || 1;

  function setNumYears(n) {
    const clamped = Math.min(15, Math.max(1, n));
    const rows = budget.rows.map(r => {
      const values = [...r.values];
      while (values.length < clamped) values.push(0);
      return { ...r, values: values.slice(0, clamped) };
    });
    onChange({ ...budget, numYears: clamped, rows });
  }
  function addRow() {
    onChange({ ...budget, rows: [...budget.rows, { head: BUDGET_HEADS[0], institute: '', values: Array(numYears).fill(0) }] });
  }
  function removeRow(idx) {
    onChange({ ...budget, rows: budget.rows.filter((_, i) => i !== idx) });
  }
  function updateHead(idx, val) {
    onChange({ ...budget, rows: budget.rows.map((r, i) => i === idx ? { ...r, head: val } : r) });
  }
  function updateInstitute(idx, val) {
    onChange({ ...budget, rows: budget.rows.map((r, i) => i === idx ? { ...r, institute: val } : r) });
  }
  function updateCell(idx, yearIdx, val) {
    onChange({
      ...budget,
      rows: budget.rows.map((r, i) => {
        if (i !== idx) return r;
        const values = [...r.values];
        values[yearIdx] = parseFloat(val) || 0;
        return { ...r, values };
      })
    });
  }

  const rowTotal = (r) => (r.values || []).reduce((a, b) => a + (Number(b) || 0), 0);
  const yearSums = Array(numYears).fill(0);
  budget.rows.forEach(r => { (r.values || []).forEach((v, y) => { yearSums[y] += Number(v) || 0; }); });
  const grandTotal = yearSums.reduce((a, b) => a + b, 0);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
        <span className="small muted">Budget Years (expand up to project duration):</span>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setNumYears(numYears - 1)}>− Year</button>
        <span className="mono small" style={{ minWidth: 70, textAlign: 'center', fontWeight: 600 }}>{numYears} year{numYears > 1 ? 's' : ''}</span>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setNumYears(numYears + 1)}>+ Year</button>
        <span style={{ flex: 1 }} />
        <button type="button" className="btn btn-ghost btn-sm" onClick={addRow}>+ Add Row</button>
      </div>
      <div className="small muted" style={{ marginBottom: 6 }}>Budget Sanction Details (₹ in Lakhs)</div>
      <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 8 }}>
        <table style={{ minWidth: 640 }}>
          <thead>
            <tr>
              <th style={{ minWidth: 220 }}>Expenditure Head</th>
              <th style={{ minWidth: 140 }}>Institute</th>
              {Array.from({ length: numYears }).map((_, y) => <th key={y} style={{ minWidth: 90 }}>Year {y + 1}</th>)}
              <th style={{ minWidth: 100 }}>Total (₹ Lakhs)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {budget.rows.map((row, idx) => (
              <tr key={idx}>
                <td>
                  <select style={{ width: '100%', padding: '6px 8px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12.5 }} value={row.head} onChange={e => updateHead(idx, e.target.value)}>
                    {BUDGET_HEADS.map(h => <option key={h} value={h}>{h}</option>)}
                    {!BUDGET_HEADS.includes(row.head) && <option value={row.head}>{row.head}</option>}
                  </select>
                </td>
                <td>
                  <input style={{ width: '100%', padding: '6px 8px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12.5 }} value={row.institute || ''} placeholder="Institute" onChange={e => updateInstitute(idx, e.target.value)} />
                </td>
                {Array.from({ length: numYears }).map((_, y) => (
                  <td key={y}>
                    <input type="number" step="0.01" style={{ width: '100%', padding: '6px 8px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12.5 }} value={row.values[y] ?? 0} onChange={e => updateCell(idx, y, e.target.value)} />
                  </td>
                ))}
                <td className="mono small" style={{ fontWeight: 600 }}>{rowTotal(row).toFixed(2)}</td>
                <td><button type="button" className="icon-btn" onClick={() => removeRow(idx)} title="Remove row">✕</button></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: 'var(--grey-bg)', fontWeight: 700 }}>
              <td>Grand Total</td>
              <td></td>
              {yearSums.map((s, y) => <td key={y} className="mono small">{s.toFixed(2)}</td>)}
              <td className="mono small">{grandTotal.toFixed(2)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="small muted" style={{ marginTop: 8 }}>Default rows cover the standard expenditure heads. Add extra rows if the same head needs to be split across more than one institute.</div>
    </div>
  );
}
