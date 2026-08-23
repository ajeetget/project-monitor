
import { useMemo } from 'react';
import { STAGE_DEFS } from '../constants.js';
import { fmtLakhs, getStage } from '../utils.js';

export default function Reports({ projects = [], verticals = [] }) {
  // 1. Safely normalize arrays to prevent crashes if props are null/undefined/objects
  const safeProjects = Array.isArray(projects)
    ? projects
    : (projects?.projects || projects?.data || []);

  const safeVerticals = Array.isArray(verticals) ? verticals : [];

  // 2. Compute aggregated metrics safely
  const metrics = useMemo(() => {
    let totalSanctioned = 0;
    const stageCounts = {};
    const verticalCounts = {};

    // Initialize stage counters
    STAGE_DEFS.forEach(s => {
      stageCounts[s.key] = 0;
    });

    // Initialize vertical counters
    safeVerticals.forEach(v => {
      verticalCounts[v] = { total: 0, amount: 0 };
    });
    verticalCounts['Unassigned'] = { total: 0, amount: 0 };

    // Process projects
    safeProjects.forEach(p => {
      if (!p) return;

      const amt = Number(p.sanctionAmount) || 0;
      totalSanctioned += amt;

      // Stage breakdown
      const stage = typeof getStage === 'function' ? getStage(p) : (p.stage || 'proposal');
      if (stageCounts[stage] !== undefined) {
        stageCounts[stage]++;
      } else {
        stageCounts[stage] = 1;
      }

      // Vertical breakdown
      const vert = p.vertical || 'Unassigned';
      if (!verticalCounts[vert]) {
        verticalCounts[vert] = { total: 0, amount: 0 };
      }
      verticalCounts[vert].total++;
      verticalCounts[vert].amount += amt;
    });

    return {
      totalProjects: safeProjects.length,
      totalSanctioned,
      stageCounts,
      verticalCounts
    };
  }, [safeProjects, safeVerticals]);

  return (
    <div>
      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 20 }}>
        <div className="panel">
          <div className="small muted">Total Projects</div>
          <div style={{ fontSize: 24, fontWeight: 'bold', marginTop: 4 }}>{metrics.totalProjects}</div>
        </div>
        <div className="panel">
          <div className="small muted">Total Sanctioned Value</div>
          <div style={{ fontSize: 24, fontWeight: 'bold', marginTop: 4, color: 'var(--primary, #0066cc)' }}>
            {fmtLakhs(metrics.totalSanctioned)}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
        {/* Breakdown by Stage */}
        <div className="panel">
          <h3>Projects by Stage</h3>
          <div className="table-responsive" style={{ marginTop: 12 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Stage</th>
                  <th style={{ textAlign: 'right' }}>Count</th>
                  <th style={{ textAlign: 'right' }}>Share</th>
                </tr>
              </thead>
              <tbody>
                {STAGE_DEFS.map(s => {
                  const count = metrics.stageCounts[s.key] || 0;
                  const pct = metrics.totalProjects > 0
                    ? ((count / metrics.totalProjects) * 100).toFixed(1)
                    : 0;
                  return (
                    <tr key={s.key}>
                      <td>
                        <span className={`badge stage-${s.key}`}>{s.label}</span>
                      </td>
                      <td className="mono" style={{ textAlign: 'right' }}>{count}</td>
                      <td className="mono muted" style={{ textAlign: 'right' }}>{pct}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Breakdown by Vertical */}
        <div className="panel">
          <h3>Projects by Vertical</h3>
          <div className="table-responsive" style={{ marginTop: 12 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Vertical</th>
                  <th style={{ textAlign: 'right' }}>Count</th>
                  <th style={{ textAlign: 'right' }}>Total Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(metrics.verticalCounts).map(([vert, data]) => (
                  <tr key={vert}>
                    <td><b>{vert}</b></td>
                    <td className="mono" style={{ textAlign: 'right' }}>{data.total}</td>
                    <td className="mono" style={{ textAlign: 'right' }}>{fmtLakhs(data.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}