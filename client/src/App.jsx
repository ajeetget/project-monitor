import { useCallback, useEffect, useState } from "react";

import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import api, {
  ProjectsAPI,
  SettingsAPI,
} from "./api.js";

import DetailModal from "./components/DetailModal";
import ImportModal from "./components/ImportModal";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import Dashboard from "./pages/Dashboard";
import ProjectForm from "./pages/ProjectForm";
import ProjectsList from "./pages/ProjectList";
import Reports from "./pages/Reports.jsx";
import Verticals from "./pages/Verticals.jsx";

import { downloadTextFile } from "./utils";


/* =========================================================
   PAGE META
========================================================= */

const PAGE_META = {
  "/": {
    title: "Dashboard",
    sub: "Portfolio overview across all projects",
  },

  "/verticals": {
    title: "Verticals",
    sub: "Manage groupings used to categorise projects",
  },

  "/projects": {
    title: "Projects",
    sub: "All R&D projects tracked in this system",
  },

  "/projects/new": {
    title: "Add Project",
    sub: "Full project lifecycle details",
  },

  "/reports": {
    title: "Reports",
    sub: "Build a filtered, exportable project report",
  },
};


/* =========================================================
   PROJECT FORM WRAPPER
========================================================= */

function ProjectFormWrapper({
  projects,
  verticals,
  onDone,
  onCancel,
}) {
  const { id } = useParams();

  return (
    <ProjectForm
      projectId={id || null}
      projects={projects}
      verticals={verticals}
      onDone={onDone}
      onCancel={onCancel}
    />
  );
}


/* =========================================================
   MAIN LAYOUT
========================================================= */

function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();


  /* =======================================================
     STATE
  ======================================================= */

  const [projects, setProjects] = useState([]);

  const [verticals, setVerticals] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [importOpen, setImportOpen] =
    useState(false);

  const [banner, setBanner] =
    useState(null);


  /* =======================================================
     LOAD PROJECTS
  ======================================================= */

  const refreshProjects = useCallback(
    async () => {
      try {      

        const response =
          await ProjectsAPI.list();      
        let list = [];

        if (Array.isArray(response)) {
          list = response;
        } else if (
          Array.isArray(response?.data)
        ) {
          list = response.data;
        } else if (
          Array.isArray(response?.projects)
        ) {
          list = response.projects;
        }

        setProjects(list);

      } catch (error) {
        console.error(
          "❌ PROJECT LOAD ERROR:",
          error
        );
        setProjects([]);
        setBanner(
          "Could not reach the API server."
        );
      }
    },
    []
  );


  /* =======================================================
     LOAD VERTICALS
     
     IMPORTANT:
     Directly call Axios here instead of
     SettingsAPI.getVerticals().
  ======================================================= */

const refreshVerticals = useCallback(async () => {

  try {
    const response = await SettingsAPI.getVerticals();

    let verticalList = [];

    if (Array.isArray(response)) {
      verticalList = response;
    } else if (Array.isArray(response?.data)) {
      verticalList = response.data;
    } else if (Array.isArray(response?.verticals)) {
      verticalList = response.verticals;
    }

       setVerticals(verticalList);

  } catch (error) {
    console.error(
      "❌ VERTICAL API FAILED:",
      error
    );

    console.error(
      "❌ STATUS:",
      error?.response?.status
    );

    console.error(
      "❌ RESPONSE:",
      error?.response?.data
    );

    setVerticals([]);
  }

}, []);


  /* =======================================================
     LOAD EVERYTHING
  ======================================================= */

