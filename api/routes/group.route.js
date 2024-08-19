import express from "express";
import {
  addUserToGroup,
  createGroup,
  deleteGroup,
  getGroupById,
  getGroups,
  removeUserFromGroup,
  updateGroup,
} from "../controllers/group.controller.js";
import { verifyAdmin, verifyGroupAdmin } from "../utils/verifyUser.js";

const router = express.Router();

// Create a new group (Admins can create groups, GroupAdmins cannot create groups)
router.post("/", verifyAdmin, createGroup);

// Get all groups created by the authenticated user
router.get("/", verifyAdmin, getGroups);

// Get a specific group by ID
router.get("/:id", verifyAdmin, getGroupById);

// Update a group
router.put("/:id", verifyAdmin, updateGroup);

// Delete a group
router.delete("/:id", verifyAdmin, deleteGroup);

// Add a user to a group
router.post("/:groupId/users", verifyGroupAdmin, addUserToGroup);

// Remove a user from a group
router.delete("/:groupId/users", verifyGroupAdmin, removeUserFromGroup);

export default router;
