import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Counter from "../models/counter.model.js";
import Group from "../models/group.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

// Function to get the next surveyUsername
const getNextSurveyUsername = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: "surveyUsername" },
    { $inc: { count: 1 } },
    { new: true, upsert: true }
  );
  const number = String(counter.count).padStart(4, "0");
  return `SWSWBS${number}`;
};

//Sign up function
export const signup = async (req, res) => {
  const {
    username,
    email,
    password,
    role,
    name, // Group name for Group Admin
    description, // Group description for Group Admin
    group, // Group ID for normal users
  } = req.body;

  try {
    // Validate required fields based on role
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email, and password are required" });
    }

    const surveyUsername = await getNextSurveyUsername();

    if (role === "Group Admin" && (!name || !description)) {
      return res.status(400).json({
        message: "Group name and description are required for Group Admin",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
      surveyUsername, // Assign surveyUsername
    });

    if (role === "Group Admin") {
      // Create the new group
      const newGroup = new Group({
        name, // Group name
        description, // Group description
        createdBy: newUser._id,
        admins: [newUser._id], // Add the creator as an admin
      });

      await newGroup.save();

      // Update the newUser with the group information
      newUser.groupId = newGroup._id; // Set groupId to the newly created group
    } else {
      // For normal users, assign the provided group ID
      newUser.groupId = group || null; // Assign the group ID if provided
    }

    await newUser.save();

    // If role is 'Group Admin', update the group with admin information
    if (role === "Group Admin") {
      await Group.findByIdAndUpdate(newGroup._id, {
        $addToSet: { admins: newUser._id },
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "User created successfully",
      token,
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Sign in function
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(errorHandler(400, "Please provide email and password"));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "Invalid email or password"));
    }

    const validPassword = await bcrypt.compare(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(404, "Invalid email or password"));
    }

    const token = jwt.sign(
      { id: validUser._id, role: validUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const { password: pass, ...rest } = validUser._doc;
    res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// Google sign-in function
export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      const { password, ...rest } = user._doc;
      return res
        .status(200)
        .cookie("access_token", token, { httpOnly: true })
        .json(rest);
    }

    // If user does not exist, create a new user
    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);
    const surveyUsername = await getNextSurveyUsername();

    const newUser = new User({
      username:
        name.toLowerCase().replace(/\s+/g, "") +
        Math.random().toString(9).slice(-4),
      email,
      password: hashedPassword,
      profilePicture: googlePhotoUrl,
      surveyUsername,
      role: "normalUser", // Default to 'normalUser'
      group: null, // No group assigned by default
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const { password: pass, ...rest } = newUser._doc;
    res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// Check authentication status
export const checkAuth = (req, res, next) => {
  const token = req.cookies?.access_token;
  if (!token) {
    return res.status(401).json({ signedIn: false });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ signedIn: false });
    }
    req.user = user;
    res.json({ signedIn: true });
  });
};
