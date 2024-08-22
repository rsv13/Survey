import express from "express";
import {
  addUserToGroup,
  createGroup,
  deleteGroup,
  getAdminGroupCluster,
  getAdminGroups,
  getAllGroups,
  getGroupDetails,
  getUsersInGroup,
  removeUserFromGroup,
} from "../controllers/group.controller.js";
import { isAdmin, isGroupAdmin, verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// Route to get all available groups (public access)
router.get("/allGroup", getAllGroups);

// Route to create a new group (only Group Admins and Admins can create groups)
router.post("/createGroup", verifyToken, isGroupAdmin, isAdmin, createGroup);

// Route to get details of a specific group, including its users
router.get("/:groupId", verifyToken, getGroupDetails);

// Route to add a user to a group (Group Admins and Admins can add users)
router.post("/add-user", verifyToken, isGroupAdmin, addUserToGroup);

// Route to remove a user from a group (Group Admins and Admins can remove users)
router.post("/remove-user", verifyToken, isGroupAdmin, removeUserFromGroup);

// Route to delete a group (only Admins can delete groups)
router.delete("/:groupId", verifyToken, isAdmin, deleteGroup);

// Route for Admin to get all groups
router.get("/admin/groups", verifyToken, isAdmin, getAdminGroups);

// Route for Group Admin to get their created groups
router.get(
  "/group-admin/groups",
  verifyToken,
  isGroupAdmin,
  getAdminGroupCluster
);

router.get("/:groupId/users", verifyToken, isGroupAdmin, getUsersInGroup);

export default router;
