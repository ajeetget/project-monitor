import React from "react";

const Closure = ({
  formData,
  handleChange,
  handleClosureMeetingChange,
  addClosureMeetingRow,
  removeClosureMeeting,
}) => {
  return (
    <div className="form-section">

      {/* =================================
          SECTION TITLE
      ================================= */}

      <h3>10. Project Closure</h3>

      <p
        className="small muted"
        style={{ marginBottom: 8 }}
      >
        Closure-stage committee meetings
        (approval of closure) — add as many as
        needed:
      </p>

      <div
        style={{
          display: "grid",
          gap: "15px",
        }}
      >

        {/* =================================
            CLOSURE COMMITTEE MEETINGS
        ================================= */}

        {formData.closureMeetings?.map(
          (meeting, index) => (

            <div
              key={index}
              className="msub-row"
              style={{
                display: "grid",
                gridTemplateColumns:
                  "170px 140px 1fr 1fr 40px",
                gap: "10px",
                marginBottom: "10px",
              }}
            >

              {/* Committee Type */}

              <select
                value={meeting.type}
                onChange={(e) =>
                  handleClosureMeetingChange(
                    index,
                    "type",
                    e.target.value
                  )
                }
              >
                <option value="Closure TEC">
                  Closure TEC
                </option>

                <option value="Closure RAB">
                  Closure RAB
                </option>

                <option value="Closure GC">
                  Closure GC
                </option>
              </select>

              {/* Meeting Date */}

              <input
                type="date"
                value={meeting.date}
                onChange={(e) =>
                  handleClosureMeetingChange(
                    index,
                    "date",
                    e.target.value
                  )
                }
              />

              {/* Minutes */}

              <input
                type="text"
                placeholder="Local file path to minutes"
                value={meeting.minutes}
                onChange={(e) =>
                  handleClosureMeetingChange(
                    index,
                    "minutes",
                    e.target.value
                  )
                }
              />

              {/* Remarks */}

              <input
                type="text"
                placeholder="Remarks"
                value={meeting.remarks}
                onChange={(e) =>
                  handleClosureMeetingChange(
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
                  removeClosureMeeting(index)
                }
              >
                ✕
              </button>

            </div>
          )
        )}

        {/* Add Closure Meeting */}

        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={addClosureMeetingRow}
        >
          + Add Closure Committee Meeting
        </button>

        {/* =================================
            CLOSURE MILESTONES
        ================================= */}

        <div
          className="small muted"
          style={{
            margin: "14px 0 8px",
            borderTop: "1px solid #ddd",
            paddingTop: "12px",
          }}
        >
          Closure milestones
        </div>

        <div className="form-grid">

          {/* Technical Closure Date */}

          <div className="field">

            <label>
              Technical Closure Date
            </label>

            <input
              type="date"
              name="techCloseDate"
              value={
                formData.techCloseDate || ""
              }
              onChange={handleChange}
            />

          </div>

          {/* Technical Closure Remarks */}

          <div className="field span2">

            <label>
              Technical Closure Remarks
            </label>

            <input
              name="techCloseRemarks"
              value={
                formData.techCloseRemarks || ""
              }
              onChange={handleChange}
            />

          </div>

          {/* Financial Closure Date */}

          <div className="field">

            <label>
              Financial Closure Date
            </label>

            <input
              type="date"
              name="finCloseDate"
              value={
                formData.finCloseDate || ""
              }
              onChange={handleChange}
            />

          </div>

          {/* Financial Closure Remarks */}

          <div className="field span2">

            <label>
              Financial Closure Remarks
            </label>

            <input
              name="finCloseRemarks"
              value={
                formData.finCloseRemarks || ""
              }
              onChange={handleChange}
            />

          </div>

          {/* Administrative Closure Date */}

          <div className="field">

            <label>
              Administrative Closure Date
            </label>

            <input
              type="date"
              name="admCloseDate"
              value={
                formData.admCloseDate || ""
              }
              onChange={handleChange}
            />

          </div>

          {/* Administrative Closure Remarks */}

          <div className="field span2">

            <label>
              Administrative Closure Remarks
            </label>

            <input
              name="admCloseRemarks"
              value={
                formData.admCloseRemarks || ""
              }
              onChange={handleChange}
            />

          </div>

        </div>

        {/* =================================
            LAB RECOMMENDATION
        ================================= */}

        <div
          className="small muted"
          style={{
            margin: "14px 0 8px",
            borderTop: "1px solid #ddd",
            paddingTop: "12px",
          }}
        >
          Lab Recommendation
        </div>

        <div className="form-grid">

          {/* Recommendation Received */}

          <div className="field">

            <label>
              Lab Recommendation Received
            </label>

            <select
              name="labRecReceived"
              value={
                formData.labRecReceived || ""
              }
              onChange={handleChange}
            >

              <option value="">
                — Not specified —
              </option>

              <option value="Yes">
                Yes
              </option>

              <option value="No">
                No
              </option>

            </select>

          </div>

          {/* If YES */}

          {formData.labRecReceived === "Yes" && (

            <div className="field span2">

              <label>
                Comments of the Lab
              </label>

              <input
                name="labRecComments"
                value={
                  formData.labRecComments || ""
                }
                onChange={handleChange}
                placeholder="Lab's recommendation comments"
              />

            </div>

          )}

          {/* If NO */}

          {formData.labRecReceived === "No" && (

            <div className="field span2">

              <label>
                Reason for Not Getting
              </label>

              <input
                name="labRecReason"
                value={
                  formData.labRecReason || ""
                }
                onChange={handleChange}
                placeholder="Reason recommendation was not received"
              />

            </div>

          )}

        </div>

        {/* =================================
            TECHNOLOGY READINESS
        ================================= */}

        <div
          className="small muted"
          style={{
            margin: "14px 0 8px",
            borderTop: "1px solid #ddd",
            paddingTop: "12px",
          }}
        >
          Technology readiness at closure
        </div>

        <div className="form-grid">

          {/* Final TRL */}

          <div className="field">

            <label>
              Final TRL Level
            </label>

            <select
              name="finalTRL"
              value={formData.finalTRL || ""}
              onChange={handleChange}
            >

              <option value="">
                — Not specified —
              </option>

              <option value="TRL 1">
                TRL 1 — Basic principles observed
              </option>

              <option value="TRL 2">
                TRL 2 — Technology concept formulated
              </option>

              <option value="TRL 3">
                TRL 3 — Experimental proof of concept
              </option>

              <option value="TRL 4">
                TRL 4 — Validated in lab
              </option>

              <option value="TRL 5">
                TRL 5 — Validated in relevant environment
              </option>

              <option value="TRL 6">
                TRL 6 — Demonstrated in relevant environment
              </option>

              <option value="TRL 7">
                TRL 7 — Demonstrated in operational environment
              </option>

              <option value="TRL 8">
                TRL 8 — System complete and qualified
              </option>

              <option value="TRL 9">
                TRL 9 — Actual system proven in operation
              </option>

            </select>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Closure;