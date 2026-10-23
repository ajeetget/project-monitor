import { stageDef } from "../constants";
import { fmtDate, getStage, localFileHref } from "../utils";

/* =========================================================
   SIMPLE ROW
========================================================= */

function Row({ label, value }) {
  const hasValue =
    value !== null &&
    value !== undefined &&
    value !== "";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "6px 0",
        borderBottom: "1px solid var(--border)",
        fontSize: 12.5,
        gap: 20,
      }}
    >
      <span className="muted">{label}</span>

      <span
        style={{
          textAlign: "right",
          maxWidth: "65%",
          whiteSpace: "pre-wrap",
        }}
      >
        {hasValue ? value : <span className="muted">—</span>}
      </span>
    </div>
  );
}

/* =========================================================
   FILE LINK
========================================================= */

function FileLink({ path, label }) {
  if (!path) {
    return <span className="muted">—</span>;
  }

  return (
    <a
      className="link-pill"
      href={localFileHref(path)}
      target="_blank"
      rel="noreferrer"
      title={`${path} — opens only if this file exists at this path`}
    >
      {label || `📄 ${path}`}
    </a>
  );
}

/* =========================================================
   MEETING TABLE
========================================================= */

function MeetingTable({ rows, title }) {
  const meetings = Array.isArray(rows) ? rows : [];

  return (
    <>
      <div
        className="small muted"
        style={{
          marginTop: 10,
          marginBottom: 4,
          fontWeight: 600,
        }}
      >
        {title}
      </div>

      <table style={{ marginBottom: 12 }}>
        <thead>
          <tr>
            <th>Type</th>
            <th>Date</th>
            <th>Minutes</th>
            <th>Remarks</th>
          </tr>
        </thead>

        <tbody>
          {meetings.length === 0 ? (
            <tr>
              <td colSpan={4} className="muted small">
                None logged.
              </td>
            </tr>
          ) : (
            meetings.map((meeting, index) => (
              <tr key={index}>
                <td className="small">
                  {meeting?.type || "—"}
                </td>

                <td className="mono small">
                  {meeting?.date
                    ? fmtDate(meeting.date)
                    : "—"}
                </td>

                <td>
                  <FileLink path={meeting?.minutes} />
                </td>

                <td className="small">
                  {meeting?.remarks || "—"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}

/* =========================================================
   CLOSURE SECTION
========================================================= */

function ClosureSection({ project }) {
  const closureMeetings = Array.isArray(
    project?.closureMeetings
  )
    ? project.closureMeetings
    : [];

  return (
    <>
      {/* =====================================================
          PROJECT CLOSURE
      ===================================================== */}

      <div
        className="small muted"
        style={{
          fontWeight: 600,
          margin: "14px 0 4px",
        }}
      >
        Project Closure
      </div>

      {/* =====================================================
          CLOSURE MEETINGS
      ===================================================== */}

      <MeetingTable
        rows={closureMeetings}
        title="Closure Meetings"
      />

      {/* =====================================================
          CLOSURE MILESTONES
      ===================================================== */}

      <div
        className="small muted"
        style={{
          fontWeight: 600,
          margin: "14px 0 4px",
        }}
      >
        Closure Milestones
      </div>

      <Row
        label="Technical Closure Date"
        value={
          project?.techCloseDate
            ? fmtDate(project.techCloseDate)
            : ""
        }
      />

      <Row
        label="Technical Closure Remarks"
        value={project?.techCloseRemarks}
      />

      <Row
        label="Financial Closure Date"
        value={
          project?.finCloseDate
            ? fmtDate(project.finCloseDate)
            : ""
        }
      />

      <Row
        label="Financial Closure Remarks"
        value={project?.finCloseRemarks}
      />

      <Row
        label="Administrative Closure Date"
        value={
          project?.admCloseDate
            ? fmtDate(project.admCloseDate)
            : ""
        }
      />

      <Row
        label="Administrative Closure Remarks"
        value={project?.admCloseRemarks}
      />

      {/* =====================================================
          LAB RECOMMENDATION
      ===================================================== */}

      <div
        className="small muted"
        style={{
          fontWeight: 600,
          margin: "14px 0 4px",
        }}
      >
        Lab Recommendation
      </div>

      <Row
        label="Lab Recommendation Received"
        value={project?.labRecReceived}
      />

      {project?.labRecReceived === "Yes" && (
        <Row
          label="Lab Recommendation Comments"
          value={project?.labRecComments}
        />
      )}

      {project?.labRecReceived === "No" && (
        <Row
          label="Lab Recommendation Reason"
          value={project?.labRecReason}
        />
      )}

      {/* =====================================================
          TECHNOLOGY READINESS
      ===================================================== */}

      <div
        className="small muted"
        style={{
          fontWeight: 600,
          margin: "14px 0 4px",
        }}
      >
        Technology Readiness at Closure
      </div>

      <Row
        label="Final TRL"
        value={project?.finalTRL}
      />
    </>
  );
}

/* =========================================================
   DETAIL MODAL
========================================================= */

export default function DetailModal({
  project: p,
  onClose,
  onEdit,
}) {
  if (!p) return null;


  /* =======================================================
     STAGE
  ======================================================= */

  const stage = getStage(p);

  /* =======================================================
     BUDGET
  ======================================================= */

  const budgetYears =
    Number(p?.budgetYears) || 1;

  const budgetRows = Array.isArray(
    p?.budgetRows
  )
    ? p.budgetRows
    : [];

  const yearSums = Array(
    budgetYears
  ).fill(0);

  budgetRows.forEach((row) => {
    const years = Array.isArray(row?.years)
      ? row.years
      : [];

    years.forEach((value, yearIndex) => {
      if (yearIndex < yearSums.length) {
        yearSums[yearIndex] +=
          Number(value) || 0;
      }
    });
  });

  const grandTotal = yearSums.reduce(
    (total, value) => total + value,
    0
  );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      className="modal-bg active"
      onClick={onClose}
    >
      <div
        className="modal wide"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        {/* =================================================
            CLOSE
        ================================================= */}

        <span
          className="close-x"
          onClick={onClose}
        >
          ×
        </span>

        {/* =================================================
            HEADER
        ================================================= */}

        <h2>
          {p.code} — {p.title}
        </h2>

        <div
          style={{
            marginBottom: 14,
          }}
        >
          <span
            className={`badge ${
              stageDef(stage).color
            }`}
          >
            {stageDef(stage).label}
          </span>

          {" "}

          {p.vertical && (
            <span className="badge stage-new">
              {p.vertical}
            </span>
          )}
        </div>

        {/* =================================================
            IDENTITY
        ================================================= */}

        <div
          className="small muted"
          style={{
            fontWeight: 600,
            marginBottom: 4,
          }}
        >
          Identity
        </div>

        <Row
          label="Project Code"
          value={p.code}
        />

        <Row
          label="Project Title"
          value={p.title}
        />

        <Row
          label="Vertical"
          value={
            p.vertical ||
            p.verticalName ||
            p.verticalId
          }
        />

        <Row
          label="Lab"
          value={p.stakeholdingDrdoLabs}
        />

        <Row
          label="Stakeholding Scientist"
          value={p.stakeholdingScientist}
        />

        <Row
          label="PI"
          value={p.piName}
        />

        <Row
          label="PI Institute"
          value={p.piInstituteName}
        />

        <Row
          label="CO-PI(s)"
          value={p.coPiName}
        />

        <Row
          label="CO-PI Institute"
          value={p.coPiInstitute}
        />

        <Row
          label="Project Duration"
          value={p.projectDuration}
        />

        <Row
          label="Project Status"
          value={p.projectStatus}
        />

        {/* =================================================
            PRE-SANCTION
        ================================================= */}

        <div
          className="small muted"
          style={{
            fontWeight: 600,
            margin: "14px 0 4px",
          }}
        >
          Pre-Sanction
        </div>

        <Row
          label="Initial TRL"
          value={p.initialTrlLevel}
        />

        <MeetingTable
          rows={p.preSanctionMeetings}
          title="Pre-Sanction Meetings"
        />

        {/* =================================================
            SANCTION & FINANCE
        ================================================= */}

        <div
          className="small muted"
          style={{
            fontWeight: 600,
            margin: "14px 0 4px",
          }}
        >
          Sanction &amp; Finance
        </div>

        <Row
          label="Sanction Date"
          value={
            p.sanctionDate
              ? fmtDate(p.sanctionDate)
              : ""
          }
        />

        <Row
          label="Sanctioned Amount"
          value={
            p.sanctionedAmount
              ? `₹${Number(
                  p.sanctionedAmount
                ).toLocaleString("en-IN")}`
              : ""
          }
        />

        <Row
          label="Sanction Letter"
          value={
            <FileLink
              path={p.sanctionLetter}
            />
          }
        />

        <Row
          label="1st Fund Release Date"
          value={
            p.projectStartDate
              ? fmtDate(p.projectStartDate)
              : ""
          }
        />

        <Row
          label="Equipment List"
          value={p.equipmentList}
        />

        {/* =================================================
            DELIVERABLES
        ================================================= */}

        <div
          className="small muted"
          style={{
            fontWeight: 600,
            margin: "14px 0 4px",
          }}
        >
          Deliverables / Milestones
        </div>

        <table
          style={{
            marginBottom: 12,
          }}
        >
          <thead>
            <tr>
              <th>Description</th>
              <th>Target Date</th>
              <th>Status</th>
              <th>Remarks</th>
            </tr>
          </thead>

          <tbody>
            {!Array.isArray(p.deliverables) ||
            p.deliverables.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="muted small"
                >
                  None logged.
                </td>
              </tr>
            ) : (
              p.deliverables.map(
                (d, index) => (
                  <tr key={index}>
                    <td className="small">
                      {d.description || "—"}
                    </td>

                    <td className="mono small">
                      {d.targetDate
                        ? fmtDate(
                            d.targetDate
                          )
                        : "—"}
                    </td>

                    <td>
                      <span className="badge stage-active">
                        {d.status ||
                          "Pending"}
                      </span>
                    </td>

                    <td className="small">
                      {d.remarks || "—"}
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>

        {/* =================================================
            BUDGET
        ================================================= */}

        <div
          className="small muted"
          style={{
            fontWeight: 600,
            margin: "14px 0 4px",
          }}
        >
          Budget (₹ Lakhs)
        </div>

        <table
          style={{
            marginBottom: 12,
            fontSize: 12,
          }}
        >
          <thead>
            <tr>
              <th>Head</th>
              <th>Institute</th>

              {Array.from({
                length: budgetYears,
              }).map((_, index) => (
                <th key={index}>
                  Year {index + 1}
                </th>
              ))}

              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {budgetRows.map(
              (row, index) => {
                const years = Array.isArray(
                  row?.years
                )
                  ? row.years
                  : [];

                const total = years.reduce(
                  (sum, value) =>
                    sum +
                    (Number(value) || 0),
                  0
                );

                return (
                  <tr key={index}>
                    <td>
                      {row.head || "—"}
                    </td>

                    <td>
                      {row.institute || "—"}
                    </td>

                    {Array.from({
                      length: budgetYears,
                    }).map(
                      (_, yearIndex) => (
                        <td
                          key={yearIndex}
                          className="mono"
                        >
                          {Number(
                            years[
                              yearIndex
                            ] || 0
                          ).toFixed(2)}
                        </td>
                      )
                    )}

                    <td
                      className="mono"
                      style={{
                        fontWeight: 600,
                      }}
                    >
                      {total.toFixed(2)}
                    </td>
                  </tr>
                );
              }
            )}

            <tr
              style={{
                background:
                  "var(--grey-bg)",
                fontWeight: 700,
              }}
            >
              <td>Grand Total</td>

              <td></td>

              {yearSums.map(
                (sum, index) => (
                  <td
                    key={index}
                    className="mono"
                  >
                    {sum.toFixed(2)}
                  </td>
                )
              )}

              <td className="mono">
                {grandTotal.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* =================================================
            POST-SANCTION
        ================================================= */}

        <MeetingTable
          rows={p.postSanctionMeetings}
          title="Post-Sanction Meetings"
        />

        {/* =================================================
            MANPOWER
        ================================================= */}

        <div
          className="small muted"
          style={{
            fontWeight: 600,
            margin: "14px 0 4px",
          }}
        >
          Manpower
        </div>

        <table
          style={{
            marginBottom: 12,
          }}
        >
          <thead>
            <tr>
              <th>Category</th>
              <th>Name</th>
              <th>Designation</th>
              <th>Specialisation</th>
            </tr>
          </thead>

          <tbody>
            {!Array.isArray(p.manpower) ||
            p.manpower.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="muted small"
                >
                  None logged.
                </td>
              </tr>
            ) : (
              p.manpower.map(
                (person, index) => (
                  <tr key={index}>
                    <td>
                      <span className="badge stage-active">
                        {person.category ||
                          "—"}
                      </span>
                    </td>

                    <td className="small">
                      {person.name || "—"}
                    </td>

                    <td className="small">
                      {person.designation ||
                        "—"}
                    </td>

                    <td className="small">
                      {person.specialisation ||
                        "—"}
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>

        {/* =================================================
            EXTENSIONS
        ================================================= */}

        <div
          className="small muted"
          style={{
            fontWeight: 600,
            margin: "14px 0 4px",
          }}
        >
          Extensions &amp; Revisions
        </div>

        <MeetingTable
          rows={p.pdcExtensions}
          title="PDC Extensions"
        />

        {/* =================================================
            OUTCOMES
        ================================================= */}

        <div
          className="small muted"
          style={{
            fontWeight: 600,
            margin: "14px 0 4px",
          }}
        >
          Outcomes &amp; Dissemination
        </div>

        <Row
          label="Technologies Developed"
          value={p.technologiesDeveloped}
        />

        <Row
          label="Patents Given"
          value={p.patentsGiven}
        />

        <Row
          label="Patents Submitted"
          value={p.patentsSubmitted}
        />

        <Row
          label="Number of Publications"
          value={p.numPublications}
        />

        <Row
          label="Publications"
          value={p.listPublications}
        />

        <Row
          label="Breakthrough Technology"
          value={p.breakthroughTech}
        />

        <Row
          label="EOI Date"
          value={
            p.eoiDate
              ? fmtDate(p.eoiDate)
              : ""
          }
        />

        <Row
          label="EOI Details"
          value={p.eoiDetails}
        />

        <Row
          label="Industries Involved"
          value={p.industriesInvolved}
        />

        <Row
          label="Dissemination Date"
          value={
            p.disseminationDate
              ? fmtDate(
                  p.disseminationDate
                )
              : ""
          }
        />

        <Row
          label="Dissemination Participants"
          value={
            p.disseminationParticipants
          }
        />

        <Row
          label="Workshop Conducted"
          value={p.workshopConducted}
        />

        <Row
          label="Workshop Details"
          value={p.workshopDetails}
        />

        {/* =================================================
            PROJECT CLOSURE
        ================================================= */}

        <ClosureSection project={p} />

        {/* =================================================
            NEXT MILESTONE
        ================================================= */}

        <div
          className="small muted"
          style={{
            fontWeight: 600,
            margin: "14px 0 4px",
          }}
        >
          Next Milestone
        </div>

        <Row
          label="Type"
          value={
            p.nextMilestoneType ||
            p.nmType
          }
        />

        <Row
          label="Date"
          value={
            p.nextMilestoneDate
              ? fmtDate(
                  p.nextMilestoneDate
                )
              : p.nmDate
              ? fmtDate(p.nmDate)
              : ""
          }
        />

        <Row
          label="Description"
          value={
            p.nextMilestoneDescription ||
            p.nmDesc
          }
        />

        {/* =================================================
            GENERAL REMARKS
        ================================================= */}

        <div
          className="small muted"
          style={{
            fontWeight: 600,
            margin: "14px 0 4px",
          }}
        >
          General Remarks
        </div>

        <div
          className="small"
          style={{
            marginBottom: 16,
            whiteSpace: "pre-wrap",
          }}
        >
          {p.remarks || (
            <span className="muted">
              —
            </span>
          )}
        </div>

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="form-actions">
          <button
            className="btn btn-ghost"
            onClick={onClose}
          >
            Close
          </button>

          <button
            className="btn btn-primary"
            onClick={() =>
              onEdit(p._id)
            }
          >
            Edit Project
          </button>
        </div>
      </div>
    </div>
  );
}