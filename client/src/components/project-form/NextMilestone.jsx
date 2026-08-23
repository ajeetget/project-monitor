import React from "react";

const NextMilestone = ({
  formData,
  handleChange,
}) => {
  return (
    <div className="form-section">

      {/* =================================
          SECTION TITLE
      ================================= */}

      <h3>11. Next Milestone (Dashboard Reminder)</h3>

      <p style={{ color: "#666" }}>
        This upcoming milestone will automatically
        reflect on your main dashboard calendar and
        reminder list.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "20px",
        }}
      >

        {/* =================================
            TYPE
        ================================= */}

        <div>

          <label>
            Type
          </label>

          <select
            style={{
              width: "100%",
            }}
            name="nextMilestoneType"
            value={
              formData.nextMilestoneType || ""
            }
            onChange={handleChange}
          >

            <option value="">
              —
            </option>

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

            <option value="Fund Release">
              Fund Release
            </option>

            <option value="Technical Closure">
              Technical Closure
            </option>

            <option value="Financial Closure">
              Financial Closure
            </option>

            <option value="Administrative Closure">
              Administrative Closure
            </option>

            <option value="Other">
              Other
            </option>

          </select>

        </div>

        {/* =================================
            DATE
        ================================= */}

        <div>

          <label>
            Date
          </label>

          <input
            type="date"
            name="nextMilestoneDate"
            value={
              formData.nextMilestoneDate || ""
            }
            onChange={handleChange}
            style={{
              width: "100%",
            }}
          />

        </div>

        {/* =================================
            DESCRIPTION
        ================================= */}

        <div>

          <label>
            Description
          </label>

          <input
            type="text"
            name="nextMilestoneDescription"
            value={
              formData.nextMilestoneDescription || ""
            }
            onChange={handleChange}
            placeholder="Short note"
            style={{
              width: "100%",
            }}
          />

        </div>

      </div>

    </div>
  );
};

export default NextMilestone;