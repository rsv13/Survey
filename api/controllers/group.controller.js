import Group from "../models/group.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

<<<<<<< HEAD
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

=======
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
>>>>>>> c99a19b (Creation of Group API, user role and modifying the signup page accordingly)
    if (!group) {
      return next(errorHandler(404, "Group not found"));
    }

<<<<<<< HEAD
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
=======
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
>>>>>>> c99a19b (Creation of Group API, user role and modifying the signup page accordingly)
  }
};

// Add a user to a group
export const addUserToGroup = async (req, res, next) => {
<<<<<<< HEAD
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
=======
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
>>>>>>> c99a19b (Creation of Group API, user role and modifying the signup page accordingly)
  }
};

// Remove a user from a group
export const removeUserFromGroup = async (req, res, next) => {
<<<<<<< HEAD
  try {
    const { groupId } = req.params;
    const { userId } = req.body;
    const userRole = req.user.role;

    const group = await Group.findById(groupId);

=======
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
>>>>>>> c99a19b (Creation of Group API, user role and modifying the signup page accordingly)
    if (!group) {
      return next(errorHandler(404, "Group not found"));
    }

<<<<<<< HEAD
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
=======
    await Group.findByIdAndDelete(groupId);
    res.status(200).json({ message: "Group deleted" });
  } catch (error) {
    next(error);
>>>>>>> c99a19b (Creation of Group API, user role and modifying the signup page accordingly)
  }
};
