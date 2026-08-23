import React from "react";

const MANPOWER_CATEGORIES = [
  "Researcher",
  "JRF",
  "SRF",
  "Technician",
  "Project Assistant",
  "Other",
];

const Manpower = ({
  formData,
  handleChange,
  handleManpowerChange,
  addManpowerRow,
  removeManpowerRow,
}) => {
  return (
    <div className="form-section">

      {/* ================================
          SECTION TITLE
      ================================= */}

      <h3>7. Manpower Allocation</h3>

      <p style={{ color: "#666" }}>
        Track researchers, JRFs, and technicians
        allocated to this project.
      </p>

      {/* ================================
          NUMBER OF RESEARCHERS
      ================================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "250px",
          marginBottom: "15px",
        }}
      >
        <div>
          <label>Number of Researchers</label>

          <input
            type="number"
            name="numResearchers"
            value={formData.numResearchers || ""}
            onChange={handleChange}
            placeholder="e.g. 4"
          />
        </div>
      </div>

      {/* ================================
          DESCRIPTION
      ================================= */}

      <p
        style={{
          fontSize: "13px",
          color: "#666",
          marginBottom: "10px",
        }}
      >
        Manpower engaged under the project — add one
        row per person.
      </p>

      {/* ================================
          MANPOWER TABLE
      ================================= */}

      <div
        style={{
          overflowX: "auto",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        <table className="budget-table">

          {/* ============================
              TABLE HEADER
          ============================ */}

          <thead>
            <tr>
              <th>Category</th>
              <th>Name</th>
              <th>Designation</th>
              <th>Area of Specialisation</th>
              <th></th>
            </tr>
          </thead>

          {/* ============================
              TABLE BODY
          ============================ */}

          <tbody>

            {formData.manpower?.map(
              (member, index) => (

                <tr key={index}>

                  {/* Category */}

                  <td>
                    <select
                      value={member.category}
                      onChange={(e) =>
                        handleManpowerChange(
                          index,
                          "category",
                          e.target.value
                        )
                      }
                    >
                      {MANPOWER_CATEGORIES.map(
                        (item) => (
                          <option
                            key={item}
                            value={item}
                          >
                            {item}
                          </option>
                        )
                      )}
                    </select>
                  </td>

                  {/* Name */}

                  <td>
                    <input
                      type="text"
                      value={member.name}
                      placeholder="Name"
                      onChange={(e) =>
                        handleManpowerChange(
                          index,
                          "name",
                          e.target.value
                        )
                      }
                    />
                  </td>

                  {/* Designation */}

                  <td>
                    <input
                      type="text"
                      value={member.designation}
                      placeholder="Designation"
                      onChange={(e) =>
                        handleManpowerChange(
                          index,
                          "designation",
                          e.target.value
                        )
                      }
                    />
                  </td>

                  {/* Specialisation */}

                  <td>
                    <input
                      type="text"
                      value={member.specialisation}
                      placeholder="Area of Specialisation"
                      onChange={(e) =>
                        handleManpowerChange(
                          index,
                          "specialisation",
                          e.target.value
                        )
                      }
                    />
                  </td>

                  {/* Remove */}

                  <td>
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() =>
                        removeManpowerRow(index)
                      }
                    >
                      ✕
                    </button>
                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>
      </div>

      {/* ================================
          ADD MANPOWER
      ================================= */}

      <button
        type="button"
        className="btn btn-ghost btn-sm"
        style={{
          marginTop: "10px",
        }}
        onClick={addManpowerRow}
      >
        + Add Manpower
      </button>

    </div>
  );
};

export default Manpower;