import React from "react";

const ProjectIdentity = ({
  formData,
  handleChange,
  verticals = [],
}) => {
  return (
    <div className="form-section">
      <h2>Project Identity</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "15px",
        }}
      >
        {/* =====================================================
            1. PROJECT ID / CODE
        ===================================================== */}

        <div>
          <label>Project ID / Code</label>

          <input
            type="text"
            name="code"
            value={formData.code || ""}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px",
            }}
          />
        </div>

        {/* ================  2. PROJECT TITLE ================= */}

        <div>
          <label>Project Title *</label>

          <input
            type="text"
            name="title"
            value={formData.title || ""}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "8px",
            }}
          />
        </div>

        {/* ================= 3. VERTICAL ================= */}

        <div>
          <label>Vertical</label>

          <select
            name="verticalId"
            value={formData.verticalId || ""}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px",
            }}
          >
            <option value="">
              Select Vertical...
            </option>

            {verticals.map((vertical) => (
              <option
                key={vertical._id}
                value={vertical._id}
              >
                {vertical.name}
              </option>
            ))}
          </select>
        </div>

        {/* ================== 4. PROJECT DURATION  ============== */}

        <div>
          <label>Project Duration</label>

          <input
            type="text"
            name="projectDuration"
            value={formData.projectDuration || ""}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px",
            }}
          />
        </div>

        {/* =====================================================
            5. PRINCIPAL INVESTIGATOR
        ===================================================== */}

        <div>
          <label>Principal Investigator (PI)</label>

          <input
            type="text"
            name="piName"
            value={formData.piName || ""}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px",
            }}
          />
        </div>

        {/* =====================================================
            6. PI INSTITUTE NAME
        ===================================================== */}

        <div>
          <label>PI Institute Name</label>

          <input
            type="text"
            name="piInstituteName"
            value={formData.piInstituteName || ""}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px",
            }}
          />
        </div>

        {/* =====================================================
            7. CO-PI(S)
        ===================================================== */}

        <div>
          <label>CO-PI(s)</label>

          <input
            type="text"
            name="coPiName"
            value={formData.coPiName || ""}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px",
            }}
          />
        </div>

        {/* =====================================================
            8. CO-PI INSTITUTE
        ===================================================== */}

        <div>
          <label>Co-PI Institute</label>

          <input
            type="text"
            name="coPiInstitute"
            value={formData.coPiInstitute || ""}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px",
            }}
          />
        </div>

        {/* =====================================================
            9. STAKEHOLDING DRDO LAB(S)
        ===================================================== */}

        <div>
          <label>Stakeholding DRDO Lab(s)</label>

          <input
            type="text"
            name="stakeholdingDrdoLabs"
            value={
              formData.stakeholdingDrdoLabs || ""
            }
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px",
            }}
          />
        </div>

        {/* =====================================================
            10. STAKEHOLDING SCIENTIST
        ===================================================== */}

        <div>
          <label>Stakeholding Scientist</label>

          <input
            type="text"
            name="stakeholdingScientist"
            value={
              formData.stakeholdingScientist || ""
            }
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px",
            }}
          />
        </div>

        {/* =====================================================
            11. PROJECT STATUS
        ===================================================== */}

        <div>
          <label>Project Status</label>

          <select
            name="projectStatus"
            value={formData.projectStatus || ""}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px",
            }}
          >
            <option value="">
              Select Project Status...
            </option>

            <option value="Sanctioned">
              Sanctioned
            </option>

            <option value="Ongoing">
              Ongoing
            </option>

            <option value="Completed">
              Completed
            </option>

            <option value="Closed">
              Closed
            </option>

            <option value="On Hold">
              On Hold
            </option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProjectIdentity;