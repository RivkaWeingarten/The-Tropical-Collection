import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
//protect routes
// const protect = asyncHandler(async (req, res, next) => {
//   let token;

//   // Read JWT from cookie
//   token = req.cookies.jwt;

//   if (token) {
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       console.log(`Decoded Token: ${JSON.stringify(decoded)}`);
//       req.user = await User.findById(decoded.userId); // Assuming you want to exclude the password
//       next();
//     } catch (error) {
//       console.log(error);
//       res.status(401);
//       throw new Error("Not authorized, token failed");
//     }
//   } else {
//     res.status(401);
//     throw new Error("Not authorized, no token");
//   }
// });


const protect = asyncHandler(async (req, res, next) => {
    try {
      await ClerkExpressRequireAuth()(req, res, next);
  
      // Accessing authenticated user information from Clerk
      const clerkUser = req.auth;
  
      // Assuming you have a User model and want to find it in your database
      req.user = await User.findOne({ clerkId: clerkUser.id }).select;
  
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  });

//admin middleware

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error(`not authorized as Admin `);
  }
};

export { protect, admin };
