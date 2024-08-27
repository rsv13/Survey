import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Counter from "../models/counter.model.js";
import Group from "../models/group.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import { generateInviteCode } from "../utils/inviteCode.js";

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

// Sign up function
export const signup = async (req, res) => {
  const {
    username,
    email,
    password,
    role,
    inviteCode,
    groupName,
    groupDescription,
  } = req.body;

  try {
    if (role === "normalUser") {
      if (!username || !email || !password || !inviteCode) {
        console.error("Signup error: Missing fields for normalUser");
        return res.status(400).json({
          message: "Please fill out all fields, including the invite code.",
        });
      }

      const group = await Group.findOne({ inviteCode });
      if (!group) {
        console.error("Signup error: Invalid invite code");
        return res.status(400).json({ message: "Invalid invite code" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const surveyUsername = await getNextSurveyUsername(); // Generate surveyUsername

      const user = new User({
        username,
        email,
        password: hashedPassword,
        role,
        surveyUsername, 
        groupId: group._id,
      });

      await user.save();
      group.members.push(user._id);
      await group.save();

      return res
        .status(201)
        .json({ message: "User created and added to group successfully" });
    }

    if (role === "Group Admin") {
      if (!username || !email || !password || !groupName || !groupDescription) {
        console.error("Signup error: Missing fields for Group Admin");
        return res.status(400).json({ message: "Please fill out all fields." });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const surveyUsername = await getNextSurveyUsername(); // Generate surveyUsername

      const user = new User({
        username,
        email,
        password: hashedPassword,
        role,
        surveyUsername, // Include surveyUsername
      });

      await user.save();

      const newGroup = new Group({
        name: groupName,
        description: groupDescription,
        createdBy: user._id,
        admins: [user._id],
        members: [],
        inviteCode: generateInviteCode(),
      });

      await newGroup.save();

      return res.status(201).json({
        message: "Group created and Group Admin user added successfully",
      });
    }
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "An internal server error occurred" });
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
      groupId: null, // No group assigned by default
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
