import React from "react";

const Deliverables = ({
  formData,
  handleChange,
  handleDeliverableChange,
  addDeliverableRow,
  removeDeliverableRow,
}) => {
  return (
    <div className="form-section">

      {/* ================================
          SECTION TITLE
      ================================= */}

      <h3>
        4. Deliverables & Milestones (after sanction)
      </h3>

      {/* ================================
          DESCRIPTION
      ================================= */}

      <p
        style={{
          color: "#666",
          fontSize: "12px",
        }}
      >
        List each deliverable or milestone with its target
        date and current status. A visual timeline is
        auto-generated from this list in the project view.
      </p>

      {/* ================================
          DELIVERABLE ROWS
      ================================= */}

      {formData.deliverables?.map((item, index) => (

        <div
          key={index}
          className="msub-row"
          style={{
            display: "grid",
            gridTemplateColumns:
              "1.6fr 130px 130px 1.2fr 32px",
            gap: "10px",
            marginBottom: "10px",
            alignItems: "center",
          }}
        >

          {/* Deliverable / Milestone */}

          <input
            type="text"
            placeholder="Deliverable / milestone description"
            value={item.description}
            onChange={(e) =>
              handleDeliverableChange(
                index,
                "description",
                e.target.value
              )
            }
          />

          {/* Target Date */}

          <input
            type="date"
            value={item.targetDate}
            onChange={(e) =>
              handleDeliverableChange(
                index,
                "targetDate",
                e.target.value
              )
            }
          />

          {/* Status */}

          <select
            value={item.status}
            onChange={(e) =>
              handleDeliverableChange(
                index,
                "status",
                e.target.value
              )
            }
          >
            <option value="Pending">
              Pending
            </option>

            <option value="In Progress">
              In Progress
            </option>

            <option value="Achieved">
              Achieved
            </option>

            <option value="Delayed">
              Delayed
            </option>
          </select>

          {/* Remarks */}

          <input
            type="text"
            placeholder="Remarks"
            value={item.remarks}
            onChange={(e) =>
              handleDeliverableChange(
                index,
                "remarks",
                e.target.value
              )
            }
          />

          {/* Remove */}

          <button
            type="button"
            className="icon-btn"
            onClick={() =>
              removeDeliverableRow(index)
            }
          >
            ✕
          </button>

        </div>

      ))}

      {/* ================================
          ADD DELIVERABLE
      ================================= */}

      <button
        type="button"
        className="btn btn-ghost btn-sm"
        onClick={addDeliverableRow}
      >
        + Add Deliverable / Milestone
      </button>

      {/* ================================
          PERT / GANTT
      ================================= */}

      <div
        className="form-grid"
        style={{
          marginTop: "16px",
          borderTop: "1px solid #ddd",
          paddingTop: "14px",
        }}
      >

        <div className="field span3">

          <label>
            PERT / GANTT Chart (local file path)
          </label>

          <input
            type="text"
            name="pertGanttLink"
            value={formData.pertGanttLink || ""}
            onChange={handleChange}
            placeholder={
              "e.g. D:\\RD-Projects\\Charts\\Gantt_014.xlsx or .mpp / .pdf"
            }
          />

        </div>

      </div>

    </div>
  );
};

export default Deliverables;