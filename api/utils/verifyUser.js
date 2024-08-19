import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

// Middleware to verify JWT token
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
};
