import React from "react";

const PreSanction = ({
  formData,
  handleChange,
  handleMeetingChange,
  addPreSanctionMeetingRow,
  removeMeeting,
}) => {
  return (
    <div className="form-section">

      {/* =================================
          SECTION TITLE
      ================================= */}

      <h3>
        2. Pre-Sanction Meetings & Clarifications
      </h3>

      <div
        style={{
          display: "grid",
          gap: "15px",
        }}
      >

        {/* =================================
            INITIAL TRL LEVEL
        ================================= */}

        <div>
          <label>
            Initial TRL Level
          </label>

          <select
            name="initialTrlLevel"
            value={formData.initialTrlLevel || ""}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px",
            }}
          >
            <option value="">
              -Not Specified-
            </option>

            <option value="TRL-1">
              TRL-1
            </option>

            <option value="TRL-2">
              TRL-2
            </option>

            <option value="TRL-3">
              TRL-3
            </option>

            <option value="TRL-4">
              TRL-4
            </option>

            <option value="TRL-5">
              TRL-5
            </option>

            <option value="TRL-6">
              TRL-6
            </option>

            <option value="TRL-7">
              TRL-7
            </option>

            <option value="TRL-8">
              TRL-8
            </option>

            <option value="TRL-9">
              TRL-9
            </option>
          </select>
        </div>

        {/* =================================
            DESCRIPTION
        ================================= */}

        <p
          style={{
            fontSize: "12px",
            margin: "0",
          }}
        >
          Add each Pre-TEC, TEC, RAB, GC meeting,
          or ADFA/IFA/Others item held before
          sanction, with its date and minutes/link
          — add as many as needed:
        </p>

        {/* =================================
            MEETING ROWS
        ================================= */}

        <div>

          {formData.preSanctionMeetings?.map(
            (meeting, index) => (

              <div
                key={index}
                className="msub-row"
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "180px 180px 1fr 1fr auto",
                  gap: "10px",
                  marginBottom: "10px",
                  alignItems: "center",
                }}
              >

                {/* Meeting Type */}

                <select
                  value={meeting.type}
                  onChange={(e) =>
                    handleMeetingChange(
                      index,
                      "type",
                      e.target.value
                    )
                  }
                >
                  <option value="Pre-TEC">
                    Pre-TEC
                  </option>

                  <option value="TEC">
                    TEC
                  </option>

                  <option value="RAB">
                    RAB
                  </option>

                  <option value="GC">
                    GC
                  </option>

                  <option value="ADFA/IFA/Others">
                    ADFA/IFA/Others
                  </option>
                </select>

                {/* Meeting Date */}

                <input
                  type="date"
                  value={meeting.date}
                  onChange={(e) =>
                    handleMeetingChange(
                      index,
                      "date",
                      e.target.value
                    )
                  }
                />

                {/* Minutes */}

                <input
                  type="text"
                  placeholder="Minutes / File Path"
                  value={meeting.minutes}
                  onChange={(e) =>
                    handleMeetingChange(
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
                    handleMeetingChange(
                      index,
                      "remarks",
                      e.target.value
                    )
                  }
                />

                {/* Remove */}

                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() =>
                    removeMeeting(index)
                  }
                >
                  ✕
                </button>

              </div>
            )
          )}

        </div>

        {/* =================================
            ADD COMMITTEE MEETING
        ================================= */}

        <button
          type="button"
          className="btn-ghost"
          onClick={addPreSanctionMeetingRow}
        >
          + Add Committee Meeting
        </button>

      </div>
    </div>
  );
};

export default PreSanction;