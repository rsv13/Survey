import Group from "../models/group.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

// Function to get all available groups
export const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find({}); // Replace with your Group model
    res.status(200).json({ groups });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch groups", error: error.message });
  }
};

// Create a new group (Group Admins and Admins can create groups)
export const createGroup = async (req, res, next) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return next(errorHandler(400, "Group name and description are required"));
  }

  try {
    // If the user is a Group Admin, ensure they are creating the group they manage
    if (req.user.role === "Group Admin") {
      const existingGroup = await Group.findOne({ name });
      if (existingGroup) {
        return next(errorHandler(400, "Group name already exists"));
      }

      // Create a new group with the current Group Admin as the creator
      const newGroup = new Group({
        name,
        description,
        createdBy: req.user.id,
      });
      await newGroup.save();

      // Assign the current user as the admin of the new group
      req.user.groupId = newGroup._id;
      await req.user.save();

      res.status(201).json(newGroup);
    } else if (req.user.role === "Admin") {
      // Admins can create groups as well
      const newGroup = new Group({
        name,
        description,
        createdBy: req.user.id,
      });
      await newGroup.save();

      res.status(201).json(newGroup);
    } else {
      next(errorHandler(403, "Access denied"));
    }
  } catch (error) {
    next(error);
  }
};

// Get details of a specific group, including its users
export const getGroupDetails = async (req, res, next) => {
  const { groupId } = req.params;

  try {
    const group = await Group.findById(groupId).populate("members");
    if (!group) {
      return next(errorHandler(404, "Group not found"));
    }

    // Check if the user has access
    if (
      req.user.role === "Group Admin" &&
      group.createdBy.toString() !== req.user.id
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

  if (req.user.role === "Group Admin") {
    try {
      const group = await Group.findById(groupId);
      if (!group) {
        return next(errorHandler(404, "Group not found"));
      }

      if (group.createdBy.toString() !== req.user.id) {
        return next(errorHandler(403, "Access denied"));
      }

      const user = await User.findById(userId);
      if (!user) {
        return next(errorHandler(404, "User not found"));
      }

      if (user.groupId && user.groupId.toString() !== groupId) {
        return next(errorHandler(400, "User is already in another group"));
      }

      user.groupId = groupId;
      await user.save();

      group.members.push(userId);
      await group.save();

      res.status(200).json({ message: "User added to group" });
    } catch (error) {
      next(error);
    }
  } else if (req.user.role === "Admin") {
    // Admins can add users to any group
    try {
      const group = await Group.findById(groupId);
      if (!group) {
        return next(errorHandler(404, "Group not found"));
      }

      const user = await User.findById(userId);
      if (!user) {
        return next(errorHandler(404, "User not found"));
      }

      if (user.groupId && user.groupId.toString() !== groupId) {
        return next(errorHandler(400, "User is already in another group"));
      }

      user.groupId = groupId;
      await user.save();

      group.members.push(userId);
      await group.save();

      res.status(200).json({ message: "User added to group" });
    } catch (error) {
      next(error);
    }
  } else {
    next(errorHandler(403, "Access denied"));
  }
};

// Remove a user from a group
export const removeUserFromGroup = async (req, res, next) => {
  const { groupId, userId } = req.body;

  if (req.user.role === "Group Admin") {
    try {
      const group = await Group.findById(groupId);
      if (!group) {
        return next(errorHandler(404, "Group not found"));
      }

      if (group.createdBy.toString() !== req.user.id) {
        return next(errorHandler(403, "Access denied"));
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
  } else if (req.user.role === "Admin") {
    // Admins can remove users from any group
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
  } else {
    next(errorHandler(403, "Access denied"));
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
    // Check if the user is an Admin
    if (req.user.role !== "Admin") {
      return res.status(403).json({ error: "Forbidden Access" });
    }

    // Admins can view all groups
    const groups = await Group.find({}).populate("members createdBy admins");
    res.status(200).json(groups);
  } catch (error) {
    next(error);
  }
};

// Controller function to get groups created by the Group Admin
export const getAdminGroupCluster = async (req, res, next) => {
  try {
    // Check if the user is a Group Admin
    if (req.user.role !== "Group Admin") {
      return res.status(403).json({ error: "Forbidden Access" });
    }

    // Group Admins can view only the groups they created
    const groups = await Group.find({ createdBy: req.user.id }).populate(
      "members createdBy admins"
    );
    res.status(200).json(groups);
  } catch (error) {
    next(error);
  }
};
