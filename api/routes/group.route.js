import express from "express";
import {
  addUserToGroup,
  createGroup,
  deleteGroup,
<<<<<<< HEAD
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
=======
  getAllGroups,
  getGroupDetails,
  removeUserFromGroup,
} from "../controllers/group.controller.js";
import { isAdmin, isGroupAdmin, verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// Route to get all available groups
router.get("/allGroup", getAllGroups);

// Route to create a new group (only Group Admins and Admins can create groups)
router.post("/create", verifyToken, isGroupAdmin, createGroup);

// Route to get details of a specific group, including its users
router.get("/:groupId", verifyToken, getGroupDetails);

// Route to add a user to a group (Group Admins and Admins can add users)
router.post("/add-user", verifyToken, isGroupAdmin, addUserToGroup);

// Route to remove a user from a group (Group Admins and Admins can remove users)
router.post("/remove-user", verifyToken, isGroupAdmin, removeUserFromGroup);

// Route to delete a group (only Admins can delete groups)
router.delete("/:groupId", verifyToken, isAdmin, deleteGroup);
>>>>>>> c99a19b (Creation of Group API, user role and modifying the signup page accordingly)

export default router;
