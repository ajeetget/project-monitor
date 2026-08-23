import React from "react";

const GeneralRemarks = ({
  formData,
  handleChange,
}) => {
  return (
    <div className="form-section">

      <h3>12. General Remarks</h3>

      <div>
        <label>
          Additional Notes / Remarks
        </label>

        <textarea
          name="remarks"
          rows="5"
          value={formData.remarks || ""}
          onChange={handleChange}
          placeholder="Any other project observations..."
          style={{
            width: "100%",
            padding: "8px",
          }}
        />
      </div>

    </div>
  );
};

export default GeneralRemarks;