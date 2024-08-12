import express from "express";
import {
  checkAuth,
  google,
  signin,
  signup,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.get("/check-auth", verifyToken, checkAuth);

export default router;
