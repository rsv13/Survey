import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.route.js";
import groupRoutes from "./routes/group.route.js"; // Import group routes
import surveyRoutes from "./routes/survey.route.js";
import userRoutes from "./routes/user.route.js";
import groupRoutes from "./routes/group.route.js"; // Import group routes

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// MongoDB connection
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

// Define routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/survey", surveyRoutes);
<<<<<<< HEAD
app.use("/api/groups", groupRoutes); // Add group routes
=======
app.use("/api/group", groupRoutes);
>>>>>>> c99a19b (Creation of Group API, user role and modifying the signup page accordingly)

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message;
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Start server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
