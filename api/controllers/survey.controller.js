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

  // Ensure surveyIdentifier is generated uniquely
  const surveyIdentifier = generateUniqueSurveyIdentifier();

  // Create a new survey document
  const newSurvey = new Survey({
    ...surveyData,
    surveyIdentifier,
  });

  try {
    // Save the survey to the database
    await newSurvey.save();

    // Update the user record if user ID is provided
    const userId = surveyData.user;
    if (userId) {
      // Check if the user exists before updating
      const user = await User.findById(userId);
      if (user) {
        // Increment the count of surveys submitted by the user
        await User.findByIdAndUpdate(userId, { $inc: { surveysSubmitted: 1 } });
      } else {
        return next(errorHandler(400, "User not found."));
      }
    }

    res.status(201).json(newSurvey);
  } catch (error) {
    next(error);
  }
};

// Fetch surveys with optional filtering
export const getSurveys = async (req, res, next) => {
  const { userId } = req.query; // Get userId from query parameters if provided

  try {
    const query = userId ? { user: userId } : {}; // Filter by userId if provided

    const surveys = await Survey.find(query); // Retrieve surveys based on query

    const totalSurvey = await Survey.countDocuments(query); // Count total surveys based on query

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
    next(error);
  }
};
