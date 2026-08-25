import { useMemo, useState } from "react";
import { ProjectsAPI } from "../api.js";
import { STAGE_DEFS } from "../constants.js";
import { fmtLakhs, getStage } from "../utils.js";

export default function ProjectsList({
  projects = [],
  verticals = [],
  search = "",
  onOpenDetail,
  onEdit,
  onRefresh,
}) {
  const [stageFilter, setStageFilter] = useState("");
  const [verticalFilter, setVerticalFilter] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  /* =========================================================
     1. PROJECTS
  ========================================================= */

  const safeProjects = Array.isArray(projects)
    ? projects
    : [];

  const safeVerticals = Array.isArray(verticals)
    ? verticals
    : [];

  const verticalMap = useMemo(() => {
    const map = {};

    safeVerticals.forEach((vertical) => {
      if (vertical?._id) {
        map[String(vertical._id)] =
          vertical.name || "Unnamed";
      }
    });

    return map;
  }, [safeVerticals]);

  console.log(
    "VERTICAL MAP:",
    verticalMap
  );

  /* =========================================================
     4. ADD VERTICAL NAME + STAGE TO PROJECT
  ========================================================= */

  const projectsWithDetails = useMemo(() => {
    return safeProjects.map((project) => {

      const verticalName =
        verticalMap[
          String(project.verticalId)
        ] || "Unassigned";

      const stage =
        typeof getStage === "function"
          ? getStage(project)
          : project.stage || "active";

      return {
        ...project,

        __vertical: verticalName,

        __stage: stage,
      };
    });
  }, [
    safeProjects,
    verticalMap,
  ]);

  /* =============== 5. FILTER PROJECTS =================== */

  const filteredProjects = useMemo(() => {
    const query =
      search
        .trim()
        .toLowerCase();

    return projectsWithDetails.filter(
      (project) => {

    /* -------------- Stage filter ---------------- */

        if (
          stageFilter &&
          project.__stage !== stageFilter
        ) {
          return false;
        }

        /* ------------- Vertical filter ----------------- */

        if (
          verticalFilter &&
          project.__vertical !== verticalFilter
        ) {
          return false;
        }

      /* --------------  Search ------------------- */

        if (!query) {
          return true;
        }

        return (
          String(project.code || "")
            .toLowerCase()
            .includes(query) ||

          String(project.title || "")
            .toLowerCase()
            .includes(query) ||

          String(
            project.stakeholdingDrdoLabs || ""
          )
            .toLowerCase()
            .includes(query) ||

          String(project.piName || "")
            .toLowerCase()
            .includes(query) ||

          String(
            project.stakeholdingScientist || ""
          )
            .toLowerCase()
            .includes(query) ||

          String(project.__vertical || "")
            .toLowerCase()
            .includes(query)
        );
      }
    );
  }, [
    projectsWithDetails,
    search,
    stageFilter,
    verticalFilter,
  ]);

  /* ==================  6. DELETE PROJECT ================== */

  async function handleDelete(event, id) {
    event.stopPropagation();

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this project?"
      );

    if (!confirmed) {
      return;
    }

    setDeletingId(id);

    try {
      await ProjectsAPI.remove(id);

      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error(
        "Failed to delete project:",
        error
      );

      alert(
        "Failed to delete project."
      );
    } finally {
      setDeletingId(null);
    }
  }

  /* =====================   7. EDIT PROJECT ================= */

  function handleEdit(event, id) {
    event.stopPropagation();

    if (onEdit) {
      onEdit(id);
    }
  }

  /* =================  8. OPEN PROJECT DETAIL ============= */

  function handleOpenDetail(project) {
    if (onOpenDetail) {
      onOpenDetail(project);
    }
  }

  /* ======================  9. RENDER ================= */

  return (
    <div className="panel">

      {/* ================  HEADER ===================== */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          flexWrap: "wrap",
          gap: 10,
        }}
      >

        <h3>
          Projects{" "}

          <span className="tag">
            {filteredProjects.length} shown
          </span>
        </h3>

        {/* ==================  FILTERS ====================== */}

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >

          {/* ---------------- STAGE FILTER ---------------- */}

          <select
            value={stageFilter}
            onChange={(event) =>
              setStageFilter(
                event.target.value
              )
            }
          >

            <option value="">
              All Stages
            </option>

            {STAGE_DEFS.map(
              (stage) => (
                <option
                  key={stage.key}
                  value={stage.key}
                >
                  {stage.label}
                </option>
              )
            )}

          </select>

      {/* -----VERTICAL FILTER  SAME STRUCTURE AS ProjectIdentifier---- */}

          <select
            value={verticalFilter}
            onChange={(event) =>
              setVerticalFilter(
                event.target.value
              )
            }
          >

            <option value="">
              All Verticals
            </option>

            {safeVerticals.map(
              (vertical) => (
                <option
                  key={vertical._id}
                  value={vertical.name}
                >
                  {vertical.name}
                </option>
              )
            )}

          </select>

        </div>
      </div>

      {/* ======================  EMPTY STATE =============== */}

      {filteredProjects.length === 0 ? (

        <div className="empty">

          <div className="big">
            🔍
          </div>

          <div>
            No projects found matching your criteria.
          </div>

        </div>

      ) : (

        /* ================ PROJECT TABLE =================== */

        <div className="table-responsive">

          <table className="table">

            {/* =============== TABLE HEADER ================== */}

            <thead>

              <tr>

                <th>
                  Code
                </th>

                <th>
                  Title
                </th>

                <th>
                  Lab
                </th>

                <th>
                  Vertical
                </th>

                <th>
                  Stage
                </th>

                <th>
                  Sanctioned
                </th>

                <th
                  style={{
                    textAlign:
                      "right",
                  }}
                >
                  Actions
                </th>

              </tr>

            </thead>

            {/* ================  TABLE BODY ============== */}

            <tbody>

              {filteredProjects.map(
                (project) => {

                  const id =
                    project._id ||
                    project.id;

                  return (
                    <tr
                      key={
                        id ||
                        project.code
                      }
                      onClick={() =>
                        handleOpenDetail(
                          project
                        )
                      }
                      style={{
                        cursor:
                          "pointer",
                      }}
                    >

                      {/* =========  CODE ========================= */}

                      <td className="proj-code">

                        {project.code ||
                          "—"}

                      </td>

                      {/* ==============   TITLE ================ */}

                      <td>

                        <div className="proj-title">

                          {project.title ||
                            "—"}

                        </div>

                        <div className="small muted">

                          {project.piName
                            ? `PI: ${project.piName}`
                            : ""}

                        </div>

                      </td>

                      {/* =====================================
                          LAB
                      ===================================== */}

                      <td>

                        {project.stakeholdingDrdoLabs ||
                          "—"}

                      </td>

                      {/* =====================================
                          VERTICAL
                      ===================================== */}

                      <td>

                        <span className="badge">

                          {project.__vertical}

                        </span>

                      </td>

                      {/* =====================================
                          STAGE
                      ===================================== */}

                      <td>

                        <span
                          className={`badge stage-${project.__stage}`}
                        >

                          {STAGE_DEFS.find(
                            (stage) =>
                              stage.key ===
                              project.__stage
                          )?.label ||
                            project.__stage}

                        </span>

                      </td>

                      {/* =====================================
                          SANCTIONED AMOUNT
                      ===================================== */}

                      <td className="mono">

                        {project.sanctionedAmount
                          ? fmtLakhs(
                              project.sanctionedAmount
                            )
                          : "—"}

                      </td>

                      {/* =====================================
                          ACTIONS
                      ===================================== */}

                      <td
                        style={{
                          textAlign:
                            "right",
                          whiteSpace:
                            "nowrap",
                        }}
                      >

                        {/* ---------------------------------
                            EDIT
                        --------------------------------- */}

                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={(
                            event
                          ) =>
                            handleEdit(
                              event,
                              id
                            )
                          }
                        >
                          Edit
                        </button>

                        {/* ---------------------------------
                            DELETE
                        --------------------------------- */}

                        <button
                          type="button"
                          className="btn btn-ghost btn-sm red"
                          disabled={
                            deletingId ===
                            id
                          }
                          onClick={(
                            event
                          ) =>
                            handleDelete(
                              event,
                              id
                            )
                          }
                        >

                          {deletingId ===
                          id
                            ? "..."
                            : "Delete"}

                        </button>

                      </td>

                    </tr>
                  );
                }
              )}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}