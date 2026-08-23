import React from "react";

const BudgetDetails = ({
  budgetYears,
  budgetRows,
  changeBudgetYears,
  addBudgetRow,
  removeBudgetRow,
  handleBudgetHeadChange,
  handleBudgetInstituteChange,
  handleBudgetValueChange,
  getYearTotal,
  getGrandTotal,
}) => {
  return (
    <div className="budget-section">

      {/* ================================
          TITLE
      ================================= */}

      <h4>Budget Details</h4>

      {/* ================================
          TOOLBAR
      ================================= */}

      <div className="budget-toolbar">

        <span className="budget-label">
          Budget Years (expand up to project duration):
        </span>

        {/* Remove Year */}

        <button
          type="button"
          className="btn-year"
          onClick={() => changeBudgetYears(-1)}
          disabled={budgetYears <= 1}
        >
          − Year
        </button>

        {/* Year Count */}

        <span className="year-count">
          {budgetYears} Year
          {budgetYears > 1 && "s"}
        </span>

        {/* Add Year */}

        <button
          type="button"
          className="btn-year"
          onClick={() => changeBudgetYears(1)}
        >
          + Year
        </button>

        {/* Add Row */}

        <button
          type="button"
          className="btn-add"
          onClick={addBudgetRow}
        >
          + Add Row
        </button>

      </div>

      {/* ================================
          NOTE
      ================================= */}

      <p className="budget-note">
        Budget Sanction Details (₹ in Lakhs)
      </p>

      {/* ================================
          TABLE
      ================================= */}

      <div className="table-wrapper">

        <table className="budget-table">

          {/* ============================
              HEADER
          ============================ */}

          <thead>

            <tr>

              <th>
                Expenditure Head
              </th>

              <th
                style={{
                  minWidth: "140px",
                }}
              >
                Institute
              </th>

              {/* Dynamic Years */}

              {Array.from({
                length: budgetYears,
              }).map((_, index) => (
                <th key={index}>
                  Year {index + 1}
                </th>
              ))}

              <th>
                Total
              </th>

              <th></th>

            </tr>

          </thead>

          {/* ============================
              BODY
          ============================ */}

          <tbody>

            {budgetRows.map((row, rowIndex) => (

              <tr key={rowIndex}>

                {/* Expenditure Head */}

                <td>

                  <select
                    style={{
                      width: "100%",
                    }}
                    value={row.head}
                    onChange={(e) =>
                      handleBudgetHeadChange(
                        rowIndex,
                        e.target.value
                      )
                    }
                  >

                    {row.options.map((option) => (

                      <option
                        key={option}
                        value={option}
                      >
                        {option}
                      </option>

                    ))}

                  </select>

                </td>

                {/* Institute */}

                <td>

                  <input
                    type="text"
                    value={row.institute}
                    onChange={(e) =>
                      handleBudgetInstituteChange(
                        rowIndex,
                        e.target.value
                      )
                    }
                  />

                </td>

                {/* Year-wise Amount */}

                {row.years.map(
                  (value, yearIndex) => (

                    <td key={yearIndex}>

                      <input
                        type="number"
                        value={value}
                        onChange={(e) =>
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

                {/* Row Total */}

                <td>
                  {Number(row.total || 0).toFixed(2)}
                </td>

                {/* Delete Row */}

                <td>

                  <button
                    type="button"
                    className="btn-delete"
                    onClick={() =>
                      removeBudgetRow(rowIndex)
                    }
                  >
                    ✕
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

          {/* ============================
              FOOTER
          ============================ */}

          <tfoot>

            <tr
              style={{
                background: "#f5f5f5",
                fontWeight: "bold",
              }}
            >

              {/* Label */}

              <td>
                Grand Total
              </td>

              {/* Institute */}

              <td></td>

              {/* Year-wise Grand Total */}

              {Array.from({
                length: budgetYears,
              }).map((_, yearIndex) => (

                <td key={yearIndex}>

                  {Number(
                    getYearTotal(yearIndex) || 0
                  ).toFixed(2)}

                </td>

              ))}

              {/* Overall Grand Total */}

              <td>
                {Number(
                  getGrandTotal() || 0
                ).toFixed(2)}
              </td>

              <td></td>

            </tr>

          </tfoot>

        </table>

      </div>

      {/* ================================
          FOOTER NOTE
      ================================= */}

      <p className="budget-footer">

        Default rows cover the standard expenditure
        heads. Add extra rows if the same head needs
        to be split across more than one institute.

      </p>

    </div>
  );
};

export default BudgetDetails;