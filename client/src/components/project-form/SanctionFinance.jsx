import React from "react";

const SanctionFinance = ({ formData, handleChange }) => {
  return (
    <div className="form-section">

      <h3>3. Sanction & Finance</h3>

      {/* =========================
          TOP FIELDS
      ========================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "15px",
        }}
      >

        {/* 1. Sanction Date */}

        <div>
          <label>Sanction Date</label>

          <input
            type="date"
            name="sanctionDate"
            value={formData.sanctionDate || ""}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px",
            }}
          />
        </div>

        {/* 2. Sanctioned Amount */}

        <div>
          <label>Sanctioned Amount (₹)</label>

          <input
            type="text"
            name="sanctionedAmount"
            value={formData.sanctionedAmount || ""}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px",
            }}
          />
        </div>

        {/* 3. Sanction Letter */}

        <div>
          <label>
            Sanction Letter (local file path)
          </label>

          <input
            type="text"
            name="sanctionLetter"
            value={formData.sanctionLetter || ""}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px",
            }}
          />
        </div>

        {/* 4. Project Start Date / First Fund Release Date */}

        <div>
          <label>
            Project Start Date / 1st Fund Release Date
          </label>

          <input
            type="date"
            name="projectStartDate"
            value={formData.projectStartDate || ""}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px",
            }}
          />
        </div>

      </div>

      {/* =========================
          5. EQUIPMENT LIST
      ========================= */}

      <div style={{ marginTop: "15px" }}>

        <label>Equipment List</label>

        <textarea
          name="equipmentList"
          rows="4"
          placeholder="One item per line, e.g. UV-Vis Spectrophotometer Rotary Evaporator"
          value={formData.equipmentList || ""}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "8px",
          }}
        />

      </div>

    </div>
  );
};

export default SanctionFinance;