import bcryptjs from "bcryptjs";
import Group from "../models/group.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const test = (req, res) => {
  res.send({ message: "API is working" });
};

// Endpoint to update a user - Accessible by Admins and the user themselves
export const updateUser = async (req, res, next) => {
  if (req.user.role !== "Admin" && req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }

  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(
        errorHandler(400, "Password must be at least 6 characters long")
      );
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }

  if (req.body.username) {
    if (req.body.username.length < 4 || req.body.username.length > 20) {
      return next(
        errorHandler(400, "Username must be between 4 and 20 characters long")
      );
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(
        errorHandler(400, "Username must contain only lowercase letters")
      );
    }
    if (!req.body.username.match(/^[a-z0-9]+$/)) {
      return next(
        errorHandler(400, "Username must contain only letters and numbers")
      );
    }
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: req.body },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// Endpoint to delete a user - Accessible by Admins and the user themselves
export const deleteUser = async (req, res, next) => {
  if (req.user.role !== "Admin" && req.user.id !== req.params.userId) {
    return next(
      errorHandler(403, "You are not allowed to delete this account")
    );
  }

  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json("User has been deleted");
  } catch (error) {
    next(error);
  }
};

// Endpoint to sign out a user
export const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been signed out");
  } catch (error) {
    next(error);
  }
};

// Endpoint to get all users - Accessible by Admins only
export const getUsers = async (req, res, next) => {
  if (req.user.role !== "Admin") {
    return next(errorHandler(403, "You are not allowed to see all users"));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};

// Endpoint to get responses for users in a specific group - Accessible by Group Admins
export const getGroupResponses = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.groupId).populate("members");

    if (!group) {
      return next(errorHandler(404, "Group not found"));
    }

    // Check if the user is a Group Admin for this group
    if (!group.admins.includes(req.user._id) && req.user.role !== "Admin") {
      return next(errorHandler(403, "Access denied"));
    }

    // Assuming responses are stored in User model (adjust if stored differently)
    const responses = await User.find({
      _id: { $in: group.members },
    }).select("responses"); // Adjust if needed

    res.status(200).json(responses);
  } catch (error) {
    next(error);
  }
};

// Endpoint to delete a user from a group - Accessible by Group Admins
export const deleteUserFromGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.groupId);
    const user = await User.findById(req.params.userId);

    if (!group || !user) {
      return next(errorHandler(404, "Group or User not found"));
    }

    if (!group.admins.includes(req.user._id) && req.user.role !== "Admin") {
      return next(errorHandler(403, "Access denied"));
    }

    // Remove user from the group
    group.members.pull(user._id);
    await group.save();

    res.status(200).json("User has been removed from the group");
  } catch (error) {
    next(error);
  }
};

// Endpoint to delete a group - Accessible by Admins only
export const deleteGroup = async (req, res, next) => {
  if (req.user.role !== "Admin") {
    return next(errorHandler(403, "You are not allowed to delete a group"));
  }

  try {
    await Group.findByIdAndDelete(req.params.groupId);
    res.status(200).json("Group has been deleted");
  } catch (error) {
    next(error);
  }
};

export const getUserDetails = async (req, res) => {
  try {
    // Retrieve the user from the database and populate the group details
    const user = await User.findById(req.user.id).populate("group");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user details along with group information
    res.status(200).json({
      username: user.username,
      email: user.email,
      role: user.role,
      group: user.group, // This will include group details
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
