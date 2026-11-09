
import express from "express";

import {
    login,
    logout,
    register,
    updateProfile
} from "../controllers/user.controller.js";

import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

// Public routes
router.route("/register").post(singleUpload, register);
router.route("/login").post(login);

// Logout
router.route("/logout").post(logout);

// Authenticated routes
router.route("/profile/update").post(
    isAuthenticated,
    singleUpload,
    updateProfile
);

export default router;
