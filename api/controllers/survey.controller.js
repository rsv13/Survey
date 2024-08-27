import Survey from "../models/survey.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import { generateUniqueSurveyIdentifier } from "../utils/surveyIdentifier.js";

// Test route for surveys
export const surveyTest = (req, res, next) => {
  try {
    res.json({ message: "Take the survey" });
  } catch (error) {
    next(error);
  }
};

// Handle survey submission
export const surveyQuestion = async (req, res, next) => {
  const surveyData = req.body;

  // Validate required fields
  if (!surveyData.user) {
    return next(errorHandler(400, "User ID is required"));
  }

  try {
    // Ensure surveyIdentifier is generated uniquely
    const surveyIdentifier = generateUniqueSurveyIdentifier();

    // Retrieve user to get the surveyUsername
    const user = await User.findById(surveyData.user);
    if (!user) {
      return next(errorHandler(400, "User not found."));
    }

    // Create a new survey document
    const newSurvey = new Survey({
      ...surveyData,
      surveyIdentifier,
      surveyUsername: user.surveyUsername, // Add surveyUsername to the survey
    });

    // Save the survey to the database
    await newSurvey.save();

    // Increment the count of surveys submitted by the user
    await User.findByIdAndUpdate(user._id, { $inc: { surveysSubmitted: 1 } });

    res.status(201).json({
      success: true,
      message: "Survey submitted successfully",
      survey: newSurvey,
    });
  } catch (error) {
    console.error("Error saving survey:", error); // Add logging
    next(error);
  }
};

// Fetch surveys with optional filtering based on user role
export const getSurveys = async (req, res, next) => {
  const { userId } = req.query; // Get userId from query parameters if provided
  const { role, id } = req.user; // Destructure user role and id from req.user

  try {
    let query = {};

    if (role === "Admin") {
      // Admin can see all surveys
      query = {};
    } else if (role === "Group Admin") {
      // Group Admin can see surveys of users in their group
      const user = await User.findById(id); // Find the logged-in user
      if (!user) {
        return next(errorHandler(400, "User not found."));
      }

      // Fetch only user IDs to optimize performance
      const groupUserIds = await User.find({ groupId: user.groupId }).select(
        "_id"
      );

      // Check if groupUserIds is empty
      if (groupUserIds.length === 0) {
        return res
          .status(200)
          .json({ surveys: [], totalSurvey: 0, lastMonthSurvey: 0 });
      }

      query.user = { $in: groupUserIds.map((user) => user._id) }; // Filter surveys by users in the same group
    } else if (role === "normalUser") {
      if (!userId) {
        return next(errorHandler(400, "User ID is required for Normal User."));
      }

      // Validate that the userId is the current user's ID
      if (userId !== id) {
        return next(errorHandler(403, "Access denied: Unauthorized user."));
      }

      query.user = userId; // Filter surveys by the provided userId

      console.log("Constructed query for normalUser:", query);
    } else {
      // If role is unrecognized, return an error
      console.log("Unrecognized role:", role); // Log unrecognized role
      return res
        .status(403)
        .json({ error: "Access denied: Unrecognized role." });
    }

    // Retrieve surveys and include surveyUsername
    const surveys = await Survey.find(query).populate("user", "surveyUsername");
    const totalSurvey = await Survey.countDocuments(query);

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthSurvey = await Survey.countDocuments({
      ...query,
      updatedAt: { $gte: oneMonthAgo, $lt: now },
    });

    res.status(200).json({
      surveys,
      totalSurvey,
      lastMonthSurvey,
    });
  } catch (error) {
    console.error("Error in getSurveys:", error.message);
    next(error);
  }
};
