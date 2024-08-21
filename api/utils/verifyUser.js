import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

// Middleware to verify token and attach user to req
export const verifyToken = (req, res, next) => {
  const token = req.cookies?.access_token;
  if (!token) {
    return next(errorHandler(401, "Unauthorized"));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(401, "Unauthorized"));
    }
    req.user = user;
    next();
  });
};

// Middleware to check if the user is an Admin
export const isAdmin = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};

// Middleware to check if the user is a Group Admin
export const isGroupAdmin = (req, res, next) => {
  if (req.user.role !== "Group Admin" && req.user.role !== "Admin") {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};

// Middleware to check if the user is a Normal User
export const isNormalUser = (req, res, next) => {
  if (req.user.role !== "normalUser") {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};
