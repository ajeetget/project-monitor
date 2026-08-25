import { useState } from "react";
import * as XLSX from "xlsx";

import { ProjectsAPI } from "../api.js";
import { FIELD_DEFS } from "../constants.js";


/*
====================================================
NORMALIZE EXCEL HEADER
====================================================
*/

function normalizeHeader(header) {
  return (header || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}


/*
====================================================
FIND FIELD FOR EXCEL HEADER
====================================================
*/

function guessFieldForHeader(header) {
  const normalized = normalizeHeader(header);

  if (!normalized) {
    return "";
  }


  /*
  -----------------------------------------------
  EXACT MATCH
  -----------------------------------------------
  */

  for (const field of FIELD_DEFS) {

    const label =
      normalizeHeader(field.label);

    const key =
      normalizeHeader(field.key);

    if (
      normalized === label ||
      normalized === key
    ) {
      return field.key;
    }
  }


  /*
  -----------------------------------------------
  PARTIAL MATCH
  -----------------------------------------------
  */

  for (const field of FIELD_DEFS) {

    const label =
      normalizeHeader(field.label);

    const key =
      normalizeHeader(field.key);

    if (
      normalized.includes(key) ||
      normalized.includes(label)
    ) {
      return field.key;
    }
  }

  return "";
}


/*
====================================================
EXCEL DATE → YYYY-MM-DD
====================================================
*/

function excelDateToISO(value) {

  if (
    value == null ||
    value === ""
  ) {
    return "";
  }


  /*
  -----------------------------------------------
  DATE OBJECT
  -----------------------------------------------
  */

  if (
    value instanceof Date &&
    !isNaN(value)
  ) {

    const year =
      value.getFullYear();

    const month =
      String(
        value.getMonth() + 1
      ).padStart(2, "0");

    const day =
      String(
        value.getDate()
      ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }


  /*
  -----------------------------------------------
  ALREADY ISO DATE
  -----------------------------------------------
  */

  const stringValue =
    String(value).trim();

  if (
    /^\d{4}-\d{2}-\d{2}/.test(
      stringValue
    )
  ) {
    return stringValue.slice(0, 10);
  }


  /*
  -----------------------------------------------
  TRY NORMAL DATE
  -----------------------------------------------
  */

  const date =
    new Date(stringValue);

  if (!isNaN(date)) {

    const year =
      date.getFullYear();

    const month =
      String(
        date.getMonth() + 1
      ).padStart(2, "0");

    const day =
      String(
        date.getDate()
      ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  return "";
}


/*
====================================================
PARSE NUMBER
====================================================
*/

function parseNumber(value) {

  if (
    value == null ||
    value === ""
  ) {
    return null;
  }


  const number =
    parseFloat(
      String(value)
        .replace(/,/g, "")
        .trim()
    );

  return isNaN(number)
    ? null
    : number;
}


/*
====================================================
IMPORT MODAL
====================================================
*/

export default function ImportModal({
  onClose,
  onImported,
}) {

  const [step, setStep] =
    useState(1);

  const [headers, setHeaders] =
    useState([]);

  const [rows, setRows] =
    useState([]);

  const [mapping, setMapping] =
    useState([]);

  const [mode, setMode] =
    useState("replace");

  const [busy, setBusy] =
    useState(false);


  /*
  ==================================================
  HANDLE EXCEL FILE
  ==================================================
  */

  function handleFile(event) {

    const file =
      event.target.files[0];

    if (!file) {
      return;
    }


    const reader =
      new FileReader();


    reader.onload = (
      loadEvent
    ) => {

      try {

        /*
        ------------------------------------------
        READ EXCEL FILE
        ------------------------------------------
        */

        const data =
          new Uint8Array(
            loadEvent.target.result
          );


        const workbook =
          XLSX.read(data, {
            type: "array",
            cellDates: true,
          });


        const worksheet =
          workbook.Sheets[
            workbook.SheetNames[0]
          ];


        /*
        ------------------------------------------
        CONVERT SHEET TO ARRAY
        ------------------------------------------
        */

        const parsed =
          XLSX.utils.sheet_to_json(
            worksheet,
            {
              header: 1,
              defval: "",
              raw: true,
            }
          );


        if (
          parsed.length === 0
        ) {

          alert(
            "The Excel file appears to be empty."
          );

          return;
        }


        /*
        ------------------------------------------
        HEADERS
        ------------------------------------------
        */

        const excelHeaders =
          parsed[0].map(
            (header) =>
              String(
                header || ""
              ).trim()
          );


        /*
        ------------------------------------------
        DATA ROWS
        ------------------------------------------
        */

        const excelRows =
          parsed
            .slice(1)
            .filter((row) =>
              row.some(
                (cell) =>
                  cell !== null &&
                  cell !== ""
              )
            );


        /*
        ------------------------------------------
        AUTO MAP HEADERS
        ------------------------------------------
        */

        const autoMapping =
          excelHeaders.map(
            (header) =>
              guessFieldForHeader(
                header
              )
          );


        /*
        ------------------------------------------
        DEBUG
        ------------------------------------------
        */

        setHeaders(
          excelHeaders
        );

        setRows(
          excelRows
        );

        setMapping(
          autoMapping
        );

        setStep(2);

      } catch (error) {

        console.error(
          "Excel read error:",
          error
        );
        
      }
    };


    reader.readAsArrayBuffer(
      file
    );
  }


  /*
  ==================================================
  DOWNLOAD TEMPLATE
  ==================================================
  */

  function downloadTemplate() {

    const headers =
      FIELD_DEFS.map(
        (field) =>
          field.label
      );


    const worksheet =
      XLSX.utils.aoa_to_sheet([
        headers,
      ]);


    worksheet["!cols"] =
      FIELD_DEFS.map(() => ({
        wch: 25,
      }));


    const workbook =
      XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Projects"
    );


    XLSX.writeFile(
      workbook,
      "rd_project_import_template.xlsx"
    );
  }


  /*
  ==================================================
  UPDATE COLUMN MAPPING
  ==================================================
  */

  function updateMapping(
    index,
    value
  ) {

    setMapping(
      (previous) =>
        previous.map(
          (item, itemIndex) =>
            itemIndex === index
              ? value
              : item
        )
    );
  }


  /*
  ==================================================
  REQUIRED FIELD CHECK
  ==================================================
  */

  const codeMapped =
    mapping.includes("code");

  const titleMapped =
    mapping.includes("title");


  /*
  ==================================================
  RUN IMPORT
  ==================================================
  */

  async function runImport() {

    /* -----------------   FIND CODE COLUMN -----------------*/

    const codeIndex =  mapping.indexOf("code");

    /*
    -----------------------------------------------
    FIND TITLE COLUMN
    -----------------------------------------------
    */

    const titleIndex = mapping.indexOf("title");    
    
    /*
    -----------------------------------------------
    REQUIRED FIELD VALIDATION
    -----------------------------------------------
    */

    if (
      codeIndex === -1 ||
      titleIndex === -1
    ) {

      alert(
        'Please map both "Project ID" and "Project Title".'
      );

      return;
    }


    setBusy(true);


    try {

      /*
      =============================================
      CONVERT EXCEL ROWS TO PROJECT OBJECTS
      =============================================
      */

      const projects =
        rows
          .map((row, rowIndex) => {

            /*
            ---------------------------------------
            GET REQUIRED VALUES
            ---------------------------------------
            */

            const code =
              String(
                row[codeIndex] ?? ""
              ).trim();


            const title =
              String(
                row[titleIndex] ?? ""
              ).trim();       


            /*-----------  SKIP INVALID ROW -------------*/

            if (
              !code ||
              !title
            ) {
             
              return null;
            }


            /*
            ---------------------------------------
            CREATE PROJECT OBJECT
            ---------------------------------------
            */

            const project = {};


            /*
            ---------------------------------------
            MAP EACH EXCEL COLUMN
            ---------------------------------------
            */

            mapping.forEach(
              (fieldKey, columnIndex) => {

                /*
                ---------------------------------
                SKIP UNMAPPED COLUMN
                ---------------------------------
                */

                if (!fieldKey) {
                  return;
                }


                /*
                ---------------------------------
                FIND FIELD DEFINITION
                ---------------------------------
                */

                const fieldDefinition =
                  FIELD_DEFS.find(
                    (field) =>
                      field.key ===
                      fieldKey
                  );


                if (!fieldDefinition) {
                  return;
                }


                /*
                ---------------------------------
                GET EXCEL VALUE
                ---------------------------------
                */

                let value =
                  row[columnIndex];


                /*
                ---------------------------------
                DATE
                ---------------------------------
                */

                if (
                  fieldDefinition.type ===
                  "date"
                ) {

                  value =
                    excelDateToISO(
                      value
                    );
                }


                /*
                ---------------------------------
                NUMBER
                ---------------------------------
                */

                else if (
                  fieldDefinition.type ===
                  "number"
                ) {

                  value =
                    parseNumber(
                      value
                    );
                }


                /*
                ---------------------------------
                TEXT
                ---------------------------------
                */

                else {

                  value =
                    value == null
                      ? ""
                      : String(
                          value
                        ).trim();
                }


                /*
                =================================
                IMPORTANT FIX
                =================================

                Do not send empty optional
                fields to the backend.

                This prevents:

                workshopConducted: ""

                and:

                labRecReceived: ""

                from reaching Mongoose enum
                validation.
                */

                if (
                  value !== "" &&
                  value !== null &&
                  value !== undefined
                ) {

                  project[fieldKey] =
                    value;
                }

              }
            );


            /*
            ---------------------------------------
            FORCE REQUIRED FIELDS
            ---------------------------------------
            */

            project.code =
              code;

            project.title =
              title;


            /*
            ---------------------------------------
            DEBUG FINAL PROJECT
            ---------------------------------------
            */

            
            return project;

          })
          .filter(Boolean);


     
      if (
        projects.length === 0
      ) {

        alert(
          "No valid projects found. Please check Project ID and Project Title."
        );

        return;
      }


      /*
      =============================================
      SEND TO BACKEND
      =============================================
      */

      const response =
        await ProjectsAPI.import(
          mode,
          projects
        );


      /*
      =============================================
      RESPONSE
      =============================================
      */


      alert(
        `Import complete:

${response.added || 0} added
${response.updated || 0} updated
${response.replaced || 0} replaced
${response.skipped || 0} skipped`
      );


      /*
      =============================================
      REFRESH PROJECT LIST
      =============================================
      */

      if (
        typeof onImported ===
        "function"
      ) {

        onImported();
      }


      /*
      =============================================
      CLOSE MODAL
      =============================================
      */

      onClose();

    } catch (error) {

      console.error(
        "IMPORT ERROR:",
        error
      );


      alert(
        "Import failed: " +
        (
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          error.message
        )
      );

    } finally {

      setBusy(false);
    }
  }


  /*
  ==================================================
  JSX
  ==================================================
  */

  return (
    <div
      className="modal-bg active"
      onClick={onClose}
    >

      <div
        className="modal"
        style={{
          maxWidth: 860,
        }}
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        <span
          className="close-x"
          onClick={onClose}
        >
          ×
        </span>


        <h2>
          Import Projects from Excel / CSV
        </h2>


        {/* ======================================
            STEP 1
        ====================================== */}

        {step === 1 && (

          <div>

            <p
              className="small muted"
            >
              Upload a{" "}
              <b>.xlsx</b>,{" "}
              <b>.xls</b>, or{" "}
              <b>.csv</b>{" "}
              file.
              The first row should contain
              column headers.
            </p>


            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFile}
            />


            <div
              style={{
                marginTop: 14,
                paddingTop: 14,
                borderTop:
                  "1px solid var(--border)",
              }}
            >

              <div
                className="small muted"
                style={{
                  marginBottom: 8,
                }}
              >
                Download a blank template
                with all project fields.
              </div>


              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={
                  downloadTemplate
                }
              >
                ⬇ Download blank template
              </button>

            </div>

          </div>
        )}


        {/* ======================================
            STEP 2
        ====================================== */}

        {step === 2 && (

          <div>

            {/* ================================
                MAPPING
            ================================= */}

            <h4
              style={{
                fontSize: 12.5,
                textTransform:
                  "uppercase",
                color:
                  "var(--teal-dark)",
                marginBottom: 8,
              }}
            >
              1. Map your columns
            </h4>


            <div
              className="small muted"
              style={{
                marginBottom: 10,
              }}
            >
              We've automatically guessed
              the matching fields.
              Please verify them.
            </div>


            <div
              style={{
                maxHeight: 240,
                overflowY: "auto",
                border:
                  "1px solid var(--border)",
                borderRadius: 8,
                padding: "10px 14px",
                marginBottom: 16,
              }}
            >

              {headers.map(
                (header, index) => (

                  <div
                    key={index}
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "1fr 1fr",
                      gap: 12,
                      alignItems:
                        "center",
                      padding:
                        "6px 0",
                      borderBottom:
                        "1px solid var(--border)",
                    }}
                  >

                    <div
                      className="small"
                    >

                      <span
                        className="mono"
                        style={{
                          color:
                            "var(--teal-dark)",
                        }}
                      >
                        {header ||
                          `(column ${
                            index + 1
                          })`}
                      </span>

                    </div>


                    <select
                      value={
                        mapping[index] ||
                        ""
                      }
                      onChange={(event) =>
                        updateMapping(
                          index,
                          event.target.value
                        )
                      }
                    >

                      <option value="">
                        — Skip this column —
                      </option>


                      {FIELD_DEFS.map(
                        (field) => (

                          <option
                            key={
                              field.key
                            }
                            value={
                              field.key
                            }
                          >
                            {field.label}
                          </option>

                        )
                      )}

                    </select>

                  </div>

                )
              )}

            </div>


            {/* ================================
                REQUIRED FIELD STATUS
            ================================= */}

            <div
              style={{
                marginBottom: 16,
                padding: 10,
                border:
                  "1px solid var(--border)",
                borderRadius: 8,
              }}
            >

              <div className="small">

                Project ID:{" "}

                {codeMapped
                  ? "✅ Mapped"
                  : "❌ Not mapped"}

              </div>


              <div
                className="small"
              >

                Project Title:{" "}

                {titleMapped
                  ? "✅ Mapped"
                  : "❌ Not mapped"}

              </div>

            </div>


            {/* ================================
                PREVIEW
            ================================= */}

            <h4
              style={{
                fontSize: 12.5,
                textTransform:
                  "uppercase",
                color:
                  "var(--teal-dark)",
                marginBottom: 8,
              }}
            >

              2. Preview

              <span
                className="muted"
                style={{
                  textTransform:
                    "none",
                  fontWeight: 400,
                }}
              >
                {" "}
                — {rows.length} row(s)
                detected
              </span>

            </h4>


            <div
              style={{
                overflowX: "auto",
                maxHeight: 220,
                overflowY: "auto",
                marginBottom: 16,
                border:
                  "1px solid var(--border)",
                borderRadius: 8,
              }}
            >

              <table
                style={{
                  fontSize: 12,
                }}
              >

                <thead>

                  <tr>

                    {mapping.map(
                      (fieldKey, index) =>
                        fieldKey ? (

                          <th key={index}>

                            {
                              FIELD_DEFS.find(
                                (field) =>
                                  field.key ===
                                  fieldKey
                              )?.label
                            }

                          </th>

                        ) : null
                    )}

                  </tr>

                </thead>


                <tbody>

                  {rows
                    .slice(0, 5)
                    .map(
                      (
                        row,
                        rowIndex
                      ) => (

                        <tr
                          key={rowIndex}
                        >

                          {mapping.map(
                            (
                              fieldKey,
                              columnIndex
                            ) =>
                              fieldKey ? (

                                <td
                                  key={
                                    columnIndex
                                  }
                                  className="small"
                                >

                                  {String(
                                    row[
                                      columnIndex
                                    ] ?? ""
                                  )}

                                </td>

                              ) : null
                          )}

                        </tr>

                      )
                    )}

                </tbody>

              </table>

            </div>


            {/* ================================
                IMPORT MODE
            ================================= */}

            <div
              className="form-grid two"
            >

              <div className="field">

                <label>
                  Import mode
                </label>


                <select
                  value={mode}
                  onChange={(event) =>
                    setMode(
                      event.target.value
                    )
                  }
                >

                  <option value="replace">
                    Replace matching projects
                  </option>

                  <option value="upsert">
                    Merge into matching projects
                  </option>

                  <option value="add">
                    Add all rows as new projects
                  </option>

                </select>

              </div>


              <div className="field">

                <label>
                  Rows detected
                </label>


                <input
                  value={`${rows.length} rows`}
                  disabled
                  readOnly
                />

              </div>

            </div>


            {/* ================================
                WARNING
            ================================= */}

            {(
              !codeMapped ||
              !titleMapped
            ) && (

              <div
                className="small"
                style={{
                  color:
                    "var(--amber)",
                  marginTop: 8,
                }}
              >

                ⚠ Please map both
                "Project ID" and
                "Project Title".

              </div>

            )}


            {/* ================================
                BUTTONS
            ================================= */}

            <div
              className="form-actions"
            >

              <button
                type="button"
                className="btn btn-ghost"
                onClick={() =>
                  setStep(1)
                }
                disabled={busy}
              >
                ← Back
              </button>


              <button
                type="button"
                className="btn btn-primary"
                disabled={
                  busy ||
                  !codeMapped ||
                  !titleMapped
                }
                onClick={runImport}
              >

                {busy
                  ? "Importing..."
                  : "Import Projects"}

              </button>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}