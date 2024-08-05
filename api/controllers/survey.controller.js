import Survey from "../models/survey.model.js";
import User from "../models/user.model.js"; // Import the User model
import { generateUniqueSurveyIdentifier } from "../utils/surveyIdentifier.js"; // Import the function

export const surveyTest = (req, res) => {
  res.json({ message: "Take the survey" });
};

export const surveyQuestion = async (req, res) => {
  try {
    const surveyData = req.body;

    // Ensure surveyIdentifier is generated uniquely
    const surveyIdentifier = generateUniqueSurveyIdentifier();

    // Create a new survey document
    const newSurvey = new Survey({
      ...surveyData,
      surveyIdentifier,
    });

    // Save the survey to the database
    await newSurvey.save();

    // Update the user record if user ID is provided
    const userId = req.body.user;

    if (userId) {
      // Check if the user exists before updating
      const user = await User.findById(userId);
      if (user) {
        await User.findByIdAndUpdate(userId, { $inc: { surveysSubmitted: 1 } });
      } else {
        return res.status(400).json({ message: "User not found." });
      }
    }

    res.status(201).json(newSurvey);
  } catch (error) {
    console.error("Survey submission error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getSurveys = async (req, res, next) => {
  try {
    const surveys = await Survey.find({}); // Retrieve all surveys

    const totalSurvey = await Survey.countDocuments(); // Count total surveys
    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthSurvey = await Survey.countDocuments({
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
