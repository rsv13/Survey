import express from "express";
import {
  assignRole,
  deleteUser,
  getUserDetails,
  getUsers,
  getUsersGroupedAndUngrouped,
  signout,
  test,
  updateUser,
} from "../controllers/user.controller.js";
import { isAdmin, verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.post("/signout", signout);
router.get("/getusers", verifyToken, getUsers);
router.get("/details", verifyToken, getUserDetails);
router.get(
  "/users-grouped-and-ungrouped",
  verifyToken,
  getUsersGroupedAndUngrouped
);

router.post("/assignRole", verifyToken, isAdmin, assignRole);

export default router;
