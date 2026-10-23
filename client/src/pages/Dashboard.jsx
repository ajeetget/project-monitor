import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";

import { useMemo } from "react";
import { Bar, Pie } from "react-chartjs-2";

import { STAGE_DEFS } from "../constants.js";
import { fmtDate, fmtLakhs } from "../utils.js";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

/* =========================================================
   DATE HELPER
========================================================= */

function daysUntil(dateStr) {
  if (!dateStr) return Infinity;

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const d = new Date(dateStr);

  if (isNaN(d.getTime())) {
    return Infinity;
  }

  return Math.round(
    (d - today) / 86400000
  );
}

/* =========================================================
   STAGE HELPER
========================================================= */

function getStage(project) {
  if (project.stage) {
    return project.stage;
  }

  if (project.closed) {
    return "closed";
  }

  if (
    project.sanctionDate &&
    !project.firstReleaseDate
  ) {
    return "sanctioned";
  }

  return "active";
}

/* =========================================================
   ID NORMALIZER
========================================================= */

function normalizeId(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  /* String */
  if (typeof value === "string") {
    return value.trim();
  }

  /* MongoDB:
     { $oid: "..." }
  */
  if (
    typeof value === "object" &&
    value.$oid
  ) {
    return String(
      value.$oid
    ).trim();
  }

  /* Object containing _id */
  if (
    typeof value === "object" &&
    value._id
  ) {
    return normalizeId(
      value._id
    );
  }

  /* Object containing id */
  if (
    typeof value === "object" &&
    value.id
  ) {
    return normalizeId(
      value.id
    );
  }

  return String(value).trim();
}

/* =========================================================
   DASHBOARD
========================================================= */

