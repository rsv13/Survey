import Group from "../models/group.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

// Function to get all available groups (accessible by anyone with a valid token)
export const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find({});
    res.status(200).json({ groups });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch groups", error: error.message });
  }
};

// Create a new group (Group Admins and Admins can create groups)
export const createGroup = async (req, res, next) => {
  console.log(req.user);
  const { name, description } = req.body;

  if (req.user.role !== "Admin" && req.user.role !== "Group Admin") {
    return next(errorHandler(403, "You are not allowed to create a group"));
  }

  if (!name || !description) {
    return next(errorHandler(400, "Group name and description are required"));
  }

  try {
    const newGroup = new Group({
      name,
      description,
      createdBy: req.user.id,
      admins: [req.user.id],
      members: [],
    });

    await newGroup.save();
    res.status(201).json(newGroup);
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

    // Debugging logs
    console.log("Requesting User ID:", req.user?._id?.toString());
    console.log("Group Created By:", group.createdBy?.toString());
    console.log(
      "Group Admins Array:",
      group.admins?.map((admin) => admin.toString())
    );

    // Check if the user has access
    if (
      req.user?.role === "Group Admin" &&
      group.createdBy?.toString() !== req.user._id?.toString() &&
      !group.admins
        ?.map((admin) => admin.toString())
        .includes(req.user._id?.toString())
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
    const groups = await Group.find({}).populate("members createdBy admins");
    res.status(200).json(groups);
  } catch (error) {
    next(error);
  }
};

// Controller function to get groups created by the Group Admin
export const getAdminGroupCluster = async (req, res, next) => {
  try {
    const groups = await Group.find({ createdBy: req.user.id }).populate(
      "members createdBy admins"
    );
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
