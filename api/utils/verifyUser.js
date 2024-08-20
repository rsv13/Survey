import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

<<<<<<< HEAD
// Middleware to verify JWT token
=======
// Middleware to verify token and attach user to req
>>>>>>> c99a19b (Creation of Group API, user role and modifying the signup page accordingly)
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

<<<<<<< HEAD
// Middleware to verify Admin role
export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "admin") {
      next();
    } else {
      return next(errorHandler(403, "Forbidden: Admins only"));
    }
  });
};

// Middleware to verify GroupAdmin role
export const verifyGroupAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "groupAdmin" || req.user.role === "admin") {
      next();
    } else {
      return next(errorHandler(403, "Forbidden: GroupAdmins only"));
    }
  });
};

// Middleware to verify User role
export const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "user") {
      next();
    } else {
      return next(errorHandler(403, "Forbidden: Users only"));
    }
  });
=======
// Middleware to check if the user is an Admin
export const isAdmin = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};

// Middleware to check if the user is a Group Admin
export const isGroupAdmin = (req, res, next) => {
  if (req.user.role !== "Group Admin") {
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
>>>>>>> c99a19b (Creation of Group API, user role and modifying the signup page accordingly)
};