export default function Dashboard({
  projects = [],
  verticals = [],
  search = "",
  onOpenDetail,
}) {
  /* =======================================================
     1. SAFE PROJECTS
  ======================================================= */

  const safeProjects = Array.isArray(
    projects
  )
    ? projects
    : projects?.projects ||
      projects?.data ||
      [];

  /* =======================================================
     2. SAFE VERTICALS
  ======================================================= */

  const safeVerticals = Array.isArray(
    verticals
  )
    ? verticals
    : verticals?.verticals ||
      verticals?.data ||
      [];

  
  /* =========================================================
     3. VERTICAL MAP
  ========================================================= */

  const verticalMap =
    useMemo(() => {
      const map = {};

      safeVerticals.forEach(
        (vertical) => {
          if (!vertical) {
            return;
          }

          /*
           * Try every possible ID
           */

          const rawId =
            vertical._id ||
            vertical.id;

          const id =
            normalizeId(
              rawId
            );

          const name =
            vertical.name ||
            vertical.title ||
            vertical.label;

          if (
            id &&
            name
          ) {
            map[id] =
              String(
                name
              ).trim();
          }
        }
      );
      return map;
    }, [safeVerticals]);

  /* =========================================================
     4. SEARCH
  ========================================================= */

  const filtered =
    useMemo(() => {
      if (!search) {
        return safeProjects;
      }

      const q =
        search
          .toLowerCase()
          .trim();

      return safeProjects.filter(
        (project) => {
          if (!project) {
            return false;
          }

          return (
            String(
              project.code ||
                ""
            )
              .toLowerCase()
              .includes(q) ||

            String(
              project.title ||
                ""
            )
              .toLowerCase()
              .includes(q) ||

            String(
              project.stakeholdingDrdoLabs ||
                ""
            )
              .toLowerCase()
              .includes(q) ||

            String(
              project.piName ||
                ""
            )
              .toLowerCase()
              .includes(q) ||

            String(
              project.stakeholdingScientist ||
                ""
            )
              .toLowerCase()
              .includes(q)
          );
        }
      );
    }, [
      safeProjects,
      search,
    ]);

  /* =========================================================
     5. PROJECT DETAILS + VERTICAL MATCHING
  ========================================================= */

  const withDetails =
    useMemo(() => {
      return filtered.map(
        (project) => {
          const stage =
            getStage(
              project
            );

          let verticalName =
            "Unassigned";

          /* ===============================================
             PROJECT verticalId
          =============================================== */

          const projectVerticalId =
            normalizeId(
              project?.verticalId
            );       
        

          /* ===============  MATCH USING verticalId ============= */

          if (
            projectVerticalId
          ) {
            const matchedName =
              verticalMap[
                projectVerticalId
              ];          

            if (
              matchedName
            ) {
              verticalName =
                matchedName;
            }
          }

          /* ===============================================
             FALLBACK:
             project.vertical
          =============================================== */

          if (
            verticalName ===
            "Unassigned"
          ) {
            const projectVertical =
              project?.vertical;

            if (
              projectVertical &&
              typeof projectVertical ===
                "object"
            ) {
              const nestedId =
                normalizeId(
                  projectVertical._id ||
                  projectVertical.id
                );

              const nestedName =
                projectVertical.name ||
                projectVertical.title ||
                projectVertical.label;             

              if (
                nestedId &&
                verticalMap[
                  nestedId
                ]
              ) {
                verticalName =
                  verticalMap[
                    nestedId
                  ];
              } else if (
                nestedName
              ) {
                verticalName =
                  String(
                    nestedName
                  ).trim();
              }
            } else if (
              projectVertical
            ) {
              verticalName =
                String(
                  projectVertical
                ).trim();
            }
          }

          return {
            ...project,

            __stage:
              stage,

            __vertical:
              verticalName,
          };
        }
      );
    }, [
      filtered,
      verticalMap,
    ]);

  /* =========================================================
     6. KPI
  ========================================================= */

  const kpis =
    useMemo(() => {
      const total =
        withDetails.length;

      const active =
        withDetails.filter(
          (project) =>
            project.__stage ===
            "active"
        ).length;

      const sanctioned =
        withDetails.filter(
          (project) =>
            project.__stage ===
            "sanctioned"
        ).length;

      const closed =
        withDetails.filter(
          (project) =>
            project.__stage ===
            "closed"
        ).length;

      const totalSanctioned =
        withDetails.reduce(
          (
            sum,
            project
          ) =>
            sum +
            (Number(
              project.sanctionedAmount
            ) || 0),
          0
        );

      const overdue =
        withDetails.filter(
          (project) =>
            project.nmDate &&
            daysUntil(
              project.nmDate
            ) < 0 &&
            project.__stage !==
              "closed"
        ).length;

      return [
        {
          label:
            "Total Projects",
          num: total,
          cls: "navy",
        },

        {
          label:
            "Active / Ongoing",
          num: active,
          cls: "",
        },

        {
          label:
            "Sanctioned (Pending)",
          num: sanctioned,
          cls: "amber",
        },

        {
          label:
            "Fully Closed",
          num: closed,
          cls: "green",
        },

        {
          label:
            "Overdue Milestones",
          num: overdue,
          cls: "red",
        },

        {
          label:
            "Total Sanctioned (₹)",
          num:
            fmtLakhs(
              totalSanctioned
            ),
          cls: "navy",
          small: true,
        },
      ];
    }, [withDetails]);

  /* =========================================================
     7. STAGE CHART
  ========================================================= */

  const stageChartData =
    useMemo(() => {
      const counts = {};

      STAGE_DEFS.forEach(
        (stage) => {
          counts[
            stage.key
          ] = 0;
        }
      );

      withDetails.forEach(
        (project) => {
          if (
            counts[
              project.__stage
            ] !== undefined
          ) {
            counts[
              project.__stage
            ]++;
          }
        }
      );

      return {
        labels:
          STAGE_DEFS.map(
            (stage) =>
              stage.label
          ),

        datasets: [
          {
            data:
              STAGE_DEFS.map(
                (stage) =>
                  counts[
                    stage.key
                  ] || 0
              ),

            backgroundColor: [
              "#B9C2CE",
              "#2C5CB0",
              "#C97A1A",
              "#2C5CB0",
              "#6A3FB5",
              "#6A3FB5",
              "#28825A",
            ],
          },
        ],
      };
    }, [withDetails]);

  /* =========================================================
     8. PROJECTS BY VERTICAL
  ========================================================= */

  const verticalChartData =
    useMemo(() => {
      const counts = {};

      withDetails.forEach(
        (project) => {
          const vertical =
            project.__vertical ||
            "Unassigned";

          counts[vertical] =
            (counts[vertical] ||
              0) + 1;
        }
      );

      const labels =
        Object.keys(
          counts
        );    

      return {
        labels,

        datasets: [
          {
            label:
              "Projects",

            data:
              labels.map(
                (label) =>
                  counts[
                    label
                  ]
              ),

            backgroundColor:
              "#0E7C86",
          },
        ],
      };
    }, [withDetails]);

  /* =========================================================
     9. PROJECTS BY LAB
  ========================================================= */

  const labChartData =
    useMemo(() => {
      const counts = {};

      withDetails.forEach(
        (project) => {
          let lab =
            project.stakeholdingDrdoLabs;

          if (!lab) {
            lab =
              project.lab;
          }

          if (!lab) {
            lab =
              "Unassigned";
          }

          if (
            Array.isArray(lab)
          ) {
            lab.forEach(
              (item) => {
                const name =
                  String(
                    item ||
                      "Unassigned"
                  ).trim();

                if (!name) {
                  return;
                }

                counts[name] =
                  (counts[
                    name
                  ] || 0) + 1;
              }
            );

            return;
          }

          const labName =
            String(
              lab
            ).trim();

          counts[labName] =
            (counts[
              labName
            ] || 0) + 1;
        }
      );

      const labels =
        Object.keys(
          counts
        );     

      return {
        labels,

        datasets: [
          {
            label:
              "Projects",

            data:
              labels.map(
                (label) =>
                  counts[
                    label
                  ]
              ),

            backgroundColor:
              "#2b4467",
          },
        ],
      };
    }, [withDetails]);

  /* =========================================================
     10. SANCTIONS BY YEAR
  ========================================================= */

  const yearChartData =
    useMemo(() => {
      const amounts = {};

      withDetails.forEach(
        (project) => {
          const amount =
            Number(
              project.sanctionedAmount
            ) || 0;

          const date =
            project.sanctionDate;

          if (!date) {
            return;
          }

          const year =
            new Date(
              date
            ).getFullYear();

          if (
            isNaN(year)
          ) {
            return;
          }

          amounts[year] =
            (amounts[year] ||
              0) + amount;
        }
      );

      const labels =
        Object.keys(
          amounts
        ).sort(
          (a, b) =>
            Number(a) -
            Number(b)
        );     

      return {
        labels,

        datasets: [
          {
            label:
              "Sanctioned Amount (₹)",

            data:
              labels.map(
                (year) =>
                  amounts[
                    year
                  ]
              ),

            backgroundColor:
              "#C97A1A",
          },
        ],
      };
    }, [withDetails]);

  /* =========================================================
     11. ALERTS
  ========================================================= */

  const alerts =
    useMemo(() => {
      return withDetails
        .filter(
          (project) => {
            if (
              project.__stage ===
              "closed"
            ) {
              return false;
            }

            if (
              project.nmDate &&
              daysUntil(
                project.nmDate
              ) < 0
            ) {
              return true;
            }

            if (
              project.__stage ===
                "sanctioned" &&
              !project.firstReleaseDate
            ) {
              return true;
            }

            return false;
          }
        )
        .slice(0, 8);
    }, [withDetails]);

  /* =========================================================
     12. UPCOMING
  ========================================================= */

  const upcoming =
    useMemo(() => {
      return withDetails
        .filter(
          (project) =>
            project.nmDate &&
            daysUntil(
              project.nmDate
            ) >= 0 &&
            daysUntil(
              project.nmDate
            ) <= 45
        )
        .sort(
          (a, b) =>
            new Date(
              a.nmDate
            ) -
            new Date(
              b.nmDate
            )
        )
        .slice(0, 8);
    }, [withDetails]);

  /* =========================================================
     13. BAR OPTIONS
  ========================================================= */

  const barOpts = {
    responsive: true,

    plugins: {
      legend: {
        display: false,
      },
    },

    indexAxis: "y",
  };

  /* =========================================================
     14. UI
  ========================================================= */

  return (
    <div>

      {/* =====================================================
          KPI
      ===================================================== */}

      <div className="kpi-grid">

        {kpis.map(
          (
            kpi,
            index
          ) => (
            <div
              className={`kpi ${kpi.cls}`}
              key={index}
            >

              <div
                className="num"
                style={{
                  fontSize:
                    kpi.small
                      ? 18
                      : 26,
                }}
              >
                {kpi.num}
              </div>

              <div className="lbl">
                {kpi.label}
              </div>

            </div>
          )
        )}

      </div>

      {/* =====================================================
          STAGE + VERTICAL
      ===================================================== */}

      <div className="grid2">

        {/* ================= STAGE ================= */}

        <div className="panel">

          <h3>
            Projects by Stage{" "}

            <span className="tag">
              {
                withDetails.length
              }{" "}
              total
            </span>
          </h3>

          <Pie
            data={
              stageChartData
            }
          />

        </div>

        {/* ================= VERTICAL ================= */}

        <div className="panel">

          <h3>
            Projects by Vertical
          </h3>

          {verticalChartData
            .labels
            .length === 0 ? (

            <div className="muted small">
              No vertical data
              available.
            </div>

          ) : (

            <Bar
              data={
                verticalChartData
              }
              options={
                barOpts
              }
            />

          )}

        </div>

      </div>

      {/* =====================================================
          ALERTS + UPCOMING
      ===================================================== */}

      <div className="grid2">

        <div className="panel">

          <h3>
            ⚠ Action Needed{" "}

            <span className="tag">
              {
                alerts.length
              }{" "}
              item(s)
            </span>
          </h3>

          {alerts.length ===
          0 ? (

            <div className="muted small">
              Nothing needs
              attention right now.
            </div>

          ) : (

            alerts.map(
              (
                project
              ) => (

                <div
                  key={
                    project._id ||
                    project.code
                  }
                  style={{
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                    padding:
                      "7px 0",
                    borderBottom:
                      "1px solid var(--border)",
                    cursor:
                      "pointer",
                  }}
                  onClick={() =>
                    onOpenDetail &&
                    onOpenDetail(
                      project
                    )
                  }
                >

                  <div>

                    <span className="proj-code">
                      {
                        project.code
                      }
                    </span>{" "}

                    <span className="proj-title small">
                      {
                        project.title
                      }
                    </span>

                  </div>

                  <span className="badge alert-hot">
                    Needs action
                  </span>

                </div>

              )
            )

          )}

        </div>

        <div className="panel">

          <h3>
            📅 Upcoming Milestones
            (next 45 days)
          </h3>

          {upcoming.length ===
          0 ? (

            <div className="muted small">
              No milestones in
              this window.
            </div>

          ) : (

            upcoming.map(
              (
                project
              ) => (

                <div
                  key={
                    project._id ||
                    project.code
                  }
                  style={{
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                    padding:
                      "7px 0",
                    borderBottom:
                      "1px solid var(--border)",
                    cursor:
                      "pointer",
                  }}
                  onClick={() =>
                    onOpenDetail &&
                    onOpenDetail(
                      project
                    )
                  }
                >

                  <div>

                    <span className="proj-code">
                      {
                        project.code
                      }
                    </span>{" "}

                    <span className="small muted">
                      {
                        project.nmType ||
                        "Milestone"
                      }
                    </span>

                  </div>

                  <span className="mono small">
                    {fmtDate(
                      project.nmDate
                    )}
                  </span>

                </div>

              )
            )

          )}

        </div>

      </div>

      {/* =====================================================
          LAB + YEAR
      ===================================================== */}

      <div className="grid2">

        <div className="panel">

          <h3>
            Projects by
            Stakeholding Lab
          </h3>

          {labChartData
            .labels
            .length === 0 ? (

            <div className="muted small">
              No lab data
              available.
            </div>

          ) : (

            <Bar
              data={
                labChartData
              }
              options={
                barOpts
              }
            />

          )}

        </div>

        <div className="panel">

          <h3>
            Sanctions by Year
            (₹)
          </h3>

          {yearChartData
            .labels
            .length === 0 ? (

            <div className="muted small">
              No sanction data
              available.
            </div>

          ) : (

            <Bar
              data={
                yearChartData
              }
              options={{
                responsive:
                  true,

                plugins: {
                  legend: {
                    display:
                      false,
                  },
                },
              }}
            />

          )}

        </div>

      </div>

    </div>
  );
}