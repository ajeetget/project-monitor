
// Generic repeatable-row editor used for meetings, deliverables, manpower,
// PDC extensions, and revised sanctions. `fields` describes each column.
// field: { key, type: 'text'|'date'|'number'|'select', options?: [], placeholder?, width? }
export default function RepeatableRows({ rows, fields, onChange, addLabel, emptyRow }) {
  function updateRow(idx, key, value) {
    const copy = rows.map((r, i) => i === idx ? { ...r, [key]: value } : r);
    onChange(copy);
  }
  function removeRow(idx) {
    onChange(rows.filter((_, i) => i !== idx));
  }
  function addRow() {
    onChange([...rows, { ...emptyRow }]);
  }

  const gridCols = fields.map(f => f.width || '1fr').join(' ') + ' 32px';

  return (
    <div>
      {rows.map((row, idx) => (
        <div className="msub-row" style={{ gridTemplateColumns: gridCols }} key={idx}>
          {fields.map(f => (
            f.type === 'select' ? (
              <select key={f.key} value={row[f.key] || ''} onChange={e => updateRow(idx, f.key, e.target.value)}>
                <option value="">—</option>
                {f.options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : (
              <input
                key={f.key}
                type={f.type || 'text'}
                placeholder={f.placeholder || ''}
                value={row[f.key] || ''}
                onChange={e => updateRow(idx, f.key, e.target.value)}
              />
            )
          ))}
          <button type="button" className="icon-btn" title="Remove row" onClick={() => removeRow(idx)}>✕</button>
        </div>
      ))}
      <button type="button" className="btn btn-ghost btn-sm" onClick={addRow}>{addLabel}</button>
    </div>
  );
}
