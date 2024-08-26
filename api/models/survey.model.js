import mongoose from "mongoose";

const surveySchema = new mongoose.Schema(
  {
    gender: {
      type: String,
      required: true,
    },
    ageGroup: {
      type: String,
      required: true,
    },
    sector: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    education: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    consent: {
      type: Boolean,
      required: true,
    },
    surveyAnswers: {
      type: [Number],
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    surveyUsername: {
      type: String,
      required: true,
    },
    surveyIdentifier: {
      type: String,
      required: true,
      unique: true,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
  },
  { timestamps: true }
);

const Survey = mongoose.model("Survey", surveySchema);

export default Survey;
