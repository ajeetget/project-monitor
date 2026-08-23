import { stageDef } from '../constants';
import { fmtDate, getStage, localFileHref } from '../utils';

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid var(--border)', fontSize: 12.5 }}>
      <span className="muted">{label}</span>
      <span style={{ textAlign: 'right' }}>{value || <span className="muted">—</span>}</span>
    </div>
  );
}

function FileLink({ path, label }) {
  if (!path) return <span className="muted">—</span>;
  return <a className="link-pill" href={localFileHref(path)} target="_blank" rel="noreferrer" title={`${path} — opens only if this file exists at this path on your computer`}>{label || '📄 ' + path}</a>;
}

function MeetingTable({ rows, title }) {
  return (
    <>
      <div className="small muted" style={{ marginTop: 10, marginBottom: 4, fontWeight: 600 }}>{title}</div>
      <table style={{ marginBottom: 12 }}>
        <thead><tr><th>Type</th><th>Date</th><th>Minutes</th><th>Remarks</th></tr></thead>
        <tbody>
          {(rows || []).length === 0
            ? <tr><td colSpan={4} className="muted small">None logged.</td></tr>
            : rows.map((m, i) => (
              <tr key={i}><td className="small">{m.type}</td><td className="mono small">{fmtDate(m.date)}</td><td><FileLink path={m.minutes} /></td><td className="small">{m.remarks}</td></tr>
            ))}
        </tbody>
      </table>
    </>
  );
}

