import express from "express";

import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  importProjects,
} from "../controllers/projectController.js";

const router = express.Router();


/*
========================================
IMPORT PROJECTS

POST /api/projects/import
========================================

IMPORTANT:

This route MUST come before:

router.get("/:id", ...)

Otherwise "import" can be interpreted
as an ID.
========================================
*/

router.post("/import", importProjects);


/*
========================================
CREATE PROJECT

POST /api/projects
========================================
*/

router.post("/", createProject);


/*
========================================
GET ALL PROJECTS

GET /api/projects
========================================
*/

router.get("/", getProjects);


/*
========================================
GET SINGLE PROJECT

GET /api/projects/:id
========================================
*/

router.get("/:id", getProjectById);


/*
========================================
UPDATE PROJECT

PUT /api/projects/:id
========================================
*/

router.put("/:id", updateProject);


/*
========================================
DELETE PROJECT

DELETE /api/projects/:id
========================================
*/

router.delete("/:id", deleteProject);


export default router;