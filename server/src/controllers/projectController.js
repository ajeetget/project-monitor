import Project from "../models/Project.js";

/*
========================================================
CREATE PROJECT
POST /api/projects
========================================================
*/

export const createProject = async (req, res) => {
  try {
    const projectData = req.body;

    const project = await Project.create(projectData);

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    console.error("Create project error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create project",
      error: error.message,
    });
  }
};


/*
========================================================
GET ALL PROJECTS
GET /api/projects
========================================================
*/

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error("Get projects error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
      error: error.message,
    });
  }
};


/*
========================================================
GET SINGLE PROJECT
GET /api/projects/:id
========================================================
*/

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("Get project error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch project",
      error: error.message,
    });
  }
};


/*
========================================================
UPDATE PROJECT
PUT /api/projects/:id
========================================================
*/

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    console.error("Update project error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update project",
      error: error.message,
    });
  }
};


/*
========================================================
DELETE PROJECT
DELETE /api/projects/:id
========================================================
*/

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(
      req.params.id
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete project error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete project",
      error: error.message,
    });
  }
};


/*
========================================================
IMPORT HELPER
========================================================

Excel often contains empty cells.

For example:

workshopConducted: ""
labRecReceived: ""

But schema says:

workshopConducted: "Yes" | "No"
labRecReceived: "Yes" | "No"

Therefore we remove empty values before sending
the object to Mongoose.

========================================================
*/

function cleanImportRow(row) {
  const cleanedRow = {
    ...row,
  };

  /*
  -----------------------------------------------
  ENUM FIELDS
  -----------------------------------------------
  */

  const enumFields = [
    "workshopConducted",
    "labRecReceived",
  ];

  enumFields.forEach((field) => {
    if (
      cleanedRow[field] === "" ||
      cleanedRow[field] === null ||
      cleanedRow[field] === undefined
    ) {
      delete cleanedRow[field];
    }
  });


  /*
  -----------------------------------------------
  DATE FIELDS
  -----------------------------------------------

  Empty Excel dates should not be sent as "".

  Mongoose Date fields work better when the field
  is completely absent.
  -----------------------------------------------
  */

  const dateFields = [
    "sanctionDate",
    "projectStartDate",
    "eoiDate",
    "disseminationDate",
    "techCloseDate",
    "finCloseDate",
    "admCloseDate",
    "nextMilestoneDate",
  ];

  dateFields.forEach((field) => {
    if (
      cleanedRow[field] === "" ||
      cleanedRow[field] === null ||
      cleanedRow[field] === undefined
    ) {
      delete cleanedRow[field];
    }
  });


  /*
  -----------------------------------------------
  NUMBER FIELDS
  -----------------------------------------------

  Empty numbers should also be removed.

  -----------------------------------------------
  */

  const numberFields = [
    "sanctionedAmount",
    "numResearchers",
    "numPublications",
  ];

  numberFields.forEach((field) => {
    if (
      cleanedRow[field] === "" ||
      cleanedRow[field] === null ||
      cleanedRow[field] === undefined
    ) {
      delete cleanedRow[field];
    }
  });


  return cleanedRow;
}


/*
========================================================
IMPORT PROJECTS
POST /api/projects/import

BODY:

{
  mode: "replace",

  rows: [
    {
      code: "121",
      title: "check import"
    }
  ]
}

MODES:

replace
upsert
add

========================================================
*/

