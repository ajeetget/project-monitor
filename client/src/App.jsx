import { useCallback, useEffect, useState } from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams
} from 'react-router-dom';
import { ProjectsAPI, SettingsAPI } from './api.js';
import DetailModal from './components/DetailModal';
import ImportModal from './components/ImportModal';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import ProjectForm from './pages/ProjectForm';
import ProjectsList from './pages/ProjectList';
import Reports from './pages/Reports.jsx';
import Verticals from './pages/Verticals.jsx';
import { downloadTextFile } from './utils';

const PAGE_META = {
  '/': { title: 'Dashboard', sub: 'Portfolio overview across all projects' },
  '/verticals': { title: 'Verticals', sub: 'Manage groupings used to categorise projects' },
  '/projects': { title: 'Projects', sub: 'All R&D projects tracked in this system' },
  '/projects/new': { title: 'Add Project', sub: 'Full project lifecycle details' },
  '/reports': { title: 'Reports', sub: 'Build a filtered, exportable project report' }
};

// Wrapper component to handle routing params for editing vs creating projects
function ProjectFormWrapper({ projects, verticals, onDone, onCancel }) {
  const { id } = useParams();
  
  return (
    <ProjectForm
      projectId={id ? parseInt(id, 10) : null}
      projects={projects}
      verticals={verticals}
      onDone={onDone}
      onCancel={onCancel}
    />
  );
}

function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [projects, setProjects] = useState([]);
  const [verticals, setVerticals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [importOpen, setImportOpen] = useState(false);
  const [banner, setBanner] = useState(null);

  const refreshProjects = useCallback(async () => {
    try {
      const data = await ProjectsAPI.list();
      // Safeguard: Ensure projects state is ALWAYS an array even if API returns an object
      const list = Array.isArray(data) 
        ? data 
        : (data?.projects || data?.data || []);
      setProjects(list);
    } catch (err) {
      setProjects([]);
      setBanner('Could not reach the API server. Is the backend running on the expected port?');
    }
  }, []);

  const refreshVerticals = useCallback(async () => {
    try {
      const data = await SettingsAPI.getVerticals();
      // Safeguard: Ensure verticals state is ALWAYS an array
      const list = Array.isArray(data) 
        ? data 
        : (data?.verticals || data?.data || []);
      setVerticals(list);
    } catch (err) {
      setVerticals([]);
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([refreshProjects(), refreshVerticals()]);
      setLoading(false);
    })();
  }, [refreshProjects, refreshVerticals]);

  // Map active URL path to Sidebar key
  const currentPath = location.pathname;
  let activeView = 'dashboard';
  if (currentPath.startsWith('/verticals')) activeView = 'verticals';
  else if (currentPath.startsWith('/projects/new') || currentPath.startsWith('/projects/edit')) activeView = 'form';
  else if (currentPath.startsWith('/projects')) activeView = 'projects';
  else if (currentPath.startsWith('/reports')) activeView = 'reports';

  // Detail Modal synced with `?project=ID` URL parameter + Array safety check
  const detailProjectId = searchParams.get('project');
  const detailProject = Array.isArray(projects) 
    ? projects.find(p => String(p.id) === String(detailProjectId)) || null
    : null;

  function handleNavigate(v) {
    switch (v) {
      case 'dashboard': navigate('/'); break;
      case 'verticals': navigate('/verticals'); break;
      case 'projects': navigate('/projects'); break;
      case 'form': navigate('/projects/new'); break;
      case 'reports': navigate('/reports'); break;
      default: navigate('/');
    }
  }

  function openNewProject() {
    navigate('/projects/new');
  }

  function openEditProject(id) {
    // Clear detail modal parameter if active
    searchParams.delete('project');
    setSearchParams(searchParams);
    navigate(`/projects/edit/${id}`);
  }

  function openDetail(project) {
    setSearchParams({ project: project.id });
  }

  function closeDetail() {
    searchParams.delete('project');
    setSearchParams(searchParams);
  }

  async function handleBackup() {
    const data = await ProjectsAPI.exportBackup();
    downloadTextFile(
      `rd_projects_backup_${new Date().toISOString().slice(0, 10)}.json`,
      JSON.stringify(data, null, 2),
      'application/json'
    );
  }

  async function handleRestore(file) {
    const text = await file.text();
    try {
      const parsed = JSON.parse(text);
      const projectsToRestore = Array.isArray(parsed) ? parsed : parsed.projects || [];
      if (!confirm(`This will replace ALL ${projects.length} current project(s) in the database with ${projectsToRestore.length} project(s) from the backup file. Continue?`)) return;
      await ProjectsAPI.restoreBackup(projectsToRestore);
      await refreshProjects();
      alert('Backup restored successfully.');
    } catch (err) {
      alert('Could not read that backup file. Please make sure it is a valid JSON export from this app.');
    }
  }

  // Set header titles based on current route
  let meta = PAGE_META[currentPath];
  if (!meta) {
    if (currentPath.startsWith('/projects/edit')) {
      meta = { title: 'Edit Project', sub: 'Update existing project details' };
    } else {
      meta = PAGE_META['/'];
    }
  }

  return (
    <div id="app">
      <Sidebar view={activeView} onNavigate={handleNavigate} />
      <div id="main">
        <Topbar
          title={meta.title}
          sub={meta.sub}
          search={search}
          onSearchChange={setSearch}
          onNewProject={openNewProject}
          onBackup={handleBackup}
          onRestore={handleRestore}
          onImport={() => setImportOpen(true)}
        />
        {banner && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--red-bg)', color: 'var(--red)', padding: '10px 26px', fontSize: 12.5 }}>
            ⚠ {banner}
            <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={() => setBanner(null)}>Dismiss</button>
          </div>
        )}
        <div id="content">
          {loading ? (
            <div className="empty"><div className="big">⏳</div>Loading…</div>
          ) : (
            <Routes>
              <Route path="/" element={<Dashboard projects={projects} search={search} onOpenDetail={openDetail} />} />
              <Route path="/verticals" element={
                <Verticals
                  verticals={verticals}
                  setVerticals={setVerticals}
                  projects={projects}
                  onSave={async (list) => { await SettingsAPI.saveVerticals(list); await refreshVerticals(); }}
                />
              } />
              <Route path="/projects" element={
                <ProjectsList
                  projects={projects}
                  verticals={verticals}
                  search={search}
                  onOpenDetail={openDetail}
                  onEdit={openEditProject}
                  onRefresh={refreshProjects}
                />
              } />
              <Route path="/projects/new" element={
                <ProjectFormWrapper
                  projects={projects}
                  verticals={verticals}
                  onDone={async () => { await refreshProjects(); navigate('/projects'); }}
                  onCancel={() => navigate('/projects')}
                />
              } />
              <Route path="/projects/edit/:id" element={
                <ProjectFormWrapper
                  projects={projects}
                  verticals={verticals}
                  onDone={async () => { await refreshProjects(); navigate('/projects'); }}
                  onCancel={() => navigate('/projects')}
                />
              } />
              <Route path="/reports" element={<Reports projects={projects} verticals={verticals} />} />
            </Routes>
          )}
        </div>
      </div>

      {detailProject && (
        <DetailModal project={detailProject} onClose={closeDetail} onEdit={openEditProject} />
      )}
      {importOpen && (
        <ImportModal
          onClose={() => setImportOpen(false)}
          onImported={async () => { await refreshProjects(); setImportOpen(false); navigate('/projects'); }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
}