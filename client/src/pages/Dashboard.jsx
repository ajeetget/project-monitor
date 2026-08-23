
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip
} from 'chart.js';
import { useMemo } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { STAGE_DEFS } from '../constants.js';
import { fmtDate, fmtLakhs } from '../utils.js';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function daysUntil(dateStr) {
  if (!dateStr) return Infinity;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr);
  return Math.round((d - today) / 86400000);
}

// Helper to determine stage if not defined directly on the project object
function getStage(p) {
  if (p.stage) return p.stage;
  if (p.closed) return 'closed';
  if (p.sanctionDate && !p.firstReleaseDate) return 'sanctioned';
  return 'active';
}

export default function Dashboard({ projects = [], search = '', onOpenDetail }) {
  // 1. Single, safe filtered array
  const filtered = useMemo(() => {
    const list = Array.isArray(projects) ? projects : [];
    if (!search) return list;
    
    const q = search.toLowerCase();
    return list.filter(p =>
      (p.code || '').toLowerCase().includes(q) ||
      (p.title || '').toLowerCase().includes(q) ||
      (p.lab || '').toLowerCase().includes(q) ||
      (p.pi || '').toLowerCase().includes(q) ||
      (p.scientists || '').toLowerCase().includes(q)
    );
  }, [projects, search]);

  // 2. Compute stage metadata for each filtered project
  const withStage = useMemo(() => {
    return filtered.map(p => ({ ...p, __stage: getStage(p) }));
  }, [filtered]);

  // 3. Compute KPIs safely
  const kpis = useMemo(() => {
    const total = withStage.length;
    const active = withStage.filter(p => p.__stage === 'active').length;
    const sanctioned = withStage.filter(p => p.__stage === 'sanctioned').length;
    const closed = withStage.filter(p => p.__stage === 'closed').length;
    const totalSanctioned = withStage.reduce((s, p) => s + (Number(p.sanctionAmount) || 0), 0);
    const overdue = withStage.filter(p => p.nmDate && daysUntil(p.nmDate) < 0 && p.__stage !== 'closed').length;
    return [
      { label: 'Total Projects', num: total, cls: 'navy' },
      { label: 'Active / Ongoing', num: active, cls: '' },
      { label: 'Sanctioned (Pending)', num: sanctioned, cls: 'amber' },
      { label: 'Fully Closed', num: closed, cls: 'green' },
      { label: 'Overdue Milestones', num: overdue, cls: 'red' },
      { label: 'Total Sanctioned (₹)', num: fmtLakhs(totalSanctioned), cls: 'navy', small: true }
    ];
  }, [withStage]);

  const stageChartData = useMemo(() => {
    const counts = {};
    STAGE_DEFS.forEach(s => counts[s.key] = 0);
    withStage.forEach(p => {
      if (counts[p.__stage] !== undefined) counts[p.__stage]++;
    });
    return {
      labels: STAGE_DEFS.map(s => s.label),
      datasets: [{
        data: STAGE_DEFS.map(s => counts[s.key] || 0),
        backgroundColor: ['#B9C2CE', '#2C5CB0', '#C97A1A', '#2C5CB0', '#6A3FB5', '#6A3FB5', '#28825A']
      }]
    };
  }, [withStage]);

  const verticalChartData = useMemo(() => {
    const counts = {};
    withStage.forEach(p => {
      const v = p.vertical || 'Unassigned';
      counts[v] = (counts[v] || 0) + 1;
    });
    const labels = Object.keys(counts);
    return {
      labels,
      datasets: [{ data: labels.map(l => counts[l]), backgroundColor: '#0E7C86' }]
    };
  }, [withStage]);

  const labChartData = useMemo(() => {
    const counts = {};
    withStage.forEach(p => {
      const l = p.lab || 'Unassigned';
      counts[l] = (counts[l] || 0) + 1;
    });
    const labels = Object.keys(counts);
    return {
      labels,
      datasets: [{ data: labels.map(l => counts[l]), backgroundColor: '#2b4467' }]
    };
  }, [withStage]);

  const yearChartData = useMemo(() => {
    const counts = {};
    withStage.forEach(p => {
      if (!p.sanctionDate) return;
      const y = new Date(p.sanctionDate).getFullYear();
      if (isNaN(y)) return;
      counts[y] = (counts[y] || 0) + (Number(p.sanctionAmount) || 0);
    });
    const labels = Object.keys(counts).sort();
    return {
      labels,
      datasets: [{ label: 'Sanctioned Amount (₹)', data: labels.map(y => counts[y]), backgroundColor: '#C97A1A' }]
    };
  }, [withStage]);

  const alerts = useMemo(() => {
    return withStage.filter(p => {
      if (p.__stage === 'closed') return false;
      if (p.nmDate && daysUntil(p.nmDate) < 0) return true;
      if (p.__stage === 'sanctioned' && !p.firstReleaseDate) return true;
      return false;
    }).slice(0, 8);
  }, [withStage]);

  const upcoming = useMemo(() => {
    return withStage
      .filter(p => p.nmDate && daysUntil(p.nmDate) >= 0 && daysUntil(p.nmDate) <= 45)
      .sort((a, b) => new Date(a.nmDate) - new Date(b.nmDate))
      .slice(0, 8);
  }, [withStage]);

  const barOpts = { responsive: true, plugins: { legend: { display: false } }, indexAxis: 'y' };

  return (
    <div>
      <div className="kpi-grid">
        {kpis.map((k, i) => (
          <div className={`kpi ${k.cls}`} key={i}>
            <div className="num" style={{ fontSize: k.small ? 18 : 26 }}>{k.num}</div>
            <div className="lbl">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="grid2">
        <div className="panel">
          <h3>Projects by Stage <span className="tag">{withStage.length} total</span></h3>
          <Pie data={stageChartData} />
        </div>
        <div className="panel">
          <h3>Projects by Vertical</h3>
          <Bar data={verticalChartData} options={barOpts} />
        </div>
      </div>

      <div className="grid2">
        <div className="panel">
          <h3>⚠ Action Needed <span className="tag">{alerts.length} item(s)</span></h3>
          {alerts.length === 0 ? <div className="muted small">Nothing needs attention right now.</div> : (
            alerts.map(p => (
              <div key={p._id || p.code} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => onOpenDetail && onOpenDetail(p)}>
                <div>
                  <span className="proj-code">{p.code}</span> <span className="proj-title small">{p.title}</span>
                </div>
                <span className="badge alert-hot">Needs action</span>
              </div>
            ))
          )}
        </div>
        <div className="panel">
          <h3>📅 Upcoming Milestones (next 45 days)</h3>
          {upcoming.length === 0 ? <div className="muted small">No milestones in this window.</div> : (
            upcoming.map(p => (
              <div key={p._id || p.code} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => onOpenDetail && onOpenDetail(p)}>
                <div>
                  <span className="proj-code">{p.code}</span> <span className="small muted">{p.nmType || 'Milestone'}</span>
                </div>
                <span className="mono small">{fmtDate(p.nmDate)}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid2">
        <div className="panel">
          <h3>Projects by Stakeholding Lab</h3>
          <Bar data={labChartData} options={barOpts} />
        </div>
        <div className="panel">
          <h3>Sanctions by Year (₹)</h3>
          <Bar data={yearChartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
      </div>
    </div>
  );
}