import Group from "../models/group.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

// Create a new group
export const createGroup = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Allow GroupAdmin and Admin to create groups
    if (userRole !== "groupAdmin" && userRole !== "admin") {
      return next(
        errorHandler(
          403,
          "Forbidden: Only Group Admins and Admins can create groups"
        )
      );
    }

    // Check if the group name already exists for this user
    const existingGroup = await Group.findOne({ name, createdBy: userId });
    if (existingGroup) {
      return next(errorHandler(400, "Group already exists for this user"));
    }

    const group = new Group({
      name,
      description,
      createdBy: userId,
    });

    await group.save();
    res.status(201).json(group);
  } catch (error) {
    next(errorHandler(400, error.message));
  }
};

// Get all groups created by the authenticated user
export const getGroups = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let groups;
    if (userRole === "admin") {
      // Admins can see all groups
      groups = await Group.find().populate("members");
    } else if (userRole === "groupAdmin") {
      // GroupAdmins can see their own groups
      groups = await Group.find({ createdBy: userId }).populate("members");
    } else {
      return next(errorHandler(403, "Forbidden"));
    }

    res.status(200).json(groups);
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

// Get a specific group by ID
export const getGroupById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const group = await Group.findById(id).populate("members");

    if (!group) {
      return next(errorHandler(404, "Group not found"));
    }

    // Ensure that Admins can see any group and GroupAdmins can only see their own groups
    if (
      userRole === "admin" ||
      (userRole === "groupAdmin" && group.createdBy.toString() === userId)
    ) {
      res.status(200).json(group);
    } else {
      return next(errorHandler(403, "Forbidden"));
    }
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

// Update a group
export const updateGroup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const group = await Group.findById(id);

    if (!group) {
      return next(errorHandler(404, "Group not found"));
    }

    // Ensure Admins can update any group and GroupAdmins can only update their own groups
    if (
      userRole === "admin" ||
      (userRole === "groupAdmin" && group.createdBy.toString() === userId)
    ) {
      Object.assign(group, req.body);
      await group.save();
      res.status(200).json(group);
    } else {
      return next(errorHandler(403, "Forbidden"));
    }
  } catch (error) {
    next(errorHandler(400, error.message));
  }
};

// Delete a group
export const deleteGroup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check if the user is an Admin
    if (userRole !== "admin") {
      return next(
        errorHandler(
          403,
          "Forbidden: You do not have permission to delete this group"
        )
      );
    }

    const group = await Group.findById(id);
    if (!group) {
      return next(errorHandler(404, "Group not found"));
    }

    await group.remove();
    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

// Add a user to a group
export const addUserToGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;
    const userRole = req.user.role;

    const group = await Group.findById(groupId);

    if (!group) {
      return next(errorHandler(404, "Group not found"));
    }

    // Ensure GroupAdmins can only manage their own groups
    if (
      userRole === "groupAdmin" &&
      group.createdBy.toString() !== req.user.id
    ) {
      return next(errorHandler(403, "Forbidden: You cannot manage this group"));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    if (group.members.includes(user._id)) {
      return next(errorHandler(400, "User already in the group"));
    }

    group.members.push(user._id);
    await group.save();
    res.status(200).json(group);
  } catch (error) {
    next(errorHandler(400, error.message));
  }
};

// Remove a user from a group
export const removeUserFromGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;
    const userRole = req.user.role;

    const group = await Group.findById(groupId);

    if (!group) {
      return next(errorHandler(404, "Group not found"));
    }

    // Ensure GroupAdmins can only manage their own groups
    if (
      userRole === "groupAdmin" &&
      group.createdBy.toString() !== req.user.id
    ) {
      return next(errorHandler(403, "Forbidden: You cannot manage this group"));
    }

    if (!group.members.includes(userId)) {
      return next(errorHandler(400, "User not in the group"));
    }

    group.members = group.members.filter(
      (member) => member.toString() !== userId
    );
    await group.save();
    res.status(200).json(group);
  } catch (error) {
    next(errorHandler(400, error.message));
  }
};
