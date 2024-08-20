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

<<<<<<< HEAD
// Signup function
export const signup = async (req, res, next) => {
  const { username, email, password, role, groupName, groupDescription } =
    req.body;

  // Basic validation
  if (!username || !email || !password || !role) {
    return next(errorHandler(400, "All fields are required"));
  }
=======
// Sign up function
export const signup = async (req, res) => {
  const {
    username,
    email,
    password,
    role,
    name, // Group name
    description, // Group description
    group,
  } = req.body;
>>>>>>> c99a19b (Creation of Group API, user role and modifying the signup page accordingly)

  if (role === "groupAdmin") {
    if (!groupName || !groupDescription) {
      return next(
        errorHandler(
          400,
          "Group Name and Description are required for Group Admins"
        )
      );
    }
  }

  try {
<<<<<<< HEAD
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(errorHandler(400, "User already exists"));
    }

    // Hash the password
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const surveyUsername = await getNextSurveyUsername();

    // Create the new user
=======
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
>>>>>>> c99a19b (Creation of Group API, user role and modifying the signup page accordingly)
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
<<<<<<< HEAD
      surveyUsername,
      role,
      ...(role === "groupAdmin" && { groupName, groupDescription }),
=======
      role,
      surveyUsername, // Assign surveyUsername
>>>>>>> c99a19b (Creation of Group API, user role and modifying the signup page accordingly)
    });

    let newGroup = null;

    if (role === "Group Admin") {
      // Create the new group
      newGroup = new Group({
        name, // Group name
        description, // Group description
        createdBy: newUser._id,
        admins: [newUser._id], // Add the creator as an admin
      });

      await newGroup.save();

      // Update the newUser with the group information
      newUser.group = newGroup._id;
    } else {
      newUser.group = group || null; // Assign the group ID if provided
    }

    await newUser.save();

<<<<<<< HEAD
    // If the user is a groupAdmin, create the group
    if (role === "groupAdmin") {
      const newGroup = new Group({
        name: groupName,
        description: groupDescription,
        createdBy: newUser._id,
      });

      await newGroup.save();
    }

    // Generate a JWT token
=======
    // If role is 'Group Admin', update the group with admin information
    if (role === "Group Admin") {
      await Group.findByIdAndUpdate(newGroup._id, {
        $addToSet: { admins: newUser._id },
      });
    }

    // Generate token
>>>>>>> c99a19b (Creation of Group API, user role and modifying the signup page accordingly)
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

<<<<<<< HEAD
    res.status(201).cookie("access_token", token, { httpOnly: true }).json({
      success: true,
      message: "Signup Successful. Please sign in using your credentials.",
    });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

// Signin function
=======
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
>>>>>>> c99a19b (Creation of Group API, user role and modifying the signup page accordingly)
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
    next(errorHandler(500, error.message));
  }
};

<<<<<<< HEAD
// Google Signin function
=======
// Google sign-in function
>>>>>>> c99a19b (Creation of Group API, user role and modifying the signup page accordingly)
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
<<<<<<< HEAD
      res
        .status(200)
        .cookie("access_token", token, { httpOnly: true })
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const surveyUsername = await getNextSurveyUsername();
      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
        surveyUsername,
        role: "normalUser",
      });
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      const { password, ...rest } = newUser._doc;
      res
=======
      return res
>>>>>>> c99a19b (Creation of Group API, user role and modifying the signup page accordingly)
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
    next(errorHandler(500, error.message));
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
    res.json({ signedIn: true, user });
  });
};

// Update User function
export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
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
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(
        errorHandler(400, "Username must be between 7 and 20 characters long")
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
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

// Delete User function
export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(
      errorHandler(403, "You are not allowed to delete this account")
    );
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json("User has been deleted");
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

// Signout function
export const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been signed out");
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

// Get Users function (Admin only)
export const getUsers = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(
      errorHandler(403, "You are not allowed to access this resource")
    );
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sortDirection === "asc" ? 1 : -1;

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
    next(errorHandler(500, error.message));
  }
};