useEffect(() => {
  const loadInitialData = async () => {
       setLoading(true);

    try {
      await refreshProjects();
      await refreshVerticals();

    } catch (error) {
      console.error(
        "❌ INITIAL DATA ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  loadInitialData();
}, [
  refreshProjects,
  refreshVerticals,
]);


  /* =======================================================
     CURRENT PATH
  ======================================================= */

  const currentPath =
    location.pathname;


  /* =======================================================
     SIDEBAR ACTIVE VIEW
  ======================================================= */

  let activeView =
    "dashboard";

  if (
    currentPath.startsWith(
      "/verticals"
    )
  ) {
    activeView =
      "verticals";
  }

  else if (
    currentPath.startsWith(
      "/projects/new"
    ) ||
    currentPath.startsWith(
      "/projects/edit"
    )
  ) {
    activeView =
      "form";
  }

  else if (
    currentPath.startsWith(
      "/projects"
    )
  ) {
    activeView =
      "projects";
  }

  else if (
    currentPath.startsWith(
      "/reports"
    )
  ) {
    activeView =
      "reports";
  }


  /* =======================================================
     DETAIL PROJECT
  ======================================================= */

  const detailProjectId =
    searchParams.get(
      "project"
    );

  const detailProject =
    Array.isArray(projects)
      ? projects.find(
          (project) =>
            String(
              project?._id ||
              project?.id
            ) ===
            String(
              detailProjectId
            )
        ) || null
      : null;


  /* =======================================================
     NAVIGATION
  ======================================================= */

  function handleNavigate(view) {
    switch (view) {
      case "dashboard":
        navigate("/");
        break;

      case "verticals":
        navigate("/verticals");
        break;

      case "projects":
        navigate("/projects");
        break;

      case "form":
        navigate("/projects/new");
        break;

      case "reports":
        navigate("/reports");
        break;

      default:
        navigate("/");
    }
  }


  /* =======================================================
     NEW PROJECT
  ======================================================= */

  function openNewProject() {
    navigate(
      "/projects/new"
    );
  }


  /* =======================================================
     EDIT PROJECT
  ======================================================= */

  function openEditProject(id) {
    searchParams.delete(
      "project"
    );

    setSearchParams(
      searchParams
    );

    navigate(
      `/projects/edit/${id}`
    );
  }


  /* ===============  OPEN DETAIL ============= */

  function openDetail(project) {
    const id =
      project?._id ||
      project?.id;

    setSearchParams({
      project: id,
    });
  }


  /* ============  CLOSE DETAIL ==================== */

  function closeDetail() {
    searchParams.delete(
      "project"
    );

    setSearchParams(
      searchParams
    );
  }


  /* =======================================================
     BACKUP
  ======================================================= */

  async function handleBackup() {
    try {
      const data =
        await ProjectsAPI.exportBackup();

      downloadTextFile(
        `rd_projects_backup_${new Date()
          .toISOString()
          .slice(0, 10)}.json`,
        JSON.stringify(
          data,
          null,
          2
        ),
        "application/json"
      );
    } catch (error) {
      console.error(
        "Backup failed:",
        error
      );

      alert(
        "Could not create backup."
      );
    }
  }


  /* =======================================================
     RESTORE
  ======================================================= */

  async function handleRestore(
    file
  ) {
    if (!file) {
      return;
    }

    try {
      const text =
        await file.text();

      const parsed =
        JSON.parse(text);

      const projectsToRestore =
        Array.isArray(parsed)
          ? parsed
          : parsed.projects ||
            parsed.data ||
            [];

      const confirmed =
        window.confirm(
          `This will replace ALL ${projects.length} current project(s) in the database with ${projectsToRestore.length} project(s) from the backup file. Continue?`
        );

      if (!confirmed) {
        return;
      }

      await ProjectsAPI.restoreBackup(
        projectsToRestore
      );

      await refreshProjects();

      alert(
        "Backup restored successfully."
      );
    } catch (error) {
      console.error(
        "Restore failed:",
        error
      );

      alert(
        "Could not read that backup file."
      );
    }
  }


  /* =======================================================
     PAGE META
  ======================================================= */

  let meta =
    PAGE_META[
      currentPath
    ];

  if (!meta) {
    if (
      currentPath.startsWith(
        "/projects/edit"
      )
    ) {
      meta = {
        title:
          "Edit Project",
        sub:
          "Update existing project details",
      };
    } else {
      meta =
        PAGE_META["/"];
    }
  }


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div id="app">

      <Sidebar
        view={activeView}
        onNavigate={
          handleNavigate
        }
      />

      <div id="main">

        <Topbar
          title={meta.title}
          sub={meta.sub}
          search={search}
          onSearchChange={
            setSearch
          }
          onNewProject={
            openNewProject
          }
          onBackup={
            handleBackup
          }
          onRestore={
            handleRestore
          }
          onImport={() =>
            setImportOpen(true)
          }
        />


        {banner && (
          <div
            style={{
              display:
                "flex",
              alignItems:
                "center",
              gap: 10,
              background:
                "var(--red-bg)",
              color:
                "var(--red)",
              padding:
                "10px 26px",
              fontSize:
                12.5,
            }}
          >
            ⚠ {banner}

            <button
              className="btn btn-ghost btn-sm"
              style={{
                marginLeft:
                  "auto",
              }}
              onClick={() =>
                setBanner(null)
              }
            >
              Dismiss
            </button>
          </div>
        )}


        <div id="content">

          {loading ? (

            <div className="empty">

              <div className="big">
                ⏳
              </div>

              Loading…

            </div>

          ) : (

            <Routes>

              {/* =========================================
                  DASHBOARD
              ========================================= */}

              <Route
                path="/"
                element={
                  <Dashboard
                    projects={
                      projects
                    }
                    search={
                      search
                    }
                    onOpenDetail={
                      openDetail
                    }
                  />
                }
              />


              {/* =========================================
                  VERTICALS
              ========================================= */}

              <Route
                path="/verticals"
                element={
                  <Verticals
                    verticals={
                      verticals
                    }
                    setVerticals={
                      setVerticals
                    }
                    projects={
                      projects
                    }
                    onSave={
                      async (
                        list
                      ) => {

                        await SettingsAPI.saveVerticals(
                          list
                        );

                        await refreshVerticals();
                      }
                    }
                  />
                }
              />


              {/* =========================================
                  PROJECTS
              ========================================= */}

              <Route
                path="/projects"
                element={

                  <ProjectsList
                    projects={
                      projects
                    }

                    verticals={
                      verticals
                    }

                    search={
                      search
                    }

                    onOpenDetail={
                      openDetail
                    }

                    onEdit={
                      openEditProject
                    }

                    onRefresh={
                      refreshProjects
                    }
                  />

                }
              />


              {/* =========================================
                  NEW PROJECT
              ========================================= */}

              <Route
                path="/projects/new"
                element={
                  <ProjectFormWrapper
                    projects={
                      projects
                    }
                    verticals={
                      verticals
                    }
                    onDone={
                      async () => {

                        await refreshProjects();

                        navigate(
                          "/projects"
                        );
                      }
                    }
                    onCancel={() =>
                      navigate(
                        "/projects"
                      )
                    }
                  />
                }
              />


              {/* =========================================
                  EDIT PROJECT
              ========================================= */}

              <Route
                path="/projects/edit/:id"
                element={
                  <ProjectFormWrapper
                    projects={
                      projects
                    }
                    verticals={
                      verticals
                    }
                    onDone={
                      async () => {

                        await refreshProjects();

                        navigate(
                          "/projects"
                        );
                      }
                    }
                    onCancel={() =>
                      navigate(
                        "/projects"
                      )
                    }
                  />
                }
              />


              {/* =========================================
                  REPORTS
              ========================================= */}

              <Route
                path="/reports"
                element={
                  <Reports
                    projects={
                      projects
                    }
                    verticals={
                      verticals
                    }
                  />
                }
              />

            </Routes>

          )}

        </div>
      </div>


      {/* ===================================================
          DETAIL MODAL
      =================================================== */}

      {detailProject && (
        <DetailModal
          project={
            detailProject
          }
          onClose={
            closeDetail
          }
          onEdit={
            openEditProject
          }
        />
      )}


      {/* ===================================================
          IMPORT MODAL
      =================================================== */}

      {importOpen && (
        <ImportModal
          onClose={() =>
            setImportOpen(
              false
            )
          }
          onImported={
            async () => {

              await refreshProjects();

              setImportOpen(
                false
              );

              navigate(
                "/projects"
              );
            }
          }
        />
      )}

    </div>
  );
}


/* =========================================================
   APP
========================================================= */

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
}