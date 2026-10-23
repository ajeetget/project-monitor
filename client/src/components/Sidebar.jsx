
const NAV_ITEMS = [
  { key: 'dashboard', icon: '◆', label: 'Dashboard' },
  { key: 'verticals', icon: '▣', label: 'Verticals' },
  { key: 'projects', icon: '☰', label: 'Projects' },
  { key: 'form', icon: '＋', label: 'Add Project' },
  { key: 'reports', icon: '▤', label: 'Reports' }
];
import logo from "../../public/drdo-logo.png";

export default function Sidebar({ view, onNavigate }) {
  return (
    <div id="sidebar">
      <div className="brand">
        <img className="logo-pic" src={logo} />
        <div>
        <div className="brand-mark">R&amp;D MONITOR</div>
        <div className="brand-title">Project Governance Tracker</div>
        </div>
      </div>
      <nav>
        {NAV_ITEMS.map(item => (
          <div
            key={item.key}
            className={`nav-item${view === item.key ? ' active' : ''}`}
            onClick={() => onNavigate(item.key)}
          >
            <span className="nav-ico">{item.icon}</span> {item.label}
          </div>
        ))}
      </nav>
      <div className="sidebar-foot">
        Pre-TEC → TEC → RAB → GC → Sanction → Closure<br />
        Data stored in MongoDB via the Express API.
      </div>
    </div>
  );
}
