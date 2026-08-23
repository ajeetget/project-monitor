import express from "express";
import {
  createVertical,
  getVerticals,
} from "../controllers/verticalController.js";

const router = express.Router();

router.get("/", getVerticals);
router.post("/", createVertical);

export default router;