export const importProjects = async (req, res) => {
  try {
    const { mode, rows } = req.body;


    /*
    ====================================================
    DEBUG REQUEST
    ====================================================
    */

    console.log("");
    console.log("=================================");
    console.log("IMPORT PROJECTS START");
    console.log("MODE:", mode);
    console.log("ROWS TYPE:", typeof rows);
    console.log("IS ARRAY:", Array.isArray(rows));
    console.log("ROWS LENGTH:", rows?.length);
    console.log("ROWS:", JSON.stringify(rows, null, 2));
    console.log("=================================");
    console.log("");


    /*
    ====================================================
    VALIDATE ROWS
    ====================================================
    */

    if (!Array.isArray(rows)) {
      return res.status(400).json({
        success: false,
        message: "Rows must be an array",
      });
    }


    if (rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No projects found to import",
      });
    }


    /*
    ====================================================
    VALIDATE MODE
    ====================================================
    */

    if (
      ![
        "replace",
        "upsert",
        "add",
      ].includes(mode)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid import mode. Use replace, upsert or add.",
      });
    }


    /*
    ====================================================
    VALIDATE REQUIRED FIELDS
    ====================================================
    */

    const validRows = rows.filter((row) => {
      return (
        row &&
        row.code !== undefined &&
        row.code !== null &&
        String(row.code).trim() !== "" &&
        row.title !== undefined &&
        row.title !== null &&
        String(row.title).trim() !== ""
      );
    });


    const invalidRows =
      rows.length - validRows.length;


    console.log("");
    console.log("=================================");
    console.log("VALID ROWS:", validRows.length);
    console.log("INVALID ROWS:", invalidRows);
    console.log(
      "VALID ROW DATA:",
      JSON.stringify(validRows, null, 2)
    );
    console.log("=================================");
    console.log("");


    if (validRows.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "No valid rows found. Project ID and Project Title are required.",
      });
    }


    /*
    ====================================================
    CLEAN ALL ROWS
    ====================================================

    IMPORTANT:

    This is where:

    workshopConducted: ""

    becomes:

    field removed

    and:

    labRecReceived: ""

    becomes:

    field removed
    ====================================================
    */

    const cleanedRows =
      validRows.map((row) => {

        const cleaned =
          cleanImportRow(row);

        /*
        -----------------------------------------------
        MAKE SURE REQUIRED VALUES ARE STRINGS
        -----------------------------------------------
        */

        cleaned.code =
          String(cleaned.code).trim();

        cleaned.title =
          String(cleaned.title).trim();

        return cleaned;
      });


    console.log("");
    console.log("=================================");
    console.log("CLEANED ROWS");
    console.log(
      JSON.stringify(cleanedRows, null, 2)
    );
    console.log("=================================");
    console.log("");


    /*
    ====================================================
    ADD MODE
    ====================================================

    Every Excel row becomes a new project.
    ====================================================
    */

    if (mode === "add") {

      let added = 0;
      let skipped = 0;

      const importedProjects = [];


      for (const row of cleanedRows) {

        try {

          console.log(
            "ADDING PROJECT:",
            row.code
          );


          const project =
            await Project.create(row);


          importedProjects.push(
            project
          );

          added++;


        } catch (error) {

          console.error("");
          console.error(
            "ADD ERROR"
          );
          console.error(
            "PROJECT CODE:",
            row.code
          );
          console.error(
            "PROJECT TITLE:",
            row.title
          );
          console.error(
            "ERROR:",
            error
          );
          console.error("");

          skipped++;
        }
      }


      return res.status(200).json({

        success: true,

        message:
          "Projects imported successfully",

        totalRows: rows.length,

        validRows:
          validRows.length,

        invalidRows,

        added,

        updated: 0,

        replaced: 0,

        skipped:
          skipped + invalidRows,

        data:
          importedProjects,
      });
    }


    /*
    ====================================================
    UPSERT MODE
    ====================================================

    Existing code
        ↓
    Update

    New code
        ↓
    Create
    ====================================================
    */

    if (mode === "upsert") {

      let added = 0;
      let updated = 0;
      let skipped = 0;

      const importedProjects = [];


      for (const row of cleanedRows) {

        try {

          console.log("");
          console.log(
            "PROCESSING UPSERT:",
            row.code
          );


          /*
          -------------------------------------------
          FIND EXISTING PROJECT
          -------------------------------------------
          */

          const existingProject =
            await Project.findOne({
              code: row.code,
            });


          /*
          -------------------------------------------
          EXISTING PROJECT
          -------------------------------------------
          */

          if (existingProject) {

            console.log(
              "EXISTING PROJECT FOUND:",
              existingProject._id
            );


            const updatedProject =
              await Project.findByIdAndUpdate(
                existingProject._id,
                row,
                {
                  new: true,
                  runValidators: true,
                }
              );


            updated++;


            importedProjects.push(
              updatedProject
            );

          }


          /*
          -------------------------------------------
          NEW PROJECT
          -------------------------------------------
          */

          else {

            console.log(
              "NO EXISTING PROJECT"
            );

            console.log(
              "CREATING NEW PROJECT:",
              row.code
            );


            const newProject =
              await Project.create(row);


            added++;


            importedProjects.push(
              newProject
            );
          }


        } catch (error) {

          console.error("");
          console.error(
            "================================="
          );
          console.error(
            "UPSERT ERROR"
          );
          console.error(
            "PROJECT CODE:",
            row.code
          );
          console.error(
            "PROJECT TITLE:",
            row.title
          );
          console.error(
            "ERROR:",
            error
          );
          console.error(
            "ERROR MESSAGE:",
            error.message
          );
          console.error(
            "================================="
          );
          console.error("");

          skipped++;
        }
      }


      return res.status(200).json({

        success: true,

        message:
          "Projects imported successfully",

        totalRows:
          rows.length,

        validRows:
          validRows.length,

        invalidRows,

        added,

        updated,

        replaced: 0,

        skipped:
          skipped + invalidRows,

        data:
          importedProjects,
      });
    }


    /*
    ====================================================
    REPLACE MODE
    ====================================================

    Existing Project ID
        ↓
    Replace its data

    New Project ID
        ↓
    Create project

    IMPORTANT:

    We are matching using `code`.
    ====================================================
    */

    if (mode === "replace") {

      let added = 0;
      let replaced = 0;
      let skipped = 0;

      const importedProjects = [];


      /*
      ==================================================
      PROCESS EACH ROW
      ==================================================
      */

      for (const row of cleanedRows) {

        try {

          console.log("");
          console.log(
            "PROCESSING REPLACE:",
            row.code
          );


          /*
          ---------------------------------------------
          FIND PROJECT BY PROJECT CODE
          ---------------------------------------------
          */

          const existingProject =
            await Project.findOne({
              code: row.code,
            });


          console.log(
            "SEARCH RESULT:",
            existingProject
              ? `FOUND ${existingProject._id}`
              : "NO EXISTING PROJECT"
          );


          /*
          =================================================
          EXISTING PROJECT
          =================================================
          */

          if (existingProject) {

            console.log(
              "REPLACING EXISTING PROJECT:",
              row.code
            );


            /*
            ---------------------------------------------
            UPDATE EXISTING PROJECT
            ---------------------------------------------
            */

            const replacedProject =
              await Project.findByIdAndUpdate(
                existingProject._id,
                row,
                {
                  new: true,
                  runValidators: true,
                }
              );


            console.log(
              "REPLACED SUCCESSFULLY:",
              row.code
            );


            replaced++;


            importedProjects.push(
              replacedProject
            );

          }


          /*
          =================================================
          NEW PROJECT
          =================================================
          */

          else {

            console.log(
              "CREATING NEW PROJECT:",
              row.code
            );


            /*
            ---------------------------------------------
            CREATE PROJECT
            ---------------------------------------------
            */

            const newProject =
              await Project.create(row);


            console.log(
              "CREATED SUCCESSFULLY:",
              row.code
            );


            added++;


            importedProjects.push(
              newProject
            );
          }


        } catch (error) {

          /*
          =================================================
          IMPORTANT ERROR LOG
          =================================================
          */

          console.error("");
          console.error(
            "================================="
          );

          console.error(
            "REPLACE ERROR"
          );

          console.error(
            "PROJECT CODE:",
            row.code
          );

          console.error(
            "PROJECT TITLE:",
            row.title
          );

          console.error(
            "ERROR:",
            error
          );

          console.error(
            "ERROR MESSAGE:",
            error.message
          );

          console.error(
            "================================="
          );

          console.error("");


          skipped++;
        }
      }


      /*
      ====================================================
      FINAL RESULT
      ====================================================
      */

      console.log("");
      console.log(
        "================================="
      );

      console.log(
        "REPLACE IMPORT RESULT"
      );

      console.log({

        totalRows:
          rows.length,

        validRows:
          validRows.length,

        invalidRows,

        added,

        replaced,

        skipped,

      });

      console.log(
        "================================="
      );

      console.log("");


      return res.status(200).json({

        success: true,

        message:
          "Projects imported successfully",

        totalRows:
          rows.length,

        validRows:
          validRows.length,

        invalidRows,

        added,

        updated: 0,

        replaced,

        skipped:
          skipped + invalidRows,

        data:
          importedProjects,
      });
    }


  } catch (error) {

    /*
    ====================================================
    GLOBAL IMPORT ERROR
    ====================================================
    */

    console.error("");
    console.error(
      "================================="
    );

    console.error(
      "IMPORT PROJECTS GLOBAL ERROR"
    );

    console.error(
      error
    );

    console.error(
      "ERROR MESSAGE:",
      error.message
    );

    console.error(
      "================================="
    );

    console.error("");


    return res.status(500).json({

      success: false,

      message:
        "Failed to import projects",

      error:
        error.message,
    });
  }
};