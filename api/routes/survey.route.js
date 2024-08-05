import express from "express";
import {
  surveyQuestion,
  surveyTest,
} from "../controllers/survey.controller.js";

const router = express.Router();

router.get("/surveyTest", surveyTest);
router.post("/surveyQuestion", surveyQuestion);

export default router;
