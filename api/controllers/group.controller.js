import Group from "../models/group.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import { generateInviteCode } from "../utils/inviteCode.js";

// Function to get all available groups (accessible by anyone with a valid token)
export const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find({}).populate("admins members createdBy");
    res.status(200).json(groups);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch groups", error: error.message });
  }
};

// Create a new group (Group Admins and Admins can create groups)
export const createGroup = async (req, res, next) => {
  const { name, description } = req.body;

  // Check if the user is a Group Admin or an Admin to create a group
  if (req.user.role !== "Admin" && req.user.role !== "Group Admin") {
    return next(errorHandler(403, "You are not allowed to create a group"));
  }

  if (!name || !description) {
    return next(errorHandler(400, "Group name and description are required"));
  }

  try {
    const inviteCode = generateInviteCode(); //Creating an invite code for the user to join the group

    // Create a new group with the user as an admin
    const newGroup = new Group({
      name,
      description,
      createdBy: req.user.id,
      admins: [req.user.id],
      members: [],
      inviteCode: inviteCode,
    });

    // Save the new group
    await newGroup.save();

    // If the user is a Group Admin, find other Group Admins to add them to the group's admins list
    if (req.user.role === "Group Admin") {
      const allGroupAdmins = await Group.find({ admins: req.user.id });
      for (const group of allGroupAdmins) {
        if (!group.admins.includes(req.user.id)) {
          group.admins.push(req.user.id);
          await group.save();
        }
      }
    }

    // Respond with the newly created group
    res.status(201).json(newGroup);
  } catch (error) {
    next(error);
  }
};

// Get details of a specific group, including its users
export const getGroupDetails = async (req, res, next) => {
  const { groupId } = req.params;

  try {
    const group = await Group.findById(groupId).populate(
      "admins members createdBy"
    );
    if (!group) {
      return next(errorHandler(404, "Group not found"));
    }

    // Check if the user has access
    if (
      req.user?.role === "Group Admin" &&
      group.createdBy.toString() !== req.user.id.toString() &&
      !group.admins
        .map((admin) => admin.toString())
        .includes(req.user.id.toString())
    ) {
      return next(errorHandler(403, "Access denied"));
    }

    res.status(200).json(group);
  } catch (error) {
    next(error);
  }
};

// Add a user to a group
export const addUserToGroup = async (req, res, next) => {
  const { groupId, userId } = req.body;

  // Check if the requesting user has 'Admin' role
  if (req.user.role !== "Admin") {
    return next(
      errorHandler(403, "You are not allowed to add a user to a group")
    );
  }

  try {
    // Find the group by ID
    const group = await Group.findById(groupId);
    if (!group) {
      return next(errorHandler(404, "Group not found"));
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    // Ensure 'surveyUsername' is present (required field)
    if (!user.surveyUsername) {
      return next(errorHandler(400, "User's survey username is required"));
    }

    // Ensure the user's role is one of the allowed values
    if (!["normalUser", "Group Admin", "Admin"].includes(user.role)) {
      return next(errorHandler(400, "Invalid user role"));
    }

    // Check if the user is already part of another group
    if (user.groupId && user.groupId.toString() !== groupId) {
      return next(errorHandler(400, "User is already in another group"));
    }

    // Check if the user is already a member of the current group
    if (group.members.includes(userId)) {
      return next(errorHandler(400, "User is already a member of this group"));
    }

    // Assign the groupId to the user and save
    user.groupId = groupId;
    await user.save();

    // Add the user to the group's members array and save
    group.members.push(userId);
    await group.save();

    // Respond with a success message
    res.status(200).json({ message: "User added to group" });
  } catch (error) {
    console.error("Error in addUserToGroup:", error);
    next(error); // Pass error to error handling middleware
  }
};

// Remove a user from a group
export const removeUserFromGroup = async (req, res, next) => {
  const { groupId, userId } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return next(errorHandler(404, "Group not found"));
    }

    const user = await User.findById(userId);
    if (!user || user.groupId.toString() !== groupId) {
      return next(errorHandler(404, "User not found or not in this group"));
    }

    user.groupId = null;
    await user.save();

    group.members.pull(userId);
    await group.save();

    res.status(200).json({ message: "User removed from group" });
  } catch (error) {
    next(error);
  }
};

// Delete a group
export const deleteGroup = async (req, res, next) => {
  if (req.user.role !== "Admin") {
    return next(errorHandler(403, "Access denied"));
  }

  const { groupId } = req.params;

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return next(errorHandler(404, "Group not found"));
    }

    await Group.findByIdAndDelete(groupId);
    res.status(200).json({ message: "Group deleted" });
  } catch (error) {
    next(error);
  }
};

// Controller function to get all groups (for Admin)
export const getAdminGroups = async (req, res, next) => {
  try {
    const groups = await Group.find({ admins: req.user.id }).populate(
      "members createdBy admins"
    );
    res.status(200).json(groups);
  } catch (error) {
    next(error);
  }
};

// Controller function to get groups where the user is either the creator or an admin
export const getAdminGroupCluster = async (req, res, next) => {
  try {
    // Find groups where the user is either the creator or an admin
    const groups = await Group.find({
      $or: [{ createdBy: req.user.id }, { admins: req.user.id }],
    }).populate("members createdBy admins");

    res.status(200).json(groups);
  } catch (error) {
    next(error);
  }
};

// Controller function to get users in a specific group (for Group Admins and Admins)
export const getUsersInGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.groupId).populate("members");

    if (!group) {
      return next(errorHandler(404, "Group not found"));
    }
    // Check if the user is a Group Admin for this group or an Admin
    if (
      !group.admins.includes(req.user.id.toString()) &&
      req.user.role !== "Admin"
    ) {
      return next(errorHandler(403, "Access denied"));
    }

    res.status(200).json(group.members);
  } catch (error) {
    next(error);
  }
};
