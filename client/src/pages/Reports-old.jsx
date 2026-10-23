import { useMemo } from "react";
import { STAGE_DEFS } from "../constants.js";
import { fmtLakhs, getStage } from "../utils.js";

export default function Reports({
  projects = [],
  verticals = [],
}) {
  // =========================================================
  // 1. SAFE DATA
  // =========================================================

  const safeProjects = Array.isArray(projects)
    ? projects
    : projects?.projects || projects?.data || [];

  const safeVerticals = Array.isArray(verticals)
    ? verticals
    : [];

  // =========================================================
  // 2. CREATE VERTICAL ID -> NAME MAP
  // =========================================================

  const verticalMap = useMemo(() => {
    const map = {};

    safeVerticals.forEach((vertical) => {
      if (!vertical) return;

      // MongoDB vertical document
      if (vertical._id) {
        map[String(vertical._id)] =
          vertical.name || "Unnamed";
      }
    });   

    return map;
  }, [safeVerticals]);

  // =========================================================
  // 3. CALCULATE REPORT METRICS
  // =========================================================

  const metrics = useMemo(() => {
    let totalSanctioned = 0;

    const stageCounts = {};
    const verticalCounts = {};

    // ---------------------------------------------------------
    // Initialize stages
    // ---------------------------------------------------------

    STAGE_DEFS.forEach((stage) => {
      stageCounts[stage.key] = 0;
    });

    // ---------------------------------------------------------
    // Initialize verticals
    // ---------------------------------------------------------

    safeVerticals.forEach((vertical) => {
      if (!vertical) return;

      const name =
        typeof vertical === "string"
          ? vertical
          : vertical.name || "Unnamed";

      verticalCounts[name] = {
        total: 0,
        amount: 0,
      };
    });

    // Always keep Unassigned
    if (!verticalCounts["Unassigned"]) {
      verticalCounts["Unassigned"] = {
        total: 0,
        amount: 0,
      };
    }

    // =========================================================
    // 4. PROCESS PROJECTS
    // =========================================================

    safeProjects.forEach((project) => {
      if (!project) return;

      // -------------------------------------------------------
      // Sanction amount
      // -------------------------------------------------------

      const amount =
        Number(project.sanctionedAmount) || 0;

      totalSanctioned += amount;

      // -------------------------------------------------------
      // Stage
      // -------------------------------------------------------

      const stage =
        typeof getStage === "function"
          ? getStage(project)
          : project.stage || "proposal";

      if (stageCounts[stage] !== undefined) {
        stageCounts[stage]++;
      } else {
        stageCounts[stage] = 1;
      }

      // =======================================================
      // VERTICAL
      // =======================================================

      let verticalName = "Unassigned";

      // -------------------------------------------------------
      // PRIMARY:
      // Project contains verticalId
      // -------------------------------------------------------

      if (project.verticalId) {
        verticalName =
          verticalMap[String(project.verticalId)] ||
          "Unassigned";
      }

      // -------------------------------------------------------
      // FALLBACK:
      // If backend already populated vertical
      // -------------------------------------------------------

      else if (project.vertical) {
        if (
          typeof project.vertical === "object" &&
          project.vertical.name
        ) {
          verticalName = project.vertical.name;
        } else {
          verticalName = String(project.vertical);
        }
      }

      // -------------------------------------------------------
      // Create counter if vertical wasn't initialized
      // -------------------------------------------------------

      if (!verticalCounts[verticalName]) {
        verticalCounts[verticalName] = {
          total: 0,
          amount: 0,
        };
      }

      // -------------------------------------------------------
      // Add project
      // -------------------------------------------------------

      verticalCounts[verticalName].total++;

      verticalCounts[verticalName].amount += amount;
     
    });

    // =========================================================
    // RETURN METRICS
    // =========================================================

    return {
      totalProjects: safeProjects.length,
      totalSanctioned,
      stageCounts,
      verticalCounts,
    };
  }, [
    safeProjects,
    safeVerticals,
    verticalMap,
  ]);

  // =========================================================
  // 5. UI
  // =========================================================

  return (
    <div>
      {/* =====================================================
          OVERVIEW CARDS
      ===================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 14,
          marginBottom: 20,
        }}
      >
        <div className="panel">
          <div className="small muted">
            Total Projects
          </div>

          <div
            style={{
              fontSize: 24,
              fontWeight: "bold",
              marginTop: 4,
            }}
          >
            {metrics.totalProjects}
          </div>
        </div>

        <div className="panel">
          <div className="small muted">
            Total Sanctioned Value
          </div>

          <div
            style={{
              fontSize: 24,
              fontWeight: "bold",
              marginTop: 4,
              color: "var(--primary, #0066cc)",
            }}
          >
            {fmtLakhs(metrics.totalSanctioned)}
          </div>
        </div>
      </div>

      {/* =====================================================
          REPORT TABLES
      ===================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 16,
        }}
      >
        {/* ===================================================
            PROJECTS BY STAGE
        =================================================== */}

        <div className="panel">
          <h3>Projects by Stage</h3>

          <div
            className="table-responsive"
            style={{
              marginTop: 12,
            }}
          >
            <table className="table">
              <thead>
                <tr>
                  <th>Stage</th>

                  <th
                    style={{
                      textAlign: "right",
                    }}
                  >
                    Count
                  </th>

                  <th
                    style={{
                      textAlign: "right",
                    }}
                  >
                    Share
                  </th>
                </tr>
              </thead>

              <tbody>
                {STAGE_DEFS.map((stage) => {
                  const count =
                    metrics.stageCounts[stage.key] || 0;

                  const percentage =
                    metrics.totalProjects > 0
                      ? (
                          (count /
                            metrics.totalProjects) *
                          100
                        ).toFixed(1)
                      : 0;

                  return (
                    <tr key={stage.key}>
                      <td>
                        <span
                          className={`badge stage-${stage.key}`}
                        >
                          {stage.label}
                        </span>
                      </td>

                      <td
                        className="mono"
                        style={{
                          textAlign: "right",
                        }}
                      >
                        {count}
                      </td>

                      <td
                        className="mono muted"
                        style={{
                          textAlign: "right",
                        }}
                      >
                        {percentage}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ===================================================
            PROJECTS BY VERTICAL
        =================================================== */}

        <div className="panel">
          <h3>Projects by Vertical</h3>

          <div
            className="table-responsive"
            style={{
              marginTop: 12,
            }}
          >
            <table className="table">
              <thead>
                <tr>
                  <th>Vertical</th>

                  <th
                    style={{
                      textAlign: "right",
                    }}
                  >
                    Count
                  </th>

                  <th
                    style={{
                      textAlign: "right",
                    }}
                  >
                    Total Value
                  </th>
                </tr>
              </thead>

              <tbody>
                {Object.entries(
                  metrics.verticalCounts
                ).map(([verticalName, data]) => (
                  <tr key={verticalName}>
                    <td>
                      <b>{verticalName}</b>
                    </td>

                    <td
                      className="mono"
                      style={{
                        textAlign: "right",
                      }}
                    >
                      {data.total}
                    </td>

                    <td
                      className="mono"
                      style={{
                        textAlign: "right",
                      }}
                    >
                      {fmtLakhs(data.amount)}
                    </td>
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