export default function DetailModal({ project: p, onClose, onEdit }) {
  const stage = getStage(p);
  const budget = p.budget || { numYears: 1, rows: [] };
  const yearSums = Array(budget.numYears || 1).fill(0);
  (budget.rows || []).forEach(r => (r.values || []).forEach((v, y) => yearSums[y] += Number(v) || 0));
  const grandTotal = yearSums.reduce((a, b) => a + b, 0);

  return (
    <div className="modal-bg active" onClick={onClose}>
      <div className="modal wide" onClick={e => e.stopPropagation()}>
        <span className="close-x" onClick={onClose}>×</span>
        <h2>{p.code} — {p.title}</h2>
        <div style={{ marginBottom: 14 }}>
          <span className={`badge ${stageDef(stage).color}`}>{stageDef(stage).label}</span>{' '}
          {p.vertical && <span className="badge stage-new">{p.vertical}</span>}
        </div>

        <div className="small muted" style={{ fontWeight: 600, marginBottom: 4 }}>Identity</div>
        <Row label="Lab" value={p.lab} />
        <Row label="PI" value={p.pi} />
        <Row label="PI Institute" value={p.instituteName} />
        <Row label="CO-PI(s)" value={p.scientists} />
        <Row label="Project Duration" value={p.projectDuration} />
        <Row label="Project Status" value={p.projectStatus} />

        <div className="small muted" style={{ fontWeight: 600, margin: '14px 0 4px' }}>Sanction &amp; Finance</div>
        <Row label="Sanction Date" value={fmtDate(p.sanctionDate)} />
        <Row label="Sanctioned Amount" value={p.sanctionAmount ? `₹${Number(p.sanctionAmount).toLocaleString('en-IN')}` : ''} />
        <Row label="Sanction Letter" value={<FileLink path={p.sanctionLetter} />} />
        <Row label="1st Fund Release Date" value={fmtDate(p.firstReleaseDate)} />

        <MeetingTable rows={p.preSanctionMeetings} title="Pre-Sanction Meetings" />
        <MeetingTable rows={p.postMeetings} title="Post-Sanction Meetings" />
        <MeetingTable rows={p.closureMeetings} title="Closure Meetings" />

        <div className="small muted" style={{ fontWeight: 600, margin: '14px 0 4px' }}>Deliverables / Milestones</div>
        <table style={{ marginBottom: 12 }}>
          <thead><tr><th>Description</th><th>Target Date</th><th>Status</th><th>Remarks</th></tr></thead>
          <tbody>
            {(p.deliverables || []).length === 0
              ? <tr><td colSpan={4} className="muted small">None logged.</td></tr>
              : p.deliverables.map((d, i) => (
                <tr key={i}><td className="small">{d.description}</td><td className="mono small">{fmtDate(d.targetDate)}</td><td><span className="badge stage-active">{d.status || 'Pending'}</span></td><td className="small">{d.remarks}</td></tr>
              ))}
          </tbody>
        </table>

        <div className="small muted" style={{ fontWeight: 600, margin: '14px 0 4px' }}>Manpower</div>
        <table style={{ marginBottom: 12 }}>
          <thead><tr><th>Category</th><th>Name</th><th>Designation</th><th>Specialisation</th></tr></thead>
          <tbody>
            {(p.manpower || []).length === 0
              ? <tr><td colSpan={4} className="muted small">None logged.</td></tr>
              : p.manpower.map((m, i) => (
                <tr key={i}><td><span className="badge stage-active">{m.category}</span></td><td className="small">{m.name}</td><td className="small">{m.designation}</td><td className="small">{m.specialisation}</td></tr>
              ))}
          </tbody>
        </table>

        <div className="small muted" style={{ fontWeight: 600, margin: '14px 0 4px' }}>Budget (₹ Lakhs)</div>
        <table style={{ marginBottom: 12, fontSize: 12 }}>
          <thead><tr><th>Head</th><th>Institute</th>{Array.from({ length: budget.numYears || 1 }).map((_, y) => <th key={y}>Year {y + 1}</th>)}<th>Total</th></tr></thead>
          <tbody>
            {(budget.rows || []).map((r, i) => (
              <tr key={i}>
                <td>{r.head}</td><td>{r.institute}</td>
                {(r.values || []).map((v, y) => <td key={y} className="mono">{Number(v || 0).toFixed(2)}</td>)}
                <td className="mono" style={{ fontWeight: 600 }}>{(r.values || []).reduce((a, b) => a + (Number(b) || 0), 0).toFixed(2)}</td>
              </tr>
            ))}
            <tr style={{ background: 'var(--grey-bg)', fontWeight: 700 }}>
              <td>Grand Total</td><td></td>
              {yearSums.map((s, y) => <td key={y} className="mono">{s.toFixed(2)}</td>)}
              <td className="mono">{grandTotal.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div className="small muted" style={{ fontWeight: 600, margin: '14px 0 4px' }}>Outcomes &amp; Dissemination</div>
        <Row label="Technologies Developed" value={p.technologiesDeveloped} />
        <Row label="Patents Given" value={p.patentsGiven} />
        <Row label="Patents Submitted" value={p.patentsSubmitted} />
        <Row label="Number of Publications" value={p.numPublications} />
        <Row label="Breakthrough Technology" value={p.breakthroughTech} />
        <Row label="Industries Involved" value={p.industriesInvolved} />

        <div className="small muted" style={{ fontWeight: 600, margin: '14px 0 4px' }}>Closure</div>
        <Row label="Technical Closure" value={fmtDate(p.techCloseDate)} />
        <Row label="Financial Closure" value={fmtDate(p.finCloseDate)} />
        <Row label="Administrative Closure" value={fmtDate(p.admCloseDate)} />
        <Row label="Final TRL" value={p.finalTRL} />

        <div className="small muted" style={{ fontWeight: 600, margin: '14px 0 4px' }}>Next Milestone</div>
        <Row label="Type" value={p.nmType} />
        <Row label="Date" value={fmtDate(p.nmDate)} />
        <Row label="Description" value={p.nmDesc} />

        <div className="small muted" style={{ fontWeight: 600, margin: '14px 0 4px' }}>General Remarks</div>
        <div className="small" style={{ marginBottom: 16 }}>{p.remarks || <span className="muted">—</span>}</div>

        <div className="form-actions">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={() => onEdit(p._id)}>Edit Project</button>
        </div>
      </div>
    </div>
  );
}
