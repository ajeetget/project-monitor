
import { useMemo, useState } from 'react';
import { ProjectsAPI } from '../api.js';
import { STAGE_DEFS } from '../constants.js';
import { fmtLakhs, getStage } from '../utils.js';

export default function ProjectsList({
  projects = [],
  verticals = [],
  search = '',
  onOpenDetail,
  onEdit,
  onRefresh
}) {
  const [stageFilter, setStageFilter] = useState('');
  const [verticalFilter, setVerticalFilter] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  // 1. Safely normalize projects into an array
  const safeProjects = Array.isArray(projects)
    ? projects
    : (projects?.projects || projects?.data || []);

  const safeVerticals = Array.isArray(verticals) ? verticals : [];

  // 2. Compute stages safely
  const withStage = useMemo(() => {
    return safeProjects.map(p => ({
      ...p,
      __stage: typeof getStage === 'function' ? getStage(p) : (p.stage || 'active')
    }));
  }, [safeProjects]);

  // 3. Filter projects based on search and selected dropdowns
  const filtered = useMemo(() => {
    return withStage.filter(p => {
      if (stageFilter && p.__stage !== stageFilter) return false;
      if (verticalFilter && (p.vertical || 'Unassigned') !== verticalFilter) return false;

      if (!search) return true;
      const q = search.toLowerCase();
      return (
        (p.code || '').toLowerCase().includes(q) ||
        (p.title || '').toLowerCase().includes(q) ||
        (p.lab || '').toLowerCase().includes(q) ||
        (p.pi || '').toLowerCase().includes(q) ||
        (p.scientists || '').toLowerCase().includes(q)
      );
    });
  }, [withStage, search, stageFilter, verticalFilter]);

  // 4. Handle project deletion
  async function handleDelete(e, id) {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this project?')) return;
    setDeletingId(id);
    try {
      await ProjectsAPI.delete(id);
      if (onRefresh) await onRefresh();
    } catch (err) {
      alert('Failed to delete project.');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <h3>Projects <span className="tag">{filtered.length} shown</span></h3>

        <div style={{ display: 'flex', gap: 10 }}>
          <select value={stageFilter} onChange={e => setStageFilter(e.target.value)}>
            <option value="">All Stages</option>
            {STAGE_DEFS.map(s => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>

          <select value={verticalFilter} onChange={e => setVerticalFilter(e.target.value)}>
            <option value="">All Verticals</option>
            {safeVerticals.map((v, i) => (
              <option key={i} value={v}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          <div className="big">🔍</div>
          No projects found matching your criteria.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Title</th>
                <th>Lab</th>
                <th>Vertical</th>
                <th>Stage</th>
                <th>Sanctioned</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const id = p._id || p.id;
                return (
                  <tr key={id || p.code} onClick={() => onOpenDetail && onOpenDetail(p)} style={{ cursor: 'pointer' }}>
                    <td className="proj-code">{p.code}</td>
                    <td>
                      <div className="proj-title">{p.title}</div>
                      <div className="small muted">{p.pi ? `PI: ${p.pi}` : ''}</div>
                    </td>
                    <td>{p.lab || '—'}</td>
                    <td><span className="badge">{p.vertical || 'Unassigned'}</span></td>
                    <td>
                      <span className={`badge stage-${p.__stage}`}>
                        {STAGE_DEFS.find(s => s.key === p.__stage)?.label || p.__stage}
                      </span>
                    </td>
                    <td className="mono">{p.sanctionAmount ? fmtLakhs(p.sanctionAmount) : '—'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={(e) => { e.stopPropagation(); onEdit && onEdit(id); }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-ghost btn-sm red"
                        disabled={deletingId === id}
                        onClick={(e) => handleDelete(e, id)}
                      >
                        {deletingId === id ? '...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}