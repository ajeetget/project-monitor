import { useEffect, useState } from "react";
import { getStage } from "../utils.js";

export default function Verticals({
  verticals = [],
  setVerticals,
  projects = [],
}) {
  // =========================================================
  // 1. SAFE DATA
  // =========================================================

  const safeVerticals = Array.isArray(verticals)
    ? verticals
    : [];

  const safeProjects = Array.isArray(projects)
    ? projects
    : projects?.projects || [];

  // =========================================================
  // 2. STATE
  // =========================================================

  // Only stores NEW / UNSAVED vertical input fields
  const [draft, setDraft] = useState([]);

  // =========================================================
  // 3. ADD NEW VERTICAL INPUT
  // =========================================================

  function addVertical() {
    setDraft((prev) => [...prev, ""]);
  }

  // =========================================================
  // 4. UPDATE NEW VERTICAL INPUT
  // =========================================================

  function updateName(index, value) {
    setDraft((prev) => {
      const copy = [...prev];

      copy[index] = value;

      return copy;
    });
  }

  // =========================================================
  // 5. REMOVE NEW VERTICAL INPUT
  // =========================================================

  function removeDraft(index) {
    setDraft((prev) =>
      prev.filter((_, i) => i !== index)
    );
  }

  // =========================================================
  // 6. SAVE VERTICALS TO DATABASE
  // =========================================================

  async function save() {
    try {
      // Remove empty inputs
      const names = draft
        .map((name) => name.trim())
        .filter(Boolean);

      // Nothing entered
      if (names.length === 0) {
        alert("Please enter at least one vertical.");
        return;
      }

      const createdVerticals = [];

      // Save each vertical
      for (const name of names) {
        const response = await fetch(
          "http://localhost:5000/api/verticals",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              name,
            }),
          }
        );

        const data = await response.json();

        // API error
        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to save vertical"
          );
        }

        // Store newly created vertical
        if (data.vertical) {
          createdVerticals.push(
            data.vertical
          );
        }
      }

      // =====================================================
      // UPDATE PARENT STATE
      // =====================================================

      if (setVerticals) {
        setVerticals([
          ...safeVerticals,
          ...createdVerticals,
        ]);
      }

      // =====================================================
      // CLEAR INPUT FIELDS
      // =====================================================

      setDraft([]);

      alert(
        "Vertical names saved successfully."
      );
    } catch (error) {
      console.error(
        "Save vertical error:",
        error
      );

      alert(error.message);
    }
  }

  // =========================================================
  // 7. PROJECT COUNTS
  // =========================================================

  const countsByVertical = {};

  safeProjects.forEach((project) => {
    if (!project) return;

    const vertical =
      project.vertical || "Unassigned";

    if (!countsByVertical[vertical]) {
      countsByVertical[vertical] = {
        total: 0,
        active: 0,
        closed: 0,
      };
    }

    countsByVertical[vertical].total++;

    const stage =
      typeof getStage === "function"
        ? getStage(project)
        : project.stage;

    if (stage === "active") {
      countsByVertical[
        vertical
      ].active++;
    }

    if (stage === "closed") {
      countsByVertical[
        vertical
      ].closed++;
    }
  });

  // =========================================================
  // 8. UI
  // =========================================================

  return (
    <div>

      {/* =====================================================
          EXISTING VERTICALS
      ===================================================== */}

      <div
        className="panel"
        style={{
          marginBottom: 16,
        }}
      >
        <h3>
          Verticals{" "}
          <span className="tag">
            rename, add, or remove verticals
            used to group projects
          </span>
        </h3>

        {/* Existing verticals */}

        <div
          className="form-grid"
          style={{
            gridTemplateColumns:
              "repeat(4, 1fr)",
          }}
        >
          {safeVerticals.map(
            (vertical, index) => {
              const name =
                typeof vertical === "string"
                  ? vertical
                  : vertical?.name || "";

              return (
                <div
                  className="field"
                  key={
                    vertical?._id ||
                    `${name}-${index}`
                  }
                >
                  <label>
                    Vertical {index + 1}
                  </label>

                  <input
                    value={name}
                    readOnly
                  />
                </div>
              );
            }
          )}
        </div>

        {/* =================================================
            NEW VERTICAL INPUTS
        ================================================= */}

        {draft.map((value, index) => (
          <div
            className="field"
            key={index}
            style={{
              display: "flex",
              gap: 6,
              alignItems: "flex-end",
              marginTop: 12,
            }}
          >
            <div
              style={{
                flex: 1,
              }}
            >
              <label>
                New Vertical {index + 1}
              </label>

              <input
                value={value}
                onChange={(e) =>
                  updateName(
                    index,
                    e.target.value
                  )
                }
                placeholder="Enter vertical name"
              />
            </div>

            <button
              type="button"
              className="icon-btn"
              onClick={() =>
                removeDraft(index)
              }
              title="Remove"
            >
              ✕
            </button>
          </div>
        ))}

        {/* =================================================
            ACTION BUTTONS
        ================================================= */}

        <div
          className="form-actions"
          style={{
            justifyContent:
              "space-between",
            marginTop: 16,
          }}
        >
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={addVertical}
          >
            + Add Vertical
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={save}
            disabled={draft.length === 0}
          >
            Save Vertical Names
          </button>
        </div>
      </div>

      {/* =====================================================
          PROJECT COUNTS
      ===================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill,minmax(220px,1fr))",
          gap: 14,
        }}
      >
        {safeVerticals.map(
          (vertical, index) => {
            const name =
              typeof vertical === "string"
                ? vertical
                : vertical?.name || "";

            const count =
              countsByVertical[name] || {
                total: 0,
                active: 0,
                closed: 0,
              };

            return (
              <div
                className="panel"
                key={
                  vertical?._id ||
                  `${name}-${index}`
                }
              >
                <h3
                  style={{
                    fontSize: 13,
                  }}
                >
                  {name}
                </h3>

                <div className="small muted">
                  Total projects:{" "}
                  <b>{count.total}</b>
                </div>

                <div className="small muted">
                  Active:{" "}
                  <b>{count.active}</b>
                </div>

                <div className="small muted">
                  Closed:{" "}
                  <b>{count.closed}</b>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}