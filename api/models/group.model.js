import mongoose from "mongoose";

<<<<<<< HEAD
const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensure group names are unique
  },
  description: {
    type: String,
    default: "", // Optional description for each group
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // Reference to the user (GroupAdmin) who created the group
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure that each group name is unique for each GroupAdmin
groupSchema.index({ name: 1, createdBy: 1 }, { unique: true });

export default mongoose.model("Group", groupSchema);
=======
const groupSchema = new mongoose.Schema(
  {
    name: {
      // Adjusted to be consistent
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Group = mongoose.model("Group", groupSchema);

export default Group;
>>>>>>> c99a19b (Creation of Group API, user role and modifying the signup page accordingly)
