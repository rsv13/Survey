import express from "express";
import {
  getSurveys,
  surveyQuestion,
  surveyTest,
} from "../controllers/survey.controller.js";
import { isAdmin, verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/surveyTest", surveyTest);
router.post("/surveyQuestion", surveyQuestion);
router.get("/getSurveys", verifyToken, isAdmin, getSurveys);

export default router;
