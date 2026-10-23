import React from "react";

// =========================================================
// DEFAULT OPTIONS
// =========================================================

const DEFAULT_OPTIONS = [
  "Manpower",
  "Equipment",
  "Consumables",
  "Travel",
  "Contingency",
  "Other",
];

// =========================================================
// BUDGET DETAILS
// =========================================================

const BudgetDetails = ({
  budgetYears = 1,
  budgetRows = [],
  changeBudgetYears,
  addBudgetRow,
  removeBudgetRow,
  handleBudgetHeadChange,
  handleBudgetInstituteChange,
  handleBudgetValueChange,
  getYearTotal,
  getGrandTotal,
}) => {

  // =======================================================
  // SAFE DATA
  // =======================================================

  const safeBudgetYears =
    Number(budgetYears) || 1;

  const safeBudgetRows =
    Array.isArray(
      budgetRows
    )
      ? budgetRows
      : [];

  // =======================================================
  // RENDER
  // =======================================================

  return (

    <div
      className="budget-section"
    >

      {/* =================================================
          TITLE
      ================================================= */}

      <h4>
        Budget Details
      </h4>

      {/* =================================================
          TOOLBAR
      ================================================= */}

      <div
        className="budget-toolbar"
      >

        <span
          className="budget-label"
        >
          Budget Years
          (expand up to
          project duration):
        </span>

        {/* ===============================================
            REMOVE YEAR
        =============================================== */}

        <button
          type="button"
          className="btn-year"
          onClick={() =>
            changeBudgetYears(
              -1
            )
          }
          disabled={
            safeBudgetYears <=
            1
          }
        >
          − Year
        </button>

        {/* ===============================================
            YEAR COUNT
        =============================================== */}

        <span
          className="year-count"
        >
          {safeBudgetYears}{" "}
          Year
          {safeBudgetYears >
            1 && "s"}
        </span>

        {/* ===============================================
            ADD YEAR
        =============================================== */}

        <button
          type="button"
          className="btn-year"
          onClick={() =>
            changeBudgetYears(
              1
            )
          }
        >
          + Year
        </button>

        {/* ===============================================
            ADD ROW
        =============================================== */}

        <button
          type="button"
          className="btn-add"
          onClick={
            addBudgetRow
          }
        >
          + Add Row
        </button>

      </div>

      {/* =================================================
          NOTE
      ================================================= */}

      <p
        className="budget-note"
      >
        Budget Sanction Details
        (₹ in Lakhs)
      </p>

      {/* =================================================
          TABLE
      ================================================= */}

      <div
        className="table-wrapper"
      >

        <table
          className="budget-table"
        >

          {/* =============================================
              HEADER
          ============================================= */}

          <thead>

            <tr>

              <th>
                Expenditure Head
              </th>

              <th
                style={{
                  minWidth:
                    "140px",
                }}
              >
                Institute
              </th>

              {/* DYNAMIC YEARS */}

              {Array.from({
                length:
                  safeBudgetYears,
              }).map(
                (
                  _,
                  index
                ) => (

                  <th
                    key={
                      index
                    }
                  >
                    Year{" "}
                    {index + 1}
                  </th>

                )
              )}

              <th>
                Total
              </th>

              <th></th>

            </tr>

          </thead>

          {/* =============================================
              BODY
          ============================================= */}

          <tbody>

            {safeBudgetRows.length ===
            0 ? (

              <tr>

                <td
                  colSpan={
                    safeBudgetYears +
                    4
                  }
                  style={{
                    textAlign:
                      "center",
                    padding:
                      "20px",
                  }}
                >
                  No budget rows.
                  Click
                  <strong>
                    {" "}
                    + Add Row
                  </strong>{" "}
                  to add one.
                </td>

              </tr>

            ) : (

              safeBudgetRows.map(
                (
                  row,
                  rowIndex
                ) => {

                  // =====================================
                  // SAFE OPTIONS
                  // =====================================

                  const safeOptions =
                    Array.isArray(
                      row?.options
                    )
                      ? row.options
                      : DEFAULT_OPTIONS;

                  // =====================================
                  // SAFE YEARS
                  // =====================================

                  const safeYears =
                    Array.isArray(
                      row?.years
                    )
                      ? row.years
                      : [];

                  return (

                    <tr
                      key={
                        row?._id ||
                        rowIndex
                      }
                    >

                      {/* ===============================
                          EXPENDITURE HEAD
                      ================================ */}

                      <td>

                        <select
                          style={{
                            width:
                              "100%",
                          }}
                          value={
                            row?.head ||
                            "Manpower"
                          }
                          onChange={(
                            e
                          ) =>
                            handleBudgetHeadChange(
                              rowIndex,
                              e.target.value
                            )
                          }
                        >

                          {safeOptions.map(
                            (
                              option
                            ) => (

                              <option
                                key={
                                  option
                                }
                                value={
                                  option
                                }
                              >
                                {
                                  option
                                }
                              </option>

                            )
                          )}

                        </select>

                      </td>

                      {/* ===============================
                          INSTITUTE
                      ================================ */}

                      <td>

                        <input
                          type="text"
                          value={
                            row?.institute ||
                            ""
                          }
                          onChange={(
                            e
                          ) =>
                            handleBudgetInstituteChange(
                              rowIndex,
                              e.target.value
                            )
                          }
                        />

                      </td>

                      {/* ===============================
                          YEAR VALUES
                      ================================ */}

                      {Array.from({
                        length:
                          safeBudgetYears,
                      }).map(
                        (
                          _,
                          yearIndex
                        ) => (

                          <td
                            key={
                              yearIndex
                            }
                          >

                            <input
                              type="number"
                              value={
                                safeYears[
                                  yearIndex
                                ] ??
                                ""
                              }
                              onChange={(
                                e
                              ) =>
                                handleBudgetValueChange(
                                  rowIndex,
                                  yearIndex,
                                  e.target.value
                                )
                              }
                            />

                          </td>

                        )
                      )}

                      {/* ===============================
                          TOTAL
                      ================================ */}

                      <td>

                        {Number(
                          row?.total ||
                            0
                        ).toFixed(
                          2
                        )}

                      </td>

                      {/* ===============================
                          DELETE
                      ================================ */}

                      <td>

                        <button
                          type="button"
                          className="btn-delete"
                          onClick={() =>
                            removeBudgetRow(
                              rowIndex
                            )
                          }
                        >
                          ✕
                        </button>

                      </td>

                    </tr>

                  );
                }
              )

            )}

          </tbody>

          {/* =============================================
              FOOTER
          ============================================= */}

          <tfoot>

            <tr
              style={{
                background:
                  "#f5f5f5",
                fontWeight:
                  "bold",
              }}
            >

              {/* LABEL  */}

              <td>
                Grand Total
              </td>

               {/* INSTITUTE  */}

              <td></td>

              {/* YEAR TOTALS */}

              {Array.from({
                length:
                  safeBudgetYears,
              }).map(
                (
                  _,
                  yearIndex
                ) => (

                  <td
                    key={
                      yearIndex
                    }
                  >

                    {Number(
                      typeof getYearTotal ===
                        "function"
                        ? getYearTotal(
                            yearIndex
                          )
                        : 0
                    ).toFixed(
                      2
                    )}

                  </td>

                )
              )}

              {/* GRAND TOTAL */}

              <td>

                {Number(
                  typeof getGrandTotal ===
                    "function"
                    ? getGrandTotal()
                    : 0
                ).toFixed(
                  2
                )}

              </td>

              <td></td>

            </tr>

          </tfoot>

        </table>

      </div>

   

      <p
        className="budget-footer"
      >
        Default rows cover the
        standard expenditure
        heads. Add extra rows
        if the same head needs
        to be split across more
        than one institute.
      </p>

    </div>
  );
};

export default BudgetDetails;