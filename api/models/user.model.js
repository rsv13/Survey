import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
    role: {
      type: String,
      enum: ["normalUser", "groupAdmin", "admin"], // Enum to restrict values
      default: "normalUser", // Default role if not specified
    },
    surveysSubmitted: {
      type: Number,
      default: 0,
    },
    surveyUsername: {
      type: String,
      required: true,
      unique: true,
    },
    groupName: {
      type: String,
    },
    groupDescription: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
