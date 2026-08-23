import React from "react";

const PostSanction = ({
  formData,
  handlePostMeetingChange,
  addPostSanctionMeetingRow,
  removePostMeeting,
}) => {
  return (
    <div className="form-section">

      {/* ================================
          SECTION TITLE
      ================================= */}

      <h3>6. Post Sanction Requirements</h3>

      <div
        style={{
          display: "grid",
          gap: "15px",
        }}
      >

        {/* ================================
            DESCRIPTION
        ================================= */}

        <p
          style={{
            marginBottom: "8px",
            fontSize: "13px",
            color: "#666",
          }}
        >
          Add each TEC, RAB, or GC meeting held after
          sanction, with its date and minutes — add as
          many as needed per committee.
        </p>

        {/* ================================
            MEETING ROWS
        ================================= */}

        {formData.postSanctionMeetings?.map(
          (meeting, index) => (

            <div
              key={index}
              className="msub-row"
              style={{
                display: "grid",
                gridTemplateColumns:
                  "180px 170px 1fr 1fr auto",
                gap: "10px",
                marginBottom: "10px",
                alignItems: "center",
              }}
            >

              {/* ==========================
                  COMMITTEE TYPE
              =========================== */}

              <select
                value={meeting.type}
                onChange={(e) =>
                  handlePostMeetingChange(
                    index,
                    "type",
                    e.target.value
                  )
                }
              >
                <option value="TEC">
                  TEC
                </option>

                <option value="RAB">
                  RAB
                </option>

                <option value="GC">
                  GC
                </option>
              </select>

              {/* ==========================
                  DATE
              =========================== */}

              <input
                type="date"
                value={meeting.date}
                onChange={(e) =>
                  handlePostMeetingChange(
                    index,
                    "date",
                    e.target.value
                  )
                }
              />

              {/* ==========================
                  MINUTES
              =========================== */}

              <input
                type="text"
                placeholder="Local file path"
                value={meeting.minutes}
                onChange={(e) =>
                  handlePostMeetingChange(
                    index,
                    "minutes",
                    e.target.value
                  )
                }
              />

              {/* ==========================
                  REMARKS
              =========================== */}

              <input
                type="text"
                placeholder="Remarks"
                value={meeting.remarks}
                onChange={(e) =>
                  handlePostMeetingChange(
                    index,
                    "remarks",
                    e.target.value
                  )
                }
              />

              {/* ==========================
                  REMOVE
              =========================== */}

              <button
                type="button"
                className="icon-btn"
                onClick={() =>
                  removePostMeeting(index)
                }
              >
                ✕
              </button>

            </div>

          )
        )}

        {/* ================================
            ADD COMMITTEE MEETING
        ================================= */}

        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={addPostSanctionMeetingRow}
        >
          + Add Committee Meeting
        </button>

      </div>

    </div>
  );
};

export default PostSanction;