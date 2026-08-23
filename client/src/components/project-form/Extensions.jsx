import React from "react";

const Extensions = ({
  formData,
  handlePdcExtensionChange,
  addPdcExtensionRow,
  removePdcExtension,

  handleRevisedSanctionChange,
  addRevisedSanctionRow,
  removeRevisedSanction,
}) => {
  return (
    <div className="form-section">

      {/* =================================
          SECTION TITLE
      ================================= */}

      <h3>8. Extensions & Revisions</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "15px",
        }}
      >

        {/* =================================
            PDC EXTENSIONS
        ================================= */}

        <p
          style={{
            marginBottom: "8px",
            fontSize: "13px",
            color: "#666",
          }}
        >
          PDC Extension(s) (if any) — add one row
          per extension
        </p>

        {/* PDC Extension Rows */}

        {formData.pdcExtensions?.map(
          (ext, index) => (

            <div
              key={index}
              className="msub-row"
              style={{
                display: "grid",
                gridTemplateColumns:
                  "130px 150px 130px 1.3fr 32px",
                gap: "10px",
                marginBottom: "10px",
              }}
            >

              {/* Extension Date */}

              <input
                type="date"
                value={ext.date}
                onChange={(e) =>
                  handlePdcExtensionChange(
                    index,
                    "date",
                    e.target.value
                  )
                }
              />

              {/* Extension Period */}

              <input
                type="text"
                placeholder="Period of extension"
                value={ext.period}
                onChange={(e) =>
                  handlePdcExtensionChange(
                    index,
                    "period",
                    e.target.value
                  )
                }
              />

              {/* Revised PDC */}

              <input
                type="date"
                value={ext.revisedPDC}
                onChange={(e) =>
                  handlePdcExtensionChange(
                    index,
                    "revisedPDC",
                    e.target.value
                  )
                }
              />

              {/* Remarks */}

              <input
                type="text"
                placeholder="Remarks"
                value={ext.remarks}
                onChange={(e) =>
                  handlePdcExtensionChange(
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
                  removePdcExtension(index)
                }
              >
                ✕
              </button>

            </div>
          )
        )}

        {/* Add PDC Extension */}

        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={addPdcExtensionRow}
        >
          + Add PDC Extension
        </button>

        {/* =================================
            REVISED SANCTIONS
        ================================= */}

        <div
          style={{
            margin: "18px 0 8px",
            borderTop: "1px solid #ddd",
            paddingTop: "14px",
            fontSize: "13px",
            color: "#666",
          }}
        >
          Revised Sanction(s) (if any) — add one
          row per revision
        </div>

        {/* Revised Sanction Rows */}

        {formData.revisedSanctions?.map(
          (rev, index) => (

            <div
              key={index}
              className="msub-row"
              style={{
                display: "grid",
                gridTemplateColumns:
                  "140px 160px 1.6fr 32px",
                gap: "10px",
                marginBottom: "10px",
              }}
            >

              {/* Date */}

              <input
                type="date"
                value={rev.date}
                onChange={(e) =>
                  handleRevisedSanctionChange(
                    index,
                    "date",
                    e.target.value
                  )
                }
              />

              {/* Revised Amount */}

              <input
                type="number"
                step="0.01"
                placeholder="Revised amount (₹)"
                value={rev.amount}
                onChange={(e) =>
                  handleRevisedSanctionChange(
                    index,
                    "amount",
                    e.target.value
                  )
                }
              />

              {/* Revised Sanction Letter */}

              <input
                type="text"
                placeholder="Local file path to revised sanction letter"
                value={rev.letter}
                onChange={(e) =>
                  handleRevisedSanctionChange(
                    index,
                    "letter",
                    e.target.value
                  )
                }
              />

              {/* Remove */}

              <button
                type="button"
                className="icon-btn"
                onClick={() =>
                  removeRevisedSanction(index)
                }
              >
                ✕
              </button>

            </div>
          )
        )}

        {/* Add Revised Sanction */}

        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={addRevisedSanctionRow}
        >
          + Add Revised Sanction
        </button>

      </div>
    </div>
  );
};

export default Extensions;